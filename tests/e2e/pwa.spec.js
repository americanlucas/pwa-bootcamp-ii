import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:8080';

test.describe('PWA PRODUCTIVITY HELPER', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);  // Espera extra
  });

  test('DEVE CARREGAR A PAGINA PRINCIPAL', async ({ page }) => {
    await expect(page).toHaveTitle(/Productivity Helper/i);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('DEVE EXIBIR TODAS AS ABAS', async ({ page }) => {
    await expect(page.locator('.tab[data-tab="links"]')).toBeVisible();
    await expect(page.locator('.tab[data-tab="notes"]')).toBeVisible();
    await expect(page.locator('.tab[data-tab="tasks"]')).toBeVisible();
  });

  test('DEVE ADICIONAR NOVO LINK', async ({ page }) => {
    await page.click('.tab[data-tab="links"]');
    await page.waitForTimeout(1000);

    await page.fill('[data-testid="link-title"]', 'GitHub');
    await page.fill('[data-testid="link-url"]', 'https://github.com');
    await page.click('[data-testid="add-link"]');

    await page.waitForTimeout(2000);

    const itemTitle = page.locator('.item-title').first();
    await expect(itemTitle).toContainText('GitHub', { timeout: 10000 });
  });

  // Simplificar outros testes...
});