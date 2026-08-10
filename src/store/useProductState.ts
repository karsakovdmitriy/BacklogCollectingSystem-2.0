import { useState, useEffect } from 'react';
import {
  Epic,
  Initiative,
  Feature,
  Task,
  Request,
  Release,
  AuditLog,
  DictionaryItem,
  GitLabSettings,
  initialEpics,
  initialInitiatives,
  initialFeatures,
  initialTasks,
  initialRequests,
  initialReleases,
  initialAuditLogs,
  initialClients,
  initialProjects,
  initialSubsystems,
  initialTaskKinds,
  initialTaskTypes,
  initialSources,
  initialGitLabSettings
} from './index';

export function useProductState() {
  const [epics, setEpics] = useState<Epic[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ep_data');
      return saved ? JSON.parse(saved) : initialEpics;
    }
    return initialEpics;
  });

  const [initiatives, setInitiatives] = useState<Initiative[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('init_data');
      return saved ? JSON.parse(saved) : initialInitiatives;
    }
    return initialInitiatives;
  });

  const [features, setFeatures] = useState<Feature[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('feat_data');
      return saved ? JSON.parse(saved) : initialFeatures;
    }
    return initialFeatures;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('task_data');
      return saved ? JSON.parse(saved) : initialTasks;
    }
    return initialTasks;
  });

  const [requests, setRequests] = useState<Request[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('req_data');
      return saved ? JSON.parse(saved) : initialRequests;
    }
    return initialRequests;
  });

  const [releases, setReleases] = useState<Release[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rel_data');
      return saved ? JSON.parse(saved) : initialReleases;
    }
    return initialReleases;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('audit_data');
      return saved ? JSON.parse(saved) : initialAuditLogs;
    }
    return initialAuditLogs;
  });

  // State for Dictionaries
  const [clients, setClients] = useState<DictionaryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dict_clients');
      return saved ? JSON.parse(saved) : initialClients;
    }
    return initialClients;
  });

  const [projects, setProjects] = useState<DictionaryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dict_projects');
      return saved ? JSON.parse(saved) : initialProjects;
    }
    return initialProjects;
  });

  const [subsystems, setSubsystems] = useState<DictionaryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dict_subsystems');
      return saved ? JSON.parse(saved) : initialSubsystems;
    }
    return initialSubsystems;
  });

  const [taskKinds, setTaskKinds] = useState<DictionaryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dict_task_kinds');
      return saved ? JSON.parse(saved) : initialTaskKinds;
    }
    return initialTaskKinds;
  });

  const [taskTypes, setTaskTypes] = useState<DictionaryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dict_task_types');
      return saved ? JSON.parse(saved) : initialTaskTypes;
    }
    return initialTaskTypes;
  });

  const [sources, setSources] = useState<DictionaryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dict_sources');
      return saved ? JSON.parse(saved) : initialSources;
    }
    return initialSources;
  });

  const [gitLabSettings, setGitLabSettings] = useState<GitLabSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gitlab_settings');
      return saved ? JSON.parse(saved) : initialGitLabSettings;
    }
    return initialGitLabSettings;
  });

  // Persist State
  useEffect(() => {
    localStorage.setItem('ep_data', JSON.stringify(epics));
  }, [epics]);

  useEffect(() => {
    localStorage.setItem('init_data', JSON.stringify(initiatives));
  }, [initiatives]);

  useEffect(() => {
    localStorage.setItem('feat_data', JSON.stringify(features));
  }, [features]);

  useEffect(() => {
    localStorage.setItem('task_data', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('req_data', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('rel_data', JSON.stringify(releases));
  }, [releases]);

  useEffect(() => {
    localStorage.setItem('audit_data', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('dict_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('dict_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('dict_subsystems', JSON.stringify(subsystems));
  }, [subsystems]);

  useEffect(() => {
    localStorage.setItem('dict_task_kinds', JSON.stringify(taskKinds));
  }, [taskKinds]);

  useEffect(() => {
    localStorage.setItem('dict_task_types', JSON.stringify(taskTypes));
  }, [taskTypes]);

  useEffect(() => {
    localStorage.setItem('dict_sources', JSON.stringify(sources));
  }, [sources]);

  useEffect(() => {
    localStorage.setItem('gitlab_settings', JSON.stringify(gitLabSettings));
  }, [gitLabSettings]);

  // Recalculate autoScore for a Feature
  const recalculateAutoScore = (feat: Feature): number => {
    return (feat.repeatabilityCount * 3) + (feat.salesImpact * 10) + (feat.itsPriority * 10);
  };

  // Log Audit Action
  const logAction = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      userId: 'pm_current@corp.ru',
      action,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Add / Delete Epic
  const addEpic = (epic: Omit<Epic, 'id' | 'code'>) => {
    const code = `EPIC-${String(epics.length + 1).padStart(3, '0')}`;
    const newEpic: Epic = { ...epic, id: `ep-${Date.now()}`, code };
    setEpics((prev) => [...prev, newEpic]);
    logAction('CREATE_EPIC', `Создан эпик ${code}: ${epic.title}`);
  };

  const deleteEpic = (id: string) => {
    setEpics((prev) => prev.filter((e) => e.id !== id));
    logAction('DELETE_EPIC', `Удален эпик ${id}`);
  };

  // Dictionary management helpers
  const addClient = (name: string) => {
    const newItem = { id: `cl-${Date.now()}`, name };
    setClients((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен клиент ${name}`);
  };
  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален клиент ${id}`);
  };

  const addProject = (name: string) => {
    const newItem = { id: `pr-${Date.now()}`, name };
    setProjects((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен проект ${name}`);
  };
  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален проект ${id}`);
  };

  const addSubsystem = (name: string) => {
    const newItem = { id: `sub-${Date.now()}`, name };
    setSubsystems((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлена подсистема ${name}`);
  };
  const deleteSubsystem = (id: string) => {
    setSubsystems((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удалена подсистема ${id}`);
  };

  const addTaskKind = (name: string) => {
    const newItem = { id: `kind-${Date.now()}`, name };
    setTaskKinds((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен вид задачи ${name}`);
  };
  const deleteTaskKind = (id: string) => {
    setTaskKinds((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален вид задачи ${id}`);
  };

  const addTaskType = (name: string) => {
    const newItem = { id: `type-${Date.now()}`, name };
    setTaskTypes((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен тип задачи ${name}`);
  };
  const deleteTaskType = (id: string) => {
    setTaskTypes((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален тип задачи ${id}`);
  };

  const addSource = (name: string) => {
    const newItem = { id: `src-${Date.now()}`, name };
    setSources((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен источник ${name}`);
  };
  const deleteSource = (id: string) => {
    setSources((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален источник ${id}`);
  };

  // Add / Edit Initiative
  const addInitiative = (init: Omit<Initiative, 'id' | 'code'>) => {
    const code = `INIT-${100 + initiatives.length + 1}`;
    const newInit: Initiative = { ...init, id: `in-${Date.now()}`, code };
    setInitiatives((prev) => [...prev, newInit]);
    logAction('CREATE_INITIATIVE', `Создана инициатива ${code}: ${init.title}`);
  };

  // Transition feature status
  const moveFeatureToEstimation = (featureId: string) => {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id === featureId) {
          logAction('MOVE_TO_ESTIMATION', `Фича ${f.code} отправлена на оценку трудоемкости`);
          return { ...f, status: 'На оценке' };
        }
        return f;
      })
    );
  };

  const fillFeatureEffort = (featureId: string, hours: number) => {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id === featureId) {
          logAction('FILL_ESTIMATION', `Фича ${f.code} оценена: ${hours}ч.`);
          return { ...f, effortHours: hours, status: 'Оценено', developmentCost: hours * 2000 };
        }
        return f;
      })
    );
  };

  const batchFillFeatureEfforts = (updates: { id: string; hours: number }[]) => {
    setFeatures((prev) =>
      prev.map((f) => {
        const update = updates.find((u) => u.id === f.id);
        if (update) {
          logAction('BATCH_ESTIMATION', `Фича ${f.code} оценена пакетом: ${update.hours}ч.`);
          return { ...f, effortHours: update.hours, status: 'Оценено', developmentCost: update.hours * 2000 };
        }
        return f;
      })
    );
  };

  // Add Feature
  const addFeature = (feat: Omit<Feature, 'id' | 'code' | 'autoScore' | 'adoptionRate' | 'mau' | 'retentionRate' | 'segmentAdoption' | 'revenueGenerated' | 'developmentCost'>) => {
    const code = `FEAT-${100 + features.length + 1}`;
    const baseFeat: Omit<Feature, 'id' | 'code' | 'autoScore'> = {
      ...feat,
      status: feat.status || 'Backlog',
      adoptionRate: 0,
      mau: 0,
      retentionRate: 0,
      segmentAdoption: { enterprise: 0, sme: 0, retail: 0 },
      revenueGenerated: 0,
      developmentCost: feat.effortHours * 2000, // mock dev cost formula: 2000 RUB per hour
    };
    const autoScore = (feat.repeatabilityCount * 3) + (feat.salesImpact * 10) + (feat.itsPriority * 10);
    const newFeat: Feature = {
      ...baseFeat,
      id: `fe-${Date.now()}`,
      code,
      autoScore,
    };
    setFeatures((prev) => [...prev, newFeat]);
    logAction('CREATE_FEATURE', `Создана фича ${code}: ${feat.title} (AutoScore: ${autoScore})`);
    return newFeat.id;
  };

  // Update Feature
  const updateFeature = (updatedFeat: Feature) => {
    const autoScore = recalculateAutoScore(updatedFeat);
    const cost = updatedFeat.effortHours * 2000;
    const finalFeat = { ...updatedFeat, autoScore, developmentCost: cost };
    setFeatures((prev) => prev.map((f) => (f.id === updatedFeat.id ? finalFeat : f)));
  };

  // PM Score Override
  const overrideFeatureScore = (featureId: string, overrideScore: number | undefined, reason: string) => {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id === featureId) {
          const prevScore = f.overrideScore !== undefined ? f.overrideScore : f.autoScore;
          const targetScore = overrideScore !== undefined ? overrideScore : f.autoScore;
          logAction(
            'PRIORITY_OVERRIDE',
            `PM изменил приоритет ${f.code}: с ${prevScore} на ${targetScore}. Причина: ${reason}`
          );
          return {
            ...f,
            overrideScore,
            overrideReason: overrideScore !== undefined ? reason : undefined,
          };
        }
        return f;
      })
    );
  };

  // Reset Priority Override
  const resetFeatureOverride = (featureId: string) => {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id === featureId) {
          logAction('RESET_PRIORITY', `Сброс ручного приоритета для ${f.code} к системному значению ${f.autoScore}`);
          return {
            ...f,
            overrideScore: undefined,
            overrideReason: undefined,
          };
        }
        return f;
      })
    );
  };

  // Add Task
  const addTask = (task: Omit<Task, 'id' | 'code'>) => {
    const code = `TASK-${1000 + tasks.length + 1}`;
    const newTask: Task = { ...task, id: `t-${Date.now()}`, code };
    setTasks((prev) => [...prev, newTask]);
    logAction('CREATE_TASK', `Добавлена задача ${code}: ${task.title} к фиче ${task.featureId}`);
  };

  // Helper validation logic checking for 6 core attributes (excluding epicId and associatedFeatureId)
  const isRequestFullyConfigured = (req: Partial<Request>): boolean => {
    return !!(
      req.gitlabIssueId &&
      req.client &&
      req.project &&
      req.subsystem &&
      req.taskKind &&
      req.taskType
    );
  };

  // Add Request
  const addRequest = (req: Omit<Request, 'id' | 'code' | 'createdAt'>) => {
    const code = `REQ-${100 + requests.length + 1}`;

    // Default initial request might be incomplete. If it has incomplete fields, status is set to 'Неразобранные'.
    // If we try to add it with Accepted/Rejected but fields are missing, force it to 'Неразобранные'.
    let validatedStatus = req.status;
    if ((validatedStatus === 'Принят' || validatedStatus === 'Отклонен') && !isRequestFullyConfigured(req)) {
      validatedStatus = 'Неразобранные';
    }

    const newReq: Request = {
      ...req,
      status: validatedStatus,
      id: `req-${Date.now()}`,
      code,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setRequests((prev) => [...prev, newReq]);
    logAction('CREATE_REQUEST', `Получен запрос ${code}: ${req.title} (${req.source})`);

    // If fully configured, accepted, and bound, update repeatability
    if (validatedStatus === 'Принят' && req.associatedFeatureId) {
      incrementFeatureRepeatability(req.associatedFeatureId, code);
    }
  };

  // Update request inline details
  const updateRequestDetails = (updatedReq: Request) => {
    setRequests((prev) => prev.map((r) => (r.id === updatedReq.id ? updatedReq : r)));
    logAction('UPDATE_REQUEST_DETAILS', `Обновлены метаданные запроса ${updatedReq.code}`);
  };

  // Drag-and-drop helpers to update Request's Epic
  const updateRequestEpic = (requestId: string, epicId: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          logAction('REQUEST_EPIC_UPDATE_DND', `Запрос ${r.code} перенесен в Эпик ${epicId} через drag-and-drop`);
          return { ...r, epicId };
        }
        return r;
      })
    );
  };

  // Drag-and-drop helpers to bind request to a feature
  const associateRequestWithFeature = (requestId: string, featureId: string) => {
    let targetEpicId: string | undefined = undefined;

    // Find the feature to see its Epic (if any)
    const feat = features.find((f) => f.id === featureId);
    if (feat) {
      const init = initiatives.find((i) => i.id === feat.initiativeId);
      if (init) {
        targetEpicId = init.epicId;
      }
    }

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          logAction(
            'REQUEST_FEATURE_BIND_DND',
            `Запрос ${r.code} привязан к Фиче ${featureId} через drag-and-drop`
          );
          return {
            ...r,
            associatedFeatureId: featureId,
            status: 'Принят' as const, // auto-approve upon direct feature association
            epicId: targetEpicId || r.epicId, // auto-update epic to align with feature's epic
          };
        }
        return r;
      })
    );

    incrementFeatureRepeatability(featureId, requestId);
  };

  // Convert a request directly to a duplicate Feature and link them together
  const convertRequestToFeature = (requestId: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    // Use the first initiative as default
    const defaultInitiativeId = initiatives[0]?.id || 'in-1';

    // Add new duplicate feature
    const newFeatureId = addFeature({
      initiativeId: defaultInitiativeId,
      title: req.title,
      description: req.description || 'Создано автоматически из сигнала ' + req.code,
      effortHours: 40,
      repeatabilityCount: 1,
      salesImpact: 3,
      itsPriority: 3,
      releaseId: null,
      subsystem: req.subsystem,
      taskKind: req.taskKind || 'Фича (Feature)'
    });

    // Update Request status and link it to the newly created Feature
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          logAction('REQUEST_CONVERTED_TO_FEATURE', `Запрос ${r.code} преобразован в дублирующую фичу ${newFeatureId}`);
          return {
            ...r,
            associatedFeatureId: newFeatureId,
            status: 'Принят' as const
          };
        }
        return r;
      })
    );
  };

  // Classify Request (Enforces 6 parameters constraint for Accepted/Rejected/In Discovery, allows Unsorted freely)
  const classifyRequest = (requestId: string, status: 'Отклонен' | 'В проработку' | 'Принят' | 'Неразобранные', associatedFeatureId?: string | null) => {
    let errorOccurred = false;
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          // Validation is compulsory for Accepted ('Принят'), Rejected ('Отклонен') and In Discovery ('В проработку')
          if ((status === 'Принят' || status === 'Отклонен' || status === 'В проработку') && !isRequestFullyConfigured(r)) {
            alert(`Ошибка! Невозможно изменить статус запроса ${r.code} на "${status}". Сначала заполните все 6 обязательных параметров (Id Gitlab, Клиент, Проект, Подсистема, Вид задачи, Тип задачи).`);
            errorOccurred = true;
            return r;
          }

          const oldStatus = r.status;
          logAction('CLASSIFY_REQUEST', `Запрос ${r.code} классифицирован: ${oldStatus || 'Неразобранные'} -> ${status}`);

          if (status === 'Принят' && associatedFeatureId) {
            incrementFeatureRepeatability(associatedFeatureId, r.code);
          }
          return { ...r, status, associatedFeatureId };
        }
        return r;
      })
    );
    return !errorOccurred;
  };

  const incrementFeatureRepeatability = (featureId: string, triggerCode: string) => {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id === featureId) {
          const updated = { ...f, repeatabilityCount: f.repeatabilityCount + 1 };
          updated.autoScore = recalculateAutoScore(updated);
          logAction('AUTO_WEIGHT_UPDATE', `Повторяемость фичи ${f.code} выросла до ${updated.repeatabilityCount} из-за сигнала ${triggerCode}. Новый авто-скор: ${updated.autoScore}`);
          return updated;
        }
        return f;
      })
    );
  };

  // Release Planner actions
  const updateDraftCapacity = (capacity: number) => {
    setReleases((prev) =>
      prev.map((r) => (r.id === 'rel-draft' ? { ...r, capacityHours: capacity } : r))
    );
  };

  const toggleFeatureInRelease = (featureId: string, releaseId: string | null) => {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id === featureId) {
          const actionText = releaseId ? `Добавление в релиз ${releaseId}` : 'Удаление из релиза';
          logAction('RELEASE_UPDATE_FEATURE', `Фича ${f.code}: ${actionText}`);
          return { ...f, releaseId };
        }
        return f;
      })
    );
  };

  // Clear draft features
  const clearDraftFeatures = () => {
    setFeatures((prev) =>
      prev.map((f) => (f.releaseId === 'rel-draft' ? { ...f, releaseId: null } : f))
    );
    logAction('RELEASE_CLEAR_DRAFT', `Все фичи удалены из черновика релиза.`);
  };

  // Auto-allocate Features to draft release (Capacity constrained Knapsack algorithm based on Score)
  const autoAllocateDraftFeatures = (capacityLimit: number) => {
    const candidates = features.filter(f => f.releaseId !== 'rel-1');
    const sorted = [...candidates].sort((a, b) => {
      const scoreA = a.overrideScore !== undefined ? a.overrideScore : a.autoScore;
      const scoreB = b.overrideScore !== undefined ? b.overrideScore : b.autoScore;

      const densityA = scoreA / (a.effortHours || 1);
      const densityB = scoreB / (b.effortHours || 1);
      return densityB - densityA;
    });

    let currentSumHours = 0;
    const allocatedIds: string[] = [];

    for (const f of sorted) {
      if (currentSumHours + f.effortHours <= capacityLimit) {
        allocatedIds.push(f.id);
        currentSumHours += f.effortHours;
      }
    }

    setFeatures((prev) =>
      prev.map((f) => {
        if (f.releaseId === 'rel-1') return f;
        if (allocatedIds.includes(f.id)) {
          return { ...f, releaseId: 'rel-draft' };
        } else {
          return { ...f, releaseId: null };
        }
      })
    );

    logAction(
      'AUTO_ALLOCATE_RELEASE',
      `Автоподбор фич под лимит Capacity в ${capacityLimit} ч. завершен. Выбрано фич: ${allocatedIds.length}, суммарная нагрузка: ${currentSumHours} ч.`
    );
  };

  // Approve Release (locks Draft and exports mock Tasks to GitLab)
  const approveDraftRelease = () => {
    const draftRelease = releases.find(r => r.id === 'rel-draft');
    if (!draftRelease) return;

    const draftFeatures = features.filter(f => f.releaseId === 'rel-draft');
    if (draftFeatures.length === 0) {
      alert('Нет фич в черновике релиза для утверждения!');
      return;
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newApprovedId = `rel-${Date.now()}`;
    const newApprovedCode = `RELEASE-${new Date().getFullYear()}-REV-${Date.now().toString().slice(-4)}`;

    const exportLogs = [
      `INFO: Инициализация автоматического экспорта для утвержденного релиза ${newApprovedCode}`,
      `INFO: Направление экспорта: GitLab Group "Enterprise Products / Core"`,
      ...draftFeatures.flatMap((f) => {
        const featureTasks = tasks.filter(t => t.featureId === f.id);
        const taskLogs = featureTasks.map(t =>
          `  -> Создан GitLab Issue #${Math.floor(Math.random() * 2000 + 1000)} для задачи ${t.code} ("${t.title}")`
        );
        return [
          `INFO: Создание GitLab Epic/Feature Issue для [${f.code}] ${f.title}`,
          ...taskLogs,
          `SUCCESS: Интеграция фичи ${f.code} полностью завершена в GitLab.`
        ];
      }),
      `SUCCESS: Все задачи успешно экспортированы. Статус релиза: APPROVED. Поставлены вебхуки телеметрии.`
    ];

    const newApprovedRelease: Release = {
      id: newApprovedId,
      code: newApprovedCode,
      title: draftRelease.title,
      capacityHours: draftRelease.capacityHours,
      status: 'Approved',
      approvedAt: timestamp,
      exportLogs,
    };

    setReleases((prev) => [
      newApprovedRelease,
      ...prev.filter(r => r.id !== 'rel-draft'),
      {
        id: 'rel-draft',
        code: `RELEASE-PLAN-${new Date().getFullYear() + 1}`,
        title: `План релиза: Следующая Итерация`,
        capacityHours: 160,
        status: 'Draft'
      }
    ]);

    setFeatures((prev) =>
      prev.map((f) => {
        if (f.releaseId === 'rel-draft') {
          return {
            ...f,
            releaseId: newApprovedId,
            adoptionRate: Math.floor(Math.random() * 40 + 20),
            mau: Math.floor(Math.random() * 800 + 100),
            retentionRate: Math.floor(Math.random() * 30 + 50),
            segmentAdoption: {
              enterprise: Math.floor(Math.random() * 40 + 40),
              sme: Math.floor(Math.random() * 50 + 30),
              retail: Math.floor(Math.random() * 60 + 20)
            },
            revenueGenerated: Math.floor(Math.random() * 400000 + 50000)
          };
        }
        return f;
      })
    );

    logAction(
      'RELEASE_APPROVED',
      `PM утвердил релиз ${newApprovedCode}. Автоматически экспортировано задач в GitLab. Продуктовая телеметрия активирована.`
    );

    return newApprovedCode;
  };

  const updateGitLabSettings = (newSettings: GitLabSettings) => {
    setGitLabSettings(newSettings);
    logAction('UPDATE_GITLAB_SETTINGS', `Обновлены настройки интеграции GitLab для проекта "${newSettings.projectPath}"`);
  };

  const importGitLabIssues = () => {
    // Resolve project name
    const proj = projects.find((p) => p.id === gitLabSettings.mappedProjectId);
    const projectName = proj ? proj.name : 'Неразобранный проект';

    // Simulated Issues pulled from configured projectPath
    const simulatedIssues = [
      {
        gitlabId: '#1201',
        title: `[GitLab / ${gitLabSettings.projectPath}] Критическая XSS уязвимость при обработке транзакций`,
        description: `Обнаружена брешь при валидации входящих POST запросов. Срочно исправить.\nПроект: ${gitLabSettings.projectPath}`,
        labels: ['bug', 'integration'],
      },
      {
        gitlabId: '#1202',
        title: `[GitLab / ${gitLabSettings.projectPath}] Добавление сверки реестров оплат по СБП в JSON формате`,
        description: `Запрос на импорт JSON реестров для оптимизации взаимодействия.\nПроект: ${gitLabSettings.projectPath}`,
        labels: ['feature', 'payment'],
      },
      {
        gitlabId: '#1203',
        title: `[GitLab / ${gitLabSettings.projectPath}] Оптимизация производительности SQL индексов`,
        description: `Под нагрузкой 500 rps наблюдается замедление выполнения процедур сверки.\nПроект: ${gitLabSettings.projectPath}`,
        labels: ['tech-debt', 'optimization'],
      }
    ];

    const importedRequests: Request[] = [];

    simulatedIssues.forEach((issue, idx) => {
      // 1. Resolve Task Kind (Labels to local Task Kinds)
      let resolvedKindName = '';
      const matchedKindId = issue.labels.reduce<string | null>((acc, label) => {
        if (acc) return acc;
        return gitLabSettings.labelToKindMappings[label] || null;
      }, null) || gitLabSettings.mappedTaskKindId;

      if (matchedKindId) {
        const kindItem = taskKinds.find((k) => k.id === matchedKindId);
        if (kindItem) resolvedKindName = kindItem.name;
      }

      // 2. Resolve Task Type (Labels to local Task Types)
      let resolvedTypeName = '';
      const matchedTypeId = issue.labels.reduce<string | null>((acc, label) => {
        if (acc) return acc;
        return gitLabSettings.labelToTypeMappings[label] || null;
      }, null) || gitLabSettings.mappedTaskTypeId;

      if (matchedTypeId) {
        const typeItem = taskTypes.find((t) => t.id === matchedTypeId);
        if (typeItem) resolvedTypeName = typeItem.name;
      }

      // 3. Resolve Epic (If any)
      // For MVP simulation, we can assign to first epic if mapped, or keep empty
      const resolvedEpicId = epics[0]?.id;

      const code = `REQ-GL-${Date.now().toString().slice(-4)}-${idx + 1}`;

      const newReq: Request = {
        id: `req-gl-${Date.now()}-${idx + 1}`,
        code,
        title: issue.title,
        source: 'GitLab',
        description: issue.description,
        status: 'Неразобранные',
        gitlabIssueId: issue.gitlabId,
        client: clients[0]?.name || 'ПАО "Сбербанк"', // Default client for auto-import
        project: projectName,
        subsystem: subsystems[0]?.name || 'СБП Процессинг', // Default subsystem for auto-import
        taskKind: resolvedKindName || undefined,
        taskType: resolvedTypeName || undefined,
        epicId: resolvedEpicId,
        associatedFeatureId: null,
        createdAt: new Date().toISOString().substring(0, 10),
      };

      importedRequests.push(newReq);
    });

    setRequests((prev) => [...importedRequests, ...prev]);

    logAction(
      'IMPORT_GITLAB_ISSUES',
      `Импортировано ${importedRequests.length} задач из GitLab проекта "${gitLabSettings.projectPath}". Проект сопоставлен с "${projectName}"`
    );

    return {
      success: true,
      count: importedRequests.length,
      projectPath: gitLabSettings.projectPath,
      projectName,
      issues: importedRequests.map(r => ({
        gitlabId: r.gitlabIssueId,
        title: r.title,
        kind: r.taskKind,
        type: r.taskType
      }))
    };
  };

  const resetAllState = () => {
    localStorage.removeItem('ep_data');
    localStorage.removeItem('init_data');
    localStorage.removeItem('feat_data');
    localStorage.removeItem('task_data');
    localStorage.removeItem('req_data');
    localStorage.removeItem('rel_data');
    localStorage.removeItem('audit_data');
    localStorage.removeItem('dict_clients');
    localStorage.removeItem('dict_projects');
    localStorage.removeItem('dict_subsystems');
    localStorage.removeItem('dict_task_kinds');
    localStorage.removeItem('dict_task_types');
    localStorage.removeItem('gitlab_settings');

    setEpics(initialEpics);
    setInitiatives(initialInitiatives);
    setFeatures(initialFeatures);
    setTasks(initialTasks);
    setRequests(initialRequests);
    setReleases(initialReleases);
    setAuditLogs(initialAuditLogs);
    setClients(initialClients);
    setProjects(initialProjects);
    setSubsystems(initialSubsystems);
    setTaskKinds(initialTaskKinds);
    setTaskTypes(initialTaskTypes);
    setGitLabSettings(initialGitLabSettings);

    logAction('RESET_ALL', 'Сброс всех настроек системы и восстановление демонстрационных данных по умолчанию.');
  };

  return {
    epics,
    initiatives,
    features,
    tasks,
    requests,
    releases,
    auditLogs,
    clients,
    projects,
    subsystems,
    taskKinds,
    taskTypes,
    sources,
    addEpic,
    deleteEpic,
    addClient,
    deleteClient,
    addProject,
    deleteProject,
    addSubsystem,
    deleteSubsystem,
    addTaskKind,
    deleteTaskKind,
    addTaskType,
    deleteTaskType,
    addSource,
    deleteSource,
    addInitiative,
    addFeature,
    updateFeature,
    overrideFeatureScore,
    resetFeatureOverride,
    addTask,
    addRequest,
    updateRequestDetails,
    classifyRequest,
    updateRequestEpic,
    associateRequestWithFeature,
    convertRequestToFeature,
    updateDraftCapacity,
    toggleFeatureInRelease,
    clearDraftFeatures,
    autoAllocateDraftFeatures,
    approveDraftRelease,
    moveFeatureToEstimation,
    fillFeatureEffort,
    batchFillFeatureEfforts,
    gitLabSettings,
    updateGitLabSettings,
    importGitLabIssues,
    resetAllState
  };
}
