import { fireEvent, render, screen, within } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FirstRun from './FirstRun.svelte';
import { settings } from './settings.svelte';

beforeEach(() => {
	settings.setLang('en');
	settings.setTheme('system');
});

describe('FirstRun', () => {
	it('offers start fresh and pair', () => {
		render(FirstRun);
		expect(screen.getByRole('heading', { name: 'Welcome to Kabuk' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Start fresh' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Pair with a device' })).toBeInTheDocument();
	});

	it('reports the choice', async () => {
		const onchoose = vi.fn();
		render(FirstRun, { onchoose });
		await fireEvent.click(screen.getByRole('button', { name: 'Start fresh' }));
		await fireEvent.click(screen.getByRole('button', { name: 'Pair with a device' }));
		expect(onchoose.mock.calls).toEqual([['fresh'], ['pair']]);
	});

	it('works without a handler', async () => {
		render(FirstRun);
		await fireEvent.click(screen.getByRole('button', { name: 'Start fresh' }));
		await fireEvent.click(screen.getByRole('button', { name: 'Pair with a device' }));
	});

	it('switches language from the picker', async () => {
		render(FirstRun);
		await fireEvent.click(screen.getByRole('button', { name: 'Türkçe' }));
		expect(screen.getByRole('heading', { name: 'Kabuk’a hoş geldiniz' })).toBeInTheDocument();
		expect(settings.langPref).toBe('tr');
		expect(screen.getByRole('button', { name: 'Türkçe' })).toHaveAttribute('aria-pressed', 'true');
	});

	it('returns to the system language', async () => {
		render(FirstRun);
		await fireEvent.click(screen.getByRole('button', { name: 'Русский' }));
		const group = screen.getByRole('group', { name: 'Язык' });
		await fireEvent.click(within(group).getByRole('button', { name: 'Как в системе' }));
		expect(settings.langPref).toBe('system');
	});

	it('switches theme from the picker', async () => {
		render(FirstRun);
		const group = screen.getByRole('group', { name: 'Theme' });
		await fireEvent.click(within(group).getByRole('button', { name: 'Dark' }));
		expect(settings.themePref).toBe('dark');
		await fireEvent.click(within(group).getByRole('button', { name: 'System default' }));
		expect(settings.themePref).toBe('system');
	});
});
