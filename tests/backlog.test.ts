import { test, expect } from '@playwright/test';

test('Verify Backlog Dashboard View, Grouping, and 3-Stage Release Planner Funnel', async ({ page }) => {
  // 1. Visit main page
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Landing tab is "Анализ входящих задач" (Incoming Task Analysis) by default
  await page.screenshot({ path: '/home/jules/verification/screenshots/incoming_task_analysis_landing.png', fullPage: true });

  // 2. Select first tab "Бэклог и Приоритизация" to verify
  await page.click('button:has-text("Бэклог и Приоритизация")');
  await page.waitForTimeout(500);

  // Take screenshot of default dashboard-only backlog
  await page.screenshot({ path: '/home/jules/verification/screenshots/backlog_dashboard_default.png', fullPage: true });

  // Verify that "Входящие сигналы (Inbox)" is visible (Dashboard view is now the only view)
  const inboxHeader = page.locator('h3:has-text("Входящие сигналы (Inbox)")');
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
  await page.click('button:has-text("Конструктор Релиза")');
  await page.waitForTimeout(500);

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
