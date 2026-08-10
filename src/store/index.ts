export interface Epic {
  id: string;
  code: string;
  title: string;
  description: string;
  owner: string;
}

export interface Initiative {
  id: string;
  epicId: string;
  code: string;
  title: string;
  description: string;
  status: 'In Progress' | 'Backlog' | 'Completed';
}

export interface Feature {
  id: string;
  initiativeId: string;
  code: string;
  title: string;
  description: string;
  effortHours: number; // Cost Estimation (Expert/manual)
  effortSP: number;    // Cost Estimation Story Points

  // For automatic score weighting:
  repeatabilityCount: number; // Number of matching requests / signals
  salesImpact: 1 | 2 | 3 | 4 | 5; // 1: Low, 5: Critical/High
  itsPriority: 1 | 2 | 3 | 4 | 5; // 1: low, 5: Critical

  // Scoring
  autoScore: number; // calculated as: (repeatabilityCount * 3) + (salesImpact * 10) + (itsPriority * 10)
  overrideScore?: number; // Manual PM Override
  overrideReason?: string; // Compulsory if overrideScore is set

  // Release status & estimation funnel status
  releaseId?: string | null; // Associated approved or draft release
  status?: 'Backlog' | 'На оценке' | 'Оценено';

  // Grouping fields
  subsystem?: string;
  taskKind?: string;

  // P&L & Telemetry (Telemetry adoption tracking details)
  adoptionRate: number; // % 0 to 100
  mau: number; // Monthly Active Users
  retentionRate: number; // % 0 to 100
  segmentAdoption: {
    enterprise: number; // %
    sme: number; // %
    retail: number; // %
  };
  revenueGenerated: number; // USD/RUB
  developmentCost: number; // Calculated or expert estimated SP * constant or raw
}

export interface Task {
  id: string;
  featureId: string;
  code: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
  developer: string;
  gitlabUrl?: string;
  sp: number;
}

// Updated Request with required enterprise parameters
export interface Request {
  id: string;
  code: string;
  title: string;
  source: string;
  description: string;
  status: 'Отклонен' | 'В проработку' | 'Принят' | 'Неразобранные'; // Status
  gitlabIssueId?: string; // Обязательный параметр (Id Gitlab)
  client?: string;        // Обязательный параметр (Клиент)
  project?: string;       // Обязательный параметр (проект)
  subsystem?: string;     // Обязательный параметр (подсистема)
  taskKind?: string;      // Обязательный параметр (вид задачи)
  taskType?: string;      // Обязательный параметр (тип задачи)
  epicId?: string;        // Опциональный параметр (Епик)
  associatedFeatureId?: string | null;
  createdAt: string;
}

export interface Release {
  id: string;
  code: string;
  title: string;
  capacitySP: number; // Capacity limits
  status: 'Draft' | 'Approved';
  approvedAt?: string;
  exportLogs?: string[]; // GitLab export logs after approval
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  details: string;
}

// Dictionary Items
export interface DictionaryItem {
  id: string;
  name: string;
}

// Initial Mock Data
export const initialEpics: Epic[] = [
  {
    id: 'ep-1',
    code: 'EPIC-001',
    title: 'Единое платежное ядро (Core Payments)',
    description: 'Оптимизация платежных шлюзов, поддержка СБП и автоплатежей.',
    owner: 'Александр Воронов (Lead PM)',
  },
  {
    id: 'ep-2',
    code: 'EPIC-002',
    title: 'Модуль ITS и Сервисной поддержки (ITS & Service Desk)',
    description: 'Интеграция с СУБД клиентов, автоматическая диспетчеризация заявок.',
    owner: 'Елена Кузнецова (Head of Support)',
  },
  {
    id: 'ep-3',
    code: 'EPIC-003',
    title: 'BI & Предиктивная аналитика (Analytics & ML)',
    description: 'Построение отчетов, когортный анализ и прогнозирование оттока пользователей.',
    owner: 'Дмитрий Соколов (Lead DA)',
  }
];

