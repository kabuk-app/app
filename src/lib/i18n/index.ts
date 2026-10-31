import { en, type MessageKey } from './en';
import { kk } from './kk';
import { ru } from './ru';
import { tr } from './tr';

export type { MessageKey };

export const LANGUAGES = ['en', 'tr', 'kk', 'ru'] as const;
export type Lang = (typeof LANGUAGES)[number];

/** Native names, shown in the language picker. Not translated on purpose. */
export const LANGUAGE_NAMES: Record<Lang, string> = {
	en: 'English',
	tr: 'Türkçe',
	kk: 'Қазақша',
	ru: 'Русский'
};

export const FALLBACK_LANG: Lang = 'en';

export const dictionaries: Record<Lang, Record<MessageKey, string>> = { en, tr, kk, ru };

export function isLang(value: unknown): value is Lang {
	return LANGUAGES.includes(value as Lang);
}

/** First supported language in a `navigator.languages` style list, else English. */
export function detectLang(preferred: readonly string[]): Lang {
	for (const tag of preferred) {
		const base = tag.toLowerCase().split('-')[0];
		if (isLang(base)) return base;
	}
	return FALLBACK_LANG;
}

/** The user override wins; `undefined` or `'system'` means follow the system. */
export function resolveLang(override: string | undefined, preferred: readonly string[]): Lang {
	return isLang(override) ? override : detectLang(preferred);
}

/** Look up a key; a missing entry in the active language falls back to English. */
export function translate(lang: Lang, key: MessageKey): string {
	return dictionaries[lang][key] || en[key];
}
