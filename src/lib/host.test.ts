import { describe, expect, it, vi } from 'vitest';

const invoke = vi.fn(async () => {});
vi.mock('@tauri-apps/api/core', () => ({ invoke }));

describe('splashDone', () => {
	it('invokes the splash_done command', async () => {
		const { splashDone } = await import('./host');
		await splashDone();
		expect(invoke).toHaveBeenCalledWith('splash_done');
	});
});
