'use client';

import React, { useState } from 'react';
import { Request, Project, Product, Module, TaskKind, TaskType, ProjectStage, User } from '@/store/index';
import {
  CheckCircle2,
  HelpCircle,
  XCircle,
  Plus,
  GitBranch,
  Search,
  Check,
  AlertTriangle,
  Info,
  Layers,
  UserCheck,
  Clock
} from 'lucide-react';

interface IncomingAnalysisProps {
  store: any;
}

export default function IncomingAnalysis({ store }: IncomingAnalysisProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Все');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditingReqId, setIsEditingReqId] = useState<string | null>(null);

  // Form Fields for Manual Request Creation / Editing
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');

  // 9 core required parameters for classification validation
  const [gitlabIssueId, setGitlabIssueId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [productId, setProductId] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [taskKindId, setTaskKindId] = useState('');
  const [taskTypeId, setTaskTypeId] = useState('');
  const [projectStageId, setProjectStageId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [executorId, setExecutorId] = useState('');
  const [estimate, setEstimate] = useState<number>(0);
  const [spent, setSpent] = useState<number>(0);

  const resetForm = () => {
    setTitle('');
    setSource(store.sources?.[0]?.name || 'Интервью');
    setDescription('');
    setGitlabIssueId('');
    setProjectId('');
    setProductId('');
    setModuleId('');
    setTaskKindId('');
    setTaskTypeId('');
    setProjectStageId('');
    setAuthorId('');
    setExecutorId('');
    setEstimate(0);
    setSpent(0);
    setIsEditingReqId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleEditOpen = (req: Request) => {
    setIsEditingReqId(req.id);
    setTitle(req.title);
    setSource(req.source || store.sources?.[0]?.name || 'Интервью');
    setDescription(req.description || '');
    setGitlabIssueId(req.gitlabIssueId || '');
    setProjectId(req.projectId || '');
    setProductId(req.productId || '');
    setModuleId(req.moduleId || '');
    setTaskKindId(req.taskKindId || '');
    setTaskTypeId(req.taskTypeId || '');
    setProjectStageId(req.projectStageId || '');
    setAuthorId(req.authorId || '');
    setExecutorId(req.executorId || '');
    setEstimate(req.estimate || 0);
    setSpent(req.spent || 0);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const requestPayload = {
      title,
      source: source || store.sources?.[0]?.name || 'Интервью',
      description,
      status: 'Неразобранные' as const,
      gitlabIssueId: gitlabIssueId || undefined,
      projectId: projectId || undefined,
      productId: productId || undefined,
      moduleId: moduleId || undefined,
      taskKindId: taskKindId || undefined,
      taskTypeId: taskTypeId || undefined,
      projectStageId: projectStageId || undefined,
      authorId: authorId || undefined,
      executorId: executorId || undefined,
      estimate: Number(estimate),
      spent: Number(spent),
      associatedFeatureId: null,
    };

    if (isEditingReqId) {
      const existing = store.requests.find((r: Request) => r.id === isEditingReqId);
      store.updateRequestDetails({
        ...existing,
        ...requestPayload,
        status: existing?.status || 'Неразобранные'
      });
    } else {
      store.addRequest(requestPayload);
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleGitlabBulkImport = async () => {
    try {
      const result = await store.importGitLabIssues();
      if (result.success) {
        let issueDetails = '';
        if (result.issues.length > 0) {
          issueDetails = result.issues.map((i: any) =>
            `• ${i.gitlabId}: ${i.title.slice(0, 45)}...\n  [Маппинг]: Вид: "${i.kind || 'Не сопоставлен'}", Тип: "${i.type || 'Не сопоставлен'}"`
          ).join('\n\n');
        } else {
          issueDetails = 'Задачи не найдены в указанной группе репозиториев.';
        }

        alert(
          `Успешный импорт из GitLab!\n\n` +
          `Путь к репозиторию: "${result.projectPath}"\n` +
          `Сопоставлен с проектом: "${result.projectName}"\n` +
          `Импортировано сигналов: ${result.count} шт.\n\n` +
          `Результаты сопоставления ярлыков (Labels Mapping):\n\n${issueDetails}\n\n` +
          `Все сигналы импортированы в статусе "Неразобранные" и добавлены в таблицу.`
        );
      } else {
        alert('Произошла ошибка при импорте задач из GitLab.');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Произошла ошибка при импорте задач из GitLab.');
    }
  };

  const matchesSearch = (req: Request) => {
    const query = searchQuery.toLowerCase();
    const proj = store.projects.find((p: Project) => p.id === req.projectId);
    const projName = proj ? store.getProjectName(proj) : '';

    return (
      req.title.toLowerCase().includes(query) ||
      req.code.toLowerCase().includes(query) ||
      (req.description && req.description.toLowerCase().includes(query)) ||
      projName.toLowerCase().includes(query)
    );
  };

  const filteredRequests = store.requests.filter((r: Request) => {
    if (filterStatus !== 'Все' && r.status !== filterStatus) return false;
    return matchesSearch(r);
  });

  const getMissingParameters = (req: Request) => {
    const missing = [];
    if (!req.gitlabIssueId) missing.push('Id Gitlab');
    if (!req.projectId) missing.push('Проект');
    if (!req.productId) missing.push('Продукт');
    if (!req.moduleId) missing.push('Модуль');
    if (!req.taskKindId) missing.push('Вид задачи');
    if (!req.taskTypeId) missing.push('Тип задачи');
    if (!req.projectStageId) missing.push('Этап проекта');
    if (!req.authorId) missing.push('Автор');
    if (!req.executorId) missing.push('Исполнитель');
    return missing;
  };

  return (
    <div className="space-y-6">
      {/* BANNER CONTROL */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-white">Анализ входящих задач и сигналов</h2>
          <p className="text-xs text-[#8b949e]">
            Панель первичного сбора требований. Влияние на классификацию: статус (Принят, Отклонен, В проработку) можно назначить только при заполнении всех 9 обязательных атрибутов (без привязки к Эпику и Фиче).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white font-medium transition-all text-xs"
          >
            <Plus size={16} />
            Внести вручную
          </button>
          <button
            onClick={handleGitlabBulkImport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#1f6feb] hover:bg-[#388bfd] text-white font-medium transition-all text-xs"
          >
            <GitBranch size={16} />
            Загрузить из GitLab
          </button>
        </div>
      </div>

      {/* FILTER & CONTAINER GRID */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 text-[#8b949e]" size={15} />
              <input
                type="text"
                placeholder="Поиск по проекту, названию, коду..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full rounded bg-[#0d1117] border border-[#30363d] focus:outline-none focus:border-[#58a6ff] text-xs text-white"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
              {['Все', 'Неразобранные', 'В проработку', 'Принят', 'Отклонен'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-[#21262d] text-white border border-[#30363d]'
                      : 'text-[#8b949e] hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* REQUESTS MATRIX */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#30363d] text-[#8b949e] text-xs">
                  <th className="py-2 px-3 font-medium">Код / Источник</th>
                  <th className="py-2 px-3 font-medium">Название и описание</th>
                  <th className="py-2 px-3 font-medium">Валидация</th>
                  <th className="py-2 px-3 font-medium">Статус</th>
                  <th className="py-2 px-3 font-medium text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]/40">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#8b949e] italic">
                      Нет подходящих сигналов в данном сегменте.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req: Request) => {
                    const missingParams = getMissingParameters(req);
                    const isFullyConfigured = missingParams.length === 0;

                    return (
                      <tr key={req.id} className="hover:bg-[#161b22]/50 text-xs transition-colors">
                        {/* Source/Code */}
                        <td className="py-3 px-3 align-top whitespace-nowrap">
                          <span className="font-mono text-[#8b949e] block">{req.code}</span>
                          <span className="text-[10px] bg-[#21262d] px-1.5 py-0.5 rounded border border-[#30363d] text-white mt-1 inline-block">
                            {req.source}
                          </span>
                        </td>

                        {/* Title & Desc */}
                        <td className="py-3 px-3 align-top max-w-xs">
                          <strong className="text-white block leading-snug mb-1">{req.title}</strong>
                          <p className="text-[#8b949e] leading-snug truncate hover:whitespace-normal">
                            {req.description}
                          </p>
                        </td>

                        {/* Validation Status badge */}
                        <td className="py-3 px-3 align-top whitespace-nowrap">
                          {isFullyConfigured ? (
                            <span className="inline-flex items-center gap-1 bg-green-950/40 border border-green-800 text-green-400 px-2 py-0.5 rounded font-mono text-[10px]">
                              <Check size={11} /> Готов к PM
                            </span>
                          ) : (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 bg-red-950/40 border border-red-900 text-red-400 px-2 py-0.5 rounded font-mono text-[10px]">
                                <AlertTriangle size={11} /> Не заполнен ({missingParams.length})
                              </span>
                              <div className="text-[9px] text-[#8b949e] max-w-[140px] leading-tight font-mono">
                                Прямая блокировка классификации. Требуется: {missingParams.join(', ')}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Current Status Badge */}
                        <td className="py-3 px-3 align-top whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                            req.status === 'Принят' ? 'bg-green-900/40 text-green-400 border border-green-800' :
                            req.status === 'В проработку' ? 'bg-yellow-900/40 text-yellow-500 border border-yellow-800' :
                            req.status === 'Неразобранные' ? 'bg-gray-800 text-gray-400 border border-gray-700' :
                            'bg-red-900/40 text-red-400 border border-red-800'
                          }`}>
                            {req.status}
                          </span>
                        </td>

                        {/* Classification Actions & Editing */}
                        <td className="py-3 px-3 align-top text-right font-sans">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleEditOpen(req)}
                              className="px-2 py-1 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] rounded text-[11px]"
                            >
                              Изменить
                            </button>
                            {req.status !== 'В проработку' && (
                              <button
                                onClick={() => store.classifyRequest(req.id, 'В проработку', null)}
                                disabled={!isFullyConfigured}
                                title={isFullyConfigured ? 'Перевести в проработку' : 'Запрещено: Заполните все поля'}
                                className={`px-2 py-1 border rounded text-[11px] transition-all ${
                                  isFullyConfigured
                                    ? 'bg-yellow-950 hover:bg-yellow-900 border-yellow-800 text-yellow-400'
                                    : 'bg-[#21262d]/50 border-transparent text-[#8b949e] opacity-40 cursor-not-allowed'
                                }`}
                              >
                                В проработку
                              </button>
                            )}
                            <button
                              onClick={() => store.classifyRequest(req.id, 'Принят', null)}
                              disabled={!isFullyConfigured}
                              title={isFullyConfigured ? 'Принять запрос' : 'Запрещено: Заполните все поля'}
                              className={`p-1.5 rounded border transition-all ${
                                isFullyConfigured
                                  ? 'bg-green-950 hover:bg-green-900 border-green-900 text-green-400'
                                  : 'bg-[#21262d]/50 border-transparent text-[#8b949e] opacity-40 cursor-not-allowed'
                              }`}
                            >
                              <CheckCircle2 size={13} />
                            </button>
                            <button
                              onClick={() => store.classifyRequest(req.id, 'Отклонен', null)}
                              disabled={!isFullyConfigured}
                              title={isFullyConfigured ? 'Отклонить запрос' : 'Запрещено: Заполните все поля'}
                              className={`p-1.5 rounded border transition-all ${
                                isFullyConfigured
                                  ? 'bg-red-950 hover:bg-red-900 border-red-900 text-red-400'
                                  : 'bg-[#21262d]/50 border-transparent text-[#8b949e] opacity-40 cursor-not-allowed'
                              }`}
                            >
                              <XCircle size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: ADD / EDIT DIALOG WITH ALL 9 PARAMETERS */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-2xl w-full p-6 space-y-4 my-8 shadow-2xl">
            <h3 className="text-base font-semibold text-white">
              {isEditingReqId ? 'Редактировать входящую задачу' : 'Внести задачу вручную'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-[#8b949e] mb-1 font-medium">Название задачи / проблемы:</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Например: Сбой выгрузки банковской выписки..."
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-[#8b949e] mb-1 font-medium">Описание проблемы:</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Подробный контекст ошибки..."
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>

                {/* Source Selection */}
                <div className="md:col-span-2">
                  <label className="block text-[#8b949e] mb-1 font-medium">Источник поступления:</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-white focus:outline-none focus:border-[#58a6ff]"
                  >
                    {store.sources.map((s: any) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 9 OBLIGATORY ENTERPRISE DICTIONARY FIELDS SECTION */}
              <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg space-y-3">
                <div className="flex items-center gap-1.5 text-yellow-500 font-semibold mb-1">
                  <Info size={14} />
                  <span>Продуктовая классификация (Обязательные 9 параметров)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* 1. GitLab ID */}
                  <div>
                    <label className="block text-[#8b949e] mb-0.5 font-mono text-[10px]">1. ID GITLAB (например #104):</label>
                    <input
                      type="text"
                      value={gitlabIssueId}
                      onChange={(e) => setGitlabIssueId(e.target.value)}
                      placeholder="#999"
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    />
                  </div>

                  {/* 2. Project */}
                  <div>
                    <label className="block text-[#8b949e] mb-0.5 font-mono text-[10px]">2. ПРОЕКТ:</label>
                    <select
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
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
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
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
                      value={moduleId}
                      onChange={(e) => setModuleId(e.target.value)}
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
                      value={taskKindId}
                      onChange={(e) => setTaskKindId(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    >
                      <option value="">-- Выберите вид задачи --</option>
                      {store.taskKinds.map((k: TaskKind) => (
                        <option key={k.id} value={k.id}>{k.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 6. Task Type */}
                  <div>
                    <label className="block text-[#8b949e] mb-0.5 font-mono text-[10px]">6. ТИП ЗАДАЧИ:</label>
                    <select
                      value={taskTypeId}
                      onChange={(e) => setTaskTypeId(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    >
                      <option value="">-- Выберите тип задачи --</option>
                      {store.taskTypes.map((t: TaskType) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 7. Project Stage */}
                  <div>
                    <label className="block text-[#8b949e] mb-0.5 font-mono text-[10px]">7. ЭТАП ПРОЕКТА:</label>
                    <select
                      value={projectStageId}
                      onChange={(e) => setProjectStageId(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    >
                      <option value="">-- Выберите этап --</option>
                      {store.projectStages.map((s: ProjectStage) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 8. Author */}
                  <div>
                    <label className="block text-[#8b949e] mb-0.5 font-mono text-[10px]">8. АВТОР:</label>
                    <select
                      value={authorId}
                      onChange={(e) => setAuthorId(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    >
                      <option value="">-- Выберите автора --</option>
                      {store.users.map((u: User) => (
                        <option key={u.id} value={u.id}>{u.fullName}</option>
                      ))}
                    </select>
                  </div>

                  {/* 9. Executor */}
                  <div>
                    <label className="block text-[#8b949e] mb-0.5 font-mono text-[10px]">9. ИСПОЛНИТЕЛЬ:</label>
                    <select
                      value={executorId}
                      onChange={(e) => setExecutorId(e.target.value)}
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    >
                      <option value="">-- Выберите исполнителя --</option>
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
                      value={estimate}
                      onChange={(e) => setEstimate(Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    />
                  </div>

                  {/* Spent */}
                  <div>
                    <label className="block text-[#8b949e] mb-0.5 font-mono text-[10px]">ЗАТРАЧЕНО (ЧИСЛО ЧАСОВ):</label>
                    <input
                      type="number"
                      value={spent}
                      onChange={(e) => setSpent(Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-[#161b22] border border-[#30363d] rounded p-1.5 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded bg-[#21262d] text-white border border-[#30363d] hover:bg-[#30363d]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#238636] text-white hover:bg-[#2ea043]"
                >
                  {isEditingReqId ? 'Сохранить изменения' : 'Внести в бэклог (Черновик)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
