import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import HanddrawnCard from './HanddrawnCard';

interface MailboxWallProps {
  onPullOut: () => void;
  favoritesCount: number;
  onOpenBox: () => void;
}

const MotionHanddrawnCard = motion(HanddrawnCard);

export default function MailboxWall({
  onPullOut,
  favoritesCount,
  onOpenBox,
}: MailboxWallProps) {
  // Line-art style mailbox slots
  // Box 11 is the active one with a keyhole, elegant number '11', name 'YOU' or 'MÜLLER'
  // and an animated letter edge popping out of the slot!
  // Box 15 is now an active Archive Trigger for opening user's collected mailbox!
  const slots = [
    { num: '06', name: 'BREEZE', closed: true, rotateClass: 'rotate-[-2.2deg]', styleIndex: 0 },
    { num: '08', name: 'SILENCE', closed: true, rotateClass: 'rotate-[1.6deg]', styleIndex: 1 },
    { num: '09', name: 'SHADOW', closed: true, rotateClass: 'rotate-[-1.4deg]', styleIndex: 2 },
    { num: '11', name: 'MÜLLER', closed: false, active: true, rotateClass: 'rotate-[2.5deg]', styleIndex: 3 }, // The active letter slot
    { num: '12', name: 'WIND', closed: true, rotateClass: 'rotate-[-1.8deg]', styleIndex: 4 },
    { num: '15', name: 'ARCHIVE', closed: true, rotateClass: 'rotate-[1.2deg]', styleIndex: 5 }, // Inactive closed slot
  ];

  return (
    <div className="w-full flex-1 flex flex-col justify-between py-2 text-left select-none bg-white">
      
      {/* Upper branding / hand-drawn touch header */}
      <div className="text-center my-3 select-none relative">
        {/* Hand-drawn Smiley / Crown Floating Doodle illustration on margins (Vibe of HEYTEA match illustration) */}
        <div className="absolute top-0 right-3 opacity-80 pointer-events-none scale-90 hidden sm:block">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-neutral-900 animate-gentle-float">
            <path d="M10 25 C14 32, 26 32, 30 25" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="14" cy="18" r="2.5" fill="currentColor" />
            <circle cx="26" cy="18" r="2.5" fill="currentColor" />
            <path d="M22 17 Q25 21 21 21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>

        <div className="absolute top-(-8px) left-3 opacity-80 pointer-events-none scale-90 hidden sm:block">
          <svg width="35" height="30" viewBox="0 0 35 30" fill="none" className="text-neutral-900 rotate-[-12deg]">
            {/* Hand-drawn crown outline (Matches Heytea Crown style) */}
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

      {/* Retro Line-Art Mailbox Grid */}
      <div className="my-4 grid grid-cols-2 gap-4 px-1" id="line-art-mailbox-grid">
        {slots.map((slot, index) => {
          if (slot.active) {
            return (
              <MotionHanddrawnCard
                key={slot.num}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onPullOut}
                styleIndex={slot.styleIndex}
                fillColor="white"
                className={`relative ${slot.rotateClass} p-4 min-h-[145px] flex flex-col justify-between cursor-pointer group transition-all overflow-visible`}
                id="active-mailbox-slot"
              >
                {/* Physical line-art slot flap */}
                <div className="w-full border-b-2 border-dashed border-neutral-900 pb-2">
                  {/* GENERAL ACTIVE SLOT: Letter flap */}
                  <HanddrawnCard
                    useMini={true}
                    styleIndex={1}
                    fillColor="#f5f5f5"
                    shadowOffset={{ x: 1.5, y: 1.5 }}
                    className="relative w-full h-8 flex items-center justify-center overflow-visible"
                  >
                    {/* Dark depth slit inside mailbox */}
                    <div className="w-[85%] h-2 bg-neutral-900 rounded-full relative overflow-visible flex items-center justify-center">
                      
                      {/* PEEKING LETTER PAPER EDGE slipping out from slit */}
                      <motion.div
                        animate={{
                          y: [0, 6, 0],
                          rotate: [-4, 3, -4]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 3,
                          ease: "easeInOut"
                        }}
                        className="absolute -bottom-6 w-[80%] h-11 pointer-events-none select-none overflow-hidden"
                        style={{ originY: 0 }}
                      >
                        <HanddrawnCard
                          useMini={true}
                          styleIndex={2}
                          shadowOffset={{ x: 1, y: 1 }}
                          className="w-full h-full flex flex-col justify-start p-1 bg-white"
                        >
                          {/* Fake handwritten note content */}
                          <div className="border-b border-neutral-200 pb-0.5 flex justify-between items-center mb-0.5">
                            <span className="font-sketch text-[7px] text-neutral-500 scale-[0.8] leading-none font-bold">For You</span>
                            <span className="w-1 h-1 rounded-full bg-neutral-900" />
                          </div>
                          <div className="space-y-0.5">
                            <div className="w-full h-0.5 bg-neutral-300" />
                            <div className="w-[60%] h-0.5 bg-neutral-300" />
                          </div>
                        </HanddrawnCard>
                      </motion.div>

                    </div>
                  </HanddrawnCard>
                </div>

                {/* Left Mini Keyhole Outline */}
                <div className="absolute left-4 top-18 w-3.5 h-3.5 rounded-full border-[1.2px] border-neutral-900 flex items-center justify-center bg-white rotate-12">
                  <div className="w-1 h-1 rounded-full bg-neutral-900" />
                </div>

                {/* Subtitle / Big Number */}
                <div className="flex justify-between items-end mt-4">
                  <span className="text-[12px] uppercase font-sketch tracking-wider font-extrabold text-neutral-900">
                    {slot.name}
                  </span>
                  <span className="font-sketch text-4xl font-black text-neutral-900 tracking-tighter">
                    {slot.num}
                  </span>
                </div>

                {/* NEW tag / hand drawn star floating */}
                <span className="absolute -top-3 -right-2 bg-neutral-950 text-white text-[9px] font-sketch font-bold px-2.5 py-1 rounded-full border-[1.2px] border-neutral-950 shadow-xs animate-bounce rotate-[10deg]">
                  TODAY
                </span>
              </MotionHanddrawnCard>
            );
          } else {
            // Inactive slots
            return (
              <HanddrawnCard
                key={slot.num}
                isInactive={true}
                styleIndex={slot.styleIndex}
                className={`relative ${slot.rotateClass} p-4 min-h-[145px] flex flex-col justify-between opacity-55`}
              >
                {/* Closed slot mailflap */}
                <div className="w-full border-b-2 border-dashed border-neutral-300 pb-2">
                  <HanddrawnCard
                    useMini={true}
                    styleIndex={4}
                    isInactive={true}
                    shadowOffset={{ x: 1, y: 1 }}
                    className="w-full h-8 flex items-center justify-center bg-neutral-100/50"
                  >
                    <div className="w-[85%] h-2 bg-neutral-300 rounded-full" />
                  </HanddrawnCard>
                </div>

                {/* Keyhole */}
                <div className="absolute left-4 top-18 w-3 h-3 rounded-full border-[1.2px] border-neutral-300 flex items-center justify-center bg-[#fafafa]">
                  <div className="w-1 h-1 rounded-full bg-neutral-300" />
                </div>

                {/* Bottom title */}
                <div className="flex justify-between items-end mt-4 animate-pulse">
                  <span className="text-[11px] uppercase font-sketch tracking-wider font-semibold text-neutral-400">
                    {slot.name}
                  </span>
                  <span className="font-sketch text-4.5xl font-bold text-neutral-300 tracking-tighter">
                    {slot.num}
                  </span>
                </div>
              </HanddrawnCard>
            );
          }
        })}
      </div>

    </div>
  );
}
