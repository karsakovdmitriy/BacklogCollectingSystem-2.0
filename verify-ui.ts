import { chromium } from '@playwright/test';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: '/home/jules/verification/videos',
      size: { width: 1280, height: 720 },
    },
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  // Dismiss alert/confirm dialogs automatically
  page.on('dialog', async dialog => {
    console.log('DIALOG OPENED:', dialog.message());
    await page.waitForTimeout(500);
    await dialog.accept();
  });

  try {
    console.log('1. Navigating to system...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);

    // Seed state to have a client, project, subsystem, and a feature
    console.log('Seeding demo state...');
    await page.evaluate(() => {
      localStorage.setItem('dict_clients', JSON.stringify([{ id: 'cl-1', name: 'ПАО "Сбербанк"' }]));
      localStorage.setItem('dict_projects', JSON.stringify([{ id: 'pr-1', name: 'Платежный шлюз B2B', clientId: 'cl-1', moduleId: 'mod-1', productId: 'prod-1' }]));
      localStorage.setItem('dict_modules', JSON.stringify([{ id: 'mod-1', name: 'Модуль Клиент-Банк' }]));
      localStorage.setItem('dict_subsystems', JSON.stringify([{ id: 'mod-1', name: 'Модуль Клиент-Банк' }]));
      localStorage.setItem('ep_data', JSON.stringify([{ id: 'ep-1', code: 'EPIC-001', title: 'Единое платежное ядро', description: 'Тест', owner: 'Александр Воронов' }]));
      localStorage.setItem('init_data', JSON.stringify([{ id: 'in-1', epicId: 'ep-1', code: 'INIT-101', title: 'Автоматический СБП-Биллинг', description: 'Тест', status: 'In Progress' }]));
      localStorage.setItem('feat_data', JSON.stringify([{
        id: 'fe-1',
        initiativeId: 'in-1',
        code: 'FEAT-111',
        title: 'QR-платежи через СБП в счете-фактуре',
        description: 'Генерация динамического QR-кода на основе платежных реквизитов.',
        effortHours: 40,
        repeatabilityCount: 3,
        salesImpact: 4,
        itsPriority: 3,
        autoScore: 3.5,
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

    await page.reload();
    await page.waitForTimeout(1000);

    console.log('2. Opening settings panel...');
    await page.click('button:has-text("Настройки")');
    await page.waitForTimeout(1000);

    console.log('3. Selecting Priority Formula tab...');
    await page.click('button:has-text("приоритетов")');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: '/home/jules/verification/screenshots/settings_priority_formula.png' });

    console.log('4. Adjusting weights and saving...');
    await page.click('button:has-text("Сохранить формулу приоритета")');
    await page.waitForTimeout(1000);

    console.log('5. Going to Backlog Panel...');
    await page.click('button:has-text("Бэклог и Приоритизация")');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: '/home/jules/verification/screenshots/backlog_landing.png' });

    console.log('6. Opening Priority Editor modal...');
    await page.click('button:has-text("PM вес")');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: '/home/jules/verification/screenshots/priority_editor_modal.png' });

    console.log('7. Saving changes in modal...');
    await page.click('button:has-text("Зафиксировать в аудит")');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: '/home/jules/verification/screenshots/backlog_final_result.png' });
    console.log('8. Script completed successfully.');

  } catch (err) {
    console.error('SCRIPT FAILURE:', err);
  } finally {
    await context.close();
    await browser.close();
  }
}

run();
