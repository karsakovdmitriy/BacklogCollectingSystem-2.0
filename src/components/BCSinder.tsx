'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Request, Project, Product, Module, TaskKind, ProjectStage, User } from '@/store/index';
import {
  Heart,
  X,
  Flame,
  Star,
  RotateCcw,
  SkipForward,
  Edit2,
  Check,
  AlertTriangle,
  Info,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ArrowUp
} from 'lucide-react';

interface BCSinderProps {
  store: any;
  onNavigateToBacklog?: () => void;
}

export default function BCSinder({ store, onNavigateToBacklog }: BCSinderProps) {
  // Queue filter
  const [queueFilter, setQueueFilter] = useState<'Неразобранные' | 'Все' | 'В проработку' | 'Принят' | 'Отклонен'>('Неразобранные');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Swipe animation / drag state
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Session action counts
  const [sessionStats, setSessionStats] = useState({
    approved: 0,
    rejected: 0,
    discovery: 0
  });

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSource, setEditSource] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editGitlabId, setEditGitlabId] = useState('');
  const [editProjectId, setEditProjectId] = useState('');
  const [editProductId, setEditProductId] = useState('');
  const [editModuleId, setEditModuleId] = useState('');
  const [editTaskKindId, setEditTaskKindId] = useState('');
  const [editStageId, setEditStageId] = useState('');
  const [editAuthorId, setEditAuthorId] = useState('');
  const [editExecutorId, setEditExecutorId] = useState('');
  const [editEstimate, setEditEstimate] = useState<number>(0);
  const [editSpent, setEditSpent] = useState<number>(0);

  // Filter requests according to queue
  const queueRequests: Request[] = store.requests.filter((r: Request) => {
    if (queueFilter === 'Все') return true;
    return r.status === queueFilter;
  });

  // Current request
  const currentRequest: Request | undefined = queueRequests[currentIndex];

  // Reset index when queue changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [queueFilter]);

  // Adjust index if out of bounds
  useEffect(() => {
    if (currentIndex >= queueRequests.length && queueRequests.length > 0) {
      setCurrentIndex(queueRequests.length - 1);
    }
  }, [queueRequests.length, currentIndex]);

  // Check 7 mandatory parameters
  const getMissingParameters = (req?: Request) => {
    if (!req) return [];
    const missing = [];
    if (!req.gitlabIssueId) missing.push('Id Gitlab');
    if (!req.projectId) missing.push('Проект');
    if (!req.productId) missing.push('Продукт');
    if (!req.moduleId) missing.push('Модуль');
    if (!req.taskKindId) missing.push('Вид задачи');
    if (!req.projectStageId) missing.push('Этап проекта');
    if (!req.authorId) missing.push('Автор');
    return missing;
  };

  const isCurrentConfigured = currentRequest ? getMissingParameters(currentRequest).length === 0 : false;

  const getRequestLabels = (req: Request): string[] => {
    if (req.labels && req.labels.length > 0) return req.labels;
    const derived: string[] = [];
    if (req.moduleId) {
      const m = store.modules.find((mod: Module) => mod.id === req.moduleId);
      if (m?.gitlabLabel) derived.push(m.gitlabLabel);
    }
    if (req.taskKindId) {
      const k = store.taskKinds.find((kind: TaskKind) => kind.id === req.taskKindId);
      if (k?.gitlabLabel) derived.push(k.gitlabLabel);
    }
    if (req.projectStageId) {
      const s = store.projectStages.find((stg: ProjectStage) => stg.id === req.projectStageId);
      if (s?.gitlabLabel) derived.push(s.gitlabLabel);
    }
    return Array.from(new Set(derived));
  };

  const getLabelColor = (labelName: string) => {
    const found = store.gitLabLabels?.find((l: any) => l.name.toLowerCase() === labelName.toLowerCase());
    if (found?.color) {
      return {
        bg: `${found.color}25`,
        text: found.color,
        border: `${found.color}60`,
        dot: found.color
      };
    }
    return {
      bg: '#21262d',
      text: '#58a6ff',
      border: '#388bfd40',
      dot: '#58a6ff'
    };
  };

  // Open Edit Dialog for current request
  const openEditModal = () => {
    if (!currentRequest) return;
    setEditTitle(currentRequest.title);
    setEditSource(currentRequest.source || 'GitLab');
    setEditDescription(currentRequest.description || '');
    setEditGitlabId(currentRequest.gitlabIssueId || '');
    setEditProjectId(currentRequest.projectId || '');
    setEditProductId(currentRequest.productId || '');
    setEditModuleId(currentRequest.moduleId || '');
    setEditTaskKindId(currentRequest.taskKindId || '');
    setEditStageId(currentRequest.projectStageId || '');
    setEditAuthorId(currentRequest.authorId || '');
    setEditExecutorId(currentRequest.executorId || '');
    setEditEstimate(currentRequest.estimate || 0);
    setEditSpent(currentRequest.spent || 0);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRequest) return;

    store.updateRequestDetails({
      ...currentRequest,
      title: editTitle,
      source: editSource,
      description: editDescription,
      gitlabIssueId: editGitlabId || undefined,
      projectId: editProjectId || undefined,
      productId: editProductId || undefined,
      moduleId: editModuleId || undefined,
      taskKindId: editTaskKindId || undefined,
      projectStageId: editStageId || undefined,
      authorId: editAuthorId || undefined,
      executorId: editExecutorId || undefined,
      estimate: Number(editEstimate) || 0,
      spent: Number(editSpent) || 0,
    });

    setIsEditModalOpen(false);
  };

  // Actions
  const handleApprove = () => {
    if (!currentRequest) return;
    const missing = getMissingParameters(currentRequest);
    if (missing.length > 0) {
      alert(`Невозможно принять задачу! Сначала заполните обязательные параметры: ${missing.join(', ')}.`);
      openEditModal();
      return;
    }
    store.classifyRequest(currentRequest.id, 'Принят', null);
    setSessionStats(s => ({ ...s, approved: s.approved + 1 }));
    setDragOffset({ x: 0, y: 0 });
  };

  const handleReject = () => {
    if (!currentRequest) return;
    const missing = getMissingParameters(currentRequest);
    if (missing.length > 0) {
      alert(`Невозможно отклонить задачу! Сначала заполните обязательные параметры: ${missing.join(', ')}.`);
      openEditModal();
      return;
    }
    store.classifyRequest(currentRequest.id, 'Отклонен', null);
    setSessionStats(s => ({ ...s, rejected: s.rejected + 1 }));
    setDragOffset({ x: 0, y: 0 });
  };

  const handleDiscovery = () => {
    if (!currentRequest) return;
    const missing = getMissingParameters(currentRequest);
    if (missing.length > 0) {
      alert(`Невозможно отправить в проработку! Сначала заполните обязательные параметры: ${missing.join(', ')}.`);
      openEditModal();
      return;
    }
    store.classifyRequest(currentRequest.id, 'В проработку', null);
    setSessionStats(s => ({ ...s, discovery: s.discovery + 1 }));
    setDragOffset({ x: 0, y: 0 });
  };

  const handleSkip = () => {
    if (currentIndex < queueRequests.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setCurrentIndex(0);
    }
    setDragOffset({ x: 0, y: 0 });
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditModalOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleApprove();
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleReject();
      } else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        e.preventDefault();
        handleDiscovery();
      } else if (e.key === ' ' || e.key === 'Tab') {
        e.preventDefault();
        handleSkip();
      } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 'e') {
        e.preventDefault();
        openEditModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRequest, isCurrentConfigured, isEditModalOpen, currentIndex, queueRequests.length]);

  // Touch & Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset.x > 140) {
      handleApprove();
    } else if (dragOffset.x < -140) {
      handleReject();
    } else if (dragOffset.y < -120) {
      handleDiscovery();
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Drag visuals
  const rotateDeg = Math.min(25, Math.max(-25, dragOffset.x * 0.1));
  const swipeDirection = dragOffset.x > 50 ? 'right' : dragOffset.x < -50 ? 'left' : dragOffset.y < -50 ? 'up' : null;

  const currentProj = currentRequest?.projectId ? store.projects.find((p: Project) => p.id === currentRequest.projectId) : undefined;
  const currentProd = currentRequest?.productId ? store.products.find((p: Product) => p.id === currentRequest.productId) : undefined;
  const currentMod = currentRequest?.moduleId ? store.modules.find((m: Module) => m.id === currentRequest.moduleId) : undefined;
  const currentKind = currentRequest?.taskKindId ? store.taskKinds.find((k: TaskKind) => k.id === currentRequest.taskKindId) : undefined;
  const currentStage = currentRequest?.projectStageId ? store.projectStages.find((s: ProjectStage) => s.id === currentRequest.projectStageId) : undefined;
  const currentAuthor = currentRequest?.authorId ? store.users.find((u: User) => u.id === currentRequest.authorId) : undefined;
  const currentExecutor = currentRequest?.executorId ? store.users.find((u: User) => u.id === currentRequest.executorId) : undefined;

  const missingParams = getMissingParameters(currentRequest);
  const labels = currentRequest ? getRequestLabels(currentRequest) : [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 select-none">
      {/* HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#161b22] p-4 rounded-xl border border-[#30363d] shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-gradient-to-tr from-pink-600 to-rose-500 rounded-lg text-white shadow-md">
              <Flame size={20} className="animate-pulse" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-wide">BCSinder</h2>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-rose-950/40 border border-rose-800 text-rose-300">
              Tinder Mode
            </span>
          </div>
          <p className="text-xs text-[#8b949e]">
            Последовательный разбор входящих сигналов по одному: свайп вправо — <strong className="text-green-400">Принять</strong>, свайп влево — <strong className="text-red-400">Отклонить</strong>, свайп вверх — <strong className="text-yellow-400">В проработку</strong>.
          </p>
        </div>

        {/* Queue Switcher */}
        <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-[#30363d] text-xs">
          {(['Неразобранные', 'Все', 'В проработку', 'Принят', 'Отклонен'] as const).map((q) => (
            <button
              key={q}
              onClick={() => setQueueFilter(q)}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                queueFilter === q
                  ? 'bg-[#21262d] text-white border border-[#30363d] shadow'
                  : 'text-[#8b949e] hover:text-white'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* PROGRESS BAR & STATS */}
      <div className="flex items-center justify-between gap-4 px-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#8b949e]">
          <span>Очередь:</span>
          <strong className="text-white">
            {queueRequests.length > 0 ? currentIndex + 1 : 0} / {queueRequests.length}
          </strong>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-green-400 bg-green-950/30 px-2 py-0.5 rounded border border-green-900/40">
            <Heart size={11} /> Принято: <strong>{sessionStats.approved}</strong>
          </span>
          <span className="flex items-center gap-1 text-yellow-400 bg-yellow-950/30 px-2 py-0.5 rounded border border-yellow-900/40">
            <Star size={11} /> В проработке: <strong>{sessionStats.discovery}</strong>
          </span>
          <span className="flex items-center gap-1 text-red-400 bg-red-950/30 px-2 py-0.5 rounded border border-red-900/40">
            <X size={11} /> Отклонено: <strong>{sessionStats.rejected}</strong>
          </span>
        </div>
      </div>

      {/* Progress line */}
      <div className="w-full bg-[#161b22] h-1.5 rounded-full overflow-hidden border border-[#30363d]/50">
        <div
          className="bg-gradient-to-r from-rose-500 via-purple-500 to-[#58a6ff] h-full transition-all duration-300 rounded-full"
          style={{ width: `${queueRequests.length > 0 ? ((currentIndex + 1) / queueRequests.length) * 100 : 0}%` }}
        />
      </div>

      {/* MAIN SWIPE DECK AREA */}
      <div className="relative min-h-[500px] flex items-center justify-center py-4">
        {queueRequests.length === 0 ? (
          /* EMPTY QUEUE STATE */
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-10 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-rose-500/20 to-purple-500/20 border border-rose-500/40 rounded-full flex items-center justify-center text-rose-400">
              <Sparkles size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Все задачи в очереди обработаны!</h3>
              <p className="text-xs text-[#8b949e]">
                В категории "{queueFilter}" больше нет активных задач для сортировки.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
              <div className="p-2 bg-[#0d1117] rounded border border-[#30363d]">
                <span className="text-[#8b949e] block text-[10px]">Принято</span>
                <strong className="text-green-400 text-sm">{sessionStats.approved}</strong>
              </div>
              <div className="p-2 bg-[#0d1117] rounded border border-[#30363d]">
                <span className="text-[#8b949e] block text-[10px]">В проработке</span>
                <strong className="text-yellow-400 text-sm">{sessionStats.discovery}</strong>
              </div>
              <div className="p-2 bg-[#0d1117] rounded border border-[#30363d]">
                <span className="text-[#8b949e] block text-[10px]">Отклонено</span>
                <strong className="text-red-400 text-sm">{sessionStats.rejected}</strong>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={() => setQueueFilter('Все')}
                className="w-full py-2 bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg border border-[#30363d] text-xs font-semibold transition-all"
              >
                Показать все задачи
              </button>
              {onNavigateToBacklog && (
                <button
                  onClick={onNavigateToBacklog}
                  className="w-full py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg text-xs font-semibold shadow-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <Layers size={14} />
                  Перейти в Бэклог
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ACTIVE TINDER CARD */
          <div className="relative w-full max-w-xl">
            {/* Background ghost card for 3D stack effect */}
            {currentIndex + 1 < queueRequests.length && (
              <div className="absolute inset-0 bg-[#161b22]/70 border border-[#30363d] rounded-2xl transform scale-95 translate-y-3 shadow-md pointer-events-none" />
            )}

            {/* Front Card */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotateDeg}deg)`,
                cursor: isDragging ? 'grabbing' : 'grab',
                transition: isDragging ? 'none' : 'transform 0.25s ease-out',
              }}
              className="relative bg-[#161b22] border-2 border-[#30363d] rounded-2xl p-6 shadow-2xl space-y-4 overflow-hidden select-none"
            >
              {/* Dynamic Swipe Stamps */}
              {swipeDirection === 'right' && (
                <div className="absolute top-8 right-8 z-20 border-4 border-green-500 text-green-400 font-extrabold text-xl px-4 py-1 rounded-xl rotate-12 tracking-wider bg-black/60 shadow-lg pointer-events-none animate-pulse">
                  ПРИНЯТЬ 👍
                </div>
              )}
              {swipeDirection === 'left' && (
                <div className="absolute top-8 left-8 z-20 border-4 border-red-500 text-red-500 font-extrabold text-xl px-4 py-1 rounded-xl -rotate-12 tracking-wider bg-black/60 shadow-lg pointer-events-none animate-pulse">
                  ОТКЛОНИТЬ 👎
                </div>
              )}
              {swipeDirection === 'up' && (
                <div className="absolute top-8 inset-x-0 mx-auto w-fit z-20 border-4 border-yellow-500 text-yellow-400 font-extrabold text-lg px-4 py-1 rounded-xl tracking-wider bg-black/60 shadow-lg pointer-events-none animate-pulse">
                  В ПРОРАБОТКУ 🔍
                </div>
              )}

              {/* Card Header: Code, Source, Status, Edit */}
              <div className="flex items-center justify-between border-b border-[#30363d]/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#21262d] text-[#58a6ff] border border-[#30363d] font-bold">
                    {currentRequest?.code}
                  </span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-purple-900/20 text-purple-400 border border-purple-800/40">
                    {currentRequest?.source}
                  </span>
                  {currentRequest?.gitlabIssueId && (
                    <span className="font-mono text-[11px] text-[#8b949e]">
                      {currentRequest.gitlabIssueId}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    currentRequest?.status === 'Принят' ? 'bg-green-950/40 text-green-400 border border-green-800' :
                    currentRequest?.status === 'В проработку' ? 'bg-yellow-950/40 text-yellow-400 border border-yellow-800' :
                    currentRequest?.status === 'Отклонен' ? 'bg-red-950/40 text-red-400 border border-red-800' :
                    'bg-[#21262d] text-gray-400 border border-gray-700'
                  }`}>
                    {currentRequest?.status}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] text-xs transition-colors cursor-pointer"
                    title="Редактировать параметры задачи"
                  >
                    <Edit2 size={12} className="text-[#58a6ff]" />
                    Изменить
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white leading-snug">
                  {currentRequest?.title}
                </h3>
                <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363d]/60 text-xs text-[#c9d1d9] max-h-36 overflow-y-auto leading-relaxed scrollbar-thin">
                  {currentRequest?.description ? currentRequest.description : <span className="text-[#8b949e] italic">Описание отсутствует</span>}
                </div>
              </div>

              {/* Visual Labels */}
              {labels.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {labels.map((lbl, idx) => {
                    const colorStyle = getLabelColor(lbl);
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border"
                        style={{
                          backgroundColor: colorStyle.bg,
                          color: colorStyle.text,
                          borderColor: colorStyle.border
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: colorStyle.dot }} />
                        {lbl}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Enterprise Attributes Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-[#0d1117] p-3 rounded-xl border border-[#30363d]/60 font-mono">
                <div>
                  <span className="text-[10px] text-[#8b949e] block">Проект:</span>
                  <span className="text-white truncate block">{currentProj ? store.getProjectName(currentProj) : <span className="text-red-400">Не выбран</span>}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8b949e] block">Продукт:</span>
                  <span className="text-white truncate block">{currentProd ? currentProd.name : <span className="text-red-400">Не выбран</span>}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8b949e] block">Модуль:</span>
                  <span className="text-white truncate block">{currentMod ? currentMod.name : <span className="text-red-400">Не выбран</span>}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8b949e] block">Вид задачи:</span>
                  <span className="text-white truncate block">{currentKind ? currentKind.name : <span className="text-red-400">Не выбран</span>}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8b949e] block">Этап:</span>
                  <span className="text-white truncate block">{currentStage ? currentStage.name : <span className="text-red-400">Не выбран</span>}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8b949e] block">Автор:</span>
                  <span className="text-white truncate block">{currentAuthor ? currentAuthor.fullName : <span className="text-red-400">Не выбран</span>}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8b949e] block">Исполнитель (опц.):</span>
                  <span className="text-[#8b949e] truncate block">{currentExecutor ? currentExecutor.fullName : '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8b949e] block">Трудоемкость (Оценка/Факт):</span>
                  <span className="text-orange-400 font-bold">{currentRequest?.estimate || 0}ч / {currentRequest?.spent || 0}ч</span>
                </div>
              </div>

              {/* Readiness Indicator */}
              <div className="pt-1">
                {isCurrentConfigured ? (
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-green-950/30 border border-green-800/40 text-xs text-green-400 font-mono">
                    <Check size={14} className="shrink-0" />
                    <span>Все 7 обязательных параметров заполнены. Готов к классификации.</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-red-950/30 border border-red-800/40 text-xs text-red-400 font-mono gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <AlertTriangle size={14} className="shrink-0" />
                      <span className="truncate">Требуется заполнить: {missingParams.join(', ')}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal();
                      }}
                      className="px-2 py-0.5 rounded bg-red-900/60 hover:bg-red-800 text-white text-[11px] shrink-0 font-sans cursor-pointer"
                    >
                      Заполнить
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TINDER ACTION BUTTONS CONTROLLER */}
      {queueRequests.length > 0 && (
        <div className="flex flex-col items-center gap-4 pt-2">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {/* Previous */}
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 rounded-full bg-[#161b22] hover:bg-[#21262d] text-[#8b949e] hover:text-white border border-[#30363d] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
              title="Предыдущая карточка"
            >
              <ChevronLeft size={20} />
            </button>

            {/* SWIPE LEFT: REJECT */}
            <button
              onClick={handleReject}
              className="flex flex-col items-center gap-1 group cursor-pointer"
              title="Отклонить (Свайп влево / Стрелка влево)"
            >
              <div className="w-16 h-16 rounded-full bg-red-950/40 border-2 border-red-700/80 group-hover:bg-red-900/60 group-hover:scale-110 flex items-center justify-center text-red-400 transition-all shadow-xl">
                <X size={28} />
              </div>
              <span className="text-[11px] font-bold text-red-400">Отклонить</span>
            </button>

            {/* SWIPE UP: DISCOVERY */}
            <button
              onClick={handleDiscovery}
              className="flex flex-col items-center gap-1 group cursor-pointer"
              title="В проработку (Свайп вверх / Стрелка вверх)"
            >
              <div className="w-14 h-14 rounded-full bg-yellow-950/40 border-2 border-yellow-700/80 group-hover:bg-yellow-900/60 group-hover:scale-110 flex items-center justify-center text-yellow-400 transition-all shadow-xl">
                <Star size={24} />
              </div>
              <span className="text-[11px] font-bold text-yellow-400">В проработку</span>
            </button>

            {/* SWIPE RIGHT: APPROVE */}
            <button
              onClick={handleApprove}
              className="flex flex-col items-center gap-1 group cursor-pointer"
              title="Принять (Свайп вправо / Стрелка вправо)"
            >
              <div className="w-16 h-16 rounded-full bg-green-950/40 border-2 border-green-700/80 group-hover:bg-green-900/60 group-hover:scale-110 flex items-center justify-center text-green-400 transition-all shadow-xl">
                <Heart size={28} />
              </div>
              <span className="text-[11px] font-bold text-green-400">Принять</span>
            </button>

            {/* Skip */}
            <button
              onClick={handleSkip}
              className="p-3 rounded-full bg-[#161b22] hover:bg-[#21262d] text-[#8b949e] hover:text-white border border-[#30363d] transition-all shadow-md cursor-pointer"
              title="Пропустить (Пробел)"
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Keyboard hint bar */}
          <div className="text-[11px] text-[#8b949e] font-mono flex flex-wrap items-center justify-center gap-3 bg-[#161b22]/40 px-4 py-1.5 rounded-full border border-[#30363d]/40">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-white">←</kbd> Отклонить</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-white">↑</kbd> В проработку</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-white">→</kbd> Принять</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-white">Пробел</kbd> Пропустить</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-white">E</kbd> Изменить</span>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && currentRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs overflow-y-auto p-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-2xl w-full p-6 space-y-4 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Редактировать карточку [{currentRequest.code}]
                </h3>
                <p className="text-xs text-[#8b949e]">Заполните реквизиты перед назначением статуса</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#8b949e] hover:text-white p-1 rounded hover:bg-[#30363d]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#8b949e] mb-1 font-medium">Название задачи / проблемы:</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white focus:outline-none focus:border-[#58a6ff]"
                />
              </div>

              <div>
                <label className="block text-[#8b949e] mb-1 font-medium">Описание проблемы:</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white focus:outline-none focus:border-[#58a6ff]"
                />
              </div>

              {/* Mandatory 7 parameters block */}
              <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl space-y-3">
                <div className="flex items-center gap-1.5 text-yellow-500 font-semibold mb-1">
                  <Info size={14} />
                  <span>Продуктовая классификация (Обязательные 7 параметров)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* 1. GitLab ID */}
                  <div>
                    <label className="block text-[#8b949e] mb-0.5 font-mono text-[10px]">1. ID GITLAB:</label>
                    <input
                      type="text"
                      value={editGitlabId}
                      onChange={(e) => setEditGitlabId(e.target.value)}
                      placeholder="#999"
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    />
                  </div>

                  {/* 2. Project */}
                  <div>
                    <label className="block text-[#8b949e] mb-0.5 font-mono text-[10px]">2. ПРОЕКТ:</label>
                    <select
                      value={editProjectId}
                      onChange={(e) => setEditProjectId(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    >
                      <option value="">-- Выберите проект --</option>
                      {store.projects.map((p: Project) => (
                        <option key={p.id} value={p.id}>{store.getProjectName(p)}</option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Product */}
                  <div>
                    <label className="block text-[#8b949e] mb-0.5 font-mono text-[10px]">3. ПРОДУКТ:</label>
                    <select
                      value={editProductId}
                      onChange={(e) => setEditProductId(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    >
                      <option value="">-- Выберите продукт --</option>
                      {store.products.map((p: Product) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Module */}
                  <div>
                    <label className="block text-[#8b949e] mb-0.5 font-mono text-[10px]">4. МОДУЛЬ:</label>
                    <select
                      value={editModuleId}
                      onChange={(e) => setEditModuleId(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    >
                      <option value="">-- Выберите модуль --</option>
                      {store.modules.map((m: Module) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 5. Task Kind */}
                  <div>
                    <label className="block text-[#8b949e] mb-0.5 font-mono text-[10px]">5. ВИД ЗАДАЧИ:</label>
                    <select
                      value={editTaskKindId}
                      onChange={(e) => setEditTaskKindId(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    >
                      <option value="">-- Выберите вид задачи --</option>
                      {store.taskKinds.map((k: TaskKind) => (
                        <option key={k.id} value={k.id}>{k.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 6. Project Stage */}
                  <div>
                    <label className="block text-[#8b949e] mb-0.5 font-mono text-[10px]">6. ЭТАП ПРОЕКТА:</label>
                    <select
                      value={editStageId}
                      onChange={(e) => setEditStageId(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    >
                      <option value="">-- Выберите этап --</option>
                      {store.projectStages.map((s: ProjectStage) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 7. Author */}
                  <div>
                    <label className="block text-[#8b949e] mb-0.5 font-mono text-[10px]">7. АВТОР:</label>
                    <select
                      value={editAuthorId}
                      onChange={(e) => setEditAuthorId(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    >
                      <option value="">-- Выберите автора --</option>
                      {store.users.map((u: User) => (
                        <option key={u.id} value={u.id}>{u.fullName}</option>
                      ))}
                    </select>
                  </div>

                  {/* 8. Executor (Optional) */}
                  <div>
                    <label className="block text-[#8b949e] mb-0.5 font-mono text-[10px]">8. ИСПОЛНИТЕЛЬ (НЕОБЯЗАТЕЛЬНО):</label>
                    <select
                      value={editExecutorId}
                      onChange={(e) => setEditExecutorId(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    >
                      <option value="">-- Не назначен --</option>
                      {store.users.map((u: User) => (
                        <option key={u.id} value={u.id}>{u.fullName}</option>
                      ))}
                    </select>
                  </div>

                  {/* Estimate */}
                  <div>
                    <label className="block text-[#8b949e] mb-0.5 font-mono text-[10px]">ОЦЕНКА (ЧИСЛО ЧАСОВ):</label>
                    <input
                      type="number"
                      value={editEstimate}
                      onChange={(e) => setEditEstimate(Number(e.target.value))}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    />
                  </div>

                  {/* Spent */}
                  <div>
                    <label className="block text-[#8b949e] mb-0.5 font-mono text-[10px]">ЗАТРАЧЕНО (ЧИСЛО ЧАСОВ):</label>
                    <input
                      type="number"
                      value={editSpent}
                      onChange={(e) => setEditSpent(Number(e.target.value))}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#21262d] text-white border border-[#30363d] hover:bg-[#30363d]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#238636] text-white hover:bg-[#2ea043] font-semibold"
                >
                  Сохранить изменения
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
