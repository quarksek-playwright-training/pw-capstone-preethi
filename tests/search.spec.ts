
import { test, expect } from '@playwright/test';


const searchTerms = [
    'Blue Top',
    'Men Tshirt',
    'Sleeveless Dress',
];

test(
    'Search returns only matching products for multiple terms @regression @search',
    { tag: ['@regression', '@search'] },
    async ({ page }) => {
        await page.goto('/products', {
            waitUntil: 'domcontentloaded',
        });

        const searchInput = page.locator('#search_product');
        const searchButton = page.locator('#submit_search');
        const searchedProductsHeading = page.getByRole('heading', {
            name: 'Searched Products',
            exact: true,
        });
        const productCards = page.locator(
            '.features_items .product-image-wrapper'
        );

        for (const term of searchTerms) {
                       // Enter the term and submit the search.
            await searchInput.fill(term);
            await searchButton.click();

           
            await page.waitForURL(
                (url) => url.searchParams.get('search') === term,
                { waitUntil: 'domcontentloaded' }
            );

            // Confirm that the searched-results section is displayed.
            await expect(searchedProductsHeading).toBeVisible();


            // Confirm that the search returned at least one product.
            await expect(productCards.first()).toBeVisible();

            const count = await productCards.count();

            expect(
                count,
                `Search for "${term}" should return at least one product`
            ).toBeGreaterThan(0);

            // Every displayed product card must contain the current search term.
            for (let i = 0; i < count; i++) {
                await expect(
                    productCards.nth(i),
                    `Product card ${i + 1} should match "${term}"`
                ).toContainText(term, { ignoreCase: true });
            }
        }
    }
);
