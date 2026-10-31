import { describe, expect, it } from 'vitest';
import { prerender, ssr } from './+layout';

describe('layout options', () => {
	it('is a prerendered client-only SPA shell', () => {
		expect(ssr).toBe(false);
		expect(prerender).toBe(true);
	});
});
