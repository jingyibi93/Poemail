import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, ArrowLeft, Sparkles, Check, Archive } from 'lucide-react';
import { PoemLetter } from '../types';
import HanddrawnCard from './HanddrawnCard';

interface PoemDisplayViewProps {
  currentLetter: PoemLetter;
  onBack: () => void;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
  isSavedInBox?: boolean;
  onSave?: () => void;
  onViewCabinet?: () => void;
}

export default function PoemDisplayView({
  currentLetter,
  onBack,
  isSpeaking,
  onToggleSpeech,
  isSavedInBox = false,
  onSave,
  onViewCabinet,
}: PoemDisplayViewProps) {
  // Collection micro-animation interactive state engine (4-step immersive flow)
  const [isAnimatingTuck, setIsAnimatingTuck] = useState(false);
  const [animationStep, setAnimationStep] = useState<1 | 2 | 3 | 4>(1); // 1: Slide paper, 2: Fold flap, 3: Stamp seal, 4: Fly into wood chest

  const handleCollectToggle = () => {
    if (isSavedInBox) {
      // Removing item doesn't require complex animation
      if (onSave) onSave();
    } else {
      // Begin sequence: 4-stage collection experience
      setIsAnimatingTuck(true);
      setAnimationStep(1);

      // Transition to Stage 2 (Fold flap down) at 1400ms after paper is fully nestled inside
      const t1 = setTimeout(() => {
        setAnimationStep(2);
      }, 1400);

      // Transition to Stage 3 (Apply crimson wax seal with spring motion) at 2400ms
      const t2 = setTimeout(() => {
        setAnimationStep(3);
      }, 2400);

      // Transition to Stage 4 (Flying into the gorgeous handdrawn wooden chest) at 3600ms
      const t3 = setTimeout(() => {
        setAnimationStep(4);
      }, 3600);
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
          No. {currentLetter.id} • {currentLetter.postmark.split(' ')[1] || 'Poem'}
        </span>
      </div>

      {/* Hand-sketched central poem parchment card with custom wobbly vector handdrawn outline */}
      <HanddrawnCard
        styleIndex={4}
        fillColor="#FCFAF5"
        className="flex-grow w-full flex flex-col justify-center items-center py-7 px-5 rotate-[-0.5deg] relative"
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

        {/* Tiny hand drawn line break */}
        <div className="w-14 h-[1.5px] bg-[#171717] my-4 opacity-80" />

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
          className="mt-5.5 px-4.5 py-1.5 text-center select-text rotate-[1deg] max-w-[240px]"
        >
          <p className="text-[10px] font-sketch tracking-wider text-neutral-500 font-extrabold leading-none">VOCABULARY DECAL</p>
          <p className="text-[14px] text-neutral-950 font-black mt-1 font-sketch leading-snug">
            {currentLetter.word} <span className="text-[11px] text-neutral-400 font-normal">{currentLetter.phonetic}</span>
          </p>
          <p className="text-[11px] font-serif-zh text-neutral-700 font-bold leading-none mt-0.5">{currentLetter.wordMeaning}</p>
        </HanddrawnCard>
      </HanddrawnCard>

      {/* Centered Controls: Voice synthesis & Collect triggers */}
      <div className="w-full mt-4 select-none flex justify-center gap-3 pb-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggleSpeech}
          className="relative focus:outline-none cursor-pointer"
          id="listen-bell-btn"
        >
          <HanddrawnCard
            useButtonMini={true}
            styleIndex={1}
            isActive={isSpeaking}
            shadowOffset={{ x: 3, y: 3 }}
            className={`px-5 py-3 text-[11px] font-sketch font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all`}
          >
            {isSpeaking ? <VolumeX size={13} className="stroke-[1.3] text-neutral-900" /> : <Volume2 size={13} className="stroke-[1.3] text-neutral-900" />}
            <span>{isSpeaking ? 'STOP' : 'LISTEN'}</span>
          </HanddrawnCard>
        </motion.button>

        {onSave && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCollectToggle}
            className="relative focus:outline-none cursor-pointer"
            id="collect-letter-btn"
          >
            <HanddrawnCard
              useButtonMini={true}
              styleIndex={2}
              isActive={isSavedInBox}
              shadowOffset={{ x: 3, y: 3 }}
              className={`px-5 py-3 text-[11px] font-sketch font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all`}
            >
              {isSavedInBox ? (
                <span className="text-[#DE6B6B] scale-125 select-none leading-none">♥</span>
              ) : (
                <span className="text-neutral-500 scale-125 select-none leading-none">♡</span>
              )}
              <span>{isSavedInBox ? 'COLLECTED' : 'COLLECT'}</span>
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
            {/* Minimal clean spacing - removed step pill/status tag to avoid margin clutter and boxes */}
            <div className="w-full h-8 shrink-0" />

            {/* Stage Visual Port */}
            <div className="flex-1 w-full relative flex flex-col items-center justify-center">
              
              {/* Step 1, 2, 3: Kraft envelope with sliding card (Inspired directly by Reference Image 5) */}
              {animationStep < 4 ? (
                <div className="relative w-[240px] h-[255px] flex flex-col justify-end items-center mb-8 overflow-hidden">
                  {/* Open envelope flap pointing UP (Remains visible as paper slides down) */}
                  {animationStep < 4 && (
                    <motion.div
                      initial={{ scaleY: 1, opacity: 1 }}
                      animate={animationStep >= 2 ? { scaleY: 0 } : { scaleY: 1 }}
                      transition={{ duration: 0.35, ease: 'easeIn' }}
                      style={{ originY: 1 }} // Bottom boundary hinge hinge point
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
              ) : (
                /* Step 4: Sealed Envelope sliding and falling into the KeepSakes cabinet box! (Ref Image 6) */
                <div className="relative w-full max-w-[280px] h-[190px] sm:h-[220px] flex flex-col items-center justify-center select-none overflow-visible">
                  
                  {/* Wooden Chest Box Housing Card Catalog drawers (Exactly drawn from reference photo in black handsketch line-art style) */}
                  <motion.div
                    initial={{ scale: 0.85, y: 25, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full h-full flex items-center justify-center select-none"
                  >
                    <svg
                      viewBox="0 0 320 240"
                      className="w-full h-full max-h-[175px] sm:max-h-[210px] overflow-visible select-none text-neutral-900"
                      style={{ filter: 'drop-shadow(2px 3.5px 0px rgba(0,0,0,0.04))' }}
                    >
                      {/* Beautiful hand-drawn SVG wooden box with black lines (No dynamic displacement filters for 100% rendering stability in all frames and browsers) */}
                      <g stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        
                        {/* 1. Wood Lid backboard (interior open surface of the lid facing the viewer) */}
                        <polygon points="45,110 225,75 270,5 110,20" fill="#FCFAF5" />
                        
                        {/* Inside recessed panel of wood lid */}
                        <polygon points="53,105 217,73 258,15 116,27" fill="#F3ECE0" />
                        
                        {/* Wood Lid Rim thicknesses */}
                        <polygon points="110,20 270,5 264,0 104,15" fill="#FAF6ED" />
                        <polygon points="45,110 110,20 104,15 39,105" fill="#FAF6ED" />

                        {/* Wavy wood grain on inside lid backboard */}
                        <path d="M 65,95 Q 130,75 200,60" stroke="#1a1a1a" strokeWidth="0.8" strokeOpacity="0.25" />
                        <path d="M 80,75 Q 140,55 210,40" stroke="#1a1a1a" strokeWidth="0.8" strokeOpacity="0.2" />

                        {/* Inside deep hollow cavity of the bottom box (under the postcard contents) */}
                        <polygon points="45,110 115,150 295,100 225,75" fill="#2E2D2C" />

                        {/* 2. Cozy stacked elements inside the bottom box (Postcards, pastel letters) */}
                        {/* Pastel Pink memory note on left */}
                        <polygon points="50,140 120,165 140,145 70,120" fill="#FCE7F3" />
                        
                        {/* Pastel Sky-Blue memory note on left */}
                        <polygon points="53,143 123,168 135,153 65,128" fill="#E0F2FE" />
                        
                        {/* Yellow base stacked letter */}
                        <polygon points="55,125 105,152 205,120 155,93" fill="#FEF3C7" />

                        {/* Landscape coloring postcard (representing Van Gogh masterpiece inside) */}
                        <polygon points="90,130 250,100 265,142 105,172" fill="#FDFBF7" />
                        {/* Landscape coloring details: warm sunset gold sky, wavy rolling blue hills, vivid cypress and green fields */}
                        <path d="M 100,136 Q 160,121 230,111" stroke="#F59E0B" strokeWidth="3" strokeOpacity="0.35" />
                        <path d="M 110,146 Q 170,134 240,121" stroke="#3B82F6" strokeWidth="3.2" strokeOpacity="0.25" />
                        <path d="M 105,155 Q 175,143 255,128" stroke="#10B981" strokeWidth="3" strokeOpacity="0.32" />
                        {/* Emerald dark Cypress outline & fill */}
                        <path d="M 130,132 Q 135,155 140,160" stroke="#047857" strokeWidth="2.5" />
                        <path d="M 127,138 Q 132,156 137,162" stroke="#065F46" strokeWidth="1.8" />

                        {/* Index Divider folder / white card with green tab on the right side */}
                        <polygon points="200,105 275,90 285,125 210,140" fill="#FAFaf5" />
                        <polygon points="215,100 215,92 245,87 245,94" fill="#10B981" />

                        {/* Focal white paper with elegant handwritten typewriter poem simulation */}
                        <polygon points="120,118 235,96 245,145 130,168" fill="#FFFFFF" />
                        <line x1="130" y1="128" x2="225" y2="109" stroke="#525252" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
                        <line x1="130" y1="134" x2="225" y2="115" stroke="#525252" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
                        <line x1="130" y1="140" x2="225" y2="121" stroke="#525252" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
                        <line x1="130" y1="146" x2="225" y2="127" stroke="#525252" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
                        <line x1="130" y1="152" x2="225" y2="133" stroke="#525252" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
                        <line x1="130" y1="158" x2="225" y2="139" stroke="#525252" strokeWidth="0.8" strokeDasharray="1.5,1.5" />

                        {/* 3. Bottom wooden box outer shell walls blocking the postcards inside */}
                        {/* Left flank face of the box */}
                        <polygon points="45,110 115,150 115,215 45,175" fill="#FCFAF5" />
                        {/* Front face of the box (wide wood panel) */}
                        <polygon points="115,150 295,100 295,165 115,215" fill="#FAF6ED" />

                        {/* Fine wavy hand-drawn wood grains on bottom box */}
                        <path d="M 52,120 Q 55,145 53,170" stroke="#1a1a1a" strokeWidth="0.8" strokeOpacity="0.22" />
                        <path d="M 70,128 Q 74,155 72,185" stroke="#1a1a1a" strokeWidth="0.8" strokeOpacity="0.22" />
                        <path d="M 90,138 Q 94,168 93,198" stroke="#1a1a1a" strokeWidth="0.8" strokeOpacity="0.22" />
                        
                        <path d="M 130,165 Q 190,150 280,118" stroke="#1a1a1a" strokeWidth="0.8" strokeOpacity="0.25" />
                        <path d="M 135,185 Q 195,170 285,138" stroke="#1a1a1a" strokeWidth="0.8" strokeOpacity="0.25" />
                        <path d="M 125,205 Q 185,190 270,158" stroke="#1a1a1a" strokeWidth="0.8" strokeOpacity="0.25" />

                        {/* Wood joint connection is simple and clean without horizontal notched lines */}

                        {/* 4. Elegant golden hinges / lid-support stays holding the lid open (extremely photorealistic detailing) */}
                        {/* Left support stay arm */}
                        <path d="M 55,116 Q 60,95 75,75" stroke="#FBBF24" strokeWidth="2.2" strokeLinecap="round" />
                        <path d="M 55,116 L 75,75" stroke="#1a1a1a" strokeWidth="0.8" strokeLinecap="round" />
                        
                        {/* Right support stay arm */}
                        <path d="M 215,80 Q 220,60 235,45" stroke="#FBBF24" strokeWidth="2.2" strokeLinecap="round" />
                        <path d="M 215,80 L 235,45" stroke="#1a1a1a" strokeWidth="0.8" strokeLinecap="round" />

                        {/* 5. Golden latch clasp lock on the front wood face */}
                        <polygon points="198,124 212,121 210,136 196,139" fill="#FBBF24" stroke="#1a1a1a" strokeWidth="1.4" />
                        <circle cx="201" cy="127" r="1" fill="#1a1a1a" />
                        <circle cx="207" cy="125" r="1" fill="#1a1a1a" />

                        {/* Golden catch ring plate hanging from the top lid */}
                        <polygon points="182,14 198,12 196,4 180,6" fill="#FBBF24" />
                        <path d="M 183,14 Q 183,28 189,29 Q 195,30 195,12" stroke="#D97706" strokeWidth="1.8" fill="none" />

                        {/* Cozily ground the wooden keepsake chest on tabletop with sketching plank lines */}
                        <path d="M 25,190 L 105,250 M 15,240 L 160,330 M 180,240 L 315,310 M 265,190 L 350,230" stroke="#1a1a1a" strokeWidth="1" strokeOpacity="0.15" />
                      </g>

                      {/* Overlaid Texts (Drawn without displacement filter so letters remain sharp & highly legible) */}
                      {/* Cursive style or fine branding on postcards */}
                      <text x="217" y="93" transform="rotate(-4, 217, 93)" fill="#ffffff" className="font-sketch font-bold text-[5.8px] select-none uppercase tracking-wider">
                        POEMS
                      </text>

                      {/* Header on the white paper representing Oscar Wilde */}
                      <text x="135" y="125" transform="rotate(-10, 135, 125)" fill="#262626" className="font-mono text-[4.3px] font-bold select-none tracking-tight">
                        KEEPSAKES & MEMORIES
                      </text>
                      <text x="131" y="131.5" transform="rotate(-10, 131, 131.5)" fill="#525252" className="font-serif-zh font-bold text-[3px] select-none">
                        奇遇诗社 ∙ 阁下专属集珍
                      </text>
                    </svg>
                  </motion.div>

                  {/* Flying Mini Sealed Envelope sliding smoothly downwards inside the card container slot (Exact transition match) */}
                  <motion.div
                    initial={{ scale: 1, y: 40, opacity: 1, rotate: 0 }}
                    animate={{ 
                      scale: [1, 0.55, 0.35, 0.28], 
                      y: [40, -110, -5, 5],
                      x: [0, -10, 3, 5], 
                      rotate: [0, -15, 8, 5],
                      opacity: [1, 1, 1, 0] 
                    }}
                    transition={{ 
                      duration: 1.6, 
                      times: [0, 0.45, 0.88, 1],
                      ease: "easeInOut" 
                    }}
                    className="absolute top-1/2 left-1/2 -mt-[60px] -ml-[120px] z-25 pointer-events-none"
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
                        {/* Closed Top Flap on top of other flaps since it is a sealed flying envelope in step 3! */}
                        <path d="M 1.5 1.5 L 120 58 L 238.5 1.5 Z" fill="#FCFAF5" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {/* Crimson Wax Seal Heart Stamp in center */}
                      <div className="absolute top-[42px] left-[105px] w-8 h-8 rounded-full bg-[#E57676] border-[1.8px] border-neutral-950 flex items-center justify-center text-white text-[11px] font-sketch font-bold z-10 shadow-sm leading-none">
                        ♥
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Subtle success sparkle pop over POEMS tab */}
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: [0.3, 1, 1.2, 0], opacity: [0, 1, 1, 0] }}
                    transition={{ delay: 1.25, duration: 0.95 }}
                    className="absolute top-1/2 left-1/2 -ml-2 -mt-[52px] pointer-events-none text-neutral-950 z-30"
                  >
                    <Sparkles className="text-neutral-950 fill-neutral-200 animate-spin" size={18} />
                  </motion.div>
                </div>
              )}
            </div>

            {/* Bottom hand-drawn feedback dialogue & user options (Clean White flat background, entirely borderless) */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={animationStep === 4 ? { y: 0, opacity: 1 } : { y: 15, opacity: 0.7 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full bg-white p-4.5 text-center select-none flex flex-col items-center shrink-0 mb-3"
            >
              {animationStep < 4 ? (
                <>
                  <span className="w-6 h-6 rounded-full border border-neutral-900 bg-white flex items-center justify-center mb-1 animate-bounce">
                    <span className="text-[12px] leading-zero mt-0.5">✎</span>
                  </span>
                  <h3 className="font-sketch text-[14px] font-black text-neutral-900 uppercase tracking-widest">
                    {animationStep === 1 
                      ? 'SLIPPING INTO SEALS...' 
                      : animationStep === 2 
                      ? 'FOLDING ENVELOPE COVER...' 
                      : 'STAMPING WAX SEAL...'}
                  </h3>
                  <p className="font-serif-zh text-neutral-500 text-[11px] font-bold tracking-wider mt-1.5 leading-relaxed max-w-[280px]">
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

                  {/* Actions buttons row - Styled with authentic black outline white background handdrawn sketch buttons */}
                  <div className="flex gap-3 w-full mt-4 justify-center">
                    <button
                      onClick={() => handleCompleteAnimation(false)}
                      className="px-5 py-2 text-[10px] font-sketch font-black bg-white text-neutral-950 sketch-border-btn shadow-[2px_2px_0px_rgba(23,23,23,0.15)] active:translate-y-0.5 transition-all cursor-pointer hover:bg-neutral-50"
                    >
                      CONTINUE / 品诗
                    </button>
                    {onViewCabinet && (
                      <button
                        onClick={() => handleCompleteAnimation(true)}
                        className="px-5 py-2 text-[10.5px] font-sketch font-black bg-white text-neutral-950 sketch-border-btn shadow-[2px_2px_0px_rgba(23,23,23,0.15)] active:translate-y-0.5 transition-all cursor-pointer hover:bg-neutral-50 flex items-center gap-1"
                      >
                        <Archive size={11} strokeWidth={2} />
                        VIEW CHEST / 收藏盒
                      </button>
                    )}
                  </div>
                </>
              )}
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
