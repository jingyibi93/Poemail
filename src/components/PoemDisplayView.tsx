import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, ArrowLeft, Sparkles, Check, Archive, ArrowRight } from 'lucide-react';
import { PoemLetter } from '../types';
import HanddrawnCard from './HanddrawnCard';
import KeepsakeBox from './KeepsakeBox';
import { playEnvelopeInSound, playKeepsakeBoxSound, playPaperFoldSound } from '../utils/soundEffects';

interface PoemDisplayViewProps {
  currentLetter: PoemLetter;
  onBack: () => void;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
  isSavedInBox?: boolean;
  onSave?: () => void;
  onViewCabinet?: () => void;
  collectedLetters?: PoemLetter[];
  onTuckingActiveChange?: (active: boolean) => void;
  onPass?: () => void;
}

export default function PoemDisplayView({
  currentLetter,
  onBack,
  isSpeaking,
  onToggleSpeech,
  isSavedInBox = false,
  onSave,
  onViewCabinet,
  collectedLetters = [],
  onTuckingActiveChange,
  onPass,
}: PoemDisplayViewProps) {
  // Collection micro-animation interactive state engine (4-step immersive flow)
  const [isAnimatingTuck, setIsAnimatingTuck] = useState(false);
  const [animationStep, setAnimationStep] = useState<1 | 2 | 3 | 4>(1); // 1: Slide paper, 2: Fold flap, 3: Stamp seal, 4: Fly into wood chest

  useEffect(() => {
    if (onTuckingActiveChange) {
      onTuckingActiveChange(isAnimatingTuck);
    }
    return () => {
      if (onTuckingActiveChange) {
        onTuckingActiveChange(false);
      }
    };
  }, [isAnimatingTuck, onTuckingActiveChange]);

  const handleCollectToggle = () => {
    if (isSavedInBox) {
      // Removing item doesn't require complex animation
      if (onSave) onSave();
    } else {
      // Begin sequence: 4-stage collection experience
      setIsAnimatingTuck(true);
      setAnimationStep(1);

      // 1. Play the satisfying paper folding and sliding into envelope sound
      playEnvelopeInSound();

      // Transition to Stage 2 (Fold flap down) at 1400ms after paper is fully nestled inside
      const t1 = setTimeout(() => {
        setAnimationStep(2);
        playPaperFoldSound();
      }, 1400);

      // Transition to Stage 3 (Apply crimson wax seal with spring motion) at 2400ms
      const t2 = setTimeout(() => {
        setAnimationStep(3);
      }, 2400);

      // Transition to Stage 4 (Flying into the gorgeous handdrawn wooden chest) at 3600ms
      const t3 = setTimeout(() => {
        setAnimationStep(4);
      }, 3600);

      // 2. Play the wooden chest drop and latch socket thump sound at 4950ms (lands precisely with sparkles in Step 4)
      const t4 = setTimeout(() => {
        playKeepsakeBoxSound();
      }, 4950);
    }
  };

  const handleCompleteAnimation = (shouldViewDrawer = false) => {
    setIsAnimatingTuck(false);
    // Persist collection
    if (onSave) onSave();
    if (shouldViewDrawer && onViewCabinet) {
      // Delayed click trigger to open locker
      setTimeout(() => {
        onViewCabinet();
      }, 100);
    }
  };

  const handleWriteNext = () => {
    setIsAnimatingTuck(false);
    // Persist collection
    if (onSave) onSave();
    if (onPass) {
      setTimeout(() => {
        onPass();
      }, 100);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between items-center bg-white p-1 relative overflow-hidden select-none min-h-[485px]">
      
      {/* Top Header Controls with freehand wavy buttons */}
      <div className="w-full flex justify-between items-center border-b-[1.2px] border-dashed border-neutral-300 pb-2.5 mb-3 select-none">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-sketch font-bold text-neutral-900 sketch-border-sm px-3.5 py-1 bg-white hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          <ArrowLeft size={12} className="stroke-[1.3]" />
          <span>BACK</span>
        </button>
        <span className="font-sketch text-[11px] text-neutral-600 font-bold px-3.5 py-1 bg-neutral-50 sketch-border-sm rotate-[2deg]">
          No. {currentLetter.id} • {currentLetter.categoryTitle || currentLetter.postmark || 'Poem'}
        </span>
      </div>

      {/* Hand-sketched central poem parchment card with custom wobbly vector handdrawn outline */}
      <HanddrawnCard
        styleIndex={4}
        fillColor="#FCFAF5"
        className="w-full flex flex-col justify-center items-center py-7 px-5 rotate-[-0.5deg] relative"
        id="clean-poem-sheet"
      >
        {/* Watercolor or handwritten subtitle decor */}
        <div className="absolute top-3.5 leading-none text-neutral-450 font-sketch text-[11px] font-bold tracking-wider left-1/2 -translate-x-1/2 whitespace-nowrap">
          * Random luck in universe *
        </div>

        {/* Scalable SVG line-art coffee cup doodle matching the reference sheet */}
        <div className="absolute top-10 right-4 opacity-15 pointer-events-none transform rotate-[8deg] scale-75">
          <svg width="45" height="40" viewBox="0 0 45 40" fill="none" className="text-neutral-900">
            <path d="M10 10 L12 28 C13 32, 27 32, 28 28 L30 10 Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M30 14 C35 14, 35 24, 30 24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M14 18 Q16 22 18 18 M20 18 Q22 22 24 18" stroke="currentColor" strokeWidth="1.0" />
          </svg>
        </div>

        {/* Scalable SVG line-art flower vase doodle matching the reference sheet */}
        <div className="absolute bottom-12 left-3 opacity-15 pointer-events-none transform rotate-[-6deg] scale-75">
          <svg width="40" height="50" viewBox="0 0 40 50" fill="none" className="text-neutral-900">
            <path d="M15 22 C13 25, 10 28, 10 32 C10 40, 30 40, 30 32 C30 28, 27 25, 25 22 Z" stroke="currentColor" strokeWidth="1.2" />
            <path d="M15 22 L25 22" stroke="currentColor" strokeWidth="1.0" />
            <path d="M20 22 L20 12" stroke="currentColor" strokeWidth="1.2" />
            <path d="M18 22 L11 14" stroke="currentColor" strokeWidth="1.0" />
            <path d="M22 22 L29 15" stroke="currentColor" strokeWidth="1.0" />
            <circle cx="20" cy="11" r="2.5" fill="currentColor" />
            <circle cx="10" cy="13" r="2" fill="currentColor" />
            <circle cx="30" cy="14" r="2" fill="currentColor" />
          </svg>
        </div>

        {/* Cute hand-drawn label at top */}
        <div className="text-neutral-400 font-sketch text-lg mb-1.5 select-none">❀</div>

        {/* Poetry Core (English script font) */}
        <h1 className="font-sketch text-[19px] font-bold text-neutral-950 leading-relaxed tracking-wider text-center whitespace-pre-line select-text px-1 max-w-[320px]">
          {currentLetter.poem}
        </h1>

        {/* Generous minimal separation without dividing line to keep it clean and readable */}
        <div className="h-4" />

        {/* Chinese translation text in elegant warm font */}
        <p className="font-serif-zh font-bold text-[13px] text-neutral-700 leading-relaxed tracking-widest text-center whitespace-pre-line select-text max-w-[310px]">
          {currentLetter.translation}
        </p>

        {/* Key vocabulary sticker on bottom margins */}
        <HanddrawnCard
          useButtonMini={true}
          styleIndex={4}
          fillColor="#FAF7F0"
          shadowOffset={{ x: 2, y: 2 }}
          className="mt-5 w-full max-w-[260px] mx-auto px-4 py-2 text-center select-text rotate-[1deg]"
        >
          <p className="text-[10px] font-sketch tracking-wider text-neutral-400 font-extrabold leading-none">VOCABULARY DECAL</p>
          <p className="text-[16px] text-neutral-950 font-black mt-1 font-sketch leading-snug">
            {currentLetter.targetWord || currentLetter.word} <span className="text-[11.5px] text-neutral-400 font-sans font-medium">({currentLetter.partOfSpeech})</span>
          </p>
          <p className="text-[12.5px] text-neutral-400 font-mono mt-0.5 leading-none">{currentLetter.phonetic}</p>
          <p className="text-[13px] font-serif-zh text-neutral-750 font-bold leading-none mt-1">{currentLetter.wordMeaning}</p>
          
          {(currentLetter.example || currentLetter.exampleEn) && (
            <div className="border-t border-dashed border-neutral-300 mt-2 pt-1.5 text-left">
              <p className="text-[11.5px] italic text-neutral-600 font-sans font-medium leading-tight select-text">
                "{currentLetter.example || currentLetter.exampleEn}"
              </p>
              <p className="text-[11px] font-serif-zh text-neutral-400 leading-tight mt-0.5 select-text">
                {currentLetter.exampleTranslation || currentLetter.exampleCn}
              </p>
            </div>
          )}
        </HanddrawnCard>
      </HanddrawnCard>

      {/* Elegant spacing element to absorb parent flex height, pushing controls further down */}
      <div className="flex-grow min-h-[20px] md:min-h-[40px]" />

      {/* Centered Controls: Voice synthesis & Collect triggers, positioned further down for premium empty space rhythm */}
      <div className="w-full mt-2 select-none flex justify-center gap-2 sm:gap-3 pb-6 md:pb-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggleSpeech}
          className="relative focus:outline-none cursor-pointer w-[94px] sm:w-[105px]"
          id="listen-bell-btn"
        >
          <HanddrawnCard
            useButtonMini={true}
            styleIndex={1}
            isActive={isSpeaking}
            shadowOffset={{ x: 3, y: 3 }}
            className="px-1.5 py-3 text-[10.5px] sm:text-[11px] font-sketch font-bold tracking-wider transition-all w-full"
          >
            <div className="flex items-center justify-center gap-1.5 flex-nowrap w-full h-full">
              {isSpeaking ? (
                <VolumeX size={13} className="stroke-[1.3] text-neutral-900 shrink-0" />
              ) : (
                <Volume2 size={13} className="stroke-[1.3] text-neutral-900 shrink-0" />
              )}
              <span className="whitespace-nowrap">{isSpeaking ? 'STOP' : 'LISTEN'}</span>
            </div>
          </HanddrawnCard>
        </motion.button>

        {onSave && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCollectToggle}
            className="relative focus:outline-none cursor-pointer w-[94px] sm:w-[105px]"
            id="collect-letter-btn"
          >
            <HanddrawnCard
              useButtonMini={true}
              styleIndex={2}
              isActive={isSavedInBox}
              shadowOffset={{ x: 3, y: 3 }}
              className="px-1.5 py-3 text-[10.5px] sm:text-[11px] font-sketch font-bold tracking-wider transition-all w-full"
            >
              <div className="flex items-center justify-center gap-1.5 flex-nowrap w-full h-full">
                {isSavedInBox ? (
                  <span className="text-[#DE6B6B] scale-125 select-none leading-none shrink-0">♥</span>
                ) : (
                  <span className="text-neutral-500 scale-125 select-none leading-none shrink-0">♡</span>
                )}
                <span className="whitespace-nowrap">{isSavedInBox ? 'COLLECT' : 'COLLECT'}</span>
              </div>
            </HanddrawnCard>
          </motion.button>
        )}

        {onPass && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPass}
            className="relative focus:outline-none cursor-pointer w-[94px] sm:w-[105px]"
            id="pass-letter-btn"
          >
            <HanddrawnCard
              useButtonMini={true}
              styleIndex={0}
              shadowOffset={{ x: 3, y: 3 }}
              className="px-1.5 py-3 text-[10.5px] sm:text-[11px] font-sketch font-bold tracking-wider transition-all w-full"
            >
              <div className="flex items-center justify-center gap-1.5 flex-nowrap w-full h-full">
                <ArrowRight size={13} className="stroke-[1.3] text-neutral-900 shrink-0" />
                <span className="whitespace-nowrap">PASS</span>
              </div>
            </HanddrawnCard>
          </motion.button>
        )}
      </div>

      {/* --- AMAZING IMMERSIVE KRAFT ENVELOPE & OAK CATALOG DRAWER FILE CHUTE INTERACTIVE OVERLAY --- */}
      <AnimatePresence>
        {isAnimatingTuck && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-[150] flex flex-col justify-between items-center p-4 overflow-hidden select-none"
            id="envelope-tuck-chute-overlay"
          >
            {/* Upper Group: Animation Visuals & Status dialogue text - Centered on page with flex-grow */}
            <div className="flex-grow w-full flex flex-col justify-center items-center gap-4 sm:gap-6">
              
              {/* Stage Visual Port */}
              <div className="w-full relative flex flex-col items-center justify-center overflow-visible" style={{ minHeight: '270px' }}>
              
              {/* Wooden Keepsake Box: only shown when animation step is 4 */}
              <AnimatePresence>
                {animationStep === 4 && (
                  <motion.div
                    initial={{ scale: 0.85, y: 35, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.85, y: 35, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-full max-w-[195px] sm:max-w-[215px] z-10"
                  >
                    <KeepsakeBox
                      collectedLetters={collectedLetters}
                      onOpenLetter={() => {}}
                      className="w-full"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Central Interactive Envelope container */}
              {animationStep < 4 ? (
                /* Steps 1, 2, 3: Kraft envelope with sliding card (Inspired directly by Reference Image 5) */
                /* Positioned beautifully centered since there is no Keepsake Box underneath it! */
                <div className="relative w-full flex flex-col items-center justify-center z-20 overflow-visible" style={{ minHeight: '245px', transform: 'translateY(-5px)' }}>
                  <div className="relative w-[240px] h-[255px] flex flex-col justify-end items-center overflow-hidden">
                    {/* Open envelope flap pointing UP (Remains visible as paper slides down) */}
                    {animationStep < 4 && (
                      <motion.div
                        initial={{ scaleY: 1, opacity: 1 }}
                        animate={animationStep >= 2 ? { scaleY: 0 } : { scaleY: 1 }}
                        transition={{ duration: 0.35, ease: 'easeIn' }}
                        style={{ originY: 1 }} // Bottom boundary hinge point
                        className="absolute top-[85px] left-0 w-full h-[50px] z-10 overflow-visible"
                      >
                        <svg width="240" height="50" viewBox="0 0 240 50" className="w-full h-full overflow-visible">
                          <path d="M 1.5 48.5 L 120 1.5 L 238.5 48.5" fill="#FCFAF5" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.div>
                    )}

                    {/* Envelope pocket backing (Opaque base inside) */}
                    <div className="absolute top-[135px] left-0 w-full h-[120px] bg-white border-[1.8px] border-neutral-950 rounded-b shadow-[2px_2px_0px_#171717] z-10" />

                    {/* Paper sheet sliding down inside (Pure CSS simulation of Ref 5) */}
                    <motion.div
                      initial={{ y: -110, scale: 0.95, opacity: 1, rotate: -4 }}
                      animate={{ y: 125, scale: 0.9, opacity: 1, rotate: 0 }}
                      transition={{ duration: 1.2, ease: 'easeInOut' }}
                      className="absolute top-0 left-[25px] w-[190px] h-[190px] bg-[#FCFAF5] p-3 text-left border-[1.2px] border-neutral-900 shadow-md rounded-xs z-15 overflow-hidden font-sketch flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center border-b border-neutral-200 pb-1 mb-1.5 opacity-65">
                          <span className="text-[9px] font-extrabold text-neutral-400">No. {currentLetter.id}</span>
                          <span className="text-[10px]">❀</span>
                        </div>
                        <h4 className="text-[12px] font-black text-neutral-950 tracking-wide uppercase truncate leading-none">
                          {currentLetter.word}
                        </h4>
                        <p className="text-[8.5px] text-neutral-700 leading-snug tracking-wider mt-2 font-light max-h-[85px] overflow-hidden">
                          {currentLetter.poem}
                        </p>
                      </div>
                      <div className="border-t border-dashed border-neutral-200 pt-1 flex justify-between items-center opacity-60">
                        <span className="text-[7.5px] font-serif-zh font-bold text-neutral-500">{currentLetter.wordMeaning}</span>
                        <span className="text-[7.5px] font-extrabold uppercase text-neutral-400">{currentLetter.dateStr}</span>
                      </div>
                    </motion.div>

                    {/* Envelope Foreground Flaps: Left, Right, Bottom with beautiful handdrawn style outlines */}
                    <svg width="240" height="120" viewBox="0 0 240 120" className="absolute top-[135px] left-0 w-full h-[120px] pointer-events-none z-20 overflow-visible">
                      {/* Left Flap fold */}
                      <path d="M 1.5 1.5 L 115 65 L 1.5 118.5 Z" fill="#FCFAF5" stroke="#171717" strokeWidth="1.8" strokeLinejoin="round" />
                      {/* Right Flap fold */}
                      <path d="M 238.5 1.5 L 125 65 L 238.5 118.5 Z" fill="#FCFAF5" stroke="#171717" strokeWidth="1.8" strokeLinejoin="round" />
                      {/* Bottom Flap fold */}
                      <path d="M 1.5 118.5 L 120 60 L 238.5 118.5 Z" fill="#FAF7F0" stroke="#171717" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>

                    {/* Top envelope flap folding down (Animate flap pivot) */}
                    {animationStep >= 2 && (
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        style={{ originY: 0 }}
                        className="absolute top-[135px] left-0 w-[240px] h-[50px] z-25"
                      >
                        <svg width="240" height="50" viewBox="0 0 240 50" className="w-full h-full overflow-visible">
                          <path d="M 1.5 1.5 L 120 48.5 L 238.5 1.5 Z" fill="#FCFAF5" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.div>
                    )}

                    {/* Crimson Wax Seal Stamp locking heart on flap */}
                    {animationStep >= 3 && (
                      <motion.div
                        initial={{ scale: 0, rotate: -25 }}
                        animate={{ scale: 1, rotate: 2 }}
                        transition={{ delay: 0.1, duration: 0.35, type: 'spring' }}
                        className="absolute top-[166px] left-[105px] w-8 h-8 rounded-full bg-[#E57676] border-[1.8px] border-neutral-950 flex items-center justify-center text-white text-[11px] font-sketch font-bold z-40 shadow-sm"
                      >
                        ♥
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                /* Step 4: Sealed Envelope sliding and falling into the KeepSakes cabinet box! (Ref Image 6) */
                <div className="absolute inset-0 z-20 pointer-events-none overflow-visible">
                  {/* The sealed envelope starts high up in the port, falls smoothly down, shrinks, and enters the Keepsake Box */}
                  <motion.div
                    initial={{ scale: 1.0, y: -45, x: 0, opacity: 1, rotate: -8 }}
                    animate={{ 
                      scale: [1.0, 0.7, 0.45, 0.28], 
                      y: [-45, 30, 105, 185],
                      x: [0, -12, 6, 0], 
                      rotate: [-8, 6, -5, 2],
                      opacity: [1, 1, 1, 0] 
                    }}
                    transition={{ 
                      duration: 1.6, 
                      times: [0, 0.4, 0.75, 1],
                      ease: "easeInOut" 
                    }}
                    className="absolute top-[30px] left-1/2 -ml-[120px] overflow-visible"
                  >
                    <div className="relative w-[240px] h-[120px]">
                      {/* Envelope Back Base */}
                      <div className="absolute inset-0 bg-white border-[1.8px] border-neutral-950 rounded shadow-sm" />
                      {/* Clean Front Flaps SVG overlay */}
                      <svg width="240" height="120" viewBox="0 0 240 120" className="absolute inset-0 w-full h-full overflow-visible">
                        {/* Left Flap */}
                        <path d="M 1.5 1.5 L 115 65 L 1.5 118.5 Z" fill="#FCFAF5" stroke="#171717" strokeWidth="1.8" strokeLinejoin="round" />
                        {/* Right Flap */}
                        <path d="M 238.5 1.5 L 125 65 L 238.5 118.5 Z" fill="#FCFAF5" stroke="#171717" strokeWidth="1.8" strokeLinejoin="round" />
                        {/* Bottom Flap */}
                        <path d="M 1.5 118.5 L 120 60 L 238.5 118.5 Z" fill="#FAF7F0" stroke="#171717" strokeWidth="1.8" strokeLinejoin="round" />
                        {/* Closed Top Flap on top since it is sealed */}
                        <path d="M 1.5 1.5 L 120 58 L 238.5 1.5 Z" fill="#FCFAF5" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {/* Crimson Wax Seal Heart Stamp in center */}
                      <div className="absolute top-[42px] left-[105px] w-8 h-8 rounded-full bg-[#E57676] border-[1.8px] border-neutral-950 flex items-center justify-center text-white text-[11px] font-sketch font-bold z-10 shadow-sm leading-none">
                        ♥
                      </div>
                    </div>
                  </motion.div>

                  {/* Sparkle pop precisely where the physical slot is */}
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: [0.3, 1, 1.2, 0], opacity: [0, 1, 1, 0] }}
                    transition={{ delay: 1.35, duration: 0.95 }}
                    className="absolute bottom-[80px] left-1/2 -ml-2.5 z-30 pointer-events-none text-neutral-950"
                  >
                    <Sparkles className="text-neutral-950 fill-neutral-200 animate-spin" size={20} />
                  </motion.div>
                </div>
              )}
            </div>

            {/* Bottom hand-drawn feedback dialogue & user options (Clean White flat background, entirely borderless) */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={animationStep === 4 ? { y: 0, opacity: 1 } : { y: 15, opacity: 0.7 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full bg-white px-4 py-2 text-center select-none flex flex-col items-center shrink-0 mb-1.5"
            >
              {animationStep < 4 ? (
                <>
                  <span className="w-5 h-5 rounded-full border border-neutral-900 bg-white flex items-center justify-center mb-1 animate-bounce">
                    <span className="text-[10px] leading-zero mt-0.5">✎</span>
                  </span>
                  <h3 className="font-sketch text-[13.5px] font-black text-neutral-900 uppercase tracking-widest">
                    {animationStep === 1 
                      ? 'SLIPPING INTO SEALS...' 
                      : animationStep === 2 
                      ? 'FOLDING ENVELOPE COVER...' 
                      : 'STAMPING WAX SEAL...'}
                  </h3>
                  <p className="font-serif-zh text-neutral-500 text-[10px] sm:text-[11px] font-bold tracking-wider mt-1 leading-normal whitespace-nowrap overflow-visible">
                    {animationStep === 1 
                      ? '手写诗篇徐徐收束，卷入牛皮纸信封袋中...' 
                      : animationStep === 2
                      ? '封签合口，准备按上复古朱砂火漆印章...'
                      : '火漆朱砂轻按，凝结复古心型印记，心意已被郑重珍存。'}
                  </p>
                </>
              ) : (
                /* Success Filing dialogue box options - Pure borderless white text layout as requested */
                <>
                  <div className="flex items-center gap-1.5 text-neutral-800 mb-1.5 font-sketch text-[10.5px] font-black tracking-widest">
                    <Check size={11} className="stroke-[2.5]" />
                    <span>CATALOGED SUCCESSFULLY!</span>
                  </div>
                  
                  <h3 className="font-sketch text-[15px] font-black text-neutral-900 uppercase tracking-widest">
                    信札已入阁封存 ✿
                  </h3>
                  <p className="font-serif-zh text-neutral-500 text-[11px] font-bold tracking-wider mt-1 leading-normal max-w-[280px]">
                    您的信笺已装入信封，并放入了复古木质收纳架中。
                  </p>
                </>
              )}
            </motion.div>

            </div>

            {/* Bottom Actions buttons row - Positioned at exact same layout position as reading page */}
            {animationStep === 4 ? (
              <div className="w-full mt-2 select-none flex flex-row flex-nowrap items-center justify-center gap-1.5 px-1 pb-6 md:pb-10 shrink-0">
                <button
                  onClick={() => handleCompleteAnimation(false)}
                  className="px-2 sm:px-3 py-2 text-[10px] sm:text-[11px] font-sketch font-black bg-white text-neutral-950 sketch-border-btn shadow-[2px_2px_0px_rgba(23,23,23,0.15)] active:translate-y-0.5 transition-all cursor-pointer hover:bg-neutral-50 shrink-0"
                >
                  BACK
                </button>
                {onViewCabinet && (
                  <button
                    onClick={() => handleCompleteAnimation(true)}
                    className="px-2 sm:px-3 py-2 text-[10px] sm:text-[11px] font-sketch font-black bg-white text-neutral-950 sketch-border-btn shadow-[2px_2px_0px_rgba(23,23,23,0.15)] active:translate-y-0.5 transition-all cursor-pointer hover:bg-neutral-50 flex items-center gap-1 shrink-0"
                  >
                    <Archive size={11} strokeWidth={2} />
                    VIEW ARCHIVE
                  </button>
                )}
                {onPass && (
                  <button
                    onClick={handleWriteNext}
                    className="px-2 sm:px-3 py-2 text-[10px] sm:text-[11px] font-sketch font-black bg-white text-neutral-950 sketch-border-btn shadow-[2px_2px_0px_rgba(23,23,23,0.15)] active:translate-y-0.5 transition-all cursor-pointer hover:bg-neutral-50 flex items-center gap-1 shrink-0"
                  >
                    <ArrowRight size={11} strokeWidth={2} />
                    NEXT
                  </button>
                )}
              </div>
            ) : (
              /* Invisible placeholder matching the exact alignment and padding of buttons to preserve layout frame height stability */
              <div className="w-full mt-2 h-[42px] pb-6 md:pb-10 shrink-0 select-none pointer-events-none opacity-0" />
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
