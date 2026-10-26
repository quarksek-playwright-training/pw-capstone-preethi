import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    readonly productsLink: Locator;
    readonly viewCartLink: Locator;
    readonly productList: Locator;
    readonly cartTable: Locator;
    readonly cartItems: Locator;

    constructor(page: Page) {
        super(page);

        this.productsLink = page.getByRole('link', { name: 'Products' });
        this.viewCartLink = page.locator('a[href="/view_cart"]').first();

        this.productList = page.locator('.productinfo');
        this.cartTable = page.locator('#cart_info_table');
        this.cartItems = page.locator('#cart_info_table tbody tr');
    }

    async openProducts() {
        await this.page.goto('/products', { waitUntil: 'domcontentloaded' });
    }

    async addProductToCart(productName: string) {
        // XPath 1: why no getBy*
        const addToCartButton = this.page.locator(
            `xpath=//div[contains(@class,'productinfo')][p[normalize-space()='${productName}']]//a[contains(@class,'add-to-cart')]`
        );

       
        const addToCartResponse = this.page.waitForResponse((response) =>
            response.url().includes('/add_to_cart/')
        );
        await addToCartButton.click();
        await addToCartResponse;

        // The "Added!" modal appears once the server has the item
        const cartModal = this.page.locator('#cartModal');
        await cartModal.waitFor({ state: 'visible' });
        await cartModal.getByRole('button', { name: 'Continue Shopping' }).click();
        await cartModal.waitFor({ state: 'hidden' });
    }

    async openCart() {
        await this.page.goto('/view_cart', {
            waitUntil: 'domcontentloaded',
        });
    }

    getProductRow(productName: string) {
        return this.cartItems.filter({
            hasText: productName,
        });
    }

    getProductPriceCell(productName: string) {
        return this.page.locator(
            `xpath=//td[contains(@class,'cart_description')][.//a[normalize-space()='${productName}']]/following-sibling::td[contains(@class,'cart_price')]/p`
        );
    }

    async getProductPrice(productName: string) {
        return this.getProductPriceCell(productName).textContent();
    }

    // No cart-deletion endpoint exists, so the cart is emptied through the UI.
    async clearCart() {
        await this.openCart();
        const deleteButtons = this.page.locator('.cart_quantity_delete');

        let rows = await this.cartItems.count();
        while (rows > 0) {
            await deleteButtons.first().click();
            // Each delete removes its row in place; wait for the row count to drop.
            await this.cartItems.nth(rows - 1).waitFor({ state: 'detached' });
            rows = await this.cartItems.count();
        }
    }
}
