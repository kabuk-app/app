export type Platform = 'desktop' | 'mobile' | 'web';

export interface Capabilities {
	localTerminal: boolean;
	mosh: boolean;
	serial: boolean;
	sshAgent: boolean;
}

export interface Environment {
	/** `'serial' in navigator`, only meaningful on the web. */
	webSerial: boolean;
}

/**
 * The single place that decides what exists where. The UI hides things based on
 * these flags, never on a platform name.
 */
export function capabilities(platform: Platform, env: Environment = { webSerial: false }): Capabilities {
	switch (platform) {
		case 'desktop':
			return { localTerminal: true, mosh: true, serial: true, sshAgent: true };
		case 'mobile':
			return { localTerminal: false, mosh: true, serial: false, sshAgent: false };
		case 'web':
			return { localTerminal: false, mosh: false, serial: env.webSerial, sshAgent: false };
	}
}

export interface Runtime {
	tauri: boolean;
	userAgent: string;
	webSerial: boolean;
}

const MOBILE_UA = /Android|iPhone|iPad|iPod/i;

export function detectPlatform(runtime: Runtime): Platform {
	if (!runtime.tauri) return 'web';
	return MOBILE_UA.test(runtime.userAgent) ? 'mobile' : 'desktop';
}

export function currentRuntime(): Runtime {
	return {
		tauri: '__TAURI_INTERNALS__' in window,
		userAgent: navigator.userAgent,
		webSerial: 'serial' in navigator
	};
}
