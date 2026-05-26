const { test, expect } = require('@playwright/test');
const testData = require('../../data/test-data.json');

test.describe('Login Tests', () => {

  test('Login exitoso con standard_user redirige a inventory y muestra productos', async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/');

    // Completar formulario de login con datos de test-data.json
    await page.fill('#user-name', testData.usuarios.standard.username);
    await page.fill('#password', testData.usuarios.standard.password);
    await page.click('#ingresar-button');

    // Verificar que redirige a /inventory.html
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Verificar que se muestra la lista de productos
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('Login fallido con locked_out_user del .env muestra mensaje de error', async ({ page }) => {
    // Obtener credenciales del archivo .env
    const lockedUsername = process.env.LOCKED_USER_USERNAME;
    const lockedPassword = process.env.LOCKED_USER_PASSWORD;

    // Navegar a la página de login
    await page.goto('/');

    // Completar formulario de login con datos del .env
    await page.fill('#user-name', lockedUsername);
    await page.fill('#password', lockedPassword);
    await page.waitForTimeout(3000); // Esperar 3 segundos antes de hacer clic en login
    await page.click('#login-button');

    // Verificar que se muestra el mensaje de error de usuario bloqueado
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
  });

});