export const initialInitiatives: Initiative[] = [
  {
    id: 'in-1',
    epicId: 'ep-1',
    code: 'INIT-101',
    title: 'Автоматический СБП-Биллинг для B2B',
    description: 'Бизнес-гипотеза: Внедрение СБП снизит комиссию на 1.8% и ускорит поступления.',
    status: 'In Progress',
  },
  {
    id: 'in-2',
    epicId: 'ep-1',
    code: 'INIT-102',
    title: 'Рекуррентные подписки (Auto-Pay)',
    description: 'Снижение оттока пользователей за счет автоматического продления ИТС.',
    status: 'Backlog',
  },
  {
    id: 'in-3',
    epicId: 'ep-2',
    code: 'INIT-201',
    title: 'Умный Сервисный контракт (SLA Auto-match)',
    description: 'Сокращение времени реагирования саппорта на 40% с помощью авторазметки GitLab.',
    status: 'In Progress',
  },
  {
    id: 'in-4',
    epicId: 'ep-3',
    code: 'INIT-301',
    title: 'Executive ROI Дашборд реального времени',
    description: 'Дашборд сквозного финансового мониторинга стоимости фич и прибыли.',
    status: 'In Progress',
  },
  {
    id: 'in-5',
    epicId: 'ep-3',
    code: 'INIT-302',
    title: 'Когортная телеметрия Feature Adoption',
    description: 'Анализ пользовательского поведения на уровне крупных enterprise-клиентов.',
    status: 'Backlog',
  }
];

