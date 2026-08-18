import { test, expect } from '@playwright/test';

test('Verify Backlog Dashboard View, Grouping, and 3-Stage Release Planner Funnel', async ({ page }) => {
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('response', resp => {
    if (resp.status() >= 400) {
      console.log('BAD RESPONSE:', resp.status(), resp.url());
    }
  });

  // Dismiss all alerts automatically
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  // Self-seed testing state into local storage before navigation
  await page.addInitScript(() => {
    localStorage.setItem('dict_clients', JSON.stringify([{ id: 'cl-1', name: 'ПАО "Сбербанк"' }]));
    localStorage.setItem('dict_projects', JSON.stringify([{ id: 'pr-1', name: 'Платежный шлюз B2B' }]));
    localStorage.setItem('dict_modules', JSON.stringify([{ id: 'sub-1', name: 'Модуль Клиент-Банк' }]));
    localStorage.setItem('ep_data', JSON.stringify([{ id: 'ep-1', code: 'EPIC-001', title: 'Единое платежное ядро', description: 'Тест', owner: 'Александр Воронов' }]));
    localStorage.setItem('init_data', JSON.stringify([{ id: 'in-1', epicId: 'ep-1', code: 'INIT-101', title: 'Автоматический СБП-Биллинг', description: 'Тест', status: 'In Progress' }]));
    localStorage.setItem('feat_data', JSON.stringify([{
      id: 'fe-1',
      initiativeId: 'in-1',
      code: 'FEAT-111',
      title: 'QR-платежи через СБП в счете-фактуре',
      description: 'Генерация динамического QR-кода на основе платежных реквизитов.',
      effortHours: 40,
      repeatabilityCount: 14,
      salesImpact: 4,
      itsPriority: 3,
      autoScore: 112,
      releaseId: null,
      status: 'Backlog',
      adoptionRate: 0,
      mau: 0,
      retentionRate: 0,
      segmentAdoption: { enterprise: 0, sme: 0, retail: 0 },
      revenueGenerated: 0,
      developmentCost: 80000,
      subsystem: 'Модуль Клиент-Банк',
      taskKind: 'Фича (Feature)'
    }]));
  });

  // 1. Visit main page
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(500);

  // Landing tab is "Анализ входящих задач" (Incoming Task Analysis) by default
  await page.screenshot({ path: '/home/jules/verification/screenshots/incoming_task_analysis_landing.png', fullPage: true });

  // 2. Select tab "Бэклог и Приоритизация"
  console.log('Clicking Backlog tab...');
  await page.locator('aside button').filter({ hasText: 'Бэклог и Приоритизация' }).click();
  await page.waitForTimeout(1000);
  console.log('Current URL / state after click. Checking for button...');
  const btnVisible = await page.isVisible('button:has-text("Создать Фичу")');
  console.log('Is "Создать Фичу" visible?', btnVisible);
  if (!btnVisible) {
    const html = await page.content();
    console.log('Page HTML snippet:', html.slice(0, 1000));
  }
  await page.waitForSelector('button:has-text("Создать Фичу")');

  // Take screenshot of default dashboard-only backlog
  await page.screenshot({ path: '/home/jules/verification/screenshots/backlog_dashboard_default.png', fullPage: true });

  // Verify that Inbox is visible
  const inboxHeader = page.locator('text=Входящие сигналы').first();
  await expect(inboxHeader).toBeVisible();

  // Try grouping by Subsystem
  await page.click('button:has-text("Подсистема")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/jules/verification/screenshots/backlog_group_subsystem.png', fullPage: true });

  // Try grouping by Task Kind
  await page.click('button:has-text("Вид задач")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/jules/verification/screenshots/backlog_group_taskkind.png', fullPage: true });

  // Open manual feature creation modal
  await page.click('button:has-text("Создать Фичу")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/jules/verification/screenshots/backlog_create_feature_modal.png' });

  // Close feature modal (click Cancel / Отмена)
  await page.click('button:has-text("Отмена")');
  await page.waitForTimeout(200);

  // 3. Move to Constructor Reliza panel to test 3-Stage Funnel
  await page.locator('aside button').filter({ hasText: 'Релиза' }).click();
  await page.waitForSelector('button:has-text("Заполнить трудоемкость")');

  // Verify the three columns / headers are present
  const col1 = page.locator('span:has-text("Доступно в Бэклоге")');
  const col2 = page.locator('span:has-text("На оценку трудоемкости")');
  const col3 = page.locator('span:has-text("План релиза (Черновик)")');

  await expect(col1).toBeVisible();
  await expect(col2).toBeVisible();
  await expect(col3).toBeVisible();

  // Verify "Заполнить трудоемкость" bulk estimation button is present
  const bulkBtn = page.locator('button:has-text("Заполнить трудоемкость")');
  await expect(bulkBtn).toBeVisible();

  await page.screenshot({ path: '/home/jules/verification/screenshots/release_planner_3stage_funnel.png', fullPage: true });

  console.log('SUCCESS: Backlog Dashboard view and 3-stage Release Planner verified successfully!');
});
