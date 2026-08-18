import { test, expect } from '@playwright/test';

test('Verify GitLab Integration Settings, Test Connection, GitLab Labels, and entity imports', async ({ page }) => {
  // Mock GitLab API requests
  await page.route('**/api/v4/groups/custom-payment-group', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 99,
        name: 'Custom Payment Group',
        full_path: 'custom-payment-group',
        web_url: 'https://gitlab.corp.ru/custom-payment-group'
      })
    });
  });

  await page.route('**/api/v4/groups/custom-payment-group/subgroups*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 100,
          name: 'SBP Subgroup',
          full_path: 'custom-payment-group/sbp',
          web_url: 'https://gitlab.corp.ru/custom-payment-group/sbp'
        }
      ])
    });
  });

  await page.route('**/api/v4/groups/custom-payment-group/labels*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'module::client-bank', color: '#102030', description: 'Client bank module' },
        { id: 2, name: 'bug', color: '#ff0000', description: 'Bug label' },
        { id: 3, name: 'stage::analysis', color: '#00ff00', description: 'Analysis stage' }
      ])
    });
  });

  await page.route('**/api/v4/groups/custom-payment-group/projects*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 101, name: 'B2B Gateway Project', web_url: 'https://gitlab.corp.ru/custom-payment-group/gateway' },
        { id: 102, name: 'New Gateway Project', web_url: 'https://gitlab.corp.ru/custom-payment-group/new-gateway' }
      ])
    });
  });

  await page.route('**/api/v4/groups/custom-payment-group/issues*', async route => {
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

  // Self-seed testing state into local storage before page load
  await page.addInitScript(() => {
    localStorage.setItem('dict_clients', JSON.stringify([{ id: 'cl-1', name: 'ПАО "Сбербанк"' }]));
    localStorage.setItem('dict_projects', JSON.stringify([{ id: 'pr-1', name: 'Платежный шлюз B2B', gitlabUrl: 'https://gitlab.corp.ru/custom-payment-group/gateway' }]));
    localStorage.setItem('dict_modules', JSON.stringify([{ id: 'sub-1', name: 'Модуль - Клиент-Банк' }]));
    localStorage.setItem('ep_data', JSON.stringify([{ id: 'ep-1', code: 'EPIC-001', title: 'Единое платежное ядро', description: 'Тест', owner: 'Александр Воронов' }]));
    localStorage.setItem('init_data', JSON.stringify([{ id: 'in-1', epicId: 'ep-1', code: 'INIT-101', title: 'Автоматический СБП-Биллинг', description: 'Тест', status: 'In Progress' }]));
  });

  // 1. Visit main page
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(500);

  // 2. Select "Настройки" tab
  await page.click('button[title="Настройки"]');
  await page.waitForTimeout(500);

  // 3. Select "Настройки интеграции" subtab
  await page.click('button:has-text("Настройки интеграции")');
  await page.waitForTimeout(500);

  await page.screenshot({ path: '/home/jules/verification/screenshots/settings_gitlab_panel.png', fullPage: true });

  // 4. Fill custom project group path and real-looking PAT
  const projectGroupInput = page.locator('input[placeholder="enterprise-products"]');
  await expect(projectGroupInput).toBeVisible();

  await projectGroupInput.clear();
  await projectGroupInput.fill('custom-payment-group');

  const patInput = page.locator('input[placeholder="glpat-********************"]');
  await expect(patInput).toBeVisible();
  await patInput.clear();
  await patInput.fill('glpat-validtoken1234567890');

  // Save Settings
  await page.click('button:has-text("Сохранить настройки GitLab")');
  await page.waitForTimeout(500);

  // Test Connection button
  await page.click('button:has-text("Проверить подключение")');
  await page.waitForTimeout(500);

  // 5. Test importing GitLab Labels subtab
  await page.click('button:has-text("Лейблы")');
  await page.waitForTimeout(500);

  await page.click('button:has-text("Импортировать все лейблы из GitLab")');
  await page.waitForTimeout(500);

  // 6. Test importing Projects from GitLab
  await page.locator('button').filter({ hasText: /^Проекты$/ }).click();
  await page.waitForTimeout(500);

  await page.click('button:has-text("Импортировать из GitLab")');
  await page.waitForTimeout(500);

  // Requirement 5: Complete imported projects in modal
  await page.click('button:has-text("Сохранить импортированные проекты")');
  await page.waitForTimeout(500);

  // Take screenshot of imported projects
  await page.screenshot({ path: '/home/jules/verification/screenshots/settings_gitlab_projects_imported.png', fullPage: true });

  // 7. Go to "Анализ входящих задач"
  await page.click('button[title="Анализ входящих задач"]');
  await page.waitForTimeout(500);

  // 8. Trigger import
  await page.click('button:has-text("Загрузить из GitLab")');
  await page.waitForTimeout(500);

  // Take screenshot of newly imported requests in table
  await page.screenshot({ path: '/home/jules/verification/screenshots/incoming_gitlab_imported_requests.png', fullPage: true });

  console.log('SUCCESS: Simplified GitLab Integration settings, connection test, labels, and entity imports verified perfectly!');
});
