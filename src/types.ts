export type MoodType = 'quiet' | 'tired' | 'rainy' | 'sleepless' | 'escape' | 'happy';

export interface PoemLetter {
  id: string;
  dateStr: string;       // e.g. "June 15"
  mood: MoodType;
  poem: string;          // Original beautiful, simple English poem
  translation: string;   // Poetic Chinese translation
  word: string;          // Today's key word
  wordMeaning: string;   // Meaning in Chinese
  phonetic: string;      // Phonetic pronunciation, e.g. "/ˈsləʊli/"
  exampleEn: string;     // Short original example sentence
  exampleCn: string;     // Chinese explanation of the example
  postmark: string;      // The thematic postmark symbol or title, e.g. "Raindrop", "Warm Candle"
}
