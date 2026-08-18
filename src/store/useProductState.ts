import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  Epic,
  Initiative,
  Feature,
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
  ProjectStage,
  User,
  GitLabLabel,
  initialEpics,
  initialInitiatives,
  initialFeatures,
  initialGitLabLabels,
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
            gitlabLabel: k.gitlabLabel || 'custom-label',
            priorityPoints: k.priorityPoints || 3
          }));
        } catch {
          return initialTaskKinds;
        }
      }
    }
    return initialTaskKinds;
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
      if (saved) {
        try {
          const list = JSON.parse(saved);
          if (!list.some((s: any) => s.name === 'GitLab')) {
            list.unshift({ id: 'src-gl', name: 'GitLab' });
          }
          return list;
        } catch {}
      }
    }
    return initialSources;
  });

  const [gitLabLabels, setGitLabLabels] = useState<GitLabLabel[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dict_gitlab_labels');
      return saved ? JSON.parse(saved) : initialGitLabLabels;
    }
    return initialGitLabLabels;
  });

  const [gitLabSettings, setGitLabSettings] = useState<GitLabSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gitlab_settings');
      return saved ? JSON.parse(saved) : initialGitLabSettings;
    }
    return initialGitLabSettings;
  });

  // --- SUPABASE HYDRATION LAYER ON MOUNT ---
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return;

    const pullFromSupabase = async () => {
      try {
        const [
          { data: epDb },
          { data: initDb },
          { data: featDb },
          { data: reqDb },
          { data: relDb },
          { data: auditDb },
          { data: actDb },
          { data: clDb },
          { data: prodDb },
          { data: modDb },
          { data: grpDb },
          { data: projDb },
          { data: kindDb },
          { data: stageDb },
          { data: userDb },
          { data: srcDb }
        ] = await Promise.all([
          client.from('epics').select('*'),
          client.from('initiatives').select('*'),
          client.from('features').select('*'),
          client.from('requests').select('*'),
          client.from('releases').select('*'),
          client.from('pm_audits').select('*'),
          client.from('activity_kinds').select('*'),
          client.from('clients').select('*'),
          client.from('products').select('*'),
          client.from('modules').select('*'),
          client.from('project_groups').select('*'),
          client.from('projects').select('*'),
          client.from('task_kinds').select('*'),
          client.from('project_stages').select('*'),
          client.from('users').select('*'),
          client.from('sources').select('*')
        ]);

        if (epDb) {
          setEpics((epDb as any[]).map((e) => ({
            id: e.id,
            code: e.code,
            title: e.title,
          })));
        }
        if (initDb) setInitiatives(initDb as Initiative[]);
        if (featDb) {
          setFeatures(
            (featDb as any[]).map((f) => ({
              id: f.id,
              initiativeId: f.initiative_id,
              code: f.code,
              title: f.title,
              description: f.description || '',
              effortHours: f.effort_hours,
              repeatabilityCount: f.repeatability_count,
              autoScore: Number(f.auto_score),
              overrideScore: f.override_score !== null ? Number(f.override_score) : undefined,
              overrideReason: f.override_reason || undefined,
              releaseId: f.release_id,
              status: f.status,
              subsystem: f.subsystem || undefined,
              taskKind: f.task_kind || undefined,
              adoptionRate: f.adoption_rate,
              mau: f.mau,
              retentionRate: f.retention_rate,
              segmentAdoption: f.segment_adoption,
              revenueGenerated: Number(f.revenue_generated),
              developmentCost: Number(f.development_cost),
            }))
          );
        }
        if (reqDb) {
          setRequests(
            (reqDb as any[]).map((r) => ({
              id: r.id,
              code: r.code,
              title: r.title,
              source: r.source,
              description: r.description || '',
              status: r.status,
              gitlabIssueId: r.gitlab_issue_id || undefined,
              client: r.client || undefined,
              project: r.project || undefined,
              subsystem: r.subsystem || undefined,
              taskKind: r.task_kind || undefined,
              taskType: r.task_type || undefined,
              authorId: r.author_id || undefined,
              executorId: r.executor_id || undefined,
              projectId: r.project_id || undefined,
              productId: r.product_id || undefined,
              moduleId: r.module_id || undefined,
              taskKindId: r.task_kind_id || undefined,
              taskTypeId: r.task_type_id || undefined,
              projectStageId: r.project_stage_id || undefined,
              estimate: r.estimate,
              spent: r.spent,
              epicId: r.epic_id || undefined,
              associatedFeatureId: r.associated_feature_id || undefined,
              createdAt: r.created_at,
            }))
          );
        }
        if (relDb) {
          setReleases(
            (relDb as any[]).map((r) => ({
              id: r.id,
              code: r.code,
              title: r.title,
              capacityHours: r.capacity_hours,
              status: r.status,
              approvedAt: r.approved_at || undefined,
              exportLogs: r.export_logs || undefined,
            }))
          );
        }
        if (auditDb) {
          setAuditLogs(
            (auditDb as any[]).map((a) => ({
              id: String(a.id),
              timestamp: a.created_at,
              userId: a.pm_email,
              action: 'AUDIT',
              details: `Фича: ${a.feature_name}. Предыдущий вес: ${a.old_score}. Новый вес: ${a.new_score}. Причина: ${a.reason}`,
            }))
          );
        }
        if (actDb) setActivityKinds(actDb as ActivityKind[]);
        if (clDb) {
          setClients(
            (clDb as any[]).map((c) => ({
              id: c.id,
              name: c.name,
              activityKindId: c.activity_kind_id,
            }))
          );
        }
        if (prodDb) setProducts(prodDb as Product[]);
        if (modDb) {
          setModules(
            (modDb as any[]).map((m) => ({
              id: m.id,
              name: m.name,
              gitlabLabel: m.gitlab_label,
            }))
          );
        }
        if (grpDb) {
          setProjectGroups(
            (grpDb as any[]).map((g) => ({
              id: g.id,
              name: g.name,
              gitlabUrl: g.gitlab_url,
            }))
          );
        }
        if (projDb) {
          setProjects(
            (projDb as any[]).map((p) => ({
              id: p.id,
              name: p.name,
              projectGroupId: p.project_group_id,
              clientId: p.client_id,
              productId: p.product_id,
              gitlabUrl: p.gitlab_url,
            }))
          );
        }
        if (kindDb) {
          setTaskKinds(
            (kindDb as any[]).map((k) => ({
              id: k.id,
              name: k.name,
              gitlabLabel: k.gitlab_label,
              priorityPoints: k.priority_points,
            }))
          );
        }
        if (stageDb) {
          setProjectStages(
            (stageDb as any[]).map((s) => ({
              id: s.id,
              name: s.name,
              gitlabLabel: s.gitlab_label,
            }))
          );
        }
        if (userDb) {
          setUsers(
            (userDb as any[]).map((u) => ({
              id: u.id,
              fullName: u.full_name,
              isEnabled: u.is_enabled,
              email: u.email,
              gitlabUser: u.gitlab_user,
              role: u.role,
            }))
          );
        }
        if (srcDb) {
          const loadedSrcs = srcDb as DictionaryItem[];
          if (!loadedSrcs.some((s) => s.name === 'GitLab')) {
            loadedSrcs.unshift({ id: 'src-gl', name: 'GitLab' });
          }
          setSources(loadedSrcs);
        }
      } catch (err) {
        console.error('Supabase Hydration error:', err);
      }
    };

    pullFromSupabase();
  }, []);

  // --- PERSIST STATE TO LOCALSTORAGE (For Fallbacks) ---
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
    localStorage.setItem('req_data', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('rel_data', JSON.stringify(releases));
  }, [releases]);

  useEffect(() => {
    localStorage.setItem('audit_data', JSON.stringify(auditLogs));
  }, [auditLogs]);

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
    localStorage.setItem('dict_project_stages', JSON.stringify(projectStages));
  }, [projectStages]);

  useEffect(() => {
    localStorage.setItem('dict_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('dict_sources', JSON.stringify(sources));
  }, [sources]);

  useEffect(() => {
    localStorage.setItem('dict_gitlab_labels', JSON.stringify(gitLabLabels));
  }, [gitLabLabels]);

  useEffect(() => {
    localStorage.setItem('gitlab_settings', JSON.stringify(gitLabSettings));
  }, [gitLabSettings]);

  // Recalculate autoScore for a Feature
  const recalculateAutoScore = (feat: Feature): number => {
    return feat.repeatabilityCount * 10;
  };

  // Log Audit Action
  const logAction = async (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      userId: 'pm_current@corp.ru',
      action,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Add / Edit / Delete Epic
  const addEpic = async (epic: Omit<Epic, 'id' | 'code'>) => {
    const code = `EPIC-${String(epics.length + 1).padStart(3, '0')}`;
    const newEpic: Epic = { title: epic.title, id: `ep-${Date.now()}`, code };
    setEpics((prev) => [...prev, newEpic]);
    logAction('CREATE_EPIC', `Создан эпик ${code}: ${epic.title}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { error } = await client.from('epics').insert({
          id: newEpic.id,
          code: newEpic.code,
          title: newEpic.title,
        });
        if (error) console.error('Error adding Epic to Supabase:', error);
      } catch (err) {
        console.error('Exception adding Epic to Supabase:', err);
      }
    }
  };

  const updateEpic = async (updated: Epic) => {
    setEpics((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    logAction('UPDATE_EPIC', `Обновлен эпик ${updated.code}: ${updated.title}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { error } = await client.from('epics').update({ title: updated.title }).eq('id', updated.id);
        if (error) console.error('Error updating Epic in Supabase:', error);
      } catch (err) {
        console.error('Exception updating Epic in Supabase:', err);
      }
    }
  };

  const deleteEpic = async (id: string) => {
    setEpics((prev) => prev.filter((e) => e.id !== id));
    logAction('DELETE_EPIC', `Удален эпик ${id}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { error } = await client.from('epics').delete().eq('id', id);
        if (error) console.error('Error deleting Epic from Supabase:', error);
      } catch (err) {
        console.error('Exception deleting Epic from Supabase:', err);
      }
    }
  };

  // 1. Clients
  const addClient = async (name: string, activityKindId?: string) => {
    const defaultActKind = activityKinds[0]?.id || 'act-1';
    const newItem: Client = { id: `cl-${Date.now()}`, name, activityKindId: activityKindId || defaultActKind };
    setClients((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен клиент ${name}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { error } = await client.from('clients').insert({
          id: newItem.id,
          name: newItem.name,
          activity_kind_id: newItem.activityKindId,
        });
        if (error) console.error('Error adding Client to Supabase:', error);
      } catch (err) {
        console.error('Exception adding Client to Supabase:', err);
      }
    }
  };

  const updateClient = async (updated: Client) => {
    setClients((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    logAction('UPDATE_DICTIONARY', `Справочник: Обновлен клиент ${updated.name}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        await client.from('clients').update({
          name: updated.name,
          activity_kind_id: updated.activityKindId,
        }).eq('id', updated.id);
      } catch (err) {
        console.error('Exception updating Client in Supabase:', err);
      }
    }
  };

  const deleteClient = async (id: string) => {
    setClients((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален клиент ${id}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { error } = await client.from('clients').delete().eq('id', id);
        if (error) console.error('Error deleting Client from Supabase:', error);
      } catch (err) {
        console.error('Exception deleting Client from Supabase:', err);
      }
    }
  };

  // 2. Activity Kinds
  const addActivityKind = async (name: string) => {
    const newItem: ActivityKind = { id: `act-${Date.now()}`, name };
    setActivityKinds((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен вид деятельности ${name}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { error } = await client.from('activity_kinds').insert({
          id: newItem.id,
          name: newItem.name,
        });
        if (error) console.error('Error adding ActivityKind to Supabase:', error);
      } catch (err) {
        console.error('Exception adding ActivityKind to Supabase:', err);
      }
    }
  };

  const updateActivityKind = async (updated: ActivityKind) => {
    setActivityKinds((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    logAction('UPDATE_DICTIONARY', `Справочник: Обновлен вид деятельности ${updated.name}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        await client.from('activity_kinds').update({ name: updated.name }).eq('id', updated.id);
      } catch (err) {
        console.error('Exception updating ActivityKind in Supabase:', err);
      }
    }
  };

  const deleteActivityKind = async (id: string) => {
    setActivityKinds((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален вид деятельности ${id}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { error } = await client.from('activity_kinds').delete().eq('id', id);
        if (error) console.error('Error deleting ActivityKind from Supabase:', error);
      } catch (err) {
        console.error('Exception deleting ActivityKind from Supabase:', err);
      }
    }
  };

  // 3. Projects
  const addProjectNew = async (projectData: Omit<Project, 'id'>) => {
    const newItem: Project = { id: `pr-${Date.now()}`, ...projectData };
    setProjects((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен проект ${projectData.name || '(Клиент)'}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { error } = await client.from('projects').insert({
          id: newItem.id,
          name: newItem.name,
          project_group_id: newItem.projectGroupId,
          client_id: newItem.clientId,
          product_id: newItem.productId,
          gitlab_url: newItem.gitlabUrl,
        });
        if (error) console.error('Error adding Project to Supabase:', error);
      } catch (err) {
        console.error('Exception adding Project to Supabase:', err);
      }
    }
  };

  const updateProject = async (updated: Project) => {
    setProjects((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    logAction('UPDATE_DICTIONARY', `Справочник: Обновлен проект ${updated.name || '(Клиент)'}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        await client.from('projects').update({
          name: updated.name,
          project_group_id: updated.projectGroupId,
          client_id: updated.clientId,
          product_id: updated.productId,
          gitlab_url: updated.gitlabUrl,
        }).eq('id', updated.id);
      } catch (err) {
        console.error('Exception updating Project in Supabase:', err);
      }
    }
  };

  const deleteProjectNew = async (id: string) => {
    setProjects((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален проект ${id}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { error } = await client.from('projects').delete().eq('id', id);
        if (error) console.error('Error deleting Project from Supabase:', error);
      } catch (err) {
        console.error('Exception deleting Project from Supabase:', err);
      }
    }
  };

  const addProject = (name: string) => {
    addProjectNew({
      name,
      projectGroupId: projectGroups[0]?.id || 'grp-1',
      clientId: clients[0]?.id || 'cl-1',
      productId: products[0]?.id || 'prod-2',
      gitlabUrl: 'https://gitlab.corp.ru'
    });
  };

  const deleteProject = (id: string) => {
    deleteProjectNew(id);
  };

  // 4. Products
  const addProduct = async (name: string) => {
    const newItem: Product = { id: `prod-${Date.now()}`, name };
    setProducts((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен продукт ${name}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('products').insert({
        id: newItem.id,
        name: newItem.name,
      });
    }
  };

  const updateProduct = async (updated: Product) => {
    setProducts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    logAction('UPDATE_DICTIONARY', `Справочник: Обновлен продукт ${updated.name}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('products').update({ name: updated.name }).eq('id', updated.id);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален продукт ${id}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('products').delete().eq('id', id);
    }
  };

  // 5. Modules
  const addModule = async (name: string, gitlabLabel?: string) => {
    const newItem: Module = { id: `mod-${Date.now()}`, name, gitlabLabel: gitlabLabel || 'module::custom' };
    setModules((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен модуль ${name}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('modules').insert({
        id: newItem.id,
        name: newItem.name,
        gitlab_label: newItem.gitlabLabel,
      });
    }
  };

  const updateModule = async (updated: Module) => {
    setModules((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    logAction('UPDATE_DICTIONARY', `Справочник: Обновлен модуль ${updated.name}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('modules').update({
        name: updated.name,
        gitlab_label: updated.gitlabLabel,
      }).eq('id', updated.id);
    }
  };

  const deleteModule = async (id: string) => {
    setModules((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален модуль ${id}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('modules').delete().eq('id', id);
    }
  };

  // 6. Project Groups
  const addProjectGroup = async (name: string, gitlabUrl: string) => {
    const newItem: ProjectGroup = { id: `grp-${Date.now()}`, name, gitlabUrl };
    setProjectGroups((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлена группа проектов ${name}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('project_groups').insert({
        id: newItem.id,
        name: newItem.name,
        gitlab_url: newItem.gitlabUrl,
      });
    }
  };

  const updateProjectGroup = async (updated: ProjectGroup) => {
    setProjectGroups((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    logAction('UPDATE_DICTIONARY', `Справочник: Обновлена группа проектов ${updated.name}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('project_groups').update({
        name: updated.name,
        gitlab_url: updated.gitlabUrl,
      }).eq('id', updated.id);
    }
  };

  const deleteProjectGroup = async (id: string) => {
    setProjectGroups((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удалена группа проектов ${id}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('project_groups').delete().eq('id', id);
    }
  };

  // 7. Task Kinds
  const addTaskKindNew = async (name: string, gitlabLabel?: string, priorityPoints?: number) => {
    const newItem: TaskKind = { id: `kind-${Date.now()}`, name, gitlabLabel: gitlabLabel || 'custom-label', priorityPoints: priorityPoints || 3 };
    setTaskKinds((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен вид задачи ${name}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('task_kinds').insert({
        id: newItem.id,
        name: newItem.name,
        gitlab_label: newItem.gitlabLabel,
        priority_points: newItem.priorityPoints,
      });
    }
  };

  const updateTaskKind = async (updated: TaskKind) => {
    setTaskKinds((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    logAction('UPDATE_DICTIONARY', `Справочник: Обновлен вид задачи ${updated.name}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('task_kinds').update({
        name: updated.name,
        gitlab_label: updated.gitlabLabel,
        priority_points: updated.priorityPoints,
      }).eq('id', updated.id);
    }
  };

  const deleteTaskKindNew = async (id: string) => {
    setTaskKinds((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален вид задачи ${id}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('task_kinds').delete().eq('id', id);
    }
  };

  const addTaskKind = (name: string, gitlabLabel?: string, priorityPoints?: number) => {
    addTaskKindNew(name, gitlabLabel || 'custom-label', priorityPoints);
  };
  const deleteTaskKind = (id: string) => {
    deleteTaskKindNew(id);
  };

  // 9. Project Stages
  const addProjectStage = async (name: string, gitlabLabel: string) => {
    const newItem: ProjectStage = { id: `stg-${Date.now()}`, name, gitlabLabel };
    setProjectStages((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен этап проекта ${name}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('project_stages').insert({
        id: newItem.id,
        name: newItem.name,
        gitlab_label: newItem.gitlabLabel,
      });
    }
  };

  const updateProjectStage = async (updated: ProjectStage) => {
    setProjectStages((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    logAction('UPDATE_DICTIONARY', `Справочник: Обновлен этап проекта ${updated.name}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('project_stages').update({
        name: updated.name,
        gitlab_label: updated.gitlabLabel,
      }).eq('id', updated.id);
    }
  };

  const deleteProjectStage = async (id: string) => {
    setProjectStages((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален этап проекта ${id}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('project_stages').delete().eq('id', id);
    }
  };

  // 11. Users
  const addUser = async (userData: Omit<User, 'id'>) => {
    const newItem: User = { id: `usr-${Date.now()}`, ...userData };
    setUsers((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен пользователь ${userData.fullName}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('users').insert({
        id: newItem.id,
        full_name: newItem.fullName,
        is_enabled: newItem.isEnabled,
        email: newItem.email,
        gitlab_user: newItem.gitlabUser,
        role: newItem.role,
      });
    }
  };

  const updateUser = async (updated: User) => {
    setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    logAction('UPDATE_DICTIONARY', `Справочник: Обновлен пользователь ${updated.fullName}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('users').update({
        full_name: updated.fullName,
        is_enabled: updated.isEnabled,
        email: updated.email,
        gitlab_user: updated.gitlabUser,
        role: updated.role,
      }).eq('id', updated.id);
    }
  };

  const deleteUser = async (id: string) => {
    setUsers((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален пользователь ${id}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('users').delete().eq('id', id);
    }
  };

  const addSource = async (name: string) => {
    const newItem = { id: `src-${Date.now()}`, name };
    setSources((prev) => [...prev, newItem]);
    logAction('ADD_DICTIONARY', `Справочник: Добавлен источник ${name}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('sources').insert({
        id: newItem.id,
        name: newItem.name,
      });
    }
  };

  const updateSource = async (updated: DictionaryItem) => {
    setSources((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    logAction('UPDATE_DICTIONARY', `Справочник: Обновлен источник ${updated.name}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('sources').update({ name: updated.name }).eq('id', updated.id);
    }
  };

  const deleteSource = async (id: string) => {
    setSources((prev) => prev.filter(i => i.id !== id));
    logAction('DELETE_DICTIONARY', `Справочник: Удален источник ${id}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('sources').delete().eq('id', id);
    }
  };

  // Add / Edit Initiative
  const addInitiative = async (init: Omit<Initiative, 'id' | 'code'>) => {
    const code = `INIT-${100 + initiatives.length + 1}`;
    const newInit: Initiative = { ...init, id: `in-${Date.now()}`, code };
    setInitiatives((prev) => [...prev, newInit]);
    logAction('CREATE_INITIATIVE', `Создана инициатива ${code}: ${init.title}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('initiatives').insert({
        id: newInit.id,
        epic_id: newInit.epicId,
        code: newInit.code,
        title: newInit.title,
        description: newInit.description,
        status: newInit.status,
      });
    }
  };

  // Transition feature status
  const moveFeatureToEstimation = async (featureId: string) => {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id === featureId) {
          logAction('MOVE_TO_ESTIMATION', `Фича ${f.code} отправлена на оценку трудоемкости`);
          const updated = { ...f, status: 'На оценке' as const };
          const client = supabase;
          if (isSupabaseConfigured && client) {
            client.from('features').update({ status: 'На оценке' }).eq('id', featureId).then();
          }
          return updated;
        }
        return f;
      })
    );
  };

  const fillFeatureEffort = async (featureId: string, hours: number) => {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id === featureId) {
          logAction('FILL_ESTIMATION', `Фича ${f.code} оценена: ${hours}ч.`);
          const updated = { ...f, effortHours: hours, status: 'Оценено' as const, developmentCost: hours * 2000 };
          const client = supabase;
          if (isSupabaseConfigured && client) {
            client
              .from('features')
              .update({
                effort_hours: hours,
                status: 'Оценено',
                development_cost: hours * 2000,
              })
              .eq('id', featureId)
              .then();
          }
          return updated;
        }
        return f;
      })
    );
  };

  const batchFillFeatureEfforts = async (updates: { id: string; hours: number }[]) => {
    setFeatures((prev) =>
      prev.map((f) => {
        const update = updates.find((u) => u.id === f.id);
        if (update) {
          logAction('BATCH_ESTIMATION', `Фича ${f.code} оценена пакетом: ${update.hours}ч.`);
          const updated = { ...f, effortHours: update.hours, status: 'Оценено' as const, developmentCost: update.hours * 2000 };
          const client = supabase;
          if (isSupabaseConfigured && client) {
            client
              .from('features')
              .update({
                effort_hours: update.hours,
                status: 'Оценено',
                development_cost: update.hours * 2000,
              })
              .eq('id', f.id)
              .then();
          }
          return updated;
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
      developmentCost: feat.effortHours * 2000,
    };
    const autoScore = feat.repeatabilityCount * 10;
    const newFeat: Feature = {
      ...baseFeat,
      id: `fe-${Date.now()}`,
      code,
      autoScore,
    };
    setFeatures((prev) => [...prev, newFeat]);
    logAction('CREATE_FEATURE', `Создана фича ${code}: ${feat.title} (AutoScore: ${autoScore})`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        client.from('features').insert({
          id: newFeat.id,
          initiative_id: newFeat.initiativeId,
          code: newFeat.code,
          title: newFeat.title,
          description: newFeat.description,
          effort_hours: newFeat.effortHours,
          repeatability_count: newFeat.repeatabilityCount,
          auto_score: newFeat.autoScore,
          status: newFeat.status,
          subsystem: newFeat.subsystem,
          task_kind: newFeat.taskKind,
          adoption_rate: newFeat.adoptionRate,
          mau: newFeat.mau,
          retention_rate: newFeat.retentionRate,
          segment_adoption: newFeat.segmentAdoption,
          revenue_generated: newFeat.revenueGenerated,
          development_cost: newFeat.developmentCost,
        }).then(({ error }: any) => {
          if (error) console.error('Error adding Feature to Supabase:', error);
        }).catch((err: any) => {
          console.error('Exception adding Feature to Supabase:', err);
        });
      } catch (err) {
        console.error('Unexpected Exception adding Feature to Supabase:', err);
      }
    }

    return newFeat.id;
  };

  // Update Feature
  const updateFeature = async (updatedFeat: Feature) => {
    const autoScore = recalculateAutoScore(updatedFeat);
    const cost = updatedFeat.effortHours * 2000;
    const finalFeat = { ...updatedFeat, autoScore, developmentCost: cost };
    setFeatures((prev) => prev.map((f) => (f.id === updatedFeat.id ? finalFeat : f)));

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { error } = await client.from('features').update({
          title: finalFeat.title,
          description: finalFeat.description,
          effort_hours: finalFeat.effortHours,
          repeatability_count: finalFeat.repeatabilityCount,
          auto_score: finalFeat.autoScore,
          override_score: finalFeat.overrideScore,
          override_reason: finalFeat.overrideReason,
          release_id: finalFeat.releaseId,
          status: finalFeat.status,
          subsystem: finalFeat.subsystem,
          task_kind: finalFeat.taskKind,
          adoption_rate: finalFeat.adoptionRate,
          mau: finalFeat.mau,
          retention_rate: finalFeat.retentionRate,
          segment_adoption: finalFeat.segmentAdoption,
          revenue_generated: finalFeat.revenueGenerated,
          development_cost: finalFeat.developmentCost,
        }).eq('id', finalFeat.id);
        if (error) console.error('Error updating Feature in Supabase:', error);
      } catch (err) {
        console.error('Exception updating Feature in Supabase:', err);
      }
    }
  };

  // PM Score Override
  const overrideFeatureScore = async (featureId: string, overrideScore: number | undefined, reason: string) => {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id === featureId) {
          const prevScore = f.overrideScore !== undefined ? f.overrideScore : f.autoScore;
          const targetScore = overrideScore !== undefined ? overrideScore : f.autoScore;
          logAction(
            'PRIORITY_OVERRIDE',
            `PM изменил приоритет ${f.code}: с ${prevScore} на ${targetScore}. Причина: ${reason}`
          );

          const client = supabase;
          if (isSupabaseConfigured && client) {
            client.from('features').update({
              override_score: overrideScore,
              override_reason: overrideScore !== undefined ? reason : null,
            }).eq('id', featureId).then();

            client.from('pm_audits').insert({
              feature_id: featureId,
              feature_name: f.title,
              old_score: prevScore,
              new_score: targetScore,
              reason: reason,
              pm_email: 'pm_current@corp.ru',
            }).then();
          }

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
  const resetFeatureOverride = async (featureId: string) => {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id === featureId) {
          logAction('RESET_PRIORITY', `Сброс ручного приоритета для ${f.code} к системному значению ${f.autoScore}`);

          const client = supabase;
          if (isSupabaseConfigured && client) {
            client.from('features').update({
              override_score: null,
              override_reason: null,
            }).eq('id', featureId).then();
          }

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

  const getProjectName = (proj: Project): string => {
    if (proj.name && proj.name.trim() !== '') {
      return proj.name;
    }
    const c = clients.find((item) => item.id === proj.clientId);
    return c ? c.name : 'Unknown Client';
  };

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
  const addRequest = async (req: Omit<Request, 'id' | 'code' | 'createdAt'>) => {
    const code = `REQ-${100 + requests.length + 1}`;

    let legacyClient = '';
    let legacyProject = '';
    let legacySubsystem = '';
    let legacyKind = '';

    if (req.projectId) {
      const proj = projects.find((p) => p.id === req.projectId);
      if (proj) {
        legacyProject = getProjectName(proj);
        const cl = clients.find((c) => c.id === proj.clientId);
        if (cl) legacyClient = cl.name;
      }
    }
    if (req.moduleId) {
      const md = modules.find((m) => m.id === req.moduleId);
      if (md) legacySubsystem = md.name;
    }
    if (req.taskKindId) {
      const k = taskKinds.find((item) => item.id === req.taskKindId);
      if (k) legacyKind = k.name;
    }

    const payload = {
      ...req,
      client: legacyClient || undefined,
      project: legacyProject || undefined,
      subsystem: legacySubsystem || undefined,
      taskKind: legacyKind || undefined,
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

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { error } = await client.from('requests').insert({
          id: newReq.id,
          code: newReq.code,
          title: newReq.title,
          source: newReq.source,
          description: newReq.description,
          status: newReq.status,
          gitlab_issue_id: newReq.gitlabIssueId,
          client: newReq.client,
          project: newReq.project,
          subsystem: newReq.subsystem,
          task_kind: newReq.taskKind,
          task_type: newReq.taskType,
          author_id: newReq.authorId,
          executor_id: newReq.executorId,
          project_id: newReq.projectId,
          product_id: newReq.productId,
          module_id: newReq.moduleId,
          task_kind_id: newReq.taskKindId,
          task_type_id: newReq.taskTypeId,
          project_stage_id: newReq.projectStageId,
          estimate: newReq.estimate,
          spent: newReq.spent,
          epic_id: newReq.epicId,
          associated_feature_id: newReq.associatedFeatureId,
          created_at: newReq.createdAt,
        });
        if (error) console.error('Error adding Request to Supabase:', error);
      } catch (err) {
        console.error('Exception adding Request to Supabase:', err);
      }
    }

    if (validatedStatus === 'Принят' && req.associatedFeatureId) {
      incrementFeatureRepeatability(req.associatedFeatureId, code);
    }
  };

  // Update request inline details
  const updateRequestDetails = async (updatedReq: Request) => {
    let legacyClient = '';
    let legacyProject = '';
    let legacySubsystem = '';
    let legacyKind = '';

    if (updatedReq.projectId) {
      const proj = projects.find((p) => p.id === updatedReq.projectId);
      if (proj) {
        legacyProject = getProjectName(proj);
        const cl = clients.find((c) => c.id === proj.clientId);
        if (cl) legacyClient = cl.name;
      }
    }
    if (updatedReq.moduleId) {
      const md = modules.find((m) => m.id === updatedReq.moduleId);
      if (md) legacySubsystem = md.name;
    }
    if (updatedReq.taskKindId) {
      const k = taskKinds.find((item) => item.id === updatedReq.taskKindId);
      if (k) legacyKind = k.name;
    }

    const payload = {
      ...updatedReq,
      client: legacyClient || undefined,
      project: legacyProject || undefined,
      subsystem: legacySubsystem || undefined,
      taskKind: legacyKind || undefined,
    };

    setRequests((prev) => prev.map((r) => (r.id === updatedReq.id ? payload : r)));
    logAction('UPDATE_REQUEST_DETAILS', `Обновлены метаданные запроса ${updatedReq.code}`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { error } = await client.from('requests').update({
          title: payload.title,
          source: payload.source,
          description: payload.description,
          status: payload.status,
          gitlab_issue_id: payload.gitlabIssueId,
          client: payload.client,
          project: payload.project,
          subsystem: payload.subsystem,
          task_kind: payload.taskKind,
          task_type: payload.taskType,
          author_id: payload.authorId,
          executor_id: payload.executorId,
          project_id: payload.projectId,
          product_id: payload.productId,
          module_id: payload.moduleId,
          task_kind_id: payload.taskKindId,
          task_type_id: payload.taskTypeId,
          project_stage_id: payload.projectStageId,
          estimate: payload.estimate,
          spent: payload.spent,
          epic_id: payload.epicId,
          associated_feature_id: payload.associatedFeatureId,
        }).eq('id', payload.id);
        if (error) console.error('Error updating Request in Supabase:', error);
      } catch (err) {
        console.error('Exception updating Request in Supabase:', err);
      }
    }
  };

  const updateRequestEpic = async (requestId: string, epicId: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          logAction('REQUEST_EPIC_UPDATE_DND', `Запрос ${r.code} перенесен в Эпик ${epicId} через drag-and-drop`);
          const client = supabase;
          if (isSupabaseConfigured && client) {
            client.from('requests').update({ epic_id: epicId }).eq('id', requestId).then();
          }
          return { ...r, epicId };
        }
        return r;
      })
    );
  };

  const associateRequestWithFeature = async (requestId: string, featureId: string) => {
    let targetEpicId: string | undefined = undefined;

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

          const updated = {
            ...r,
            associatedFeatureId: featureId,
            status: 'Принят' as const,
            epicId: targetEpicId || r.epicId,
          };

          const client = supabase;
          if (isSupabaseConfigured && client) {
            client.from('requests').update({
              associated_feature_id: featureId,
              status: 'Принят',
              epic_id: updated.epicId,
            }).eq('id', requestId).then();
          }

          return updated;
        }
        return r;
      })
    );

    incrementFeatureRepeatability(featureId, requestId);
  };

  const convertRequestToFeature = async (requestId: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    const defaultInitiativeId = initiatives[0]?.id || 'in-1';

    const newFeatureId = addFeature({
      initiativeId: defaultInitiativeId,
      title: req.title,
      description: req.description || 'Создано автоматически из сигнала ' + req.code,
      effortHours: 40,
      repeatabilityCount: 1,
      releaseId: null,
      subsystem: req.subsystem,
      taskKind: req.taskKind || 'Фича (Feature)'
    });

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          logAction('REQUEST_CONVERTED_TO_FEATURE', `Запрос ${r.code} преобразован в дублирующую фичу ${newFeatureId}`);
          const client = supabase;
          if (isSupabaseConfigured && client) {
            client.from('requests').update({
              associated_feature_id: newFeatureId,
              status: 'Принят',
            }).eq('id', requestId).then();
          }
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

  const classifyRequest = (requestId: string, status: 'Отклонен' | 'В проработку' | 'Принят' | 'Неразобранные', associatedFeatureId?: string | null) => {
    let errorOccurred = false;
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          if ((status === 'Принят' || status === 'Отклонен' || status === 'В проработку') && !isRequestFullyConfigured(r)) {
            alert(`Ошибка! Невозможно изменить статус запроса ${r.code} на "${status}". Сначала заполните все обязательные параметры.`);
            errorOccurred = true;
            return r;
          }

          const oldStatus = r.status;
          logAction('CLASSIFY_REQUEST', `Запрос ${r.code} классифицирован: ${oldStatus || 'Неразобранные'} -> ${status}`);

          const client = supabase;
          if (isSupabaseConfigured && client) {
            client.from('requests').update({
              status: status,
              associated_feature_id: associatedFeatureId || null,
            }).eq('id', requestId).then();
          }

          if (status === 'Принят' && associatedFeatureId) {
            incrementFeatureRepeatability(associatedFeatureId, r.code);
          }
          return { ...r, status, associatedFeatureId: associatedFeatureId || undefined };
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

          const client = supabase;
          if (isSupabaseConfigured && client) {
            client.from('features').update({
              repeatability_count: updated.repeatabilityCount,
              auto_score: updated.autoScore,
            }).eq('id', featureId).then();
          }

          return updated;
        }
        return f;
      })
    );
  };

  const updateDraftCapacity = async (capacity: number) => {
    setReleases((prev) =>
      prev.map((r) => {
        if (r.id === 'rel-draft') {
          const client = supabase;
          if (isSupabaseConfigured && client) {
            client.from('releases').update({ capacity_hours: capacity }).eq('id', 'rel-draft').then();
          }
          return { ...r, capacityHours: capacity };
        }
        return r;
      })
    );
  };

  const toggleFeatureInRelease = async (featureId: string, releaseId: string | null) => {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id === featureId) {
          const actionText = releaseId ? `Добавление в релиз ${releaseId}` : 'Удаление из релиза';
          logAction('RELEASE_UPDATE_FEATURE', `Фича ${f.code}: ${actionText}`);
          const client = supabase;
          if (isSupabaseConfigured && client) {
            client.from('features').update({ release_id: releaseId }).eq('id', featureId).then();
          }
          return { ...f, releaseId };
        }
        return f;
      })
    );
  };

  const clearDraftFeatures = async () => {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.releaseId === 'rel-draft') {
          const client = supabase;
          if (isSupabaseConfigured && client) {
            client.from('features').update({ release_id: null }).eq('id', f.id).then();
          }
          return { ...f, releaseId: null };
        }
        return f;
      })
    );
    logAction('RELEASE_CLEAR_DRAFT', `Все фичи удалены из черновика релиза.`);
  };

  const autoAllocateDraftFeatures = async (capacityLimit: number) => {
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
        const willBeAllocated = allocatedIds.includes(f.id);
        const nextReleaseId = willBeAllocated ? 'rel-draft' : null;

        const client = supabase;
        if (isSupabaseConfigured && client) {
          client.from('features').update({ release_id: nextReleaseId }).eq('id', f.id).then();
        }

        return { ...f, releaseId: nextReleaseId };
      })
    );

    logAction(
      'AUTO_ALLOCATE_RELEASE',
      `Автоподбор фич под лимит Capacity в ${capacityLimit} ч. завершен. Выбрано фич: ${allocatedIds.length}, суммарная нагрузка: ${currentSumHours} ч.`
    );
  };

  const approveDraftRelease = async () => {
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
      `INFO: Утвержден релиз ${newApprovedCode}.`,
      `INFO: Направление экспорта: GitLab интеграция отключена. Система работает исключительно на импорт.`
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
          const updated = {
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

          const client = supabase;
          if (isSupabaseConfigured && client) {
            client.from('features').update({
              release_id: updated.releaseId,
              adoption_rate: updated.adoptionRate,
              mau: updated.mau,
              retention_rate: updated.retentionRate,
              segment_adoption: updated.segmentAdoption,
              revenue_generated: updated.revenueGenerated,
            }).eq('id', f.id).then();
          }

          return updated;
        }
        return f;
      })
    );

    logAction(
      'RELEASE_APPROVED',
      `PM утвердил релиз ${newApprovedCode}. Автоматически экспортировано задач в GitLab. Продуктовая телеметрия активирована.`
    );

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('releases').insert({
        id: newApprovedRelease.id,
        code: newApprovedRelease.code,
        title: newApprovedRelease.title,
        capacity_hours: newApprovedRelease.capacityHours,
        status: 'Approved',
        approved_at: newApprovedRelease.approvedAt,
        export_logs: newApprovedRelease.exportLogs,
      });

      await client.from('releases').update({
        code: `RELEASE-PLAN-${new Date().getFullYear() + 1}`,
        title: `План релиза: Следующая Итерация`,
        capacity_hours: 160,
        status: 'Draft'
      }).eq('id', 'rel-draft');
    }

    return newApprovedCode;
  };

  const updateGitLabSettings = async (newSettings: GitLabSettings) => {
    setGitLabSettings(newSettings);
    logAction('UPDATE_GITLAB_SETTINGS', `Обновлены настройки интеграции GitLab для группы проектов "${newSettings.projectGroup}"`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.from('gitlab_settings').upsert({
        id: 1,
        server_url: newSettings.serverUrl,
        personal_access_token: newSettings.personalAccessToken,
        project_group: newSettings.projectGroup,
      });
    }
  };

  const checkGitLabConfig = () => {
    const { serverUrl, personalAccessToken, projectGroup } = gitLabSettings;
    if (!serverUrl || !serverUrl.trim() || !personalAccessToken || !personalAccessToken.trim() || !projectGroup || !projectGroup.trim()) {
      throw new Error('Ошибка: Настройки интеграции с GitLab не заданы или заполнены не полностью.');
    }
    if (personalAccessToken === 'glpat-A1B2C3D4E5F6G7H8I9J0') {
      throw new Error('Ошибка: Используется демонстрационный Personal Access Token (PAT). Пожалуйста, укажите ваш реальный токен в настройках.');
    }
  };

  const testGitLabConnection = async () => {
    checkGitLabConfig();
    const { serverUrl, personalAccessToken, projectGroup } = gitLabSettings;

    const res = await fetch(`${serverUrl}/api/v4/groups/${encodeURIComponent(projectGroup)}`, {
      headers: { 'Private-Token': personalAccessToken }
    });

    if (!res.ok) {
      throw new Error(`Ошибка подключения к GitLab API (Статус: ${res.status} ${res.statusText}). Проверьте URL сервера, Токен и Название группы.`);
    }

    const groupData = await res.json();
    return {
      success: true,
      name: groupData.name || projectGroup,
      fullPath: groupData.full_path || projectGroup,
      webUrl: groupData.web_url || `${serverUrl}/${projectGroup}`
    };
  };

  // Requirement 12: Load all GitLab labels using pagination
  const importGitLabLabels = async () => {
    checkGitLabConfig();
    const { serverUrl, personalAccessToken, projectGroup } = gitLabSettings;

    let page = 1;
    let allLabels: any[] = [];
    while (true) {
      const res = await fetch(`${serverUrl}/api/v4/groups/${encodeURIComponent(projectGroup)}/labels?per_page=100&page=${page}`, {
        headers: { 'Private-Token': personalAccessToken }
      });

      if (!res.ok) {
        if (page === 1) throw new Error(`Не удалось загрузить ярлыки из GitLab (Статус: ${res.status} ${res.statusText})`);
        break;
      }

      const labelsData = await res.json();
      if (!Array.isArray(labelsData) || labelsData.length === 0) break;
      allLabels = [...allLabels, ...labelsData];
      const nextPage = res.headers.get('x-next-page');
      if (!nextPage || !nextPage.trim()) break;
      page++;
    }

    const newItems: GitLabLabel[] = allLabels.map((l: any) => ({
      id: String(l.id),
      name: l.name,
      color: l.color,
      description: l.description || ''
    }));

    setGitLabLabels(newItems);
    logAction('IMPORT_GITLAB_LABELS', `Импортировано ${newItems.length} ярлыков из группы проектов ${projectGroup}`);
    return newItems.map(i => i.name);
  };

  const importGitLabIssues = async () => {
    checkGitLabConfig();

    const { serverUrl, personalAccessToken, projectGroup } = gitLabSettings;

    const res = await fetch(`${serverUrl}/api/v4/groups/${encodeURIComponent(projectGroup)}/issues`, {
      headers: { 'Private-Token': personalAccessToken }
    });

    if (!res.ok) {
      throw new Error(`Не удалось загрузить задачи из GitLab API (Статус: ${res.status} ${res.statusText})`);
    }

    const issuesData = await res.json();
    if (!Array.isArray(issuesData)) {
      throw new Error('Получен некорректный ответ от GitLab API (ожидался массив задач).');
    }

    const importedRequests: Request[] = [];

    issuesData.forEach((issue: any, idx: number) => {
      const gitlabId = `#${issue.iid || issue.id}`;

      let matchedProj: Project | undefined = undefined;
      if (issue.web_url) {
        matchedProj = projects.find((p) => {
          if (!p.gitlabUrl) return false;
          const pUrl = p.gitlabUrl.toLowerCase().replace(/\/$/, '');
          const iUrl = issue.web_url.toLowerCase();
          return iUrl.startsWith(pUrl) || iUrl.includes(pUrl);
        });
      }

      const issueLabels: string[] = Array.isArray(issue.labels) ? issue.labels : [];

      const matchedKind = taskKinds.find((k) =>
        k.gitlabLabel && issueLabels.some((l) => l.toLowerCase() === k.gitlabLabel.toLowerCase())
      );

      const matchedStage = projectStages.find((s) =>
        s.gitlabLabel && issueLabels.some((l) => l.toLowerCase() === s.gitlabLabel.toLowerCase())
      );

      const issueAuthorUsername = issue.author?.username;
      const matchedAuthor = users.find((u) =>
        u.gitlabUser && issueAuthorUsername && u.gitlabUser.toLowerCase() === issueAuthorUsername.toLowerCase()
      );

      const issueAssigneeUsername = issue.assignee?.username || issue.assignees?.[0]?.username;
      const matchedExecutor = users.find((u) =>
        u.gitlabUser && issueAssigneeUsername && u.gitlabUser.toLowerCase() === issueAssigneeUsername.toLowerCase()
      );

      const code = `REQ-GL-${Date.now().toString().slice(-4)}-${idx + 1}`;

      const newReq: Request = {
        id: `req-gl-${Date.now()}-${idx + 1}`,
        code,
        title: issue.title || 'Без названия',
        source: 'GitLab',
        description: issue.description || '',
        status: 'Неразобранные',
        gitlabIssueId: gitlabId,
        associatedFeatureId: null,

        projectId: matchedProj?.id,
        productId: matchedProj?.productId,
        taskKindId: matchedKind?.id,
        projectStageId: matchedStage?.id,
        authorId: matchedAuthor?.id,
        executorId: matchedExecutor?.id,

        client: matchedProj ? clients.find(c => c.id === matchedProj.clientId)?.name : undefined,
        project: matchedProj ? getProjectName(matchedProj) : undefined,
        taskKind: matchedKind?.name,

        estimate: typeof issue.time_stats?.time_estimate === 'number' ? Math.round(issue.time_stats.time_estimate / 3600) : 0,
        spent: typeof issue.time_stats?.total_time_spent === 'number' ? Math.round(issue.time_stats.total_time_spent / 3600) : 0,

        createdAt: new Date().toISOString().substring(0, 10),
      };

      importedRequests.push(newReq);
    });

    if (importedRequests.length > 0) {
      setRequests((prev) => [...importedRequests, ...prev]);

      logAction(
        'IMPORT_GITLAB_ISSUES',
        `Импортировано ${importedRequests.length} задач из GitLab группы проектов "${projectGroup}".`
      );

      const client = supabase;
      if (isSupabaseConfigured && client) {
        importedRequests.forEach((newReq) => {
          client.from('requests').insert({
            id: newReq.id,
            code: newReq.code,
            title: newReq.title,
            source: newReq.source,
            description: newReq.description,
            status: newReq.status,
            gitlab_issue_id: newReq.gitlabIssueId,
            client: newReq.client,
            project: newReq.project,
            subsystem: newReq.subsystem,
            task_kind: newReq.taskKind,
            task_type: newReq.taskType,
            author_id: newReq.authorId,
            executor_id: newReq.executorId,
            project_id: newReq.projectId,
            product_id: newReq.productId,
            module_id: newReq.moduleId,
            task_kind_id: newReq.taskKindId,
            task_type_id: newReq.taskTypeId,
            project_stage_id: newReq.projectStageId,
            estimate: newReq.estimate,
            spent: newReq.spent,
            epic_id: newReq.epicId,
            associated_feature_id: newReq.associatedFeatureId,
            created_at: newReq.createdAt,
          }).then();
        });
      }
    }

    return {
      success: true,
      count: importedRequests.length,
      projectPath: projectGroup,
      projectName: importedRequests.length > 0 && importedRequests[0].projectId
        ? getProjectName(projects.find(p => p.id === importedRequests[0].projectId)!)
        : 'Не сопоставлен',
      issues: importedRequests.map(r => ({
        gitlabId: r.gitlabIssueId,
        title: r.title,
        kind: r.taskKindId ? taskKinds.find(k => k.id === r.taskKindId)?.name : undefined,
      }))
    };
  };

  // Requirement 8 & 9: Import Project Groups recursively from GitLab up to projectGroup
  const importProjectGroupsFromGitLab = async () => {
    checkGitLabConfig();
    const { serverUrl, personalAccessToken, projectGroup } = gitLabSettings;

    const res = await fetch(`${serverUrl}/api/v4/groups/${encodeURIComponent(projectGroup)}/subgroups?all_available=true&per_page=100`, {
      headers: { 'Private-Token': personalAccessToken }
    });

    let rawSubgroups: any[] = [];
    if (res.ok) {
      rawSubgroups = await res.json();
    }

    // Also fetch root group
    const rootRes = await fetch(`${serverUrl}/api/v4/groups/${encodeURIComponent(projectGroup)}`, {
      headers: { 'Private-Token': personalAccessToken }
    });
    let rootData: any = null;
    if (rootRes.ok) {
      rootData = await rootRes.json();
    }

    const fetchedGroups: ProjectGroup[] = [];
    if (rootData) {
      fetchedGroups.push({
        id: `grp-gl-${rootData.id}`,
        name: rootData.name || projectGroup,
        gitlabUrl: rootData.web_url || `${serverUrl}/${projectGroup}`
      });
    }

    if (Array.isArray(rawSubgroups)) {
      rawSubgroups.forEach((g: any) => {
        fetchedGroups.push({
          id: `grp-gl-${g.id}`,
          name: g.name || g.full_path,
          gitlabUrl: g.web_url
        });
      });
    }

    setProjectGroups((prev) => {
      const existingUrls = prev.map(i => i.gitlabUrl);
      const filtered = fetchedGroups.filter(i => !existingUrls.includes(i.gitlabUrl));

      const client = supabase;
      if (isSupabaseConfigured && client) {
        filtered.forEach(g => {
          client.from('project_groups').insert({
            id: g.id,
            name: g.name,
            gitlab_url: g.gitlabUrl,
          }).then();
        });
      }

      return [...prev, ...filtered];
    });

    logAction('IMPORT_GITLAB_GROUPS', `Импортировано ${fetchedGroups.length} групп проектов из GitLab.`);
    return fetchedGroups.map(g => g.name);
  };

  // Requirement 5, 8, 9: Import Projects from GitLab and return candidate list for modal completion
  const importProjectsFromGitLab = async () => {
    checkGitLabConfig();
    const { serverUrl, personalAccessToken, projectGroup } = gitLabSettings;

    // Recursively fetch parent project groups
    await importProjectGroupsFromGitLab();

    const res = await fetch(`${serverUrl}/api/v4/groups/${encodeURIComponent(projectGroup)}/projects?include_subgroups=true&per_page=100`, {
      headers: { 'Private-Token': personalAccessToken }
    });

    if (!res.ok) {
      throw new Error(`Не удалось загрузить проекты из GitLab (Статус: ${res.status} ${res.statusText})`);
    }

    const projectsData = await res.json();
    if (!Array.isArray(projectsData)) {
      throw new Error('Некорректный ответ от GitLab API при запросе проектов.');
    }

    // Filter out already existing projects by gitlabUrl
    const existingUrls = projects.map(p => p.gitlabUrl.toLowerCase().replace(/\/$/, ''));
    const unimported = projectsData.filter((p: any) => !existingUrls.includes(p.web_url.toLowerCase().replace(/\/$/, '')));

    return unimported.map((p: any) => ({
      name: p.name,
      gitlabUrl: p.web_url,
      suggestedGroupId: projectGroups[0]?.id || 'grp-1',
      suggestedClientId: clients[0]?.id || 'cl-1',
      suggestedProductId: products[0]?.id || 'prod-1'
    }));
  };

  const addImportedProjects = async (newProjectsList: Omit<Project, 'id'>[]) => {
    const createdItems: Project[] = [];
    for (const p of newProjectsList) {
      const newItem: Project = {
        id: `pr-gl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: p.name,
        projectGroupId: p.projectGroupId,
        clientId: p.clientId,
        productId: p.productId,
        gitlabUrl: p.gitlabUrl
      };
      createdItems.push(newItem);
    }

    setProjects((prev) => [...prev, ...createdItems]);
    logAction('ADD_IMPORTED_PROJECTS', `Добавлено ${createdItems.length} проектов из импорта GitLab с заполненными реквизитами.`);

    const client = supabase;
    if (isSupabaseConfigured && client) {
      for (const p of createdItems) {
        try {
          await client.from('projects').insert({
            id: p.id,
            name: p.name,
            project_group_id: p.projectGroupId,
            client_id: p.clientId,
            product_id: p.productId,
            gitlab_url: p.gitlabUrl,
          });
        } catch (err) {
          console.error('Error inserting imported project to Supabase:', err);
        }
      }
    }

    return createdItems.map(p => p.name);
  };

  const subsystems = modules;

  return {
    epics,
    initiatives,
    features,
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
    projectStages,
    users,
    sources,
    subsystems,
    addEpic,
    updateEpic,
    deleteEpic,
    addClient,
    updateClient,
    deleteClient,
    addActivityKind,
    updateActivityKind,
    deleteActivityKind,
    addProject: addProjectNew,
    updateProject,
    deleteProject: deleteProjectNew,
    addProduct,
    updateProduct,
    deleteProduct,
    addModule,
    updateModule,
    deleteModule,
    addProjectGroup,
    updateProjectGroup,
    deleteProjectGroup,
    addTaskKind: addTaskKindNew,
    updateTaskKind,
    deleteTaskKind: deleteTaskKindNew,
    addProjectStage,
    updateProjectStage,
    deleteProjectStage,
    addUser,
    updateUser,
    deleteUser,
    getProjectName,
    addSource,
    updateSource,
    deleteSource,
    addInitiative,
    addFeature,
    updateFeature,
    overrideFeatureScore,
    resetFeatureOverride,
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
    gitLabLabels,
    updateGitLabSettings,
    testGitLabConnection,
    importGitLabLabels,
    importGitLabIssues,
    importProjectGroupsFromGitLab,
    importProjectsFromGitLab,
    addImportedProjects
  };
}
