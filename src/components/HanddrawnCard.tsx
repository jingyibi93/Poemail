import React from 'react';

// Six highly wobbly, hand-sketched rectangle path templates with imperfect corners,
// wavy segments, and organic humps to match a realistic hand-drawn notebook sketch.
const SHAKY_PATHS = [
  // Style 0: Slightly sagging top right, uneven bottom
  "M 4.5,5.5 C 28,3.2 56,7.8 84,4.2 C 89.5,3.5 94.2,6.2 96.5,5.2 C 94.2,28.5 97.2,55.8 95.2,83.5 C 94.8,89.2 97.2,93.5 94.5,96.2 C 70.2,93.8 44.5,97.2 18.2,94.2 C 12.5,93.5 6.5,95.8 4.2,93.8 C 5.5,70.2 3.2,44.5 5.8,18.5 C 4.8,11.5 3.8,7.8 4.5,5.5 Z",
  
  // Style 1: Tilted right, bloated wavy sides, shaky corners
  "M 6.2,3.8 C 32.5,5.8 65.2,3.1 84.8,5.8 C 89.2,6.5 93.8,4.2 95.8,4.8 C 96.2,26.5 93.8,51.8 95.5,74.2 C 96.8,86.5 94.8,92.5 92.5,95.8 C 68.5,93.8 42.5,96.8 20.2,94.2 Q 11.5,95.2 5.2,94.8 C 6.5,74.2 4.5,51.5 6.8,31.8 C 5.8,16.5 5.2,7.5 6.2,3.8 Z",
  
  // Style 2: Meshed joints, slight hourglass wiggles
  "M 3.8,6.5 C 26.2,4.8 48.5,8.2 78.5,5.2 C 84.2,4.5 91.5,7.2 95.5,4.8 C 93.8,28.5 96.2,56.5 93.5,81.8 C 92.8,87.8 95.2,92.5 92.8,95.2 C 69.5,93.2 44.8,96.5 21.2,93.8 Q 12.8,94.5 4.8,94.2 C 5.8,70.5 4.2,46.2 5.5,22.2 C 4.2,14.5 3.5,9.5 3.8,6.5 Z",
  
  // Style 3: Wavy tapered bottom, imperfect hand outline look
  "M 5.5,5.2 Q 48.5,2.8 94.8,5.2 Q 96.5,48.5 94.8,94.2 Q 48.5,96.8 5.5,94.2 Q 3.8,48.5 5.5,5.2 Z",
  
  // Style 4: Soft indent along the top line, wobbly sides
  "M 3.2,7.2 C 25.5,4.8 45.8,9.2 65.2,5.8 C 78.5,3.8 90.2,6.8 96.5,3.8 C 94.8,27.5 97.2,51.2 93.8,76.8 C 92.8,83.5 94.8,90.5 91.8,95.8 C 68.2,93.5 44.2,96.5 19.8,93.8 C 13.8,93.5 8.2,95.8 4.2,94.8 C 5.2,71.5 3.2,47.8 5.2,23.8 C 4.2,15.8 3.2,11.2 3.2,7.2 Z",
  
  // Style 5: Messy overlaps, rounded hand-holding feel
  "M 5.2,4.2 Q 30.5,6.2 60.2,2.8 Q 80.5,4.8 94.8,3.8 Q 96.2,29.5 93.8,58.8 Q 96.5,78.5 94.2,93.8 Q 65.2,91.2 35.8,93.8 Q 18.2,92.8 4.2,94.8 Q 6.2,69.5 4.2,39.5 Q 5.2,17.8 5.2,4.2 Z"
];

const MINI_SHAKY_PATHS = [
  "M 3,4 Q 50,1 97,3 Q 99,50 97,96 Q 50,98 3,96 Q 1,50 3,4 Z",
  "M 2,5 Q 50,3 98,4 Q 97,50 98,95 Q 50,97 2,95 Q 3,50 2,5 Z",
  "M 4,2 Q 50,5 96,2 Q 98,50 96,98 Q 50,95 4,98 Q 2,50 4,2 Z"
];

const BUTTON_SHAKY_PATHS = [
  "M 2,4 Q 50,1 98,3 Q 99,50 98,96 Q 50,98 2,96 Q 1,50 2,4 Z",
  "M 3,5 Q 50,2 97,4 Q 98,50 97,95 Q 50,97 3,95 Q 2,50 3,5 Z"
];

interface HanddrawnCardProps extends React.ComponentPropsWithoutRef<'div'> {
  key?: React.Key;
  id?: string;
  children?: React.ReactNode;
  className?: string;
  styleIndex?: number;
  isInactive?: boolean;
  isActive?: boolean;
  fillColor?: string;
  shadowColor?: string;
  strokeColor?: string;
  shadowOffset?: { x: number; y: number };
  useMini?: boolean;
  useButtonMini?: boolean;
}

export default function HanddrawnCard({
  children,
  className = "",
  styleIndex = 0,
  isInactive = false,
  isActive = false,
  fillColor = "white",
  shadowColor = "#171717",
  strokeColor = "#171717",
  shadowOffset = { x: 4, y: 4 },
  useMini = false,
  useButtonMini = false,
  ...props
}: HanddrawnCardProps) {
  // Select the appropriate path based on type
  let pathD = SHAKY_PATHS[styleIndex % SHAKY_PATHS.length];
  if (useMini) {
    pathD = MINI_SHAKY_PATHS[styleIndex % MINI_SHAKY_PATHS.length];
  } else if (useButtonMini) {
    pathD = BUTTON_SHAKY_PATHS[styleIndex % BUTTON_SHAKY_PATHS.length];
  }

  // Determine current look based on active state
  const backgroundFill = isActive 
    ? "#EEF5EE" 
    : isInactive 
      ? "#FAFAFA" 
      : fillColor;

  const currentStroke = isInactive ? "#d4d4d4" : strokeColor;
  const currentShadow = isInactive ? "#e5e5e5" : shadowColor;

  return (
    <div 
      className={`relative ${className}`}
      {...props}
    >
      {/* 1. Realistic wobbly shadow layer underneath */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        style={{ 
          transform: `translate(${shadowOffset.x}px, ${shadowOffset.y}px)` 
        }}
      >
        <path 
          d={pathD} 
          fill={currentShadow} 
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      
      {/* 2. Realistic background envelope with wobbly stroke */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <path 
          d={pathD} 
          fill={backgroundFill} 
          stroke={currentStroke} 
          strokeWidth="1.3" 
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* 3. Content overlay */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
