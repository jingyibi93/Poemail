// Global Preloader for Typewriter Audio to eliminate start delay
// Preloads and decodes antique typewriter sound effects using Web Audio API in the background.

import { getSharedAudioContext } from './mobileAudio';

export interface TypewriterAudioBuffers {
  key: AudioBuffer | null;
  space: AudioBuffer | null;
  bell: AudioBuffer | null;
  ret: AudioBuffer | null;
}

let preloadedBuffers: TypewriterAudioBuffers = {
  key: null,
  space: null,
  bell: null,
  ret: null,
};

let isPreloading = false;
let isLoaded = false;
let loadPromise: Promise<TypewriterAudioBuffers> | null = null;

// Get assets safely on absolute URL paths
const getAssetUrl = (relativePath: string) => {
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  const origin = window.location.origin;
  const cleanPath = relativePath.startsWith('/') ? relativePath : '/' + relativePath;
  return `${origin}${cleanPath}`;
};

// Scan the binary data to find first waveform sample above threshold to completely trim silent start
export const findWavefrontOffset = (buffer: AudioBuffer, threshold = 0.005): number => {
  try {
    const data = buffer.getChannelData(0);
    const len = data.length;
    // Scan first 150ms of audio
    const maxScanSamples = Math.min(len, Math.floor(buffer.sampleRate * 0.15));
    for (let i = 0; i < maxScanSamples; i++) {
      if (Math.abs(data[i]) > threshold) {
        // Return time offset, with a 1.5ms safety cushion to avoid cropping transient click start
        return Math.max(0, (i / buffer.sampleRate) - 0.0015);
      }
    }
  } catch (e) {
    console.warn('Scan wavefront error:', e);
  }
  return 0;
};

export const createSlice = (
  buffer: AudioBuffer,
  ctx: AudioContext,
  startSec: number,
  durationSec: number
): AudioBuffer => {
  const sampleRate = buffer.sampleRate;
  const startSample = Math.floor(startSec * sampleRate);
  const endSample = Math.min(buffer.length, Math.floor((startSec + durationSec) * sampleRate));
  const sliceLen = Math.max(1, endSample - startSample);
  
  const sliceBuffer = ctx.createBuffer(
    buffer.numberOfChannels,
    sliceLen,
    sampleRate
  );
  
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const mainData = buffer.getChannelData(ch);
    const sliceData = sliceBuffer.getChannelData(ch);
    for (let i = 0; i < sliceLen; i++) {
      sliceData[i] = mainData[startSample + i] || 0;
    }
  }
  return sliceBuffer;
};

