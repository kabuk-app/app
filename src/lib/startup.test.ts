import { describe, expect, it, vi } from 'vitest';
import { runStartup } from './startup';

function deps(platform: 'desktop' | 'mobile' | 'web') {
	const order: string[] = [];
	return {
		order,
		deps: {
			platform,
			shownAt: 123,
			ready: async () => void order.push('ready'),
			hidePageSplash: () => void order.push('hide'),
			splashDone: async () => void order.push('done'),
			wait: vi.fn(async () => void order.push('wait'))
		}
	};
}

describe('runStartup', () => {
	it('hides the in-page splash on web after the minimum time', async () => {
		const { order, deps: d } = deps('web');
		expect(await runStartup(d)).toBe('page');
		expect(order).toEqual(['ready', 'wait', 'hide']);
		expect(d.wait).toHaveBeenCalledWith(123);
	});

	it.each([
		['desktop', 'window'],
		['mobile', 'native']
	] as const)('tells the host on %s', async (platform, mode) => {
		const { order, deps: d } = deps(platform);
		expect(await runStartup(d)).toBe(mode);
		expect(order).toEqual(['ready', 'wait', 'done']);
	});

	it('uses the real wait by default', async () => {
		const { wait: _wait, ...rest } = deps('web').deps;
		await runStartup({ ...rest, shownAt: 0 });
	});
});
