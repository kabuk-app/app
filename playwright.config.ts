import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	fullyParallel: true,
	reporter: 'list',
	use: { baseURL: 'http://localhost:4173' },
	webServer: {
		command: 'bun run build:web && bunx vite preview --outDir build-web --port 4173 --strictPort',
		url: 'http://localhost:4173',
		reuseExistingServer: false
	}
});
