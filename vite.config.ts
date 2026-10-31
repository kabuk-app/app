import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// One static SPA bundle serves Tauri (desktop, mobile) and web.kabuk.app.
// `build:web` sets KABUK_OUT so the web output never overwrites the Tauri one.
const out = process.env.KABUK_OUT ?? 'build';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({ pages: out, assets: out, fallback: '200.html' })
		})
	],
	clearScreen: false,
	server: { port: 5173, strictPort: true }
});
