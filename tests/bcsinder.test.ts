import { test, expect } from '@playwright/test';

test('Verify BCSinder Tinder-like card processing, editing, and status assignments', async ({ page }) => {
  // Dismiss all alerts automatically
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  // Self-seed state with sample requests having mandatory parameters
  await page.addInitScript(() => {
    localStorage.setItem('dict_clients', JSON.stringify([{ id: 'cl-1', name: 'ПАО "Сбербанк"' }]));
    localStorage.setItem('dict_projects', JSON.stringify([
      { id: 'pr-1', name: 'Платежный шлюз B2B', clientId: 'cl-1', productId: 'prod-1' }
    ]));
    localStorage.setItem('dict_products', JSON.stringify([
      { id: 'prod-1', name: 'Платежи B2B' }
    ]));
    localStorage.setItem('dict_modules', JSON.stringify([
      { id: 'mod-1', name: 'Модуль Клиент-Банк', gitlabLabel: 'module::client-bank' }
    ]));
    localStorage.setItem('dict_task_kinds', JSON.stringify([
      { id: 'kind-1', name: 'Ошибка (Bug)', gitlabLabel: 'bug', priorityPoints: 4 },
      { id: 'kind-2', name: 'Фича (Feature)', gitlabLabel: 'feature', priorityPoints: 3 }
    ]));
    localStorage.setItem('dict_project_stages', JSON.stringify([
      { id: 'stg-1', name: 'Аналитика', gitlabLabel: 'stage::analysis' }
    ]));
    localStorage.setItem('dict_users', JSON.stringify([
      { id: 'usr-1', fullName: 'Иван Иванов', isEnabled: true, email: 'ivan@corp.ru', role: 'Администратор' }
    ]));
    localStorage.setItem('req_data', JSON.stringify([
      {
        id: 'req-tinder-1',
        code: 'REQ-TND-01',
        title: 'Интеграция с СБП B2B для юридических лиц',
        source: 'GitLab',
        description: 'Реализация API шлюза для мгновенных платежей юрлиц',
        status: 'Неразобранные',
        gitlabIssueId: '#101',
        projectId: 'pr-1',
        productId: 'prod-1',
        moduleId: 'mod-1',
        taskKindId: 'kind-2',
        projectStageId: 'stg-1',
        authorId: 'usr-1',
        labels: ['feature', 'module::client-bank'],
        createdAt: '2025-10-01'
      },
      {
        id: 'req-tinder-2',
        code: 'REQ-TND-02',
        title: 'Сбой авторизации в мобильном банке',
        source: 'GitLab',
        description: 'Пользователи получают 504 при входе',
        status: 'Неразобранные',
        gitlabIssueId: '#102',
        projectId: 'pr-1',
        productId: 'prod-1',
        moduleId: 'mod-1',
        taskKindId: 'kind-1',
        projectStageId: 'stg-1',
        authorId: 'usr-1',
        labels: ['bug'],
        createdAt: '2025-10-02'
      }
    ]));
  });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(500);

  // 1. Click on BCSinder in sidebar
  const bcsinderNavBtn = page.locator('aside button').filter({ hasText: 'BCSinder' });
  await expect(bcsinderNavBtn).toBeVisible();
  await bcsinderNavBtn.click();
  await page.waitForTimeout(500);

  // 2. Verify BCSinder header and card deck
  const bcsinderTitle = page.locator('h2:has-text("BCSinder")');
  await expect(bcsinderTitle).toBeVisible();

  // Verify first card details are displayed
  await expect(page.locator('text=REQ-TND-01')).toBeVisible();
  await expect(page.locator('text=Интеграция с СБП B2B для юридических лиц')).toBeVisible();

  // 3. Test Editing Card
  await page.click('button:has-text("Изменить")');
  await page.waitForTimeout(300);

  // Edit title in modal
  const editTitleInput = page.locator('input[value="Интеграция с СБП B2B для юридических лиц"]');
  await editTitleInput.fill('Интеграция с СБП B2B для юридических лиц (ОБНОВЛЕНО)');

  // Save changes
  await page.click('button:has-text("Сохранить изменения")');
  await page.waitForTimeout(300);

  // Verify updated title is rendered on card
  await expect(page.locator('text=Интеграция с СБП B2B для юридических лиц (ОБНОВЛЕНО)')).toBeVisible();

  // 4. Test Tinder swipe right / Принять
  const approveBtn = page.locator('button[title*="Принять"]');
  await expect(approveBtn).toBeVisible();
  await approveBtn.click();
  await page.waitForTimeout(500);

  // After approving first card, second card REQ-TND-02 should now be active
  await expect(page.locator('text=REQ-TND-02')).toBeVisible();
  await expect(page.locator('text=Сбой авторизации в мобильном банке')).toBeVisible();

  // 5. Test Tinder swipe left / Отклонить on second card
  const rejectBtn = page.locator('button[title*="Отклонить"]');
  await expect(rejectBtn).toBeVisible();
  await rejectBtn.click();
  await page.waitForTimeout(500);

  // 6. All cards processed - empty celebration state should be shown
  await expect(page.locator('text=Все задачи в очереди обработаны!')).toBeVisible();

  // Take screenshot
  await page.screenshot({ path: '/home/jules/verification/screenshots/bcsinder_completed.png', fullPage: true });

  console.log('SUCCESS: BCSinder verified successfully!');
});
