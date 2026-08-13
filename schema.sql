-- Схема базы данных PostgreSQL для Supabase (Система сквозной продуктовой аналитики)

-- ============================================================================
-- 1. ТИПЫ ДАННЫХ И ПЕРЕЧИСЛЕНИЯ (Enums)
-- ============================================================================

CREATE TYPE request_status AS ENUM ('Отклонен', 'В проработку', 'Принят', 'Неразобранные');
CREATE TYPE feature_segment AS ENUM ('Enterprise', 'SME', 'Retail');
CREATE TYPE release_status AS ENUM ('Draft', 'Approved');
CREATE TYPE initiative_status AS ENUM ('In Progress', 'Backlog', 'Completed');
CREATE TYPE task_status AS ENUM ('To Do', 'In Progress', 'Review', 'Done');
CREATE TYPE user_role AS ENUM ('Администратор');

-- ============================================================================
-- 2. ТАБЛИЦЫ СПРАВОЧНИКОВ И СУЩНОСТЕЙ (12 Ключевых Сущностей)
-- ============================================================================

-- 2.1. Виды деятельности (Activity Kinds)
CREATE TABLE activity_kinds (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2.2. Клиенты (Clients)
CREATE TABLE clients (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    activity_kind_id VARCHAR(50) REFERENCES activity_kinds(id) ON DELETE RESTRICT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2.3. Группы проектов (Project Groups)
CREATE TABLE project_groups (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    gitlab_url VARCHAR(512) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2.4. Продукты (Products)
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2.5. Модули (Modules)
CREATE TABLE modules (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    gitlab_label VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2.6. Проекты (Projects)
CREATE TABLE projects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- Название проекта (Клиент + Модуль, если пусто)
    project_group_id VARCHAR(50) REFERENCES project_groups(id) ON DELETE RESTRICT NOT NULL,
    client_id VARCHAR(50) REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE RESTRICT NOT NULL,
    module_id VARCHAR(50) REFERENCES modules(id) ON DELETE RESTRICT NOT NULL,
    gitlab_url VARCHAR(512) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2.7. Виды задач (Task Kinds)
CREATE TABLE task_kinds (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    gitlab_label VARCHAR(100) NOT NULL,
    priority_points INT DEFAULT 3 NOT NULL CHECK (priority_points BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2.8. Типы задач (Task Types)
CREATE TABLE task_types (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    gitlab_label VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2.9. Этапы проектов (Project Stages)
CREATE TABLE project_stages (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    gitlab_label VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2.10. Пользователи (Users)
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    gitlab_user VARCHAR(100) NOT NULL,
    role user_role DEFAULT 'Администратор' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2.11. Источники сигналов (Sources)
CREATE TABLE sources (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2.12. Настройки GitLab (GitLab Settings)
CREATE TABLE gitlab_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ровно одна запись настроек
    server_url VARCHAR(512) DEFAULT 'https://gitlab.corp.ru' NOT NULL,
    personal_access_token VARCHAR(255) NOT NULL,
    project_group VARCHAR(255) DEFAULT 'enterprise-products' NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 3. ТАБЛИЦЫ ОСНОВНОГО ПРОЦЕССА (Бэклог, Сигналы, Релизы, Задачи)
-- ============================================================================

-- 3.1. Эпики (Strategic Epics)
CREATE TABLE epics (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3.2. Инициативы (Initiatives)
CREATE TABLE initiatives (
    id VARCHAR(50) PRIMARY KEY,
    epic_id VARCHAR(50) REFERENCES epics(id) ON DELETE CASCADE NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status initiative_status DEFAULT 'Backlog' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3.3. Сложность переноса в релиз (Release Effort Options)
CREATE TABLE release_effort_options (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    points INT NOT NULL CHECK (points BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3.4. Релизы (Releases)
CREATE TABLE releases (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    capacity_hours INT DEFAULT 160 NOT NULL CHECK (capacity_hours BETWEEN 40 AND 400),
    status release_status DEFAULT 'Draft' NOT NULL,
    approved_at VARCHAR(100), -- Дата/время утверждения
    export_logs TEXT[], -- Логи интеграционного GitLab шлюза
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3.5. Фичи (Features / Требования в бэклоге)
CREATE TABLE features (
    id VARCHAR(50) PRIMARY KEY,
    initiative_id VARCHAR(50) REFERENCES initiatives(id) ON DELETE CASCADE NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    effort_hours INT DEFAULT 40 NOT NULL CHECK (effort_hours >= 0), -- Трудоемкость в экспертных часах (Story Points удалены!)

    -- Метрики для авторасчета системного приоритета:
    repeatability_count INT DEFAULT 1 NOT NULL, -- Кол-во сигналов (Demand)
    sales_impact INT DEFAULT 3 NOT NULL CHECK (sales_impact BETWEEN 1 AND 5), -- Влияние на продажи (sales)
    its_priority INT DEFAULT 3 NOT NULL CHECK (its_priority BETWEEN 1 AND 5), -- Приоритет ИТС поддержки

    -- Ссылка на сложность переноса:
    release_effort_id VARCHAR(50) REFERENCES release_effort_options(id) ON DELETE SET NULL,

    auto_score DECIMAL(10, 2) DEFAULT 0.00 NOT NULL, -- Автоматический вес приоритета
    override_score DECIMAL(10, 2), -- Переопределенный PM-ом вес (может быть NULL)
    override_reason TEXT, -- Обязательное обоснование переопределения PM-ом (АУДИТ)

    release_id VARCHAR(50) REFERENCES releases(id) ON DELETE SET NULL, -- Ссылка на релиз
    status VARCHAR(50) DEFAULT 'Backlog' NOT NULL, -- Статус воронки: Backlog, На оценке, Оценено

    subsystem VARCHAR(255), -- Совместимость с legacy-фильтрами по подсистемам
    task_kind VARCHAR(255), -- Совместимость по виду задач

    -- Продуктовая телеметрия и Adoption:
    adoption_rate INT DEFAULT 0 NOT NULL CHECK (adoption_rate BETWEEN 0 AND 100), -- Feature Adoption (%)
    mau INT DEFAULT 0 NOT NULL, -- Месячные активные пользователи
    retention_rate INT DEFAULT 0 NOT NULL CHECK (retention_rate BETWEEN 0 AND 100), -- Коэффициент удержания (%)
    segment_adoption JSONB DEFAULT '{"enterprise": 0, "sme": 0, "retail": 0}'::jsonb NOT NULL, -- Когорты в JSON

    -- Финансовые показатели (CAPEX/OPEX):
    revenue_generated DECIMAL(12, 2) DEFAULT 0.00 NOT NULL, -- Сгенерированная выручка / Допродажи
    development_cost DECIMAL(12, 2) DEFAULT 0.00 NOT NULL, -- Стоимость разработки (например, Hours * 2000)

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3.6. Декомпозиция: Задачи разработки (Tasks)
CREATE TABLE tasks (
    id VARCHAR(50) PRIMARY KEY,
    feature_id VARCHAR(50) REFERENCES features(id) ON DELETE CASCADE NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    status task_status DEFAULT 'To Do' NOT NULL,
    developer VARCHAR(255) DEFAULT 'Не назначен' NOT NULL,
    gitlab_url VARCHAR(512), -- Ссылка на оригинальный таск в GitLab
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3.7. Запросы с проектов / Входящие сигналы (Requests)
CREATE TABLE requests (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    source VARCHAR(255) NOT NULL, -- Источник (напр. GitLab, Интервью)
    description TEXT,
    status request_status DEFAULT 'Неразобранные' NOT NULL,
    gitlab_issue_id VARCHAR(100), -- Id Gitlab (Id Issue)

    -- Legacy денормализованные строковые поля для обратной совместимости с дашбордами:
    client VARCHAR(255),
    project VARCHAR(255),
    subsystem VARCHAR(255),
    task_kind VARCHAR(255),
    task_type VARCHAR(255),

    -- Строгие связи реляционной архитектуры (9 Обязательных параметров):
    author_id VARCHAR(50) REFERENCES users(id) ON DELETE RESTRICT,
    executor_id VARCHAR(50) REFERENCES users(id) ON DELETE RESTRICT,
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE RESTRICT,
    module_id VARCHAR(50) REFERENCES modules(id) ON DELETE RESTRICT,
    task_kind_id VARCHAR(50) REFERENCES task_kinds(id) ON DELETE RESTRICT,
    task_type_id VARCHAR(50) REFERENCES task_types(id) ON DELETE RESTRICT,
    project_stage_id VARCHAR(50) REFERENCES project_stages(id) ON DELETE RESTRICT,

    estimate INT DEFAULT 0 NOT NULL, -- Экспертная оценка в часах
    spent INT DEFAULT 0 NOT NULL, -- Фактически затрачено в часах

    epic_id VARCHAR(50) REFERENCES epics(id) ON DELETE SET NULL, -- Ссылка на Эпик
    associated_feature_id VARCHAR(50) REFERENCES features(id) ON DELETE SET NULL, -- Связанная фича для авто-приоритета

    created_at VARCHAR(10) NOT NULL -- Формат 'YYYY-MM-DD'
);

-- 3.8. Журнал Аудита ручных PM правок приоритета (pm_audits)
CREATE TABLE pm_audits (
    id BIGSERIAL PRIMARY KEY,
    feature_id VARCHAR(50) REFERENCES features(id) ON DELETE CASCADE NOT NULL,
    feature_name VARCHAR(255) NOT NULL,
    old_score DECIMAL(10, 2) NOT NULL,
    new_score DECIMAL(10, 2) NOT NULL,
    reason TEXT NOT NULL,
    pm_email VARCHAR(255) DEFAULT 'pm_current@corp.ru' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 4. ИНДЕКСЫ ДЛЯ ОПТИМИЗАЦИИ ФИЛЬТРОВ И АНАЛИТИКИ
-- ============================================================================

CREATE INDEX idx_clients_activity_kind ON clients(activity_kind_id);
CREATE INDEX idx_projects_group ON projects(project_group_id);
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_product ON projects(product_id);
CREATE INDEX idx_projects_module ON projects(module_id);

CREATE INDEX idx_initiatives_epic ON initiatives(epic_id);
CREATE INDEX idx_features_initiative ON features(initiative_id);
CREATE INDEX idx_features_release ON features(release_id);
CREATE INDEX idx_features_release_effort ON features(release_effort_id);
CREATE INDEX idx_tasks_feature ON tasks(feature_id);

CREATE INDEX idx_requests_author ON requests(author_id);
CREATE INDEX idx_requests_executor ON requests(executor_id);
CREATE INDEX idx_requests_project ON requests(project_id);
CREATE INDEX idx_requests_product ON requests(product_id);
CREATE INDEX idx_requests_module ON requests(module_id);
CREATE INDEX idx_requests_kind ON requests(task_kind_id);
CREATE INDEX idx_requests_type ON requests(task_type_id);
CREATE INDEX idx_requests_stage ON requests(project_stage_id);
CREATE INDEX idx_requests_epic ON requests(epic_id);
CREATE INDEX idx_requests_assoc_feat ON requests(associated_feature_id);

CREATE INDEX idx_pm_audits_feature ON pm_audits(feature_id);

-- ============================================================================
-- 5. БЕЗОПАСНОСТЬ И ПОЛИТИКИ ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Включаем RLS для всех созданных таблиц
ALTER TABLE activity_kinds ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_kinds ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE gitlab_settings ENABLE ROW LEVEL SECURITY;

ALTER TABLE epics ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE release_effort_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE pm_audits ENABLE ROW LEVEL SECURITY;

-- Создаем базовые универсальные политики доступа на чтение и запись для аутентифицированных пользователей
-- (Для MVP даем полный доступ для чтения всем, а на запись — авторизованным пользователям)

CREATE POLICY "Allow public read access" ON activity_kinds FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON activity_kinds FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON clients FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON project_groups FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON project_groups FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON products FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON modules FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON modules FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON projects FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON task_kinds FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON task_kinds FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON task_types FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON task_types FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON project_stages FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON project_stages FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON users FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON sources FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON sources FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON gitlab_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON gitlab_settings FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON epics FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON epics FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON initiatives FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON initiatives FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON release_effort_options FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON release_effort_options FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON releases FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON releases FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON features FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON features FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON tasks FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON tasks FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON requests FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON requests FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON pm_audits FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON pm_audits FOR ALL TO authenticated USING (true);
