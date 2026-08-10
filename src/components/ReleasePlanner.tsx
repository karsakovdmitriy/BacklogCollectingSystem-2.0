'use client';

import React, { useState } from 'react';
import { Feature, Release } from '@/store/index';
import {
  CalendarRange,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  Trash2,
  MoveLeft,
  MoveRight,
  GitPullRequest,
  Check,
  ChevronDown,
  Info,
  Server,
  Sparkles,
  ClipboardCheck,
  Clock,
  Coins
} from 'lucide-react';

interface ReleasePlannerProps {
  store: any;
  searchQuery: string;
}

export default function ReleasePlanner({ store, searchQuery }: ReleasePlannerProps) {
  // Modal toggles
  const [selectedLogsRelease, setSelectedLogsRelease] = useState<Release | null>(null);
  const [isBulkEstimateOpen, setIsBulkEstimateOpen] = useState(false);

  // Bulk estimation form state
  const [bulkInputs, setBulkInputs] = useState<Record<string, { hours: string }>>({});

  // Single card inline estimation form state
  const [inlineInputs, setInlineInputs] = useState<Record<string, { hours: string }>>({});

  // Retrieve active releases
  const approvedReleases = store.releases.filter((r: Release) => r.status === 'Approved');
  const draftRelease = store.releases.find((r: Release) => r.id === 'rel-draft');

  const capacityLimit = draftRelease ? draftRelease.capacityHours : 160;

  // Retrieve features split by funnel status
  const backlogFeatures = store.features.filter(
    (f: Feature) =>
      !f.releaseId &&
      (f.status === 'Backlog' || !f.status) &&
      f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const estimatingFeatures = store.features.filter(
    (f: Feature) =>
      !f.releaseId &&
      f.status === 'На оценке' &&
      f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const estimatedFeatures = store.features.filter(
    (f: Feature) =>
      !f.releaseId &&
      f.status === 'Оценено' &&
      f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const draftFeatures = store.features.filter(
    (f: Feature) =>
      f.releaseId === 'rel-draft' &&
      f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting
  const sortFeaturesByScore = (arr: Feature[]) => {
    return [...arr].sort((a, b) => {
      const scoreA = a.overrideScore !== undefined ? a.overrideScore : a.autoScore;
      const scoreB = b.overrideScore !== undefined ? b.overrideScore : b.autoScore;
      return scoreB - scoreA;
    });
  };

  const sortedBacklog = sortFeaturesByScore(backlogFeatures);
  const sortedEstimating = sortFeaturesByScore(estimatingFeatures);
  const sortedEstimated = sortFeaturesByScore(estimatedFeatures);

  // Current Capacity details of the draft release
  const totalDraftHours = draftFeatures.reduce((sum: number, f: Feature) => sum + f.effortHours, 0);
  const capacityUsagePercent = Math.min((totalDraftHours / capacityLimit) * 100, 100);
  const isOverCapacity = totalDraftHours > capacityLimit;

  // Trigger auto allocation (greedy knapsack algorithm based on highest priority score / SP)
  const handleAutoAllocate = () => {
    // Only 'Оценено' features can be auto-allocated to the release draft
    store.autoAllocateDraftFeatures(capacityLimit);
  };

  // Funnel actions
  const moveToEstimation = (featureId: string) => {
    store.moveFeatureToEstimation(featureId);
  };

  const saveSingleEstimation = (featureId: string) => {
    const inputs = inlineInputs[featureId] || { hours: '40' };
    const hoursVal = parseInt(inputs.hours) || 40;
    store.fillFeatureEffort(featureId, hoursVal);
  };

  const moveToRelease = (featureId: string) => {
    store.toggleFeatureInRelease(featureId, 'rel-draft');
  };

  const removeFromRelease = (featureId: string) => {
    store.toggleFeatureInRelease(featureId, null);
  };

  // Bulk estimate submit
  const handleBulkEstimateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updates = estimatingFeatures.map((f: Feature) => {
      const inputs = bulkInputs[f.id] || { hours: '40' };
      return {
        id: f.id,
        hours: parseInt(inputs.hours) || 40
      };
    });
    store.batchFillFeatureEfforts(updates);
    setIsBulkEstimateOpen(false);
    alert('Все выбранные фичи успешно оценены и перенесены в статус "Оценено"!');
  };

  // Submit/Approve Release
  const handleApproveRelease = () => {
    if (draftFeatures.length === 0) {
      alert('Черновик релиза пуст. Пожалуйста, добавьте фичи!');
      return;
    }
    const approvedCode = store.approveDraftRelease();
    if (approvedCode) {
      alert(`Релиз ${approvedCode} Успешно Утвержден!\n\nАвтоматически экспортировано задач в GitLab. Продуктовая телеметрия активирована.`);
    }
  };

  // Drag and Drop event handlers
  const handleDragStart = (e: React.DragEvent, id: string, origin: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, origin }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropToBacklog = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      // No transition backward from estimated to backlog defined, but can reset release
      if (data.origin === 'draft') {
        removeFromRelease(data.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDropToEstimating = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data.origin === 'backlog') {
        moveToEstimation(data.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDropToDraft = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data.origin === 'estimated') {
        moveToRelease(data.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* CAPACITY DASHBOARD & AUTO-ALLOCATOR CONFIG */}
      <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-white">Ресурсы и Лимиты Команды (Capacity Planner)</h2>
            <p className="text-xs text-[#8b949e]">
              Управляйте емкостью команды в часах и активируйте авто-подбор фич под лимит.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Greedy Optimizer Button */}
            <button
              onClick={handleAutoAllocate}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              <Zap size={15} />
              Авто-подбор фич (Knapsack)
            </button>

            {/* Clear All Draft Candidates */}
            <button
              onClick={() => store.clearDraftFeatures()}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#21262d] text-red-400 hover:bg-[#30363d] border border-[#30363d] text-xs transition-all"
            >
              <Trash2 size={14} />
              Очистить черновик
            </button>
          </div>
        </div>

        {/* Dynamic Capacity slider & bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center pt-2">
          {/* Slider input */}
          <div className="md:col-span-1 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#8b949e] font-medium">Лимит емкости (в часах):</span>
              <span className="text-white font-mono font-bold">{capacityLimit} ч.</span>
            </div>
            <input
              type="range"
              min={40}
              max={400}
              step={8}
              value={capacityLimit}
              onChange={(e) => store.updateDraftCapacity(Number(e.target.value))}
              className="w-full accent-[#1f6feb] h-1.5 bg-[#0d1117] rounded-lg appearance-none cursor-pointer border border-[#30363d]"
            />
          </div>

          {/* Graphical Loading Bar */}
          <div className="md:col-span-2 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#8b949e]">Загрузка спринта:</span>
              <span className={`font-mono font-semibold ${isOverCapacity ? 'text-red-400' : 'text-green-400'}`}>
                {totalDraftHours} / {capacityLimit} ч. ({Math.round((totalDraftHours / capacityLimit) * 100)}%)
              </span>
            </div>
            <div className="w-full h-3 bg-[#0d1117] rounded-full overflow-hidden border border-[#30363d] flex">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isOverCapacity ? 'bg-red-500' : 'bg-[#2ea043]'
                }`}
                style={{ width: `${capacityUsagePercent}%` }}
              />
            </div>
          </div>

          {/* Calculated Load details */}
          <div className="md:col-span-1 text-xs space-y-1 bg-[#0d1117] p-2.5 rounded-lg border border-[#30363d]">
            <div className="flex justify-between text-[#8b949e]">
              <span>Затраты времени:</span>
              <strong className="text-white">{totalDraftHours} ч.</strong>
            </div>
            <div className="flex justify-between text-[#8b949e]">
              <span>Фич в релизе:</span>
              <strong className="text-white">{draftFeatures.length} шт.</strong>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        {isOverCapacity && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-950/20 border border-red-900/40 text-xs text-red-400">
            <AlertTriangle size={15} />
            <span>Внимание! Превышен лимит Capacity команды. Измените состав релиза или увеличьте лимит в часах.</span>
          </div>
        )}
      </div>

      {/* 3-COLUMN FUNNEL DASHBOARD */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[720px] overflow-hidden items-stretch">

        {/* COLUMN 1: BACKLOG CANDIDATES */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDropToBacklog}
          className="bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col h-full overflow-hidden"
        >
          <div className="px-4 py-3 bg-[#21262d] border-b border-[#30363d] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">1. Доступно в Бэклоге ({sortedBacklog.length})</span>
            </div>
            <span className="text-[10px] text-[#8b949e] font-mono">STATUS: BACKLOG</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#0d1117]/30 scrollbar-thin">
            {sortedBacklog.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#8b949e] space-y-2 text-center p-6 border border-dashed border-[#30363d]/40 rounded-lg">
                <Info size={24} className="text-[#30363d]" />
                <p className="text-xs">Нет новых фич в бэклоге.</p>
              </div>
            ) : (
              sortedBacklog.map((f: Feature) => {
                const currentScore = f.overrideScore !== undefined ? f.overrideScore : f.autoScore;
                return (
                  <div
                    key={f.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, f.id, 'backlog')}
                    className="p-3 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded-lg cursor-grab active:cursor-grabbing transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-[#58a6ff]">{f.code}</span>
                          <span className="text-white font-medium text-xs truncate max-w-[150px]">
                            {f.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8b949e] line-clamp-2 leading-relaxed">{f.description}</p>
                      </div>

                      <button
                        onClick={() => moveToEstimation(f.id)}
                        className="p-1 rounded bg-[#21262d] hover:bg-[#1f6feb] border border-[#30363d] text-[#8b949e] hover:text-white transition-all text-xs flex items-center gap-0.5"
                        title="Направить на оценку"
                      >
                        <MoveRight size={12} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#30363d]/50 font-mono">
                      <span className="text-[#8b949e]">Приоритет: <strong className="text-green-400">{currentScore}</strong></span>
                      <span className="bg-[#21262d] text-[#8b949e] px-1.5 py-0.2 rounded">Не оценена (в часах)</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 2: ESTIMATION STAGE */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDropToEstimating}
          className="bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col h-full overflow-hidden"
        >
          <div className="px-4 py-3 bg-[#21262d] border-b border-[#30363d] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-semibold text-white">2. На оценку трудоемкости ({estimatingFeatures.length})</span>
            <button
              onClick={() => {
                // Initialize bulk inputs
                const init: Record<string, { hours: string }> = {};
                estimatingFeatures.forEach((f: Feature) => {
                  init[f.id] = { hours: String(f.effortHours || 40) };
                });
                setBulkInputs(init);
                setIsBulkEstimateOpen(true);
              }}
              disabled={estimatingFeatures.length === 0}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold text-[10px] rounded shadow-md transition-all flex items-center gap-1 shrink-0"
            >
              <ClipboardCheck size={12} />
              Заполнить трудоемкость
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#0d1117]/30 scrollbar-thin">
            {sortedEstimating.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#8b949e] space-y-2 text-center p-6 border-2 border-dashed border-[#30363d]/30 rounded-lg">
                <Clock size={24} className="text-[#30363d]" />
                <p className="text-xs font-semibold text-white">Перетащите фичи сюда</p>
                <p className="text-[10px]">Или нажмите кнопку в первой колонке, чтобы отправить фичи на оценку.</p>
              </div>
            ) : (
              sortedEstimating.map((f: Feature) => {
                const currentScore = f.overrideScore !== undefined ? f.overrideScore : f.autoScore;
                const inline = inlineInputs[f.id] || { sp: '5', hours: '40' };

                return (
                  <div
                    key={f.id}
                    className="p-3 bg-amber-950/10 border border-amber-800/30 rounded-lg transition-all space-y-2.5"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-[#58a6ff]">{f.code}</span>
                        <span className="text-white font-medium text-xs truncate max-w-[175px]">
                          {f.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8b949e] line-clamp-2 leading-relaxed">{f.description}</p>
                    </div>

                    {/* Quick Manual Estimator Form */}
                    <div className="bg-[#0d1117] p-2 rounded border border-[#30363d] space-y-2">
                      <div className="grid grid-cols-1 gap-2 text-[10px]">
                        <div>
                          <label className="text-[#8b949e] block mb-0.5 font-mono">Часы:</label>
                          <input
                            type="number"
                            value={inline.hours}
                            onChange={(e) =>
                              setInlineInputs({
                                ...inlineInputs,
                                [f.id]: { ...inline, hours: e.target.value }
                              })
                            }
                            className="w-full bg-[#161b22] border border-[#30363d] rounded text-white px-1 py-0.5 text-center font-mono font-bold"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => saveSingleEstimation(f.id)}
                        className="w-full py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] rounded transition-all flex items-center justify-center gap-1"
                      >
                        <Check size={11} /> Сохранить оценку
                      </button>
                    </div>

                    <div className="text-[10px] text-[#8b949e] font-mono pt-1 flex justify-between">
                      <span>Приоритет: <strong className="text-green-400">{currentScore}</strong></span>
                      <span className="text-amber-500 font-semibold animate-pulse">ОЖИДАЕТ ОЦЕНКИ</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 3: ESTIMATED & DRAFT RELEASE */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDropToDraft}
          className="bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col h-full overflow-hidden"
        >
          <div className="px-4 py-3 bg-[#21262d] border-b border-[#30363d] flex items-center justify-between">
            <span className="font-semibold text-white">3. План релиза (Черновик)</span>
            <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 font-mono">
              DRAFT
            </span>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">

            {/* Top Half: Estimated Pool Candidates */}
            <div className="h-1/2 flex flex-col border-b border-[#30363d]/50">
              <div className="px-3 py-1.5 bg-[#0d1117] text-[10px] font-semibold text-[#8b949e] border-b border-[#30363d]/40 flex justify-between">
                <span>ОЦЕНЕННЫЕ КАНДИДАТЫ ({sortedEstimated.length})</span>
                <span>Перетащите вниз для релиза</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#0d1117]/10 scrollbar-thin">
                {sortedEstimated.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[#8b949e] text-xs italic p-4 text-center">
                    Оцененных фич нет. Оцените фичи во второй колонке.
                  </div>
                ) : (
                  sortedEstimated.map((f: Feature) => {
                    const currentScore = f.overrideScore !== undefined ? f.overrideScore : f.autoScore;
                    return (
                      <div
                        key={f.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, f.id, 'estimated')}
                        className="p-2.5 bg-[#161b22] border border-[#30363d] hover:border-[#8b949e]/40 rounded-lg cursor-grab active:cursor-grabbing transition-all flex items-center justify-between gap-2"
                      >
                        <div className="truncate pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono text-[#58a6ff]">{f.code}</span>
                            <span className="text-white font-medium text-xs truncate max-w-[120px]">{f.title}</span>
                          </div>
                          <span className="text-[10px] text-[#8b949e] font-mono">{f.effortHours}ч.</span>
                        </div>
                        <button
                          onClick={() => moveToRelease(f.id)}
                          className="p-1 rounded bg-[#21262d] hover:bg-[#238636] border border-[#30363d] text-[#8b949e] hover:text-white transition-all"
                          title="Добавить в черновик релиза"
                        >
                          <MoveRight size={12} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Bottom Half: Target Release Draft */}
            <div className="h-1/2 flex flex-col bg-[#1f6feb]/5">
              <div className="px-3 py-1.5 bg-[#1f6feb]/10 text-[10px] font-semibold text-[#58a6ff] border-b border-[#1f6feb]/20 flex justify-between">
                <span>ВКЛЮЧЕНО В РЕЛИЗ ({draftFeatures.length})</span>
                <span>Итого: {totalDraftHours} ч.</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
                {draftFeatures.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-[#8b949e] space-y-1.5 text-center p-4">
                    <CalendarRange size={24} className="text-[#30363d]" />
                    <p className="text-[11px] font-semibold text-white">Перетащите фичи сюда</p>
                  </div>
                ) : (
                  draftFeatures.map((f: Feature) => {
                    return (
                      <div
                        key={f.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, f.id, 'draft')}
                        className="p-2 bg-[#1f6feb]/10 border border-[#1f6feb]/30 rounded-lg cursor-grab active:cursor-grabbing transition-all flex items-center justify-between gap-2"
                      >
                        <button
                          onClick={() => removeFromRelease(f.id)}
                          className="p-1 rounded bg-[#21262d] hover:bg-red-950 border border-[#30363d] text-[#8b949e] hover:text-red-400 transition-all"
                          title="Убрать"
                        >
                          <MoveLeft size={11} />
                        </button>
                        <div className="text-right flex-1 truncate">
                          <span className="text-white font-medium text-xs block truncate">{f.title}</span>
                          <span className="text-[9px] text-[#8b949e] font-mono">{f.effortHours}ч.</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* APPROVE ACTION AREA */}
          <div className="p-4 bg-[#21262d] border-t border-[#30363d] space-y-3">
            <div className="text-xs text-[#8b949e] leading-snug">
              При утверждении система экспортирует задачи в GitLab и переведет фичи в статус релиза.
            </div>
            <button
              onClick={handleApproveRelease}
              disabled={draftFeatures.length === 0 || isOverCapacity}
              className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-white font-bold transition-all ${
                draftFeatures.length === 0 || isOverCapacity
                  ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                  : 'bg-[#238636] hover:bg-[#2ea043] cursor-pointer shadow-lg'
              }`}
            >
              <CheckCircle2 size={16} />
              Проверить и Утвердить Релиз
            </button>
          </div>
        </div>

      </div>

      {/* APPROVED RELEASES CATALOGUE & GITLAB INTEGRATION LOGS */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-[#21262d] border-b border-[#30363d] flex items-center justify-between">
          <span className="font-semibold text-white flex items-center gap-2">
            <Server size={16} />
            Архив Утвержденных Релизов и Телеметрия Экспорта ({approvedReleases.length})
          </span>
          <span className="text-xs text-[#8b949e]">Интеграционный GitLab логгер</span>
        </div>

        <div className="p-4 space-y-3">
          {approvedReleases.map((release: Release) => (
            <div key={release.id} className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3 font-sans">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white bg-green-950 border border-green-900 px-2 py-0.5 rounded">
                    {release.code}
                  </span>
                  <h4 className="font-medium text-white text-sm">{release.title}</h4>
                </div>
                <div className="text-xs text-[#8b949e]">
                  Дата утверждения: <span className="text-[#c9d1d9] font-mono">{release.approvedAt}</span> | Лимит емкости: <span className="text-white font-mono font-bold">{release.capacityHours} ч.</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-950/20 border border-green-900/30 px-2 py-1 rounded">
                  <Check size={13} />
                  Экспортировано в GitLab
                </span>
                <button
                  onClick={() => setSelectedLogsRelease(release)}
                  className="px-2.5 py-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] text-xs transition-all"
                >
                  Посмотреть логи экспорта
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: BATCH ESTIMATION */}
      {isBulkEstimateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <form onSubmit={handleBulkEstimateSubmit} className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
              <div className="space-y-0.5">
                <h3 className="text-lg font-semibold text-white">Пакетная оценка трудоемкости</h3>
                <p className="text-xs text-[#8b949e]">Заполните экспертные часы для всех выбранных фич.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkEstimateOpen(false)}
                className="text-[#8b949e] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              {estimatingFeatures.map((f: Feature) => {
                const fInput = bulkInputs[f.id] || { sp: '5', hours: '40' };
                return (
                  <div key={f.id} className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#58a6ff] font-mono">{f.code}</span>
                      <span className="text-xs text-white font-medium truncate max-w-[400px]">{f.title}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-xs">
                      <div>
                        <label className="text-[#8b949e] block mb-1 font-mono">Часы трудоемкости:</label>
                        <input
                          type="number"
                          value={fInput.hours}
                          onChange={(e) =>
                            setBulkInputs({
                              ...bulkInputs,
                              [f.id]: { ...fInput, hours: e.target.value }
                            })
                          }
                          className="w-full bg-[#161b22] border border-[#30363d] rounded text-white px-2 py-1 font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#30363d]">
              <button
                type="button"
                onClick={() => setIsBulkEstimateOpen(false)}
                className="px-4 py-2 rounded bg-[#21262d] text-white border border-[#30363d] hover:bg-[#30363d] text-xs font-semibold"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg"
              >
                Сохранить и Перенести в "Оценено"
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: INTEGRATION EXPORT LOGS */}
      {selectedLogsRelease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
              <div className="space-y-0.5">
                <h3 className="text-lg font-semibold text-white">Логи интеграционного шлюза (GitLab Sync)</h3>
                <p className="text-xs text-[#8b949e]">Экспорт релиза: {selectedLogsRelease.code}</p>
              </div>
              <button
                onClick={() => setSelectedLogsRelease(null)}
                className="text-[#8b949e] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 font-mono text-xs text-[#c9d1d9] space-y-1.5 max-h-[350px] overflow-y-auto scrollbar-thin">
              {selectedLogsRelease.exportLogs?.map((log, index) => {
                const isError = log.includes('ERROR');
                const isSuccess = log.includes('SUCCESS');
                return (
                  <div key={index} className={`whitespace-pre-wrap leading-relaxed ${isError ? 'text-red-400' : isSuccess ? 'text-green-400 font-bold' : 'text-[#8b949e]'}`}>
                    {log}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLogsRelease(null)}
                className="px-4 py-2 rounded bg-[#21262d] text-white border border-[#30363d] hover:bg-[#30363d] text-xs"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
