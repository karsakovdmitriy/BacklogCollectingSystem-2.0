'use client';

import React, { useState } from 'react';
import { useProductState } from '@/store/useProductState';
import BacklogPanel from '@/components/BacklogPanel';
import IncomingAnalysis from '@/components/IncomingAnalysis';
import ReleasePlanner from '@/components/ReleasePlanner';
import Telemetry from '@/components/Telemetry';
import PnLDashboard from '@/components/PnLDashboard';
import SettingsPanel from '@/components/SettingsPanel';

import {
  Layers,
  CalendarRange,
  Gauge,
  TrendingUp,
  Database,
  Cpu,
  Search,
  User,
  Inbox,
  Settings
} from 'lucide-react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const store = useProductState();
  const [activeTab, setActiveTab] = useState<'backlog' | 'incoming' | 'release' | 'telemetry' | 'pnl' | 'settings'>('incoming');
  const [showLogs, setShowLogs] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Calculations for quick Sidebar Indicators
  const totalFeatures = store.features.length;
  const draftFeaturesCount = store.features.filter((f: any) => f.releaseId === 'rel-draft').length;
  const approvedFeaturesCount = store.features.filter((f: any) => f.releaseId && f.releaseId !== 'rel-draft').length;

  const activeRelease = store.releases.find((r: any) => r.id === 'rel-draft');
  const activeReleaseCapacity = activeRelease ? activeRelease.capacitySP : 20;

  const draftFeatures = store.features.filter((f: any) => f.releaseId === 'rel-draft');
  const currentDraftLoad = draftFeatures.reduce((sum: number, f: any) => sum + f.effortSP, 0);

  return (
    <div className="flex h-screen overflow-hidden text-sm font-sans bg-[#0d1117]">
      {/* LEFT SIDEBAR - Enterprise Style */}
      <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-80'} bg-[#161b22] border-r border-[#30363d] flex flex-col justify-between shrink-0 transition-all duration-300 relative`}>
        <div>
          {/* Brand Logo & Product Name */}
          <div className="p-4 border-b border-[#30363d] flex items-center justify-between gap-3 overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#21262d] rounded-lg border border-[#30363d] text-[#58a6ff]">
                <Cpu size={22} className="animate-pulse" />
              </div>
              {!isSidebarCollapsed && (
                <div>
                  <h1 className="font-semibold text-white tracking-wide leading-tight text-xs sm:text-sm">PM-COCKPIT v1.2</h1>
                  <p className="text-[10px] sm:text-xs text-[#8b949e]">Сквозная Аналитика & Релизы</p>
                </div>
              )}
            </div>

            {/* Collapse Toggle Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 rounded hover:bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white"
              title={isSidebarCollapsed ? 'Развернуть' : 'Свернуть'}
            >
              {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>

          {/* Quick Metrics KPI Bar */}
          {!isSidebarCollapsed && (
            <div className="grid grid-cols-2 gap-2 p-4 border-b border-[#30363d] bg-[#0d1117]/50 text-xs">
              <div className="p-2 rounded bg-[#21262d] border border-[#30363d]">
                <span className="text-[#8b949e] block text-[10px]">В БЭКЛОГЕ</span>
                <strong className="text-lg text-white">{totalFeatures} фич</strong>
              </div>
              <div className="p-2 rounded bg-[#21262d] border border-[#30363d]">
                <span className="text-[#8b949e] block text-[10px]">В ЧЕРНОВИКЕ</span>
                <strong className="text-lg text-[#58a6ff]">{draftFeaturesCount} фич</strong>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {/* NEW TAB: INCOMING TASK ANALYSIS */}
            <button
              onClick={() => setActiveTab('incoming')}
              title="Анализ входящих задач"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'incoming'
                  ? 'bg-[#1f6feb] text-white'
                  : 'text-[#c9d1d9] hover:bg-[#21262d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox size={18} />
                {!isSidebarCollapsed && <span>Анализ входящих задач</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className="text-[11px] bg-red-900/60 border border-red-800 px-1.5 py-0.5 rounded text-white font-mono animate-pulse">
                  {store.requests.filter((r: any) => r.status === 'В проработку').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('backlog')}
              title="Бэклог и Приоритизация"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'backlog'
                  ? 'bg-[#1f6feb] text-white'
                  : 'text-[#c9d1d9] hover:bg-[#21262d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers size={18} />
                {!isSidebarCollapsed && <span>Бэклог и Приоритизация</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className="text-[11px] bg-[#30363d] px-1.5 py-0.5 rounded text-[#8b949e]">
                  {store.features.filter((f: any) => !f.releaseId).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('release')}
              title="Конструктор Релиза"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'release'
                  ? 'bg-[#1f6feb] text-white'
                  : 'text-[#c9d1d9] hover:bg-[#21262d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CalendarRange size={18} />
                {!isSidebarCollapsed && <span>Конструктор Релиза</span>}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex items-center gap-1 text-[11px]">
                  <span className={`px-1.5 py-0.5 rounded font-mono ${currentDraftLoad > activeReleaseCapacity ? 'bg-red-900/40 text-red-400 border border-red-800' : 'bg-green-900/40 text-green-400 border border-green-800'}`}>
                    {currentDraftLoad}/{activeReleaseCapacity} SP
                  </span>
                </div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              title="Телеметрия & Adoption"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'telemetry'
                  ? 'bg-[#1f6feb] text-white'
                  : 'text-[#c9d1d9] hover:bg-[#21262d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Gauge size={18} />
                {!isSidebarCollapsed && <span>Телеметрия & Adoption</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className="text-[11px] bg-[#30363d] px-1.5 py-0.5 rounded text-[#8b949e]">
                  {approvedFeaturesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('pnl')}
              title="Executive ROI и P&L"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'pnl'
                  ? 'bg-[#1f6feb] text-white'
                  : 'text-[#c9d1d9] hover:bg-[#21262d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp size={18} />
                {!isSidebarCollapsed && <span>Executive ROI и P&L</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className="text-[11px] bg-green-900/60 text-green-400 px-1.5 py-0.5 rounded border border-green-800 font-mono font-bold">
                  ROI
                </span>
              )}
            </button>

            {/* NEW TAB: SETTINGS */}
            <button
              onClick={() => setActiveTab('settings')}
              title="Настройки"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#1f6feb] text-white'
                  : 'text-[#c9d1d9] hover:bg-[#21262d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings size={18} />
                {!isSidebarCollapsed && <span>Настройки</span>}
              </div>
            </button>
          </nav>

          {/* Quick Stats & System Config */}
          {!isSidebarCollapsed && (
            <div className="px-4 py-2">
              <div className="bg-[#21262d] p-3 rounded-lg border border-[#30363d]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white">Интеграции</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-green-400 bg-green-900/30 px-1.5 py-0.2 rounded border border-green-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    Активно
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-[#8b949e]">
                  <div className="flex justify-between">
                    <span>GitLab Webhooks</span>
                    <span className="text-[#c9d1d9] font-mono">200 OK</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ИТС / CRM Синхронизатор</span>
                    <span className="text-[#c9d1d9]">В сети</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Audit Logs Quick View in Sidebar Drawer */}
        <div className="p-3 border-t border-[#30363d] space-y-2 bg-[#0d1117]/30">
          {!isSidebarCollapsed ? (
            <>
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white text-xs"
              >
                <span className="flex items-center gap-1.5 font-mono">
                  <Database size={14} />
                  Журнал аудита ({store.auditLogs.length})
                </span>
                <span className="text-[10px]">{showLogs ? 'Скрыть' : 'Показать'}</span>
              </button>

              {showLogs && (
                <div className="h-44 overflow-y-auto bg-[#0d1117] border border-[#30363d] rounded p-2 space-y-2 text-[11px] font-mono scrollbar-thin">
                  {store.auditLogs.map((log: any) => (
                    <div key={log.id} className="border-b border-[#21262d] pb-1.5 last:border-0 last:pb-0">
                      <div className="flex justify-between text-[#8b949e] text-[10px] mb-0.5">
                        <span>{log.timestamp}</span>
                        <span className="text-[#58a6ff]">{log.action}</span>
                      </div>
                      <p className="text-[#c9d1d9] leading-tight break-words">{log.details}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Developer / Admin Options */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (confirm('Вы уверены, что хотите сбросить все данные к исходным демонстрационным значениям?')) {
                      store.resetAllState();
                    }
                  }}
                  className="flex-1 py-1 px-2 rounded bg-red-950/20 hover:bg-red-950/40 border border-red-900 text-red-400 text-xs text-center transition-all"
                >
                  Сброс демо-данных
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => {
                  if (confirm('Вы уверены, что хотите сбросить все данные?')) {
                    store.resetAllState();
                  }
                }}
                className="p-1.5 rounded bg-red-950/20 hover:bg-red-950/40 border border-red-900 text-red-400"
                title="Сброс демо-данных"
              >
                <Database size={14} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col h-full bg-[#0d1117] overflow-hidden">
        {/* HEADER BAR */}
        <header className="h-16 border-b border-[#30363d] bg-[#161b22] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[#8b949e] font-mono text-xs">НАВИГАЦИЯ</span>
            <span className="text-[#30363d]">/</span>
            <span className="text-white font-medium">
              {activeTab === 'backlog' && 'Сквозной Бэклог и Управление Приоритизацией'}
              {activeTab === 'incoming' && 'Анализ входящих задач (Product Signals & Inbox)'}
              {activeTab === 'release' && 'Конструктор и Утверждение Релиза (Release Planner)'}
              {activeTab === 'telemetry' && 'Каталог Фич и Телеметрия (Feature Adoption)'}
              {activeTab === 'pnl' && 'Executive P&L и ROI Дашборд'}
              {activeTab === 'settings' && 'Системные Настройки Справочников'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 text-[#8b949e]" size={15} />
              <input
                type="text"
                placeholder="Поиск по системе..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 w-64 rounded bg-[#0d1117] border border-[#30363d] focus:outline-none focus:border-[#58a6ff] text-xs text-white"
              />
            </div>

            <div className="h-6 w-[1px] bg-[#30363d]" />

            <div className="flex items-center gap-2 bg-[#21262d] py-1 px-2.5 rounded border border-[#30363d] text-xs text-white">
              <User size={14} className="text-[#58a6ff]" />
              <span>pm_current@corp.ru</span>
              <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-1 py-0.2 rounded border border-yellow-500/20">PM / Owner</span>
            </div>
          </div>
        </header>

        {/* WORKSPACE VIEW CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'backlog' && (
            <BacklogPanel store={store} searchQuery={searchQuery} />
          )}
          {activeTab === 'incoming' && (
            <IncomingAnalysis store={store} />
          )}
          {activeTab === 'release' && (
            <ReleasePlanner store={store} searchQuery={searchQuery} />
          )}
          {activeTab === 'telemetry' && (
            <Telemetry store={store} searchQuery={searchQuery} />
          )}
          {activeTab === 'pnl' && (
            <PnLDashboard store={store} />
          )}
          {activeTab === 'settings' && (
            <SettingsPanel store={store} />
          )}
        </div>
      </main>
    </div>
  );
}
