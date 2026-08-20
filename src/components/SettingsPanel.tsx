'use client';

import React, { useState } from 'react';
import { Epic, Client, ActivityKind, Project, Product, Module, ProjectGroup, TaskKind, ProjectStage, User, DictionaryItem } from '@/store/index';
import {
  Plus,
  Trash2,
  Edit2,
  FolderOpen,
  Users,
  Briefcase,
  Layers,
  Settings,
  Tag,
  Code,
  GitBranch,
  Save,
  ShieldAlert,
  UserCheck,
  Check,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface SettingsPanelProps {
  store: any;
}

export default function SettingsPanel({ store }: SettingsPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    'clients' | 'products' | 'project_groups' | 'projects' | 'stages' | 'activity_kinds' | 'kinds' | 'epics' | 'modules' | 'sources' | 'users' | 'roles' | 'priority_formula' | 'gitlab' | 'gitlab_labels'
  >('clients');

  // Generic Edit Modal State
  const [editItem, setEditingItem] = useState<{ subtab: string; data: any } | null>(null);

  // Collapsible state for sidebar groups
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroupCollapse = (groupTitle: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupTitle]: !prev[groupTitle] }));
  };

  // Epic Inputs
  const [epicTitle, setEpicTitle] = useState('');

  // Clients Inputs
  const [clientName, setClientName] = useState('');
  const [clientActivityId, setClientActivityId] = useState('');

  // Activity Kinds Inputs
  const [actKindName, setActKindName] = useState('');

  // Projects Inputs
  const [projName, setProjName] = useState('');
  const [projGroupId, setProjGroupId] = useState('');
  const [projClientId, setProjClientId] = useState('');
  const [projProdId, setProjProdId] = useState('');
  const [projGitlabUrl, setProjGitlabUrl] = useState('');

  // GitLab Projects Import Modal State
  const [isProjectImportModalOpen, setIsProjectImportModalOpen] = useState(false);
  const [importedProjectCandidates, setImportedProjectCandidates] = useState<any[]>([]);

  // Products Inputs
  const [prodName, setProdName] = useState('');

  // Modules Inputs
  const [modName, setModName] = useState('');
  const [modLabel, setModLabel] = useState('');

  // Project Groups Inputs
  const [grpName, setGrpName] = useState('');
  const [grpGitlab, setGrpGitlab] = useState('');

  // Task Kinds Inputs
  const [kindName, setKindName] = useState('');
  const [kindLabel, setKindLabel] = useState('');
  const [kindPoints, setKindPoints] = useState(3);

  // Priority formula configurable states
  const [wType, setWType] = useState(store.priorityWeights?.weightType || 0.25);
  const [wDemand, setWDemand] = useState(store.priorityWeights?.weightDemand || 0.25);
  const [wApplicability, setWApplicability] = useState(store.priorityWeights?.weightApplicability || 0.20);
  const [wSpentCost, setWSpentCost] = useState(store.priorityWeights?.weightSpentCost || 0.15);
  const [wReleaseEffort, setWReleaseEffort] = useState(store.priorityWeights?.weightReleaseEffort || 0.15);
  const [appEntity, setAppEntity] = useState<'module' | 'product'>(store.priorityWeights?.applicabilityEntity || 'module');

  // Global Rates states
  const [internalRateInput, setInternalRateInput] = useState(store.internalRate || 2000);
  const [externalRateInput, setExternalRateInput] = useState(store.externalRate || 3500);

  // Release Effort states
  const [effName, setEffName] = useState('');
  const [effPoints, setEffPoints] = useState(3);

  // Stages Inputs
  const [stageName, setStageName] = useState('');
  const [stageLabel, setStageLabel] = useState('');

  // Users Inputs
  const [usrFullName, setUsrFullName] = useState('');
  const [usrEmail, setUsrEmail] = useState('');
  const [usrGitlab, setUsrGitlab] = useState('');
  const [usrEnabled, setUsrEnabled] = useState(true);

  const [sourceName, setSourceName] = useState('');

  // GitLab Settings States
  const [serverUrl, setServerUrl] = useState(store.gitLabSettings?.serverUrl || 'https://gitlab.corp.ru');
  const [personalAccessToken, setPersonalAccessToken] = useState(store.gitLabSettings?.personalAccessToken || '');
  const [projectGroup, setProjectGroup] = useState(store.gitLabSettings?.projectGroup || 'enterprise-products');

  const handleSaveGitLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectGroup.trim()) {
      alert('Ошибка! Группа проектов GitLab является обязательным параметром.');
      return;
    }
    store.updateGitLabSettings({
      serverUrl,
      personalAccessToken,
      projectGroup: projectGroup.trim()
    });
    alert('Настройки интеграции с GitLab успешно сохранены!');
  };

  // User specified 5 SubTab Groups Sequence & Structure
  const subTabGroups = [
    {
      title: 'Проекты и продукты',
      items: [
        { id: 'clients', label: 'Клиенты', icon: <Users size={14} /> },
        { id: 'products', label: 'Продукты', icon: <Settings size={14} /> },
        { id: 'project_groups', label: 'Группы проектов', icon: <FolderOpen size={14} /> },
        { id: 'projects', label: 'Проекты', icon: <Briefcase size={14} /> },
        { id: 'stages', label: 'Этапы проектов', icon: <Layers size={14} /> },
        { id: 'activity_kinds', label: 'Виды деятельности', icon: <FolderOpen size={14} /> },
      ]
    },
    {
      title: 'Классификаторы',
      items: [
        { id: 'kinds', label: 'Виды задач', icon: <Tag size={14} /> },
        { id: 'epics', label: 'Эпики', icon: <Layers size={14} /> },
        { id: 'modules', label: 'Модули', icon: <Code size={14} /> },
        { id: 'sources', label: 'Источники сигналов', icon: <FolderOpen size={14} /> },
      ]
    },
    {
      title: 'Пользователи и доступ',
      items: [
        { id: 'users', label: 'Пользователи', icon: <UserCheck size={14} /> },
        { id: 'roles', label: 'Роли', icon: <ShieldAlert size={14} /> },
      ]
    },
    {
      title: 'Авто оценка',
      items: [
        { id: 'priority_formula', label: '⚙️ Настройка приоритетов', icon: <Settings size={14} /> },
      ]
    },
    {
      title: 'Интеграция с ГитЛаб',
      items: [
        { id: 'gitlab', label: 'Настройки интеграции', icon: <GitBranch size={14} /> },
        { id: 'gitlab_labels', label: 'Лейблы', icon: <Tag size={14} /> },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-white">Панель администрирования справочников</h2>
          <p className="text-xs text-[#8b949e]">
            Администрирование ключевых архитектурных сущностей для обеспечения сквозной продуктовой аналитики.
          </p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* SUBTAB BAR WITH COLLAPSIBLE GROUPS */}
        <aside className="w-full xl:w-72 shrink-0 space-y-3">
          {subTabGroups.map((group, idx) => {
            const isCollapsed = collapsedGroups[group.title];
            return (
              <div key={idx} className="space-y-1 bg-[#161b22]/50 p-2 rounded-xl border border-[#30363d]/60">
                <button
                  onClick={() => toggleGroupCollapse(group.title)}
                  className="w-full flex items-center justify-between text-[10px] font-bold text-[#8b949e] hover:text-white uppercase tracking-wider px-2 py-1 transition-colors text-left"
                >
                  <span>{group.title}</span>
                  {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                </button>

                {!isCollapsed && (
                  <div className="space-y-1 pt-0.5">
                    {group.items.map((subTab) => (
                      <button
                        key={subTab.id}
                        onClick={() => setActiveSubTab(subTab.id as any)}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          activeSubTab === subTab.id
                            ? 'bg-[#21262d] text-white border border-[#30363d]'
                            : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
                        }`}
                      >
                        {subTab.icon}
                        <span>{subTab.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* DETAILS PANEL WITH CRUD */}
        <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-xl p-6 overflow-hidden">

          {/* GITLAB INTEGRATION */}
          {activeSubTab === 'gitlab' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">Интеграция с GitLab</h3>
                <p className="text-xs text-[#8b949e]">
                  Настройте параметры авторизации и группу проектов для последующего автоматического импорта справочников.
                </p>
              </div>

              <form onSubmit={handleSaveGitLab} className="space-y-4 text-xs">
                <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d] space-y-3">
                  <span className="font-semibold text-white block">1. Параметры авторизации GitLab API</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#8b949e] mb-1">GitLab API Server URL:</label>
                      <input
                        type="url" required value={serverUrl} onChange={(e) => setServerUrl(e.target.value)}
                        placeholder="https://gitlab.corp.ru" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#8b949e] mb-1">Personal Access Token (PAT):</label>
                      <input
                        type="password" required value={personalAccessToken} onChange={(e) => setPersonalAccessToken(e.target.value)}
                        placeholder="glpat-********************" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d] space-y-3">
                  <span className="font-semibold text-white block">2. Группа проектов</span>
                  <div>
                    <label className="block text-[#c9d1d9] mb-1 font-semibold">Группа проектов в GitLab (Обязательно):</label>
                    <input
                      type="text" required value={projectGroup} onChange={(e) => setProjectGroup(e.target.value)}
                      placeholder="enterprise-products" className="w-full bg-[#161b22] border border-amber-600/50 rounded p-1.5 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#30363d]">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const info = await store.testGitLabConnection();
                        alert(`Успешно! Подключение к GitLab API установлено.\n\nГруппа: "${info.name}"\nПуть: "${info.fullPath}"\nURL: ${info.webUrl}`);
                      } catch (err: any) {
                        alert(err.message || err);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] border border-[#30363d] font-semibold rounded-lg transition-all"
                  >
                    <GitBranch size={15} /> Проверить подключение
                  </button>
                  <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white font-bold rounded-lg shadow-md transition-all">
                    <Save size={15} /> Сохранить настройки GitLab
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* GITLAB LABELS */}
          {activeSubTab === 'gitlab_labels' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">Лейблы ГитЛаб</h3>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const imported = await store.importGitLabLabels();
                      alert(`Импорт лейблов из GitLab успешно завершен!\nЗагружено лейблов: ${imported.length} шт.`);
                    } catch (err: any) {
                      alert(err.message || err);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded transition-all"
                >
                  <GitBranch size={13} /> Импортировать все лейблы из GitLab
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
                {!store.gitLabLabels || store.gitLabLabels.length === 0 ? (
                  <div className="col-span-full p-6 text-center text-[#8b949e] italic bg-[#0d1117] rounded-lg border border-[#30363d]">
                    Лейблы еще не загружены. Нажмите кнопку "Импортировать все лейблы из GitLab", чтобы загрузить ярлыки.
                  </div>
                ) : (
                  store.gitLabLabels.map((l: any) => (
                    <div key={l.id} className="p-3 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                      <div className="space-y-1">
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-bold text-white inline-block"
                          style={{ backgroundColor: l.color || '#1f6feb' }}
                        >
                          {l.name}
                        </span>
                        {l.description && (
                          <p className="text-[10px] text-[#8b949e] font-sans truncate max-w-[200px]">{l.description}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* EPICS LIST (Title only) */}
          {activeSubTab === 'epics' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-white">Список Эпиков</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!epicTitle.trim()) return;
                  store.addEpic({ title: epicTitle.trim() });
                  setEpicTitle('');
                }}
                className="grid grid-cols-1 gap-3 p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs"
              >
                <span className="font-semibold text-white block">Добавить новый Эпик</span>
                <div className="flex gap-2">
                  <input
                    type="text" required value={epicTitle} onChange={(e) => setEpicTitle(e.target.value)}
                    placeholder="Наименование Эпика..." className="flex-1 bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
                  <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white shrink-0">
                    <Plus size={14} /> Создать Эпик
                  </button>
                </div>
              </form>
              <div className="space-y-2">
                {store.epics.map((e: Epic) => (
                  <div key={e.id} className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#388bfd]/10 text-[#58a6ff]">{e.code}</span>
                      <strong className="text-white text-xs">{e.title}</strong>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingItem({ subtab: 'epics', data: { ...e } })}
                        className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => store.deleteEpic(e.id)} className="p-1.5 text-[#8b949e] hover:text-red-400 hover:bg-[#21262d] rounded">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {activeSubTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">Продукты</h3>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!prodName.trim()) return;
                  store.addProduct(prodName);
                  setProdName('');
                }}
                className="flex gap-2 text-xs"
              >
                <input
                  type="text" required value={prodName} onChange={(e) => setProdName(e.target.value)}
                  placeholder="Добавить новый продукт..." className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-white focus:outline-none"
                />
                <button type="submit" className="flex items-center gap-1 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded">
                  <Plus size={14} /> Добавить
                </button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {store.products.map((p: Product) => (
                  <div key={p.id} className="p-2 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                    <span className="text-white">{p.name}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingItem({ subtab: 'products', data: { ...p } })}
                        className="text-[#8b949e] hover:text-white"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => store.deleteProduct(p.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULES (Select from gitLabLabels, No import button) */}
          {activeSubTab === 'modules' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">Модули системы</h3>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!modName.trim() || !modLabel.trim()) return;
                  store.addModule(modName, modLabel);
                  setModName(''); setModLabel('');
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование модуля:</label>
                  <input
                    type="text" required value={modName} onChange={(e) => setModName(e.target.value)}
                    placeholder="Модуль Клиент-Банк" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">GitLab Label (из справочника Лейблы Гитлаб):</label>
                  {store.gitLabLabels && store.gitLabLabels.length > 0 ? (
                    <select
                      required
                      value={modLabel}
                      onChange={(e) => setModLabel(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    >
                      <option value="">-- Выберите Лейбл --</option>
                      {store.gitLabLabels.map((l: any) => (
                        <option key={l.id} value={l.name}>{l.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text" required value={modLabel} onChange={(e) => setModLabel(e.target.value)}
                      placeholder="module::client-bank" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    />
                  )}
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white">
                    <Plus size={14} /> Добавить модуль
                  </button>
                </div>
              </form>
              <div className="space-y-2">
                {store.modules.map((m: Module) => (
                  <div key={m.id} className="p-3 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between text-xs font-mono">
                    <div>
                      <strong className="text-white">{m.name}</strong>
                      <span className="text-[10px] text-[#58a6ff] block">GitLab Label: {m.gitlabLabel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingItem({ subtab: 'modules', data: { ...m } })}
                        className="text-[#8b949e] hover:text-white"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => store.deleteModule(m.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECT GROUPS (With import from GitLab) */}
          {activeSubTab === 'project_groups' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">Группы проектов</h3>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const imported = await store.importProjectGroupsFromGitLab();
                      alert(`Импорт групп проектов из GitLab успешно завершен!\nЗагружено: ${imported.length} шт.`);
                    } catch (err: any) {
                      alert(err.message || err);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded transition-all"
                >
                  <GitBranch size={13} /> Импортировать из GitLab
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!grpName.trim() || !grpGitlab.trim()) return;
                  store.addProjectGroup(grpName, grpGitlab);
                  setGrpName(''); setGrpGitlab('');
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование группы:</label>
                  <input
                    type="text" required value={grpName} onChange={(e) => setGrpName(e.target.value)}
                    placeholder="Группа СБП Проектов" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">GitLab URL группы:</label>
                  <input
                    type="text" required value={grpGitlab} onChange={(e) => setGrpGitlab(e.target.value)}
                    placeholder="https://gitlab.corp.ru/groups/sbp" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white">
                    <Plus size={14} /> Добавить группу
                  </button>
                </div>
              </form>
              <div className="space-y-2">
                {store.projectGroups.map((g: ProjectGroup) => (
                  <div key={g.id} className="p-3 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between text-xs font-mono">
                    <div>
                      <strong className="text-white">{g.name}</strong>
                      <span className="text-[10px] text-[#58a6ff] block">GitLab URL: {g.gitlabUrl}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingItem({ subtab: 'project_groups', data: { ...g } })}
                        className="text-[#8b949e] hover:text-white"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => store.deleteProjectGroup(g.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS (No Module attribute, Modal completion on import) */}
          {activeSubTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">Проекты развития</h3>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const candidates = await store.importProjectsFromGitLab();
                      if (candidates.length === 0) {
                        alert('Новых неимпортированных проектов в GitLab не найдено.');
                      } else {
                        setImportedProjectCandidates(candidates);
                        setIsProjectImportModalOpen(true);
                      }
                    } catch (err: any) {
                      alert(err.message || err);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded transition-all"
                >
                  <GitBranch size={13} /> Импортировать из GitLab
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!projGroupId || !projClientId || !projProdId || !projGitlabUrl.trim()) return;
                  store.addProject({
                    name: projName.trim(),
                    projectGroupId: projGroupId,
                    clientId: projClientId,
                    productId: projProdId,
                    gitlabUrl: projGitlabUrl.trim()
                  });
                  setProjName(''); setProjGroupId(''); setProjClientId(''); setProjProdId(''); setProjGitlabUrl('');
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование (если пусто то наименование Клиента):</label>
                  <input
                    type="text" value={projName} onChange={(e) => setProjName(e.target.value)}
                    placeholder="Напр. Личный кабинет Альфа" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">Ссылка Gitlab:</label>
                  <input
                    type="text" required value={projGitlabUrl} onChange={(e) => setProjGitlabUrl(e.target.value)}
                    placeholder="https://gitlab.corp.ru/..." className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">Группа проектов:</label>
                  <select required value={projGroupId} onChange={(e) => setProjGroupId(e.target.value)} className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white">
                    <option value="">-- Выберите группу --</option>
                    {store.projectGroups.map((g: ProjectGroup) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">Клиент:</label>
                  <select required value={projClientId} onChange={(e) => setProjClientId(e.target.value)} className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white">
                    <option value="">-- Выберите клиента --</option>
                    {store.clients.map((c: Client) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">Продукт:</label>
                  <select required value={projProdId} onChange={(e) => setProjProdId(e.target.value)} className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white">
                    <option value="">-- Выберите продукт --</option>
                    {store.products.map((p: Product) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="flex justify-end items-end">
                  <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white">
                    <Plus size={14} /> Создать проект
                  </button>
                </div>
              </form>
              <div className="space-y-2">
                {store.projects.map((p: Project) => {
                  const constructedName = store.getProjectName(p);
                  const grp = store.projectGroups.find((g: any) => g.id === p.projectGroupId);
                  const cl = store.clients.find((c: any) => c.id === p.clientId);
                  const prod = store.products.find((prodItem: any) => prodItem.id === p.productId);

                  return (
                    <div key={p.id} className="p-3 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white">{constructedName}</strong>
                        <div className="text-[10px] text-[#8b949e] mt-1 space-x-2">
                          <span>Группа: {grp?.name || '—'}</span>
                          <span>| Клиент: {cl?.name || '—'}</span>
                          <span>| Продукт: {prod?.name || '—'}</span>
                        </div>
                        <div className="text-[10px] text-[#58a6ff] font-mono mt-0.5">
                          GitLab: {p.gitlabUrl}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingItem({ subtab: 'projects', data: { ...p } })}
                          className="text-[#8b949e] hover:text-white p-1"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => store.deleteProject(p.id)} className="text-[#8b949e] hover:text-red-400 p-1"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TASK KINDS (Select gitLabLabels, No import button) */}
          {activeSubTab === 'kinds' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">Виды задач</h3>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!kindName.trim() || !kindLabel.trim()) return;
                  store.addTaskKind(kindName, kindLabel, kindPoints);
                  setKindName(''); setKindLabel(''); setKindPoints(3);
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование:</label>
                  <input
                    type="text" required value={kindName} onChange={(e) => setKindName(e.target.value)}
                    placeholder="Ошибка (Bug)" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">GitLab Label (из справочника):</label>
                  {store.gitLabLabels && store.gitLabLabels.length > 0 ? (
                    <select
                      required
                      value={kindLabel}
                      onChange={(e) => setKindLabel(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    >
                      <option value="">-- Выберите Лейбл --</option>
                      {store.gitLabLabels.map((l: any) => (
                        <option key={l.id} value={l.name}>{l.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text" required value={kindLabel} onChange={(e) => setKindLabel(e.target.value)}
                      placeholder="bug" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">Баллы приоритета (1-5):</label>
                  <input
                    type="number" required min={1} max={5} value={kindPoints} onChange={(e) => setKindPoints(Number(e.target.value))}
                    className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-semibold">
                    <Plus size={14} /> Добавить вид задач
                  </button>
                </div>
              </form>
              <div className="space-y-2">
                {store.taskKinds.map((k: TaskKind) => (
                  <div key={k.id} className="p-3 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between text-xs font-mono">
                    <div>
                      <strong className="text-white">{k.name}</strong>
                      <span className="text-[10px] text-[#58a6ff] block">GitLab Label: {k.gitlabLabel} | Баллы: <strong className="text-yellow-400 font-bold">{k.priorityPoints || 3}</strong></span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingItem({ subtab: 'kinds', data: { ...k } })}
                        className="text-[#8b949e] hover:text-white"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => store.deleteTaskKind(k.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECT STAGES (Select gitLabLabels, No import button) */}
          {activeSubTab === 'stages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">Этапы проектов</h3>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!stageName.trim() || !stageLabel.trim()) return;
                  store.addProjectStage(stageName, stageLabel);
                  setStageName(''); setStageLabel('');
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование этапа:</label>
                  <input
                    type="text" required value={stageName} onChange={(e) => setStageName(e.target.value)}
                    placeholder="Аналитика" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">GitLab Label (из справочника):</label>
                  {store.gitLabLabels && store.gitLabLabels.length > 0 ? (
                    <select
                      required
                      value={stageLabel}
                      onChange={(e) => setStageLabel(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    >
                      <option value="">-- Выберите Лейбл --</option>
                      {store.gitLabLabels.map((l: any) => (
                        <option key={l.id} value={l.name}>{l.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text" required value={stageLabel} onChange={(e) => setStageLabel(e.target.value)}
                      placeholder="stage::analysis" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    />
                  )}
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white">
                    <Plus size={14} /> Добавить этап
                  </button>
                </div>
              </form>
              <div className="space-y-2">
                {store.projectStages.map((s: ProjectStage) => (
                  <div key={s.id} className="p-3 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between text-xs font-mono">
                    <div>
                      <strong className="text-white">{s.name}</strong>
                      <span className="text-[10px] text-[#58a6ff] block">GitLab Label: {s.gitlabLabel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingItem({ subtab: 'stages', data: { ...s } })}
                        className="text-[#8b949e] hover:text-white"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => store.deleteProjectStage(s.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SOURCES */}
          {activeSubTab === 'sources' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-white">Источники сигналов</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!sourceName.trim()) return;
                  store.addSource(sourceName);
                  setSourceName('');
                }}
                className="flex gap-2 text-xs"
              >
                <input
                  type="text" required value={sourceName} onChange={(e) => setSourceName(e.target.value)}
                  placeholder="Добавить новый источник..." className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-white focus:outline-none"
                />
                <button type="submit" className="flex items-center gap-1 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded">
                  <Plus size={14} /> Добавить
                </button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {store.sources.map((s: any) => (
                  <div key={s.id} className="p-2 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                    <span className="text-white">{s.name}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingItem({ subtab: 'sources', data: { ...s } })}
                        className="text-[#8b949e] hover:text-white"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => store.deleteSource(s.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVITY KINDS */}
          {activeSubTab === 'activity_kinds' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">Виды деятельности</h3>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!actKindName.trim()) return;
                  store.addActivityKind(actKindName);
                  setActKindName('');
                }}
                className="flex gap-2 text-xs"
              >
                <input
                  type="text" required value={actKindName} onChange={(e) => setActKindName(e.target.value)}
                  placeholder="Добавить новый вид деятельности..." className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-white focus:outline-none"
                />
                <button type="submit" className="flex items-center gap-1 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded">
                  <Plus size={14} /> Добавить
                </button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {store.activityKinds.map((ak: ActivityKind) => (
                  <div key={ak.id} className="p-2 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                    <span className="text-white">{ak.name}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingItem({ subtab: 'activity_kinds', data: { ...ak } })}
                        className="text-[#8b949e] hover:text-white"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => store.deleteActivityKind(ak.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CLIENTS */}
          {activeSubTab === 'clients' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">Справочник клиентов</h3>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!clientName.trim() || !clientActivityId) return;
                  store.addClient(clientName, clientActivityId);
                  setClientName(''); setClientActivityId('');
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование клиента:</label>
                  <input
                    type="text" required value={clientName} onChange={(e) => setClientName(e.target.value)}
                    placeholder="ПАО Сбербанк" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">Вид деятельности:</label>
                  <select
                    required value={clientActivityId} onChange={(e) => setClientActivityId(e.target.value)}
                    className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  >
                    <option value="">-- Выберите вид --</option>
                    {store.activityKinds.map((ak: ActivityKind) => (
                      <option key={ak.id} value={ak.id}>{ak.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white">
                    <Plus size={14} /> Добавить клиента
                  </button>
                </div>
              </form>
              <div className="space-y-2">
                {store.clients.map((c: Client) => {
                  const ak = store.activityKinds.find((a: ActivityKind) => a.id === c.activityKindId);
                  return (
                    <div key={c.id} className="p-3 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white">{c.name}</strong>
                        <span className="text-[10px] text-[#8b949e] block">Деятельность: {ak ? ak.name : 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingItem({ subtab: 'clients', data: { ...c } })}
                          className="text-[#8b949e] hover:text-white"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => store.deleteClient(c.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* USERS (No import button) */}
          {activeSubTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">Пользователи</h3>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!usrFullName.trim() || !usrEmail.trim() || !usrGitlab.trim()) return;
                  store.addUser({
                    fullName: usrFullName.trim(),
                    isEnabled: usrEnabled,
                    email: usrEmail.trim(),
                    gitlabUser: usrGitlab.trim(),
                    role: 'Администратор'
                  });
                  setUsrFullName(''); setUsrEmail(''); setUsrGitlab(''); setUsrEnabled(true);
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">ФИО пользователя:</label>
                  <input
                    type="text" required value={usrFullName} onChange={(e) => setUsrFullName(e.target.value)}
                    placeholder="Иван Иванов" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">Email:</label>
                  <input
                    type="email" required value={usrEmail} onChange={(e) => setUsrEmail(e.target.value)}
                    placeholder="ivanov@corp.ru" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">Пользователь Gitlab:</label>
                  <input
                    type="text" required value={usrGitlab} onChange={(e) => setUsrGitlab(e.target.value)}
                    placeholder="ivanov_git" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox" checked={usrEnabled} onChange={(e) => setUsrEnabled(e.target.checked)}
                    className="rounded bg-[#161b22] border-[#30363d] text-blue-600 focus:ring-0 focus:ring-offset-0"
                  />
                  <label className="text-white">Вход разрешен</label>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white">
                    <Plus size={14} /> Добавить пользователя
                  </button>
                </div>
              </form>
              <div className="space-y-2">
                {store.users.map((u: User) => (
                  <div key={u.id} className="p-3 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-white">{u.fullName}</strong>
                      <span className="text-[10px] text-[#8b949e] block">Email: {u.email} | GitLab: {u.gitlabUser} | Роль: {u.role}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] ${u.isEnabled ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
                        {u.isEnabled ? 'Активен' : 'Заблокирован'}
                      </span>
                      <button
                        onClick={() => setEditingItem({ subtab: 'users', data: { ...u } })}
                        className="text-[#8b949e] hover:text-white"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => store.deleteUser(u.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ROLES (READ ONLY) */}
          {activeSubTab === 'roles' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">Роли в системе</h3>
                <p className="text-xs text-[#8b949e]">Статический список ролей (перечисление без возможности добавления).</p>
              </div>
              <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg">
                <div className="flex items-center justify-between text-xs p-2 bg-[#161b22] rounded border border-[#30363d]">
                  <span className="font-mono text-[#58a6ff] font-bold">Администратор</span>
                  <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-1.5 py-0.2 rounded border border-yellow-500/20">Системная роль</span>
                </div>
              </div>
            </div>
          )}

          {/* PRIORITY FORMULA CONFIGURATION */}
          {activeSubTab === 'priority_formula' && (
            <div className="space-y-8">
              <div className="border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">⚙️ Настройка формулы приоритетов фич</h3>
                <p className="text-xs text-[#8b949e] mt-1">
                  Настройте веса критериев и связанные сущности для автоматического расчета приоритета (Auto Score). Сумма весов должна быть равна 1.0 для корректной нормировки.
                </p>
              </div>

              {/* 0. FINANCIAL RATES FORM */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  store.updateGlobalRates(Number(internalRateInput), Number(externalRateInput));
                  alert('Финансовые ставки успешно сохранены!');
                }}
                className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs block">Финансовые ставки (Глобальные параметры расчетов)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#8b949e] mb-1 font-medium">Внутренняя ставка для расчетов (₽ / час):</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={internalRateInput}
                      onChange={(e) => setInternalRateInput(Number(e.target.value))}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-2 text-white font-mono font-bold"
                    />
                    <span className="text-[10px] text-[#8b949e] block mt-1">Используется для калькуляции Затрат Dev по фичам и синонимам.</span>
                  </div>
                  <div>
                    <label className="block text-[#8b949e] mb-1 font-medium">Внешняя ставка для расчетов (₽ / час):</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={externalRateInput}
                      onChange={(e) => setExternalRateInput(Number(e.target.value))}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-2 text-white font-mono font-bold"
                    />
                    <span className="text-[10px] text-[#8b949e] block mt-1">Используется для внешней оценки стоимости разработки для заказчиков.</span>
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white font-bold rounded shadow transition-all">
                    <Save size={14} /> Сохранить финансовые ставки
                  </button>
                </div>
              </form>

              {/* 1. WEIGHTS FORM */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const total = Number(wType) + Number(wDemand) + Number(wApplicability) + Number(wSpentCost) + Number(wReleaseEffort);
                  if (Math.abs(total - 1.0) > 0.001) {
                    if (!confirm(`Предупреждение: Сумма весов равна ${total.toFixed(2)}, а не 1.00. Вы уверены, что хотите сохранить?`)) {
                      return;
                    }
                  }
                  store.setPriorityWeights({
                    weightType: Number(wType),
                    weightDemand: Number(wDemand),
                    weightApplicability: Number(wApplicability),
                    weightSpentCost: Number(wSpentCost),
                    weightReleaseEffort: Number(wReleaseEffort),
                    applicabilityEntity: appEntity
                  });
                  alert('Настройки весов и формулы приоритета успешно сохранены!');
                }}
                className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs space-y-4"
              >
                <span className="font-semibold text-white text-xs block">1. Весовые коэффициенты</span>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[#8b949e] mb-1">Вид задачи (Type):</label>
                    <input
                      type="number" required step="0.05" min="0" max="1" value={wType} onChange={(e) => setWType(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8b949e] mb-1">Повторяемость (Demand):</label>
                    <input
                      type="number" required step="0.05" min="0" max="1" value={wDemand} onChange={(e) => setWDemand(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8b949e] mb-1">Применимость (Applicability):</label>
                    <input
                      type="number" required step="0.05" min="0" max="1" value={wApplicability} onChange={(e) => setWApplicability(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8b949e] mb-1">Затраты (SpentCost):</label>
                    <input
                      type="number" required step="0.05" min="0" max="1" value={wSpentCost} onChange={(e) => setWSpentCost(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8b949e] mb-1">Сложность релиза (ReleaseEffort):</label>
                    <input
                      type="number" required step="0.05" min="0" max="1" value={wReleaseEffort} onChange={(e) => setWReleaseEffort(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[#8b949e] mb-1">Сущность для расчета Применимости (Applicability):</label>
                    <select
                      value={appEntity}
                      onChange={(e) => setAppEntity(e.target.value as any)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    >
                      <option value="module">Модуль (Кол-во проектов на том же модуле)</option>
                      <option value="product">Продукт (Кол-во проектов на том же продукте)</option>
                    </select>
                  </div>
                  <div className="flex items-end justify-end">
                    <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow transition-all">
                      <Save size={14} /> Сохранить формулу приоритета
                    </button>
                  </div>
                </div>
              </form>

              {/* 2. RELEASE EFFORT DICTIONARY */}
              <div className="space-y-4">
                <div className="border-b border-[#30363d]/50 pb-2">
                  <span className="font-semibold text-white text-xs block">2. Справочник: Степень сложности переноса (ReleaseEffort)</span>
                  <p className="text-[11px] text-[#8b949e] mt-0.5">
                    Управляйте классификатором готовности доработок для передачи в продукт. Чем меньше усилий требуется от продуктовой команды, тем выше балл.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!effName.trim()) return;
                    store.addReleaseEffortOption(effName, effPoints);
                    setEffName(''); setEffPoints(3);
                  }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs"
                >
                  <div className="md:col-span-2">
                    <label className="block text-[#8b949e] mb-1">Вариант сложности:</label>
                    <input
                      type="text" required value={effName} onChange={(e) => setEffName(e.target.value)}
                      placeholder="Например: Перенести 1в1 (готов к релизу без изменений)"
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8b949e] mb-1">Баллы (1-5):</label>
                    <input
                      type="number" required min={1} max={5} value={effPoints} onChange={(e) => setEffPoints(Number(e.target.value))}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    />
                  </div>
                  <div className="md:col-span-3 flex justify-end">
                    <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-semibold">
                      <Plus size={14} /> Добавить вариант
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  {store.releaseEffortOptions?.map((o: any) => (
                    <div key={o.id} className="p-3 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between text-xs font-mono">
                      <div>
                        <strong className="text-white">{o.name}</strong>
                        <span className="text-[10px] text-[#8b949e] block mt-0.5">Начисляемые баллы: <strong className="text-yellow-400 font-bold">{o.points}</strong></span>
                      </div>
                      <button
                        onClick={() => store.deleteReleaseEffortOption(o.id)}
                        className="text-[#8b949e] hover:text-red-400"
                        title="Удалить"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================================================= */}
      {/* MODAL 1: EDIT ELEMENT DIALOG FOR ALL SUBTABS */}
      {/* ========================================================================================= */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
              <h3 className="text-sm font-semibold text-white">Редактирование элемента</h3>
              <button onClick={() => setEditingItem(null)} className="text-[#8b949e] hover:text-white">
                <X size={16} />
              </button>
            </div>

            {/* EDIT FORM BY SUBTAB */}
            {editItem.subtab === 'epics' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  store.updateEpic(editItem.data);
                  setEditingItem(null);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование Эпика:</label>
                  <input
                    type="text" required value={editItem.data.title}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, title: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 bg-[#21262d] text-white rounded">Отмена</button>
                  <button type="submit" className="px-3 py-1.5 bg-[#238636] text-white rounded">Сохранить</button>
                </div>
              </form>
            )}

            {editItem.subtab === 'products' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  store.updateProduct(editItem.data);
                  setEditingItem(null);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование продукта:</label>
                  <input
                    type="text" required value={editItem.data.name}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, name: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 bg-[#21262d] text-white rounded">Отмена</button>
                  <button type="submit" className="px-3 py-1.5 bg-[#238636] text-white rounded">Сохранить</button>
                </div>
              </form>
            )}

            {editItem.subtab === 'modules' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  store.updateModule(editItem.data);
                  setEditingItem(null);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование модуля:</label>
                  <input
                    type="text" required value={editItem.data.name}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, name: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">GitLab Label:</label>
                  {store.gitLabLabels && store.gitLabLabels.length > 0 ? (
                    <select
                      required value={editItem.data.gitlabLabel}
                      onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, gitlabLabel: e.target.value } })}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                    >
                      <option value="">-- Выберите Лейбл --</option>
                      {store.gitLabLabels.map((l: any) => (
                        <option key={l.id} value={l.name}>{l.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text" required value={editItem.data.gitlabLabel}
                      onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, gitlabLabel: e.target.value } })}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                    />
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 bg-[#21262d] text-white rounded">Отмена</button>
                  <button type="submit" className="px-3 py-1.5 bg-[#238636] text-white rounded">Сохранить</button>
                </div>
              </form>
            )}

            {editItem.subtab === 'project_groups' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  store.updateProjectGroup(editItem.data);
                  setEditingItem(null);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование группы:</label>
                  <input
                    type="text" required value={editItem.data.name}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, name: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">GitLab URL группы:</label>
                  <input
                    type="text" required value={editItem.data.gitlabUrl}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, gitlabUrl: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 bg-[#21262d] text-white rounded">Отмена</button>
                  <button type="submit" className="px-3 py-1.5 bg-[#238636] text-white rounded">Сохранить</button>
                </div>
              </form>
            )}

            {editItem.subtab === 'projects' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  store.updateProject(editItem.data);
                  setEditingItem(null);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование (необязательно, если пусто то "Клиент"):</label>
                  <input
                    type="text" value={editItem.data.name}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, name: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">Ссылка Gitlab:</label>
                  <input
                    type="text" required value={editItem.data.gitlabUrl}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, gitlabUrl: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">Группа проектов:</label>
                  <select
                    required value={editItem.data.projectGroupId}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, projectGroupId: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  >
                    {store.projectGroups.map((g: any) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">Клиент:</label>
                  <select
                    required value={editItem.data.clientId}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, clientId: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  >
                    {store.clients.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">Продукт:</label>
                  <select
                    required value={editItem.data.productId}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, productId: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  >
                    {store.products.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 bg-[#21262d] text-white rounded">Отмена</button>
                  <button type="submit" className="px-3 py-1.5 bg-[#238636] text-white rounded">Сохранить</button>
                </div>
              </form>
            )}

            {editItem.subtab === 'kinds' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  store.updateTaskKind(editItem.data);
                  setEditingItem(null);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование:</label>
                  <input
                    type="text" required value={editItem.data.name}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, name: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">GitLab Label:</label>
                  {store.gitLabLabels && store.gitLabLabels.length > 0 ? (
                    <select
                      required value={editItem.data.gitlabLabel}
                      onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, gitlabLabel: e.target.value } })}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                    >
                      <option value="">-- Выберите Лейбл --</option>
                      {store.gitLabLabels.map((l: any) => (
                        <option key={l.id} value={l.name}>{l.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text" required value={editItem.data.gitlabLabel}
                      onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, gitlabLabel: e.target.value } })}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">Баллы приоритета (1-5):</label>
                  <input
                    type="number" required min={1} max={5} value={editItem.data.priorityPoints || 3}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, priorityPoints: Number(e.target.value) } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 bg-[#21262d] text-white rounded">Отмена</button>
                  <button type="submit" className="px-3 py-1.5 bg-[#238636] text-white rounded">Сохранить</button>
                </div>
              </form>
            )}

            {editItem.subtab === 'stages' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  store.updateProjectStage(editItem.data);
                  setEditingItem(null);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование этапа:</label>
                  <input
                    type="text" required value={editItem.data.name}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, name: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">GitLab Label:</label>
                  {store.gitLabLabels && store.gitLabLabels.length > 0 ? (
                    <select
                      required value={editItem.data.gitlabLabel}
                      onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, gitlabLabel: e.target.value } })}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                    >
                      <option value="">-- Выберите Лейбл --</option>
                      {store.gitLabLabels.map((l: any) => (
                        <option key={l.id} value={l.name}>{l.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text" required value={editItem.data.gitlabLabel}
                      onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, gitlabLabel: e.target.value } })}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                    />
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 bg-[#21262d] text-white rounded">Отмена</button>
                  <button type="submit" className="px-3 py-1.5 bg-[#238636] text-white rounded">Сохранить</button>
                </div>
              </form>
            )}

            {editItem.subtab === 'sources' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  store.updateSource(editItem.data);
                  setEditingItem(null);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование источника:</label>
                  <input
                    type="text" required value={editItem.data.name}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, name: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 bg-[#21262d] text-white rounded">Отмена</button>
                  <button type="submit" className="px-3 py-1.5 bg-[#238636] text-white rounded">Сохранить</button>
                </div>
              </form>
            )}

            {editItem.subtab === 'activity_kinds' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  store.updateActivityKind(editItem.data);
                  setEditingItem(null);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование вида деятельности:</label>
                  <input
                    type="text" required value={editItem.data.name}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, name: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 bg-[#21262d] text-white rounded">Отмена</button>
                  <button type="submit" className="px-3 py-1.5 bg-[#238636] text-white rounded">Сохранить</button>
                </div>
              </form>
            )}

            {editItem.subtab === 'clients' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  store.updateClient(editItem.data);
                  setEditingItem(null);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование клиента:</label>
                  <input
                    type="text" required value={editItem.data.name}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, name: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">Вид деятельности:</label>
                  <select
                    required value={editItem.data.activityKindId}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, activityKindId: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  >
                    {store.activityKinds.map((ak: any) => (
                      <option key={ak.id} value={ak.id}>{ak.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 bg-[#21262d] text-white rounded">Отмена</button>
                  <button type="submit" className="px-3 py-1.5 bg-[#238636] text-white rounded">Сохранить</button>
                </div>
              </form>
            )}

            {editItem.subtab === 'users' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  store.updateUser(editItem.data);
                  setEditingItem(null);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">ФИО пользователя:</label>
                  <input
                    type="text" required value={editItem.data.fullName}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, fullName: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">Email:</label>
                  <input
                    type="email" required value={editItem.data.email}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, email: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">Пользователь GitLab:</label>
                  <input
                    type="text" required value={editItem.data.gitlabUser}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, gitlabUser: e.target.value } })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox" checked={editItem.data.isEnabled}
                    onChange={(e) => setEditingItem({ ...editItem, data: { ...editItem.data, isEnabled: e.target.checked } })}
                    className="rounded bg-[#0d1117] border-[#30363d] text-blue-600 focus:ring-0"
                  />
                  <label className="text-white">Вход разрешен</label>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 bg-[#21262d] text-white rounded">Отмена</button>
                  <button type="submit" className="px-3 py-1.5 bg-[#238636] text-white rounded">Сохранить</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* MODAL 2: IMPORT PROJECTS FROM GITLAB (Requirement 5) */}
      {/* ========================================================================================= */}
      {isProjectImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-3xl w-full p-6 space-y-4 shadow-2xl my-8 text-xs">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Дозаполнение импортированных проектов из GitLab</h3>
                <p className="text-[#8b949e] text-[11px] mt-0.5">
                  Укажите обязательные атрибуты (Группа проектов, Клиент, Продукт) для каждого нового проекта.
                </p>
              </div>
              <button onClick={() => setIsProjectImportModalOpen(false)} className="text-[#8b949e] hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
              {importedProjectCandidates.map((p, idx) => (
                <div key={idx} className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-white text-xs">{p.name}</strong>
                    <span className="text-[10px] font-mono text-[#58a6ff]">{p.gitlabUrl}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[#8b949e] mb-1 font-mono text-[10px]">Группа проектов:</label>
                      <select
                        value={p.suggestedGroupId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setImportedProjectCandidates(prev => prev.map((item, i) => i === idx ? { ...item, suggestedGroupId: val } : item));
                        }}
                        className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                      >
                        {store.projectGroups.map((g: any) => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#8b949e] mb-1 font-mono text-[10px]">Клиент:</label>
                      <select
                        value={p.suggestedClientId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setImportedProjectCandidates(prev => prev.map((item, i) => i === idx ? { ...item, suggestedClientId: val } : item));
                        }}
                        className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                      >
                        {store.clients.map((c: any) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#8b949e] mb-1 font-mono text-[10px]">Продукт:</label>
                      <select
                        value={p.suggestedProductId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setImportedProjectCandidates(prev => prev.map((item, i) => i === idx ? { ...item, suggestedProductId: val } : item));
                        }}
                        className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                      >
                        {store.products.map((prod: any) => (
                          <option key={prod.id} value={prod.id}>{prod.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#30363d]">
              <button
                type="button"
                onClick={() => setIsProjectImportModalOpen(false)}
                className="px-3.5 py-1.5 bg-[#21262d] text-white rounded hover:bg-[#30363d]"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={async () => {
                  const finalPayload = importedProjectCandidates.map(c => ({
                    name: c.name,
                    projectGroupId: c.suggestedGroupId,
                    clientId: c.suggestedClientId,
                    productId: c.suggestedProductId,
                    gitlabUrl: c.gitlabUrl
                  }));
                  await store.addImportedProjects(finalPayload);
                  alert(`Успешно импортировано и сохранено проектов: ${finalPayload.length} шт.`);
                  setIsProjectImportModalOpen(false);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white font-semibold rounded"
              >
                <Check size={14} /> Сохранить импортированные проекты
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
