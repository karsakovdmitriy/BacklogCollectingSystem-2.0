'use client';

import React, { useState } from 'react';
import { Epic, Client, ActivityKind, Project, Product, Module, ProjectGroup, TaskKind, TaskType, ProjectStage, User } from '@/store/index';
import {
  Plus,
  Trash2,
  FolderOpen,
  Users,
  Briefcase,
  Layers,
  Settings,
  Tag,
  Code,
  GitBranch,
  Save,
  HelpCircle,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

interface SettingsPanelProps {
  store: any;
}

export default function SettingsPanel({ store }: SettingsPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    'epics' | 'clients' | 'activity_kinds' | 'projects' | 'products' | 'modules' | 'project_groups' | 'kinds' | 'types' | 'stages' | 'users' | 'roles' | 'sources' | 'gitlab' | 'priority_formula'
  >('epics');

  // Epic Inputs
  const [epicTitle, setEpicTitle] = useState('');
  const [epicDesc, setEpicDesc] = useState('');
  const [epicOwner, setEpicOwner] = useState('');

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
  const [projModId, setProjModId] = useState('');
  const [projGitlabUrl, setProjGitlabUrl] = useState('');

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

  // Release Effort states
  const [effName, setEffName] = useState('');
  const [effPoints, setEffPoints] = useState(3);

  // Task Types Inputs
  const [typeName, setTypeName] = useState('');
  const [typeLabel, setTypeLabel] = useState('');

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


  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-white">Панель администрирования справочников</h2>
          <p className="text-xs text-[#8b949e]">
            Полное администрирование 12 ключевых архитектурных сущностей для обеспечения сквозной фильтрации и связности данных.
          </p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* SUBTAB BAR */}
        <aside className="w-full xl:w-72 shrink-0 space-y-1">
          {[
            { id: 'epics', label: 'Эпики (Модули)', icon: <Layers size={14} /> },
            { id: 'clients', label: '1. Клиенты', icon: <Users size={14} /> },
            { id: 'activity_kinds', label: '2. Виды деятельности', icon: <FolderOpen size={14} /> },
            { id: 'projects', label: '3. Проекты', icon: <Briefcase size={14} /> },
            { id: 'products', label: '4. Продукты', icon: <Settings size={14} /> },
            { id: 'modules', label: '5. Модули', icon: <Code size={14} /> },
            { id: 'project_groups', label: '6. Группы проектов', icon: <FolderOpen size={14} /> },
            { id: 'kinds', label: '7. Виды задач', icon: <Tag size={14} /> },
            { id: 'types', label: '8. Типы задач', icon: <Settings size={14} /> },
            { id: 'stages', label: '9. Этапы проектов', icon: <Layers size={14} /> },
            { id: 'users', label: '11. Пользователи', icon: <UserCheck size={14} /> },
            { id: 'roles', label: '12. Роли', icon: <ShieldAlert size={14} /> },
            { id: 'sources', label: 'Источники сигналов', icon: <FolderOpen size={14} /> },
            { id: 'gitlab', label: 'Интеграция с GitLab', icon: <GitBranch size={14} /> },
            { id: 'priority_formula', label: '⚙️ Настройка приоритетов', icon: <Settings size={14} /> },
          ].map((subTab) => (
            <button
              key={subTab.id}
              onClick={() => setActiveSubTab(subTab.id as any)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === subTab.id
                  ? 'bg-[#21262d] text-white border border-[#30363d]'
                  : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
              }`}
            >
              {subTab.icon}
              <span>{subTab.label}</span>
            </button>
          ))}
        </aside>

        {/* DETAILS PANEL WITH CRUD */}
        <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-xl p-6 overflow-hidden">

          {/* EPICS LIST */}
          {activeSubTab === 'epics' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-white">Список Эпиков (Strategic Epics)</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!epicTitle.trim()) return;
                  store.addEpic({ title: epicTitle, description: epicDesc, owner: epicOwner || 'Не назначен' });
                  setEpicTitle(''); setEpicDesc(''); setEpicOwner('');
                }}
                className="grid grid-cols-1 gap-3 p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs"
              >
                <span className="font-semibold text-white block mb-1">Добавить новый Эпик</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#8b949e] mb-1">Название Эпика:</label>
                    <input
                      type="text" required value={epicTitle} onChange={(e) => setEpicTitle(e.target.value)}
                      placeholder="Личный Кабинет 2.0" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8b949e] mb-1">Lead Product Manager:</label>
                    <input
                      type="text" value={epicOwner} onChange={(e) => setEpicOwner(e.target.value)}
                      placeholder="Светлана Савина" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[#8b949e] mb-1">Описание стратегического модуля:</label>
                    <input
                      type="text" value={epicDesc} onChange={(e) => setEpicDesc(e.target.value)}
                      placeholder="Опишите цель модуля..." className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white">
                    <Plus size={14} /> Создать Эпик
                  </button>
                </div>
              </form>
              <div className="space-y-2">
                {store.epics.map((e: Epic) => (
                  <div key={e.id} className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#388bfd]/10 text-[#58a6ff]">{e.code}</span>
                        <strong className="text-white text-xs">{e.title}</strong>
                      </div>
                      <p className="text-[11px] text-[#8b949e] mt-1">{e.description}</p>
                      <span className="text-[10px] text-[#8b949e] block mt-1">PM: {e.owner}</span>
                    </div>
                    <button onClick={() => store.deleteEpic(e.id)} className="p-1.5 text-[#8b949e] hover:text-red-400 hover:bg-[#21262d] rounded"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 1. CLIENTS */}
          {activeSubTab === 'clients' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">1. Справочник клиентов</h3>
                <button
                  type="button"
                  onClick={() => {
                    const imported = store.importClientsFromGitLab();
                    alert(`Импорт из GitLab успешно завершен!\nИмпортировано:\n${imported.join('\n')}`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded transition-all"
                >
                  <GitBranch size={13} /> Импортировать из GitLab
                </button>
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
                      <button onClick={() => store.deleteClient(c.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. ACTIVITY KINDS */}
          {activeSubTab === 'activity_kinds' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">2. Виды деятельности</h3>
                <button
                  type="button"
                  onClick={() => {
                    const imported = store.importActivityKindsFromGitLab();
                    alert(`Импорт из GitLab успешно завершен!\nИмпортировано:\n${imported.join('\n')}`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded transition-all"
                >
                  <GitBranch size={13} /> Импортировать из GitLab
                </button>
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
                    <button onClick={() => store.deleteActivityKind(ak.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. PROJECTS */}
          {activeSubTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">3. Проекты развития (с автоконструктором)</h3>
                <button
                  type="button"
                  onClick={() => {
                    const imported = store.importProjectsFromGitLab();
                    alert(`Импорт из GitLab успешно завершен!\nИмпортировано:\n${imported.join('\n')}`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded transition-all"
                >
                  <GitBranch size={13} /> Импортировать из GitLab
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!projGroupId || !projClientId || !projProdId || !projModId || !projGitlabUrl.trim()) return;
                  store.addProject({
                    name: projName.trim(),
                    projectGroupId: projGroupId,
                    clientId: projClientId,
                    productId: projProdId,
                    moduleId: projModId,
                    gitlabUrl: projGitlabUrl.trim()
                  });
                  setProjName(''); setProjGroupId(''); setProjClientId(''); setProjProdId(''); setProjModId(''); setProjGitlabUrl('');
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование (необязательно, если пусто то "Клиент + Модуль"):</label>
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
                <div>
                  <label className="block text-[#8b949e] mb-1">Модуль:</label>
                  <select required value={projModId} onChange={(e) => setProjModId(e.target.value)} className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white">
                    <option value="">-- Выберите модуль --</option>
                    {store.modules.map((m: Module) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white">
                    <Plus size={14} /> Создать проект
                  </button>
                </div>
              </form>
              <div className="space-y-2">
                {store.projects.map((p: Project) => {
                  const constructedName = store.getProjectName(p);
                  return (
                    <div key={p.id} className="p-3 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white">{constructedName}</strong>
                        {p.name === '' && <span className="text-[10px] text-amber-500 ml-2">(Авто-конструктор)</span>}
                        <div className="text-[10px] text-[#8b949e] mt-1 font-mono">
                          GitLab: {p.gitlabUrl}
                        </div>
                      </div>
                      <button onClick={() => store.deleteProject(p.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. PRODUCTS */}
          {activeSubTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">4. Продукты</h3>
                <button
                  type="button"
                  onClick={() => {
                    const imported = store.importProductsFromGitLab();
                    alert(`Импорт из GitLab успешно завершен!\nИмпортировано:\n${imported.join('\n')}`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded transition-all"
                >
                  <GitBranch size={13} /> Импортировать из GitLab
                </button>
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
                    <button onClick={() => store.deleteProduct(p.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. MODULES */}
          {activeSubTab === 'modules' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">5. Модули системы</h3>
                <button
                  type="button"
                  onClick={() => {
                    const imported = store.importModulesFromGitLab();
                    alert(`Импорт из GitLab успешно завершен!\nИмпортировано:\n${imported.join('\n')}`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded transition-all"
                >
                  <GitBranch size={13} /> Импортировать из GitLab
                </button>
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
                  <label className="block text-[#8b949e] mb-1">GitLab Label:</label>
                  <input
                    type="text" required value={modLabel} onChange={(e) => setModLabel(e.target.value)}
                    placeholder="module::client-bank" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
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
                    <button onClick={() => store.deleteModule(m.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. PROJECT GROUPS */}
          {activeSubTab === 'project_groups' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">6. Группы проектов</h3>
                <button
                  type="button"
                  onClick={() => {
                    const imported = store.importProjectGroupsFromGitLab();
                    alert(`Импорт из GitLab успешно завершен!\nИмпортировано:\n${imported.join('\n')}`);
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
                    <button onClick={() => store.deleteProjectGroup(g.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. TASK KINDS */}
          {activeSubTab === 'kinds' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">7. Виды задач</h3>
                <button
                  type="button"
                  onClick={() => {
                    const imported = store.importTaskKindsFromGitLab();
                    alert(`Импорт из GitLab успешно завершен!\nИмпортировано:\n${imported.join('\n')}`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded transition-all"
                >
                  <GitBranch size={13} /> Импортировать из GitLab
                </button>
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
                  <label className="block text-[#8b949e] mb-1">GitLab Label:</label>
                  <input
                    type="text" required value={kindLabel} onChange={(e) => setKindLabel(e.target.value)}
                    placeholder="bug" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
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
                    <button onClick={() => store.deleteTaskKind(k.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. TASK TYPES */}
          {activeSubTab === 'types' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">8. Типы задач</h3>
                <button
                  type="button"
                  onClick={() => {
                    const imported = store.importTaskTypesFromGitLab();
                    alert(`Импорт из GitLab успешно завершен!\nИмпортировано:\n${imported.join('\n')}`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded transition-all"
                >
                  <GitBranch size={13} /> Импортировать из GitLab
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!typeName.trim() || !typeLabel.trim()) return;
                  store.addTaskType(typeName, typeLabel);
                  setTypeName(''); setTypeLabel('');
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs"
              >
                <div>
                  <label className="block text-[#8b949e] mb-1">Наименование:</label>
                  <input
                    type="text" required value={typeName} onChange={(e) => setTypeName(e.target.value)}
                    placeholder="Интеграционный сбой" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1">GitLab Label:</label>
                  <input
                    type="text" required value={typeLabel} onChange={(e) => setTypeLabel(e.target.value)}
                    placeholder="type::integration" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white">
                    <Plus size={14} /> Добавить тип задач
                  </button>
                </div>
              </form>
              <div className="space-y-2">
                {store.taskTypes.map((t: TaskType) => (
                  <div key={t.id} className="p-3 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between text-xs font-mono">
                    <div>
                      <strong className="text-white">{t.name}</strong>
                      <span className="text-[10px] text-[#58a6ff] block">GitLab Label: {t.gitlabLabel}</span>
                    </div>
                    <button onClick={() => store.deleteTaskType(t.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. PROJECT STAGES */}
          {activeSubTab === 'stages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">9. Этапы проектов</h3>
                <button
                  type="button"
                  onClick={() => {
                    const imported = store.importProjectStagesFromGitLab();
                    alert(`Импорт из GitLab успешно завершен!\nИмпортировано:\n${imported.join('\n')}`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded transition-all"
                >
                  <GitBranch size={13} /> Импортировать из GitLab
                </button>
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
                  <label className="block text-[#8b949e] mb-1">GitLab Label:</label>
                  <input
                    type="text" required value={stageLabel} onChange={(e) => setStageLabel(e.target.value)}
                    placeholder="stage::analysis" className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  />
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
                    <button onClick={() => store.deleteProjectStage(s.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. USERS */}
          {activeSubTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h3 className="text-sm font-semibold text-white">11. Пользователи</h3>
                <button
                  type="button"
                  onClick={() => {
                    const imported = store.importUsersFromGitLab();
                    alert(`Импорт из GitLab успешно завершен!\nИмпортировано:\n${imported.join('\n')}`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded transition-all"
                >
                  <GitBranch size={13} /> Импортировать из GitLab
                </button>
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
                      <button onClick={() => store.deleteUser(u.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. ROLES (READ ONLY) */}
          {activeSubTab === 'roles' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">12. Роли в системе</h3>
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

          {/* SOURCES */}
          {activeSubTab === 'sources' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-white">Справочник источников поступления</h3>
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
                    <button onClick={() => store.deleteSource(s.id)} className="text-[#8b949e] hover:text-red-400"><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

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

                <div className="flex justify-end pt-3 border-t border-[#30363d]">
                  <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white font-bold rounded-lg shadow-md transition-all">
                    <Save size={15} /> Сохранить настройки GitLab
                  </button>
                </div>
              </form>
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

              {/* 2. RELEASE EFFORT DICTIONARY (Сложность переноса в релиз) */}
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
    </div>
  );
}
