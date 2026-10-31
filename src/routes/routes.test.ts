import { render, screen, waitFor } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Layout from './+layout.svelte';
import Page from './+page.svelte';

const { splashDone } = vi.hoisted(() => ({ splashDone: vi.fn(async () => {}) }));
vi.mock('../lib/host', () => ({ splashDone }));

const child = createRawSnippet(() => ({ render: () => '<p>child</p>' }));

function stubSystem() {
	vi.stubGlobal('matchMedia', () => Object.assign(new EventTarget(), { matches: false }));
}

beforeEach(() => {
	localStorage.clear();
	stubSystem();
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.useRealTimers();
	delete (window as unknown as Record<string, unknown>).__TAURI_INTERNALS__;
	splashDone.mockClear();
});

describe('layout', () => {
	it('shows the in-page splash on web for at least 800 ms', async () => {
		vi.useFakeTimers({ toFake: ['setTimeout', 'Date'] });
		vi.setSystemTime(performance.timeOrigin + 100);
		render(Layout, { children: child });
		expect(screen.getByText('child')).toBeInTheDocument();
		expect(screen.getByRole('status')).toBeInTheDocument();
		await vi.advanceTimersByTimeAsync(699);
		expect(screen.queryByRole('status')).toBeInTheDocument();
		await vi.advanceTimersByTimeAsync(1);
		await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
		expect(splashDone).not.toHaveBeenCalled();
	});

	it('hands over to the host on desktop and shows no in-page splash', async () => {
		(window as unknown as Record<string, unknown>).__TAURI_INTERNALS__ = {};
		vi.useFakeTimers({ toFake: ['setTimeout', 'Date'] });
		vi.setSystemTime(performance.timeOrigin + 900);
		render(Layout, { children: child });
		expect(screen.queryByRole('status')).not.toBeInTheDocument();
		await vi.advanceTimersByTimeAsync(0);
		await waitFor(() => expect(splashDone).toHaveBeenCalledOnce());
	});
});

describe('page', () => {
	it('renders the first-run screen', () => {
		render(Page);
		expect(screen.getByRole('button', { name: /fresh|Sıfırdan|Жаңадан|нуля/ })).toBeInTheDocument();
	});
});