export const segmentTypewriterSounds = (
  buffer: AudioBuffer,
  ctx: AudioContext
): { key: AudioBuffer; space: AudioBuffer; bell: AudioBuffer; ret: AudioBuffer } => {
  const duration = buffer.duration;
  console.log(`[Typewriter Audio Segmenter] Analyzing master file. Total duration: ${duration.toFixed(2)}s, sampleRate: ${buffer.sampleRate}`);

  const data = buffer.getChannelData(0);
  const sampleRate = buffer.sampleRate;
  
  // Calculate rolling amplitude envelopes over 10ms bins
  const binSize = Math.floor(sampleRate * 0.01); // 10ms
  const envelopes: { time: number; amp: number }[] = [];
  
  for (let i = 0; i < data.length; i += binSize) {
    let maxVal = 0;
    const count = Math.min(binSize, data.length - i);
    for (let j = 0; j < count; j++) {
      const val = Math.abs(data[i + j]);
      if (val > maxVal) maxVal = val;
    }
    envelopes.push({ time: i / sampleRate, amp: maxVal });
  }

  // Find local transient peaks (onsets) using an adaptive envelope peak follower.
  // This prevents multiple fake "Ding" or "Return" peaks during the decaying tails of loud sounds.
  const peaks: { time: number; amp: number }[] = [];
  const baseThreshold = 0.04; // Baseline noise floor
  const minSpacing = 0.14; // Minimum spacing between typewriter onsets
  let adaptiveThreshold = baseThreshold;
  
  for (let i = 1; i < envelopes.length - 1; i++) {
    const prev = envelopes[i - 1].amp;
    const curr = envelopes[i].amp;
    const next = envelopes[i + 1].amp;
    const time = envelopes[i].time;
    
    // Decay adaptive threshold back towards the base threshold (decay factor of 0.95 per 10ms step)
    adaptiveThreshold = Math.max(baseThreshold, adaptiveThreshold * 0.95);
    
    if (curr > adaptiveThreshold && curr >= prev && curr >= next) {
      if (peaks.length === 0 || (time - peaks[peaks.length - 1].time) >= minSpacing) {
        peaks.push({ time, amp: curr });
        // Lock out subsequent smaller rings/reverb tails immediately after a prominent strike
        adaptiveThreshold = Math.max(adaptiveThreshold, curr * 0.55);
      }
    }
  }

  console.log(`[Typewriter Audio Segmenter] Found ${peaks.length} dynamic audio onsets:`, peaks.map(p => `${p.time.toFixed(2)}s`));

  let keySlices: AudioBuffer[] = [];
  let spaceSlices: AudioBuffer[] = [];
  let bellBuffer: AudioBuffer | null = null;
  let returnBuffer: AudioBuffer | null = null;

  if (peaks.length >= 3) {
    // The last peak is the crystal clear bell DING!
    const bellPeak = peaks[peaks.length - 1];
    const retPeak = peaks[peaks.length - 2];
    
    const bellStart = Math.max(0, bellPeak.time - 0.01);
    const bellLen = Math.min(1.8, duration - bellStart);
    bellBuffer = createSlice(buffer, ctx, bellStart, bellLen);
    
    const retStart = Math.max(0, retPeak.time - 0.015);
    const retLen = Math.min(1.4, bellStart - retStart, duration - retStart);
    returnBuffer = createSlice(buffer, ctx, retStart, retLen);
    
    // Remaining peaks are keyclack clicks
    const keyOnsetsCount = peaks.length - 2;
    for (let i = 0; i < keyOnsetsCount; i++) {
      const peak = peaks[i];
      const nextTime = peaks[i + 1].time;
      const keyStart = Math.max(0, peak.time - 0.005);
      const keyLen = Math.min(0.25, nextTime - keyStart, duration - keyStart);
      const kBuf = createSlice(buffer, ctx, keyStart, keyLen);
      
      if (i % 2 === 0) {
        keySlices.push(kBuf);
      } else {
        spaceSlices.push(kBuf);
      }
    }
  } else if (peaks.length === 2) {
    const keyStart = Math.max(0, peaks[0].time - 0.005);
    const keyLen = Math.min(0.25, peaks[1].time - keyStart);
    const kBuf = createSlice(buffer, ctx, keyStart, keyLen);
    keySlices.push(kBuf);
    spaceSlices.push(kBuf);
    
    const bellStart = Math.max(0, peaks[1].time - 0.01);
    bellBuffer = createSlice(buffer, ctx, bellStart, Math.min(1.8, duration - bellStart));
    returnBuffer = kBuf;
  } else if (peaks.length === 1) {
    const pStart = Math.max(0, peaks[0].time - 0.005);
    const singleBuf = createSlice(buffer, ctx, pStart, Math.min(1.8, duration - pStart));
    keySlices.push(singleBuf);
    spaceSlices.push(singleBuf);
    returnBuffer = singleBuf;
    bellBuffer = singleBuf;
  } else {
    // If no clear onsets found (flat file or short ring), split using automatic time-percentage grids
    console.log(`[Typewriter Audio Segmenter] No peaks detected in file. Slicing with safe time grid...`);
    const clickLen = Math.min(0.22, duration / 4);
    for (let i = 0; i < 3; i++) {
      const kBuf = createSlice(buffer, ctx, i * clickLen, clickLen);
      keySlices.push(kBuf);
    }
    spaceSlices = keySlices;
    
    const bellStart = Math.max(0, duration * 0.7);
    bellBuffer = createSlice(buffer, ctx, bellStart, duration - bellStart);
    
    const retStart = Math.max(0, duration * 0.35);
    returnBuffer = createSlice(buffer, ctx, retStart, Math.min(1.2, bellStart - retStart));
  }

  const finalKey = keySlices[0] || buffer;
  const finalSpace = spaceSlices[0] || finalKey;
  const finalBell = bellBuffer || buffer;
  const finalRet = returnBuffer || finalKey;

  // Save slice pools for randomized physical typewriter strikes
  (window as any).__typewriterKeySlices = keySlices.length > 0 ? keySlices : [finalKey];
  (window as any).__typewriterSpaceSlices = spaceSlices.length > 0 ? spaceSlices : [finalSpace];

  return {
    key: finalKey,
    space: finalSpace,
    bell: finalBell,
    ret: finalRet
  };
};

