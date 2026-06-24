import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, BookOpen, Sparkles, ArrowLeft } from 'lucide-react';
import { PoemLetter } from '../types';
import HanddrawnCard from './HanddrawnCard';
import KeepsakeBox from './KeepsakeBox';

interface CabinetViewProps {
  collectedLetters: PoemLetter[];
  onOpenLetter: (letter: PoemLetter) => void;
  onRemoveLetter: (letter: PoemLetter) => void;
  onBack: () => void;
}

const MotionHanddrawnCard = motion(HanddrawnCard);

const getStampStyle = (postmark: string) => {
  const match = postmark.match(/^(\S+)\s+(.+)$/);
  const emoji = match ? match[1] : "✉️";
  const name = match ? match[2] : postmark;

  let bg = "#F3F7FA";
  let border = "#D0E1ED";
  let textHex = "#52758E";
  let textColor = "text-sky-850";
  let badgeBg = "bg-sky-50";
  let badgeBorder = "border-sky-200/60";
  
  if (postmark.includes("Rain") || postmark.includes("Water")) {
    bg = "#EBF4F9";
    border = "#B8D7EB";
    textHex = "#315F7D";
    textColor = "text-sky-800";
    badgeBg = "bg-sky-50";
    badgeBorder = "border-sky-200";
  } else if (postmark.includes("Rest") || postmark.includes("Sanctuary")) {
    bg = "#F6F4ED";
    border = "#D5CEB8";
    textHex = "#645E44";
    textColor = "text-amber-850";
    badgeBg = "bg-amber-50/60";
    badgeBorder = "border-amber-200/50";
  } else if (postmark.includes("Station") || postmark.includes("Midnight") || postmark.includes("Silent")) {
    bg = "#EFF0FF";
    border = "#C0C9FA";
    textHex = "#394EAC";
    textColor = "text-indigo-800";
    badgeBg = "bg-indigo-50/60";
    badgeBorder = "border-indigo-150";
  } else if (postmark.includes("Valley") || postmark.includes("Whisper") || postmark.includes("Breeze") || postmark.includes("Wanderer") || postmark.includes("Path") || postmark.includes("Forest")) {
    bg = "#EFF7F1";
    border = "#C9EAD0";
    textHex = "#2E693B";
    textColor = "text-emerald-800";
    badgeBg = "bg-emerald-50";
    badgeBorder = "border-emerald-200";
  } else if (postmark.includes("Hour") || postmark.includes("Hub") || postmark.includes("Golden") || postmark.includes("Anchor")) {
    bg = "#FFF0EE";
    border = "#FACDC5";
    textHex = "#AF4433";
    textColor = "text-rose-800";
    badgeBg = "bg-rose-50";
    badgeBorder = "border-rose-200";
  } else if (postmark.includes("Quiet") || postmark.includes("Corner")) {
    bg = "#FAFAF9";
    border = "#D6D6D4";
    textHex = "#5E5F5D";
    textColor = "text-stone-700";
    badgeBg = "bg-stone-50";
    badgeBorder = "border-stone-200";
  } else if (postmark.includes("Sky") || postmark.includes("Freedom")) {
    bg = "#ECFAFA";
    border = "#BEE6E6";
    textHex = "#296A6A";
    textColor = "text-teal-800";
    badgeBg = "bg-teal-50";
    badgeBorder = "border-teal-200";
  }

  return { emoji, name, bg, border, textHex, textColor, badgeBg, badgeBorder };
};

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
              className="w-full flex flex-col items-center justify-center py-2 px-4 text-center overflow-visible"
            >
              {/* Premium hand-drawn empty box based on physical photo reference */}
              <KeepsakeBox
                collectedLetters={[]}
                onOpenLetter={onOpenLetter}
                className="w-full max-w-[230px] mb-2"
              />

              <span className="text-neutral-400 font-sketch text-lg mb-1">✿</span>
              <h3 className="font-sketch text-[13px] font-black tracking-widest text-neutral-800 uppercase">
                Chest is Empty
              </h3>
              <p className="text-[10px] font-serif-zh font-bold text-neutral-400 tracking-wider mt-1.5 max-w-[240px] leading-relaxed">
                阁下尚未收纳任何手写信札，赶紧回去信箱内抽取奇遇诗篇并收藏于此吧。
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="mt-4 relative focus:outline-none cursor-pointer"
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
            <motion.div
              key="active-cabinet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col gap-4 overflow-visible"
            >
              {/* Premium hand-drawn elegant active box based on physical photo reference */}
              <KeepsakeBox
                collectedLetters={collectedLetters}
                onOpenLetter={onOpenLetter}
                className="w-full max-w-[220px] mx-auto opacity-100 mb-1"
              />

              {/* Fine handwritten divider */}
              <div className="flex items-center gap-2.5 w-full px-1.5 select-none animate-fade-in">
                <div className="flex-grow h-[1.2px] border-b border-dashed border-neutral-300" />
                <span className="font-sketch text-[8.5px] font-extrabold text-neutral-400 tracking-wider">
                  COLLECTION FEED ↴
                </span>
                <div className="flex-grow h-[1.2px] border-b border-dashed border-neutral-300" />
              </div>

              <div className="grid grid-cols-1 gap-3.5 pb-2">
              {collectedLetters.map((letter, idx) => {
                const tilts = ['rotate-[-1deg]', 'rotate-[1.2deg]', 'rotate-[-0.8deg]', 'rotate-[1.5deg]'];
                const currentTilt = tilts[idx % tilts.length];
                const stamp = getStampStyle(letter.postmark);
                
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
                    className={`py-3.5 pl-6 pr-5 flex items-center justify-between gap-3 relative cursor-pointer group hover:bg-neutral-50 transition-all overflow-visible ${currentTilt}`}
                  >
                    {/* Left: Interactive content list link without stamp */}
                    <div 
                      onClick={() => onOpenLetter(letter)}
                      className="flex-grow flex items-center gap-2"
                    >
                      {/* Info lines */}
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-1.5 flex-nowrap">
                          <span className="font-sketch text-[10px] font-extrabold text-neutral-400 uppercase tracking-wide leading-none">
                            {letter.dateStr}
                          </span>
                          <span className="text-[10px] text-neutral-300 leading-none select-none">•</span>
                          <span className="font-sketch text-[11px] font-bold text-neutral-500 leading-none">
                            No. {letter.id}
                          </span>
                        </div>
                        
                        <p className="text-[13.5px] font-sketch font-black text-neutral-900 mt-1.5 leading-none uppercase tracking-wide">
                          {letter.word} ({letter.wordMeaning})
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

                  </MotionHanddrawnCard>
                );
              })}
            </div>
          </motion.div>
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
