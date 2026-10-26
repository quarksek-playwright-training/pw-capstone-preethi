import { test, expect } from '../fixtures/auth.fixture';
import { CartPage } from '../pages/CartPage';

// Start from an empty cart and leave it empty, so leftovers from this test
// never leak into other specs (e.g. the state-isolation scenario).
test.beforeEach(async ({ account1Page }) => {
    await new CartPage(account1Page).clearCart();
});

test.afterEach(async ({ account1Page }) => {
    await new CartPage(account1Page).clearCart();
});

test(
    'Add a product to cart and verify its price @smoke @cart',
    { tag: ['@smoke', '@cart'] },
    async ({ account1Page, request }) => {
        const cartPage = new CartPage(account1Page);
        const productName = 'Blue Top';

        // Fetch product details from the read-only API.
        const apiResponse = await request.get('/api/productsList');
        expect(apiResponse.ok()).toBeTruthy();

        const responseBody = await apiResponse.json();

        const apiProduct = responseBody.products.find(
            (product: { name: string; price: string }) =>
                product.name === productName
        );

        expect(
            apiProduct,
            `Product "${productName}" should exist in the API response`
        ).toBeTruthy();

        // Open the products page.
        await account1Page.goto('/', {
            waitUntil: 'domcontentloaded',
        });
        await cartPage.openProducts();

        // Add the selected product to the cart.
        await cartPage.addProductToCart(productName);

        // Open the cart.
        await cartPage.openCart();

        // Verify the product is present.
        const productRow = cartPage.getProductRow(productName);
        await expect(productRow).toBeVisible();

        // Verify the UI price matches the API price (price located via the sibling-axis XPath).
        const uiPrice = (
            await cartPage.getProductPriceCell(productName).innerText()
        ).trim();
        expect(uiPrice).toBe(apiProduct.price);


    }
);