export const initialFeatures: Feature[] = [
  {
    id: 'fe-1',
    initiativeId: 'in-1',
    code: 'FEAT-111',
    title: 'QR-платежи через СБП в счете-фактуре',
    description: 'Генерация динамического QR-кода на основе платежных реквизитов.',
    effortHours: 40,
    effortSP: 5,
    repeatabilityCount: 14,
    salesImpact: 4,
    itsPriority: 3,
    autoScore: 112, // (14*3) + (4*10) + (3*10) = 42 + 40 + 30 = 112
    releaseId: 'rel-1', // Already in approved release
    status: 'Оценено',
    adoptionRate: 85,
    mau: 1240,
    retentionRate: 78,
    segmentAdoption: { enterprise: 90, sme: 82, retail: 60 },
    revenueGenerated: 850000,
    developmentCost: 150000,
    subsystem: 'СБП Процессинг',
    taskKind: 'Фича (Feature)',
  },
  {
    id: 'fe-2',
    initiativeId: 'in-1',
    code: 'FEAT-112',
    title: 'Мгновенные Webhook-нотификации о статусе реестра оплат',
    description: 'Оповещения 1С и ERP-систем о зачислении средств по СБП.',
    effortHours: 64,
    effortSP: 8,
    repeatabilityCount: 9,
    salesImpact: 3,
    itsPriority: 4,
    autoScore: 97, // (9*3) + 30 + 40 = 97
    releaseId: null, // In backlog draft candidate
    status: 'Backlog',
    adoptionRate: 0,
    mau: 0,
    retentionRate: 0,
    segmentAdoption: { enterprise: 0, sme: 0, retail: 0 },
    revenueGenerated: 0,
    developmentCost: 240000,
    subsystem: 'Уведомления и Вебхуки',
    taskKind: 'Фича (Feature)',
  },
  {
    id: 'fe-3',
    initiativeId: 'in-2',
    code: 'FEAT-121',
    title: 'Рекуррентные списания через Tinkoff Pay B2B',
    description: 'Автоматический ежемесячный платеж по ИТС по сохраненной карте.',
    effortHours: 80,
    effortSP: 13,
    repeatabilityCount: 22,
    salesImpact: 5,
    itsPriority: 2,
    autoScore: 136, // (22*3) + 50 + 20 = 136
    releaseId: null,
    status: 'Backlog',
    adoptionRate: 0,
    mau: 0,
    retentionRate: 0,
    segmentAdoption: { enterprise: 0, sme: 0, retail: 0 },
    revenueGenerated: 0,
    developmentCost: 390000,
    subsystem: 'ИТС Рекурренты',
    taskKind: 'Фича (Feature)',
  },
  {
    id: 'fe-4',
    initiativeId: 'in-3',
    code: 'FEAT-211',
    title: 'GitLab Sync Webhook для баг-трекинга ИТС',
    description: 'Интеграция заявок ИТС с GitLab Issues проектных команд.',
    effortHours: 32,
    effortSP: 3,
    repeatabilityCount: 6,
    salesImpact: 2,
    itsPriority: 5,
    autoScore: 88, // (6*3) + 20 + 50 = 88
    releaseId: 'rel-1',
    status: 'Оценено',
    adoptionRate: 92,
    mau: 430,
    retentionRate: 95,
    segmentAdoption: { enterprise: 98, sme: 85, retail: 40 },
    revenueGenerated: 420000,
    developmentCost: 90000,
    subsystem: 'Уведомления и Вебхуки',
    taskKind: 'Улучшение (Improvement)',
  },
  {
    id: 'fe-5',
    initiativeId: 'in-3',
    code: 'FEAT-212',
    title: 'Парсинг SLA и авто-эскалация инцидентов',
    description: 'Считывание параметров договора поддержки и запуск таймеров дедлайна.',
    effortHours: 50,
    effortSP: 5,
    repeatabilityCount: 18,
    salesImpact: 4,
    itsPriority: 5,
    autoScore: 144, // (18*3) + 40 + 50 = 144
    releaseId: null,
    status: 'Backlog',
    adoptionRate: 0,
    mau: 0,
    retentionRate: 0,
    segmentAdoption: { enterprise: 0, sme: 0, retail: 0 },
    revenueGenerated: 0,
    developmentCost: 150000,
    subsystem: 'Модуль Клиент-Банк',
    taskKind: 'Фича (Feature)',
  },
  {
    id: 'fe-6',
    initiativeId: 'in-4',
    code: 'FEAT-311',
    title: 'Экспорт финансовых графиков в PDF/XLS',
    description: 'Выгрузка P&L таблиц для совещаний директоров.',
    effortHours: 24,
    effortSP: 2,
    repeatabilityCount: 3,
    salesImpact: 1,
    itsPriority: 1,
    autoScore: 29, // 9 + 10 + 10 = 29
    releaseId: 'rel-1',
    status: 'Оценено',
    adoptionRate: 45,
    mau: 120,
    retentionRate: 50,
    segmentAdoption: { enterprise: 60, sme: 35, retail: 10 },
    revenueGenerated: 180000,
    developmentCost: 60000,
    subsystem: 'Модуль Клиент-Банк',
    taskKind: 'Улучшение (Improvement)',
  },
  {
    id: 'fe-7',
    initiativeId: 'in-4',
    code: 'FEAT-312',
    title: 'Финансовые тепловые карты затрат (ROI Heatmaps)',
    description: 'Интерактивная карта соотношения стоимости разработки и закрытых продаж.',
    effortHours: 72,
    effortSP: 8,
    repeatabilityCount: 11,
    salesImpact: 4,
    itsPriority: 3,
    autoScore: 103, // (11*3) + 40 + 30 = 103
    releaseId: null,
    status: 'Backlog',
    adoptionRate: 0,
    mau: 0,
    retentionRate: 0,
    segmentAdoption: { enterprise: 0, sme: 0, retail: 0 },
    revenueGenerated: 0,
    developmentCost: 240000,
    subsystem: 'СБП Процессинг',
    taskKind: 'Фича (Feature)',
  },
  {
    id: 'fe-8',
    initiativeId: 'in-5',
    code: 'FEAT-321',
    title: 'Анализ микро-взаимодействий в UI (Clickstream)',
    description: 'Поклик-логгинг для понимания Adoption Rate на уровне отдельных фиче-тогглов.',
    effortHours: 120,
    effortSP: 21,
    repeatabilityCount: 5,
    salesImpact: 3,
    itsPriority: 2,
    autoScore: 65, // 15 + 30 + 20 = 65
    releaseId: null,
    status: 'Backlog',
    adoptionRate: 0,
    mau: 0,
    retentionRate: 0,
    segmentAdoption: { enterprise: 0, sme: 0, retail: 0 },
    revenueGenerated: 0,
    developmentCost: 630000,
    subsystem: 'Уведомления и Вебхуки',
    taskKind: 'Технический долг',
  },
  {
    id: 'fe-9',
    initiativeId: 'in-2',
    code: 'FEAT-122',
    title: 'Нотификации об истечении ИТС в Telegram/SMS',
    description: 'Уведомление клиента за 5 дней до отключения поддержки.',
    effortHours: 40,
    effortSP: 5,
    repeatabilityCount: 17,
    salesImpact: 3,
    itsPriority: 4,
    autoScore: 121, // 51 + 30 + 40 = 121
    releaseId: null,
    status: 'Backlog',
    adoptionRate: 0,
    mau: 0,
    retentionRate: 0,
    segmentAdoption: { enterprise: 0, sme: 0, retail: 0 },
    revenueGenerated: 0,
    developmentCost: 150000,
    subsystem: 'Уведомления и Вебхуки',
    taskKind: 'Улучшение (Improvement)',
  }
];

