import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import HanddrawnCard from './HanddrawnCard';

interface MailboxWallProps {
  onPullOut: (mood?: string) => void;
  favoritesCount: number;
  onOpenBox: () => void;
}

const MotionHanddrawnCard = motion(HanddrawnCard);

export default function MailboxWall({
  onPullOut,
  favoritesCount,
  onOpenBox,
}: MailboxWallProps) {
  
  // Design: 1 Main Mailbox ("Today's Letter" - more vivid, thicker border, peeking paper, bouncing TODAY badge)
  // + 5 mood-themed interactive mailboxes (dimmer/quieter styling, but fully interactive and clickable)
  // Layout requested: 2 columns x 3 rows grid in this exact arrangement sequence:
  // Row 1: Left = Soft Landing, Right = Quiet Room
  // Row 2: Left = Rain Note, Right = Today’s Letter (Main)
  // Row 3: Left = Far Away, Right = Little Glow
  const slots = [
    {
      num: '01',
      name: 'Soft Landing',
      zh: '温柔着陆',
      mood: 'tired',
      rotateClass: 'rotate-[-1.8deg]',
      styleIndex: 0,
      isMain: false,
    },
    {
      num: '02',
      name: 'Quiet Room',
      zh: '安静角落',
      mood: 'quiet',
      rotateClass: 'rotate-[1.6deg]',
      styleIndex: 1,
      isMain: false,
    },
    {
      num: '03',
      name: 'Rain Note',
      zh: '下雨日记',
      mood: 'rainy',
      rotateClass: 'rotate-[-1.2deg]',
      styleIndex: 2,
      isMain: false,
    },
    {
      num: '11', // Special classic mailbox index number
      name: "Today's Letter",
      zh: '今日来信',
      mood: 'today',
      rotateClass: 'rotate-[2.2deg]',
      styleIndex: 3,
      isMain: true,
    },
    {
      num: '04',
      name: 'Far Away',
      zh: '去往远方',
      mood: 'escape',
      rotateClass: 'rotate-[-2.4deg]',
      styleIndex: 4,
      isMain: false,
    },
    {
      num: '05',
      name: 'Little Glow',
      zh: '微光闪烁',
      mood: 'happy',
      rotateClass: 'rotate-[1.4deg]',
      styleIndex: 5,
      isMain: false,
    },
  ];

  return (
    <div className="w-full flex-1 flex flex-col justify-between py-2 text-left select-none bg-white">
      
      {/* Upper branding / hand-drawn touch header */}
      <div className="text-center my-3 select-none relative">
        {/* Hand-drawn Smiley / Crown Floating Doodle illustration on margins */}
        <div className="absolute top-0 right-3 opacity-80 pointer-events-none scale-90 hidden sm:block">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-neutral-900 animate-gentle-float">
            <path d="M10 25 C14 32, 26 32, 30 25" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="14" cy="18" r="2.5" fill="currentColor" />
            <circle cx="26" cy="18" r="2.5" fill="currentColor" />
            <path d="M22 17 Q25 21 21 21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>

        <div className="absolute top-[-8px] left-3 opacity-80 pointer-events-none scale-90 hidden sm:block">
          <svg width="35" height="30" viewBox="0 0 35 30" fill="none" className="text-neutral-900 rotate-[-12deg]">
            {/* Hand-drawn crown outline */}
            <path d="M5 25 L8 10 L15 18 L22 8 L27 18 L30 25 Z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="8" cy="8" r="2" fill="currentColor" />
            <circle cx="22" cy="6" r="2" fill="currentColor" />
            <circle cx="30" cy="23" r="1.5" fill="currentColor" />
            <path d="M4 25 C12 28, 24 28, 31 25" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-neutral-50 sketch-border-sm text-[11px] text-neutral-900 font-sketch font-bold tracking-widest mb-3"
        >
          <Sparkles size={11} className="text-neutral-900" />
          <span>DAILY POST OFFICE</span>
        </motion.div>
        
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 font-sketch">
          Daily Poetry Mailbox
        </h2>
        <h3 className="text-xs text-neutral-500 font-serif-zh tracking-widest mt-1.5 font-bold">
          你有一封今日来信 · 触碰抽信
        </h3>
      </div>

      {/* Retro Line-Art Mailbox Grid (Exactly 2 columns x 3 rows) */}
      <div className="my-3 grid grid-cols-2 gap-4 px-1" id="line-art-mailbox-grid">
        {slots.map((slot) => {
          if (slot.isMain) {
            // TODAY's LETTER - Highlighted principal mailbox with floating animation, deeper strokes, and bouncy badge
            return (
              <motion.div
                key={slot.num}
                animate={{
                  y: [-2, 2, -2],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut"
                }}
                className={`${slot.rotateClass} relative overflow-visible`}
              >
                <MotionHanddrawnCard
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onPullOut(slot.mood)}
                  styleIndex={slot.styleIndex}
                  fillColor="white"
                  strokeColor="#000000" // Thicker deeper border
                  shadowColor="#171717" // Deeper shadow stamp
                  shadowOffset={{ x: 5, y: 5 }}
                  className="relative p-4 min-h-[148px] flex flex-col justify-between cursor-pointer group transition-all overflow-visible ring-1 ring-neutral-950/5"
                  id={`mailbox-slot-${slot.num}`}
                >
                  {/* Physical line-art slot flap */}
                  <div className="w-full border-b-[2px] border-dashed border-neutral-950 pb-2">
                    <HanddrawnCard
                      useMini={true}
                      styleIndex={1}
                      fillColor="#f7f7f7"
                      strokeColor="#000000"
                      shadowOffset={{ x: 2, y: 2 }}
                      className="relative w-full h-8 flex items-center justify-center overflow-visible"
                    >
                      {/* Dark depth slit inside mailbox */}
                      <div className="w-[85%] h-2.5 bg-neutral-950 rounded-full relative overflow-visible flex items-center justify-center">
                        
                        {/* PEEKING LETTER PAPER EDGE slipping out MUCH more! */}
                        <motion.div
                          animate={{
                            y: [0, 8, 0],
                            rotate: [-3, 4, -3]
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 3.5,
                            ease: "easeInOut"
                          }}
                          className="absolute -bottom-8 w-[82%] h-14 pointer-events-none select-none overflow-hidden"
                          style={{ originY: 0 }}
                        >
                          <HanddrawnCard
                            useMini={true}
                            styleIndex={2}
                            shadowOffset={{ x: 1.5, y: 1.5 }}
                            className="w-full h-full flex flex-col justify-start p-1 bg-white border border-neutral-200"
                          >
                            <div className="border-b border-neutral-300 pb-0.5 flex justify-between items-center mb-0.5">
                              <span className="font-sketch text-[8px] text-neutral-950 scale-[0.8] leading-none font-bold">For You ✉</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            </div>
                            <div className="space-y-0.5 mt-0.5">
                              <div className="w-full h-0.5 bg-neutral-400" />
                              <div className="w-[75%] h-0.5 bg-neutral-400" />
                            </div>
                          </HanddrawnCard>
                        </motion.div>

                      </div>
                    </HanddrawnCard>
                  </div>



                  {/* Title & Number */}
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex flex-col text-left">
                      <span className="text-[12.5px] uppercase font-sketch tracking-wider font-extrabold text-neutral-950">
                        {slot.name}
                      </span>
                      <span className="text-[9.5px] font-serif-zh font-bold text-neutral-500 leading-none mt-0.5">
                        {slot.zh}
                      </span>
                    </div>
                    <span className="font-sketch text-4.5xl font-black text-neutral-950 tracking-tighter leading-none select-none">
                      {slot.num}
                    </span>
                  </div>


                </MotionHanddrawnCard>
              </motion.div>
            );
          } else {
            // General mood mailbox: Quieter/paler color tones, but fully clickable & interactive
            return (
              <MotionHanddrawnCard
                key={slot.num}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onPullOut(slot.mood)}
                styleIndex={slot.styleIndex}
                fillColor="white"
                strokeColor="#999999" // quieter softer border
                shadowColor="#efefef" // lighter soft shadow
                shadowOffset={{ x: 2.5, y: 2.5 }}
                className={`relative ${slot.rotateClass} p-4 min-h-[145px] flex flex-col justify-between cursor-pointer group transition-all duration-300 overflow-visible opacity-85 hover:opacity-100 hover:shadow-xs`}
                id={`mailbox-slot-${slot.num}`}
              >
                {/* Physical line-art slot flap with a soft border line */}
                <div className="w-full border-b border-dashed border-neutral-300 group-hover:border-neutral-500 pb-2 transition-colors duration-300">
                  <HanddrawnCard
                    useMini={true}
                    styleIndex={4}
                    fillColor="#fcfcfc"
                    strokeColor="#c0c0c0"
                    shadowOffset={{ x: 1, y: 1 }}
                    className="w-full h-8 flex items-center justify-center bg-neutral-50/20"
                  >
                    {/* Soft quiet depth slit inner area */}
                    <div className="w-[85%] h-1.5 bg-neutral-300 group-hover:bg-neutral-800 rounded-full transition-colors duration-300 relative overflow-visible flex items-center justify-center">
                      
                      {/* Quiet peeking page outline */}
                      <div className="absolute -bottom-4 w-[75%] h-6 pointer-events-none select-none overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-full h-full bg-white border border-neutral-200 p-0.5 rounded-xs">
                          <div className="w-[50%] h-0.5 bg-neutral-300 mb-0.5" />
                          <div className="w-[30%] h-0.5 bg-neutral-300" />
                        </div>
                      </div>

                    </div>
                  </HanddrawnCard>
                </div>



                {/* Bottom headers (Soft grey to look calmer and quieter, but lights up beautifully on mouse hover) */}
                <div className="flex justify-between items-end mt-4">
                  <div className="flex flex-col text-left">
                    <span className="text-[11.5px] uppercase font-sketch tracking-wider font-bold text-neutral-500 group-hover:text-neutral-900 transition-colors duration-300">
                      {slot.name}
                    </span>
                    <span className="text-[9.5px] font-serif-zh font-bold text-neutral-400 group-hover:text-neutral-600 transition-colors duration-300 leading-none mt-0.5">
                      {slot.zh}
                    </span>
                  </div>
                  <span className="font-sketch text-3.5xl font-extrabold text-neutral-400 group-hover:text-neutral-900 transition-colors duration-300 tracking-tighter leading-none select-none">
                    {slot.num}
                  </span>
                </div>
              </MotionHanddrawnCard>
            );
          }
        })}
      </div>

    </div>
  );
}
