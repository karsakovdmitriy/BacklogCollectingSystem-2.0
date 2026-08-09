'use client';

import React from 'react';
import { Feature, Epic } from '@/store/index';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Target
} from 'lucide-react';

interface PnLDashboardProps {
  store: any;
}

export default function PnLDashboard({ store }: PnLDashboardProps) {
  // Aggregate stats across all features that have active/approved release status
  const releasedFeatures = store.features.filter(
    (f: Feature) => f.releaseId && f.releaseId !== 'rel-draft'
  );

  // Financial aggregates
  // P&L calculation: Cost is simulated based on expert development cost (Story Points * constant rate)
  // Revenue is calculated based on B2B closed contract telemetry linked to that feature.
  const totalCost = store.features.reduce((sum: number, f: Feature) => sum + f.developmentCost, 0);
  const totalRevenue = store.features.reduce((sum: number, f: Feature) => sum + f.revenueGenerated, 0);
  const netProfit = totalRevenue - totalCost;

  // ROI percentage formula: (Net Profit / Total Cost) * 100
  const overallROI = totalCost > 0 ? Math.round((netProfit / totalCost) * 100) : 0;

  // Epic level financial aggregations
  const epicFinancials = store.epics.map((epic: Epic) => {
    // find all features under this epic
    const epicInits = store.initiatives.filter((i: any) => i.epicId === epic.id).map((i: any) => i.id);
    const epicFeatures = store.features.filter((f: Feature) => epicInits.includes(f.initiativeId));

    const cost = epicFeatures.reduce((sum: number, f: Feature) => sum + f.developmentCost, 0);
    const revenue = epicFeatures.reduce((sum: number, f: Feature) => sum + f.revenueGenerated, 0);
    const profit = revenue - cost;
    const roi = cost > 0 ? Math.round((profit / cost) * 100) : 0;

    return {
      code: epic.code,
      title: epic.title,
      cost,
      revenue,
      profit,
      roi,
    };
  });

  return (
    <div className="space-y-6">
      {/* FINANCIAL OVERVIEW KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Cost */}
        <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] font-medium uppercase">Затраты на разработку (CAPEX)</span>
            <DollarSign size={18} className="text-red-400" />
          </div>
          <div className="mt-3">
            <strong className="text-xl text-white font-mono font-bold">
              {totalCost.toLocaleString('ru-RU')} ₽
            </strong>
            <p className="text-[11px] text-[#8b949e] mt-1">На основе Story Points (30k ₽/SP)</p>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] font-medium uppercase">Прибыль / Допродажи (OPEX)</span>
            <ArrowUpRight size={18} className="text-green-400" />
          </div>
          <div className="mt-3">
            <strong className="text-xl text-white font-mono font-bold">
              {totalRevenue.toLocaleString('ru-RU')} ₽
            </strong>
            <p className="text-[11px] text-green-400 flex items-center gap-0.5 mt-1 font-mono">
              <ArrowUpRight size={12} /> +12.4% к прошлому кварталу
            </p>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] font-medium uppercase">Чистый Финансовый Эффект</span>
            <Briefcase size={18} className="text-[#58a6ff]" />
          </div>
          <div className="mt-3">
            <strong className={`text-xl font-mono font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {netProfit.toLocaleString('ru-RU')} ₽
            </strong>
            <p className="text-[11px] text-[#8b949e] mt-1">Разница Доходы минус Расходы</p>
          </div>
        </div>

        {/* ROI % */}
        <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8b949e] font-medium uppercase">Суммарный ROI продукта</span>
            <Target size={18} className="text-yellow-500" />
          </div>
          <div className="mt-3">
            <strong className="text-2xl text-yellow-500 font-mono font-bold">
              {overallROI}%
            </strong>
            <p className="text-[11px] text-yellow-500 font-mono flex items-center gap-0.5 mt-1">
              Эффективность инвестиций
            </p>
          </div>
        </div>
      </div>

      {/* DETAILED INTERACTIVE SVG CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CHART 1: COST VS REVENUE PER EPIC */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Соотношение затрат и выручки по Эпикам (P&L Epic breakdown)</h3>
            <p className="text-xs text-[#8b949e]">Красный бар — Стоимость разработки, Зеленый — Допродажи / Эффект</p>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-64 bg-[#0d1117] rounded-lg border border-[#30363d] p-4 flex flex-col justify-between relative">
            <div className="flex-1 flex items-end justify-around gap-6 pt-4">
              {epicFinancials.map((epic: { code: string; title: string; cost: number; revenue: number; profit: number; roi: number }, idx: number) => {
                const maxVal = Math.max(...epicFinancials.map((e: { cost: number; revenue: number }) => Math.max(e.cost, e.revenue))) || 1;
                const costHeight = Math.max((epic.cost / maxVal) * 120, 8); // scale factor
                const revHeight = Math.max((epic.revenue / maxVal) * 120, 8);

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 w-full text-center">
                    <div className="flex items-end gap-2.5">
                      {/* Cost Bar */}
                      <div className="w-5 bg-red-500/80 hover:bg-red-500 rounded-t transition-all relative group">
                        <div style={{ height: `${costHeight}px` }} className="w-full" />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black border border-[#30363d] text-white p-1.5 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap font-mono">
                          CAPEX: {epic.cost.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>

                      {/* Revenue Bar */}
                      <div className="w-5 bg-green-500/80 hover:bg-green-500 rounded-t transition-all relative group">
                        <div style={{ height: `${revHeight}px` }} className="w-full" />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black border border-[#30363d] text-white p-1.5 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap font-mono">
                          OPEX: {epic.revenue.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-white block">{epic.code}</span>
                      <span className="text-[9px] text-[#8b949e] truncate max-w-[100px] block" title={epic.title}>
                        {epic.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Legend */}
            <div className="flex justify-center gap-4 text-[10px] pt-3 border-t border-[#30363d]/50 font-mono">
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2 h-2 bg-red-500 rounded-sm"></span> CAPEX (Стоимость разработки)
              </span>
              <span className="flex items-center gap-1.5 text-green-400">
                <span className="w-2 h-2 bg-green-500 rounded-sm"></span> OPEX (Приток / Ценность)
              </span>
            </div>
          </div>
        </div>

        {/* CHART 2: ROI TIMELINE TREND */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Кумулятивный тренд ROI релиза Q3-Q4 (2025)</h3>
            <p className="text-xs text-[#8b949e]">Расчет возврата инвестиций в зависимости от Feature Adoption</p>
          </div>

          {/* SVG Line Chart */}
          <div className="h-64 bg-[#0d1117] rounded-lg border border-[#30363d] p-4 flex flex-col justify-between">
            <div className="flex-1 relative mt-4">
              {/* SVG Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-[#8b949e]/40 font-mono pointer-events-none">
                <div className="border-b border-[#30363d]/30 pb-1">150% ROI</div>
                <div className="border-b border-[#30363d]/30 pb-1">100% ROI</div>
                <div className="border-b border-[#30363d]/30 pb-1">50% ROI</div>
                <div className="pb-1">0% Break-even</div>
              </div>

              {/* Line graph */}
              <svg className="w-full h-full absolute inset-0 text-yellow-500" viewBox="0 0 400 120" preserveAspectRatio="none">
                <path
                  d="M 10 100 Q 100 80 180 50 T 300 20 T 390 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  className="drop-shadow-lg"
                />
                {/* Dots */}
                <circle cx="10" cy="100" r="4" fill="#f59e0b" />
                <circle cx="100" cy="81" r="4" fill="#f59e0b" />
                <circle cx="180" cy="50" r="4" fill="#f59e0b" />
                <circle cx="300" cy="20" r="4" fill="#f59e0b" />
                <circle cx="390" cy="10" r="4" fill="#f59e0b" />
              </svg>

              {/* Dot Label markers */}
              <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 text-[9px] font-mono text-[#8b949e]">
                <span>M1 (Идея)</span>
                <span>M2 (Релиз Q3)</span>
                <span>M3 (Телеметрия)</span>
                <span>M4 (Оптимизация)</span>
                <span>Текущий (Q4)</span>
              </div>
            </div>

            <div className="text-[10px] text-center text-[#8b949e] font-mono pt-3 border-t border-[#30363d]/50">
              Сквозной тренд окупаемости фич Core Payments + Support
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED LEDGER / METRIC TABLE */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-[#21262d] border-b border-[#30363d] flex items-center justify-between">
          <span className="font-semibold text-white">Финансовый реестр требований (Features Financial Ledger)</span>
          <span className="text-xs text-[#8b949e]">Фиатная валюта: Рубль (₽)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0d1117] border-b border-[#30363d] text-[#8b949e] font-semibold uppercase text-[10px] tracking-wider">
                <th className="p-4">Код & Название фичи</th>
                <th className="p-4">CAPEX (Затраты SP)</th>
                <th className="p-4">OPEX (Доходы с продаж)</th>
                <th className="p-4">Финансовый итог</th>
                <th className="p-4">ROI %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]/40">
              {store.features.map((f: Feature) => {
                const profit = f.revenueGenerated - f.developmentCost;
                const roi = f.developmentCost > 0 ? Math.round((profit / f.developmentCost) * 100) : 0;

                return (
                  <tr key={f.id} className="hover:bg-[#21262d]/10 transition-all font-mono">
                    <td className="p-4 font-sans">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#58a6ff] font-bold">{f.code}</span>
                        <span className="text-white font-semibold">{f.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-white">
                      {f.developmentCost.toLocaleString('ru-RU')} ₽ <span className="text-[#8b949e] text-[10px]">({f.effortSP} SP)</span>
                    </td>
                    <td className="p-4 text-green-400">
                      {f.revenueGenerated.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className={`p-4 font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {profit.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        roi > 100 ? 'bg-green-950 text-green-400 border border-green-900/40' :
                        roi > 0 ? 'bg-blue-950 text-blue-400 border border-blue-900/40' :
                        'bg-red-950 text-red-400 border border-red-900/40'
                      }`}>
                        {roi}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
