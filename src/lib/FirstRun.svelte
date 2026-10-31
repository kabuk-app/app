<script lang="ts" module>
	export type Choice = 'fresh' | 'pair';
</script>

<script lang="ts">
	import { LANGUAGES, LANGUAGE_NAMES } from './i18n';
	import { settings, t } from './settings.svelte';
	import { SYSTEM, listThemes } from './theme';

	let { onchoose }: { onchoose?: (choice: Choice) => void } = $props();
</script>

<main>
	<h1>{t('firstRun.title')}</h1>
	<p>{t('firstRun.intro')}</p>

	<div class="actions">
		<button type="button" onclick={() => onchoose?.('fresh')}>{t('firstRun.startFresh')}</button>
		<button type="button" onclick={() => onchoose?.('pair')}>{t('firstRun.pair')}</button>
	</div>

	<div class="prefs">
		<fieldset>
			<legend>{t('settings.language')}</legend>
			<button
				type="button"
				aria-pressed={settings.langPref === SYSTEM}
				onclick={() => settings.setLang(SYSTEM)}
			>
				{t('settings.languageSystem')}
			</button>
			{#each LANGUAGES as lang (lang)}
				<button
					type="button"
					{lang}
					aria-pressed={settings.langPref === lang}
					onclick={() => settings.setLang(lang)}
				>
					{LANGUAGE_NAMES[lang]}
				</button>
			{/each}
		</fieldset>
		<fieldset>
			<legend>{t('settings.theme')}</legend>
			<button
				type="button"
				aria-pressed={settings.themePref === SYSTEM}
				onclick={() => settings.setTheme(SYSTEM)}
			>
				{t('theme.system')}
			</button>
			{#each listThemes() as theme (theme.id)}
				<button
					type="button"
					aria-pressed={settings.themePref === theme.id}
					onclick={() => settings.setTheme(theme.id)}
				>
					{t(theme.labelKey)}
				</button>
			{/each}
		</fieldset>
	</div>
</main>

<style>
	main {
		max-width: 28rem;
		margin: 4rem auto;
		padding: 0 1rem;
	}
	.actions,
	.prefs,
	fieldset {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 1.5rem;
	}
	fieldset {
		border: 0;
		padding: 0;
		margin: 0;
	}
	button[aria-pressed='true'] {
		border-color: var(--color-accent);
	}
	button {
		font: inherit;
		color: var(--color-fg);
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		padding: 0.5rem 0.75rem;
	}
</style>
