'use client';

import React, { useState } from 'react';
import {
  Epic,
  Initiative,
  Feature,
  Task,
} from '@/store/index';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  GitBranch,
  ShieldAlert,
  Edit2,
  Settings,
} from 'lucide-react';

interface BacklogPanelProps {
  store: any;
  searchQuery: string;
}

export default function BacklogPanel({ store, searchQuery }: BacklogPanelProps) {
  // Collapsed states for Tree View
  const [collapsedEpics, setCollapsedEpics] = useState<Record<string, boolean>>({});
  const [collapsedInits, setCollapsedInits] = useState<Record<string, boolean>>({});

  // Drawers & Modals state
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Form states
  const [selectedFeatureForOverride, setSelectedFeatureForOverride] = useState<Feature | null>(null);
  const [overrideScoreValue, setOverrideScoreValue] = useState<string>('');
  const [overrideReasonValue, setOverrideReasonValue] = useState<string>('');

  const [selectedFeatureForTask, setSelectedFeatureForTask] = useState<Feature | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDeveloper, setNewTaskDeveloper] = useState('');
  const [newTaskSP, setNewTaskSP] = useState(3);

  const [newFeatTitle, setNewFeatTitle] = useState('');
  const [newFeatDesc, setNewFeatDesc] = useState('');
  const [newFeatInitId, setNewFeatInitId] = useState('');
  const [newFeatHours, setNewFeatHours] = useState(40);
  const [newFeatSP, setNewFeatSP] = useState(5);
  const [newFeatSalesImpact, setNewFeatSalesImpact] = useState<1|2|3|4|5>(3);
  const [newFeatItsPriority, setNewFeatItsPriority] = useState<1|2|3|4|5>(3);

  // Quick toggle expand/collapse
  const toggleEpic = (id: string) => {
    setCollapsedEpics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleInit = (id: string) => {
    setCollapsedInits((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // PM Override Submit
  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeatureForOverride) return;
    if (!overrideReasonValue.trim()) {
      alert('Пожалуйста, укажите обязательную причину переопределения оценки для аудита!');
      return;
    }
    const scoreNum = overrideScoreValue ? parseInt(overrideScoreValue) : undefined;
    store.overrideFeatureScore(selectedFeatureForOverride.id, scoreNum, overrideReasonValue);

    // reset states
    setSelectedFeatureForOverride(null);
    setOverrideScoreValue('');
    setOverrideReasonValue('');
    setIsOverrideModalOpen(false);
  };

  // Add Task Submit
  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeatureForTask) return;
    if (!newTaskTitle.trim()) return;

    store.addTask({
      featureId: selectedFeatureForTask.id,
      title: newTaskTitle,
      status: 'To Do',
      developer: newTaskDeveloper || 'Не назначен',
      sp: newTaskSP,
    });

    setNewTaskTitle('');
    setNewTaskDeveloper('');
    setNewTaskSP(3);
    setSelectedFeatureForTask(null);
    setIsTaskModalOpen(false);
  };

  // Add Feature Submit
  const handleFeatureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatTitle.trim() || !newFeatInitId) return;

    store.addFeature({
      initiativeId: newFeatInitId,
      title: newFeatTitle,
      description: newFeatDesc,
      effortHours: Number(newFeatHours),
      effortSP: Number(newFeatSP),
      repeatabilityCount: 1, // default
      salesImpact: newFeatSalesImpact,
      itsPriority: newFeatItsPriority,
      releaseId: null,
    });

    setNewFeatTitle('');
    setNewFeatDesc('');
    setIsFeatureModalOpen(false);
  };

  // Filter logic helper
  const matchesSearch = (text: string) => {
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="space-y-6">
      {/* ACTION HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-white">Инструменты управления бэклогом</h2>
          <p className="text-xs text-[#8b949e]">Иерархия Epic ➔ Initiative ➔ Feature ➔ Task. Авто-приоритет рассчитывается по сигналам из ИТС/GitLab.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (store.initiatives.length > 0) {
                setNewFeatInitId(store.initiatives[0].id);
              }
              setIsFeatureModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white font-medium transition-all text-xs"
          >
            <Plus size={16} />
            Создать Фичу
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* FULL TREE VIEW */}
        <div className="space-y-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-[#21262d] border-b border-[#30363d] flex items-center justify-between">
              <span className="font-semibold text-white">Дерево продуктовых требований</span>
              <span className="text-xs text-[#8b949e]">Иерархический Enterprise-вид</span>
            </div>

            <div className="p-4 space-y-3">
              {store.epics.map((epic: Epic) => {
                const epicInits = store.initiatives.filter((i: Initiative) => i.epicId === epic.id);
                const isEpicCollapsed = collapsedEpics[epic.id];

                return (
                  <div key={epic.id} className="border border-[#30363d] rounded-lg bg-[#0d1117]/30 overflow-hidden">
                    {/* Epic Header */}
                    <div className="p-3 bg-[#161b22]/90 flex items-center justify-between hover:bg-[#21262d]/40 transition-all">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleEpic(epic.id)} className="text-[#8b949e] hover:text-white">
                          {isEpicCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                        </button>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#388bfd]/10 text-[#58a6ff] border border-[#388bfd]/20">
                          {epic.code}
                        </span>
                        <h3 className="font-semibold text-white">{epic.title}</h3>
                      </div>
                      <div className="text-xs text-[#8b949e]">
                        Владелец: <span className="text-[#c9d1d9]">{epic.owner}</span>
                      </div>
                    </div>

                    {/* Epic Children (Initiatives) */}
                    {!isEpicCollapsed && (
                      <div className="p-3 space-y-3 border-t border-[#30363d] bg-[#0d1117]/20">
                        {epicInits.map((init: Initiative) => {
                          const initFeatures = store.features.filter((f: Feature) => f.initiativeId === init.id);
                          const isInitCollapsed = collapsedInits[init.id];

                          return (
                            <div key={init.id} className="border border-[#30363d]/70 rounded bg-[#161b22]/30 overflow-hidden ml-2">
                              {/* Initiative Header */}
                              <div className="p-2.5 bg-[#21262d]/20 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <button onClick={() => toggleInit(init.id)} className="text-[#8b949e] hover:text-white">
                                    {isInitCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                                  </button>
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-900/20 text-purple-400 border border-purple-800/30">
                                    {init.code}
                                  </span>
                                  <h4 className="font-medium text-[#c9d1d9]">{init.title}</h4>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-yellow-950/40 text-yellow-500 border border-yellow-800/30">
                                  {init.status}
                                </span>
                              </div>

                              {/* Initiative Children (Features) */}
                              {!isInitCollapsed && (
                                <div className="p-2 space-y-2.5 border-t border-[#30363d]/40 bg-[#0d1117]/50 ml-4">
                                  {initFeatures.length === 0 ? (
                                    <p className="text-xs text-[#8b949e] italic p-2">Нет привязанных фич.</p>
                                  ) : (
                                    initFeatures.map((feat: Feature) => {
                                      const featureTasks = store.tasks.filter((t: Task) => t.featureId === feat.id);
                                      const currentScore = feat.overrideScore !== undefined ? feat.overrideScore : feat.autoScore;
                                      const isOverridden = feat.overrideScore !== undefined;

                                      return (
                                        <div key={feat.id} className="p-3 rounded-md bg-[#161b22] border border-[#30363d] space-y-3">
                                          {/* Feature Header */}
                                          <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div className="space-y-1">
                                              <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#238636]/20 text-[#2ea043] border border-[#238636]/30">
                                                  {feat.code}
                                                </span>
                                                <h5 className="font-semibold text-white">{feat.title}</h5>
                                                {feat.releaseId && (
                                                  <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${feat.releaseId === 'rel-draft' ? 'bg-[#1f6feb]/10 text-[#58a6ff] border-[#1f6feb]/30' : 'bg-green-950 text-green-400 border-green-800/40'}`}>
                                                    {feat.releaseId === 'rel-draft' ? 'В ЧЕРНОВИКЕ РЕЛИЗА' : 'ВЫПУЩЕН В РЕЛИЗ'}
                                                  </span>
                                                )}
                                              </div>
                                              <p className="text-xs text-[#8b949e]">{feat.description}</p>
                                            </div>

                                            {/* Priority Calculations Board */}
                                            <div className="flex items-center gap-2.5 bg-[#0d1117] p-2 rounded-lg border border-[#30363d]">
                                              <div className="text-center px-1.5">
                                                <span className="text-[9px] text-[#8b949e] block font-mono">AUTO SCORE</span>
                                                <strong className="text-xs text-white font-mono">{feat.autoScore}</strong>
                                              </div>
                                              <div className="text-center border-l border-[#30363d] px-1.5">
                                                <span className="text-[9px] text-[#8b949e] block font-mono">OVERRIDE</span>
                                                {isOverridden ? (
                                                  <strong className="text-xs text-yellow-500 font-mono flex items-center gap-0.5">
                                                    {feat.overrideScore}
                                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                                                  </strong>
                                                ) : (
                                                  <span className="text-[10px] text-[#8b949e] italic font-mono">—</span>
                                                )}
                                              </div>
                                              <div className="text-center border-l border-[#30363d] px-1.5">
                                                <span className="text-[9px] text-[#8b949e] block font-mono">ИТОГ</span>
                                                <strong className="text-sm text-green-400 font-mono">{currentScore}</strong>
                                              </div>

                                              {/* Override Action */}
                                              <button
                                                onClick={() => {
                                                  setSelectedFeatureForOverride(feat);
                                                  setOverrideScoreValue(feat.overrideScore !== undefined ? String(feat.overrideScore) : '');
                                                  setOverrideReasonValue(feat.overrideReason || '');
                                                  setIsOverrideModalOpen(true);
                                                }}
                                                title="Переопределить приоритет PM-ом"
                                                className="p-1 rounded bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#8b949e] hover:text-white"
                                              >
                                                <Edit2 size={12} />
                                              </button>
                                            </div>
                                          </div>

                                          {/* Feature Audit Info Box if Overridden */}
                                          {isOverridden && (
                                            <div className="bg-yellow-950/20 border border-yellow-800/30 p-2 rounded text-xs text-yellow-500 flex items-start gap-1.5 font-mono">
                                              <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                                              <div>
                                                <strong>PM аудит ручной корректировки:</strong> {feat.overrideReason}
                                                <button
                                                  onClick={() => store.resetFeatureOverride(feat.id)}
                                                  className="ml-2 underline text-white hover:text-yellow-400 text-[10px]"
                                                >
                                                  [Сбросить]
                                                </button>
                                              </div>
                                            </div>
                                          )}

                                          {/* Metrics Breakdown Grid */}
                                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-2 border-t border-b border-[#30363d]/40">
                                            <div>
                                              <span className="text-[#8b949e] block text-[10px]">Трудоемкость (Hours/SP):</span>
                                              <span className="text-[#c9d1d9] font-mono font-medium">{feat.effortHours}h / {feat.effortSP} SP</span>
                                            </div>
                                            <div>
                                              <span className="text-[#8b949e] block text-[10px]">Кол-во сигналов (ИТС):</span>
                                              <span className="text-[#c9d1d9] font-mono font-medium">{feat.repeatabilityCount} шт</span>
                                            </div>
                                            <div>
                                              <span className="text-[#8b949e] block text-[10px]">Влияние на продажи (sales):</span>
                                              <span className="text-[#c9d1d9] font-mono font-medium">{feat.salesImpact} из 5</span>
                                            </div>
                                            <div>
                                              <span className="text-[#8b949e] block text-[10px]">Приоритет ИТС:</span>
                                              <span className="text-[#c9d1d9] font-mono font-medium">{feat.itsPriority} из 5</span>
                                            </div>
                                          </div>

                                          {/* Tasks and GitLab status */}
                                          <div className="space-y-1.5 ml-2.5">
                                            <div className="flex items-center justify-between text-[11px] text-[#8b949e]">
                                              <span className="font-semibold text-white flex items-center gap-1">
                                                <Settings size={12} />
                                                Технические задачи GitLab ({featureTasks.length})
                                              </span>
                                              <button
                                                onClick={() => {
                                                  setSelectedFeatureForTask(feat);
                                                  setIsTaskModalOpen(true);
                                                }}
                                                className="text-[#58a6ff] hover:underline flex items-center gap-0.5"
                                              >
                                                <Plus size={11} /> Добавить подзадачу
                                              </button>
                                            </div>

                                            <div className="space-y-1">
                                              {featureTasks.map((task: Task) => (
                                                <div key={task.id} className="flex items-center justify-between p-1.5 rounded bg-[#0d1117] border border-[#30363d]/50 text-xs font-mono">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-[#8b949e]">{task.code}</span>
                                                    <span className="text-[#c9d1d9] truncate max-w-xs">{task.title}</span>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-[#8b949e]">Разработчик: {task.developer}</span>
                                                    <span className="bg-[#30363d] px-1 rounded text-white text-[10px]">{task.sp} SP</span>
                                                    {task.gitlabUrl ? (
                                                      <a
                                                        href={task.gitlabUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[#58a6ff] hover:underline text-[10px] flex items-center gap-0.5"
                                                      >
                                                        <GitBranch size={10} /> GitLab
                                                      </a>
                                                    ) : (
                                                      <span className="text-yellow-600 text-[10px]">Локально</span>
                                                    )}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: MANUAL PRIORITY OVERRIDE WITH AUDIT COMPULSORY REASON */}
      {isOverrideModalOpen && selectedFeatureForOverride && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-yellow-500">
              <ShieldAlert size={20} />
              <h3 className="text-lg font-semibold text-white">PM Приоритет (Override)</h3>
            </div>

            <div className="text-xs text-[#8b949e] space-y-1">
              <div>Фича: <strong className="text-white">[{selectedFeatureForOverride.code}] {selectedFeatureForOverride.title}</strong></div>
              <div>Системный авто-приоритет: <strong className="text-white font-mono">{selectedFeatureForOverride.autoScore}</strong></div>
            </div>

            <form onSubmit={handleOverrideSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8b949e] mb-1 font-medium">Новая PM-оценка приоритета (вес):</label>
                <input
                  type="number"
                  value={overrideScoreValue}
                  onChange={(e) => setOverrideScoreValue(e.target.value)}
                  placeholder="Оставьте пустым для сброса к авто-скору"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white focus:outline-none focus:border-[#58a6ff] font-mono"
                />
              </div>

              <div>
                <label className="block text-[#8b949e] mb-1 font-medium">Обоснование ручной правки (АУДИТ):</label>
                <textarea
                  rows={3}
                  required
                  value={overrideReasonValue}
                  onChange={(e) => setOverrideReasonValue(e.target.value)}
                  placeholder="Укажите причину изменения оценки (например: Срочное требование инвестора / Выставка СИБИРЬ-2025)..."
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white focus:outline-none focus:border-[#58a6ff]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOverrideModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#21262d] text-white border border-[#30363d] hover:bg-[#30363d]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#238636] text-white hover:bg-[#2ea043]"
                >
                  Зафиксировать в аудит
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TASK TO FEATURE */}
      {isTaskModalOpen && selectedFeatureForTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Добавить задачу декомпозиции</h3>
            <div className="text-xs text-[#8b949e]">
              Фича: <strong className="text-white">[{selectedFeatureForTask.code}] {selectedFeatureForTask.title}</strong>
            </div>

            <form onSubmit={handleTaskSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8b949e] mb-1 font-medium">Название задачи:</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Например: Разработать схему таблицы в БД"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white focus:outline-none focus:border-[#58a6ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8b949e] mb-1 font-medium">Разработчик:</label>
                  <input
                    type="text"
                    value={newTaskDeveloper}
                    onChange={(e) => setNewTaskDeveloper(e.target.value)}
                    placeholder="Напр: Сергей Белов"
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1 font-medium">Story Points:</label>
                  <input
                    type="number"
                    value={newTaskSP}
                    onChange={(e) => setNewTaskSP(Number(e.target.value))}
                    min={1}
                    max={21}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white focus:outline-none focus:border-[#58a6ff] font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#21262d] text-white border border-[#30363d] hover:bg-[#30363d]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#238636] text-white hover:bg-[#2ea043]"
                >
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MANUAL FEATURE CREATION */}
      {isFeatureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Добавить новую Фичу в Бэклог</h3>
            <form onSubmit={handleFeatureSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#8b949e] mb-1 font-medium">Родительская инициатива:</label>
                <select
                  value={newFeatInitId}
                  onChange={(e) => setNewFeatInitId(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white focus:outline-none focus:border-[#58a6ff]"
                >
                  {store.initiatives.map((i: Initiative) => (
                    <option key={i.id} value={i.id}>{i.code} - {i.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#8b949e] mb-1 font-medium">Название фичи:</label>
                <input
                  type="text"
                  required
                  value={newFeatTitle}
                  onChange={(e) => setNewFeatTitle(e.target.value)}
                  placeholder="Например: Двухфакторная аутентификация через SMS/OTP"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white focus:outline-none focus:border-[#58a6ff]"
                />
              </div>

              <div>
                <label className="block text-[#8b949e] mb-1 font-medium">Краткое описание / Спецификация:</label>
                <textarea
                  rows={2}
                  value={newFeatDesc}
                  onChange={(e) => setNewFeatDesc(e.target.value)}
                  placeholder="Опишите технический стек и бизнес-ценность..."
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white focus:outline-none focus:border-[#58a6ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8b949e] mb-1 font-medium">Оценка в часах (Hours):</label>
                  <input
                    type="number"
                    value={newFeatHours}
                    onChange={(e) => setNewFeatHours(Number(e.target.value))}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white focus:outline-none focus:border-[#58a6ff] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1 font-medium">Оценка в Story Points (SP):</label>
                  <input
                    type="number"
                    value={newFeatSP}
                    onChange={(e) => setNewFeatSP(Number(e.target.value))}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white focus:outline-none focus:border-[#58a6ff] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-[#0d1117] p-3 rounded border border-[#30363d]">
                <div>
                  <label className="block text-[#8b949e] mb-1 font-medium">Влияние на продажи (sales):</label>
                  <select
                    value={newFeatSalesImpact}
                    onChange={(e) => setNewFeatSalesImpact(Number(e.target.value) as any)}
                    className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  >
                    <option value={1}>1 - Низкое влияние</option>
                    <option value={2}>2 - Посредственное</option>
                    <option value={3}>3 - Заметный вклад</option>
                    <option value={4}>4 - Высокая маржа</option>
                    <option value={5}>5 - Критически важно</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8b949e] mb-1 font-medium">Приоритет ИТС поддержки:</label>
                  <select
                    value={newFeatItsPriority}
                    onChange={(e) => setNewFeatItsPriority(Number(e.target.value) as any)}
                    className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                  >
                    <option value={1}>1 - Низкий</option>
                    <option value={2}>2 - Средний</option>
                    <option value={3}>3 - Повышенный</option>
                    <option value={4}>4 - Высокий (SLA)</option>
                    <option value={5}>5 - Сверхкритичный блок</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFeatureModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#21262d] text-white border border-[#30363d] hover:bg-[#30363d]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#238636] text-white hover:bg-[#2ea043]"
                >
                  Сохранить в Бэклог
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
