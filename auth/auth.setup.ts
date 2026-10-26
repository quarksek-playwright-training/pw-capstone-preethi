
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import {
    RegistrationPage,
    RegistrationDetails,
} from '../pages/RegistrationPage';
import fs from 'node:fs';
import path from 'node:path';

const authDir = path.resolve('.auth');

const accounts: RegistrationDetails[] = [
    {
        name: 'Preethi Test',
        email: process.env.ACCOUNT1_EMAIL!,
        password: process.env.ACCOUNT1_PASSWORD!,
        title: 'Mrs',
        day: '3',
        month: '5',
        year: '1996',
        firstName: 'Preethi',
        lastName: 'Test',
        company: 'Test Company',
        address: 'Test Street',
        address2: 'Test Area',
        country: 'India',
        state: 'Tamil Nadu',
        city: 'Chennai',
        zipcode: '600001',
        mobileNumber: '9000000001',
    },
    {
        name: 'Merlin Test',
        email: process.env.ACCOUNT2_EMAIL!,
        password: process.env.ACCOUNT2_PASSWORD!,
        title: 'Mr',
        day: '3',
        month: '5',
        year: '1995',
        firstName: 'Merlin',
        lastName: 'Test',
        company: 'Test Company',
        address: 'Test Street',
        address2: 'Test Area',
        country: 'India',
        state: 'Tamil Nadu',
        city: 'Chennai',
        zipcode: '600002',
        mobileNumber: '9000000002',
    },
];

test('create or reuse accounts and save authenticated sessions', async ({
    browser,
}) => {
    test.setTimeout(180_000);

    if (
        !process.env.ACCOUNT1_EMAIL ||
        !process.env.ACCOUNT1_PASSWORD ||
        !process.env.ACCOUNT2_EMAIL ||
        !process.env.ACCOUNT2_PASSWORD
    ) {
        throw new Error(
            'Please configure both accounts in your .env file.'
        );
    }

    fs.mkdirSync(authDir, { recursive: true });

    for (const [index, account] of accounts.entries()) {
        const context = await browser.newContext();
        const page = await context.newPage();

        const registrationPage = new RegistrationPage(page);
        const loginPage = new LoginPage(page);

        try {
            console.log('Starting account setup:', account.email);

            // Open the signup page and check whether registration is possible.
            await registrationPage.openSignupPage();

            const registrationFormAppeared =
                await registrationPage.startSignup(
                    account.name,
                    account.email
                );

            if (registrationFormAppeared) {
                console.log(
                    'Registration form appeared. Creating account:',
                    account.email
                );

                await registrationPage.fillAccountInformation(account);
                await registrationPage.createAccount();

                await expect(
                    registrationPage.accountCreatedMessage
                ).toBeVisible({ timeout: 10000 });

                await registrationPage.continueAfterRegistration();

                // Log out before verifying login.
                await expect(loginPage.logoutLink).toBeVisible();
                await loginPage.logoutLink.click();

                console.log('Account registered successfully:', account.email);
            } else {
                console.log(
                    'Registration form did not appear. Trying login:',
                    account.email
                );
            }

            // Log in for both newly registered and existing accounts.
            await loginPage.openLoginPage();
            await loginPage.login(account.email, account.password);

            // Verify login succeeded before saving the session.
            await expect(loginPage.logoutLink).toBeVisible({
                timeout: 10000,
            });

            const authFile = path.join(
                authDir,
                `account${index + 1}.json`
            );

            await context.storageState({ path: authFile });

            console.log('Saved auth file:', authFile);
        } catch (error) {
            console.error(
                `Account setup failed for ${account.email}:`,
                error
            );
            throw error;
        } finally {
            await context.close();
        }
    }
});
