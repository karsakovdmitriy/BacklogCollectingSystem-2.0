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
  Server
} from 'lucide-react';

interface ReleasePlannerProps {
  store: any;
  searchQuery: string;
}

export default function ReleasePlanner({ store, searchQuery }: ReleasePlannerProps) {
  // Modal toggle for logs view after approval
  const [selectedLogsRelease, setSelectedLogsRelease] = useState<Release | null>(null);

  // Retrieve active releases
  const approvedReleases = store.releases.filter((r: Release) => r.status === 'Approved');
  const draftRelease = store.releases.find((r: Release) => r.id === 'rel-draft');

  const capacityLimit = draftRelease ? draftRelease.capacitySP : 20;

  // Retrieve features split by status
  // 1. Backlog (Not in any release)
  const backlogFeatures = store.features.filter(
    (f: Feature) => !f.releaseId && f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort backlog by final priority score (override score takes precedence)
  const sortedBacklog = [...backlogFeatures].sort((a, b) => {
    const scoreA = a.overrideScore !== undefined ? a.overrideScore : a.autoScore;
    const scoreB = b.overrideScore !== undefined ? b.overrideScore : b.autoScore;
    return scoreB - scoreA;
  });

  // 2. Draft Release candidates
  const draftFeatures = store.features.filter(
    (f: Feature) => f.releaseId === 'rel-draft' && f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Current Capacity details
  const totalDraftSP = draftFeatures.reduce((sum: number, f: Feature) => sum + f.effortSP, 0);
  const totalDraftHours = draftFeatures.reduce((sum: number, f: Feature) => sum + f.effortHours, 0);
  const capacityUsagePercent = Math.min((totalDraftSP / capacityLimit) * 100, 100);
  const isOverCapacity = totalDraftSP > capacityLimit;

  // Trigger auto allocation (greedy knapsack algorithm based on highest priority score / SP)
  const handleAutoAllocate = () => {
    store.autoAllocateDraftFeatures(capacityLimit);
  };

  // Drag and Drop simulation functions (also allows single click for fast mobile/desktop prototyping)
  const moveToRelease = (featureId: string) => {
    store.toggleFeatureInRelease(featureId, 'rel-draft');
  };

  const removeFromRelease = (featureId: string) => {
    store.toggleFeatureInRelease(featureId, null);
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

  // Drag and drop event handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  // Drag over handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropToRelease = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      moveToRelease(id);
    }
  };

  const handleDropToBacklog = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      removeFromRelease(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* CAPCITY DASHBOARD & AUTO-ALLOCATOR CONFIG */}
      <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-white">Ресурсы и Лимиты Команды (Capacity Planner)</h2>
            <p className="text-xs text-[#8b949e]">
              Управляйте емкостью команды в Story Points и активируйте авто-подбор фич под лимит.
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
              <span className="text-[#8b949e] font-medium">Лимит емкости (Capacity):</span>
              <span className="text-white font-mono font-bold">{capacityLimit} SP</span>
            </div>
            <input
              type="range"
              min={5}
              max={50}
              step={1}
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
                {totalDraftSP} / {capacityLimit} SP ({Math.round((totalDraftSP / capacityLimit) * 100)}%)
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
            <span>Внимание! Превышен лимит Capacity команды. Измените состав релиза или увеличьте лимит SP.</span>
          </div>
        )}
      </div>

      {/* DRAG AND DROP KANBAN / SPLIT CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT COLUMN: BACKLOG CANDIDATES (DRAG SOURCE) */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDropToBacklog}
          className="bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col h-[650px]"
        >
          <div className="px-4 py-3 bg-[#21262d] border-b border-[#30363d] flex items-center justify-between">
            <span className="font-semibold text-white">Доступно в Бэклоге ({sortedBacklog.length})</span>
            <span className="text-xs text-[#8b949e]">Отсортировано по приоритету</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0d1117]/30">
            {sortedBacklog.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#8b949e] space-y-2 text-center p-8">
                <Info size={24} />
                <p>Нет доступных фич в бэклоге.</p>
                <p className="text-[11px]">Создайте новые фичи или удалите их из черновика.</p>
              </div>
            ) : (
              sortedBacklog.map((f: Feature) => {
                const currentScore = f.overrideScore !== undefined ? f.overrideScore : f.autoScore;
                const isOverridden = f.overrideScore !== undefined;

                return (
                  <div
                    key={f.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, f.id)}
                    className="p-3.5 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] hover:border-[#8b949e]/40 rounded-lg cursor-grab active:cursor-grabbing transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-[#58a6ff]">{f.code}</span>
                          <span className="text-white font-medium text-xs truncate max-w-[200px]">
                            {f.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8b949e] line-clamp-2">{f.description}</p>
                      </div>

                      {/* Custom Transfer Trigger (Quick Actions for Click) */}
                      <button
                        onClick={() => moveToRelease(f.id)}
                        className="p-1 rounded bg-[#21262d] group-hover:bg-[#1f6feb] border border-[#30363d] text-[#8b949e] group-hover:text-white transition-all"
                        title="Добавить в Релиз"
                      >
                        <MoveRight size={13} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#30363d]/50 font-mono">
                      <div className="flex gap-2">
                        <span className="bg-[#0d1117] text-[#c9d1d9] px-1.5 py-0.2 rounded border border-[#30363d]">
                          {f.effortSP} SP
                        </span>
                        <span className="bg-[#0d1117] text-[#8b949e] px-1.5 py-0.2 rounded">
                          {f.effortHours}h
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-[#8b949e]">Приоритет:</span>
                        <strong className={`text-green-400 ${isOverridden ? 'text-yellow-500' : ''}`}>
                          {currentScore}
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: RELEASES CONSTRUCTOR DRAFT (DRAG TARGET & APPROVAL) */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDropToRelease}
          className="bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col h-[650px]"
        >
          <div className="px-4 py-3 bg-[#21262d] border-b border-[#30363d] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">План релиза (Черновик)</span>
              <span className="inline-flex h-2 w-2 rounded-full bg-yellow-400 animate-ping"></span>
            </div>
            <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 font-mono">
              STATUS: DRAFT
            </span>
          </div>

          {/* Features container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0d1117]/10">
            {draftFeatures.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#8b949e] space-y-2 text-center p-8 border-2 border-dashed border-[#30363d] rounded-lg">
                <CalendarRange size={28} className="text-[#30363d]" />
                <p className="font-semibold text-white">Перетащите фичи сюда</p>
                <p className="text-[11px] max-w-xs leading-normal">
                  Используйте Drag-and-Drop или нажмите кнопку авто-подбора, чтобы оптимизировать релиз под емкость команды.
                </p>
              </div>
            ) : (
              draftFeatures.map((f: Feature) => {
                const currentScore = f.overrideScore !== undefined ? f.overrideScore : f.autoScore;

                return (
                  <div
                    key={f.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, f.id)}
                    className="p-3 bg-[#1f6feb]/5 hover:bg-[#1f6feb]/10 border border-[#1f6feb]/30 rounded-lg cursor-grab active:cursor-grabbing transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => removeFromRelease(f.id)}
                        className="p-1 rounded bg-[#21262d] hover:bg-red-950 border border-[#30363d] text-[#8b949e] hover:text-red-400 transition-all"
                        title="Убрать из Релиза"
                      >
                        <MoveLeft size={13} />
                      </button>

                      <div className="flex-1 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-white font-medium text-xs">{f.title}</span>
                          <span className="text-[10px] font-mono text-[#58a6ff]">{f.code}</span>
                        </div>
                        <p className="text-[11px] text-[#8b949e]">{f.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#1f6feb]/20 font-mono">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-[#8b949e]">Эффективность (вес):</span>
                        <strong className="text-green-400">{currentScore}</strong>
                      </div>
                      <div className="flex gap-2">
                        <span className="bg-[#2ea043]/10 text-[#2ea043] px-1.5 py-0.2 rounded border border-[#2ea043]/20">
                          {f.effortSP} SP
                        </span>
                        <span className="bg-[#21262d] text-[#8b949e] px-1.5 py-0.2 rounded">
                          {f.effortHours}h
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* APPROVE ACTION AREA */}
          <div className="p-4 bg-[#21262d] border-t border-[#30363d] space-y-3">
            <div className="text-xs text-[#8b949e] leading-snug">
              При нажатии «Утвердить Релиз» система зафиксирует приоритеты, заблокирует изменение состава фич и запустит
              <strong className="text-white"> автоматический экспорт задач в продуктовый GitLab</strong>.
            </div>
            <button
              onClick={handleApproveRelease}
              disabled={draftFeatures.length === 0 || isOverCapacity}
              className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-white font-bold transition-all ${
                draftFeatures.length === 0 || isOverCapacity
                  ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                  : 'bg-[#238636] hover:bg-[#2ea043] cursor-pointer shadow-lg shadow-green-950/20'
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
                  Дата утверждения: <span className="text-[#c9d1d9] font-mono">{release.approvedAt}</span> | Лимит SP: <span className="text-white font-mono font-bold">{release.capacitySP} SP</span>
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
