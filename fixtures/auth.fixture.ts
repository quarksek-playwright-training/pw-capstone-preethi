import { test as base, Page, BrowserContext } from '@playwright/test';

type AuthFixtures = {
    account1Page: Page;
    account2Page: Page;
};

// blocking ad
const AD_HOSTS = /googlesyndication|doubleclick|googleadservices|adservice\.google|google-analytics|googletagmanager|fundingchoicesmessages/;

async function blockAds(context: BrowserContext) {
    await context.route(AD_HOSTS, (route) => route.abort());
}

export const test = base.extend<AuthFixtures>({
    account1Page: async ({ browser }, use) => {
        const context = await browser.newContext({
            storageState: '.auth/account1.json',
        });
        await blockAds(context);

        const page = await context.newPage();

        await use(page);

        await context.close();
    },

    account2Page: async ({ browser }, use) => {
        const context = await browser.newContext({
            storageState: '.auth/account2.json',
        });
        await blockAds(context);

        const page = await context.newPage();

        await use(page);

        await context.close();
    },
});

export { expect } from '@playwright/test';
