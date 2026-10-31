import { describe, expect, it, vi } from 'vitest';
import { MIN_SPLASH_MS, remainingSplashMs, splashMode, waitForSplash } from './splash';

describe('remainingSplashMs', () => {
	it('requires 800 ms by default', () => {
		expect(MIN_SPLASH_MS).toBe(800);
		expect(remainingSplashMs(1000, 1000)).toBe(800);
	});

	it('counts down', () => {
		expect(remainingSplashMs(1000, 1300)).toBe(500);
	});

	it('is zero at and after the minimum', () => {
		expect(remainingSplashMs(1000, 1800)).toBe(0);
		expect(remainingSplashMs(1000, 5000)).toBe(0);
	});

	it('honours a custom minimum', () => {
		expect(remainingSplashMs(0, 100, 300)).toBe(200);
	});
});

describe('waitForSplash', () => {
	it('sleeps for the remaining time', async () => {
		const sleep = vi.fn(async () => {});
		await waitForSplash(1000, () => 1300, sleep);
		expect(sleep).toHaveBeenCalledWith(500);
	});

	it('uses real timers by default', async () => {
		vi.useFakeTimers();
		vi.setSystemTime(1000);
		let done = false;
		const pending = waitForSplash(900).then(() => (done = true));
		await vi.advanceTimersByTimeAsync(699);
		expect(done).toBe(false);
		await vi.advanceTimersByTimeAsync(1);
		await pending;
		expect(done).toBe(true);
		vi.useRealTimers();
	});
});

describe('splashMode', () => {
	it('maps platforms', () => {
		expect(splashMode('desktop')).toBe('window');
		expect(splashMode('mobile')).toBe('native');
		expect(splashMode('web')).toBe('page');
	});
});
