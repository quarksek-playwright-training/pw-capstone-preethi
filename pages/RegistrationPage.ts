
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface RegistrationDetails {
    name: string;
    email: string;
    password: string;
    title: 'Mr' | 'Mrs';
    day: string;
    month: string;
    year: string;
    firstName: string;
    lastName: string;
    company: string;
    address: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
}

export class RegistrationPage extends BasePage {
    
    readonly signupLoginLink: Locator;
    readonly signupNameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupButton: Locator;

    
    readonly titleMr: Locator;
    readonly titleMrs: Locator;
    readonly passwordInput: Locator;
    readonly dayDropdown: Locator;
    readonly monthDropdown: Locator;
    readonly yearDropdown: Locator;
    readonly newsletterCheckbox: Locator;
    readonly offersCheckbox: Locator;

    
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly companyInput: Locator;
    readonly addressInput: Locator;
    readonly address2Input: Locator;
    readonly countryDropdown: Locator;
    readonly stateInput: Locator;
    readonly cityInput: Locator;
    readonly zipcodeInput: Locator;
    readonly mobileInput: Locator;

    
    readonly createAccountButton: Locator;
    readonly accountCreatedMessage: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        super(page);

        this.signupLoginLink = page.getByRole('link', {
            name: 'Signup / Login',
        });

        
        this.signupNameInput = page.locator(
            'form[action="/signup"] input[name="name"]'
        );

        this.signupEmailInput = page.locator(
            'form[action="/signup"] input[name="email"]'
        );

        this.signupButton = page.locator(
            'form[action="/signup"] button[type="submit"]'
        );

       
        this.titleMr = page.locator('#id_gender1');
        this.titleMrs = page.locator('#id_gender2');

        
        this.passwordInput = page.locator('#password');
        this.dayDropdown = page.locator('#days');
        this.monthDropdown = page.locator('#months');
        this.yearDropdown = page.locator('#years');

        
        this.newsletterCheckbox = page.locator('#newsletter');
        this.offersCheckbox = page.locator('#optin');

        
        this.firstNameInput = page.locator('#first_name');
        this.lastNameInput = page.locator('#last_name');
        this.companyInput = page.locator('#company');
        this.addressInput = page.locator('#address1');
        this.address2Input = page.locator('#address2');
        this.countryDropdown = page.locator('#country');
        this.stateInput = page.locator('#state');
        this.cityInput = page.locator('#city');
        this.zipcodeInput = page.locator('#zipcode');
        this.mobileInput = page.locator('#mobile_number');

        this.createAccountButton = page.getByRole('button', {
            name: 'Create Account',
        });

        this.accountCreatedMessage = page.getByText(
            'Account Created!',
            { exact: false }
        );

        this.continueButton = page.getByRole('link', {
            name: 'Continue',
        });
    }

    async openSignupPage() {
        await this.navigateTo('/');
        await this.signupLoginLink.click();
    }

    async startSignup(name: string, email: string) {
        await this.signupNameInput.fill(name);
        await this.signupEmailInput.fill(email);
        await this.signupButton.click();

         try {
        // Wait for the next registration form to appear.
        await this.passwordInput.waitFor({
            state: 'visible',
            timeout: 8000,
        });

        return true; // New account: registration form appeared.
    } catch {
        return false; // Registration form did not appear.
    }
    }

    async fillAccountInformation(details: RegistrationDetails) {
        if (details.title === 'Mr') {
            await this.titleMr.check();
        } else {
            await this.titleMrs.check();
        }

        await this.passwordInput.fill(details.password);

        await this.dayDropdown.selectOption(details.day);
        await this.monthDropdown.selectOption(details.month);
        await this.yearDropdown.selectOption(details.year);

        await this.newsletterCheckbox.check();
        await this.offersCheckbox.check();

        await this.firstNameInput.fill(details.firstName);
        await this.lastNameInput.fill(details.lastName);
        await this.companyInput.fill(details.company);
        await this.addressInput.fill(details.address);
        await this.address2Input.fill(details.address2);

        await this.countryDropdown.selectOption({
            label: details.country,
        });

        await this.stateInput.fill(details.state);
        await this.cityInput.fill(details.city);
        await this.zipcodeInput.fill(details.zipcode);
        await this.mobileInput.fill(details.mobileNumber);
    }

    async createAccount() {
        await this.createAccountButton.click();
    }

    async continueAfterRegistration() {
        await this.continueButton.click();
    }
}
