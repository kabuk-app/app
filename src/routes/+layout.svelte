<script lang="ts">
	import '../app.css';
	import { onMount, tick, type Snippet } from 'svelte';
	import { splashDone } from '../lib/host';
	import { currentRuntime, detectPlatform } from '../lib/platform';
	import { settings } from '../lib/settings.svelte';
	import Splash from '../lib/Splash.svelte';
	import { splashMode } from '../lib/splash';
	import { runStartup } from '../lib/startup';

	let { children }: { children: Snippet } = $props();

	// ssr is off, so this only ever runs in the browser or webview.
	const platform = detectPlatform(currentRuntime());
	// Only the web shows the splash inside the page; the other platforms use a window or native one.
	let showSplash = $state(splashMode(platform) === 'page');

	onMount(() => {
		const stop = settings.init();
		void runStartup({
			platform,
			shownAt: performance.timeOrigin,
			ready: tick,
			hidePageSplash: () => (showSplash = false),
			splashDone
		});
		return stop;
	});
</script>

{@render children()}
{#if showSplash}
	<Splash />
{/if}
