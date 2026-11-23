export class TarotCard {
  id: number;
  name: string;
  number: number;
  arcana: string;
  uprightMeaning: string;
  reversedMeaning: string;
  description: string;
  symbolism: string;
  element: string;
  planet: string;
  zodiac: string;
  image: string;
  keywords: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;

  // Additional fields to preserve full frontend compatibility
  numeral?: string;
  theme?: string;
  glyph?: string;
  summary?: string;
  meaning?: string;
  upright?: string[];
  reversed?: string[];
  love?: string;
  career?: string;
  growth?: string;
  quote?: string;
  themes?: string[];
  slug?: string;
}

