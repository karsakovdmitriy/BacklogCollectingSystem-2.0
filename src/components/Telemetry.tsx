'use client';

import React, { useState } from 'react';
import { Feature } from '@/store/index';
import {
  TrendingUp,
  Activity,
  Users,
  Search,
  Filter,
  BarChart4,
  ArrowUpRight,
  Sparkles,
  Award
} from 'lucide-react';

interface TelemetryProps {
  store: any;
  searchQuery: string;
}

export default function Telemetry({ store, searchQuery }: TelemetryProps) {
  // Segment Filter option (all / enterprise / sme / retail)
  const [segmentFilter, setSegmentFilter] = useState<'all' | 'enterprise' | 'sme' | 'retail'>('all');

  // Filter released features (releaseId represents released/approved features)
  const releasedFeatures = store.features.filter((f: Feature) => {
    const isReleased = f.releaseId && f.releaseId !== 'rel-draft';
    const matchesQuery = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.code.toLowerCase().includes(searchQuery.toLowerCase());
    return isReleased && matchesQuery;
  });

  // Calculate Average Adoption rates based on selected segments
  const calculateAverageAdoption = () => {
    if (releasedFeatures.length === 0) return 0;
    const sum = releasedFeatures.reduce((acc: number, f: Feature) => {
      if (segmentFilter === 'all') return acc + f.adoptionRate;
      return acc + f.segmentAdoption[segmentFilter];
    }, 0);
    return Math.round(sum / releasedFeatures.length);
  };

  const averageAdoption = calculateAverageAdoption();

  // Find the feature with highest adoption rate (Star feature)
  const getStarFeature = () => {
    if (releasedFeatures.length === 0) return null;
    return [...releasedFeatures].sort((a, b) => b.adoptionRate - a.adoptionRate)[0];
  };

  const starFeature = getStarFeature();

  return (
    <div className="space-y-6">
      {/* TELEMETRY METRICS SUMMARY BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-[#8b949e] font-medium block">Средний Feature Adoption</span>
            <div className="flex items-baseline gap-1.5">
              <strong className="text-2xl text-white font-bold font-mono">{averageAdoption}%</strong>
              <span className="text-xs text-green-400 font-mono flex items-center gap-0.5">
                <ArrowUpRight size={13} /> +4.2%
              </span>
            </div>
            <p className="text-[11px] text-[#8b949e]">Целевой показатель: &gt;70%</p>
          </div>
          <div className="p-3 bg-green-950/30 text-green-400 rounded-lg border border-green-900/40">
            <Activity size={24} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-[#8b949e] font-medium block">Активный сегмент</span>
            <strong className="text-xl text-white font-bold leading-tight">
              {segmentFilter === 'all' && 'Все пользователи'}
              {segmentFilter === 'enterprise' && 'Крупный бизнес (Enterprise)'}
              {segmentFilter === 'sme' && 'Средний/Малый бизнес (SME)'}
              {segmentFilter === 'retail' && 'Масс-маркет / Ритейл'}
            </strong>
            <p className="text-[11px] text-[#8b949e]">Фокусный сегмент Q4</p>
          </div>
          <div className="p-3 bg-blue-950/30 text-blue-400 rounded-lg border border-blue-900/40">
            <Users size={24} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-[#8b949e] font-medium block">Самая востребованная фича</span>
            {starFeature ? (
              <div className="space-y-0.5">
                <strong className="text-sm text-[#58a6ff] font-bold line-clamp-1">
                  {starFeature.title}
                </strong>
                <span className="text-xs text-[#8b949e] font-mono">Adoption: {starFeature.adoptionRate}%</span>
              </div>
            ) : (
              <span className="text-xs text-[#8b949e] italic">Нет данных</span>
            )}
          </div>
          <div className="p-3 bg-yellow-950/30 text-yellow-500 rounded-lg border border-yellow-900/40">
            <Award size={24} />
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[#8b949e]" />
          <span className="text-xs font-semibold text-white">Разрез по когортам / клиентам:</span>
        </div>

        <div className="flex bg-[#0d1117] p-1 rounded-lg border border-[#30363d] gap-1">
          <button
            onClick={() => setSegmentFilter('all')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              segmentFilter === 'all' ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            Все сегменты
          </button>
          <button
            onClick={() => setSegmentFilter('enterprise')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              segmentFilter === 'enterprise' ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            Enterprise (Крупные)
          </button>
          <button
            onClick={() => setSegmentFilter('sme')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              segmentFilter === 'sme' ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            SME (Средний)
          </button>
          <button
            onClick={() => setSegmentFilter('retail')}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              segmentFilter === 'retail' ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            Retail (Масс-маркет)
          </button>
        </div>
      </div>

      {/* HIGH DENSITY TELEMETRY GRID */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-[#21262d] border-b border-[#30363d] flex items-center justify-between">
          <span className="font-semibold text-white">Телеметрия востребованности функционала после релиза</span>
          <span className="text-xs text-green-400 font-mono bg-green-950/20 border border-green-900/30 px-2 py-0.5 rounded">
            Live Webhooks
          </span>
        </div>

        {releasedFeatures.length === 0 ? (
          <div className="p-8 text-center text-[#8b949e] italic">
            Нет выпущенных фич для сбора телеметрии. Перейдите во вкладку «Конструктор релиза» и утвердите релиз.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0d1117] border-b border-[#30363d] text-[#8b949e] font-semibold uppercase text-[10px] tracking-wider">
                  <th className="p-4">Код & Название фичи</th>
                  <th className="p-4">Adoption Rate (Выбранный сегмент)</th>
                  <th className="p-4">Активные пользователи (MAU)</th>
                  <th className="p-4">Коэффициент удержания (Retention)</th>
                  <th className="p-4">График востребованности (Live)</th>
                  <th className="p-4">Статус интеграции</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]/50">
                {releasedFeatures.map((f: Feature) => {
                  // Get adoption rate based on selected segment
                  const currentAdoption =
                    segmentFilter === 'all'
                      ? f.adoptionRate
                      : f.segmentAdoption[segmentFilter];

                  // Mock active MAU based on filter
                  const currentMAU = Math.round(
                    segmentFilter === 'all'
                      ? f.mau
                      : segmentFilter === 'enterprise'
                      ? f.mau * 0.15
                      : segmentFilter === 'sme'
                      ? f.mau * 0.35
                      : f.mau * 0.5
                  );

                  // Mock retention Rate
                  const retention = f.retentionRate || 80;

                  return (
                    <tr key={f.id} className="hover:bg-[#21262d]/25 transition-all">
                      {/* Name */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[#58a6ff] font-bold">{f.code}</span>
                            <span className="font-semibold text-white">{f.title}</span>
                          </div>
                          <p className="text-[#8b949e] line-clamp-1 max-w-sm">{f.description}</p>
                        </div>
                      </td>

                      {/* Adoption progress bar */}
                      <td className="p-4 min-w-[180px]">
                        <div className="space-y-1.5">
                          <div className="flex justify-between font-mono">
                            <span className={currentAdoption > 75 ? 'text-green-400 font-bold' : 'text-[#c9d1d9]'}>
                              {currentAdoption}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-[#0d1117] rounded-full border border-[#30363d] overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 rounded-full ${
                                currentAdoption > 75 ? 'bg-green-500' : currentAdoption > 45 ? 'bg-blue-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${currentAdoption}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* MAU */}
                      <td className="p-4 font-mono font-medium text-white">
                        {currentMAU.toLocaleString()} пользователей
                      </td>

                      {/* Retention Rate */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#c9d1d9]">{retention}%</span>
                          <span className="text-[10px] text-green-400">Стабильно</span>
                        </div>
                      </td>

                      {/* Sparkline (Visual Trend) */}
                      <td className="p-4">
                        <div className="flex items-center h-8 w-28 bg-[#0d1117]/60 border border-[#30363d]/50 rounded p-1.5">
                          <svg viewBox="0 0 100 30" className="w-full h-full text-[#58a6ff]">
                            <path
                              d={`M 0 ${30 - currentAdoption * 0.2} Q 25 ${30 - currentAdoption * 0.28} 50 ${30 - currentAdoption * 0.18} T 100 ${30 - currentAdoption * 0.26}`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <circle cx="100" cy={30 - currentAdoption * 0.26} r="2.5" fill="#58a6ff" />
                          </svg>
                        </div>
                      </td>

                      {/* Integration Webhook Telemetry */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#2ea043] bg-[#238636]/10 border border-[#238636]/30 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                          Клиентский Webhook
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