export const initialTasks: Task[] = [
  { id: 't-1', featureId: 'fe-1', code: 'TASK-1111', title: 'Реализовать API генерации платежного QR-кода', status: 'Done', developer: 'Сергей Белов', sp: 2, gitlabUrl: 'https://gitlab.corp.ru/core/payments/-/issues/1111' },
  { id: 't-2', featureId: 'fe-1', code: 'TASK-1112', title: 'Верстка блока QR-кода в шаблоне счета-фактуры', status: 'Done', developer: 'Олег Новиков', sp: 1, gitlabUrl: 'https://gitlab.corp.ru/core/payments/-/issues/1112' },
  { id: 't-3', featureId: 'fe-1', code: 'TASK-1113', title: 'Интеграционное тестирование с банком-эквайером', status: 'Done', developer: 'Ирина Серова', sp: 2, gitlabUrl: 'https://gitlab.corp.ru/core/payments/-/issues/1113' },
  { id: 't-4', featureId: 'fe-2', code: 'TASK-1121', title: 'Разработка Webhook Sender сервиса на Node.js', status: 'To Do', developer: 'Сергей Белов', sp: 3 },
  { id: 't-5', featureId: 'fe-2', code: 'TASK-1122', title: 'Создание UI-настроек эндпоинтов в ЛК партнера', status: 'In Progress', developer: 'Олег Новиков', sp: 5 },
  { id: 't-6', featureId: 'fe-3', code: 'TASK-1211', title: 'Интеграция Tinkoff Pay SDK', status: 'To Do', developer: 'Антон Волков', sp: 8 },
  { id: 't-7', featureId: 'fe-3', code: 'TASK-1212', title: 'База данных: Хранение маскированных токенов карт', status: 'To Do', developer: 'Мария Кравцова', sp: 5 },
  { id: 't-8', featureId: 'fe-4', code: 'TASK-2111', title: 'Регистрация Webhook событий в GitLab API', status: 'Done', developer: 'Павел Орлов', sp: 1 },
  { id: 't-9', featureId: 'fe-4', code: 'TASK-2112', title: 'Адаптер маппинга JSON GitLab -> СУБД ИТС', status: 'Done', developer: 'Павел Орлов', sp: 2 },
  { id: 't-10', featureId: 'fe-5', code: 'TASK-2121', title: 'Парсинг SLA: регулярные выражения и дедлайны', status: 'In Progress', developer: 'Анна Дроздова', sp: 3 },
  { id: 't-11', featureId: 'fe-5', code: 'TASK-2122', title: 'Cron задача для ежеминутной сверки SLA таймеров', status: 'To Do', developer: 'Николай Попов', sp: 2 }
];

export const initialRequests: Request[] = [
  {
    id: 'req-1',
    code: 'REQ-101',
    title: 'Ошибка выгрузки реестра платежей в КЛИЕНТ-БАНК',
    source: 'GitLab',
    description: 'При обработке реестра с 200+ транзакциями падает по таймауту. Требуется асинхронный Webhook.',
    status: 'В проработку',
    gitlabIssueId: '#948',
    client: 'ПАО "Сбербанк"',
    project: 'Платежный шлюз B2B',
    subsystem: 'Модуль Клиент-Банк',
    taskKind: 'Ошибка (Bug)',
    taskType: 'Интеграционный сбой',
    epicId: 'ep-1',
    associatedFeatureId: null,
    createdAt: '2025-10-01',
  },
  {
    id: 'req-2',
    code: 'REQ-102',
    title: 'Запрос на СБП от крупных дистрибьюторов (ПАО "Транзит")',
    source: 'Интервью',
    description: 'Хотят платить по QR из личного кабинета, чтобы комиссия была меньше лимита эквайринга.',
    status: 'Принят',
    gitlabIssueId: '#993',
    client: 'ПАО "Транзит"',
    project: 'Кабинет Дистрибьютора',
    subsystem: 'СБП Процессинг',
    taskKind: 'Фича (Feature)',
    taskType: 'Новый метод оплаты',
    epicId: 'ep-1',
    associatedFeatureId: 'fe-1',
    createdAt: '2025-10-02',
  },
  {
    id: 'req-3',
    code: 'REQ-103',
    title: 'Жалобы на ручное продление ИТС-договоров',
    source: 'Обратная связь',
    description: 'Клиенты забывают платить вовремя, поддержка тратит 30 часов в месяц на напоминания. Нужен автоплатеж.',
    status: 'Принят',
    gitlabIssueId: '#1120',
    client: 'ИП Иванов И.И.',
    project: 'Автоматический биллинг',
    subsystem: 'ИТС Рекурренты',
    taskKind: 'Улучшение (Improvement)',
    taskType: 'Оптимизация БП',
    epicId: 'ep-1',
    associatedFeatureId: 'fe-3',
    createdAt: '2025-10-03',
  },
  {
    id: 'req-4',
    code: 'REQ-104',
    title: 'Добавление СБП-выгрузок в XML формат',
    source: 'CRM система',
    description: 'Запрос от дилеров для автоматической сверки реестров оплат через XML.',
    status: 'Неразобранные',
    createdAt: '2025-10-04',
  }
];

