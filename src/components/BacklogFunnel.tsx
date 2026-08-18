'use client';

import React, { useState } from 'react';
import { Request, Feature, Project, Product, Module, TaskKind, Client } from '@/store/index';
import {
  Filter,
  TrendingDown,
  Layers,
  CheckCircle2,
  Clock,
  Coins,
  Signal,
  ArrowRight,
  GitPullRequest,
  BarChart3,
  ListFilter,
  RefreshCw
} from 'lucide-react';

interface BacklogFunnelProps {
  store: any;
}

export default function BacklogFunnel({ store }: BacklogFunnelProps) {
  // Classifier Filter States
  const [filterProduct, setFilterProduct] = useState<string>('');
  const [filterProject, setFilterProject] = useState<string>('');
  const [filterModule, setFilterModule] = useState<string>('');
  const [filterTaskKind, setFilterTaskKind] = useState<string>('');
  const [filterClient, setFilterClient] = useState<string>('');
  const [filterSource, setFilterSource] = useState<string>('');

  const resetFilters = () => {
    setFilterProduct('');
    setFilterProject('');
    setFilterModule('');
    setFilterTaskKind('');
    setFilterClient('');
    setFilterSource('');
  };

  // Filter Requests (Incoming Signals)
  const filteredRequests: Request[] = store.requests.filter((r: Request) => {
    if (filterProduct && r.productId !== filterProduct) return false;
    if (filterProject && r.projectId !== filterProject) return false;
    if (filterModule && r.moduleId !== filterModule) return false;
    if (filterTaskKind && r.taskKindId !== filterTaskKind) return false;
    if (filterSource && r.source !== filterSource) return false;

    if (filterClient) {
      // Find client via request.client or project.clientId
      if (r.projectId) {
        const proj = store.projects.find((p: Project) => p.id === r.projectId);
        if (proj && proj.clientId !== filterClient) return false;
      } else if (r.client) {
        const cl = store.clients.find((c: Client) => c.id === filterClient);
        if (cl && r.client !== cl.name) return false;
      }
    }
    return true;
  });

  // Filter Features
  const filteredFeatures: Feature[] = store.features.filter((f: Feature) => {
    if (filterModule && f.subsystem) {
      const mod = store.modules.find((m: Module) => m.id === filterModule);
      if (mod && f.subsystem !== mod.name) return false;
    }
    if (filterTaskKind && f.taskKind) {
      const kind = store.taskKinds.find((k: TaskKind) => k.id === filterTaskKind);
      if (kind && f.taskKind !== kind.name) return false;
    }
    return true;
  });

  // Calculate Funnel Stages Metrics
  // 1. All Signals (Total Requests)
  const stage1_allSignals = filteredRequests.length;

  // 2. In Discovery (В проработку)
  const stage2_inDiscovery = filteredRequests.filter(r => r.status === 'В проработку').length;

  // 3. Approved Signals (Приняты)
  const stage3_approvedSignals = filteredRequests.filter(r => r.status === 'Принят').length;

  // 4. Backlog Features (Фичи в бэклоге)
  const stage4_backlogFeatures = filteredFeatures.length;

  // 5. Features In Estimation (На оценке)
  const stage5_inEstimation = filteredFeatures.filter(f => f.status === 'На оценке').length;

  // 6. Estimated Features (Оценено)
  const stage6_estimatedFeatures = filteredFeatures.filter(f => f.status === 'Оценено').length;

  // 7. Draft Release (В черновике релиза)
  const stage7_draftRelease = filteredFeatures.filter(f => f.releaseId === 'rel-draft').length;

  // 8. Approved Release (В утвержденном релизе)
  const stage8_approvedRelease = filteredFeatures.filter(f => f.releaseId && f.releaseId !== 'rel-draft').length;

  // Expert Hours & Dev Costs for Features
  const totalBacklogHours = filteredFeatures.reduce((sum, f) => sum + f.effortHours, 0);
  const totalReleaseHours = filteredFeatures
    .filter(f => f.releaseId && f.releaseId !== 'rel-draft')
    .reduce((sum, f) => sum + f.effortHours, 0);

  const totalDevCost = totalBacklogHours * 2000;
  const releaseDevCost = totalReleaseHours * 2000;

  // Stage conversion rates
  const calcConv = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round((current / previous) * 100);
  };

  const endToEndConv = stage1_allSignals > 0 ? calcConv(stage8_approvedRelease, stage1_allSignals) : 0;

  const funnelStages = [
    {
      id: 1,
      title: '1. Все входящие сигналы',
      count: stage1_allSignals,
      color: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-900/40 text-blue-400 border-blue-800',
      prevCount: null,
      desc: 'Все зарегистрированные сигналы от клиентов и из GitLab API',
      hours: null
    },
    {
      id: 2,
      title: '2. Сигналы в проработке',
      count: stage2_inDiscovery,
      color: 'from-yellow-600 to-amber-600',
      badgeColor: 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
      prevCount: stage1_allSignals,
      desc: 'Запросы с зафиксированными 8 обязательными реквизитами',
      hours: null
    },
    {
      id: 3,
      title: '3. Принятые сигналы',
      count: stage3_approvedSignals,
      color: 'from-green-600 to-emerald-600',
      badgeColor: 'bg-green-900/40 text-green-400 border-green-800',
      prevCount: stage2_inDiscovery,
      desc: 'Сигналы, одобренные продуктовым менеджером',
      hours: null
    },
    {
      id: 4,
      title: '4. Фичи в бэклоге',
      count: stage4_backlogFeatures,
      color: 'from-purple-600 to-violet-600',
      badgeColor: 'bg-purple-900/40 text-purple-400 border-purple-800',
      prevCount: stage3_approvedSignals,
      desc: 'Сформированные и привязанные фичи в продуктовом бэклоге',
      hours: totalBacklogHours
    },
    {
      id: 5,
      title: '5. На оценке трудоемкости',
      count: stage5_inEstimation,
      color: 'from-orange-600 to-amber-700',
      badgeColor: 'bg-orange-900/40 text-orange-400 border-orange-800',
      prevCount: stage4_backlogFeatures,
      desc: 'Фичи, переданные экспертам на оценку трудоемкости',
      hours: filteredFeatures.filter(f => f.status === 'На оценке').reduce((s, f) => s + f.effortHours, 0)
    },
    {
      id: 6,
      title: '6. Оценено экспертами',
      count: stage6_estimatedFeatures,
      color: 'from-teal-600 to-cyan-600',
      badgeColor: 'bg-teal-900/40 text-teal-400 border-teal-800',
      prevCount: stage5_inEstimation,
      desc: 'Фичи с подтвержденной оценкой экспертных часов',
      hours: filteredFeatures.filter(f => f.status === 'Оценено').reduce((s, f) => s + f.effortHours, 0)
    },
    {
      id: 7,
      title: '7. План релиза (Черновик)',
      count: stage7_draftRelease,
      color: 'from-sky-600 to-blue-700',
      badgeColor: 'bg-sky-900/40 text-sky-400 border-sky-800',
      prevCount: stage6_estimatedFeatures,
      desc: 'Фичи, отобранные в черновик планируемого релиза',
      hours: filteredFeatures.filter(f => f.releaseId === 'rel-draft').reduce((s, f) => s + f.effortHours, 0)
    },
    {
      id: 8,
      title: '8. Принято в релиз (Approved)',
      count: stage8_approvedRelease,
      color: 'from-emerald-600 to-green-700',
      badgeColor: 'bg-emerald-900/40 text-emerald-400 border-emerald-800',
      prevCount: stage7_draftRelease,
      desc: 'Утвержденный релиз, готовый к реализации',
      hours: totalReleaseHours
    }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <BarChart3 size={18} className="text-[#58a6ff]" />
            Анализ воронки бэклога
          </h2>
          <p className="text-xs text-[#8b949e]">
            Сквозная аналитика продвижения требований по всем 8 стадиям бэклога с расчетом поэтапной конверсии и экспертных затрат.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] font-medium text-xs transition-all"
          >
            <RefreshCw size={13} /> Сбросить фильтры
          </button>
        </div>
      </div>

      {/* CLASSIFIER FILTERS PANEL */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <ListFilter size={15} className="text-[#58a6ff]" />
          <span>Фильтры по классификаторам</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Product */}
          <div>
            <label className="block text-[#8b949e] mb-1 text-[10px] uppercase font-mono">Продукт:</label>
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded p-1.5 text-white focus:outline-none focus:border-[#58a6ff]"
            >
              <option value="">Все продукты</option>
              {store.products.map((p: Product) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Project */}
          <div>
            <label className="block text-[#8b949e] mb-1 text-[10px] uppercase font-mono">Проект:</label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded p-1.5 text-white focus:outline-none focus:border-[#58a6ff]"
            >
              <option value="">Все проекты</option>
              {store.projects.map((p: Project) => (
                <option key={p.id} value={p.id}>{store.getProjectName(p)}</option>
              ))}
            </select>
          </div>

          {/* Module */}
          <div>
            <label className="block text-[#8b949e] mb-1 text-[10px] uppercase font-mono">Модуль:</label>
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded p-1.5 text-white focus:outline-none focus:border-[#58a6ff]"
            >
              <option value="">Все модули</option>
              {store.modules.map((m: Module) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Task Kind */}
          <div>
            <label className="block text-[#8b949e] mb-1 text-[10px] uppercase font-mono">Вид задачи:</label>
            <select
              value={filterTaskKind}
              onChange={(e) => setFilterTaskKind(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded p-1.5 text-white focus:outline-none focus:border-[#58a6ff]"
            >
              <option value="">Все виды задач</option>
              {store.taskKinds.map((k: TaskKind) => (
                <option key={k.id} value={k.id}>{k.name}</option>
              ))}
            </select>
          </div>

          {/* Client */}
          <div>
            <label className="block text-[#8b949e] mb-1 text-[10px] uppercase font-mono">Клиент:</label>
            <select
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded p-1.5 text-white focus:outline-none focus:border-[#58a6ff]"
            >
              <option value="">Все клиенты</option>
              {store.clients.map((c: Client) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div>
            <label className="block text-[#8b949e] mb-1 text-[10px] uppercase font-mono">Источник:</label>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded p-1.5 text-white focus:outline-none focus:border-[#58a6ff]"
            >
              <option value="">Все источники</option>
              {store.sources.map((s: any) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TOP KPI OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-1">
          <span className="text-[#8b949e] block text-[10px]">ВСЕГО СИГНАЛОВ</span>
          <strong className="text-xl text-white block">{stage1_allSignals} шт.</strong>
          <span className="text-[10px] text-[#8b949e] font-sans">Входящие требования</span>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-1">
          <span className="text-[#8b949e] block text-[10px]">СКВОЗНАЯ КОНВЕРСИЯ</span>
          <strong className="text-xl text-green-400 block">{endToEndConv}%</strong>
          <span className="text-[10px] text-[#8b949e] font-sans">От сигнала до релиза</span>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-1">
          <span className="text-[#8b949e] block text-[10px]">ТРУДОЕМКОСТЬ БЭКЛОГА</span>
          <strong className="text-xl text-orange-400 block">{totalBacklogHours} ч.</strong>
          <span className="text-[10px] text-[#8b949e] font-sans">Суммарные экспертные часы</span>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-1">
          <span className="text-[#8b949e] block text-[10px]">ОЦЕНКА ЗАТРАТ DEV</span>
          <strong className="text-xl text-purple-400 block">₽{totalDevCost.toLocaleString()}</strong>
          <span className="text-[10px] text-[#8b949e] font-sans">Ставка 2 000 ₽ / час</span>
        </div>
      </div>

      {/* FUNNEL STAGES VISUALIZATION */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white">Стадии воронки и конверсии</h3>

        <div className="space-y-3">
          {funnelStages.map((stage, idx) => {
            const convRate = stage.prevCount !== null ? calcConv(stage.count, stage.prevCount) : null;
            const widthPct = stage1_allSignals > 0 ? Math.max(15, Math.min(100, (stage.count / Math.max(1, stage1_allSignals)) * 100)) : 100;

            return (
              <div key={stage.id} className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${stage.badgeColor}`}>
                      {stage.title}
                    </span>
                    <span className="text-xs text-[#8b949e] font-sans hidden sm:inline">{stage.desc}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    {stage.hours !== null && stage.hours > 0 && (
                      <span className="text-orange-400 font-bold">{stage.hours} ч.</span>
                    )}
                    <span className="text-white font-bold text-sm bg-[#21262d] px-2.5 py-0.5 rounded border border-[#30363d]">
                      {stage.count} шт.
                    </span>
                    {convRate !== null && (
                      <span className="text-xs font-bold text-green-400 bg-green-950/40 border border-green-900 px-2 py-0.5 rounded">
                        {convRate}% conv
                      </span>
                    )}
                  </div>
                </div>

                {/* Funnel Progress Bar */}
                <div className="w-full bg-[#161b22] h-3 rounded-full overflow-hidden border border-[#30363d]">
                  <div
                    className={`h-full bg-gradient-to-r ${stage.color} transition-all duration-500 rounded-full`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
