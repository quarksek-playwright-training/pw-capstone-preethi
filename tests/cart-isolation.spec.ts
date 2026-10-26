import { test, expect } from '../fixtures/auth.fixture';
import { CartPage } from '../pages/CartPage';

test(
    '@regression @cart Scenario 4 - cart state isolation between accounts',
    async ({ account1Page, account2Page }) => {
        const account1Cart = new CartPage(account1Page);
        const account2Cart = new CartPage(account2Page);

        // Navigate both accounts to the home page.
        await account1Page.goto('/', { waitUntil: 'domcontentloaded' });
        await account2Page.goto('/', { waitUntil: 'domcontentloaded' });

        // Verify both accounts are logged in.
        await expect(
            account1Page.getByText('Logged in as Preethi Titus')
        ).toBeVisible();

        await expect(
            account2Page.getByText('Logged in as Merlin Test')
        ).toBeVisible();

        // Ensure Account 1's cart is empty.
        await account1Cart.openCart();

        while (await account1Cart.cartItems.count() > 0) {
            const previousCount = await account1Cart.cartItems.count();

            await account1Cart.cartItems
                .first()
                .locator('.cart_quantity_delete')
                .click();

            await expect(account1Cart.cartItems).toHaveCount(
                previousCount - 1
            );
        }

        await expect(account1Cart.cartItems).toHaveCount(0);

        // Ensure Account 2's cart is empty.
        await account2Cart.openCart();

        while (await account2Cart.cartItems.count() > 0) {
            const previousCount = await account2Cart.cartItems.count();

            await account2Cart.cartItems
                .first()
                .locator('.cart_quantity_delete')
                .click();

            await expect(account2Cart.cartItems).toHaveCount(
                previousCount - 1
            );
        }

        await expect(account2Cart.cartItems).toHaveCount(0);

        // Add Blue Top to Account 2's cart.
        await account2Cart.openProducts();
        await account2Cart.addProductToCart('Blue Top');
        await account2Cart.openCart();

        // Verify Account 2's cart contains Blue Top.
        await expect(
            account2Cart.getProductRow('Blue Top')
        ).toBeVisible();

        // Verify Account 1's cart remains empty.
        await account1Cart.openCart();
        await expect(account1Cart.cartItems).toHaveCount(0);
    }
);