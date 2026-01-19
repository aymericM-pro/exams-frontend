import { fr } from './fr';
import { en } from './en';

export const translations = {
  fr,
  en,
};

export type Lang = keyof typeof translations;
export type TranslationKey = typeof fr;
