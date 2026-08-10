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

// Dictionary Items
export interface DictionaryItem {
  id: string;
  name: string;
}

export interface GitLabSettings {
  serverUrl: string;
  personalAccessToken: string;
  projectPath: string; // e.g. "enterprise/payment-system"
  mappedProjectId: string; // Local project ID mapped to this project path
  mappedTaskKindId: string; // Default Task Kind ID
  mappedTaskTypeId: string; // Default Task Type ID
  labelToKindMappings: Record<string, string>; // GitLab label -> Local Task Kind ID
  labelToTypeMappings: Record<string, string>; // GitLab label -> Local Task Type ID
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

// Initial Dictionaries
export const initialClients: DictionaryItem[] = [];
export const initialProjects: DictionaryItem[] = [];
export const initialSubsystems: DictionaryItem[] = [];

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

export const initialGitLabSettings: GitLabSettings = {
  serverUrl: 'https://gitlab.corp.ru',
  personalAccessToken: 'glpat-A1B2C3D4E5F6G7H8I9J0',
  projectPath: 'core/payments',
  mappedProjectId: 'pr-1', // Платежный шлюз B2B
  mappedTaskKindId: 'kind-2', // Фича (Feature)
  mappedTaskTypeId: 'type-1', // Интеграционный сбой
  labelToKindMappings: {
    'bug': 'kind-1', // Ошибка (Bug)
    'feature': 'kind-2', // Фича (Feature)
    'enhancement': 'kind-3', // Улучшение (Improvement)
    'tech-debt': 'kind-4', // Технический долг
  },
  labelToTypeMappings: {
    'integration': 'type-1', // Интеграционный сбой
    'payment': 'type-2', // Новый метод оплаты
    'optimization': 'type-3', // Оптимизация БП
    'ui': 'type-4', // Доработка UI
  }
};
