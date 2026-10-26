import { Page } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) {}

    async navigateTo(path: string = '/') {
        await this.page.goto(path, {
        waitUntil: 'domcontentloaded',
    });
    }
}