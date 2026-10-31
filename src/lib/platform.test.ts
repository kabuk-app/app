import { describe, expect, it } from 'vitest';
import { capabilities, currentRuntime, detectPlatform } from './platform';

describe('capabilities', () => {
	it('desktop has everything', () => {
		expect(capabilities('desktop')).toEqual({
			localTerminal: true,
			mosh: true,
			serial: true,
			sshAgent: true
		});
	});

	it('mobile has Mosh only', () => {
		expect(capabilities('mobile')).toEqual({
			localTerminal: false,
			mosh: true,
			serial: false,
			sshAgent: false
		});
	});

	it('web has no Mosh, local terminal or agent', () => {
		expect(capabilities('web')).toEqual({
			localTerminal: false,
			mosh: false,
			serial: false,
			sshAgent: false
		});
	});

	it('web serial depends on the browser', () => {
		expect(capabilities('web', { webSerial: true }).serial).toBe(true);
		expect(capabilities('web', { webSerial: false }).serial).toBe(false);
	});
});

describe('detectPlatform', () => {
	const base = { webSerial: false };

	it('is web outside Tauri', () => {
		expect(detectPlatform({ ...base, tauri: false, userAgent: 'Android' })).toBe('web');
	});

	it('is desktop in Tauri on a desktop OS', () => {
		expect(detectPlatform({ ...base, tauri: true, userAgent: 'X11; Linux x86_64' })).toBe('desktop');
	});

	it.each(['Linux; Android 15', 'iPhone; CPU iPhone OS 18', 'iPad; CPU OS 18'])(
		'is mobile in Tauri on %s',
		(userAgent) => {
			expect(detectPlatform({ ...base, tauri: true, userAgent })).toBe('mobile');
		}
	);
});

describe('currentRuntime', () => {
	it('reads the browser environment', () => {
		const runtime = currentRuntime();
		expect(runtime.tauri).toBe(false);
		expect(runtime.userAgent).toBe(navigator.userAgent);
		expect(runtime.webSerial).toBe(false);
	});

	it('detects Tauri and Web Serial', () => {
		(window as unknown as Record<string, unknown>).__TAURI_INTERNALS__ = {};
		Object.defineProperty(navigator, 'serial', { value: {}, configurable: true });
		const runtime = currentRuntime();
		expect(runtime.tauri).toBe(true);
		expect(runtime.webSerial).toBe(true);
		delete (window as unknown as Record<string, unknown>).__TAURI_INTERNALS__;
		delete (navigator as unknown as Record<string, unknown>).serial;
	});
});
