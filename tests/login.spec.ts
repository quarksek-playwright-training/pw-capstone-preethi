
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test(
    'Login with valid credentials @smoke @auth',
    { tag: ['@smoke', '@auth'] },
    async ({ page }) => {
        const loginPage = new LoginPage(page);

        const email = process.env.ACCOUNT1_EMAIL;
        const password = process.env.ACCOUNT1_PASSWORD;

        if (!email || !password) {
            throw new Error(
                'ACCOUNT1_EMAIL and ACCOUNT1_PASSWORD must be set in .env'
            );
        }

        await loginPage.openLoginPage();
        await loginPage.login(email, password);

        await expect(loginPage.logoutLink).toBeVisible();
    }
);
