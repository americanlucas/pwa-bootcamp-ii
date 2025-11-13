import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:8080';

test.describe('PWA PRODUCTIVITY HELPER', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('DEVE CARREGAR A PAGINA PRINCIPAL', async ({ page }) => {
    await expect(page).toHaveTitle(/Productivity Helper/);
    await expect(page.locator('h1')).toContainText('PRODUCTIVITY HELPER');
  });

  test('DEVE EXIBIR TODAS AS ABAS', async ({ page }) => {
    await expect(page.locator('.tab[data-tab="links"]')).toBeVisible();
    await expect(page.locator('.tab[data-tab="notes"]')).toBeVisible();
    await expect(page.locator('.tab[data-tab="tasks"]')).toBeVisible();
    await expect(page.locator('.tab[data-tab="stats"]')).toBeVisible();
  });

  test('DEVE ADICIONAR NOVO LINK', async ({ page }) => {
    await page.click('.tab[data-tab="links"]');

    await page.fill('[data-testid="link-title"]', 'GitHub');
    await page.fill('[data-testid="link-url"]', 'https://github.com');
    await page.click('[data-testid="add-link"]');

    await page.waitForTimeout(1000);

    await expect(page.locator('.item-title')).toContainText('GitHub');
  });

  test('DEVE VALIDAR CAMPOS OBRIGATORIOS DO LINK', async ({ page }) => {
    await page.click('.tab[data-tab="links"]');
    await page.click('[data-testid="add-link"]');

    await expect(page.locator('.toast')).toContainText('PREENCHA TODOS OS CAMPOS');
  });

  test('DEVE ADICIONAR NOVA NOTA', async ({ page }) => {
    await page.click('.tab[data-tab="notes"]');

    await page.fill('[data-testid="note-title"]', 'Reuniao');
    await page.fill('[data-testid="note-content"]', 'Anotacoes importantes da reuniao');
    await page.click('[data-testid="add-note"]');

    await page.waitForTimeout(1000);

    await expect(page.locator('.item-title')).toContainText('Reuniao');
  });

  test('DEVE ADICIONAR NOVA TAREFA', async ({ page }) => {
    await page.click('.tab[data-tab="tasks"]');

    await page.fill('[data-testid="task-description"]', 'Completar projeto PWA');
    await page.click('[data-testid="add-task"]');

    await page.waitForTimeout(1000);

    await expect(page.locator('.item-content')).toContainText('Completar projeto PWA');
  });

  test('DEVE MARCAR TAREFA COMO CONCLUIDA', async ({ page }) => {
    await page.click('.tab[data-tab="tasks"]');

    await page.fill('[data-testid="task-description"]', 'Tarefa de teste');
    await page.click('[data-testid="add-task"]');

    await page.waitForTimeout(1000);

    await page.check('.task-checkbox');
    await page.waitForTimeout(500);

    await expect(page.locator('.task-item')).toHaveClass(/completed/);
  });

  test('DEVE DELETAR LINK', async ({ page }) => {
    await page.click('.tab[data-tab="links"]');

    await page.fill('[data-testid="link-title"]', 'Link Temp');
    await page.fill('[data-testid="link-url"]', 'https://temp.com');
    await page.click('[data-testid="add-link"]');

    await page.waitForTimeout(1000);

    page.on('dialog', dialog => dialog.accept());
    await page.click('.item-actions .delete');

    await page.waitForTimeout(1000);

    await expect(page.locator('.item-title')).not.toContainText('Link Temp');
  });

  test('DEVE EXIBIR ESTATISTICAS', async ({ page }) => {
    await page.click('.tab[data-tab="stats"]');

    await expect(page.locator('#statLinks')).toBeVisible();
    await expect(page.locator('#statNotes')).toBeVisible();
    await expect(page.locator('#statTasks')).toBeVisible();
    await expect(page.locator('#statCompleted')).toBeVisible();
  });

  test('DEVE MUDAR ENTRE ABAS', async ({ page }) => {
    await page.click('.tab[data-tab="notes"]');
    await expect(page.locator('#notes')).toHaveClass(/active/);

    await page.click('.tab[data-tab="tasks"]');
    await expect(page.locator('#tasks')).toHaveClass(/active/);

    await page.click('.tab[data-tab="links"]');
    await expect(page.locator('#links')).toHaveClass(/active/);
  });

  test('DEVE EXIBIR INDICADOR DE STATUS ONLINE', async ({ page }) => {
    await expect(page.locator('#onlineStatus')).toContainText('ONLINE');
  });

  test('DEVE TER MANIFEST E SERVICE WORKER', async ({ page }) => {
    const manifestResponse = await page.goto(`${BASE_URL}/manifest.webmanifest`);
    expect(manifestResponse?.status()).toBe(200);

    const swResponse = await page.goto(`${BASE_URL}/sw.js`);
    expect(swResponse?.status()).toBe(200);
  });

  test('DEVE FUNCIONAR OFFLINE (CACHE)', async ({ page, context }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    await context.setOffline(true);
    await page.reload();

    await expect(page.locator('h1')).toContainText('PRODUCTIVITY HELPER');
  });
});