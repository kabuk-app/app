import { expect, test } from '@playwright/test';

const cases = [
	{ locale: 'en-US', title: 'Welcome to Kabuk', fresh: 'Start fresh', lang: 'en' },
	{ locale: 'tr-TR', title: 'Kabuk’a hoş geldiniz', fresh: 'Sıfırdan başla', lang: 'tr' },
	{ locale: 'kk-KZ', title: 'Kabuk-қа қош келдіңіз', fresh: 'Жаңадан бастау', lang: 'kk' },
	{ locale: 'ru-RU', title: 'Добро пожаловать в Kabuk', fresh: 'Начать с нуля', lang: 'ru' }
];

for (const { locale, title, fresh, lang } of cases) {
	test.describe(`first run in ${lang}`, () => {
		test.use({ locale });

		test('shows the first-run screen in the system language', async ({ page }) => {
			await page.goto('/');
			await expect(page.getByRole('heading', { name: title })).toBeVisible();
			await expect(page.getByRole('button', { name: fresh })).toBeVisible();
			await expect(page.locator('html')).toHaveAttribute('lang', lang);
			// The in-page splash is gone once the minimum time has passed.
			await expect(page.getByRole('status')).toHaveCount(0);
		});

		for (const scheme of ['light', 'dark'] as const) {
			test(`follows the ${scheme} system theme`, async ({ page }) => {
				await page.emulateMedia({ colorScheme: scheme });
				await page.goto('/');
				await expect(page.getByRole('heading', { name: title })).toBeVisible();
				await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
			});
		}
	});
}

test('follows the system theme live', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light' });
	await page.goto('/');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	await page.emulateMedia({ colorScheme: 'dark' });
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('a user choice overrides the system and survives a reload', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light' });
	await page.goto('/');
	await page.getByRole('group', { name: 'Theme' }).getByRole('button', { name: 'Dark' }).click();
	await page.getByRole('button', { name: 'Türkçe' }).click();
	await expect(page.getByRole('heading', { name: 'Kabuk’a hoş geldiniz' })).toBeVisible();
	await page.reload();
	await expect(page.getByRole('heading', { name: 'Kabuk’a hoş geldiniz' })).toBeVisible();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('an unsupported system language falls back to English', async ({ browser }) => {
	const context = await browser.newContext({ locale: 'de-DE' });
	const page = await context.newPage();
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Welcome to Kabuk' })).toBeVisible();
	await context.close();
});