export const startPreloadingAudio = (): Promise<TypewriterAudioBuffers> => {
  if (loadPromise) return loadPromise;
  
  loadPromise = new Promise<TypewriterAudioBuffers>(async (resolve) => {
    if (isLoaded) {
      resolve(preloadedBuffers);
      return;
    }
    
    isPreloading = true;
    try {
      const ctx = getSharedAudioContext();
      if (!ctx) {
        resolve(preloadedBuffers);
        return;
      }
 
      const loadAndDecode = async (relativePath: string): Promise<AudioBuffer | null> => {
        const urlsToTry = [
          getAssetUrl(relativePath),
          `https://cdn.jsdelivr.net/gh/mushfiq/typewriter@master/public/${relativePath}`,
          `https://raw.githubusercontent.com/mushfiq/typewriter/master/public/${relativePath}`
        ];

        for (const url of urlsToTry) {
          try {
            console.log(`Typewriter preloader trying to fetch asset from: ${url}`);
            const response = await fetch(url);
            if (!response.ok) continue;
            
            const arrayBuffer = await response.arrayBuffer();
            if (arrayBuffer.byteLength < 100) continue;
            
            // Verify that we didn't fetch a html 404 skeleton or text template
            const uint8 = new Uint8Array(arrayBuffer);
            let textSnippet = '';
            for (let i = 0; i < Math.min(uint8.length, 100); i++) {
              textSnippet += String.fromCharCode(uint8[i]);
            }
            if (
              textSnippet.includes('<!DOCTYPE') || 
              textSnippet.includes('<html') || 
              textSnippet.includes('version https://git-lfs') ||
              textSnippet.includes('<svg') ||
              textSnippet.includes('{') || 
              textSnippet.trim().startsWith('<')
            ) {
              console.warn(`Typewriter preloader skipped landing page or LFS text header: ${url}`);
              continue;
            }

            const decoded = await new Promise<AudioBuffer | null>((res) => {
              try {
                const p = ctx.decodeAudioData(
                  arrayBuffer,
                  (decodedBuf) => res(decodedBuf),
                  () => res(null)
                );
                if (p && typeof p.catch === 'function') {
                  p.catch((err) => {
                    console.warn(`Decode catch warning for ${url}: `, err);
                    res(null);
                  });
                }
              } catch (err) {
                console.warn(`Decode try-catch warning for ${url}: `, err);
                res(null);
              }
            });

            if (decoded) {
              console.log(`Successfully loaded and decoded typewriter sound: ${relativePath} from ${url}`);
              return decoded;
            }
          } catch (err) {
            console.warn(`Failed to retrieve/decode typewriter sound from ${url}:`, err);
          }
        }
        return null;
      };

      // 1. First, attempt to load the user's custom, newly dropped high-quality master file!
      console.log(`Typewriter Preloader: Attempting to fetch master file 'sounds/the-machine-prints-sound-by-sound.wav'`);
      const masterBuffer = await loadAndDecode('sounds/the-machine-prints-sound-by-sound.wav');

      if (masterBuffer) {
        // Excellent! The user's uploaded master file decoded successfully.
        // Let's segment it into key, space, bell, and ret buffers.
        const segments = segmentTypewriterSounds(masterBuffer, ctx);
        preloadedBuffers = segments;
        console.log('[Typewriter Audio Preloader] Successfully segmented the user-uploaded audio file!');
      } else {
        // Fallback: load classical individual wav files from CDN if master file failed or didn't load
        console.log(`[Typewriter Audio Preloader] Master file not parsed yet. Loading separate individual sound buffers as a fail-safe...`);
        const [keyBuf, spaceBuf, bellBuf, returnBuf] = await Promise.all([
          loadAndDecode('sounds/key.wav'),
          loadAndDecode('sounds/space.wav'),
          loadAndDecode('sounds/bell.wav'),
          loadAndDecode('sounds/return.wav'),
        ]);

        preloadedBuffers = {
          key: keyBuf,
          space: spaceBuf,
          bell: bellBuf,
          ret: returnBuf,
        };
      }

      (window as any).__globalAudioBuffers = preloadedBuffers;
      isLoaded = true;
      isPreloading = false;
      resolve(preloadedBuffers);
    } catch (e) {
      console.warn('Global typewriter audio preloading error:', e);
      isPreloading = false;
      resolve(preloadedBuffers);
    }
  });

  return loadPromise;
};

export const getPreloadedAudioBuffers = (): TypewriterAudioBuffers => {
  return (window as any).__globalAudioBuffers || preloadedBuffers;
};
