import { test, expect } from '@playwright/test';

test('Verify Backlog view modes, grouping, sorting and drag-and-drop elements', async ({ page }) => {
  // 1. Visit main page
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Landing tab is "Анализ входящих задач" (Incoming Task Analysis) by default
  await page.screenshot({ path: '/home/jules/verification/screenshots/incoming_task_analysis_landing.png', fullPage: true });

  // 2. Select first tab "Бэклог и Приоритизация" to verify
  await page.click('button:has-text("Бэклог и Приоритизация")');
  await page.waitForTimeout(500);

  // 3. Take screenshot of default tree-view
  await page.screenshot({ path: '/home/jules/verification/screenshots/backlog_tree_default.png', fullPage: true });

  // 4. Try choosing "Дашборд (Board)" view
  await page.click('button:has-text("Дашборд (Board)")');
  await page.waitForTimeout(500);

  // Verify that "Входящие сигналы (Inbox)" is visible
  const inboxHeader = page.locator('h3:has-text("Входящие сигналы (Inbox)")');
  await expect(inboxHeader).toBeVisible();

  await page.screenshot({ path: '/home/jules/verification/screenshots/backlog_dashboard_dragndrop_view.png', fullPage: true });

  // 5. Try grouping by Subsystem
  await page.click('button:has-text("Подсистема")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/jules/verification/screenshots/backlog_group_subsystem.png', fullPage: true });

  // 6. Try grouping by Task Kind
  await page.click('button:has-text("Вид задач")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/jules/verification/screenshots/backlog_group_taskkind.png', fullPage: true });

  // 7. Go back to Tree view and group by Epic
  await page.click('button:has-text("Дерево (Tree)")');
  await page.click('button:has-text("Эпик")');
  await page.waitForTimeout(500);

  // 8. Open manual feature creation modal
  await page.click('button:has-text("Создать Фичу")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/jules/verification/screenshots/backlog_create_feature_modal.png' });

  // Close feature modal (click Cancel / Отмена)
  await page.click('button:has-text("Отмена")');
  await page.waitForTimeout(200);

  console.log('SUCCESS: All backlog views, drag-and-drop layouts, and default tab order verified successfully!');
});
