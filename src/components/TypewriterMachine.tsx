import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';

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

  // Audio typewriter sound generator using Simple Web Audio API (so no assets needed!)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTypewriterSound = (isSpaceOrReturn = false) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // White/Brown click noise style
      if (isSpaceOrReturn) {
        // Spacebar bar slide "shhh" sound + metallic click
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else {
        // Standard high wooden click cap "clik"
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.06);

        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      }
    } catch {
      // Browsers might block audio or context not available - fail silently
    }
  };

  const playDingSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Sweet retro carriage return BELL "Ding!"
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  };

  // Reset typewriter when poem changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsDone(false);
  }, [poemText, triggerResetId]);

  // Typing timer
  useEffect(() => {
    if (currentIndex >= poemText.length) {
      if (!isDone) {
        setIsDone(true);
        playDingSound();
        // Give 580ms buffer of success so user celebrates the completed typing, then proceed
        setTimeout(() => {
          onComplete();
        }, 800);
      }
      return;
    }

    const char = poemText[currentIndex];
    
    // Typing delay speed: lower for punctuation/lines, faster for standard letters
    let delay = 35;
    if (char === '\n') {
      delay = 450; // Pause nicely on typewriter carriage returns!
    } else if (['.', ',', '?', '!'].includes(char)) {
      delay = 220; // Natural dramatic pauses on grammar
    }

    const timer = setTimeout(() => {
      setDisplayedText((prev) => prev + char);
      setCurrentIndex((prev) => prev + 1);

      // Sound and keyboard bounce simulation
      let keyName = char.toUpperCase();
      if (char === ' ') {
        keyName = 'SPACE';
      } else if (char === '\n') {
        keyName = 'RET';
      }
      setActiveKey(keyName);
      
      const isSpaceOrRet = char === ' ' || char === '\n';
      playTypewriterSound(isSpaceOrRet);

      // Create a randomized floating particle bubble "Clac!" or "Ding!" for typewriter tactile feedback
      if (!isSpaceOrRet && Math.random() < 0.35) {
        const id = waveIdRef.current++;
        const words = ['Clak!', 'Clink!', 'Tap!', 'Tup!'];
        const randomWord = words[Math.floor(Math.random() * words.length)];
        
        setKeyWaves((prev) => [
          ...prev,
          {
            id,
            text: randomWord,
            x: Math.random() * 120 + 80, // Around center keyboard area
            y: Math.random() * 30 + 310,
          },
        ]);

        // Evaporative cleanup
        setTimeout(() => {
          setKeyWaves((prev) => prev.filter((w) => w.id !== id));
        }, 650);
      }

    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, poemText, isDone, onComplete]);

  // Handle instant tap-to-skip typing
  const handleSkipTyping = () => {
    setDisplayedText(poemText);
    setCurrentIndex(poemText.length);
    setIsDone(true);
    playDingSound();
    onComplete();
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

  return (
    <div className="w-full flex-1 flex flex-col justify-between items-center bg-white relative overflow-hidden select-none">
      
      {/* Floating Mechanical words particles bubble layout */}
      <AnimatePresence>
        {keyWaves.map((wave) => (
          <motion.span
            key={wave.id}
            initial={{ opacity: 0.8, y: wave.y, x: wave.x, scale: 0.7 }}
            animate={{ opacity: 0, y: wave.y - 45, scale: 1.1, rotate: Math.random() * 20 - 10 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute z-35 font-sketch text-[10px] font-black tracking-wider text-neutral-800 pointer-events-none select-none sketch-border-sm px-1.5 bg-white shadow-xs"
          >
            {wave.text}
          </motion.span>
        ))}
      </AnimatePresence>

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
          className="w-[90%] pt-11 px-5 pb-8 flex flex-col justify-start relative z-10 text-left overflow-y-auto no-scrollbar"
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

          {/* Typewritten text field */}
          <div className="flex-1 font-mono text-neutral-950 font-bold select-text leading-relaxed text-center flex flex-col justify-center py-2 relative z-10">
            <span className="whitespace-pre-line text-sm sm:text-base tracking-wider pointer-events-auto">
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
      <div className="w-full h-8 bg-neutral-50 border-y-[1.2px] border-neutral-900 flex items-center justify-between px-4 z-20 shadow-xs">
        <div className="flex items-center gap-1.5 opacity-60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-900 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-950"></span>
          </span>
          <span className="text-[10px] font-sketch font-bold tracking-wider text-neutral-900 uppercase">Printing Draft</span>
        </div>

        <button
          onClick={handleSkipTyping}
          className="text-[10px] font-sketch font-extrabold text-neutral-950 hover:underline cursor-pointer tracking-widest uppercase flex items-center gap-1 sketch-border-sm px-2.5 py-0.5 bg-white shadow-xs"
        >
          ⚡ SKIP TYPING
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
