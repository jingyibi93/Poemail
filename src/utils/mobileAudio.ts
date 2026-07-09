export const getSharedAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;

  const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtxClass) return null;

  if (!(window as any).__globalAudioCtx) {
    (window as any).__globalAudioCtx = new AudioCtxClass();
  }

  return (window as any).__globalAudioCtx;
};

export const unlockMobileAudio = () => {
  const ctx = getSharedAudioContext();
  if (!ctx) return null;

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  try {
    const now = ctx.currentTime;
    const source = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.03);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(now);
    source.stop(now + 0.03);
  } catch {
    // Some browsers reject repeated unlock tones. The resume call above is the important part.
  }

  return ctx;
};
