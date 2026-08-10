-- Схема базы данных PostgreSQL для Supabase (Система сквозной продуктовой аналитики)

-- 1. Перечисления (Enums)
CREATE TYPE request_status AS ENUM ('Отклонен', 'В проработку', 'Принят');
CREATE TYPE feature_segment AS ENUM ('Enterprise', 'SME', 'Retail');
CREATE TYPE release_status AS ENUM ('DRAFT', 'APPROVED');

-- 2. Таблица Эпиков (Epic)
CREATE TABLE epics (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Таблица Инициатив (Initiative)
CREATE TABLE initiatives (
    id VARCHAR(50) PRIMARY KEY,
    epic_id VARCHAR(50) REFERENCES epics(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Таблица Запросов с проектов (Request)
CREATE TABLE requests (
    id VARCHAR(50) PRIMARY KEY,
    initiative_id VARCHAR(50) REFERENCES initiatives(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    source VARCHAR(255) NOT NULL, -- Например: "GitLab Project A", "Интервью с клиентом"
    status request_status DEFAULT 'В проработку' NOT NULL,
    sales_impact DECIMAL(12, 2) DEFAULT 0.00 NOT NULL, -- Влияние на продажи / ИТС (в рублях)
    support_priority INT DEFAULT 1 NOT NULL, -- Приоритет поддержки (1-5)

    -- 7 Обязательных параметров корпоративной разметки и сквозной фильтрации
    gitlab_issue_id VARCHAR(100), -- Id Gitlab
    client VARCHAR(255),          -- Клиент
    project VARCHAR(255),         -- проект
    subsystem VARCHAR(255),       -- подсистема
    task_kind VARCHAR(255),       -- вид задачи
    task_type VARCHAR(255),       -- тип задачи
    epic_id VARCHAR(50) REFERENCES epics(id) ON DELETE SET NULL, -- Ссылка на Эпик

    associated_feature_id VARCHAR(50), -- Связанная фича для авто-приоритета
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Таблица Фич (Feature)
CREATE TABLE features (
    id VARCHAR(50) PRIMARY KEY,
    initiative_id VARCHAR(50) REFERENCES initiatives(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_hours INT DEFAULT 0 NOT NULL,
    auto_score DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
    override_score DECIMAL(10, 2), -- Переопределенный приоритет PM-ом (может быть NULL)
    override_reason TEXT, -- Обязательное обоснование переопределения
    release_id VARCHAR(50), -- Идентификатор релиза, если фича добавлена
    adoption_rate INT DEFAULT 0 NOT NULL, -- Feature Adoption (0-100%)
    mau INT DEFAULT 0 NOT NULL, -- Активные пользователи за месяц
    retention_rate INT DEFAULT 0 NOT NULL, -- Коэффициент удержания (%)
    segment feature_segment DEFAULT 'Enterprise' NOT NULL, -- Сегмент клиентов
    capex_cost DECIMAL(12, 2) DEFAULT 0.00 NOT NULL, -- Стоимость разработки CAPEX
    opex_cost DECIMAL(12, 2) DEFAULT 0.00 NOT NULL, -- Стоимость поддержки OPEX
    revenue_generated DECIMAL(12, 2) DEFAULT 0.00 NOT NULL, -- Полученная выручка / ИТС
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Таблица Задач (Task)
CREATE TABLE tasks (
    id VARCHAR(50) PRIMARY KEY,
    feature_id VARCHAR(50) REFERENCES features(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    estimated_hours INT DEFAULT 0 NOT NULL,
    gitlab_issue_url VARCHAR(512), -- Ссылка на оригинальный таск в GitLab
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Таблица Релизов (Release)
CREATE TABLE releases (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    capacity_limit_hours INT DEFAULT 160 NOT NULL,
    status release_status DEFAULT 'DRAFT' NOT NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Связать фичи с релизами (внешний ключ после создания таблицы релизов)
ALTER TABLE features ADD CONSTRAINT fk_features_release FOREIGN KEY (release_id) REFERENCES releases(id) ON DELETE SET NULL;

-- 8. Журнал Аудита ручных правок приоритета PM-ом
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

-- 9. Индексы для оптимизации запросов и аналитики
CREATE INDEX idx_initiatives_epic ON initiatives(epic_id);
CREATE INDEX idx_requests_initiative ON requests(initiative_id);
CREATE INDEX idx_features_initiative ON features(initiative_id);
CREATE INDEX idx_features_release ON features(release_id);
CREATE INDEX idx_tasks_feature ON tasks(feature_id);
CREATE INDEX idx_pm_audits_feature ON pm_audits(feature_id);

-- 10. Включение Row Level Security (RLS) для безопасности данных
ALTER TABLE epics ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE pm_audits ENABLE ROW LEVEL SECURITY;

-- 11. Базовые политики безопасности (Разрешить чтение и запись авторизованным пользователям)
-- В рамках MVP мы открываем доступ на чтение и запись для аутентифицированных пользователей
CREATE POLICY "Allow public read access" ON epics FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON epics FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON initiatives FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON initiatives FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON requests FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON requests FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON features FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON features FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON tasks FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON tasks FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON releases FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON releases FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON pm_audits FOR SELECT USING (true);
CREATE POLICY "Allow authenticated modifications" ON pm_audits FOR ALL TO authenticated USING (true);
