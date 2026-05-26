const { test, expect } = require('@playwright/test');
const testData = require('../../data/test-data.json');

test.describe('Select Product Tests', () => {

  test('Seleccionar Sauce Labs Backpack, verificar precio, agregar al carrito y validar contador', async ({ page }) => {
    // 1. Hacer login con standard_user
    await page.goto('/');
    await page.fill('#user-name', testData.usuarios.standard.username);
    await page.fill('#password', testData.usuarios.standard.password);
    await page.click('#login-button');

    // Verificar que redirige a inventory
    await expect(page).toHaveURL(/.*inventory\.html/);

    // 2. Seleccionar "Sauce Labs Backpack"
    await page.click('text=Sauce Labs Backpack');

    // 3. Obtener el precio del producto (debe ser "$29.99")
    const priceElement = page.locator('[data-test="inventory-item-price"]');
    await expect(priceElement).toBeVisible();
    const priceText = await priceElement.textContent();
    expect(priceText.trim()).toBe('$29.99');

    // 4. Agregar el producto al carrito
    await page.click('text=Add to cart');

    // 5. Verificar que el contador del carrito muestra "1"
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');
  });

});
