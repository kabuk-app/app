import { FALLBACK_LANG, isLang, resolveLang, translate, type Lang, type MessageKey } from './i18n';
import { SYSTEM, applyTheme, resolveTheme, watchSystemDark } from './theme';

const LANG_KEY = 'kabuk.lang';
const THEME_KEY = 'kabuk.theme';

function read(key: string): string {
	try {
		return localStorage.getItem(key) ?? SYSTEM;
	} catch {
		return SYSTEM;
	}
}

function write(key: string, value: string): void {
	try {
		localStorage.setItem(key, value);
	} catch {
		// Storage can be blocked; the choice then only lasts for this session.
	}
}

class Settings {
	/** `'system'` or a language the user picked. */
	langPref = $state<string>(SYSTEM);
	/** `'system'` or a registered theme id. */
	themePref = $state<string>(SYSTEM);
	systemLangs = $state<readonly string[]>([FALLBACK_LANG]);
	systemDark = $state(false);

	lang = $derived<Lang>(resolveLang(this.langPref, this.systemLangs));
	theme = $derived(resolveTheme(this.themePref, this.systemDark));

	/** Read stored choices and the system state, then keep the DOM in sync. Returns a cleanup. */
	init(): () => void {
		this.langPref = read(LANG_KEY);
		this.themePref = read(THEME_KEY);
		this.systemLangs = navigator.languages.length ? navigator.languages : [navigator.language];
		const query = window.matchMedia('(prefers-color-scheme: dark)');
		this.systemDark = query.matches;
		const stop = watchSystemDark((dark) => (this.systemDark = dark), query);
		const stopEffects = $effect.root(() => {
			$effect(() => applyTheme(this.theme));
			$effect(() => {
				document.documentElement.lang = this.lang;
			});
		});
		return () => {
			stop();
			stopEffects();
		};
	}

	setLang(pref: string): void {
		this.langPref = isLang(pref) ? pref : SYSTEM;
		write(LANG_KEY, this.langPref);
	}

	setTheme(pref: string): void {
		this.themePref = pref;
		write(THEME_KEY, pref);
	}
}

export const settings = new Settings();

/** Reactive: re-evaluates when the language changes. */
export function t(key: MessageKey): string {
	return translate(settings.lang, key);
}
