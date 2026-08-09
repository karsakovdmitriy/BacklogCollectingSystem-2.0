import { useState, useEffect } from 'react';
import {
  Epic,
  Initiative,
  Feature,
  Task,
  Request,
  Release,
  AuditLog,
  initialEpics,
  initialInitiatives,
  initialFeatures,
  initialTasks,
  initialRequests,
  initialReleases,
  initialAuditLogs,
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

  // Add / Edit Epic
  const addEpic = (epic: Omit<Epic, 'id' | 'code'>) => {
    const code = `EPIC-${String(epics.length + 1).padStart(3, '0')}`;
    const newEpic: Epic = { ...epic, id: `ep-${Date.now()}`, code };
    setEpics((prev) => [...prev, newEpic]);
    logAction('CREATE_EPIC', `Создан эпик ${code}: ${epic.title}`);
  };

  // Add / Edit Initiative
  const addInitiative = (init: Omit<Initiative, 'id' | 'code'>) => {
    const code = `INIT-${100 + initiatives.length + 1}`;
    const newInit: Initiative = { ...init, id: `in-${Date.now()}`, code };
    setInitiatives((prev) => [...prev, newInit]);
    logAction('CREATE_INITIATIVE', `Создана инициатива ${code}: ${init.title}`);
  };

  // Add Feature
  const addFeature = (feat: Omit<Feature, 'id' | 'code' | 'autoScore' | 'adoptionRate' | 'mau' | 'retentionRate' | 'segmentAdoption' | 'revenueGenerated' | 'developmentCost'>) => {
    const code = `FEAT-${100 + features.length + 1}`;
    const baseFeat: Omit<Feature, 'id' | 'code' | 'autoScore'> = {
      ...feat,
      adoptionRate: 0,
      mau: 0,
      retentionRate: 0,
      segmentAdoption: { enterprise: 0, sme: 0, retail: 0 },
      revenueGenerated: 0,
      developmentCost: feat.effortSP * 30000, // mock dev cost formula: 30 000 RUB per story point
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
    const cost = updatedFeat.effortSP * 30000;
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

    // Auto increment repeatability of feature if request triggered it
    logAction('CREATE_TASK', `Добавлена задача ${code}: ${task.title} к фиче ${task.featureId}`);
  };

  // Add Request & handle Classification
  const addRequest = (req: Omit<Request, 'id' | 'code' | 'createdAt'>) => {
    const code = `REQ-${100 + requests.length + 1}`;
    const newReq: Request = {
      ...req,
      id: `req-${Date.now()}`,
      code,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setRequests((prev) => [...prev, newReq]);
    logAction('CREATE_REQUEST', `Получен запрос ${code}: ${req.title} (${req.source})`);

    // If the request was classified and is accepted / bound to an existing feature, increase repeatability count!
    if (req.status === 'Принят' && req.associatedFeatureId) {
      incrementFeatureRepeatability(req.associatedFeatureId, code);
    }
  };

  const classifyRequest = (requestId: string, status: 'Отклонен' | 'В проработку' | 'Принят', associatedFeatureId?: string | null) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const oldStatus = r.status;
          logAction('CLASSIFY_REQUEST', `Запрос ${r.code} классифицирован: ${oldStatus} -> ${status}`);

          if (status === 'Принят' && associatedFeatureId) {
            incrementFeatureRepeatability(associatedFeatureId, r.code);
          }
          return { ...r, status, associatedFeatureId };
        }
        return r;
      })
    );
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
      prev.map((r) => (r.id === 'rel-draft' ? { ...r, capacitySP: capacity } : r))
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
    // Collect all features not in any APPROVED release
    const candidates = features.filter(f => f.releaseId !== 'rel-1');

    // Sort features by priority score DESC (use override if available, else autoScore)
    // To handle Value-to-Cost density, we sort by (Score / effortSP) DESC
    const sorted = [...candidates].sort((a, b) => {
      const scoreA = a.overrideScore !== undefined ? a.overrideScore : a.autoScore;
      const scoreB = b.overrideScore !== undefined ? b.overrideScore : b.autoScore;

      const densityA = scoreA / (a.effortSP || 1);
      const densityB = scoreB / (b.effortSP || 1);
      return densityB - densityA;
    });

    let currentSumSP = 0;
    const allocatedIds: string[] = [];

    for (const f of sorted) {
      if (currentSumSP + f.effortSP <= capacityLimit) {
        allocatedIds.push(f.id);
        currentSumSP += f.effortSP;
      }
    }

    // Update state: Set releaseId to 'rel-draft' for allocated, clear for others (if they were draft)
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.releaseId === 'rel-1') return f; // Leave approved alone
        if (allocatedIds.includes(f.id)) {
          return { ...f, releaseId: 'rel-draft' };
        } else {
          return { ...f, releaseId: null };
        }
      })
    );

    logAction(
      'AUTO_ALLOCATE_RELEASE',
      `Автоподбор фич под лимит Capacity в ${capacityLimit} SP завершен. Выбрано фич: ${allocatedIds.length}, суммарный вес: ${currentSumSP} SP.`
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

    // Generate simulated GitLab export logs
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

    // Create approved release record
    const newApprovedRelease: Release = {
      id: newApprovedId,
      code: newApprovedCode,
      title: draftRelease.title,
      capacitySP: draftRelease.capacitySP,
      status: 'Approved',
      approvedAt: timestamp,
      exportLogs,
    };

    // Update releases state
    setReleases((prev) => [
      newApprovedRelease,
      ...prev.filter(r => r.id !== 'rel-draft'),
      {
        id: 'rel-draft',
        code: `RELEASE-PLAN-${new Date().getFullYear() + 1}`,
        title: `План релиза: Следующая Итерация`,
        capacitySP: 20,
        status: 'Draft'
      }
    ]);

    // Update features: Lock features to this release and mock adoption start
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.releaseId === 'rel-draft') {
          return {
            ...f,
            releaseId: newApprovedId,
            adoptionRate: Math.floor(Math.random() * 40 + 20), // start mock telemetry
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

  const resetAllState = () => {
    localStorage.removeItem('ep_data');
    localStorage.removeItem('init_data');
    localStorage.removeItem('feat_data');
    localStorage.removeItem('task_data');
    localStorage.removeItem('req_data');
    localStorage.removeItem('rel_data');
    localStorage.removeItem('audit_data');
    setEpics(initialEpics);
    setInitiatives(initialInitiatives);
    setFeatures(initialFeatures);
    setTasks(initialTasks);
    setRequests(initialRequests);
    setReleases(initialReleases);
    setAuditLogs(initialAuditLogs);
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
    addEpic,
    addInitiative,
    addFeature,
    updateFeature,
    overrideFeatureScore,
    resetFeatureOverride,
    addTask,
    addRequest,
    classifyRequest,
    updateDraftCapacity,
    toggleFeatureInRelease,
    clearDraftFeatures,
    autoAllocateDraftFeatures,
    approveDraftRelease,
    resetAllState
  };
}
