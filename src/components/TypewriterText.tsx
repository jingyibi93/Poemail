import React, { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // Ms delay per character
  onComplete?: () => void;
  triggerResetId?: string | number; // To force reset when poem changes
}

export default function TypewriterText({
  text,
  speed = 45,
  onComplete,
  triggerResetId,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const textRef = useRef(text);
  const indexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize on parameters
  useEffect(() => {
    textRef.current = text;
    setDisplayedText('');
    setIsFinished(false);
    indexRef.current = 0;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (!text) {
      setIsFinished(true);
      if (onComplete) onComplete();
      return;
    }

    timerRef.current = setInterval(() => {
      const currentText = textRef.current;
      const index = indexRef.current;

      if (index < currentText.length) {
        setDisplayedText(currentText.substring(0, index + 1));
        indexRef.current += 1;
      } else {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setIsFinished(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [text, speed, triggerResetId]);

  // Accessibility click handler: bypass typing and show instantly!
  const handleQuickSkip = () => {
    if (isFinished) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setDisplayedText(text);
    setIsFinished(true);
    if (onComplete) onComplete();
  };

  return (
    <div 
      className="relative cursor-pointer select-text font-serif-en italic"
      onClick={handleQuickSkip}
      title={!isFinished ? "点击可快速显示全文" : undefined}
    >
      {/* Typed-out text with formatting */}
      <span className="whitespace-pre-line text-[#201D19] tracking-wider selection:bg-[#EAE3CE] font-medium leading-relaxed">
        {displayedText}
      </span>

      {/* Blinking typewriter mechanical caret */}
      {!isFinished && (
        <span className="inline-block ml-0.5 w-[2px] h-[19px] bg-[#915B56] animate-pulse-fast vertical-align-middle" />
      )}

      {/* Little non-disruptive touch skip tip */}
      {!isFinished && (
        <div className="text-center w-full mt-3 select-none pointer-events-none opacity-40">
          <span className="text-[9px] font-sans-ui text-[#9A8E7A] tracking-wider">
            ⚡ Tap paper to reveal instantly / 触按信纸立即显现
          </span>
        </div>
      )}
    </div>
  );
}
