import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Sparkles,
  Mailbox
} from 'lucide-react';
import { POEMS_DATA } from './data/poems';
import { PoemLetter } from './types';
import MailboxWall from './components/MailboxWall';
import TypewriterMachine from './components/TypewriterMachine';
import PoemDisplayView from './components/PoemDisplayView';
import CabinetView from './components/CabinetView';
import { startPreloadingAudio } from './utils/audioPreloader';

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

  // EXPERIENTIAL PHASE STATES
  // 'mailbox' -> Grid close up wall slots list (Reference Image 1)
  // 'typewriter' -> Mechanical blue typist rolling printing detail page (Reference Image 2)
  // 'display' -> Paper card with centering text & Action controls (Reference Image 3, 4, 100% natural hand-sketched)
  // 'cabinet' -> Retro chest/box display showing collected hand-wrapped poems
  const [currentPhase, setCurrentPhase] = useState<'mailbox' | 'typewriter' | 'display' | 'cabinet'>('mailbox');

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

  const [currentLetter, setCurrentLetter] = useState<PoemLetter>(() => {
    let savedCollected: PoemLetter[] = [];
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('poetry_mailbox_collections');
      if (saved) {
        try {
          savedCollected = JSON.parse(saved);
        } catch (e) {
          savedCollected = [];
        }
      }
    }
    const collectedIds = new Set(savedCollected.map(item => item.id));
    const available = POEMS_DATA.filter(p => !collectedIds.has(p.id));
    if (available.length > 0) {
      const randomIndex = Math.floor(Math.random() * available.length);
      return available[randomIndex];
    }
    // Fallback if all are collected
    const randomIndex = Math.floor(Math.random() * POEMS_DATA.length);
    return POEMS_DATA[randomIndex];
  });

  const [activeCategory, setActiveCategory] = useState<'all' | 'soft_landing' | 'quiet_room' | 'rain_note' | 'little_glow' | 'far_away'>('all');
  const [navigationSource, setNavigationSource] = useState<'mailbox' | 'cabinet'>('mailbox');
  
  // Interactive Helper States For Audio
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [typewriterResetId, setTypewriterResetId] = useState(0);
  const [isTuckingActive, setIsTuckingActive] = useState(false);

  // Web Speech synthesis whisper reader (untainted and client-safe)
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  useEffect(() => {
    // Background preload the typewriter key sounds immediately on load
    startPreloadingAudio().catch(() => {});

    const handleInteraction = () => {
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          if (!(window as any).__globalAudioCtx) {
            (window as any).__globalAudioCtx = new AudioCtxClass();
          }
          const ctx = (window as any).__globalAudioCtx;
          if (ctx && ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
          }
        }
        // Also ensure start preloading is triggered under interaction just in case
        startPreloadingAudio().catch(() => {});
      } catch (e) {
        console.warn('Unlock audio context error:', e);
      }

      // Pre-initialize standard audio to unlock HTML5 playback restrictions
      try {
        const silentAudio = new Audio();
        silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        silentAudio.play().catch(() => {});
      } catch (e) {}

      // Clean up after first interaction
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      if (synth && synth.speaking) {
        synth.cancel();
      }
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  const triggerToast = (msg: string) => {
    // Toast notifications completely removed to eliminate black prompt bubbles as requested
  };

  // Main interaction trigger: Pull from physical grid slot 11
  const handlePullOut = (mood?: string) => {
    // Direct user-gesture: Instantiate and resume the AudioContext right in the click stack!
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        if (!(window as any).__globalAudioCtx) {
          (window as any).__globalAudioCtx = new AudioCtxClass();
        }
        const ctx = (window as any).__globalAudioCtx;
        if (ctx && ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      }
    } catch (e) {
      console.warn('AudioContext trigger on click error:', e);
    }

    if (synth && synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
    }
    
    // Choose a poem based on category/mood if specified, else totally random
    let filteredPoems = POEMS_DATA;
    if (mood && mood !== 'today') {
      if (mood === 'tired') {
        filteredPoems = POEMS_DATA.filter(p => p.category === 'soft_landing');
        setActiveCategory('soft_landing');
      } else if (mood === 'quiet') {
        filteredPoems = POEMS_DATA.filter(p => p.category === 'quiet_room');
        setActiveCategory('quiet_room');
      } else if (mood === 'rainy') {
        filteredPoems = POEMS_DATA.filter(p => p.category === 'rain_note');
        setActiveCategory('rain_note');
      } else if (mood === 'escape') {
        filteredPoems = POEMS_DATA.filter(p => p.category === 'far_away');
        setActiveCategory('far_away');
      } else if (mood === 'happy') {
        filteredPoems = POEMS_DATA.filter(p => p.category === 'little_glow');
        setActiveCategory('little_glow');
      }
    } else {
      setActiveCategory('all');
    }
    
    if (filteredPoems.length === 0) {
      filteredPoems = POEMS_DATA;
    }

    // Filter out already collected/favorited poems
    const collectedIds = new Set(collectedLetters.map(item => item.id));
    let availablePoems = filteredPoems.filter(p => !collectedIds.has(p.id));

    // Fallbacks if all selected poems are collected
    if (availablePoems.length === 0) {
      // Try to find any uncollected poem across all categories
      availablePoems = POEMS_DATA.filter(p => !collectedIds.has(p.id));
      
      // If absolutely everything has been collected, allow repeating from the current category
      if (availablePoems.length === 0) {
        availablePoems = filteredPoems;
      }
    }

    const randomIndex = Math.floor(Math.random() * availablePoems.length);
    const chosenPoem = availablePoems[randomIndex];
    setCurrentLetter(chosenPoem);
    setNavigationSource('mailbox');

    // Transition directly to the typewriter page
    setCurrentPhase('typewriter');
    setTypewriterResetId(p => p + 1);
    triggerToast('正在抽出信纸，卷入打字机辊轴...');
  };

  const handlePassAndRegenerate = () => {
    if (synth && synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
    }
    
    // Select candidates from the same category or all poems
    let candidates = POEMS_DATA;
    if (activeCategory !== 'all') {
      candidates = POEMS_DATA.filter(p => p.category === activeCategory);
    }
    
    // Filter out already collected/favorited poems, as well as the current poem
    const collectedIds = new Set(collectedLetters.map(item => item.id));
    let available = candidates.filter(p => !collectedIds.has(p.id) && p.id !== currentLetter.id);

    // Fallbacks if candidates are empty (e.g. all in category are collected)
    if (available.length === 0) {
      // Try to find any uncollected poem across all categories (excluding current letter)
      available = POEMS_DATA.filter(p => !collectedIds.has(p.id) && p.id !== currentLetter.id);
      
      // If absolutely all are collected, fallback to excluding only the current letter in candidates
      if (available.length === 0) {
        available = candidates.filter(p => p.id !== currentLetter.id);
        if (available.length === 0) {
          available = candidates;
        }
      }
    }
    
    const randomIndex = Math.floor(Math.random() * available.length);
    const chosenPoem = available[randomIndex];
    setCurrentLetter(chosenPoem);
    setNavigationSource('mailbox');
    setCurrentPhase('typewriter');
    setTypewriterResetId(p => p + 1);
  };

  const handleToggleCollection = (letter: PoemLetter) => {
    let next: PoemLetter[] = [];
    const exists = collectedLetters.some(item => item.id === letter.id);
    if (exists) {
      next = collectedLetters.filter(item => item.id !== letter.id);
      triggerToast('已将信纸从收藏盒取回 💌');
    } else {
      next = [letter, ...collectedLetters]; // Prepend so they display from top to bottom (newest to oldest)
      triggerToast('✨ 信笺已妥帖加入收藏盒啦！');
    }
    setCollectedLetters(next);
    localStorage.setItem('poetry_mailbox_collections', JSON.stringify(next));
  };

  const startWhisperSpeech = (letter: PoemLetter) => {
    if (!synth) return;

    if (synth.speaking) {
      synth.cancel();
    }

    const cleanString = letter.poem.replace(/\n/g, ', ');
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

    startWhisperSpeech(currentLetter);
  };

  // Auto-read on entering the letter detail page
  useEffect(() => {
    if (currentPhase === 'display') {
      const timer = setTimeout(() => {
        startWhisperSpeech(currentLetter);
      }, 550); // Delay slightly for smooth entering page transitions
      return () => {
        clearTimeout(timer);
      };
    } else {
      if (synth && synth.speaking) {
        synth.cancel();
        setIsSpeaking(false);
      }
    }
  }, [currentPhase, currentLetter.id]);

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
      setCurrentPhase('typewriter');
    }
  };

  return (
    <div className="min-h-[100svh] bg-neutral-100 flex items-start sm:items-center justify-center p-0 sm:p-4 md:p-6 font-sans-ui overflow-y-auto sm:overflow-hidden select-none">
      
      {/* Handheld Device Container with handwritten look */}
      <div 
        className="phone-stage-frame sm:rounded-[36px] bg-white border-2 sm:border-8 border-neutral-900 relative flex flex-col justify-between overflow-hidden"
        id="phone-stage"
      >
        
        {/* --- Top App Header (Clean black outlines, pure white canvas) --- */}
        <header className="px-5 pt-5 pb-4 flex items-center justify-between z-30 shrink-0 border-b-2 border-neutral-900 bg-white">
          <div className="flex flex-col text-left">
            <span className="font-serif-en italic font-bold text-sm tracking-wide text-neutral-950 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-950 animate-pulse" />
              Poetry Mailbox
            </span>
            <span className="text-[9px] text-neutral-400 font-mono mt-0.5 tracking-widest uppercase font-bold">
              每日诗歌信箱
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Elegant Return-to-Mailbox Home button (Only shown when not on the main mailbox/home screen) */}
            {currentPhase !== 'mailbox' && (
              <button 
                onClick={handleBackToMailbox}
                className="w-8 h-8 bg-white hover:bg-[#FAF9F5] flex items-center justify-center text-neutral-900 transition-all cursor-pointer shadow-[2px_2px_0px_#171717] active:translate-y-0.5 active:shadow-[0px_0px_0px] sketch-border-sm relative"
                title="回到邮箱主页"
                id="header-mailbox-btn"
              >
                <Mailbox size={18} strokeWidth={1.8} className="text-neutral-900" />
              </button>
            )}

            {/* Collection Box button for preceding pages (Starting from home, typewriter, and display-from-mailbox) */}
            {(currentPhase === 'mailbox' || currentPhase === 'typewriter' || (currentPhase === 'display' && navigationSource === 'mailbox')) && (
              <button 
                onClick={() => {
                  if (synth && synth.speaking) {
                    synth.cancel();
                    setIsSpeaking(false);
                  }
                  setCurrentPhase('cabinet');
                }}
                className="w-8 h-8 bg-white hover:bg-[#FAF9F5] flex items-center justify-center text-neutral-900 transition-all cursor-pointer shadow-[2px_2px_0px_#171717] active:translate-y-0.5 active:shadow-[0px_0px_0px] sketch-border-sm relative"
                title="打开收藏盒"
                id="header-cabinet-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-900">
                  <rect width="20" height="9" x="2" y="3" rx="1" />
                  <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
                  <path d="M9 16h6" />
                </svg>
              </button>
            )}

            {/* Home/Reset button completely removed as requested */}
          </div>
        </header>

        {/* --- Central Main Screen Workspace --- */}
        <main className="flex-1 min-h-0 px-5 py-4 flex flex-col justify-between gap-3 overflow-y-auto no-scrollbar z-10 bg-white relative">
          
          {/* Poignant Day/Date Watermark (Style Image 3 Top Center style) */}
          <div className="w-full text-center shrink-0 mt-1.5 select-none">
            <p className="text-base font-serif-en tracking-wide font-extrabold text-neutral-950 uppercase">
              {formattedDate}
            </p>
            <p className="text-[11px] text-neutral-500 font-serif-zh font-bold tracking-widest mt-0.5 uppercase">
              • {chineseDate} •
            </p>
          </div>

          {/* Dynamic workspace animations with Framer AnimatePresence */}
          <div className="flex-1 w-full flex flex-col min-h-0 relative">
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
                  className="w-full flex-1 flex flex-col"
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
                    collectedLetters={collectedLetters}
                    onTuckingActiveChange={setIsTuckingActive}
                    onPass={handlePassAndRegenerate}
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
                    onBack={() => {
                      if (synth && synth.speaking) {
                        synth.cancel();
                        setIsSpeaking(false);
                      }
                      setCurrentPhase('display');
                    }}
                  />
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </main>

      </div>
    </div>
  );
}
