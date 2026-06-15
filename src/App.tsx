import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { POEMS_DATA } from './data/poems';
import { PoemLetter } from './types';
import MailboxWall from './components/MailboxWall';
import TypewriterMachine from './components/TypewriterMachine';
import PoemDisplayView from './components/PoemDisplayView';
import CabinetView from './components/CabinetView';

// POIGNANT CALENDAR DATE HELPER WITH MINIMAL DESIGN
const getFormattedDailyDate = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const getChineseDateSubtitle = () => {
  const weekdayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = weekdayNames[date.getDay()];
  return `${month}月${day}日 · ${weekday}`;
};

export default function App() {
  const formattedDate = getFormattedDailyDate();
  const chineseDate = getChineseDateSubtitle();

  // Pick deterministic daily poem based on actual day of month
  const getDailyPoemLetter = (): PoemLetter => {
    const today = new Date();
    const index = (today.getDate() + today.getMonth() * 30) % POEMS_DATA.length;
    return POEMS_DATA[index];
  };

  const dailyLetter = getDailyPoemLetter();

  // EXPERIENTIAL PHASE STATES
  // 'mailbox' -> Grid close up wall slots list (Reference Image 1)
  // 'typewriter' -> Mechanical blue typist rolling printing detail page (Reference Image 2)
  // 'display' -> Paper card with centering text & Action controls (Reference Image 3, 4, 100% natural hand-sketched)
  // 'cabinet' -> Retro chest/box display showing collected hand-wrapped poems
  const [currentPhase, setCurrentPhase] = useState<'mailbox' | 'typewriter' | 'display' | 'cabinet'>('mailbox');
  const [currentLetter, setCurrentLetter] = useState<PoemLetter>(dailyLetter);
  const [navigationSource, setNavigationSource] = useState<'mailbox' | 'cabinet'>('mailbox');

  const [collectedLetters, setCollectedLetters] = useState<PoemLetter[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('poetry_mailbox_collections');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });
  
  // Interactive Helper States For Audio
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [typewriterResetId, setTypewriterResetId] = useState(0);

  // Web Speech synthesis whisper reader (untainted and client-safe)
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  useEffect(() => {
    return () => {
      if (synth && synth.speaking) {
        synth.cancel();
      }
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Main interaction trigger: Pull from physical grid slot 11
  const handlePullOut = () => {
    if (synth && synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
    }
    
    // Choose a completely random poem from POEMS_DATA each time
    const randomIndex = Math.floor(Math.random() * POEMS_DATA.length);
    const chosenPoem = POEMS_DATA[randomIndex];
    setCurrentLetter(chosenPoem);
    setNavigationSource('mailbox');

    // Transition directly to the typewriter page
    setCurrentPhase('typewriter');
    setTypewriterResetId(p => p + 1);
    triggerToast('正在抽出信纸，卷入打字机辊轴...');
  };

  const handleToggleCollection = (letter: PoemLetter) => {
    let next: PoemLetter[] = [];
    const exists = collectedLetters.some(item => item.id === letter.id);
    if (exists) {
      next = collectedLetters.filter(item => item.id !== letter.id);
      triggerToast('已将信纸从收藏盒取回 💌');
    } else {
      next = [...collectedLetters, letter];
      triggerToast('✨ 信笺已妥帖加入收藏盒啦！');
    }
    setCollectedLetters(next);
    localStorage.setItem('poetry_mailbox_collections', JSON.stringify(next));
  };

  // Play whisper voice slowly
  const handleWhisperSpeech = () => {
    if (!synth) {
      triggerToast('暂不支持语音朗读功能');
      return;
    }

    if (synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
      triggerToast('朗读断开');
      return;
    }

    const cleanString = currentLetter.poem.replace(/\n/g, ', ');
    const utterance = new SpeechSynthesisUtterance(cleanString);
    utterance.lang = 'en-US';
    utterance.rate = 0.72; // slow pacing
    utterance.pitch = 1.05;

    const availableVoices = synth.getVoices();
    const aestheticVoice = availableVoices.find(v => 
      v.lang.startsWith('en') && 
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Aria') || v.name.includes('Samantha'))
    ) || availableVoices.find(v => v.lang.startsWith('en'));

    if (aestheticVoice) {
      utterance.voice = aestheticVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      triggerToast('📢 正在为您静心朗读英文手稿...');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    synth.speak(utterance);
  };

  // Return back to unread base
  const handleBackToMailbox = () => {
    if (synth && synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
    }
    setCurrentPhase('mailbox');
    triggerToast('返回信箱格墙');
  };

  const handleBackToSource = () => {
    if (synth && synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
    }
    if (navigationSource === 'cabinet') {
      setCurrentPhase('cabinet');
    } else {
      setCurrentPhase('mailbox');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-0 sm:p-4 md:p-6 font-sans-ui overflow-hidden select-none">
      
      {/* Handheld Device Container with handwritten look */}
      <div 
        className="w-full h-full sm:w-[410px] sm:h-[840px] sm:rounded-[36px] bg-white border-2 sm:border-8 border-neutral-900 shadow-[8px_8px_0px_#171717] relative flex flex-col justify-between overflow-hidden"
        id="phone-stage"
      >
        
        {/* --- Top App Header (Clean black outlines, pure white canvas) --- */}
        <header className="px-5 pt-5 pb-4 flex items-center justify-between z-30 shrink-0 border-b-2 border-neutral-900 bg-white">
          <div className="flex flex-col text-left">
            <span className="font-serif-en italic font-bold text-sm tracking-wide text-neutral-950 flex items-center gap-1.5 font-sans">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-950 animate-pulse" />
              Poetry Mailbox
            </span>
            <span className="text-[9px] text-neutral-400 font-mono mt-0.5 tracking-widest uppercase font-bold">
              每日诗歌信箱
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Elegant Keepsake Cabinet Chest button (Only accessible from internal sub-screens, never from Home screen as requested) */}
            {currentPhase !== 'mailbox' && currentPhase !== 'cabinet' && (
              <button 
                onClick={() => {
                  setCurrentPhase('cabinet');
                  triggerToast('打开收藏盒 ✿');
                }}
                className="w-8 h-8 bg-white hover:bg-[#FAF9F5] flex items-center justify-center text-neutral-900 transition-all cursor-pointer shadow-[2px_2px_0px_#171717] active:translate-y-0.5 active:shadow-[0px_0px_0px] sketch-border-sm relative"
                title="打开收藏盒"
                id="header-cabinet-btn"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-900">
                  <rect width="20" height="9" x="2" y="3" rx="1" />
                  <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
                  <path d="M9 16h6" />
                </svg>
                {collectedLetters.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#DE6B6B] text-white text-[7.5px] font-bold px-1 rounded-full leading-none h-3.5 min-w-3.5 flex items-center justify-center border border-white scale-90 shadow-md">
                    {collectedLetters.length}
                  </span>
                )}
              </button>
            )}

            {/* Home/Reset button */}
            {currentPhase !== 'mailbox' && (
              <button 
                onClick={handleBackToMailbox}
                className="w-8 h-8 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-900 transition-all cursor-pointer shadow-[2px_2px_0px_#171717] active:translate-y-0.5 active:shadow-[0px_0px_0px] sketch-border-sm"
                title="返回信箱"
                id="reset-to-daily-btn"
              >
                <RotateCcw size={11} className="stroke-[1.3]" />
              </button>
            )}
          </div>
        </header>

        {/* --- Central Main Screen Workspace --- */}
        <main className="flex-grow px-5 py-4 flex flex-col justify-between gap-3 overflow-y-auto no-scrollbar z-10 bg-white relative">
          
          {/* Poignant Day/Date Watermark (Style Image 3 Top Center style) */}
          <div className="w-full text-center shrink-0 mt-1.5 select-none">
            <p className="text-base font-sketch tracking-wide font-extrabold text-neutral-950 uppercase">
              {formattedDate}
            </p>
            <p className="text-[11px] text-neutral-500 font-sketch font-bold tracking-widest mt-0.5 uppercase">
              • {chineseDate} •
            </p>
          </div>

          {/* Dynamic workspace animations with Framer AnimatePresence */}
          <div className="flex-1 w-full flex flex-col justify-center min-h-[460px] relative">
            <AnimatePresence mode="wait">
              
              {/* PHASE 1: MAILBOX GRID STRUCTURE (Image 1) */}
              {currentPhase === 'mailbox' && (
                <motion.div
                  key="mailbox-phase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-full flex flex-col justify-between"
                >
                  <MailboxWall
                    onPullOut={handlePullOut}
                    favoritesCount={collectedLetters.length}
                    onOpenBox={() => {
                      setCurrentPhase('cabinet');
                      triggerToast('打开收藏柜 ✿');
                    }}
                  />
                </motion.div>
              )}

              {/* PHASE 2: MECHANICAL RETRO TYPEWRITER PRINTING (Image 2) */}
              {currentPhase === 'typewriter' && (
                <motion.div
                  key="typewriter-phase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex"
                >
                  <TypewriterMachine
                    poemText={currentLetter.poem}
                    triggerResetId={typewriterResetId}
                    onComplete={() => {
                      // Transition to displays card view upon finish!
                      setCurrentPhase('display');
                      triggerToast('📯 打字完成，已取出手写信笺！');
                    }}
                  />
                </motion.div>
              )}

              {/* PHASE 3: POEM VERSE CARD DETAIL SECTION (Image 3, 4, 5) */}
              {currentPhase === 'display' && (
                <motion.div
                  key={`display-phase-${currentLetter.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <PoemDisplayView
                    currentLetter={currentLetter}
                    onBack={handleBackToSource}
                    isSpeaking={isSpeaking}
                    onToggleSpeech={handleWhisperSpeech}
                    isSavedInBox={collectedLetters.some(item => item.id === currentLetter.id)}
                    onSave={() => handleToggleCollection(currentLetter)}
                    onViewCabinet={() => {
                      setCurrentPhase('cabinet');
                    }}
                  />
                </motion.div>
              )}

              {/* PHASE 4: ARCHIVED CABINET VIEW */}
              {currentPhase === 'cabinet' && (
                <motion.div
                  key="cabinet-phase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <CabinetView
                    collectedLetters={collectedLetters}
                    onOpenLetter={(letter) => {
                      setNavigationSource('cabinet');
                      setCurrentLetter(letter);
                      setCurrentPhase('display');
                    }}
                    onRemoveLetter={(letter) => {
                      handleToggleCollection(letter);
                    }}
                    onBack={handleBackToMailbox}
                  />
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </main>

        {/* --- Custom Toast Alert messages banner --- */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[11px] font-sketch font-bold px-4 py-2 z-[100] shadow-[3px_3px_0px_#8FA189] pointer-events-none tracking-widest text-center max-w-[280px] sketch-border-sm"
              id="app-toast-alert"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
