export const MIN_SPLASH_MS = 800;

/**
 * How much longer the splash must stay up, given when it was shown and the current time.
 * Zero once the minimum display time has passed.
 */
export function remainingSplashMs(shownAt: number, now: number, minMs: number = MIN_SPLASH_MS): number {
	return Math.max(0, minMs - (now - shownAt));
}

/** Resolves once the splash has been visible for at least the minimum time. */
export function waitForSplash(
	shownAt: number,
	now: () => number = Date.now,
	sleep: (ms: number) => Promise<void> = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
): Promise<void> {
	return sleep(remainingSplashMs(shownAt, now()));
}

/**
 * Desktop closes a separate window, mobile hides the native splash, web removes an
 * in-page overlay. All three wait the same minimum.
 */
export type SplashMode = 'window' | 'native' | 'page';

export function splashMode(platform: 'desktop' | 'mobile' | 'web'): SplashMode {
	return platform === 'desktop' ? 'window' : platform === 'mobile' ? 'native' : 'page';
}
