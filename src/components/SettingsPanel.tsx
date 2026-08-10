'use client';

import React, { useState } from 'react';
import { Epic, DictionaryItem } from '@/store/index';
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
  HelpCircle
} from 'lucide-react';

interface SettingsPanelProps {
  store: any;
}

export default function SettingsPanel({ store }: SettingsPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'epics' | 'clients' | 'projects' | 'subsystems' | 'kinds' | 'types' | 'sources' | 'gitlab'>('epics');

  // Input states for item additions
  const [epicTitle, setEpicTitle] = useState('');
  const [epicDesc, setEpicDesc] = useState('');
  const [epicOwner, setEpicOwner] = useState('');

  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [subsystemName, setSubsystemName] = useState('');
  const [kindName, setKindName] = useState('');
  const [typeName, setTypeName] = useState('');
  const [sourceName, setSourceName] = useState('');

  // GitLab Settings States
  const [serverUrl, setServerUrl] = useState(store.gitLabSettings?.serverUrl || 'https://gitlab.corp.ru');
  const [personalAccessToken, setPersonalAccessToken] = useState(store.gitLabSettings?.personalAccessToken || '');
  const [projectPath, setProjectPath] = useState(store.gitLabSettings?.projectPath || '');
  const [mappedProjectId, setMappedProjectId] = useState(store.gitLabSettings?.mappedProjectId || '');
  const [mappedTaskKindId, setMappedTaskKindId] = useState(store.gitLabSettings?.mappedTaskKindId || '');
  const [mappedTaskTypeId, setMappedTaskTypeId] = useState(store.gitLabSettings?.mappedTaskTypeId || '');

  // Custom Labels Mapping Editor States
  const [newLabelKey, setNewLabelKey] = useState('');
  const [newLabelKind, setNewLabelKind] = useState('');
  const [newLabelType, setNewLabelType] = useState('');

  const [labelToKind, setLabelToKind] = useState<Record<string, string>>(store.gitLabSettings?.labelToKindMappings || {});
  const [labelToType, setLabelToType] = useState<Record<string, string>>(store.gitLabSettings?.labelToTypeMappings || {});

  const handleSaveGitLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectPath.trim()) {
      alert('Ошибка! Путь к проекту GitLab является обязательным параметром.');
      return;
    }
    store.updateGitLabSettings({
      serverUrl,
      personalAccessToken,
      projectPath: projectPath.trim(),
      mappedProjectId,
      mappedTaskKindId,
      mappedTaskTypeId,
      labelToKindMappings: labelToKind,
      labelToTypeMappings: labelToType
    });
    alert('Настройки интеграции с GitLab успешно сохранены!');
  };

  const handleAddLabelMapping = () => {
    if (!newLabelKey.trim()) return;
    const cleanKey = newLabelKey.trim().toLowerCase();

    if (newLabelKind) {
      setLabelToKind(prev => ({ ...prev, [cleanKey]: newLabelKind }));
    }
    if (newLabelType) {
      setLabelToType(prev => ({ ...prev, [cleanKey]: newLabelType }));
    }

    setNewLabelKey('');
    setNewLabelKind('');
    setNewLabelType('');
  };

  const handleRemoveLabelMapping = (label: string, type: 'kind' | 'type') => {
    if (type === 'kind') {
      const copy = { ...labelToKind };
      delete copy[label];
      setLabelToKind(copy);
    } else {
      const copy = { ...labelToType };
      delete copy[label];
      setLabelToType(copy);
    }
  };

  // Submit epic
  const handleAddEpic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!epicTitle.trim()) return;
    store.addEpic({
      title: epicTitle,
      description: epicDesc,
      owner: epicOwner || 'Не назначен'
    });
    setEpicTitle('');
    setEpicDesc('');
    setEpicOwner('');
  };

  // Submit generic dict
  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;
    store.addClient(clientName);
    setClientName('');
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    store.addProject(projectName);
    setProjectName('');
  };

  const handleAddSubsystem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subsystemName.trim()) return;
    store.addSubsystem(subsystemName);
    setSubsystemName('');
  };

  const handleAddTaskKind = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kindName.trim()) return;
    store.addTaskKind(kindName);
    setKindName('');
  };

  const handleAddTaskType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeName.trim()) return;
    store.addTaskType(typeName);
    setTypeName('');
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceName.trim()) return;
    store.addSource(sourceName);
    setSourceName('');
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-white">Панель администрирования справочников</h2>
          <p className="text-xs text-[#8b949e]">
            Добавление и редактирование основных классификаторов, необходимых для сквозного контроля и валидации входящих задач.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* SUBTAB BAR */}
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          <button
            onClick={() => setActiveSubTab('epics')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'epics'
                ? 'bg-[#21262d] text-white border border-[#30363d]'
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
            }`}
          >
            <Layers size={14} />
            <span>Эпики (Стратегические модули)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('clients')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'clients'
                ? 'bg-[#21262d] text-white border border-[#30363d]'
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
            }`}
          >
            <Users size={14} />
            <span>Клиенты (Enterprise B2B)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('projects')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'projects'
                ? 'bg-[#21262d] text-white border border-[#30363d]'
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
            }`}
          >
            <Briefcase size={14} />
            <span>Проекты развития</span>
          </button>

          <button
            onClick={() => setActiveSubTab('subsystems')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'subsystems'
                ? 'bg-[#21262d] text-white border border-[#30363d]'
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
            }`}
          >
            <Code size={14} />
            <span>ИТ-Подсистемы</span>
          </button>

          <button
            onClick={() => setActiveSubTab('kinds')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'kinds'
                ? 'bg-[#21262d] text-white border border-[#30363d]'
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
            }`}
          >
            <Tag size={14} />
            <span>Виды задач</span>
          </button>

          <button
            onClick={() => setActiveSubTab('types')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'types'
                ? 'bg-[#21262d] text-white border border-[#30363d]'
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
            }`}
          >
            <Settings size={14} />
            <span>Типы задач</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sources')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'sources'
                ? 'bg-[#21262d] text-white border border-[#30363d]'
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
            }`}
          >
            <FolderOpen size={14} />
            <span>Источники поступления</span>
          </button>

          <button
            onClick={() => setActiveSubTab('gitlab')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'gitlab'
                ? 'bg-[#21262d] text-white border border-[#30363d]'
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]'
            }`}
          >
            <GitBranch size={14} />
            <span>Интеграция с GitLab</span>
          </button>
        </aside>

        {/* DETAILS PANEL WITH CRUD PANEL */}
        <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          {/* 1. EPICS LIST */}
          {activeSubTab === 'epics' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-white">Список Эпиков (Strategic Epics)</h3>
              <form onSubmit={handleAddEpic} className="grid grid-cols-1 gap-3 p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs">
                <span className="font-semibold text-white block mb-1">Добавить новый Эпик</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#8b949e] mb-1">Название Эпика:</label>
                    <input
                      type="text"
                      required
                      value={epicTitle}
                      onChange={(e) => setEpicTitle(e.target.value)}
                      placeholder="Напр: Личный Кабинет 2.0"
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8b949e] mb-1">Lead Product Manager:</label>
                    <input
                      type="text"
                      value={epicOwner}
                      onChange={(e) => setEpicOwner(e.target.value)}
                      placeholder="Напр: Светлана Савина"
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[#8b949e] mb-1">Описание стратегического модуля:</label>
                    <input
                      type="text"
                      value={epicDesc}
                      onChange={(e) => setEpicDesc(e.target.value)}
                      placeholder="Опишите цель и влияние модуля на ИТС/продажи..."
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
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
                    <button
                      onClick={() => store.deleteEpic(e.id)}
                      className="p-1.5 text-[#8b949e] hover:text-red-400 hover:bg-[#21262d] rounded transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. CLIENTS */}
          {activeSubTab === 'clients' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-white">Справочник клиентов (B2B Clients)</h3>
              <form onSubmit={handleAddClient} className="flex gap-2 text-xs">
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Добавить нового клиента..."
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-white focus:outline-none"
                />
                <button type="submit" className="flex items-center gap-1 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded">
                  <Plus size={14} /> Добавить
                </button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {store.clients.map((c: DictionaryItem) => (
                  <div key={c.id} className="p-2 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                    <span className="text-white">{c.name}</span>
                    <button onClick={() => store.deleteClient(c.id)} className="text-[#8b949e] hover:text-red-400">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. PROJECTS */}
          {activeSubTab === 'projects' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-white">Справочник проектов развития (Projects)</h3>
              <form onSubmit={handleAddProject} className="flex gap-2 text-xs">
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Добавить новый проект..."
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-white focus:outline-none"
                />
                <button type="submit" className="flex items-center gap-1 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded">
                  <Plus size={14} /> Добавить
                </button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {store.projects.map((p: DictionaryItem) => (
                  <div key={p.id} className="p-2 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                    <span className="text-white">{p.name}</span>
                    <button onClick={() => store.deleteProject(p.id)} className="text-[#8b949e] hover:text-red-400">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SUBSYSTEMS */}
          {activeSubTab === 'subsystems' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-white">Справочник ИТ-Подсистем (Subsystems)</h3>
              <form onSubmit={handleAddSubsystem} className="flex gap-2 text-xs">
                <input
                  type="text"
                  required
                  value={subsystemName}
                  onChange={(e) => setSubsystemName(e.target.value)}
                  placeholder="Добавить новую ИТ-подсистему..."
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-white focus:outline-none"
                />
                <button type="submit" className="flex items-center gap-1 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded">
                  <Plus size={14} /> Добавить
                </button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {store.subsystems.map((s: DictionaryItem) => (
                  <div key={s.id} className="p-2 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                    <span className="text-white">{s.name}</span>
                    <button onClick={() => store.deleteSubsystem(s.id)} className="text-[#8b949e] hover:text-red-400">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. KINDS */}
          {activeSubTab === 'kinds' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-white">Справочник видов задач (Task Kinds)</h3>
              <form onSubmit={handleAddTaskKind} className="flex gap-2 text-xs">
                <input
                  type="text"
                  required
                  value={kindName}
                  onChange={(e) => setKindName(e.target.value)}
                  placeholder="Добавить новый вид задачи..."
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-white focus:outline-none"
                />
                <button type="submit" className="flex items-center gap-1 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded">
                  <Plus size={14} /> Добавить
                </button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {store.taskKinds.map((k: DictionaryItem) => (
                  <div key={k.id} className="p-2 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                    <span className="text-white">{k.name}</span>
                    <button onClick={() => store.deleteTaskKind(k.id)} className="text-[#8b949e] hover:text-red-400">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. TYPES */}
          {activeSubTab === 'types' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-white">Справочник типов задач (Task Types)</h3>
              <form onSubmit={handleAddTaskType} className="flex gap-2 text-xs">
                <input
                  type="text"
                  required
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  placeholder="Добавить новый тип задачи..."
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-white focus:outline-none"
                />
                <button type="submit" className="flex items-center gap-1 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded">
                  <Plus size={14} /> Добавить
                </button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {store.taskTypes.map((t: DictionaryItem) => (
                  <div key={t.id} className="p-2 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                    <span className="text-white">{t.name}</span>
                    <button onClick={() => store.deleteTaskType(t.id)} className="text-[#8b949e] hover:text-red-400">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. SOURCES */}
          {activeSubTab === 'sources' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-white">Справочник источников поступления (Sources)</h3>
              <form onSubmit={handleAddSource} className="flex gap-2 text-xs">
                <input
                  type="text"
                  required
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="Добавить новый источник (напр: Интервью, Проектный GitLab, Обращение)..."
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-white focus:outline-none"
                />
                <button type="submit" className="flex items-center gap-1 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded">
                  <Plus size={14} /> Добавить
                </button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {store.sources.map((s: DictionaryItem) => (
                  <div key={s.id} className="p-2 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                    <span className="text-white">{s.name}</span>
                    <button onClick={() => store.deleteSource(s.id)} className="text-[#8b949e] hover:text-red-400">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. GITLAB INTEGRATION */}
          {activeSubTab === 'gitlab' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">Интеграция с GitLab и Маппинг Проектов</h3>
                <p className="text-xs text-[#8b949e]">
                  Настройте автоматическое сопоставление путей репозиториев и ярлыков (Labels) для автоматической разметки импортируемых GitLab-задач в качестве Requests.
                </p>
              </div>

              <form onSubmit={handleSaveGitLab} className="space-y-4 text-xs">
                {/* Connection Settings */}
                <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d] space-y-3">
                  <span className="font-semibold text-white block">1. Параметры авторизации GitLab API</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#8b949e] mb-1">GitLab API Server URL:</label>
                      <input
                        type="url"
                        required
                        value={serverUrl}
                        onChange={(e) => setServerUrl(e.target.value)}
                        placeholder="https://gitlab.corp.ru"
                        className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#8b949e] mb-1">Personal Access Token (PAT):</label>
                      <input
                        type="password"
                        required
                        value={personalAccessToken}
                        onChange={(e) => setPersonalAccessToken(e.target.value)}
                        placeholder="glpat-********************"
                        className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Scope Path & Project Mapping */}
                <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d] space-y-3">
                  <span className="font-semibold text-white block">2. Сопоставление путей проектов (Project Path Mapping)</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#c9d1d9] mb-1 font-semibold">Путь к проекту в GitLab (Обязательно):</label>
                      <input
                        type="text"
                        required
                        value={projectPath}
                        onChange={(e) => setProjectPath(e.target.value)}
                        placeholder="Напр: core/payments или enterprise/its-service"
                        className="w-full bg-[#161b22] border border-amber-600/50 rounded p-1.5 text-white focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[#8b949e] mb-1">Локальный проект для сопоставления:</label>
                      <select
                        required
                        value={mappedProjectId}
                        onChange={(e) => setMappedProjectId(e.target.value)}
                        className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                      >
                        <option value="">-- Выберите локальный проект --</option>
                        {store.projects.map((p: DictionaryItem) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Default Fallbacks */}
                <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d] space-y-3">
                  <span className="font-semibold text-white block">3. Классификация по умолчанию (Fallbacks)</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#8b949e] mb-1">Вид задачи по умолчанию:</label>
                      <select
                        required
                        value={mappedTaskKindId}
                        onChange={(e) => setMappedTaskKindId(e.target.value)}
                        className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                      >
                        {store.taskKinds.map((k: DictionaryItem) => (
                          <option key={k.id} value={k.id}>{k.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#8b949e] mb-1">Тип задачи по умолчанию:</label>
                      <select
                        required
                        value={mappedTaskTypeId}
                        onChange={(e) => setMappedTaskTypeId(e.target.value)}
                        className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                      >
                        {store.taskTypes.map((t: DictionaryItem) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Label Mapping Engine */}
                <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d] space-y-4">
                  <div>
                    <span className="font-semibold text-white block">4. Сопоставление ярлыков GitLab (Label Mapper Engine)</span>
                    <p className="text-[11px] text-[#8b949e] mt-0.5">
                      Правила разбора ярлыков из GitLab API для автоматического определения Вида и Типа задачи при импорте.
                    </p>
                  </div>

                  {/* Add Mapping Controls */}
                  <div className="p-3 bg-[#161b22] rounded border border-[#30363d] space-y-2.5">
                    <span className="font-semibold text-white text-[11px] block">Добавить правило сопоставления</span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
                      <div className="sm:col-span-1">
                        <label className="text-[#8b949e] block mb-1">Ярлык (Label):</label>
                        <input
                          type="text"
                          value={newLabelKey}
                          onChange={(e) => setNewLabelKey(e.target.value)}
                          placeholder="bug"
                          className="w-full bg-[#0d1117] border border-[#30363d] rounded p-1 text-white font-mono"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="text-[#8b949e] block mb-1">Вид задачи:</label>
                        <select
                          value={newLabelKind}
                          onChange={(e) => setNewLabelKind(e.target.value)}
                          className="w-full bg-[#0d1117] border border-[#30363d] rounded p-1 text-white"
                        >
                          <option value="">-- Пропустить --</option>
                          {store.taskKinds.map((k: DictionaryItem) => (
                            <option key={k.id} value={k.id}>{k.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-1">
                        <label className="text-[#8b949e] block mb-1">Тип задачи:</label>
                        <select
                          value={newLabelType}
                          onChange={(e) => setNewLabelType(e.target.value)}
                          className="w-full bg-[#0d1117] border border-[#30363d] rounded p-1 text-white"
                        >
                          <option value="">-- Пропустить --</option>
                          {store.taskTypes.map((t: DictionaryItem) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddLabelMapping}
                        className="py-1 px-3 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-[28px] transition-all flex items-center justify-center gap-1"
                      >
                        <Plus size={14} /> Добавить
                      </button>
                    </div>
                  </div>

                  {/* Active Mappings Lists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Kind Maps */}
                    <div className="space-y-1.5">
                      <span className="text-[#8b949e] font-semibold text-[11px] block">Ярлыки ➔ Виды задач</span>
                      <div className="space-y-1 max-h-36 overflow-y-auto bg-[#161b22]/50 p-2 rounded border border-[#30363d]/60">
                        {Object.entries(labelToKind).length === 0 ? (
                          <div className="text-[#8b949e] italic text-[11px] p-2">Нет правил сопоставления видов</div>
                        ) : (
                          Object.entries(labelToKind).map(([lbl, kindId]) => {
                            const kindObj = store.taskKinds.find((k: DictionaryItem) => k.id === kindId);
                            return (
                              <div key={lbl} className="flex items-center justify-between bg-[#0d1117] px-2 py-1 rounded border border-[#30363d]/50 text-[11px]">
                                <span className="font-mono text-indigo-400 bg-indigo-950/40 px-1.5 rounded">{lbl}</span>
                                <span className="text-[#8b949e]">➔</span>
                                <span className="text-white font-medium">{kindObj ? kindObj.name : 'Unknown'}</span>
                                <button type="button" onClick={() => handleRemoveLabelMapping(lbl, 'kind')} className="text-red-400 hover:text-red-300">✕</button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Type Maps */}
                    <div className="space-y-1.5">
                      <span className="text-[#8b949e] font-semibold text-[11px] block">Ярлыки ➔ Типы задач</span>
                      <div className="space-y-1 max-h-36 overflow-y-auto bg-[#161b22]/50 p-2 rounded border border-[#30363d]/60">
                        {Object.entries(labelToType).length === 0 ? (
                          <div className="text-[#8b949e] italic text-[11px] p-2">Нет правил сопоставления типов</div>
                        ) : (
                          Object.entries(labelToType).map(([lbl, typeId]) => {
                            const typeObj = store.taskTypes.find((t: DictionaryItem) => t.id === typeId);
                            return (
                              <div key={lbl} className="flex items-center justify-between bg-[#0d1117] px-2 py-1 rounded border border-[#30363d]/50 text-[11px]">
                                <span className="font-mono text-green-400 bg-green-950/40 px-1.5 rounded">{lbl}</span>
                                <span className="text-[#8b949e]">➔</span>
                                <span className="text-white font-medium">{typeObj ? typeObj.name : 'Unknown'}</span>
                                <button type="button" onClick={() => handleRemoveLabelMapping(lbl, 'type')} className="text-red-400 hover:text-red-300">✕</button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-3 border-t border-[#30363d]">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white font-bold rounded-lg shadow-md transition-all"
                  >
                    <Save size={15} />
                    Сохранить настройки GitLab
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
