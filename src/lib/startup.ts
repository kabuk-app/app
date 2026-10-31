import { splashMode, waitForSplash, type SplashMode } from './splash';
import type { Platform } from './platform';

export interface StartupDeps {
	platform: Platform;
	/** Epoch ms when the splash became visible. */
	shownAt: number;
	/** Resolves when the app has what it needs to show the first screen. */
	ready: () => Promise<void>;
	/** Removes the in-page splash (web). */
	hidePageSplash: () => void;
	/** Closes the splash window and reveals the main one (desktop, mobile). */
	splashDone: () => Promise<void>;
	wait?: typeof waitForSplash;
}

/** Wait for readiness and the minimum splash time, then dismiss the splash for this platform. */
export async function runStartup(deps: StartupDeps): Promise<SplashMode> {
	const mode = splashMode(deps.platform);
	await deps.ready();
	await (deps.wait ?? waitForSplash)(deps.shownAt);
	if (mode === 'page') deps.hidePageSplash();
	else await deps.splashDone();
	return mode;
}
