import { describe, expect, it } from 'vitest';
import {
	FALLBACK_LANG,
	LANGUAGES,
	LANGUAGE_NAMES,
	detectLang,
	dictionaries,
	isLang,
	resolveLang,
	translate
} from './index';

describe('dictionaries', () => {
	const reference = Object.keys(dictionaries.en).sort();

	it.each(LANGUAGES)('%s has exactly the English keys', (lang) => {
		expect(Object.keys(dictionaries[lang]).sort()).toEqual(reference);
	});

	it.each(LANGUAGES)('%s has no empty entries', (lang) => {
		for (const value of Object.values(dictionaries[lang])) expect(value.trim()).not.toBe('');
	});

	it('names every language', () => {
		expect(Object.keys(LANGUAGE_NAMES).sort()).toEqual([...LANGUAGES].sort());
	});
});

describe('detectLang', () => {
	it('picks the first supported language', () => {
		expect(detectLang(['de-DE', 'tr-TR', 'ru'])).toBe('tr');
	});

	it('handles regions and case', () => {
		expect(detectLang(['KK-kz'])).toBe('kk');
		expect(detectLang(['ru-RU'])).toBe('ru');
	});

	it('falls back to English for unknown languages or none', () => {
		expect(detectLang(['de-DE', 'fr'])).toBe(FALLBACK_LANG);
		expect(detectLang([])).toBe(FALLBACK_LANG);
	});
});

describe('resolveLang', () => {
	it('prefers the user override', () => {
		expect(resolveLang('ru', ['tr'])).toBe('ru');
	});

	it('follows the system when there is no valid override', () => {
		expect(resolveLang('system', ['tr'])).toBe('tr');
		expect(resolveLang(undefined, ['kk'])).toBe('kk');
		expect(resolveLang('xx', ['de'])).toBe('en');
	});
});

describe('translate', () => {
	it('returns the entry for the language', () => {
		expect(translate('tr', 'firstRun.startFresh')).toBe('Sıfırdan başla');
	});

	it('falls back to English when an entry is missing', () => {
		const saved = dictionaries.kk['firstRun.pair'];
		dictionaries.kk['firstRun.pair'] = '';
		expect(translate('kk', 'firstRun.pair')).toBe(dictionaries.en['firstRun.pair']);
		dictionaries.kk['firstRun.pair'] = saved;
	});
});

describe('isLang', () => {
	it('accepts only supported languages', () => {
		expect(isLang('kk')).toBe(true);
		expect(isLang('system')).toBe(false);
		expect(isLang(undefined)).toBe(false);
	});
});
