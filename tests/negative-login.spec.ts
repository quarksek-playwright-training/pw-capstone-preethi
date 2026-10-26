import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test(
    'Login with incorrect password shows error @regression @auth @negative',
    { tag: ['@regression', '@auth', '@negative'] },
    async ({ page }) => {
        const loginPage = new LoginPage(page);

        const email = process.env.ACCOUNT1_EMAIL;

        if (!email) {
            throw new Error('ACCOUNT1_EMAIL must be set in .env');
        }

        const incorrectPassword = 'WrongPassword123!';

        // Open the login page.
        await loginPage.openLoginPage();

        // Enter a valid email and an incorrect password.
        await loginPage.login(email, incorrectPassword);

        // Verify the specific error message.
        await expect(loginPage.loginError).toBeVisible();

        // Verify that the user remains on the login page.
        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
    }
);