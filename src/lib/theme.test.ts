import { describe, expect, it, vi } from 'vitest';
import {
	SYSTEM,
	applyTheme,
	getTheme,
	listThemes,
	registerTheme,
	resolveTheme,
	watchSystemDark
} from './theme';

describe('registry', () => {
	it('ships light and dark', () => {
		expect(listThemes().map((theme) => theme.id)).toEqual(expect.arrayContaining(['light', 'dark']));
		expect(getTheme('dark')?.scheme).toBe('dark');
	});

	it('accepts additional themes', () => {
		registerTheme({ id: 'solar', labelKey: 'theme.light', scheme: 'light' });
		expect(getTheme('solar')).toBeDefined();
		expect(resolveTheme('solar', true)).toBe('solar');
	});
});

describe('resolveTheme', () => {
	it('follows the system by default', () => {
		expect(resolveTheme(SYSTEM, true)).toBe('dark');
		expect(resolveTheme(SYSTEM, false)).toBe('light');
		expect(resolveTheme(undefined, true)).toBe('dark');
	});

	it('lets the user override the system', () => {
		expect(resolveTheme('light', true)).toBe('light');
		expect(resolveTheme('dark', false)).toBe('dark');
	});

	it('treats an unknown id as system', () => {
		expect(resolveTheme('gone', true)).toBe('dark');
	});
});

describe('applyTheme', () => {
	it('sets data-theme on the root', () => {
		applyTheme('dark');
		expect(document.documentElement.dataset.theme).toBe('dark');
		const el = document.createElement('div');
		applyTheme('light', el);
		expect(el.dataset.theme).toBe('light');
	});
});

describe('watchSystemDark', () => {
	function fakeQuery() {
		const target = new EventTarget();
		return Object.assign(target, { matches: false }) as unknown as MediaQueryList;
	}

	it('reports live changes until unsubscribed', () => {
		const query = fakeQuery();
		const seen: boolean[] = [];
		const stop = watchSystemDark((dark) => seen.push(dark), query);
		query.dispatchEvent(Object.assign(new Event('change'), { matches: true }));
		stop();
		query.dispatchEvent(Object.assign(new Event('change'), { matches: false }));
		expect(seen).toEqual([true]);
	});

	it('uses window.matchMedia by default', () => {
		const query = fakeQuery();
		vi.stubGlobal('matchMedia', vi.fn(() => query));
		const stop = watchSystemDark(() => {});
		expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
		stop();
		vi.unstubAllGlobals();
	});
});
