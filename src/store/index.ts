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
  effortHours: number; // Cost Estimation (Expert/manual) in hours

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
  developmentCost: number; // Calculated or expert estimated hours * constant or raw
}

export interface Task {
  id: string;
  featureId: string;
  code: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
  developer: string;
  gitlabUrl?: string;
}

// --- NEW/UPDATED ENTITIES ---

// 1. Клиенты
export interface Client {
  id: string;
  name: string;
  activityKindId: string; // ссылка на Виды деятельности
}

// 2. Виды деятельности
export interface ActivityKind {
  id: string;
  name: string;
}

// 3. Проекты
export interface Project {
  id: string;
  name: string; // (если пусто то конструктор "Клиент + Модуль")
  projectGroupId: string; // ссылка
  clientId: string; // ссылка
  productId: string; // ссылка
  moduleId: string; // ссылка
  gitlabUrl: string; // ссылка Gitlab
}

// 4. Продукты
export interface Product {
  id: string;
  name: string;
}

// 5. Модули
export interface Module {
  id: string;
  name: string;
  gitlabLabel: string; // Ссылка на label gitlab
}

// 6. Группы проектов
export interface ProjectGroup {
  id: string;
  name: string;
  gitlabUrl: string; // Ссылка Gitlab
}

// 7. Виды задач (Refactored to support new structure)
export interface TaskKind {
  id: string;
  name: string;
  gitlabLabel: string; // Ссылка на label gitlab
}

// 8. Типы задач (Refactored to support new structure)
export interface TaskType {
  id: string;
  name: string;
  gitlabLabel: string; // Ссылка на label gitlab
}

// 9. Этапы проектов
export interface ProjectStage {
  id: string;
  name: string;
  gitlabLabel: string; // Ссылка на label gitlab
}

// 11. Пользователи
export interface User {
  id: string;
  fullName: string; // ФИО
  isEnabled: boolean; // Вход в систему разрешен
  email: string;
  gitlabUser: string; // Пользователь Gitlab (ссылка/имя)
  role: 'Администратор'; // Роль (перечисление)
}

// 10. Запрос (Request) - Updated with new schema while preserving current logic fields
export interface Request {
  id: string;
  code: string;
  title: string;
  source: string;
  description: string;
  status: 'Отклонен' | 'В проработку' | 'Принят' | 'Неразобранные'; // Status
  gitlabIssueId?: string; // Обязательный параметр (Id Gitlab)

  // Legacy string fields kept for full functional logic compatibility:
  client?: string;
  project?: string;
  subsystem?: string;
  taskKind?: string;
  taskType?: string;

  // New strict relations:
  authorId?: string; // Автор (ссылка Пользователи)
  executorId?: string; // Исполнитель (ссылка Пользователи)
  projectId?: string; // Проект (ссылка)
  productId?: string; // Продукт (ссылка)
  moduleId?: string; // Модуль (ссылка)
  taskKindId?: string; // Вид задачи (ссылка)
  taskTypeId?: string; // Тип задачи (ссылка)
  projectStageId?: string; // Этап проекта (ссылка)
  estimate?: number; // Оценка (число)
  spent?: number; // Затрачено (число)

  epicId?: string; // Опциональный параметр (Епик)
  associatedFeatureId?: string | null;
  createdAt: string;
}

export interface Release {
  id: string;
  code: string;
  title: string;
  capacityHours: number; // Capacity limits in hours
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

// Dictionary Items (generic fallback)
export interface DictionaryItem {
  id: string;
  name: string;
}

export interface GitLabSettings {
  serverUrl: string;
  personalAccessToken: string;
  projectGroup: string; // Группа проектов в GitLab
}

// Initial Mock Data
export const initialEpics: Epic[] = [];
export const initialInitiatives: Initiative[] = [];
export const initialFeatures: Feature[] = [];
export const initialTasks: Task[] = [];
export const initialRequests: Request[] = [];

export const initialReleases: Release[] = [
  {
    id: 'rel-draft',
    code: 'RELEASE-2025-DRAFT',
    title: 'План релиза (Черновик)',
    capacityHours: 160,
    status: 'Draft'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2025-10-01 10:00',
    userId: 'admin@corp.ru',
    action: 'INITIAL_SEED',
    details: 'Система инициализирована в чистом режиме без демонстрационных данных.',
  }
];

// Initial Dictionaries and Entities
export const initialActivityKinds: ActivityKind[] = [
  { id: 'act-1', name: 'Банковские услуги' },
  { id: 'act-2', name: 'Финтех разработка' }
];

export const initialClients: Client[] = [
  { id: 'cl-1', name: 'ПАО "Сбербанк"', activityKindId: 'act-1' }
];

export const initialProducts: Product[] = [
  { id: 'prod-1', name: 'Мобильный Банк B2B' },
  { id: 'prod-2', name: 'СБП Процессинг' }
];

export const initialModules: Module[] = [
  { id: 'mod-1', name: 'Модуль Клиент-Банк', gitlabLabel: 'module::client-bank' },
  { id: 'mod-2', name: 'Ядро Процессинга', gitlabLabel: 'module::core' }
];

export const initialProjectGroups: ProjectGroup[] = [
  { id: 'grp-1', name: 'Группа СБП Проектов', gitlabUrl: 'https://gitlab.corp.ru/sbp' }
];

export const initialProjects: Project[] = [
  {
    id: 'pr-1',
    name: 'Платежный шлюз B2B',
    projectGroupId: 'grp-1',
    clientId: 'cl-1',
    productId: 'prod-2',
    moduleId: 'mod-1',
    gitlabUrl: 'https://gitlab.corp.ru/sbp/gateway'
  }
];

export const initialTaskKinds: TaskKind[] = [
  { id: 'kind-1', name: 'Ошибка (Bug)', gitlabLabel: 'bug' },
  { id: 'kind-2', name: 'Фича (Feature)', gitlabLabel: 'feature' },
  { id: 'kind-3', name: 'Улучшение (Improvement)', gitlabLabel: 'enhancement' },
  { id: 'kind-4', name: 'Технический долг', gitlabLabel: 'tech-debt' }
];

export const initialTaskTypes: TaskType[] = [
  { id: 'type-1', name: 'Интеграционный сбой', gitlabLabel: 'type::integration' },
  { id: 'type-2', name: 'Новый метод оплаты', gitlabLabel: 'type::payment' },
  { id: 'type-3', name: 'Оптимизация БП', gitlabLabel: 'type::optimization' },
  { id: 'type-4', name: 'Доработка UI', gitlabLabel: 'type::ui' }
];

export const initialProjectStages: ProjectStage[] = [
  { id: 'stg-1', name: 'Аналитика', gitlabLabel: 'stage::analysis' },
  { id: 'stg-2', name: 'Разработка', gitlabLabel: 'stage::development' },
  { id: 'stg-3', name: 'Тестирование', gitlabLabel: 'stage::testing' }
];

export const initialUsers: User[] = [
  { id: 'usr-1', fullName: 'Администратор Системы', isEnabled: true, email: 'admin@corp.ru', gitlabUser: 'admin_git', role: 'Администратор' }
];

export const initialSources: DictionaryItem[] = [
  { id: 'src-1', name: 'GitLab' },
  { id: 'src-2', name: 'Интервью' },
  { id: 'src-3', name: 'Обратная связь' },
  { id: 'src-4', name: 'CRM система' }
];

export const initialGitLabSettings: GitLabSettings = {
  serverUrl: 'https://gitlab.corp.ru',
  personalAccessToken: 'glpat-A1B2C3D4E5F6G7H8I9J0',
  projectGroup: 'enterprise-products'
};
