import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { startPreloadingAudio, findWavefrontOffset } from '../utils/audioPreloader';

interface TypewriterMachineProps {
  poemText: string;
  onComplete: () => void;
  triggerResetId: number;
}

export default function TypewriterMachine({
  poemText,
  onComplete,
  triggerResetId,
}: TypewriterMachineProps) {
  // We type character-by-character.
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  
  // Kinetic bounce wave state on keystrokes
  const [keyWaves, setKeyWaves] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const waveIdRef = useRef(0);

  // State to track if authentic audio is preloaded
  const [audioReady, setAudioReady] = useState(false);

  // Audio typewriter sound generator using Web Audio API
  const audioCtxRef = useRef<AudioContext | null>(null);
  const keyBufferRef = useRef<AudioBuffer | null>(null);
  const spaceBufferRef = useRef<AudioBuffer | null>(null);
  const bellBufferRef = useRef<AudioBuffer | null>(null);
  const returnBufferRef = useRef<AudioBuffer | null>(null);

  // Guaranteed high-fidelity HTML5 Audio preloaded pools for all sound events
  const keyAudioPoolRef = useRef<HTMLAudioElement[]>([]);
  const keyPoolIndexRef = useRef(0);
  const spaceAudioPoolRef = useRef<HTMLAudioElement[]>([]);
  const spacePoolIndexRef = useRef(0);
  const returnAudioPoolRef = useRef<HTMLAudioElement[]>([]);
  const returnPoolIndexRef = useRef(0);
  const bellAudioPoolRef = useRef<HTMLAudioElement[]>([]);
  const bellPoolIndexRef = useRef(0);

  // Absolute fallback path helper for sandboxed iframe relative asset location
  const getAssetUrl = (relativePath: string) => {
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }
    // Prefer uncorrupted CDN assets for typewriter sound files to bypass local disk WAV corruption
    const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
    if (cleanPath.startsWith('sounds/')) {
      return `https://cdn.jsdelivr.net/gh/mushfiq/typewriter@master/public/${cleanPath}`;
    }
    const origin = window.location.origin;
    return `${origin}/${cleanPath}`;
  };

  // Preload authentic typewriter sound files
  useEffect(() => {
    let isMounted = true;

    // Initialize rotating HTML5 Audio pools for standard clacks, spaces, carriage returns, and bells
    const keyPoolSize = 14;
    const keyPool: HTMLAudioElement[] = [];
    for (let i = 0; i < keyPoolSize; i++) {
      const audio = new Audio(getAssetUrl('sounds/key.wav'));
      audio.preload = 'auto';
      audio.volume = 1.0;
      keyPool.push(audio);
    }
    keyAudioPoolRef.current = keyPool;

    const spacePoolSize = 6;
    const spacePool: HTMLAudioElement[] = [];
    for (let i = 0; i < spacePoolSize; i++) {
      const audio = new Audio(getAssetUrl('sounds/space.wav'));
      audio.preload = 'auto';
      audio.volume = 1.0;
      spacePool.push(audio);
    }
    spaceAudioPoolRef.current = spacePool;

    const returnPoolSize = 3;
    const returnPool: HTMLAudioElement[] = [];
    for (let i = 0; i < returnPoolSize; i++) {
      const audio = new Audio(getAssetUrl('sounds/return.wav'));
      audio.preload = 'auto';
      audio.volume = 1.0;
      returnPool.push(audio);
    }
    returnAudioPoolRef.current = returnPool;

    const bellPoolSize = 3;
    const bellPool: HTMLAudioElement[] = [];
    for (let i = 0; i < bellPoolSize; i++) {
      const audio = new Audio(getAssetUrl('sounds/bell.wav'));
      audio.preload = 'auto';
      audio.volume = 1.0;
      bellPool.push(audio);
    }
    bellAudioPoolRef.current = bellPool;

    const initAudio = async () => {
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass && !(window as any).__globalAudioCtx) {
          (window as any).__globalAudioCtx = new AudioCtxClass();
        }
        audioCtxRef.current = (window as any).__globalAudioCtx;

        // Instantly get or initiate async preloader on mount
        const buffers = await startPreloadingAudio();
        
        keyBufferRef.current = buffers.key;
        spaceBufferRef.current = buffers.space;
        bellBufferRef.current = buffers.bell;
        returnBufferRef.current = buffers.ret;


        if (isMounted) {
          setAudioReady(true);
        }
      } catch (e) {
        console.warn('Typewriter initialization failed fallback:', e);
        if (isMounted) {
          setAudioReady(true);
        }
      }
    };

    initAudio();

    // Safety fallback: force starting if loading takes too long so users don't wait indefinitely
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setAudioReady(true);
      }
    }, 1200);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  // Physically modeled high-fidelity mechanical typewriter click/clack synthesis fallback
  const playProceduralSound = (isSpaceOrReturn: boolean) => {
    try {
      const ctx = (window as any).__globalAudioCtx || audioCtxRef.current;
      if (!ctx) return;
      
      const now = ctx.currentTime;
      
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // --- PHASE 1: Impact Hammer Strike (Deep noise burst) ---
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.045, ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = Math.random() * 2 - 1;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(isSpaceOrReturn ? 1200 : 2600, now);
      noiseFilter.Q.setValueAtTime(8, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(isSpaceOrReturn ? 0.35 : 0.65, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseSource.start(now);

      // --- PHASE 2: Metal Typebar Strike Hammer Click (snappy metal chirp) ---
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isSpaceOrReturn ? 280 : 640, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.025);

      oscGain.gain.setValueAtTime(isSpaceOrReturn ? 0.28 : 0.5, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.start(now);
      osc.stop(now + 0.03);

      // --- PHASE 3: Chassis hollow body resonance ---
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      bodyOsc.connect(bodyGain);
      bodyGain.connect(ctx.destination);

      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(135, now);
      bodyGain.gain.setValueAtTime(isSpaceOrReturn ? 0.22 : 0.16, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      bodyOsc.start(now);
      bodyOsc.stop(now + 0.06);
    } catch {}
  };

  const playTypewriterSound = (char: string) => {
    try {
      const ctx = (window as any).__globalAudioCtx || audioCtxRef.current;
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      let buffer: AudioBuffer | null = null;
      if (char === '\n') {
        buffer = returnBufferRef.current || keyBufferRef.current;
      } else if (char === ' ') {
        const spaceSlices = (window as any).__typewriterSpaceSlices;
        if (spaceSlices && spaceSlices.length > 0) {
          buffer = spaceSlices[Math.floor(Math.random() * spaceSlices.length)];
        } else {
          buffer = spaceBufferRef.current || keyBufferRef.current;
        }
      } else {
        const keySlices = (window as any).__typewriterKeySlices;
        if (keySlices && keySlices.length > 0) {
          buffer = keySlices[Math.floor(Math.random() * keySlices.length)];
        } else {
          buffer = keyBufferRef.current;
        }
      }

      // If Web Audio API is available and buffer has successfully loaded, play it via Web Audio
      if (ctx && buffer) {
        const now = ctx.currentTime;
        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const gainNode = ctx.createGain();
        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        if (char === '\n') {
          source.playbackRate.setValueAtTime(1.0, now);
          gainNode.gain.setValueAtTime(2.2, now); // Strong majestic mechanical carriage return
        } else if (char === ' ') {
          source.playbackRate.setValueAtTime(1.0, now);
          gainNode.gain.setValueAtTime(1.8, now); // Space bar deep mechanical impact
        } else {
          // Add a subtle random pitch play to make clacks sound highly physical, organic, and authentic
          const pitchVariation = 0.95 + Math.random() * 0.1; // 0.95 to 1.05
          source.playbackRate.setValueAtTime(pitchVariation, now);
          gainNode.gain.setValueAtTime(2.8, now); // High-impact character strike clack!
        }
        
        // Use precision scan wavefront offset to play immediately from the transient start of the sound
        const offset = findWavefrontOffset(buffer, 0.005);
        source.start(now, offset);
      } else {
        // Fallback to physically modeled mechanical typewriter clack synthesizer
        const isSpaceOrReturn = char === ' ' || char === '\n';
        playProceduralSound(isSpaceOrReturn);
      }
    } catch (err) {
      console.warn('Audio playback fallback error:', err);
    }
  };

  const playDingSound = () => {
    try {
      const ctx = (window as any).__globalAudioCtx || audioCtxRef.current;
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      if (ctx && bellBufferRef.current) {
        const source = ctx.createBufferSource();
        source.buffer = bellBufferRef.current;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(3.2, ctx.currentTime); // Bold high-fidelity antique bell ring DING!
        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        source.start(0);
      } else {
        // High-fidelity physical modeling of an antique brass copper bell "DINGGG!" fallback
        if (ctx) {
          const now = ctx.currentTime;
          const frequencies = [1320, 1650, 1980, 2640, 3300];
          const gains = [0.45, 0.28, 0.22, 0.15, 0.08];
          const decays = [1.5, 1.1, 0.8, 0.5, 0.3];

          frequencies.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gNode = ctx.createGain();
            
            osc.connect(gNode);
            gNode.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.linearRampToValueAtTime(freq + (idx % 2 === 0 ? 4 : -4), now + decays[idx]);

            gNode.gain.setValueAtTime(gains[idx], now);
            gNode.gain.exponentialRampToValueAtTime(0.001, now + decays[idx]);
            
            osc.start(now);
            osc.stop(now + decays[idx] + 0.1);
          });

          const strike = ctx.createOscillator();
          const strikeGain = ctx.createGain();
          strike.connect(strikeGain);
          strikeGain.connect(ctx.destination);
          strike.type = 'triangle';
          strike.frequency.setValueAtTime(900, now);
          strike.frequency.exponentialRampToValueAtTime(120, now + 0.04);
          strikeGain.gain.setValueAtTime(0.25, now);
          strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          strike.start(now);
          strike.stop(now + 0.05);
        }
      }
    } catch {}
  };

  // Reset typewriter when poem changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsDone(false);
  }, [poemText, triggerResetId]);

  // Typing completion transition timer
  useEffect(() => {
    if (isDone) {
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 1400);
      return () => clearTimeout(finishTimer);
    }
  }, [isDone, onComplete]);

  // Typing timer
  useEffect(() => {
    if (!audioReady) {
      return; // Do not start typing until the authentic sounds have preloaded or timed out
    }

    if (currentIndex >= poemText.length) {
      if (!isDone) {
        setIsDone(true);
        playDingSound();
        // Clear active key
        setActiveKey(null);
      }
      return;
    }

    // Process character visually and audibly IMMEDIATELY
    const char = poemText[currentIndex];

    // Sound and keyboard bounce simulation
    let keyName = char.toUpperCase();
    if (char === ' ') {
      keyName = 'SPACE';
    } else if (char === '\n') {
      keyName = 'RET';
    }
    setActiveKey(keyName);

    // Commit character visual display and run authentic audio instantly in the same tick!
    setDisplayedText(poemText.substring(0, currentIndex + 1));
    playTypewriterSound(char);

    // Typing delay speed: lower for punctuation/lines, faster for standard letters
    let delay = 140;
    if (char === '\n') {
      delay = 1100; // Pause nicely to let carriage return slide sound (1100ms) finish playing out!
    } else if (['.', ',', '?', '!'].includes(char)) {
      delay = 480; // Natural dramatic pauses on grammar
    }

    // Schedule the transition to the NEXT character after the delay
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, poemText, isDone, audioReady]);

  // Handle instant tap-to-skip typing
  const handleSkipTyping = () => {
    if (isDone) return;
    setIsDone(true);
    setDisplayedText(poemText);
    setCurrentIndex(poemText.length);
    setActiveKey(null);
    playDingSound();
  };

  // Retro typewriter layout matching standard 4-row keyboard set reference
  const row1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'];
  const row2 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const row3 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'];
  const row4 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'];

  const isKeyActive = (keyStr: string) => {
    if (!activeKey) return false;
    const cleanActive = activeKey.toUpperCase();
    if (cleanActive === keyStr.toUpperCase()) return true;
    
    // Check fallback characters
    if (keyStr === '1' && cleanActive === '!') return true;
    if (keyStr === '2' && cleanActive === '@') return true;
    if (keyStr === '3' && cleanActive === '#') return true;
    if (keyStr === '4' && cleanActive === '$') return true;
    if (keyStr === '5' && cleanActive === '%') return true;
    if (keyStr === '6' && cleanActive === '^') return true;
    if (keyStr === '7' && cleanActive === '&') return true;
    if (keyStr === '8' && cleanActive === '*') return true;
    if (keyStr === '9' && cleanActive === '(') return true;
    if (keyStr === '0' && cleanActive === ')') return true;
    if (keyStr === '-' && cleanActive === '_') return true;
    if (keyStr === ';' && cleanActive === ':') return true;
    if (keyStr === ',' && cleanActive === '<') return true;
    if (keyStr === '.' && cleanActive === '>') return true;
    if (keyStr === '/' && cleanActive === '?') return true;
    
    return false;
  };

  const handleTouchTypewriter = () => {
    try {
      const ctx = (window as any).__globalAudioCtx || audioCtxRef.current;
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch (e) {}
  };

  // Dynamic font sizing for long poems to avoid paper overflow
  const getFontSizeStyle = () => {
    const lines = poemText.split('\n');
    const lineCount = lines.length;
    const maxLineLength = Math.max(...lines.map(l => l.length), 0);
    const totalLen = poemText.length;

    if (lineCount > 6 || totalLen > 150 || maxLineLength > 32) {
      return {
        fontSizeClass: 'text-[11px] sm:text-[12px]',
        leadingClass: 'leading-[1.35]',
        trackingClass: 'tracking-normal',
        pyClass: 'py-0.5'
      };
    } else if (lineCount > 4 || totalLen > 100 || maxLineLength > 24) {
      return {
        fontSizeClass: 'text-[12.5px] sm:text-[13.5px]',
        leadingClass: 'leading-[1.45]',
        trackingClass: 'tracking-wide',
        pyClass: 'py-1'
      };
    }
    return {
      fontSizeClass: 'text-sm sm:text-base',
      leadingClass: 'leading-relaxed',
      trackingClass: 'tracking-wider',
      pyClass: 'py-2'
    };
  };

  const fontStyle = getFontSizeStyle();

  return (
    <div 
      onClick={handleTouchTypewriter}
      className="w-full flex-1 flex flex-col justify-between items-center bg-white relative overflow-hidden select-none"
    >
      
      {/* 1. Paper emerging out from Carrier spool */}
      <div 
        className="flex-1 w-full max-w-[310px] flex flex-col justify-end items-center relative"
        style={{ minHeight: '220px' }}
      >
        {/* The sheet of white paper emerging */}
        <motion.div
          animate={{
            // Paper scrolls upwards as more typing flows in
            y: Math.max(0, -Math.floor(currentIndex / 12) * 5),
            height: 180 + Math.min(100, Math.floor(currentIndex / 6) * 4)
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-[90%] pt-9 px-4 pb-4.5 flex flex-col justify-start relative z-10 text-left overflow-hidden"
        >
          {/* Handdrawn vector background matching the user's exact hand-drawn blue outline (sagging top) */}
          <div className="absolute inset-0 pointer-events-none overflow-visible z-[-1]">
            {/* Real shadow */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M 5,12 C 28,18 45,18 62,14 C 78,11 92,7 95,10 C 94,36 96,65 95,94 C 65,92 35,96 5,93 C 6,65 4,36 5,12 Z" 
                fill="#ebebeb" 
                style={{ transform: 'translate(4px, 4px)' }} 
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {/* Border & Canvas Fill */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M 5,12 C 28,18 45,18 62,14 C 78,11 92,7 95,10 C 94,36 96,65 95,94 C 65,92 35,96 5,93 C 6,65 4,36 5,12 Z" 
                fill="#ffffff" 
                stroke="#171717" 
                strokeWidth="1.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {/* Paper lines watermark or header decoration - Moved fully down, using cute handwritten feel */}
          <div className="border-b border-dashed border-neutral-300 pb-1.5 flex justify-between items-center text-neutral-400 select-none sm:mb-4 relative z-10 mt-3.5">
            <span className="font-sketch text-[9.5px] tracking-wider text-neutral-400 font-bold">typewriter no. 11</span>
            <span className="font-sketch italic text-[9.5px] text-neutral-400 font-bold">omont.2026</span>
          </div>

          {/* Typewritten text field with dynamic font styles */}
          <div className={`flex-1 font-mono text-neutral-950 font-bold select-text text-center flex flex-col justify-center relative z-10 ${fontStyle.leadingClass} ${fontStyle.pyClass}`}>
            <span className={`whitespace-pre-line pointer-events-auto ${fontStyle.fontSizeClass} ${fontStyle.trackingClass}`}>
              {displayedText}
              {!isDone && (
                <span className="inline-block w-1.5 h-4 bg-neutral-950 ml-0.5 animate-pulse" />
              )}
            </span>
          </div>

          {/* Bottom paper feed shadow crease */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-neutral-200 to-transparent pointer-events-none opacity-40 z-10" />
        </motion.div>
      </div>

      {/* Dynamic Instruction bar above typewriter rollers */}
      <div className="w-full h-8 bg-neutral-50 border-y-[1.2px] border-neutral-900 flex items-center justify-between px-2.5 z-20 shadow-xs">
        <div className="flex items-center gap-1.5 opacity-60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-900 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-950"></span>
          </span>
          <span className="text-[10px] font-sketch font-bold tracking-wider text-neutral-900 uppercase">
            🔊 MECHANICAL TYPEWRITER AUDIO
          </span>
        </div>

        <button
          onClick={handleSkipTyping}
          className="text-[9.5px] font-sketch font-extrabold text-neutral-950 hover:underline cursor-pointer tracking-widest uppercase flex items-center gap-1 sketch-border-sm px-2.5 py-0.5 bg-white shadow-xs"
        >
          ⚡ SKIP
        </button>
      </div>

      {/* 2. CLASSIC MINT GREEN LINE-ART TYPEWRITER (Satisfies Image 2 + 6) */}
      <div className="w-full shrink-0 h-[190px] relative z-30 flex items-center justify-center bg-white mt-[-2px]">
        {/* Classic mechanical outline typewriter body wrapper */}
        <div className="w-[340px] h-full flex flex-col justify-between items-center p-2 pt-3 relative">
          
          {/* Main Semicircular Mechanical Carriage / Roll Bar Roller (Background line layer) */}
          <div className="absolute top-2 w-[85%] h-5 bg-neutral-100 border-[1.2px] border-neutral-900 rounded-full flex justify-between px-2 items-center">
            {/* Roller handles (Left and right mechanical rounded cylinder turns) */}
            <div className="w-4 h-6 border-[1.2px] border-neutral-900 rounded bg-neutral-200 mt-[-2px] ml-[-9px]" />
            <div className="w-4 h-6 border-[1.2px] border-neutral-900 rounded bg-neutral-200 mt-[-2px] mr-[-9px]" />
          </div>

          {/* Typewriter Body Case (Vibe of cool line-art retro pastel green body) */}
          <div className="w-[95%] flex-1 p-3 flex flex-col justify-between mt-3.5 z-10 relative">
            {/* Handdrawn vector background for keyboard base container */}
            <div className="absolute inset-0 pointer-events-none overflow-visible z-[-1]">
              {/* Real shadow */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path 
                  d="M 4,8 C 30,5 65,10 96,8 C 98,35 94,65 96,91 C 97,95 93,97 91,97 C 65,95 35,94 9,97 C 7,97 3,95 4,91 C 6,62 3,35 4,8 Z" 
                  fill="#171717" 
                  style={{ transform: 'translate(4px, 4px)' }} 
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              {/* Border & Canvas Fill */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path 
                  d="M 4,8 C 30,5 65,10 96,8 C 98,35 94,65 96,91 C 97,95 93,97 91,97 C 65,95 35,94 9,97 C 7,97 3,95 4,91 C 6,62 3,35 4,8 Z" 
                  fill="#EEF5EE" 
                  stroke="#171717" 
                  strokeWidth="1.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            
            {/* Steel Segment Carrier ribbon cover panel (the silver triangular wedge) */}
            <div className="w-24 h-5 sketch-border-sm bg-white rounded-t-none mx-auto flex items-center justify-center -mt-3.5 z-20">
              <span className="font-sketch text-[9px] text-neutral-800 font-black tracking-widest">OMONT</span>
            </div>

            {/* Simulated Keyboard Key Rows (Full configuration matching Smith-Corona layout) */}
            <div className="flex-1 flex flex-col justify-center gap-[4.5px] mt-2 px-1">
              {/* Row 1 keycaps (Numbers/Symbols) */}
              <div className="flex justify-center gap-[3px]">
                {row1.map((k) => (
                  <div
                    key={k}
                    className={`w-[21px] h-[21px] rounded-full border-[1.2px] border-neutral-900 flex items-center justify-center font-mono text-[8px] font-extrabold pb-[0.5px] translate-y-0.5 shadow-[1px_1.5px_0px_#171717] transition-all bg-[#fafaf7] text-neutral-800 ${
                      isKeyActive(k) ? '!bg-neutral-950 !text-white translate-y-1 shadow-none' : ''
                    }`}
                  >
                    {k}
                  </div>
                ))}
              </div>

              {/* Row 2 keycaps (QWERTY) */}
              <div className="flex justify-center gap-[3px] pl-[5px]">
                {row2.map((k) => (
                  <div
                    key={k}
                    className={`w-[21px] h-[21px] rounded-full border-[1.2px] border-neutral-900 flex items-center justify-center font-mono text-[8.5px] font-extrabold pb-[0.5px] translate-y-0.5 shadow-[1px_1.5px_0px_#171717] transition-all bg-[#fafaf7] text-neutral-800 ${
                      isKeyActive(k) ? '!bg-neutral-950 !text-white translate-y-1 shadow-none' : ''
                    }`}
                  >
                    {k}
                  </div>
                ))}
              </div>

              {/* Row 3 keycaps (ASDF) */}
              <div className="flex justify-center gap-[3px] pl-[9px]">
                {row3.map((k) => (
                  <div
                    key={k}
                    className={`w-[21px] h-[21px] rounded-full border-[1.2px] border-neutral-900 flex items-center justify-center font-mono text-[8.5px] font-extrabold pb-[0.5px] translate-y-0.5 shadow-[1px_1.5px_0px_#171717] transition-all bg-[#fafaf7] text-neutral-800 ${
                      isKeyActive(k) ? '!bg-neutral-950 !text-white translate-y-1 shadow-none' : ''
                    }`}
                  >
                    {k}
                  </div>
                ))}
              </div>

              {/* Row 4 keycaps (ZXCV) */}
              <div className="flex justify-center gap-[3px] pl-[13px]">
                {row4.map((k) => (
                  <div
                    key={k}
                    className={`w-[21px] h-[21px] rounded-full border-[1.2px] border-neutral-900 flex items-center justify-center font-mono text-[8.5px] font-extrabold pb-[0.5px] translate-y-0.5 shadow-[1px_1.5px_0px_#171717] transition-all bg-[#fafaf7] text-neutral-800 ${
                      isKeyActive(k) ? '!bg-neutral-950 !text-white translate-y-1 shadow-none' : ''
                    }`}
                  >
                    {k}
                  </div>
                ))}
              </div>

              {/* Row 5 space and return bar keycaps (Wider Spacebar like the real Smith-Corona) */}
              <div className="flex justify-center items-center gap-2 mt-0.5">
                <div
                  className={`w-32 h-4.5 sketch-border-sm flex items-center justify-center font-sketch text-[9px] font-extrabold tracking-widest translate-y-0.5 shadow-[1px_1.5px_0px_#171717] transition-all bg-[#fafaf7] text-neutral-800 ${
                    activeKey === 'SPACE' ? '!bg-neutral-950 !text-white translate-y-1 shadow-none' : ''
                  }`}
                >
                  SPACE
                </div>
                <div
                  className={`w-12 h-4.5 sketch-border-sm flex items-center justify-center font-sketch text-[9px] font-extrabold tracking-wider translate-y-0.5 shadow-[1px_1.5px_0px_#171717] transition-all bg-[#fafaf7] text-neutral-800 ${
                    activeKey === 'RET' ? '!bg-neutral-950 !text-white translate-y-1 shadow-none' : ''
                  }`}
                >
                  RET
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
