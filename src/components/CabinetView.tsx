import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, BookOpen, Sparkles, ArrowLeft } from 'lucide-react';
import { PoemLetter } from '../types';
import HanddrawnCard from './HanddrawnCard';

interface CabinetViewProps {
  collectedLetters: PoemLetter[];
  onOpenLetter: (letter: PoemLetter) => void;
  onRemoveLetter: (letter: PoemLetter) => void;
  onBack: () => void;
}

const MotionHanddrawnCard = motion(HanddrawnCard);

export default function CabinetView({
  collectedLetters,
  onOpenLetter,
  onRemoveLetter,
  onBack,
}: CabinetViewProps) {
  return (
    <div className="w-full h-full flex flex-col justify-between bg-white select-none min-h-[485px]">
      
      {/* Drawer Title Section with Retro Hand-Sketched Accents */}
      <div className="w-full flex justify-between items-center border-b-[1.2px] border-dashed border-neutral-300 pb-2.5 mb-3 select-none">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-sketch font-bold text-neutral-900 sketch-border-sm px-3.5 py-1 bg-white hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          <ArrowLeft size={12} className="stroke-[1.3]" />
          <span>BACK</span>
        </button>
        <span className="font-sketch text-[11px] text-neutral-900 font-bold px-3.5 py-1 bg-white sketch-border-sm rotate-[1.5deg]">
          CABINET ({collectedLetters.length})
        </span>
      </div>

      {/* Main Chest Content Scroll Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-1 px-0.5 min-h-[360px] max-h-[440px]">
        <AnimatePresence mode="popLayout">
          {collectedLetters.length === 0 ? (
            /* Empty collection box layout */
            <motion.div
              key="empty-cabinet"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center py-10 px-4 text-center"
            >
              {/* Hollow Hand-drawn cabinet box silhouette */}
              <div className="relative w-36 h-28 mb-4 opacity-45 flex items-center justify-center">
                <svg
                  width="144"
                  height="112"
                  viewBox="0 0 320 240"
                  className="overflow-visible select-none text-neutral-800 animate-pulse"
                >
                  <defs>
                    <filter id="sketch-roughness-mini" x="-10%" y="-10%" width="120%" height="120%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                  </defs>

                  {/* Beautiful hand-drawn SVG empty wooden box (No dynamic filters for 100% rendering stability) */}
                  <g stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    {/* 1. Wood Lid backboard (interior open surface of the empty lid rotated up) */}
                    <polygon points="45,110 225,75 270,5 110,20" />
                    
                    {/* Inside recessed panel of empty wood lid */}
                    <polygon points="53,105 217,73 258,15 116,27" fill="currentColor" fillOpacity="0.04" />
                    
                    {/* Wood Lid Rim thicknesses */}
                    <polygon points="110,20 270,5 264,0 104,15" />
                    <polygon points="45,110 110,20 104,15 39,105" />

                    {/* Inside deep hollow shadow cavity of the bottom box showing it is empty */}
                    <polygon points="45,110 115,150 295,100 225,75" fill="currentColor" fillOpacity="0.1" />

                    {/* 2. Bottom wooden box outer shell walls */}
                    {/* Left flank face of the box */}
                    <polygon points="45,110 115,150 115,215 45,175" fill="white" />
                    {/* Front face of the box (wide wood panel) */}
                    <polygon points="115,150 295,100 295,165 115,215" fill="white" />

                    {/* Fine wavy hand-drawn wood grains on bottom box */}
                    <path d="M 52,120 Q 55,145 53,170" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
                    <path d="M 70,128 Q 74,155 72,185" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
                    <path d="M 130,165 Q 190,150 280,118" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
                    <path d="M 135,185 Q 195,170 285,138" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />

                    {/* Wood joint connection is simple and clean without horizontal notched lines */}

                    {/* 3. Elegant hinges / support stays holding empty lid open */}
                    <path d="M 55,116 Q 60,95 75,75" strokeWidth="1.8" />
                    <path d="M 215,80 Q 220,60 235,45" strokeWidth="1.8" />

                    {/* 4. Golden clasp latch lock plate hardware on the front wood face */}
                    <polygon points="198,124 212,121 210,136 196,139" fill="white" strokeWidth="1.4" />
                    <circle cx="201" cy="127" r="1.2" fill="currentColor" />
                    <circle cx="207" cy="125" r="1.2" fill="currentColor" />

                    {/* Golden catch ring plate hanging from the top lid */}
                    <polygon points="182,14 198,12 196,4 180,6" fill="white" />
                    <path d="M 183,14 Q 183,28 189,29 Q 195,30 195,12" strokeWidth="1.6" />

                    {/* Cozily ground the wooden keepsake chest on tabletop */}
                    <path d="M 25,190 L 105,250 M 15,240 L 160,330 M 180,240 L 315,310 M 265,190 L 350,230" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
                  </g>
                </svg>
              </div>

              <span className="text-neutral-400 font-sketch text-lg mb-1">✿</span>
              <h3 className="font-sketch text-[14px] font-black tracking-widest text-neutral-800 uppercase">
                Chest is Empty
              </h3>
              <p className="text-[11px] font-serif-zh font-bold text-neutral-400 tracking-wider mt-1.5 max-w-[210px] leading-relaxed">
                阁下尚未收纳任何手写信札，赶紧回去信箱内抽取奇遇诗篇吧。
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="mt-5 relative focus:outline-none cursor-pointer"
              >
                <HanddrawnCard
                  useButtonMini={true}
                  styleIndex={1}
                  shadowOffset={{ x: 2, y: 2 }}
                  className="px-5 py-2 text-[10px] font-sketch font-bold tracking-widest text-neutral-800"
                >
                  GO EXPLORE
                </HanddrawnCard>
              </motion.button>
            </motion.div>
          ) : (
            /* Listed collected letters */
            <div className="grid grid-cols-1 gap-3.5 pb-2">
              {collectedLetters.map((letter, idx) => {
                const tilts = ['rotate-[-1deg]', 'rotate-[1.2deg]', 'rotate-[-0.8deg]', 'rotate-[1.5deg]'];
                const currentTilt = tilts[idx % tilts.length];
                
                return (
                  <MotionHanddrawnCard
                    key={letter.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -10 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    styleIndex={idx}
                    fillColor="white"
                    className={`p-3.5 flex items-center justify-between gap-3 relative cursor-pointer group hover:bg-neutral-50 transition-all overflow-visible ${currentTilt}`}
                  >
                    {/* Left: Interactive stamp postmark visual mockup */}
                    <div 
                      onClick={() => onOpenLetter(letter)}
                      className="flex-grow flex items-center gap-3"
                    >
                      {/* Round little retro stamp with the theme initials inside */}
                      <div className="w-10 h-10 rounded-full border-[1.2px] border-dashed border-neutral-400 flex items-center justify-center bg-white flex-shrink-0 relative overflow-visible">
                        <span className="font-sketch text-[16px] font-bold text-neutral-500 transform rotate-[-8deg] select-none leading-none">
                          ✎
                        </span>
                        {/* Little wavy postmark lines alongside */}
                        <div className="absolute -right-2 top-2 h-6 w-3 overflow-hidden pointer-events-none opacity-20">
                          <svg width="10" height="20" viewBox="0 0 10 20" fill="none" className="text-neutral-950">
                            <path d="M1 2 Q5 5 1 8 Q5 11 1 14 Q5 17 1 20" stroke="currentColor" strokeWidth="1" />
                          </svg>
                        </div>
                      </div>

                      {/* Info lines */}
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-1.5 flex-nowrap">
                          <span className="font-sketch text-[10px] font-extrabold text-neutral-500 uppercase tracking-wide leading-none">
                            {letter.dateStr}
                          </span>
                          <span className="text-[10px] text-neutral-300 leading-none select-none">•</span>
                          <span className="font-sketch text-[11px] font-bold text-neutral-700 leading-none">
                            No. {letter.id}
                          </span>
                        </div>
                        
                        <p className="text-[14px] font-sketch font-black text-neutral-900 mt-1.5 leading-none uppercase tracking-wide">
                          {letter.word} ({letter.wordMeaning})
                        </p>
                        
                        <p className="text-[10px] font-serif-zh text-neutral-400 font-bold leading-none mt-1.5 line-clamp-1 truncate max-w-[210px]">
                          {letter.postmark}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions button block */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Read button */}
                      <button
                        onClick={() => onOpenLetter(letter)}
                        className="w-7 h-7 rounded-sm border-[1.2px] border-neutral-950 bg-white hover:bg-neutral-50 text-neutral-900 flex items-center justify-center transition-all shadow-[1.5px_1.5px_0px_rgba(23,23,23,0.15)] active:translate-y-0.5 active:shadow-none cursor-pointer"
                        title="查看信件"
                      >
                        <BookOpen size={11} className="stroke-[1.3]" />
                      </button>

                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveLetter(letter);
                        }}
                        className="w-7 h-7 rounded-sm border-[1.2px] border-neutral-950 bg-white hover:bg-red-50 hover:text-red-600 text-neutral-400 flex items-center justify-center transition-all shadow-[1.5px_1.5px_0px_rgba(23,23,23,0.15)] active:translate-y-0.5 active:shadow-none cursor-pointer"
                        title="移出收纳箱"
                      >
                        <Trash2 size={11} className="stroke-[1.3]" />
                      </button>
                    </div>

                    {/* Delicate hand-crafted sticker ornament */}
                    {idx === 0 && (
                      <span className="absolute -top-2 px-1.5 py-0.5 bg-neutral-950 text-white font-sketch text-[8px] tracking-widest font-extrabold left-4 rotate-[2deg] rounded-sm leading-none">
                        MY TRNK
                      </span>
                    )}

                  </MotionHanddrawnCard>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Drawer Sloganeer */}
      <div className="text-center pt-2 select-none border-t-[1.2px] border-dashed border-neutral-300">
        <span className="inline-flex items-center gap-1 text-[9px] font-sketch font-bold tracking-widest text-neutral-400 uppercase">
          <Sparkles size={8} />
          <span>Every poem stamps a trace in gravity</span>
        </span>
      </div>

    </div>
  );
}
