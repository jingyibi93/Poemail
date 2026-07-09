import { getSharedAudioContext } from './mobileAudio';

/**
 * Procedural synthesizers for realistic physical sound effects in the poem collection app.
 * By using the Web Audio API to model physical wave parameters directly, we eliminate
 * network delay, disk usage, bundle size, and 404 hazards completely.
 */

export function playPaperFoldSound() {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Generate high frequency crisp fibers cracking and sliding - simulating heavy watercolor parchment folding
    const bufferSize = ctx.sampleRate * 0.4; // 0.4 seconds of crisp folding friction
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    // --- Part 1: Initial crisp fiber snap/crack ("krff") ---
    const source1 = ctx.createBufferSource();
    source1.buffer = noiseBuffer;

    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'highpass';
    filter1.frequency.setValueAtTime(1800, now);
    filter1.frequency.linearRampToValueAtTime(1200, now + 0.15);

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.08, now + 0.02); // very rapid snap
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    source1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(ctx.destination);
    source1.start(now);
    source1.stop(now + 0.15);

    // --- Part 2: Creasing drag friction ("shhht") ---
    // Simulates the physical finger sliding across raw paper grain to fold it flat
    const source2 = ctx.createBufferSource();
    source2.buffer = noiseBuffer;

    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'bandpass';
    filter2.Q.setValueAtTime(5.0, now + 0.05);
    filter2.frequency.setValueAtTime(900, now + 0.05);
    filter2.frequency.exponentialRampToValueAtTime(1400, now + 0.18);
    filter2.frequency.exponentialRampToValueAtTime(750, now + 0.35);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.001, now + 0.05);
    gain2.gain.linearRampToValueAtTime(0.06, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    source2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(ctx.destination);
    source2.start(now + 0.05);
    source2.stop(now + 0.4);

    // --- Part 3: Soft cardboard/paper bend thud ("flpp") ---
    // Low-mid frequency displacement wave of the paper sheets folding over
    const lowOsc = ctx.createOscillator();
    lowOsc.type = 'triangle';
    lowOsc.frequency.setValueAtTime(180, now);
    lowOsc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

    const lowGain = ctx.createGain();
    lowGain.gain.setValueAtTime(0.001, now);
    lowGain.gain.linearRampToValueAtTime(0.04, now + 0.06);
    lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    lowOsc.connect(lowGain);
    lowGain.connect(ctx.destination);
    lowOsc.start(now);
    lowOsc.stop(now + 0.3);

  } catch (err) {
    console.warn('Paper fold audio synthesis failed:', err);
  }
}

export function playEnvelopeInSound() {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Generate a high-quality paper friction/rustle slide sound using White Noise through a dynamic bandpass filter
    const bufferSize = ctx.sampleRate * 0.8;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    // --- Slide 1: Quick sliding entrance ("shhhk") ---
    const noiseNode1 = ctx.createBufferSource();
    noiseNode1.buffer = noiseBuffer;

    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.Q.setValueAtTime(4.0, now);
    filter1.frequency.setValueAtTime(500, now);
    filter1.frequency.exponentialRampToValueAtTime(1100, now + 0.12);
    filter1.frequency.exponentialRampToValueAtTime(750, now + 0.28);

    const gainNode1 = ctx.createGain();
    gainNode1.gain.setValueAtTime(0.001, now);
    gainNode1.gain.linearRampToValueAtTime(0.14, now + 0.08); // Fade in
    gainNode1.gain.exponentialRampToValueAtTime(0.01, now + 0.32); // Fade out

    noiseNode1.connect(filter1);
    filter1.connect(gainNode1);
    gainNode1.connect(ctx.destination);

    noiseNode1.start(now);
    noiseNode1.stop(now + 0.35);

    // --- Slide 2: Nestling final pocket tuck ("fwwt") ---
    // Starts shortly after initial slide, adding physical complexity
    const noiseNode2 = ctx.createBufferSource();
    noiseNode2.buffer = noiseBuffer;

    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'bandpass';
    filter2.Q.setValueAtTime(4.5, now + 0.16);
    filter2.frequency.setValueAtTime(950, now + 0.16);
    filter2.frequency.exponentialRampToValueAtTime(550, now + 0.26);
    filter2.frequency.exponentialRampToValueAtTime(360, now + 0.5);

    const gainNode2 = ctx.createGain();
    gainNode2.gain.setValueAtTime(0.001, now + 0.16);
    gainNode2.gain.linearRampToValueAtTime(0.18, now + 0.25);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    noiseNode2.connect(filter2);
    filter2.connect(gainNode2);
    gainNode2.connect(ctx.destination);

    noiseNode2.start(now + 0.16);
    noiseNode2.stop(now + 0.6);

    // --- Slide 3: Low frequency body drag element ---
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    
    bodyOsc.type = 'triangle';
    bodyOsc.frequency.setValueAtTime(115, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(55, now + 0.45);

    bodyGain.gain.setValueAtTime(0.001, now);
    bodyGain.gain.linearRampToValueAtTime(0.05, now + 0.15);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(ctx.destination);

    bodyOsc.start(now);
    bodyOsc.stop(now + 0.52);

  } catch (err) {
    console.warn('Envelope slide audio synthesis failed:', err);
  }
}

