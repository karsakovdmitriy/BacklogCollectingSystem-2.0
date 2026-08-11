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
  Client,
  ActivityKind,
  Project,
  Product,
  Module,
  ProjectGroup,
  TaskKind,
  TaskType,
  ProjectStage,
  User,
  initialEpics,
  initialInitiatives,
  initialFeatures,
  initialTasks,
  initialRequests,
  initialReleases,
  initialAuditLogs,
  initialActivityKinds,
  initialClients,
  initialProducts,
  initialModules,
  initialProjectGroups,
  initialProjects,
  initialTaskKinds,
  initialTaskTypes,
  initialProjectStages,
  initialUsers,
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

  // --- PERSIST STATES WITH COMPATIBILITY PARSERS FOR ORIGINAL STORAGE KEYS ---

  const [activityKinds, setActivityKinds] = useState<ActivityKind[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dict_activity_kinds');
      return saved ? JSON.parse(saved) : initialActivityKinds;
    }
    return initialActivityKinds;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dict_clients');
      if (saved) {
        try {
          const list = JSON.parse(saved);
          return list.map((c: any) => ({
            id: c.id,
            name: c.name,
            activityKindId: c.activityKindId || 'act-1'
          }));
        } catch {
          return initialClients;
        }
      }
    }
    return initialClients;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dict_products');
      return saved ? JSON.parse(saved) : initialProducts;
    }
    return initialProducts;
  });

  const [modules, setModules] = useState<Module[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dict_modules');
      if (saved) {
        try {
          const list = JSON.parse(saved);
          return list.map((m: any) => ({
            id: m.id,
            name: m.name,
            gitlabLabel: m.gitlabLabel || 'module::custom'
          }));
        } catch {}
      }
      // Fallback check for subsystems
      const savedSubs = localStorage.getItem('dict_subsystems');
      if (savedSubs) {
        try {
          const list = JSON.parse(savedSubs);
          return list.map((s: any) => ({
            id: s.id,
            name: s.name,
            gitlabLabel: 'module::custom'
          }));
        } catch {}
      }
    }
    return initialModules;
  });

  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dict_project_groups');
      return saved ? JSON.parse(saved) : initialProjectGroups;
    }
    return initialProjectGroups;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dict_projects');
      if (saved) {
        try {
          const list = JSON.parse(saved);
          return list.map((p: any) => ({
            id: p.id,
            name: p.name || '',
            projectGroupId: p.projectGroupId || 'grp-1',
            clientId: p.clientId || 'cl-1',
            productId: p.productId || 'prod-2',
            moduleId: p.moduleId || 'mod-1',
            gitlabUrl: p.gitlabUrl || 'https://gitlab.corp.ru'
          }));
        } catch {
          return initialProjects;
        }
      }
    }
    return initialProjects;
  });

  const [taskKinds, setTaskKinds] = useState<TaskKind[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dict_task_kinds');
      if (saved) {
        try {
          const list = JSON.parse(saved);
          return list.map((k: any) => ({
            id: k.id,
            name: k.name,
            gitlabLabel: k.gitlabLabel || 'custom-label'
          }));
        } catch {
          return initialTaskKinds;
        }
      }
    }
    return initialTaskKinds;
  });

  const [taskTypes, setTaskTypes] = useState<TaskType[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dict_task_types');
      if (saved) {
        try {
          const list = JSON.parse(saved);
          return list.map((t: any) => ({
            id: t.id,
            name: t.name,
            gitlabLabel: t.gitlabLabel || 'custom-type-label'
          }));
        } catch {
          return initialTaskTypes;
        }
      }
    }
    return initialTaskTypes;
  });

  const [projectStages, setProjectStages] = useState<ProjectStage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dict_project_stages');
      return saved ? JSON.parse(saved) : initialProjectStages;
    }
    return initialProjectStages;
  });

  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dict_users');
      return saved ? JSON.parse(saved) : initialUsers;
    }
    return initialUsers;
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

  // --- SAVE LOCAL STORAGE WITH COMPATIBLE KEYS ---
  useEffect(() => {
    localStorage.setItem('dict_activity_kinds', JSON.stringify(activityKinds));
  }, [activityKinds]);

  useEffect(() => {
    localStorage.setItem('dict_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('dict_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('dict_modules', JSON.stringify(modules));
    // Synced subsystem backup for fully resilient backward compatibility
    localStorage.setItem('dict_subsystems', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('dict_project_groups', JSON.stringify(projectGroups));
  }, [projectGroups]);

  useEffect(() => {
    localStorage.setItem('dict_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('dict_task_kinds', JSON.stringify(taskKinds));
  }, [taskKinds]);

  useEffect(() => {
    localStorage.setItem('dict_task_types', JSON.stringify(taskTypes));
  }, [taskTypes]);

  useEffect(() => {
    localStorage.setItem('dict_project_stages', JSON.stringify(projectStages));
  }, [projectStages]);

  useEffect(() => {
    localStorage.setItem('dict_users', JSON.stringify(users));
  }, [users]);

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

  // --- CRUD HELPERS FOR THE NEW 12 ENTITIES ---

  // 1. Clients (Клиенты)
  const addClient = (name: string, activityKindId?: string) => {
    const defaultActKind = activityKinds[0]?.id || 'act-1';
    const newItem: Client = { id: `cl-${Date.now()}`, name, activityKindId: activityKindId || defaultActKind };
    setClients((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен клиент ${name}`);
  };
  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален клиент ${id}`);
  };

  // 2. Activity Kinds (Виды деятельности)
  const addActivityKind = (name: string) => {
    const newItem: ActivityKind = { id: `act-${Date.now()}`, name };
    setActivityKinds((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен вид деятельности ${name}`);
  };
  const deleteActivityKind = (id: string) => {
    setActivityKinds((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален вид деятельности ${id}`);
  };

  // 3. Projects (Проекты)
  const addProjectNew = (projectData: Omit<Project, 'id'>) => {
    const newItem: Project = { id: `pr-${Date.now()}`, ...projectData };
    setProjects((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен проект ${projectData.name || '(Клиент + Модуль)'}`);
  };
  const deleteProjectNew = (id: string) => {
    setProjects((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален проект ${id}`);
  };

  const addProject = (name: string) => {
    const newItem: Project = {
      id: `pr-${Date.now()}`,
      name,
      projectGroupId: projectGroups[0]?.id || 'grp-1',
      clientId: clients[0]?.id || 'cl-1',
      productId: products[0]?.id || 'prod-2',
      moduleId: modules[0]?.id || 'mod-1',
      gitlabUrl: 'https://gitlab.corp.ru'
    };
    setProjects((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен проект ${name}`);
  };
  const deleteProject = (id: string) => {
    deleteProjectNew(id);
  };

  // 4. Products (Продукты)
  const addProduct = (name: string) => {
    const newItem: Product = { id: `prod-${Date.now()}`, name };
    setProducts((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен продукт ${name}`);
  };
  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален продукт ${id}`);
  };

  // 5. Modules (Модули)
  const addModule = (name: string, gitlabLabel?: string) => {
    const newItem: Module = { id: `mod-${Date.now()}`, name, gitlabLabel: gitlabLabel || 'module::custom' };
    setModules((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен модуль ${name}`);
  };
  const deleteModule = (id: string) => {
    setModules((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален модуль ${id}`);
  };

  // 6. Project Groups (Группы проектов)
  const addProjectGroup = (name: string, gitlabUrl: string) => {
    const newItem: ProjectGroup = { id: `grp-${Date.now()}`, name, gitlabUrl };
    setProjectGroups((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлена группа проектов ${name}`);
  };
  const deleteProjectGroup = (id: string) => {
    setProjectGroups((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удалена группа проектов ${id}`);
  };

  // 7. Task Kinds (Виды задач)
  const addTaskKindNew = (name: string, gitlabLabel?: string) => {
    const newItem: TaskKind = { id: `kind-${Date.now()}`, name, gitlabLabel: gitlabLabel || 'custom-label' };
    setTaskKinds((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен вид задачи ${name}`);
  };
  const deleteTaskKindNew = (id: string) => {
    setTaskKinds((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален вид задачи ${id}`);
  };

  const addTaskKind = (name: string, gitlabLabel?: string) => {
    addTaskKindNew(name, gitlabLabel || 'custom-label');
  };
  const deleteTaskKind = (id: string) => {
    deleteTaskKindNew(id);
  };

  // 8. Task Types (Типы задач)
  const addTaskTypeNew = (name: string, gitlabLabel?: string) => {
    const newItem: TaskType = { id: `type-${Date.now()}`, name, gitlabLabel: gitlabLabel || 'custom-type-label' };
    setTaskTypes((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен тип задачи ${name}`);
  };
  const deleteTaskTypeNew = (id: string) => {
    setTaskTypes((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален тип задачи ${id}`);
  };

  const addTaskType = (name: string, gitlabLabel?: string) => {
    addTaskTypeNew(name, gitlabLabel || 'custom-type-label');
  };
  const deleteTaskType = (id: string) => {
    deleteTaskTypeNew(id);
  };

  // 9. Project Stages (Этапы проектов)
  const addProjectStage = (name: string, gitlabLabel: string) => {
    const newItem: ProjectStage = { id: `stg-${Date.now()}`, name, gitlabLabel };
    setProjectStages((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен этап проекта ${name}`);
  };
  const deleteProjectStage = (id: string) => {
    setProjectStages((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален этап проекта ${id}`);
  };

  // 11. Users (Пользователи)
  const addUser = (userData: Omit<User, 'id'>) => {
    const newItem: User = { id: `usr-${Date.now()}`, ...userData };
    setUsers((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен пользователь ${userData.fullName}`);
  };
  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален пользователь ${id}`);
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

  // Helper helper to render constructed Project Name
  const getProjectName = (proj: Project): string => {
    if (proj.name && proj.name.trim() !== '') {
      return proj.name;
    }
    const c = clients.find((item) => item.id === proj.clientId);
    const m = modules.find((item) => item.id === proj.moduleId);
    return `${c ? c.name : 'Unknown Client'} + ${m ? m.name : 'Unknown Module'}`;
  };

  // Helper validation logic checking for new mandatory attributes (except status 'Неразобранные')
  const isRequestFullyConfigured = (req: Partial<Request>): boolean => {
    return !!(
      req.gitlabIssueId &&
      req.projectId &&
      req.productId &&
      req.moduleId &&
      req.taskKindId &&
      req.taskTypeId &&
      req.projectStageId &&
      req.authorId &&
      req.executorId
    );
  };

  // Add Request
  const addRequest = (req: Omit<Request, 'id' | 'code' | 'createdAt'>) => {
    const code = `REQ-${100 + requests.length + 1}`;

    // Fill legacy fields for backward compatibility / logic mapping:
    let legacyClient = '';
    let legacyProject = '';
    let legacySubsystem = '';
    let legacyKind = '';
    let legacyType = '';

    if (req.projectId) {
      const proj = projects.find((p) => p.id === req.projectId);
      if (proj) {
        legacyProject = getProjectName(proj);
        const cl = clients.find((c) => c.id === proj.clientId);
        if (cl) legacyClient = cl.name;
        const md = modules.find((m) => m.id === proj.moduleId);
        if (md) legacySubsystem = md.name;
      }
    }
    if (req.taskKindId) {
      const k = taskKinds.find((item) => item.id === req.taskKindId);
      if (k) legacyKind = k.name;
    }
    if (req.taskTypeId) {
      const t = taskTypes.find((item) => item.id === req.taskTypeId);
      if (t) legacyType = t.name;
    }

    const payload = {
      ...req,
      client: legacyClient || undefined,
      project: legacyProject || undefined,
      subsystem: legacySubsystem || undefined,
      taskKind: legacyKind || undefined,
      taskType: legacyType || undefined,
    };

    let validatedStatus = payload.status;
    if ((validatedStatus === 'Принят' || validatedStatus === 'Отклонен' || validatedStatus === 'В проработку') && !isRequestFullyConfigured(payload)) {
      validatedStatus = 'Неразобранные';
    }

    const newReq: Request = {
      ...payload,
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
    // Re-fill legacy fields for logic mapping:
    let legacyClient = '';
    let legacyProject = '';
    let legacySubsystem = '';
    let legacyKind = '';
    let legacyType = '';

    if (updatedReq.projectId) {
      const proj = projects.find((p) => p.id === updatedReq.projectId);
      if (proj) {
        legacyProject = getProjectName(proj);
        const cl = clients.find((c) => c.id === proj.clientId);
        if (cl) legacyClient = cl.name;
        const md = modules.find((m) => m.id === proj.moduleId);
        if (md) legacySubsystem = md.name;
      }
    }
    if (updatedReq.taskKindId) {
      const k = taskKinds.find((item) => item.id === updatedReq.taskKindId);
      if (k) legacyKind = k.name;
    }
    if (updatedReq.taskTypeId) {
      const t = taskTypes.find((item) => item.id === updatedReq.taskTypeId);
      if (t) legacyType = t.name;
    }

    const payload = {
      ...updatedReq,
      client: legacyClient || undefined,
      project: legacyProject || undefined,
      subsystem: legacySubsystem || undefined,
      taskKind: legacyKind || undefined,
      taskType: legacyType || undefined,
    };

    setRequests((prev) => prev.map((r) => (r.id === updatedReq.id ? payload : r)));
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

  // Classify Request (Enforces 9 parameters constraint for Accepted/Rejected/In Discovery, allows Unsorted freely)
  const classifyRequest = (requestId: string, status: 'Отклонен' | 'В проработку' | 'Принят' | 'Неразобранные', associatedFeatureId?: string | null) => {
    let errorOccurred = false;
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          // Validation is compulsory for Accepted ('Принят'), Rejected ('Отклонен') and In Discovery ('В проработку')
          if ((status === 'Принят' || status === 'Отклонен' || status === 'В проработку') && !isRequestFullyConfigured(r)) {
            alert(`Ошибка! Невозможно изменить статус запроса ${r.code} на "${status}". Сначала заполните все обязательные параметры.`);
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
    logAction('UPDATE_GITLAB_SETTINGS', `Обновлены настройки интеграции GitLab для группы проектов "${newSettings.projectGroup}"`);
  };

  const importGitLabIssues = () => {
    // Resolve project name - use first project or create default
    const proj = projects[0] || { id: 'pr-1', productId: 'prod-2', moduleId: 'mod-1' };
    const projectName = proj ? getProjectName(proj) : 'Неразобранный проект';

    // Simulated Issues pulled from configured projectGroup
    const simulatedIssues = [
      {
        gitlabId: '#1201',
        title: `[GitLab / ${gitLabSettings.projectGroup}] Критическая XSS уязвимость при обработке транзакций`,
        description: `Обнаружена брешь при валидации входящих POST запросов. Срочно исправить.\nГруппа: ${gitLabSettings.projectGroup}`,
        labels: ['bug', 'integration'],
      },
      {
        gitlabId: '#1202',
        title: `[GitLab / ${gitLabSettings.projectGroup}] Добавление сверки реестров оплат по СБП в JSON формате`,
        description: `Запрос на импорт JSON реестров для оптимизации взаимодействия.\nГруппа: ${gitLabSettings.projectGroup}`,
        labels: ['feature', 'payment'],
      },
      {
        gitlabId: '#1203',
        title: `[GitLab / ${gitLabSettings.projectGroup}] Оптимизация производительности SQL индексов`,
        description: `Под нагрузкой 500 rps наблюдается замедление выполнения процедур сверки.\nГруппа: ${gitLabSettings.projectGroup}`,
        labels: ['tech-debt', 'optimization'],
      }
    ];

    const importedRequests: Request[] = [];

    simulatedIssues.forEach((issue, idx) => {
      const matchedKindId = taskKinds[0]?.id || 'kind-2';
      const resolvedKindName = taskKinds.find(k => k.id === matchedKindId)?.name || 'Фича (Feature)';

      const matchedTypeId = taskTypes[0]?.id || 'type-1';
      const resolvedTypeName = taskTypes.find(t => t.id === matchedTypeId)?.name || 'Интеграционный сбой';

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
        client: clients[0]?.name || 'ПАО "Сбербанк"',
        project: projectName,
        subsystem: modules[0]?.name || 'СБП Процессинг',
        taskKind: resolvedKindName,
        taskType: resolvedTypeName,
        epicId: resolvedEpicId,
        associatedFeatureId: null,

        // Strict references for auto-import
        authorId: users[0]?.id || 'usr-1',
        executorId: users[0]?.id || 'usr-1',
        projectId: proj ? proj.id : 'pr-1',
        productId: proj ? proj.productId : 'prod-1',
        moduleId: proj ? proj.moduleId : 'mod-1',
        taskKindId: matchedKindId,
        taskTypeId: matchedTypeId,
        projectStageId: projectStages[0]?.id || 'stg-1',
        estimate: 10,
        spent: 0,

        createdAt: new Date().toISOString().substring(0, 10),
      };

      importedRequests.push(newReq);
    });

    setRequests((prev) => [...importedRequests, ...prev]);

    logAction(
      'IMPORT_GITLAB_ISSUES',
      `Импортировано ${importedRequests.length} задач из GitLab группы проектов "${gitLabSettings.projectGroup}".`
    );

    return {
      success: true,
      count: importedRequests.length,
      projectPath: gitLabSettings.projectGroup,
      projectName,
      issues: importedRequests.map(r => ({
        gitlabId: r.gitlabIssueId,
        title: r.title,
        kind: r.taskKind,
        type: r.taskType
      }))
    };
  };

  // Automated simulated GitLab imports for all entities
  const importClientsFromGitLab = () => {
    const defaultActKind = activityKinds[0]?.id || 'act-1';
    const newItems: Client[] = [
      { id: `cl-gl-1`, name: 'ПАО "Сбербанк" (GitLab)', activityKindId: defaultActKind },
      { id: `cl-gl-2`, name: 'АО "Альфа-Банк" (GitLab)', activityKindId: defaultActKind },
      { id: `cl-gl-3`, name: 'ООО "Яндекс" (GitLab)', activityKindId: defaultActKind }
    ];
    setClients((prev) => {
      const existingNames = prev.map(i => i.name);
      const filtered = newItems.filter(i => !existingNames.includes(i.name));
      return [...prev, ...filtered];
    });
    logAction('IMPORT_GITLAB_ENTITY', `Справочник: Импортировано клиентов из группы проектов ${gitLabSettings.projectGroup}`);
    return newItems.map(i => i.name);
  };

  const importActivityKindsFromGitLab = () => {
    const newItems: ActivityKind[] = [
      { id: `act-gl-1`, name: 'Финансовые сервисы (GitLab)' },
      { id: `act-gl-2`, name: 'Телекоммуникации (GitLab)' }
    ];
    setActivityKinds((prev) => {
      const existingNames = prev.map(i => i.name);
      const filtered = newItems.filter(i => !existingNames.includes(i.name));
      return [...prev, ...filtered];
    });
    logAction('IMPORT_GITLAB_ENTITY', `Справочник: Импортировано видов деятельности из группы проектов ${gitLabSettings.projectGroup}`);
    return newItems.map(i => i.name);
  };

  const importProjectsFromGitLab = () => {
    const newItems: Project[] = [
      {
        id: `pr-gl-1`,
        name: 'Платежный шлюз B2B (GitLab)',
        projectGroupId: projectGroups[0]?.id || 'grp-1',
        clientId: clients[0]?.id || 'cl-1',
        productId: products[0]?.id || 'prod-2',
        moduleId: modules[0]?.id || 'mod-1',
        gitlabUrl: `${gitLabSettings.serverUrl}/${gitLabSettings.projectGroup}/b2b-gateway`
      },
      {
        id: `pr-gl-2`,
        name: 'Мобильное приложение Альфа (GitLab)',
        projectGroupId: projectGroups[0]?.id || 'grp-1',
        clientId: clients[0]?.id || 'cl-1',
        productId: products[0]?.id || 'prod-1',
        moduleId: modules[0]?.id || 'mod-1',
        gitlabUrl: `${gitLabSettings.serverUrl}/${gitLabSettings.projectGroup}/mobile-app`
      }
    ];
    setProjects((prev) => {
      const existingNames = prev.map(i => i.name);
      const filtered = newItems.filter(i => !existingNames.includes(i.name));
      return [...prev, ...filtered];
    });
    logAction('IMPORT_GITLAB_ENTITY', `Справочник: Импортировано проектов из группы проектов ${gitLabSettings.projectGroup}`);
    return newItems.map(i => i.name || 'Unknown Project');
  };

  const importProductsFromGitLab = () => {
    const newItems: Product[] = [
      { id: `prod-gl-1`, name: 'СБП Процессинг (GitLab)' },
      { id: `prod-gl-2`, name: 'Кредитный конвейер (GitLab)' }
    ];
    setProducts((prev) => {
      const existingNames = prev.map(i => i.name);
      const filtered = newItems.filter(i => !existingNames.includes(i.name));
      return [...prev, ...filtered];
    });
    logAction('IMPORT_GITLAB_ENTITY', `Справочник: Импортировано продуктов из группы проектов ${gitLabSettings.projectGroup}`);
    return newItems.map(i => i.name);
  };

  const importModulesFromGitLab = () => {
    const newItems: Module[] = [
      { id: `mod-gl-1`, name: 'Модуль Клиент-Банк (GitLab)', gitlabLabel: 'module::client-bank' },
      { id: `mod-gl-2`, name: 'Ядро Процессинга (GitLab)', gitlabLabel: 'module::core' }
    ];
    setModules((prev) => {
      const existingNames = prev.map(i => i.name);
      const filtered = newItems.filter(i => !existingNames.includes(i.name));
      return [...prev, ...filtered];
    });
    logAction('IMPORT_GITLAB_ENTITY', `Справочник: Импортировано модулей из группы проектов ${gitLabSettings.projectGroup}`);
    return newItems.map(i => i.name);
  };

  const importProjectGroupsFromGitLab = () => {
    const newItems: ProjectGroup[] = [
      { id: `grp-gl-1`, name: 'Группа СБП Проектов (GitLab)', gitlabUrl: `${gitLabSettings.serverUrl}/${gitLabSettings.projectGroup}` }
    ];
    setProjectGroups((prev) => {
      const existingNames = prev.map(i => i.name);
      const filtered = newItems.filter(i => !existingNames.includes(i.name));
      return [...prev, ...filtered];
    });
    logAction('IMPORT_GITLAB_ENTITY', `Справочник: Импортировано групп проектов из группы проектов ${gitLabSettings.projectGroup}`);
    return newItems.map(i => i.name);
  };

  const importTaskKindsFromGitLab = () => {
    const newItems: TaskKind[] = [
      { id: `kind-gl-1`, name: 'Ошибка (Bug) (GitLab)', gitlabLabel: 'bug' },
      { id: `kind-gl-2`, name: 'Фича (Feature) (GitLab)', gitlabLabel: 'feature' }
    ];
    setTaskKinds((prev) => {
      const existingNames = prev.map(i => i.name);
      const filtered = newItems.filter(i => !existingNames.includes(i.name));
      return [...prev, ...filtered];
    });
    logAction('IMPORT_GITLAB_ENTITY', `Справочник: Импортировано видов задач из группы проектов ${gitLabSettings.projectGroup}`);
    return newItems.map(i => i.name);
  };

  const importTaskTypesFromGitLab = () => {
    const newItems: TaskType[] = [
      { id: `type-gl-1`, name: 'Интеграционный сбой (GitLab)', gitlabLabel: 'type::integration' },
      { id: `type-gl-2`, name: 'Новый метод оплаты (GitLab)', gitlabLabel: 'type::payment' }
    ];
    setTaskTypes((prev) => {
      const existingNames = prev.map(i => i.name);
      const filtered = newItems.filter(i => !existingNames.includes(i.name));
      return [...prev, ...filtered];
    });
    logAction('IMPORT_GITLAB_ENTITY', `Справочник: Импортировано типов задач из группы проектов ${gitLabSettings.projectGroup}`);
    return newItems.map(i => i.name);
  };

  const importProjectStagesFromGitLab = () => {
    const newItems: ProjectStage[] = [
      { id: `stg-gl-1`, name: 'Аналитика (GitLab)', gitlabLabel: 'stage::analysis' },
      { id: `stg-gl-2`, name: 'Разработка (GitLab)', gitlabLabel: 'stage::development' }
    ];
    setProjectStages((prev) => {
      const existingNames = prev.map(i => i.name);
      const filtered = newItems.filter(i => !existingNames.includes(i.name));
      return [...prev, ...filtered];
    });
    logAction('IMPORT_GITLAB_ENTITY', `Справочник: Импортировано этапов проектов из группы проектов ${gitLabSettings.projectGroup}`);
    return newItems.map(i => i.name);
  };

  const importUsersFromGitLab = () => {
    const newItems: User[] = [
      { id: `usr-gl-1`, fullName: 'Алексей Иванов (GitLab)', isEnabled: true, email: 'alex@corp.ru', gitlabUser: 'alex_git', role: 'Администратор' },
      { id: `usr-gl-2`, fullName: 'Екатерина Смирнова (GitLab)', isEnabled: true, email: 'katya@corp.ru', gitlabUser: 'katya_git', role: 'Администратор' }
    ];
    setUsers((prev) => {
      const existingNames = prev.map(i => i.fullName);
      const filtered = newItems.filter(i => !existingNames.includes(i.fullName));
      return [...prev, ...filtered];
    });
    logAction('IMPORT_GITLAB_ENTITY', `Справочник: Импортировано пользователей из группы проектов ${gitLabSettings.projectGroup}`);
    return newItems.map(i => i.fullName);
  };

  const resetAllState = () => {
    localStorage.removeItem('ep_data');
    localStorage.removeItem('init_data');
    localStorage.removeItem('feat_data');
    localStorage.removeItem('task_data');
    localStorage.removeItem('req_data');
    localStorage.removeItem('rel_data');
    localStorage.removeItem('audit_data');
    localStorage.removeItem('dict_activity_kinds');
    localStorage.removeItem('dict_clients');
    localStorage.removeItem('dict_products');
    localStorage.removeItem('dict_modules');
    localStorage.removeItem('dict_project_groups');
    localStorage.removeItem('dict_projects');
    localStorage.removeItem('dict_task_kinds');
    localStorage.removeItem('dict_task_types');
    localStorage.removeItem('dict_project_stages');
    localStorage.removeItem('dict_users');
    localStorage.removeItem('dict_sources');
    localStorage.removeItem('gitlab_settings');

    setEpics(initialEpics);
    setInitiatives(initialInitiatives);
    setFeatures(initialFeatures);
    setTasks(initialTasks);
    setRequests(initialRequests);
    setReleases(initialReleases);
    setAuditLogs(initialAuditLogs);
    setActivityKinds(initialActivityKinds);
    setClients(initialClients);
    setProducts(initialProducts);
    setModules(initialModules);
    setProjectGroups(initialProjectGroups);
    setProjects(initialProjects);
    setTaskKinds(initialTaskKinds);
    setTaskTypes(initialTaskTypes);
    setProjectStages(initialProjectStages);
    setUsers(initialUsers);
    setGitLabSettings(initialGitLabSettings);

    logAction('RESET_ALL', 'Сброс всех настроек системы и восстановление демонстрационных данных по умолчанию.');
  };

  // Expose both subsystems and modules referencing the same array for full backwards compatibility
  const subsystems = modules;

  return {
    epics,
    initiatives,
    features,
    tasks,
    requests,
    releases,
    auditLogs,
    activityKinds,
    clients,
    products,
    modules,
    projectGroups,
    projects,
    taskKinds,
    taskTypes,
    projectStages,
    users,
    sources,
    subsystems, // compatibility getter
    addEpic,
    deleteEpic,
    addClient,
    deleteClient,
    addActivityKind,
    deleteActivityKind,
    addProject: addProjectNew,
    deleteProject: deleteProjectNew,
    addProduct,
    deleteProduct,
    addModule,
    deleteModule,
    addProjectGroup,
    deleteProjectGroup,
    addTaskKind: addTaskKindNew,
    deleteTaskKind: deleteTaskKindNew,
    addTaskType: addTaskTypeNew,
    deleteTaskType: deleteTaskTypeNew,
    addProjectStage,
    deleteProjectStage,
    addUser,
    deleteUser,
    getProjectName,
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
    importClientsFromGitLab,
    importActivityKindsFromGitLab,
    importProjectsFromGitLab,
    importProductsFromGitLab,
    importModulesFromGitLab,
    importProjectGroupsFromGitLab,
    importTaskKindsFromGitLab,
    importTaskTypesFromGitLab,
    importProjectStagesFromGitLab,
    importUsersFromGitLab,
    resetAllState
  };
}
