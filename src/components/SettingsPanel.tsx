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
  Code
} from 'lucide-react';

interface SettingsPanelProps {
  store: any;
}

export default function SettingsPanel({ store }: SettingsPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'epics' | 'clients' | 'projects' | 'subsystems' | 'kinds' | 'types' | 'sources'>('epics');

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
        </div>
      </div>
    </div>
  );
}
