
import { test, expect } from '@playwright/test';

test(
    'Forced page failure displays an error response @regression @cart @negative',
    { tag: ['@regression', '@cart', '@negative'] },
    async ({ page }) => {
        // Force the products page navigation to return HTTP 500.
        await page.route('**/products', async (route) => {
            await route.fulfill({
                status: 500,
                contentType: 'text/html',
                body: '<h1>500 - Internal Server Error</h1>',
            });
        });

        const response = await page.goto('/products', {
            waitUntil: 'domcontentloaded',
        });

        expect(response?.status()).toBe(500);
        await expect(
            page.getByRole('heading', {
                name: '500 - Internal Server Error',
            })
        ).toBeVisible();
    }
);
