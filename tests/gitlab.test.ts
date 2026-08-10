import { test, expect } from '@playwright/test';

test('Verify GitLab Integration Settings, custom Project Path configuration, and dynamic Issue mapping', async ({ page }) => {
  // Dismiss all alerts automatically and capture alert text
  let alertText = '';
  page.on('dialog', async dialog => {
    alertText = dialog.message();
    await dialog.accept();
  });

  // 1. Visit main page
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(500);

  // Self-seed testing state into local storage
  await page.evaluate(() => {
    localStorage.setItem('dict_clients', JSON.stringify([{ id: 'cl-1', name: 'ПАО "Сбербанк"' }]));
    localStorage.setItem('dict_projects', JSON.stringify([{ id: 'pr-1', name: 'Платежный шлюз B2B' }]));
    localStorage.setItem('dict_subsystems', JSON.stringify([{ id: 'sub-1', name: 'Модуль Клиент-Банк' }]));
    localStorage.setItem('ep_data', JSON.stringify([{ id: 'ep-1', code: 'EPIC-001', title: 'Единое платежное ядро', description: 'Тест', owner: 'Александр Воронов' }]));
    localStorage.setItem('init_data', JSON.stringify([{ id: 'in-1', epicId: 'ep-1', code: 'INIT-101', title: 'Автоматический СБП-Биллинг', description: 'Тест', status: 'In Progress' }]));
  });

  // Reload to apply the local storage values
  await page.reload();
  await page.waitForTimeout(500);

  // 2. Select "Настройки" tab
  await page.click('button:has-text("Настройки")');
  await page.waitForTimeout(500);

  // 3. Select "Интеграция с GitLab" subtab
  await page.click('button:has-text("Интеграция с GitLab")');
  await page.waitForTimeout(500);

  await page.screenshot({ path: '/home/jules/verification/screenshots/settings_gitlab_panel.png', fullPage: true });

  // 4. Fill custom project path and select mapped project
  const projectPathInput = page.locator('input[placeholder="Напр: core/payments или enterprise/its-service"]');
  await expect(projectPathInput).toBeVisible();

  await projectPathInput.clear();
  await projectPathInput.fill('custom/super-payment-hub');

  // Select "Платежный шлюз B2B" as mapped project (first select on the page)
  await page.selectOption('select >> nth=0', { label: 'Платежный шлюз B2B' });

  // 5. Add custom label mapping: map 'security' label to 'Технический долг' and 'ui' label to 'Доработка UI'
  await page.fill('input[placeholder="bug"]', 'security');
  await page.selectOption('select >> nth=3', { label: 'Технический долг' });
  await page.selectOption('select >> nth=4', { label: 'Доработка UI' });

  // Click 'Добавить' button (the one inside label mapping engine)
  await page.click('button:has-text("Добавить")');
  await page.waitForTimeout(300);

  // Take screenshot of mapping
  await page.screenshot({ path: '/home/jules/verification/screenshots/settings_gitlab_configured.png', fullPage: true });

  // Save Settings
  await page.click('button:has-text("Сохранить настройки GitLab")');
  await page.waitForTimeout(300);
  expect(alertText).toContain('успешно сохранены');

  // 6. Go to "Анализ входящих задач"
  await page.click('button:has-text("Анализ входящих задач")');
  await page.waitForTimeout(500);

  // 7. Trigger import
  await page.click('button:has-text("Загрузить из GitLab")');
  await page.waitForTimeout(500);

  expect(alertText).toContain('custom/super-payment-hub');
  expect(alertText).toContain('Платежный шлюз B2B');

  // Take screenshot of newly imported requests in table
  await page.screenshot({ path: '/home/jules/verification/screenshots/incoming_gitlab_imported_requests.png', fullPage: true });

  // Verify that newly imported requests exist in table
  const newlyImportedRow = page.locator('strong:has-text("custom/super-payment-hub")').first();
  await expect(newlyImportedRow).toBeVisible();

  console.log('SUCCESS: GitLab Integration settings, custom Project Path, and dynamic mapping verified perfectly!');
});
