import React from 'react';
import { motion } from 'motion/react';
import { Mail, Compass, Star } from 'lucide-react';

interface LetterEnvelopeProps {
  isOpen: boolean;
  onOpen: () => void;
  dateStr: string;
  themeLabel?: string;
}

export default function LetterEnvelope({ isOpen, onOpen, dateStr, themeLabel = "Secret Letter" }: LetterEnvelopeProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-4 py-8">
      {/* Interactive Envelope with dynamic 3D-like hover/tap effects */}
      <motion.div
        whileHover={!isOpen ? { scale: 1.02, y: -4 } : {}}
        whileTap={!isOpen ? { scale: 0.98 } : {}}
        onClick={!isOpen ? onOpen : undefined}
        className={`relative w-[280px] h-[190px] rounded-lg transition-all duration-700 cursor-pointer ${
          isOpen ? 'shadow-sm' : 'shadow-[0_12px_24px_rgba(45,42,38,0.08)]'
        }`}
        id="physical-envelope"
      >
        {/* Rear wall of envelope */}
        <div className="absolute inset-0 bg-[#E8E1D5] rounded-lg border border-[#DDD5C7] overflow-hidden">
          {/* Subtle paper back grain */}
          <div className="absolute inset-0 opacity-[0.1] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-100 to-neutral-900" />
        </div>

        {/* The Folded Letter paper content sticking out (Only partially visible when closed or fully sliding out when opened) */}
        <motion.div
          animate={
            isOpen 
              ? { y: -80, scale: 0.95, opacity: [0.7, 1] } 
              : { y: 0, scale: 0.88, opacity: 0.4 }
          }
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-4 bottom-5 h-[140px] bg-[#FCFAF5] rounded-md border border-[#ECE6DB] shadow-sm flex flex-col p-4 justify-between z-15 pointer-events-none select-none"
        >
          <div className="border-b border-[#EBE3D4] pb-1 flex justify-between items-center">
            <span className="font-serif-en italic text-[11px] text-[#A69E8F]">Dear you,</span>
            <span className="w-2 h-2 rounded-full bg-[#8A9A84]/40" />
          </div>
          <div className="space-y-1.5 flex-1 pt-3.5">
            <div className="w-[85%] h-1.5 bg-[#EFECE3] rounded-sm" />
            <div className="w-[60%] h-1.5 bg-[#EFECE3] rounded-sm" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="w-[25%] h-1.5 bg-[#EFECE3] rounded-sm" />
            <span className="text-[9px] font-sans-ui text-[#C8C2B5]">···</span>
          </div>
        </motion.div>

        {/* Envelope Side folds (drawn via absolute vectors inside the envelope compartment) */}
        <div className="absolute inset-x-0 bottom-0 h-[100px] z-20 pointer-events-none">
          <svg className="w-full h-full drop-shadow-[0_-1px_3px_rgba(0,0,0,0.04)]" viewBox="0 0 280 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100 L120 45 C132 40, 148 40, 160 45 L280 100" fill="#EADBC8" stroke="#DCD0BD" strokeWidth="1" />
            <path d="M0 0 L105 52 C115 57, 125 57, 135 52 L280 0 L280 100 L0 100 Z" fill="#F4EAE0" opacity="0.15" />
          </svg>
        </div>

        {/* Inside Pocket flap (Bottom Overlapping triangle) */}
        <div className="absolute inset-x-0 bottom-0 h-[110px] z-20 pointer-events-none">
          <svg className="w-full h-full drop-shadow-[0_-2px_4px_rgba(40,30,20,0.03)]" viewBox="0 0 280 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 110 L122 25 C131 20, 149 20, 158 25 L280 110 Z" fill="#E6DAC9" stroke="#DDD1BF" strokeWidth="1" />
          </svg>
        </div>

        {/* Vintage Post Stamp / Mark on top of cover folds */}
        <div className="absolute right-4 bottom-5 bg-[#FCFAF5] w-9 h-11 border border-dashed border-[#C0B5A1] flex flex-col items-center justify-between p-1 shadow-sm rotate-[12deg] z-21 select-none pointer-events-none">
          <div className="w-full h-4 bg-[#8A9A84]/25 rounded-xs flex items-center justify-center">
            <Compass size={8} className="text-[#84957D]" />
          </div>
          <span className="text-[7px] font-mono scale-[0.8] text-[#908775]">{dateStr.replace(' ', '')}</span>
        </div>

        {/* Vintage Round Wax Stamp (Simulating opening mechanism handle) */}
        <div className="absolute left-[140px] -translate-x-1/2 bottom-8 z-25 pointer-events-none">
          <motion.div
            animate={isOpen ? { scale: 0.8, opacity: 0.1, y: 15 } : { scale: 1, opacity: 1, y: 0 }}
            className="w-10 h-10 rounded-full bg-[#A26D68] shadow-[0_2px_8px_rgba(162,109,104,0.3)] border-2 border-[#915B56] flex items-center justify-center text-[#F5EDE8] relative"
          >
            {/* Elegant stamp design watermark internal symbol */}
            <div className="absolute inset-0.5 rounded-full border border-dashed border-[#F5EDE8]/40" />
            <span className="text-[8px] tracking-widest font-serif-en opacity-80 scale-[0.85] font-semibold text-center leading-none">POEM</span>
          </motion.div>
        </div>

        {/* Envelope Top Lid (Flap) - Animates opening via rotation pivot */}
        <motion.div
          style={{ originY: 0 }}
          animate={isOpen ? { rotateX: 180, zIndex: 5, filter: 'brightness(95%)' } : { rotateX: 0, zIndex: 30 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-x-0 top-0 h-[92px] pointer-events-none"
        >
          {/* Outer Side of Envelope flap */}
          <svg className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.06)]" viewBox="0 0 280 92" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0 L124 81 C133 87, 147 87, 156 81 L280 0 Z" fill="#F0E5D5" stroke="#DDD2C1" strokeWidth="1" />
          </svg>
        </motion.div>

        {/* Soft handwriting style adressee note on front of envelope */}
        <div className="absolute left-6 top-8 z-22 pointer-events-none select-none">
          <p className="font-serif-en italic text-[#908676] text-[13px] tracking-wider font-medium opacity-80">
            Dear You,
          </p>
          <p className="font-serif-zh text-[9px] text-[#A89F90] tracking-widest pl-1 mt-0.5 font-light">
            今日小诗寄阅
          </p>
        </div>

        {/* Today's postmark date in small badge on front of envelope */}
        <div className="absolute left-6 bottom-4 z-22 pointer-events-none select-none opacity-45 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B0A695]/70" />
          <span className="text-[8px] font-sans-ui text-[#908775] tracking-widest font-semibold uppercase">{themeLabel}</span>
        </div>
      </motion.div>

      {/* Visual touch feedback button */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5], y: [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 2.8 }}
          onClick={onOpen}
          className="mt-6 text-xs text-[#8F816C] font-serif-zh tracking-widest flex items-center gap-1.5 outline-none font-light cursor-pointer active:scale-95"
          id="tap-to-open-prompt"
        >
          <span>Tap to open today’s letter</span>
          <span className="text-[10px] text-[#B0A593]">/</span>
          <span>轻触信封展阅今日诗</span>
        </motion.button>
      )}
    </div>
  );
}
