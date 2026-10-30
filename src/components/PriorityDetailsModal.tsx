'use client';

import React from 'react';
import { Feature } from '@/store/index';
import { Calculator, X, ShieldAlert, CheckCircle2, HelpCircle } from 'lucide-react';

interface PriorityDetailsModalProps {
  feature: Feature;
  store: any;
  onClose: () => void;
}

export interface PriorityDetailComponent {
  name: string;
  rawValue: string;
  score: number;
  weight: number;
  weightedValue: number;
}

export default function PriorityDetailsModal({ feature, store, onClose }: PriorityDetailsModalProps) {
  const w = store.priorityWeights || {
    weightType: 0.25,
    weightDemand: 0.25,
    weightApplicability: 0.20,
    weightSpentCost: 0.15,
    weightReleaseEffort: 0.15,
    applicabilityEntity: 'module'
  };

  // 1. Type (Task Kind)
  const matchedKind = store.taskKinds?.find((k: any) => k.name === feature.taskKind);
  const typeScore = matchedKind?.priorityPoints ? Math.min(5, Math.max(1, matchedKind.priorityPoints)) : 3;

  // 2. Demand (Repeatability / Signals)
  const demandCount = feature.repeatabilityCount || 1;
  const demandScore = Math.min(5, Math.max(1, demandCount));

  // 3. Applicability
  let applicabilityCount = 1;
  let applicabilityLabel = '';
  if (w.applicabilityEntity === 'module') {
    applicabilityCount = store.features?.filter((f: Feature) => f.subsystem && f.subsystem === feature.subsystem).length || 1;
    applicabilityLabel = feature.subsystem ? `Модуль: ${feature.subsystem}` : 'Подсистема не указана';
  } else {
    applicabilityCount = store.features?.filter((f: Feature) => f.epicId && f.epicId === feature.epicId).length || 1;
    const ep = store.epics?.find((e: any) => e.id === feature.epicId);
    applicabilityLabel = ep ? `Эпик: ${ep.title}` : 'Эпик не указан';
  }
  const applicabilityScore = Math.min(5, Math.max(1, applicabilityCount));

  // 4. Spent Cost
  const boundReqs = store.requests?.filter((r: any) => r.associatedFeatureId === feature.id) || [];
  const totalSpent = boundReqs.reduce((sum: number, r: any) => sum + (r.spent || r.estimate || 0), 0) || feature.effortHours || 0;
  const spentCostScore = Math.min(5, Math.max(1, Math.ceil(totalSpent / 20) || 1));

  // 5. Release Effort
  const releaseEffortOpt = store.releaseEffortOptions?.find((opt: any) => opt.id === feature.releaseEffortId);
  const releaseEffortScore = releaseEffortOpt ? Math.min(5, Math.max(1, releaseEffortOpt.points)) : 3;

  const totalWeight = (w.weightType + w.weightDemand + w.weightApplicability + w.weightSpentCost + w.weightReleaseEffort) || 1;

  const components: PriorityDetailComponent[] = [
    {
      name: '1. Вид задачи (Task Kind)',
      rawValue: feature.taskKind ? `${feature.taskKind}` : 'Не указан (по умолч. 3.0 б.)',
      score: typeScore,
      weight: w.weightType,
      weightedValue: typeScore * w.weightType
    },
    {
      name: '2. Востребованность (Сигналы)',
      rawValue: `${demandCount} шт. входящих сигналов`,
      score: demandScore,
      weight: w.weightDemand,
      weightedValue: demandScore * w.weightDemand
    },
    {
      name: `3. Применимость (${w.applicabilityEntity === 'module' ? 'Модуль' : 'Эпик'})`,
      rawValue: `${applicabilityCount} фич (${applicabilityLabel})`,
      score: applicabilityScore,
      weight: w.weightApplicability,
      weightedValue: applicabilityScore * w.weightApplicability
    },
    {
      name: '4. Затраты трудоемкости',
      rawValue: `${totalSpent} ч. трудозатрат`,
      score: spentCostScore,
      weight: w.weightSpentCost,
      weightedValue: spentCostScore * w.weightSpentCost
    },
    {
      name: '5. Сложность переноса в релиз',
      rawValue: releaseEffortOpt ? `${releaseEffortOpt.name} (${releaseEffortOpt.points} б.)` : 'Не указана (по умолч. 3.0 б.)',
      score: releaseEffortScore,
      weight: w.weightReleaseEffort,
      weightedValue: releaseEffortScore * w.weightReleaseEffort
    }
  ];

  const sumWeighted = components.reduce((sum, c) => sum + c.weightedValue, 0);
  const calculatedAutoScore = Math.min(5.0, Math.max(1.0, Math.round((sumWeighted / totalWeight) * 10) / 10));

  const isOverridden = feature.overrideScore !== undefined;
  const activeScore = isOverridden ? feature.overrideScore : calculatedAutoScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#30363d] pb-4">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <Calculator size={20} className="text-[#58a6ff]" />
              <h3 className="text-lg font-bold text-white">Параметры расчета приоритета</h3>
            </div>
            <p className="text-xs text-[#8b949e]">
              Фича: <strong className="text-white">[{feature.code}] {feature.title}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#8b949e] hover:text-white hover:bg-[#30363d] transition-colors"
            title="Закрыть"
          >
            <X size={18} />
          </button>
        </div>

        {/* Priority Score Overview Card */}
        <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-[#8b949e] font-medium block">Текущий итоговый приоритет:</span>
            <div className="flex items-center gap-3">
              <span className={`text-3xl font-extrabold font-mono ${isOverridden ? 'text-yellow-400' : 'text-green-400'}`}>
                {activeScore}
              </span>
              <span className="text-xs text-[#8b949e] font-mono">(Шкала 1.0 - 5.0)</span>
            </div>
          </div>

          <div className="text-right space-y-1 font-mono text-xs">
            <div>Системный авто-скор: <strong className="text-white">{calculatedAutoScore}</strong></div>
            {isOverridden && (
              <div className="inline-flex items-center gap-1 text-yellow-400 bg-yellow-950/40 border border-yellow-800/50 px-2 py-0.5 rounded text-[11px]">
                <ShieldAlert size={12} />
                Ручной вес PM: {feature.overrideScore}
              </div>
            )}
          </div>
        </div>

        {/* PM Override Justification if active */}
        {isOverridden && (
          <div className="p-3 bg-yellow-950/20 border border-yellow-800/40 rounded-lg text-xs space-y-1">
            <span className="text-yellow-500 font-bold block flex items-center gap-1">
              <ShieldAlert size={14} />
              Обоснование ручного переопределения (PM Override):
            </span>
            <p className="text-[#c9d1d9] italic">{feature.overrideReason}</p>
          </div>
        )}

        {/* Breakdown Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
            Компоненты формулы авто-приоритета:
          </h4>
          <div className="overflow-x-auto border border-[#30363d] rounded-lg bg-[#0d1117]">
            <table className="w-full text-left text-xs text-[#c9d1d9]">
              <thead className="bg-[#161b22] text-[#8b949e] border-b border-[#30363d] font-mono text-[11px]">
                <tr>
                  <th className="p-2.5 font-semibold">Параметр</th>
                  <th className="p-2.5 font-semibold">Значение</th>
                  <th className="p-2.5 font-semibold text-center">Балл (1-5)</th>
                  <th className="p-2.5 font-semibold text-center">Вес</th>
                  <th className="p-2.5 font-semibold text-right">Вклад</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                {components.map((comp, idx) => (
                  <tr key={idx} className="hover:bg-[#161b22]/50 transition-colors">
                    <td className="p-2.5 font-medium text-white">{comp.name}</td>
                    <td className="p-2.5 text-[#8b949e]">{comp.rawValue}</td>
                    <td className="p-2.5 text-center font-mono font-bold text-white">{comp.score}</td>
                    <td className="p-2.5 text-center font-mono text-[#8b949e]">
                      {Math.round((comp.weight / totalWeight) * 100)}%
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-green-400">
                      +{(comp.weightedValue / totalWeight).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#161b22] border-t border-[#30363d] font-mono font-bold text-xs">
                <tr>
                  <td colSpan={3} className="p-2.5 text-white">Итого взвешенная сумма:</td>
                  <td className="p-2.5 text-center text-white">100%</td>
                  <td className="p-2.5 text-right text-green-400">{calculatedAutoScore}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Formula Explanation Footer */}
        <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d]/60 text-[11px] text-[#8b949e] space-y-1 font-mono">
          <div className="text-white font-bold flex items-center gap-1">
            <HelpCircle size={12} className="text-[#58a6ff]" />
            Формула расчета:
          </div>
          <div className="text-[10px]">
            AutoScore = Σ (Балл_i × Вес_i) / Σ Весов = ({components.map(c => `${c.score}×${c.weight}`).join(' + ')}) / {totalWeight} = <span className="text-green-400 font-bold">{calculatedAutoScore}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2 border-t border-[#30363d]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-[#21262d] text-white hover:bg-[#30363d] border border-[#30363d] text-xs font-semibold transition-all"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
