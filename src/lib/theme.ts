import type { MessageKey } from './i18n';

export type Scheme = 'light' | 'dark';

export interface ThemeDef {
	id: string;
	/** Key into the i18n dictionaries. */
	labelKey: MessageKey;
	scheme: Scheme;
}

/** `system` is a preference, not a theme: it resolves to light or dark. */
export const SYSTEM = 'system';

const registry = new Map<string, ThemeDef>();

export function registerTheme(def: ThemeDef): void {
	registry.set(def.id, def);
}

export function listThemes(): ThemeDef[] {
	return [...registry.values()];
}

export function getTheme(id: string): ThemeDef | undefined {
	return registry.get(id);
}

registerTheme({ id: 'light', labelKey: 'theme.light', scheme: 'light' });
registerTheme({ id: 'dark', labelKey: 'theme.dark', scheme: 'dark' });

/** Turn a stored preference into a registered theme id. Unknown ids follow the system. */
export function resolveTheme(pref: string | undefined, systemDark: boolean): string {
	if (pref !== undefined && registry.has(pref)) return pref;
	return systemDark ? 'dark' : 'light';
}

export function applyTheme(id: string, root: HTMLElement = document.documentElement): void {
	root.dataset.theme = id;
}

/** Calls `onChange` whenever the system colour scheme flips. Returns an unsubscribe. */
export function watchSystemDark(
	onChange: (dark: boolean) => void,
	query: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
): () => void {
	const listener = (event: MediaQueryListEvent) => onChange(event.matches);
	query.addEventListener('change', listener);
	return () => query.removeEventListener('change', listener);
}
