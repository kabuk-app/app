<script lang="ts">
	import { t } from './settings.svelte';
</script>

<div class="splash" role="status" aria-label={t('splash.loading')}>
	<span class="name">{t('app.name')}</span>
</div>

<style>
	.splash {
		position: fixed;
		inset: 0;
		display: grid;
		place-items: center;
		background: var(--color-bg);
		color: var(--color-fg);
	}
	.name {
		font-size: 2rem;
		letter-spacing: 0.05em;
	}
</style>
