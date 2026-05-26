const { test, expect } = require('@playwright/test');
const testData = require('../../data/test-data.json');

test.describe('Verify Cart Tests', () => {

  test('Agregar Sauce Labs Bike Light al carrito y verificar en cart.html', async ({ page }) => {
    // 1. Hacer login con standard_user
    await page.goto('/');
    await page.fill('#user-name', testData.usuarios.standard.username);
    await page.fill('#password', testData.usuarios.standard.password);
    await page.click('#login-button');

    // Verificar que redirige a inventory
    await expect(page).toHaveURL(/.*inventory\.html/);

    // 2. Agregar "Sauce Labs Bike Light" al carrito (precio: $9.99)
    // Buscar el contenedor del producto "Sauce Labs Bike Light" y hacer clic en su botón "Add to cart"
    const bikeLightItem = page.locator('.inventory_item', { hasText: 'Sauce Labs Bike Light' });
    await bikeLightItem.locator('button', { hasText: 'Add to cart' }).click();

    // Verificar que el contador del carrito muestra "1"
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');

    // 3. Ir a la página del carrito (cart.html)
    await page.click('.shopping_cart_link');

    // Verificar que estamos en cart.html
    await expect(page).toHaveURL(/.*cart\.html/);

    // 4. Verificar que el producto "Sauce Labs Bike Light" está en el carrito
    const cartItem = page.locator('.cart_item', { hasText: 'Sauce Labs Bike Light' });
    await expect(cartItem).toBeVisible();

    // 5. Verificar que el precio mostrado es "$9.99"
    const cartItemPrice = cartItem.locator('.inventory_item_price');
    await expect(cartItemPrice).toBeVisible();
    await expect(cartItemPrice).toHaveText('$9.99');

    // 6. Verificar que solo hay 1 producto en el carrito
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);
  });

});
