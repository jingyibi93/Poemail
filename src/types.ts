export type MoodType = 'quiet' | 'tired' | 'rainy' | 'sleepless' | 'escape' | 'happy';

export type CategoryType = 'soft_landing' | 'quiet_room' | 'rain_note' | 'little_glow' | 'far_away';

export interface PoemLetter {
  id: string;
  category: CategoryType;
  categoryTitle: string;
  categoryDescription: string;
  targetWord: string;
  phonetic: string;
  partOfSpeech: string;
  wordMeaning: string;
  poem: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  
  // Backward compatibility fields for pre-existing UI elements
  dateStr: string;
  mood: MoodType;
  word: string;
  exampleEn: string;
  exampleCn: string;
  postmark: string;
}

