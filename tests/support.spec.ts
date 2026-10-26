
import { test, expect } from '@playwright/test';

test(
    'Submit support form and handle browser confirmation @regression @support',
    { tag: ['@regression', '@support'] },
    async ({ page }) => {
        await page.goto('/contact_us', {
            waitUntil: 'domcontentloaded',
        });

        await page.getByRole('textbox', { name: 'Name' }).fill('Preethi');
        await page.getByTestId('email').fill('preethi.test@example.com');
        await page.getByTestId('subject').fill('Playwright capstone support test');
        await page.getByRole('textbox', { name: 'Your Message Here' }).fill(
            'Testing the support form using Playwright.'
        );

        // Handle the browser's native confirmation dialog.
        page.once('dialog', async (dialog) => {
            expect(dialog.type()).toBe('confirm');
            await dialog.accept();
        });

        await page.locator('input[name="submit"]').click();

        // Verify the success message after accepting the confirmation.
        await expect(
            page.locator('.status.alert.alert-success')
        ).toContainText('Success! Your details have been submitted successfully.');
    }
);
