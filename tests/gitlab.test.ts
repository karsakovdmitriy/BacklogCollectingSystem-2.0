import { test, expect } from '@playwright/test';

test('Verify GitLab Integration Settings, simplified Project Group configuration, and entity imports', async ({ page }) => {
  // Mock GitLab API requests
  await page.route('**/api/v4/groups/custom-payment-group/projects', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 101, name: 'B2B Gateway Project', web_url: 'https://gitlab.corp.ru/custom-payment-group/gateway' }
      ])
    });
  });

  await page.route('**/api/v4/groups/custom-payment-group/issues', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 1201,
          iid: 1201,
          title: '[GitLab / custom-payment-group] Issue: Real Time Processing',
          description: 'A real mapped issue',
          labels: ['bug'],
          web_url: 'https://gitlab.corp.ru/custom-payment-group/gateway/issues/1201'
        }
      ])
    });
  });

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
    localStorage.setItem('dict_projects', JSON.stringify([{ id: 'pr-1', name: 'Платежный шлюз B2B', gitlabUrl: 'https://gitlab.corp.ru/custom-payment-group/gateway' }]));
    localStorage.setItem('dict_subsystems', JSON.stringify([{ id: 'sub-1', name: 'Модуль - Клиент-Банк' }]));
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

  // 4. Fill custom project group path
  const projectGroupInput = page.locator('input[placeholder="enterprise-products"]');
  await expect(projectGroupInput).toBeVisible();

  await projectGroupInput.clear();
  await projectGroupInput.fill('custom-payment-group');

  // Fill real-looking PAT so validation passes
  const patInput = page.locator('input[placeholder="glpat-********************"]');
  await expect(patInput).toBeVisible();
  await patInput.clear();
  await patInput.fill('glpat-validtoken1234567890');

  // Save Settings
  await page.click('button:has-text("Сохранить настройки GitLab")');
  await page.waitForTimeout(300);
  expect(alertText).toContain('успешно сохранены');

  // 5. Test importing Projects from GitLab
  await page.click('button:has-text("3. Проекты")');
  await page.waitForTimeout(500);

  await page.click('button:has-text("Импортировать из GitLab")');
  await page.waitForTimeout(500);
  expect(alertText).toContain('Импорт из GitLab успешно завершен');

  // Take screenshot of imported projects
  await page.screenshot({ path: '/home/jules/verification/screenshots/settings_gitlab_projects_imported.png', fullPage: true });

  // 6. Go to "Анализ входящих задач"
  await page.click('button:has-text("Анализ входящих задач")');
  await page.waitForTimeout(500);

  // 7. Trigger import
  await page.click('button:has-text("Загрузить из GitLab")');
  await page.waitForTimeout(500);

  expect(alertText).toContain('custom-payment-group');

  // Take screenshot of newly imported requests in table
  await page.screenshot({ path: '/home/jules/verification/screenshots/incoming_gitlab_imported_requests.png', fullPage: true });

  console.log('SUCCESS: Simplified GitLab Integration settings and entity imports verified perfectly!');
});
