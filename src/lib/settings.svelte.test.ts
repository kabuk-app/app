import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { settings, t } from './settings.svelte';

function mockSystem(dark: boolean, languages: string[] = ['en-US']) {
	const query = Object.assign(new EventTarget(), { matches: dark });
	vi.stubGlobal('matchMedia', () => query);
	vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages);
	return {
		flip(next: boolean) {
			query.matches = next;
			query.dispatchEvent(Object.assign(new Event('change'), { matches: next }));
		}
	};
}

let stop: () => void;

beforeEach(() => {
	localStorage.clear();
	delete document.documentElement.dataset.theme;
});

afterEach(() => {
	stop?.();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('language', () => {
	it('follows the system and falls back to English', () => {
		mockSystem(false, ['kk-KZ']);
		stop = settings.init();
		expect(settings.lang).toBe('kk');
		flushSync();
		expect(document.documentElement.lang).toBe('kk');
		stop();
		mockSystem(false, ['de']);
		stop = settings.init();
		expect(settings.lang).toBe('en');
	});

	it('uses navigator.language when the list is empty', () => {
		mockSystem(false, []);
		vi.spyOn(navigator, 'language', 'get').mockReturnValue('tr-TR');
		stop = settings.init();
		expect(settings.lang).toBe('tr');
	});

	it('lets the user override and remembers it', () => {
		mockSystem(false, ['tr']);
		stop = settings.init();
		settings.setLang('ru');
		flushSync();
		expect(settings.lang).toBe('ru');
		expect(localStorage.getItem('kabuk.lang')).toBe('ru');
		expect(document.documentElement.lang).toBe('ru');
		expect(t('firstRun.startFresh')).toBe('Начать с нуля');
		stop();
		stop = settings.init();
		expect(settings.lang).toBe('ru');
		settings.setLang('system');
		expect(settings.lang).toBe('tr');
		settings.setLang('bogus');
		expect(settings.langPref).toBe('system');
	});
});

describe('theme', () => {
	it('follows the system live', () => {
		const system = mockSystem(true);
		stop = settings.init();
		flushSync();
		expect(document.documentElement.dataset.theme).toBe('dark');
		system.flip(false);
		flushSync();
		expect(document.documentElement.dataset.theme).toBe('light');
	});

	it('lets the user override and remembers it', () => {
		const system = mockSystem(false);
		stop = settings.init();
		settings.setTheme('dark');
		flushSync();
		expect(document.documentElement.dataset.theme).toBe('dark');
		expect(localStorage.getItem('kabuk.theme')).toBe('dark');
		system.flip(true);
		system.flip(false);
		flushSync();
		expect(document.documentElement.dataset.theme).toBe('dark');
	});

	it('stops applying changes after cleanup', () => {
		const system = mockSystem(false);
		stop = settings.init();
		stop();
		system.flip(true);
		flushSync();
		expect(settings.systemDark).toBe(false);
	});
});

describe('blocked storage', () => {
	it('still works for the session', () => {
		mockSystem(false);
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('blocked');
		});
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('blocked');
		});
		stop = settings.init();
		expect(settings.langPref).toBe('system');
		settings.setTheme('dark');
		expect(settings.themePref).toBe('dark');
	});
});
