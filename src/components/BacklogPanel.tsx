'use client';

import React, { useState } from 'react';
import {
  Epic,
  Initiative,
  Feature,
  Task,
  DictionaryItem,
} from '@/store/index';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  GitBranch,
  ShieldAlert,
  Edit2,
  Settings,
  LayoutGrid,
  Network,
  ArrowUpDown,
  Layers,
  FolderKanban,
  HelpCircle,
  Tag,
  Clock,
  Coins,
  Signal,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface BacklogPanelProps {
  store: any;
  searchQuery: string;
}

export default function BacklogPanel({ store, searchQuery }: BacklogPanelProps) {
  // Views, Grouping and Sorting States
  const [viewMode, setViewMode] = useState<'tree' | 'dashboard'>('tree');
  const [groupBy, setGroupBy] = useState<'epic' | 'subsystem' | 'taskKind'>('epic');
  const [sortBy, setSortBy] = useState<'priority' | 'autoScore' | 'sp' | 'alphabetical'>('priority');

  // Collapsed states for Group Headers in Tree View
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Modals & form state
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Override Form State
  const [selectedFeatureForOverride, setSelectedFeatureForOverride] = useState<Feature | null>(null);
  const [overrideScoreValue, setOverrideScoreValue] = useState<string>('');
  const [overrideReasonValue, setOverrideReasonValue] = useState<string>('');

  // Add Task Form State
  const [selectedFeatureForTask, setSelectedFeatureForTask] = useState<Feature | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDeveloper, setNewTaskDeveloper] = useState('');
  const [newTaskSP, setNewTaskSP] = useState(3);

  // Manual Feature Creation Form State
  const [newFeatTitle, setNewFeatTitle] = useState('');
  const [newFeatDesc, setNewFeatDesc] = useState('');
  const [newFeatInitId, setNewFeatInitId] = useState('');
  const [newFeatHours, setNewFeatHours] = useState(40);
  const [newFeatSP, setNewFeatSP] = useState(5);
  const [newFeatSalesImpact, setNewFeatSalesImpact] = useState<1|2|3|4|5>(3);
  const [newFeatItsPriority, setNewFeatItsPriority] = useState<1|2|3|4|5>(3);
  const [newFeatSubsystem, setNewFeatSubsystem] = useState('');
  const [newFeatTaskKind, setNewFeatTaskKind] = useState('');

  // Helper toggle collapse
  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Submit PM Priority Override
  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeatureForOverride) return;
    if (!overrideReasonValue.trim()) {
      alert('Пожалуйста, укажите обязательную причину переопределения оценки для аудита!');
      return;
    }
    const scoreNum = overrideScoreValue ? parseInt(overrideScoreValue) : undefined;
    store.overrideFeatureScore(selectedFeatureForOverride.id, scoreNum, overrideReasonValue);

    setSelectedFeatureForOverride(null);
    setOverrideScoreValue('');
    setOverrideReasonValue('');
    setIsOverrideModalOpen(false);
  };

  // Submit Add Task
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

  // Submit Add Feature
  const handleFeatureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatTitle.trim() || !newFeatInitId) return;

    store.addFeature({
      initiativeId: newFeatInitId,
      title: newFeatTitle,
      description: newFeatDesc,
      effortHours: Number(newFeatHours),
      effortSP: Number(newFeatSP),
      repeatabilityCount: 1,
      salesImpact: newFeatSalesImpact,
      itsPriority: newFeatItsPriority,
      releaseId: null,
      subsystem: newFeatSubsystem || undefined,
      taskKind: newFeatTaskKind || undefined,
    });

    setNewFeatTitle('');
    setNewFeatDesc('');
    setNewFeatSubsystem('');
    setNewFeatTaskKind('');
    setIsFeatureModalOpen(false);
  };

  // ----------------------------------------------------
  // FILTER, GROUP & SORT ARCHITECTURE
  // ----------------------------------------------------

  // 1. Base query match
  const matchesSearch = (f: Feature) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      f.title.toLowerCase().includes(query) ||
      f.code.toLowerCase().includes(query) ||
      (f.description && f.description.toLowerCase().includes(query))
    );
  };

  const baseFilteredFeatures: Feature[] = store.features.filter(matchesSearch);

  // 2. Identify all possible groups based on current setting
  interface GroupDefinition {
    id: string;
    name: string;
    code?: string;
    description?: string;
  }

  let groups: GroupDefinition[] = [];

  if (groupBy === 'epic') {
    // Grouping by Epic (directly mapped skipping Initiatives)
    groups = store.epics.map((ep: Epic) => ({
      id: ep.id,
      name: ep.title,
      code: ep.code,
      description: ep.description,
    }));
    // Plus "Unclassified" column if some features don't resolve to an epic
    groups.push({
      id: 'unassigned-epic',
      name: 'Без Эпика / Стратегического направления',
      code: 'EPIC-NONE',
    });
  } else if (groupBy === 'subsystem') {
    // Grouping by Subsystem
    const uniqueSubs = Array.from(new Set(store.features.map((f: Feature) => f.subsystem).filter(Boolean))) as string[];
    groups = uniqueSubs.map((subName) => ({
      id: `subsystem-${subName}`,
      name: subName,
      code: 'SUB',
    }));
    // Unassigned
    groups.push({
      id: 'unassigned-subsystem',
      name: 'Без подсистемы',
      code: 'SUB-NONE',
    });
  } else if (groupBy === 'taskKind') {
    // Grouping by Task Kind
    const uniqueKinds = Array.from(new Set(store.features.map((f: Feature) => f.taskKind).filter(Boolean))) as string[];
    groups = uniqueKinds.map((kindName) => ({
      id: `kind-${kindName}`,
      name: kindName,
      code: 'KIND',
    }));
    // Unassigned
    groups.push({
      id: 'unassigned-kind',
      name: 'Без вида задач',
      code: 'KIND-NONE',
    });
  }

  // 3. Helper to determine which group a Feature belongs to
  const getFeatureGroup = (feat: Feature): string => {
    if (groupBy === 'epic') {
      const initiative = store.initiatives.find((i: Initiative) => i.id === feat.initiativeId);
      if (initiative && initiative.epicId) {
        return initiative.epicId;
      }
      return 'unassigned-epic';
    } else if (groupBy === 'subsystem') {
      return feat.subsystem ? `subsystem-${feat.subsystem}` : 'unassigned-subsystem';
    } else {
      return feat.taskKind ? `kind-${feat.taskKind}` : 'unassigned-kind';
    }
  };

  // 4. Sort features according to chosen setting
  const sortFeatures = (feats: Feature[]): Feature[] => {
    return [...feats].sort((a, b) => {
      const getPriority = (f: Feature) => (f.overrideScore !== undefined ? f.overrideScore : f.autoScore);
      if (sortBy === 'priority') {
        return getPriority(b) - getPriority(a);
      } else if (sortBy === 'autoScore') {
        return b.autoScore - a.autoScore;
      } else if (sortBy === 'sp') {
        return b.effortSP - a.effortSP;
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  };

  // 5. Aggregate metrics higher in the hierarchy (calculated for a specific group of features)
  const calculateGroupMetrics = (groupId: string) => {
    const groupFeats = baseFilteredFeatures.filter((f) => getFeatureGroup(f) === groupId);

    const totalSP = groupFeats.reduce((sum, f) => sum + f.effortSP, 0);
    const totalHours = groupFeats.reduce((sum, f) => sum + f.effortHours, 0);
    const totalSignals = groupFeats.reduce((sum, f) => sum + f.repeatabilityCount, 0);
    const totalRevenue = groupFeats.reduce((sum, f) => sum + f.revenueGenerated, 0);
    const totalDevCost = groupFeats.reduce((sum, f) => sum + f.developmentCost, 0);
    const featureCount = groupFeats.length;

    return {
      totalSP,
      totalHours,
      totalSignals,
      totalRevenue,
      totalDevCost,
      featureCount,
    };
  };

  return (
    <div className="space-y-6">
      {/* 1. EXTENDED CONTROL BAR: VIEW MODE, GROUPING, SORTING */}
      <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-white">Управление бэклогом и приоритизацией</h2>
            <p className="text-xs text-[#8b949e]">
              Сквозное моделирование требований без промежуточных инициатив в иерархии. Выберите тип представления, группировку и метрики.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (store.initiatives.length > 0) {
                  setNewFeatInitId(store.initiatives[0].id);
                }
                if (store.subsystems.length > 0) {
                  setNewFeatSubsystem(store.subsystems[0].name);
                }
                if (store.taskKinds.length > 0) {
                  setNewFeatTaskKind(store.taskKinds[0].name);
                }
                setIsFeatureModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white font-medium transition-all text-xs shadow-lg"
            >
              <Plus size={16} />
              Создать Фичу
            </button>
          </div>
        </div>

        {/* Dynamic Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-[#30363d]/50 text-xs">
          {/* View Mode Toggle */}
          <div className="space-y-1.5">
            <label className="text-[#8b949e] font-medium block">Режим представления:</label>
            <div className="flex items-center bg-[#0d1117] p-1 rounded-lg border border-[#30363d] w-fit">
              <button
                onClick={() => setViewMode('tree')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  viewMode === 'tree'
                    ? 'bg-[#21262d] text-white border border-[#30363d]'
                    : 'text-[#8b949e] hover:text-white'
                }`}
              >
                <Network size={14} />
                Дерево (Tree)
              </button>
              <button
                onClick={() => setViewMode('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  viewMode === 'dashboard'
                    ? 'bg-[#21262d] text-white border border-[#30363d]'
                    : 'text-[#8b949e] hover:text-white'
                }`}
              >
                <LayoutGrid size={14} />
                Дашборд (Board)
              </button>
            </div>
          </div>

          {/* Grouping Select */}
          <div className="space-y-1.5">
            <label className="text-[#8b949e] font-medium block">Группировка сущностей:</label>
            <div className="flex items-center bg-[#0d1117] p-1 rounded-lg border border-[#30363d] w-fit">
              <button
                onClick={() => setGroupBy('epic')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-all ${
                  groupBy === 'epic'
                    ? 'bg-[#21262d] text-white border border-[#30363d]'
                    : 'text-[#8b949e] hover:text-white'
                }`}
              >
                <Layers size={13} />
                Эпик
              </button>
              <button
                onClick={() => setGroupBy('subsystem')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-all ${
                  groupBy === 'subsystem'
                    ? 'bg-[#21262d] text-white border border-[#30363d]'
                    : 'text-[#8b949e] hover:text-white'
                }`}
              >
                <Settings size={13} />
                Подсистема
              </button>
              <button
                onClick={() => setGroupBy('taskKind')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-all ${
                  groupBy === 'taskKind'
                    ? 'bg-[#21262d] text-white border border-[#30363d]'
                    : 'text-[#8b949e] hover:text-white'
                }`}
              >
                <FolderKanban size={13} />
                Вид задач
              </button>
            </div>
          </div>

          {/* Sorting Select */}
          <div className="space-y-1.5">
            <label className="text-[#8b949e] font-medium block">Варианты сортировки фич:</label>
            <div className="flex items-center bg-[#0d1117] p-1.5 rounded-lg border border-[#30363d] text-white">
              <ArrowUpDown size={14} className="text-[#8b949e] mr-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-white focus:outline-none focus:ring-0 text-xs w-full cursor-pointer font-medium"
              >
                <option value="priority">По приоритету (Итог) [Max ➔ Min]</option>
                <option value="autoScore">По авто-оценке (Auto Score) [Max ➔ Min]</option>
                <option value="sp">По трудоемкости (Story Points) [Max ➔ Min]</option>
                <option value="alphabetical">По алфавиту [А ➔ Я]</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN PRESENTATION SWITCH */}

      {viewMode === 'tree' ? (
        /* ==================== TREE VIEW (ДЕРЕВО) ==================== */
        <div className="space-y-4">
          {groups.map((group) => {
            const groupFeatures = baseFilteredFeatures.filter((f) => getFeatureGroup(f) === group.id);
            if (groupFeatures.length === 0 && searchQuery) return null; // Skip empty groups on search

            const metrics = calculateGroupMetrics(group.id);
            const sortedGroupFeats = sortFeatures(groupFeatures);
            const isCollapsed = collapsedGroups[group.id];

            return (
              <div key={group.id} className="border border-[#30363d] rounded-xl bg-[#0d1117]/40 overflow-hidden shadow-sm">
                {/* Parent Group Header (Tree Mode) */}
                <div className="p-4 bg-[#161b22] border-b border-[#30363d] flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className="text-[#8b949e] hover:text-white p-1 rounded hover:bg-[#21262d]"
                    >
                      {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        {group.code && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#388bfd]/10 text-[#58a6ff] border border-[#388bfd]/20 font-bold">
                            {group.code}
                          </span>
                        )}
                        <h3 className="font-bold text-sm text-white">{group.name}</h3>
                      </div>
                      {group.description && (
                        <p className="text-xs text-[#8b949e] mt-1 leading-normal max-w-2xl">{group.description}</p>
                      )}
                    </div>
                  </div>

                  {/* AGGREGATED METRICS SHOWN HIGHER IN HIERARCHY */}
                  <div className="flex flex-wrap items-center gap-2 font-mono">
                    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-[11px] text-center min-w-[70px]">
                      <span className="text-[9px] text-[#8b949e] block font-sans">ФИЧИ</span>
                      <strong className="text-[#58a6ff]">{metrics.featureCount} шт</strong>
                    </div>
                    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-[11px] text-center min-w-[80px]">
                      <span className="text-[9px] text-[#8b949e] block font-sans">ОБЪЕМ SP</span>
                      <strong className="text-purple-400">{metrics.totalSP} SP</strong>
                    </div>
                    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-[11px] text-center min-w-[80px]">
                      <span className="text-[9px] text-[#8b949e] block font-sans">Трудоемкость</span>
                      <strong className="text-orange-400">{metrics.totalHours} ч</strong>
                    </div>
                    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-[11px] text-center min-w-[80px]">
                      <span className="text-[9px] text-[#8b949e] block font-sans">СИГНАЛЫ</span>
                      <strong className="text-green-400">{metrics.totalSignals} шт</strong>
                    </div>
                    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-[11px] text-center min-w-[100px]">
                      <span className="text-[9px] text-[#8b949e] block font-sans">ВЫРУЧКА ИТС</span>
                      <strong className="text-green-400">₽{metrics.totalRevenue.toLocaleString()}</strong>
                    </div>
                    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-[11px] text-center min-w-[100px]">
                      <span className="text-[9px] text-[#8b949e] block font-sans">DEV СТОИМОСТЬ</span>
                      <strong className="text-red-400">₽{metrics.totalDevCost.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                {/* Features list under Parent Group */}
                {!isCollapsed && (
                  <div className="p-4 space-y-3 bg-[#0d1117]/20">
                    {sortedGroupFeats.length === 0 ? (
                      <p className="text-xs text-[#8b949e] italic p-2">В этой группе пока нет фич бэклога.</p>
                    ) : (
                      sortedGroupFeats.map((feat) => {
                        const featureTasks = store.tasks.filter((t: Task) => t.featureId === feat.id);
                        const currentScore = feat.overrideScore !== undefined ? feat.overrideScore : feat.autoScore;
                        const isOverridden = feat.overrideScore !== undefined;

                        return (
                          <div key={feat.id} className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-[#444c56] transition-all space-y-3">
                            {/* Feature Row header */}
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="space-y-1.5 max-w-3xl">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#238636]/20 text-[#2ea043] border border-[#238636]/30 font-bold">
                                    {feat.code}
                                  </span>
                                  <h4 className="font-bold text-white text-sm">{feat.title}</h4>

                                  {/* Subsystem & TaskKind Badges */}
                                  {feat.subsystem && (
                                    <span className="text-[10px] bg-[#21262d] px-2 py-0.5 rounded text-white border border-[#30363d] flex items-center gap-1">
                                      <Settings size={10} /> {feat.subsystem}
                                    </span>
                                  )}
                                  {feat.taskKind && (
                                    <span className="text-[10px] bg-purple-900/20 text-purple-400 border border-purple-800/30 px-2 py-0.5 rounded flex items-center gap-1">
                                      <FolderKanban size={10} /> {feat.taskKind}
                                    </span>
                                  )}

                                  {feat.releaseId && (
                                    <span className={`text-[9px] px-2 py-0.5 rounded border font-mono font-bold ${
                                      feat.releaseId === 'rel-draft'
                                        ? 'bg-[#1f6feb]/10 text-[#58a6ff] border-[#1f6feb]/30'
                                        : 'bg-green-950 text-green-400 border-green-800/40'
                                    }`}>
                                      {feat.releaseId === 'rel-draft' ? 'В ЧЕРНОВИКЕ РЕЛИЗА' : 'ВЫПУЩЕН В РЕЛИЗ'}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-[#8b949e] leading-relaxed">{feat.description}</p>
                              </div>

                              {/* Priority Override & Action Column */}
                              <div className="flex items-center gap-2 bg-[#0d1117] p-2 rounded-lg border border-[#30363d] text-xs font-mono">
                                <div className="text-center px-1.5">
                                  <span className="text-[9px] text-[#8b949e] block font-sans">AUTO SCORE</span>
                                  <strong className="text-white">{feat.autoScore}</strong>
                                </div>
                                <div className="text-center border-l border-[#30363d] px-1.5">
                                  <span className="text-[9px] text-[#8b949e] block font-sans">OVERRIDE</span>
                                  {isOverridden ? (
                                    <strong className="text-yellow-500 flex items-center gap-0.5">
                                      {feat.overrideScore}
                                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                                    </strong>
                                  ) : (
                                    <span className="text-[#8b949e] italic">—</span>
                                  )}
                                </div>
                                <div className="text-center border-l border-[#30363d] px-1.5">
                                  <span className="text-[9px] text-[#8b949e] block font-sans">ИТОГ</span>
                                  <strong className="text-green-400 text-sm">{currentScore}</strong>
                                </div>
                                <button
                                  onClick={() => {
                                    setSelectedFeatureForOverride(feat);
                                    setOverrideScoreValue(feat.overrideScore !== undefined ? String(feat.overrideScore) : '');
                                    setOverrideReasonValue(feat.overrideReason || '');
                                    setIsOverrideModalOpen(true);
                                  }}
                                  title="Переопределить приоритет PM-ом"
                                  className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#8b949e] hover:text-white"
                                >
                                  <Edit2 size={13} />
                                </button>
                              </div>
                            </div>

                            {/* Overridden Reason Banner */}
                            {isOverridden && (
                              <div className="bg-yellow-950/20 border border-yellow-800/30 p-2.5 rounded-lg text-xs text-yellow-500 flex items-start gap-1.5 font-mono">
                                <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                                <div className="w-full flex justify-between items-center">
                                  <span><strong>PM аудит ручной корректировки:</strong> {feat.overrideReason}</span>
                                  <button
                                    onClick={() => store.resetFeatureOverride(feat.id)}
                                    className="underline text-white hover:text-yellow-400 text-[10px]"
                                  >
                                    [Сбросить]
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Feature-level short data attributes */}
                            <div className="flex flex-wrap gap-4 text-[10px] text-[#8b949e] font-mono py-1 border-t border-[#30363d]/40">
                              <div>SP: <span className="text-[#c9d1d9]">{feat.effortSP} SP</span></div>
                              <div>Часы: <span className="text-[#c9d1d9]">{feat.effortHours}h</span></div>
                              <div>Сигналы (ИТС/GitLab): <span className="text-[#c9d1d9]">{feat.repeatabilityCount} шт</span></div>
                              <div>Стоимость разработки: <span className="text-[#c9d1d9]">₽{feat.developmentCost.toLocaleString()}</span></div>
                            </div>

                            {/* Linked requests block */}
                            {(() => {
                              const assocReqs = store.requests.filter((r: any) => r.associatedFeatureId === feat.id);
                              if (assocReqs.length === 0) return null;
                              return (
                                <div className="space-y-1 py-1.5 border-t border-[#30363d]/30">
                                  <span className="text-[10px] text-[#8b949e] font-sans block font-semibold">Связанные входящие сигналы ({assocReqs.length}):</span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {assocReqs.map((r: any) => (
                                      <span
                                        key={r.id}
                                        className="inline-flex items-center gap-1.5 bg-[#2ea043]/10 text-[#2ea043] border border-[#2ea043]/20 text-[10px] px-2 py-0.5 rounded-md font-mono"
                                        title={r.description}
                                      >
                                        <Signal size={10} />
                                        {r.code} - {r.client} ({r.project})
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Technical Tasks Section */}
                            <div className="space-y-1.5 pt-2 border-t border-[#30363d]/40">
                              <div className="flex items-center justify-between text-[11px] text-[#8b949e]">
                                <span className="font-semibold text-white flex items-center gap-1 font-mono">
                                  <Settings size={12} /> Задачи декомпозиции GitLab ({featureTasks.length})
                                </span>
                                <button
                                  onClick={() => {
                                    setSelectedFeatureForTask(feat);
                                    setIsTaskModalOpen(true);
                                  }}
                                  className="text-[#58a6ff] hover:underline flex items-center gap-0.5 font-sans"
                                >
                                  <Plus size={11} /> Добавить подзадачу
                                </button>
                              </div>

                              <div className="space-y-1">
                                {featureTasks.map((task: Task) => (
                                  <div key={task.id} className="flex items-center justify-between p-2 rounded bg-[#0d1117] border border-[#30363d]/40 text-xs font-mono">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[#8b949e]">{task.code}</span>
                                      <span className="text-[#c9d1d9] font-sans">{task.title}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px]">
                                      <span className="text-[#8b949e]">Разработчик: {task.developer}</span>
                                      <span className="bg-[#21262d] px-1.5 py-0.5 rounded text-white border border-[#30363d]">{task.sp} SP</span>
                                      {task.gitlabUrl ? (
                                        <a
                                          href={task.gitlabUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-[#58a6ff] hover:underline flex items-center gap-0.5"
                                        >
                                          <GitBranch size={10} /> GitLab
                                        </a>
                                      ) : (
                                        <span className="text-yellow-600">Локально</span>
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
      ) : (
        /* ==================== DASHBOARD VIEW (ДАШБОРД) ==================== */
        <div className="flex flex-col lg:flex-row gap-6 h-[650px] overflow-hidden items-stretch">
          {/* Draggable Inbox Column */}
          <div className="w-full lg:w-80 shrink-0 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col h-full overflow-hidden shadow-xl">
            {/* Header */}
            <div className="p-4 bg-[#21262d]/50 border-b border-[#30363d] space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Signal size={14} className="text-[#58a6ff] animate-pulse" />
                  Входящие сигналы (Inbox)
                </h3>
                <span className="bg-[#30363d] text-[#c9d1d9] text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                  {store.requests.filter((r: any) => !r.associatedFeatureId && r.status !== 'Отклонен').length}
                </span>
              </div>
              <p className="text-[10px] text-[#8b949e] leading-snug">
                Перетащите сигнал на колонку Эпика для смены Эпика, или на карточку Фичи для моментальной привязки (примет запрос).
              </p>
            </div>

            {/* List */}
            <div className="p-3 space-y-3 overflow-y-auto flex-1 bg-[#0d1117]/20 scrollbar-thin">
              {(() => {
                const pendingReqs = store.requests.filter((r: any) => !r.associatedFeatureId && r.status !== 'Отклонен');
                if (pendingReqs.length === 0) {
                  return (
                    <div className="py-12 text-center text-[#8b949e] text-xs italic">
                      Нет активных входящих сигналов.
                    </div>
                  );
                }
                return pendingReqs.map((req: any) => (
                  <div
                    key={req.id}
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'request', requestId: req.id }));
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] transition-all cursor-grab active:cursor-grabbing space-y-2 shadow-md relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-900/20 text-purple-400 border border-purple-800/30">
                        {req.code}
                      </span>
                      <span className="text-[9px] text-[#8b949e] font-mono">
                        {req.source}
                      </span>
                    </div>
                    <h5 className="font-semibold text-xs text-white leading-snug group-hover:text-[#58a6ff] transition-colors">{req.title}</h5>
                    <p className="text-[10px] text-[#8b949e] line-clamp-2 leading-relaxed">{req.description}</p>
                    <div className="flex flex-wrap gap-1 text-[9px] text-[#8b949e] pt-1 border-t border-[#30363d]/40 font-mono">
                      <div>Клиент: <span className="text-white">{req.client || '—'}</span></div>
                      <div>Проект: <span className="text-white">{req.project || '—'}</span></div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Main Group Columns */}
          <div className="flex-1 flex gap-6 overflow-x-auto h-full pb-2 items-stretch scrollbar-thin">
            {groups.map((group) => {
              const groupFeatures = baseFilteredFeatures.filter((f) => getFeatureGroup(f) === group.id);
              if (groupFeatures.length === 0 && searchQuery) return null; // Skip empty groups on search

              const metrics = calculateGroupMetrics(group.id);
              const sortedGroupFeats = sortFeatures(groupFeatures);

              return (
                <div
                  key={group.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    try {
                      const dataStr = e.dataTransfer.getData('text/plain');
                      if (!dataStr) return;
                      const data = JSON.parse(dataStr);
                      if (data.type === 'request') {
                        if (groupBy === 'epic') {
                          store.updateRequestEpic(data.requestId, group.id);
                        }
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="flex flex-col bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden min-w-[320px] max-w-md h-full shadow-lg shrink-0 transition-colors hover:border-[#58a6ff]/40"
                >
                  {/* Column/Group Header */}
                  <div className="p-4 bg-[#21262d]/50 border-b border-[#30363d] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {group.code && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#388bfd]/10 text-[#58a6ff] border border-[#388bfd]/20 font-bold">
                            {group.code}
                          </span>
                        )}
                        <h3 className="font-bold text-xs text-white truncate max-w-[180px]">{group.name}</h3>
                      </div>
                      <span className="bg-[#30363d] text-[#c9d1d9] text-[10px] px-2 py-0.5 rounded-full font-mono">
                        {metrics.featureCount} фич
                      </span>
                    </div>

                    {/* HIGH METRICS CARD SHOWN HIGHER IN HIERARCHY */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[#8b949e] bg-[#0d1117] p-2.5 rounded-lg border border-[#30363d]">
                      <div>SP: <span className="text-purple-400 font-bold">{metrics.totalSP} SP</span></div>
                      <div>Часы: <span className="text-orange-400 font-bold">{metrics.totalHours}ч</span></div>
                      <div>Сигналы: <span className="text-green-400 font-bold">{metrics.totalSignals} шт</span></div>
                      <div>Выручка: <span className="text-green-400 font-bold">₽{metrics.totalRevenue.toLocaleString()}</span></div>
                      <div className="col-span-2 pt-1 border-t border-[#30363d]/50">
                        Затраты Dev: <span className="text-red-400 font-bold">₽{metrics.totalDevCost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard column body */}
                  <div className="p-3 space-y-3 overflow-y-auto flex-1 bg-[#0d1117]/20 scrollbar-thin">
                    {sortedGroupFeats.length === 0 ? (
                      <div className="py-8 text-center text-[#8b949e] text-xs italic">
                        Нет фич бэклога в данном столбце.
                      </div>
                    ) : (
                      sortedGroupFeats.map((feat) => {
                        const featureTasks = store.tasks.filter((t: Task) => t.featureId === feat.id);
                        const currentScore = feat.overrideScore !== undefined ? feat.overrideScore : feat.autoScore;
                        const isOverridden = feat.overrideScore !== undefined;

                        return (
                          <div
                            key={feat.id}
                            onDragOver={(e) => {
                              e.preventDefault();
                            }}
                            onDrop={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              try {
                                const dataStr = e.dataTransfer.getData('text/plain');
                                if (!dataStr) return;
                                const data = JSON.parse(dataStr);
                                if (data.type === 'request') {
                                  store.associateRequestWithFeature(data.requestId, feat.id);
                                }
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="p-3 rounded-lg bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] transition-all space-y-2"
                          >
                            {/* Title block */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#238636]/20 text-[#2ea043] border border-[#238636]/30 font-bold">
                                  {feat.code}
                                </span>
                                <div className="flex items-center gap-1 bg-[#0d1117] px-1.5 py-0.5 rounded border border-[#30363d]">
                                  <span className="text-[9px] text-[#8b949e] font-sans">ИТОГ:</span>
                                  <strong className="text-[11px] text-green-400 font-mono">{currentScore}</strong>
                                </div>
                              </div>
                              <h4 className="font-bold text-xs text-white leading-snug">{feat.title}</h4>
                              <p className="text-[11px] text-[#8b949e] leading-snug line-clamp-2">{feat.description}</p>
                            </div>

                            {/* Quick sub-labels */}
                            <div className="flex flex-wrap gap-1.5 text-[9px]">
                              {feat.subsystem && (
                                <span className="bg-[#21262d] px-1 rounded text-[#c9d1d9] border border-[#30363d]">
                                  {feat.subsystem}
                                </span>
                              )}
                              {feat.taskKind && (
                                <span className="bg-purple-900/10 text-purple-400 border border-purple-800/30 px-1 rounded">
                                  {feat.taskKind}
                                </span>
                              )}
                            </div>

                            {/* Small metrics */}
                            <div className="grid grid-cols-2 gap-1 text-[9px] font-mono text-[#8b949e] bg-[#0d1117]/50 p-1.5 rounded border border-[#30363d]/30">
                              <div>SP: <span className="text-white">{feat.effortSP} SP</span></div>
                              <div>Сигналы: <span className="text-white">{feat.repeatabilityCount} шт</span></div>
                            </div>

                            {/* Associated requests list inside card */}
                            {(() => {
                              const assocReqs = store.requests.filter((r: any) => r.associatedFeatureId === feat.id);
                              if (assocReqs.length === 0) return null;
                              return (
                                <div className="space-y-1 pt-1.5 border-t border-[#30363d]/40">
                                  <span className="text-[9px] text-[#8b949e] block font-semibold">Связанные сигналы ({assocReqs.length}):</span>
                                  <div className="flex flex-wrap gap-1">
                                    {assocReqs.map((r: any) => (
                                      <span key={r.id} className="inline-flex items-center gap-1 bg-green-950/40 text-green-400 border border-green-900/50 text-[9px] px-1.5 py-0.5 rounded font-mono" title={r.description}>
                                        <Signal size={8} />
                                        {r.code}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Override Audit Alert inside Card */}
                            {isOverridden && (
                              <div className="bg-yellow-950/20 border border-yellow-800/30 p-1.5 rounded text-[9px] text-yellow-500 font-mono">
                                <strong>Ручная правка:</strong> {feat.overrideReason}
                              </div>
                            )}

                            {/* Actions Inside card */}
                            <div className="flex items-center justify-between pt-1 border-t border-[#30363d]/40">
                              <span className="text-[10px] text-[#8b949e]">Задач: {featureTasks.length} шт</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    setSelectedFeatureForOverride(feat);
                                    setOverrideScoreValue(feat.overrideScore !== undefined ? String(feat.overrideScore) : '');
                                    setOverrideReasonValue(feat.overrideReason || '');
                                    setIsOverrideModalOpen(true);
                                  }}
                                  className="px-1.5 py-0.5 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white rounded border border-[#30363d] text-[10px]"
                                >
                                  PM вес
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedFeatureForTask(feat);
                                    setIsTaskModalOpen(true);
                                  }}
                                  className="px-1.5 py-0.5 bg-[#238636]/20 hover:bg-[#238636]/40 text-[#2ea043] rounded border border-[#238636]/30 text-[10px]"
                                >
                                  + Таск
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* MODALS */}
      {/* ========================================================================================= */}

      {/* 1. MODAL: MANUAL PRIORITY OVERRIDE */}
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

      {/* 2. MODAL: ADD TASK TO FEATURE */}
      {isTaskModalOpen && selectedFeatureForTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Добавить задачу декомпозиции</h3>
            <div className="text-xs text-[#8b949e]">
              Фича: <strong className="text-white">[{selectedFeatureForTask.code}] {selectedFeatureForTask.title}</strong>
            </div>

            <form onSubmit={handleTaskSubmit} className="space-y-4 text-xs font-sans">
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

      {/* 3. MODAL: MANUAL FEATURE CREATION (WITH SUBSYSTEM & TASK KIND SELECTION) */}
      {isFeatureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-lg w-full p-6 space-y-4 my-8 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Добавить новую Фичу в Бэклог</h3>
            <form onSubmit={handleFeatureSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#8b949e] mb-1 font-medium">Инициатива (для структуры):</label>
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

              {/* Subsystem & Task Kind configuration selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8b949e] mb-1 font-medium">Подсистема (Subsystem):</label>
                  <select
                    value={newFeatSubsystem}
                    onChange={(e) => setNewFeatSubsystem(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white focus:outline-none"
                  >
                    <option value="">-- Не выбрана --</option>
                    {store.subsystems.map((s: DictionaryItem) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#8b949e] mb-1 font-medium">Вид задачи (Task Kind):</label>
                  <select
                    value={newFeatTaskKind}
                    onChange={(e) => setNewFeatTaskKind(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white focus:outline-none"
                  >
                    <option value="">-- Не выбран --</option>
                    {store.taskKinds.map((k: DictionaryItem) => (
                      <option key={k.id} value={k.name}>{k.name}</option>
                    ))}
                  </select>
                </div>
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
