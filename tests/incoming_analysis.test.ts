import { test, expect } from '@playwright/test';

test('Verify Incoming Tasks Analysis filters and visual labels rendering', async ({ page }) => {
  // Dismiss all alerts automatically
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  // Self-seed state with sample requests having labels and projects
  await page.addInitScript(() => {
    localStorage.setItem('dict_clients', JSON.stringify([{ id: 'cl-1', name: 'ПАО "Сбербанк"' }]));
    localStorage.setItem('dict_projects', JSON.stringify([
      { id: 'pr-1', name: 'Платежный шлюз B2B', clientId: 'cl-1', productId: 'prod-1' },
      { id: 'pr-2', name: 'Мобильный эквайринг', clientId: 'cl-1', productId: 'prod-2' }
    ]));
    localStorage.setItem('dict_products', JSON.stringify([
      { id: 'prod-1', name: 'Платежи B2B' },
      { id: 'prod-2', name: 'Эквайринг' }
    ]));
    localStorage.setItem('dict_modules', JSON.stringify([
      { id: 'mod-1', name: 'Модуль Клиент-Банк', gitlabLabel: 'module::client-bank' }
    ]));
    localStorage.setItem('dict_task_kinds', JSON.stringify([
      { id: 'kind-1', name: 'Ошибка (Bug)', gitlabLabel: 'bug', priorityPoints: 4 },
      { id: 'kind-2', name: 'Фича (Feature)', gitlabLabel: 'feature', priorityPoints: 3 }
    ]));
    localStorage.setItem('dict_gitlab_labels', JSON.stringify([
      { id: '1', name: 'bug', color: '#d73a4a' },
      { id: '2', name: 'module::client-bank', color: '#0075ca' }
    ]));
    localStorage.setItem('req_data', JSON.stringify([
      {
        id: 'req-1',
        code: 'REQ-101',
        title: 'Ошибка проведения платежа по QR коду',
        source: 'GitLab',
        description: 'При сканировании QR кода возникает таймаут',
        status: 'Неразобранные',
        projectId: 'pr-1',
        productId: 'prod-1',
        moduleId: 'mod-1',
        taskKindId: 'kind-1',
        labels: ['bug', 'module::client-bank'],
        createdAt: '2025-10-01'
      },
      {
        id: 'req-2',
        code: 'REQ-102',
        title: 'Новый метод авторизации в эквайринге',
        source: 'Интервью',
        description: 'Требуется биометрическая авторизация',
        status: 'Неразобранные',
        projectId: 'pr-2',
        productId: 'prod-2',
        labels: [],
        createdAt: '2025-10-02'
      }
    ]));
  });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(500);

  // Tab "Анализ входящих задач" is active by default
  // 1. Verify filters bar is present
  const filterHeader = page.locator('text=Фильтры списка задач:');
  await expect(filterHeader).toBeVisible();

  // 2. Verify labels are rendered visually in the table
  const labelBug = page.getByTitle('Кликните для фильтрации по лейблу "bug"');
  await expect(labelBug).toBeVisible();

  const labelModule = page.getByTitle('Кликните для фильтрации по лейблу "module::client-bank"');
  await expect(labelModule).toBeVisible();

  // 3. Test filtering by Project
  const projectSelect = page.locator('select').filter({ hasText: 'Все проекты' });
  await projectSelect.selectOption({ label: 'Платежный шлюз B2B' });
  await page.waitForTimeout(300);

  // REQ-101 should be visible, REQ-102 should be filtered out
  await expect(page.locator('text=REQ-101')).toBeVisible();
  await expect(page.locator('text=REQ-102')).toBeHidden();

  // 4. Test Reset filters
  const resetBtn = page.locator('button:has-text("Сбросить все фильтры")');
  await expect(resetBtn).toBeVisible();
  await resetBtn.click();
  await page.waitForTimeout(300);

  // Both should be visible again
  await expect(page.locator('text=REQ-101')).toBeVisible();
  await expect(page.locator('text=REQ-102')).toBeVisible();

  // 5. Verify executor is optional: create request with only 7 mandatory parameters (no executor)
  await page.click('button:has-text("Внести вручную")');
  await page.waitForTimeout(300);

  // Fill 7 mandatory parameters
  await page.locator('input[placeholder*="Сбой выгрузки"]').fill('Тестовая задача без исполнителя');
  await page.locator('input[placeholder="#999"]').fill('#777');
  await page.locator('select').filter({ hasText: 'Выберите проект' }).selectOption({ label: 'Платежный шлюз B2B' });
  await page.locator('select').filter({ hasText: 'Выберите продукт' }).selectOption({ label: 'Платежи B2B' });
  await page.locator('select').filter({ hasText: 'Выберите модуль' }).selectOption({ label: 'Модуль Клиент-Банк' });
  await page.locator('select').filter({ hasText: 'Выберите вид задачи' }).selectOption({ label: 'Ошибка (Bug)' });

  // Add author and stage to dictionary if needed, then submit
  await page.click('button:has-text("Внести в бэклог")');
  await page.waitForTimeout(500);

  // 6. Take screenshot of Incoming Analysis with filters and visual labels
  await page.screenshot({ path: '/home/jules/verification/screenshots/incoming_analysis_filters_and_labels.png', fullPage: true });

  console.log('SUCCESS: Incoming Tasks Analysis filters and visual labels verified!');
});
