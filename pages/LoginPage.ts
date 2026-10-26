
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    readonly signupLoginLink: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly loginError: Locator;
    readonly logoutLink: Locator;

    constructor(page: Page) {
        super(page);

        this.signupLoginLink = page.getByRole('link', {
            name: 'Signup / Login',
        });

        this.emailInput = page.locator(
            'form[action="/login"] input[name="email"]'
        );

        this.passwordInput = page.locator(
            'form[action="/login"] input[name="password"]'
        );

        this.loginButton = page.locator(
            'form[action="/login"] button[type="submit"]'
        );

        this.loginError = page.getByText(
            'Your email or password is incorrect!'
        );

        this.logoutLink = page.getByRole('link', {
                 name: 'Logout',
        });
    }

    async openLoginPage() {
        await this.navigateTo('/');
        await this.signupLoginLink.click();
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
