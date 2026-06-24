import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PoemLetter } from '../types';

interface KeepsakeBoxProps {
  collectedLetters: PoemLetter[];
  onOpenLetter: (letter: PoemLetter) => void;
  className?: string;
}

export default function KeepsakeBox({
  collectedLetters,
  onOpenLetter,
  className = '',
}: KeepsakeBoxProps) {
  const [hoveredLetter, setHoveredLetter] = useState<PoemLetter | null>(null);

  // We can position up to 4 collected letters as tactile postcards in the pocket
  const cardConfig = [
    { x: 74, y: 72, rotate: -4, color: '#FCFAF5', stroke: '#171717', stampColor: '#DE6B6B' },
    { x: 125, y: 65, rotate: 3, color: '#FDFAF0', stroke: '#171717', stampColor: '#C4A470' },
    { x: 178, y: 58, rotate: -2, color: '#F5FAF3', stroke: '#171717', stampColor: '#758FA1' },
    { x: 232, y: 68, rotate: 5, color: '#FCFBF6', stroke: '#171717', stampColor: '#E6A775' },
  ];

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      
      {/* Floating Interactive Tooltip label */}
      <div className="h-6 mb-1 relative overflow-visible flex items-center justify-center">
        <AnimatePresence>
          {hoveredLetter ? (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -2 }}
              className="px-2.5 py-1 bg-neutral-900 text-white text-[9.5px] font-sketch font-bold uppercase tracking-widest rounded-sm whitespace-nowrap shadow-[2.5px_2.5px_0px_rgba(0,0,0,0.15)] flex items-center gap-1.5 border border-neutral-700"
            >
              <span>No. {hoveredLetter.id}</span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-200">{hoveredLetter.word}</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              className="text-[9px] font-sketch font-extrabold text-neutral-400 tracking-widest uppercase flex items-center gap-1"
            >
              <span>✦ Interactive Keepsake Chest ✦</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The Master Handsketch Chest Vector Canvas */}
      <div className="relative w-full max-w-[340px] flex items-center justify-center overflow-visible">
        <svg
          viewBox="0 0 340 360"
          className="w-full h-auto overflow-visible text-neutral-950"
          style={{ filter: 'drop-shadow(3px 4px 0px rgba(0,0,0,0.03))' }}
        >
          {/* Radial shadow at the bottom for beautiful grounding depth */}
          <ellipse cx="170" cy="342" rx="135" ry="12" fill="currentColor" fillOpacity="0.06" filter="blur(2px)" />

          <defs>
            {/* The beautiful radial gradient for the translucent Amber Glass Lens Orb */}
            <radialGradient id="amber-orb-gradient" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFF1D6" />
              <stop offset="25%" stopColor="#F5C067" />
              <stop offset="65%" stopColor="#C27A2F" />
              <stop offset="92%" stopColor="#753F11" />
              <stop offset="100%" stopColor="#3B1C03" />
            </radialGradient>
          </defs>

          {/* ==================== 1. UPRIGHT LID SECTION ==================== */}
          <g id="wooden-lid-group">
            {/* Woodgrains double shadow line */}
            <path
              d="M 27.5,15 C 95,13.2 165,15.8 240,13.8 C 285,14.2 300,13.5 312.5,15.5 M 27,15 C 95,12.5 165,15.1 240,13.1 C 285,13.5 300,12.8 312,14.8"
              stroke="currentColor"
              strokeWidth="0.8"
              fill="none"
              opacity="0.15"
            />

            {/* 3D Outer border wood thickness rim with wavy, organic coordinates - made thinner and lighter */}
            <path
              d="M 28.5,14 C 95,12.2 165,14.8 240,12.8 C 285,13.2 300,12.5 311.5,14.5 C 313.2,50 310.8,95 311.8,166.5 C 240,167.5 165,164.8 95,166.5 C 55,165.8 40,166.2 28.5,166.5 C 26.8,130 29.2,85 28.5,14 Z"
              fill="#FAF9F6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Fine double stroke sketch accent on the outer perimeter */}
            <path
              d="M 27,12 C 95,10.2 165,12.8 240,10.8 C 285,11.2 300,10.5 313,12.5 M 313.5,15 C 315.2,50 312.8,95 313.8,168.5 M 313,168.5 C 240,169.5 165,166.8 95,168.5 C 55,167.8 40,168.2 27,168.5 M 26.5,15 C 24.8,130 27.2,85 26.5,15"
              stroke="currentColor"
              strokeWidth="0.7"
              fill="none"
              opacity="0.35"
              strokeDasharray="4,2"
            />

            {/* Wooden Lid panel interior (slightly wobbly) - made pure white/soft cream */}
            <path
              d="M 36.5,22 C 100,20.2 200,21.8 260,20.8 C 290,21.2 298,20.5 303.5,22.2 C 304.8,55 303.2,95 303.8,158.5 C 240,159.5 160,157.8 90,159.2 C 55,158.5 44,158.8 36.5,158.5 C 35.2,125 36.8,85 36.5,22 Z"
              fill="#FFFFFF"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Lid Wood grains (fine pencil handsketch style) */}
            <path d="M 42,30 Q 80,24 120,29" stroke="currentColor" strokeWidth="0.5" opacity="0.08" fill="none" />
            <path d="M 220,26 Q 260,32 300,28" stroke="currentColor" strokeWidth="0.5" opacity="0.08" fill="none" />
            <path d="M 45,65 Q 40,95 43,125" stroke="currentColor" strokeWidth="0.5" opacity="0.08" fill="none" />
            <path d="M 292,50 Q 296,85 293,120" stroke="currentColor" strokeWidth="0.5" opacity="0.08" fill="none" />

            {/* Vintage ticket mockup & backgrounds static cards inside lid - made softer pastel */}
            {/* 1. Pastel sky backing card - with wobbly corners */}
            <path
              d="M 45.5,40.5 C 80,37.8 140,34.5 179.5,33.5 C 178.5,65 175.2,100 175.5,124.5 C 140,127.5 80,131.2 41.5,132.5 C 42.5,100 44.5,65 45.5,40.5 Z"
              fill="#E3EAEE"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            
            {/* 2. Authentic Ticketron Vintage Ticket with details */}
            <g id="ticketron-ticket-mockup">
              <path
                d="M 52.5,48.5 C 75,46.5 95,43.5 115.5,42.5 C 114.2,70 111.5,105 111.5,127.5 C 95,129.5 75,131.2 48.5,133.5 C 49.5,105 51.5,70 52.5,48.5 Z"
                fill="#FCFAF7"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
              {/* Ticket inner micro borders (wavy trace) */}
              <path
                d="M 55.5,52.5 C 75,50.5 95,47.5 112.5,46.5 C 111.2,70 108.5,100 108.5,123.5 C 95,125.5 75,127.5 51.5,129.5 C 52.5,100 54.5,70 55.5,52.5 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.7"
                strokeDasharray="2,3"
                opacity="0.4"
              />
              {/* Ticket Logo texts */}
              <text x="78" y="58" transform="rotate(-5, 78, 58)" fontFamily="monospace" fontWeight="bold" fontSize="5.5" fill="currentColor" textAnchor="middle" letterSpacing="0.2">
                TICKETRON
              </text>
              {/* Stars design on Ticket */}
              <text x="78" y="65" transform="rotate(-5, 78, 65)" fontSize="4.5" fill="currentColor" textAnchor="middle" opacity="0.5">
                ★★★
              </text>
              {/* Mock Barcode markings */}
              <path d="M58,85 L58,97 M61,85 L61,97 M63,85 L63,97 M67,85 L67,97 M70,85 L70,97 M72,85 L72,97 M74,85 L74,97 M78,85 L78,97 M81,85 L81,97" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
              <text x="69" y="105" transform="rotate(-5, 69, 105)" fontFamily="monospace" fontSize="3.5" fill="currentColor" opacity="0.4">
                22-06-1926
              </text>
            </g>

            {/* 3. Soft Sand Kraft card background */}
            <path
              d="M 140.5,50.5 C 180,48.2 220,46.5 254.5,45.5 C 253.2,70 250.5,100 250.5,122.5 C 220,124.5 180,126.2 136.5,127.5 C 137.5,100 139.5,70 140.5,50.5 Z"
              fill="#F3EDE2"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            {/* Stamp print on kraft card */}
            <circle cx="225" cy="68" r="8" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1.5,1.5" opacity="0.3" />
            <path d="M 219,68 C 221,65, 229,65, 231,68" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.3" />

            {/* ==================== INTERACTIVE G-CARDS (COLLECTED POEMS) ==================== */}
            {/* We map over collectedLetters and place them in the ocher pocket pocket */}
            {collectedLetters.map((letter, i) => {
              if (i >= 4) return null; // cap at 4 visual cards to prevent extreme overlap on small canvas
              const config = cardConfig[i];
              
              return (
                <motion.g
                  key={letter.id}
                  className="cursor-pointer"
                  whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.2 } }}
                  onClick={() => onOpenLetter(letter)}
                  onMouseEnter={() => setHoveredLetter(letter)}
                  onMouseLeave={() => setHoveredLetter(null)}
                >
                  {/* The Postcard Frame */}
                  <polygon
                    points={`${config.x},${config.y} ${config.x + 55},${config.y - (config.rotate * 0.7)} ${config.x + 51},${config.y + 70} ${config.x - 4},${config.y + 74}`}
                    fill={config.color}
                    stroke={config.stroke}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    style={{ filter: 'drop-shadow(1.5px 2px 2px rgba(0,0,0,0.08))' }}
                  />

                  {/* Stamp placement (Top Right of individual card) */}
                  <rect
                    x={config.x + 40}
                    y={config.y + 5}
                    width="9"
                    height="11"
                    rx="1"
                    fill={config.stampColor}
                    stroke="currentColor"
                    strokeWidth="0.8"
                    opacity="0.85"
                  />
                  {/* Little wavy postmark lines on stamp */}
                  <path
                    d={`M ${config.x + 36},${config.y + 11} Q ${config.x + 40},${config.y + 9} ${config.x + 44},${config.y + 11} Q ${config.x + 48},${config.y + 9} ${config.x + 52},${config.y + 11}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.6"
                    opacity="0.5"
                  />

                  {/* Poem indicator number */}
                  <text
                    x={config.x + 10}
                    y={config.y + 16}
                    fontFamily="monospace"
                    fontWeight="black"
                    fontSize="6.5"
                    fill="currentColor"
                  >
                    N.{letter.id}
                  </text>

                  {/* Fine horizontal handwritten address lines */}
                  <line x1={config.x + 8} y1={config.y + 30} x2={config.x + 46} y2={config.y + 30} stroke="currentColor" strokeWidth="0.6" strokeDasharray="1,1.5" opacity="0.6" />
                  <line x1={config.x + 8} y1={config.y + 38} x2={config.x + 46} y2={config.y + 38} stroke="currentColor" strokeWidth="0.6" strokeDasharray="1,1.5" opacity="0.6" />
                  <line x1={config.x + 8} y1={config.y + 46} x2={config.x + 36} y2={config.y + 46} stroke="currentColor" strokeWidth="0.6" strokeDasharray="1,1.5" opacity="0.6" />

                  {/* Word title labeled on postcard */}
                  <text
                    x={config.x + 24}
                    y={config.y + 58}
                    fontFamily="var(--font-sketch)"
                    fontWeight="bold"
                    fontSize="7"
                    fill="#1A1A1A"
                    textAnchor="middle"
                  >
                    {letter.word}
                  </text>
                </motion.g>
              );
            })}

            {/* Static Envelope if 0 letters exist, guiding user to add some */}
            {collectedLetters.length === 0 && (
              <g opacity="0.75" className="select-none pointer-events-none">
                <polygon
                  points="105,72 170,68 166,132 101,136"
                  fill="#FFF"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <text x="135" y="94" transform="rotate(-3, 135, 94)" fontFamily="var(--font-sketch)" fontSize="7" fill="currentColor" opacity="0.4" textAnchor="middle">
                  EMPTY CABINET
                </text>
                <text x="135" y="104" transform="rotate(-3, 135, 104)" fontSize="4.5" fill="currentColor" opacity="0.5" textAnchor="middle">
                  (暂无收纳信笺)
                </text>
              </g>
            )}

            {/* 4. Elegant Tan Ocher folder/pocket strap covering cards in bottom part of lid (Ref Image 6) - made very pale sand cream */}
            <path
              d="M 36,114 C 90,118 250,118 304,114 L 304,159 L 36,159 Z"
              fill="#EDE5D9"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Shadow overlay/stitching on top edge of pocket */}
            <path
              d="M 36,114 C 90,118 250,118 304,114"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.7"
              strokeDasharray="2,2"
              opacity="0.45"
            />
            {/* Pocket brand text or label "KEEPSAKES & MEMORIES" (As shown in our sketches/photo mockups) */}
            <rect x="75" y="132" width="190" height="15" rx="1.5" fill="#FFFFFF" stroke="currentColor" strokeWidth="0.8" opacity="0.9" />
            <text x="170" y="141" fontFamily="monospace" fontWeight="bold" fontSize="5.2" fill="#2E2B2A" textAnchor="middle" letterSpacing="0.3">
              KEEPSAKES & SECRETS ∙ TRUNK
            </text>
            <text x="170" y="145.5" fontFamily="var(--font-serif-zh)" fontWeight="bold" fontSize="3" fill="#605E5C" textAnchor="middle">
              奇遇集珍 ∙ 阁下收藏之名作
            </text>
          </g>

          {/* ==================== 2. HINGE LINKS ==================== */}
          <g id="box-latch-hinges" opacity="0.95">
            <rect x="75" y="161" width="18" height="7" rx="1" fill="#F0EDE7" stroke="currentColor" strokeWidth="0.9" />
            <line x1="84" y1="161" x2="84" y2="168" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="79" cy="164.5" r="0.6" fill="currentColor" />
            <circle cx="89" cy="164.5" r="0.6" fill="currentColor" />

            <rect x="247" y="161" width="18" height="7" rx="1" fill="#F0EDE7" stroke="currentColor" strokeWidth="0.9" />
            <line x1="256" y1="161" x2="256" y2="168" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="251" cy="164.5" r="0.6" fill="currentColor" />
            <circle cx="261" cy="164.5" r="0.6" fill="currentColor" />
          </g>

          {/* ==================== 3. DEEP BOTTOM BOX SECTION ==================== */}
          <g id="wooden-base-chest">
            {/* The outer box perspective bounding wood shell (Imperfect organic path) */}
            <path
              d="M 22.5,166.5 C 90,165.2 230,167.8 317.5,166.5 C 319.2,210 316.8,270 317.8,339.5 C 230,340.8 90,338.2 22.5,339.5 C 21.2,270 23.8,210 22.5,166.5 Z"
              fill="#FAF9F6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />

            {/* Hand-drawn dual outline outline line for sketchy thickness */}
            <path
              d="M 20.5,164.5 C 90,163.2 230,165.8 319.5,164.5 M 319.8,164.5 C 321.2,210 318.8,270 319.8,341.5 M 319.8,341.5 C 230,342.8 90,340.2 20.5,341.5 M 20.5,341.5 C 19.2,270 21.8,210 20.5,164.5"
              stroke="currentColor"
              strokeWidth="0.6"
              fill="none"
              opacity="0.35"
              strokeDasharray="5,2"
            />

            {/* Inner Recessed Cavity of base trunk - light warm gray-sand */}
            <path
              d="M 30.5,175.5 C 100,174.2 240,176.8 309.5,175.5 C 310.8,210 308.5,250 309.5,283.5 C 240,284.8 100,282.2 30.5,283.5 C 29.2,250 31.5,210 30.5,175.5 Z"
              fill="#E2DBD3"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Cavity deep ambient shadow on floor */}
            <rect x="30" y="175" width="280" height="109" fill="currentColor" fillOpacity="0.04" />

            {/* ==================== COMPARTMENT GRIDS / PARTITIONS ==================== */}
            {/* Horizontal wood beam splitting top and bottom row (wobbly path) - made light sand-dust */}
            <path
              d="M 30.2,216.5 C 100,215.2 240,217.2 309.8,216.5 C 310.2,218.8 309.8,221.2 309.8,223 C 240,223.8 100,222.2 30.2,223 C 30.2,221.2 29.8,218.8 30.2,216.5 Z"
              fill="#D5CDC2"
              stroke="currentColor"
              strokeWidth="0.95"
              strokeLinejoin="round"
            />
            
            {/* Vertical Wood divider separating left-rear and middle-rear */}
            <path
              d="M 125.2,175.2 C 127.5,174.8 129.8,175.2 131.8,175.2 C 132.2,185 131.5,200 131.8,215.8 C 129.5,216.2 127.2,215.8 125.2,215.8 C 124.8,200 125.5,185 125.2,175.2 Z"
              fill="#D5CDC2"
              stroke="currentColor"
              strokeWidth="0.95"
              strokeLinejoin="round"
            />

            {/* Vertical Wood divider separating left-front and center-front */}
            <path
              d="M 125.2,223.5 C 127.5,223.1 130.2,223.5 131.8,223.5 C 132.5,240 131.2,260 131.8,283.5 C 129.5,283.8 127.1,283.5 125.2,283.5 C 124.5,260 125.8,240 125.2,223.5 Z"
              fill="#D5CDC2"
              stroke="currentColor"
              strokeWidth="0.95"
              strokeLinejoin="round"
            />

            {/* Vertical divider separating right column drawer shelf from left rows */}
            <path
              d="M 220.2,175.5 C 222.5,175.1 224.8,175.5 226.8,175.5 C 227.5,200 226.2,240 226.8,283.5 C 224.5,283.8 222.2,283.5 220.2,283.5 C 219.5,240 220.8,200 220.2,175.5 Z"
              fill="#D5CDC2"
              stroke="currentColor"
              strokeWidth="0.95"
              strokeLinejoin="round"
            />

            {/* ==================== DRAWER ITEM DECORATIONS ==================== */}
            {/* 1. Stacked Envelope in Upper Left partition - made soft clean light cream */}
            <g id="upper-left-letter-stack">
              <polygon
                points="36,188 118,181 114,212 33,215"
                fill="#FAF9F6"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
              <path d="M 36,188 L 75,198 L 118,181" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.4" />
              <polygon
                points="42,192 110,187 107,209 38,212"
                fill="#FCFAF6"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
            </g>

            {/* 2. Flat packages / rolls in Upper Center partition */}
            <g id="upper-center-craft-ribbon">
              {/* Rolled writing paper tied with ink knot string */}
              <rect x="140" y="186" width="65" height="15" rx="3" fill="#FDFDFB" stroke="currentColor" strokeWidth="0.8" />
              <ellipse cx="140" cy="193.5" rx="2" ry="7" fill="#F6F2EB" stroke="currentColor" strokeWidth="0.6" />
              <ellipse cx="205" cy="193.5" rx="2" ry="7" fill="#FDFDFB" stroke="currentColor" strokeWidth="0.6" />
              {/* Tight Ribbon String wrapped */}
              <line x1="172" y1="186" x2="172" y2="201" stroke="currentColor" strokeWidth="0.8" />
              <path d="M 172,194 Q 166,198 168,206 M 172,194 Q 178,201 176,208" stroke="currentColor" strokeWidth="0.75" fill="none" />
            </g>

            {/* 3. ELEGANT HAND-DRAWN LETTERS STACK in Lower Left partition */}
            <g id="amber-glass-orb-compartment">
              {/* Soft shadow at the bottom of the letters stack */}
              <ellipse cx="78" cy="274" rx="36" ry="6" fill="currentColor" fillOpacity="0.1" filter="blur(1px)" />

              {/* Letter 1 (Bottom, tilted left) */}
              <g transform="translate(72, 250) rotate(-15)">
                {/* Envelope base */}
                <rect x="-32" y="-20" width="64" height="40" rx="1.5" fill="#FAF9F6" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round" />
                {/* Envelope fold lines */}
                <path d="M -32,-20 L 0,-2 L 32,-20" stroke="currentColor" strokeWidth="0.65" fill="none" opacity="0.45" />
                <path d="M -32,20 L -10,0" stroke="currentColor" strokeWidth="0.65" opacity="0.45" />
                <path d="M 32,20 L 10,0" stroke="currentColor" strokeWidth="0.65" opacity="0.45" />
              </g>

              {/* Letter 2 (Middle, tilted right) */}
              <g transform="translate(78, 254) rotate(8)">
                {/* Back shadow of letter 2 on letter 1 */}
                <rect x="-31" y="-19" width="62" height="38" rx="1.5" fill="#171717" fillOpacity="0.05" stroke="none" />
                {/* Envelope base */}
                <rect x="-30" y="-18" width="60" height="36" rx="1.5" fill="#FCFBF9" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round" />
                {/* Stamp */}
                <rect x="18" y="-14" width="8" height="10" rx="0.5" fill="#EFECE5" stroke="currentColor" strokeWidth="0.5" opacity="0.9" />
                {/* Stamp wavy cancellation line */}
                <path d="M 14,-9 Q 18,-11 22,-9 Q 26,-11 30,-9" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.4" />
                {/* Simple fold lines */}
                <path d="M -30,-18 L 0,-2 L 30,-18" stroke="currentColor" strokeWidth="0.65" fill="none" opacity="0.45" />
              </g>

              {/* Letter 3 (Top, slightly tilted left with rose watercolor seal) */}
              <g transform="translate(75, 258) rotate(-3)">
                {/* Back shadow of letter 3 */}
                <rect x="-29" y="-17" width="58" height="34" rx="1.5" fill="#171717" fillOpacity="0.05" stroke="none" />
                {/* Envelope base */}
                <rect x="-28" y="-16" width="56" height="32" rx="1.5" fill="#FDFCF9" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round" />
                {/* Envelope flaps */}
                <path d="M -28,-16 L -2,4 L 28,-16" stroke="currentColor" strokeWidth="0.65" fill="none" opacity="0.45" />
                <path d="M -28,16 L -10,0" stroke="currentColor" strokeWidth="0.65" opacity="0.45" />
                <path d="M 28,16 L 10,0" stroke="currentColor" strokeWidth="0.65" opacity="0.45" />
                {/* Delicate Rose watercolor seal center */}
                <circle cx="0" cy="2" r="5" fill="#EEA4A4" stroke="currentColor" strokeWidth="0.7" />
                {/* Seal detail (mini cross) */}
                <path d="M -1.5,1 L 1.5,1 M 0,-0.5 L 0,2.5" stroke="#FFF" strokeWidth="0.5" strokeLinecap="round" opacity="0.8" />
              </g>
            </g>

            {/* 4. Elegant light-parchment envelopes in Lower Center partition */}
            <g id="lower-center-envelopes">
              <polygon
                points="138,245 208,235 210,277 140,280"
                fill="#F3EDE4"
                stroke="currentColor"
                strokeWidth="0.95"
                strokeLinejoin="round"
              />
              {/* Soft Rose Watercolor Seal Stamp */}
              <circle cx="173" cy="256" r="3.5" fill="#DE9E9E" stroke="currentColor" strokeWidth="0.5" />
              <path d="M 138,245 L 173,256 L 208,235" stroke="currentColor" strokeWidth="0.65" fill="none" opacity="0.45" />
            </g>

            {/* 5. Library index cards dividers in Right column partition */}
            <g id="library-catalog-cards">
              {/* Cards standing sequentially vertically stack with stylized sketch outline */}
              <path
                d="M 232.5,185.5 C 255,184.8 285,186.2 303.8,185.5 C 304.5,210 303.2,250 303.8,275.5 C 285,276.5 255,274.8 232.5,275.5 C 231.8,250 233.2,210 232.5,185.5 Z"
                fill="#FBFBF9"
                stroke="currentColor"
                strokeWidth="0.8"
              />
              
              {/* Series of divider tabs protruding - changed to beautiful soft pastel shades */}
              <rect x="238" y="177" width="16" height="8" rx="1" fill="#E7DEC4" stroke="currentColor" strokeWidth="0.7" />
              <rect x="264" y="177" width="16" height="8" rx="1" fill="#D8E5DD" stroke="currentColor" strokeWidth="0.7" />
              <rect x="286" y="177" width="16" height="8" rx="1" fill="#F1E8D2" stroke="currentColor" strokeWidth="0.7" />

              {/* Grid filing lines */}
              <line x1="236" y1="195" x2="300" y2="195" stroke="currentColor" strokeWidth="0.45" strokeDasharray="2,2" opacity="0.35" />
              <line x1="236" y1="205" x2="300" y2="205" stroke="currentColor" strokeWidth="0.45" strokeDasharray="2,2" opacity="0.35" />
              <line x1="236" y1="215" x2="300" y2="215" stroke="currentColor" strokeWidth="0.45" strokeDasharray="2,2" opacity="0.35" />
              <line x1="236" y1="225" x2="300" y2="225" stroke="currentColor" strokeWidth="0.45" strokeDasharray="2,2" opacity="0.35" />
              <line x1="236" y1="235" x2="300" y2="235" stroke="currentColor" strokeWidth="0.45" strokeDasharray="2,2" opacity="0.35" />
            </g>

            {/* Wood Front Panel Covering Face containing the latch keyhole (y: 284 to 340) - made light warm alabaster */}
            <path
              d="M 22.3,284.5 C 90,283.2 230,285.8 317.7,284.5 C 319.2,300 316.8,320 317.7,339.5 C 230,340.8 90,338.2 22.3,339.5 C 21.2,320 23.8,300 22.3,284.5 Z"
              fill="#F6EFE5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Wood grains and notches on Front Facing Box Panel - made very soft gray */}
            <path d="M 28,295 Q 170,305 312,295" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.08" />
            <path d="M 32,318 Q 170,326 312,318" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.08" />
            <path d="M 50,332 C 100,335, 230,335, 290,332" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.05" />

            {/* Lock hardware keyhole - matching the handdrawn-look latch hardware perfectly */}
            <g id="box-lock-keyhole">
              <circle cx="170" cy="308" r="7" fill="#F1ECE2" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="170" cy="308" r="4.5" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1,1" />
              {/* Keyhole slot */}
              <path d="M170,304 L170,309 L168.5,313 L171.5,313 Z" fill="#171717" stroke="currentColor" strokeWidth="0.5" />
              {/* Fine small metal rivets on left & right of lock plate */}
              <circle cx="158" cy="308" r="0.8" fill="#171717" />
              <circle cx="182" cy="308" r="0.8" fill="#171717" />
            </g>
          </g>
        </svg>


      </div>
      
    </div>
  );
}