export const initialReleases: Release[] = [
  {
    id: 'rel-1',
    code: 'RELEASE-2025-Q3',
    title: 'Квартальный релиз Q3: СБП и Интеграция Поддержки',
    capacitySP: 25,
    status: 'Approved',
    approvedAt: '2025-09-15 14:30',
    exportLogs: [
      'INFO: Инициализация экспорта релизной ветки: release/2025-q3',
      'INFO: Экспорт задачи FEAT-111 (QR-платежи) в GitLab... УСПЕШНО. Созданы 3 issues.',
      'INFO: Экспорт задачи FEAT-211 (GitLab Sync) в GitLab... УСПЕШНО. Созданы 2 issues.',
      'INFO: Экспорт задачи FEAT-311 (Экспорт графиков) в GitLab... УСПЕШНО. Создан 1 issue.',
      'SUCCESS: Все задачи успешно перенесены в GitLab. Статус релиза: APPROVED. Триггеры сборки CI/CD активированы.'
    ]
  },
  {
    id: 'rel-draft',
    code: 'RELEASE-2025-Q4',
    title: 'План релиза Q4: Безопасность и Автоматизация ИТС',
    capacitySP: 20, // Slider target default
    status: 'Draft'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2025-10-01 10:15',
    userId: 'admin@corp.ru',
    action: 'INITIAL_SEED',
    details: 'Система инициализирована. Базовые сущности (Epic, Initiative, Feature, Task, Request) импортированы.',
  },
  {
    id: 'log-2',
    timestamp: '2025-10-02 12:44',
    userId: 'pm_manager@corp.ru',
    action: 'PRIORITY_OVERRIDE',
    details: 'Изменен приоритет FEAT-111 (QR-платежи): Скорректирован вручную с 112 на 150. Причина: Прямое поручение СТО в связи со стратегическим контрактом ПАО "Транзит".'
  }
];

// Initial Dictionaries
export const initialClients: DictionaryItem[] = [
  { id: 'cl-1', name: 'ПАО "Сбербанк"' },
  { id: 'cl-2', name: 'ПАО "Транзит"' },
  { id: 'cl-3', name: 'ИП Иванов И.И.' },
  { id: 'cl-4', name: 'ООО "Вектор"' }
];

export const initialProjects: DictionaryItem[] = [
  { id: 'pr-1', name: 'Платежный шлюз B2B' },
  { id: 'pr-2', name: 'Кабинет Дистрибьютора' },
  { id: 'pr-3', name: 'Автоматический биллинг' },
  { id: 'pr-4', name: 'Интеграционный шлюз ИТС' }
];

export const initialSubsystems: DictionaryItem[] = [
  { id: 'sub-1', name: 'Модуль Клиент-Банк' },
  { id: 'sub-2', name: 'СБП Процессинг' },
  { id: 'sub-3', name: 'ИТС Рекурренты' },
  { id: 'sub-4', name: 'Уведомления и Вебхуки' }
];

export const initialTaskKinds: DictionaryItem[] = [
  { id: 'kind-1', name: 'Ошибка (Bug)' },
  { id: 'kind-2', name: 'Фича (Feature)' },
  { id: 'kind-3', name: 'Улучшение (Improvement)' },
  { id: 'kind-4', name: 'Технический долг' }
];

export const initialTaskTypes: DictionaryItem[] = [
  { id: 'type-1', name: 'Интеграционный сбой' },
  { id: 'type-2', name: 'Новый метод оплаты' },
  { id: 'type-3', name: 'Оптимизация БП' },
  { id: 'type-4', name: 'Доработка UI' }
];

export const initialSources: DictionaryItem[] = [
  { id: 'src-1', name: 'GitLab' },
  { id: 'src-2', name: 'Интервью' },
  { id: 'src-3', name: 'Обратная связь' },
  { id: 'src-4', name: 'CRM система' }
];