export function playKeepsakeBoxSound() {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // --- Part 1: Metal-bracket / latch lock snap ("clink-click") ---
    const latch1 = ctx.createOscillator();
    const latchGain1 = ctx.createGain();
    latch1.type = 'sine';
    latch1.frequency.setValueAtTime(1100, now);
    latchGain1.gain.setValueAtTime(0.05, now);
    latchGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
    latch1.connect(latchGain1);
    latchGain1.connect(ctx.destination);
    latch1.start(now);
    latch1.stop(now + 0.015);

    const latch2 = ctx.createOscillator();
    const latchGain2 = ctx.createGain();
    latch2.type = 'sine';
    latch2.frequency.setValueAtTime(1650, now + 0.032);
    latchGain2.gain.setValueAtTime(0.04, now + 0.032);
    latchGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    latch2.connect(latchGain2);
    latchGain2.connect(ctx.destination);
    latch2.start(now + 0.032);
    latch2.stop(now + 0.05);

    // --- Part 2: Deep wood-case resonance thump ("clung-thud") ---
    const thump = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thump.type = 'triangle';
    thump.frequency.setValueAtTime(155, now + 0.038);
    thump.frequency.exponentialRampToValueAtTime(70, now + 0.11);
    
    thumpGain.gain.setValueAtTime(0.001, now + 0.038);
    thumpGain.gain.linearRampToValueAtTime(0.24, now + 0.048);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    thump.connect(thumpGain);
    thumpGain.connect(ctx.destination);
    thump.start(now + 0.038);
    thump.stop(now + 0.22);

    // --- Part 3: Deep hollow cabinet tail resonance (50Hz) ---
    const echo = ctx.createOscillator();
    const echoGain = ctx.createGain();
    echo.type = 'sine';
    echo.frequency.setValueAtTime(50, now + 0.042);
    echoGain.gain.setValueAtTime(0.001, now + 0.042);
    echoGain.gain.linearRampToValueAtTime(0.16, now + 0.052);
    echoGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    echo.connect(echoGain);
    echoGain.connect(ctx.destination);
    echo.start(now + 0.042);
    echo.stop(now + 0.35);

    // --- Part 4: Soft tactile sliding buffer brush on impact ---
    const bufferSize = ctx.sampleRate * 0.1;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now + 0.02);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.1);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now + 0.02);
    noiseGain.gain.linearRampToValueAtTime(0.07, now + 0.04);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    noiseNode.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseNode.start(now + 0.02);
    noiseNode.stop(now + 0.12);

  } catch (err) {
    console.warn('Keepsake box insertion audio synthesis failed:', err);
  }
}
