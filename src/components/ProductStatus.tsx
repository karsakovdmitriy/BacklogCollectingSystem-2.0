'use client';

import React, { useState } from 'react';
import { Product, Project, Feature, Request, Client, ProjectGroup } from '@/store/index';
import {
  Package,
  Briefcase,
  Layers,
  Clock,
  Coins,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Users,
  Grid,
  List
} from 'lucide-react';

interface ProductStatusProps {
  store: any;
}

export default function ProductStatus({ store }: ProductStatusProps) {
  // Grouping mode: 'flat' | 'byClient' | 'byProjectGroup'
  const [groupingMode, setGroupingMode] = useState<'flat' | 'byClient' | 'byProjectGroup'>('flat');
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});

  const toggleExpand = (prodId: string) => {
    setExpandedProducts(prev => ({ ...prev, [prodId]: !prev[prodId] }));
  };

  // Compute metrics per product based on projects with requests that occurred
  const getProductMetrics = (prod: Product) => {
    // 1. All requests associated with this product (directly or via project/module)
    const productRequests = store.requests.filter((r: Request) => {
      if (r.productId === prod.id) return true;
      if (r.projectId) {
        const proj = store.projects.find((p: Project) => p.id === r.projectId);
        if (proj && proj.productId === prod.id) return true;
      }
      return false;
    });

    // 2. Projects belonging to this product where at least one request occurred
    const activeProjectIds = Array.from(new Set(productRequests.map((r: Request) => r.projectId).filter(Boolean)));
    const activeProjects = store.projects.filter((p: Project) =>
      p.productId === prod.id && activeProjectIds.includes(p.id)
    );

    // 3. Features associated with those requests/projects/product
    const associatedFeatureIds = Array.from(
      new Set(productRequests.map((r: Request) => r.associatedFeatureId).filter(Boolean))
    );

    const associatedFeatures = store.features.filter((f: Feature) => {
      if (associatedFeatureIds.includes(f.id)) return true;
      // Match by module / subsystem
      if (f.subsystem) {
        const prodModules = store.modules.filter((m: any) => m.productId === prod.id);
        if (prodModules.some((m: any) => m.name === f.subsystem)) return true;
      }
      return false;
    });

    // Fallback if no specific feature binding exists yet but product requests occurred
    const targetFeatures = associatedFeatures.length > 0 ? associatedFeatures : (productRequests.length > 0 ? store.features : []);

    const featureCount = targetFeatures.length;
    const totalHours = targetFeatures.reduce((sum: number, f: Feature) => sum + (f.effortHours || 0), 0);
    const totalDevCost = totalHours * (store.internalRate || 2000);

    const backlogCount = targetFeatures.filter((f: Feature) => f.status === 'Backlog' || !f.status).length;
    const inEstCount = targetFeatures.filter((f: Feature) => f.status === 'На оценке').length;
    const estimatedCount = targetFeatures.filter((f: Feature) => f.status === 'Оценено').length;
    const releaseCount = targetFeatures.filter((f: Feature) => Boolean(f.releaseId)).length;

    return {
      projects: activeProjects,
      requestsCount: productRequests.length,
      featureCount,
      totalHours,
      totalDevCost,
      backlogCount,
      inEstCount,
      estimatedCount,
      releaseCount
    };
  };

  // Flat product rendering list
  const renderProductCard = (prod: Product) => {
    const metrics = getProductMetrics(prod);
    const isExpanded = expandedProducts[prod.id];

    return (
      <div key={prod.id} className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-lg space-y-4 p-5">
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#30363d] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#21262d] rounded-lg border border-[#30363d] text-[#58a6ff]">
              <Package size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{prod.name}</h3>
              <span className="text-xs text-[#8b949e]">
                Связано проектов: <strong className="text-white font-mono">{metrics.projects.length}</strong> | Сигналов: <strong className="text-white font-mono">{metrics.requestsCount}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={() => toggleExpand(prod.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] text-xs font-medium transition-all"
          >
            <span>{isExpanded ? 'Свернуть детали' : 'Подробнее'}</span>
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
            <span className="text-[#8b949e] block text-[10px]">ВСЕГО ФИЧ</span>
            <strong className="text-base text-white">{metrics.featureCount} шт.</strong>
          </div>
          <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
            <span className="text-[#8b949e] block text-[10px]">ЭКСПЕРТНЫЕ ЧАСЫ</span>
            <strong className="text-base text-orange-400">{metrics.totalHours} ч.</strong>
          </div>
          <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
            <span className="text-[#8b949e] block text-[10px]">ОЦЕНКА CAPEX</span>
            <strong className="text-base text-purple-400">₽{metrics.totalDevCost.toLocaleString()}</strong>
          </div>
          <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
            <span className="text-[#8b949e] block text-[10px]">В РЕЛИЗЕ</span>
            <strong className="text-base text-green-400">{metrics.releaseCount} шт.</strong>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] space-y-2 text-xs">
          <span className="text-[#8b949e] font-semibold block text-[10px] uppercase font-mono">Статусы фич в продукте:</span>
          <div className="flex flex-wrap gap-2 text-[11px] font-mono">
            <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-700">
              Backlog: {metrics.backlogCount}
            </span>
            <span className="bg-yellow-950/40 text-yellow-400 px-2 py-0.5 rounded border border-yellow-800">
              На оценке: {metrics.inEstCount}
            </span>
            <span className="bg-teal-950/40 text-teal-400 px-2 py-0.5 rounded border border-teal-800">
              Оценено: {metrics.estimatedCount}
            </span>
            <span className="bg-green-950/40 text-green-400 px-2 py-0.5 rounded border border-green-800">
              В релизе: {metrics.releaseCount}
            </span>
          </div>
        </div>

        {/* Expandable Details: Associated Projects */}
        {isExpanded && (
          <div className="pt-3 border-t border-[#30363d] space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Briefcase size={14} className="text-[#58a6ff]" />
              Связанные проекты развития ({metrics.projects.length}):
            </h4>

            {metrics.projects.length === 0 ? (
              <p className="text-xs text-[#8b949e] italic">Нет прямых проектов, связанных с данным продуктом.</p>
            ) : (
              <div className="space-y-2">
                {metrics.projects.map((p: Project) => {
                  const pName = store.getProjectName(p);
                  const grp = store.projectGroups.find((g: ProjectGroup) => g.id === p.projectGroupId);
                  const cl = store.clients.find((c: Client) => c.id === p.clientId);

                  return (
                    <div key={p.id} className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs font-mono space-y-1">
                      <div className="flex justify-between items-center">
                        <strong className="text-white">{pName}</strong>
                        <span className="text-[10px] text-[#58a6ff]">{p.gitlabUrl}</span>
                      </div>
                      <div className="text-[10px] text-[#8b949e]">
                        Группа: {grp?.name || '—'} | Клиент: {cl?.name || '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Package size={18} className="text-[#58a6ff]" />
            Статус продуктов
          </h2>
          <p className="text-xs text-[#8b949e]">
            Агрегированная аналитика состояния продуктов, объемов трудоемкости, количества проектов развития и фич.
          </p>
        </div>

        {/* GROUPING TOGGLE */}
        <div className="flex items-center gap-1.5 bg-[#0d1117] p-1 rounded-lg border border-[#30363d] text-xs font-medium">
          <button
            onClick={() => setGroupingMode('flat')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all ${
              groupingMode === 'flat' ? 'bg-[#21262d] text-white border border-[#30363d]' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Grid size={13} /> Плоский список
          </button>

          <button
            onClick={() => setGroupingMode('byClient')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all ${
              groupingMode === 'byClient' ? 'bg-[#21262d] text-white border border-[#30363d]' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Users size={13} /> По клиентам
          </button>

          <button
            onClick={() => setGroupingMode('byProjectGroup')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all ${
              groupingMode === 'byProjectGroup' ? 'bg-[#21262d] text-white border border-[#30363d]' : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <FolderOpen size={13} /> По группам проектов
          </button>
        </div>
      </div>

      {/* RENDER PRODUCTS LIST BASED ON GROUPING MODE */}
      {groupingMode === 'flat' && (
        <div className="space-y-4">
          {store.products.map((prod: Product) => renderProductCard(prod))}
        </div>
      )}

      {groupingMode === 'byClient' && (
        <div className="space-y-6">
          {store.clients.map((client: Client) => {
            // Find projects for client
            const clientProjectIds = store.projects.filter((p: Project) => p.clientId === client.id).map((p: Project) => p.productId);
            const clientProducts = store.products.filter((prod: Product) => clientProjectIds.includes(prod.id));

            return (
              <div key={client.id} className="bg-[#161b22]/50 border border-[#30363d] rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-[#30363d] pb-3">
                  <Users size={16} className="text-[#58a6ff]" />
                  <h3 className="font-bold text-sm text-white">Клиент: {client.name}</h3>
                  <span className="text-xs text-[#8b949e] font-mono">({clientProducts.length} продуктов)</span>
                </div>

                <div className="space-y-4">
                  {clientProducts.length === 0 ? (
                    <p className="text-xs text-[#8b949e] italic">Нет продуктов, привязанных к проектам данного клиента.</p>
                  ) : (
                    clientProducts.map((prod: Product) => renderProductCard(prod))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {groupingMode === 'byProjectGroup' && (
        <div className="space-y-6">
          {store.projectGroups.map((grp: ProjectGroup) => {
            const grpProjectIds = store.projects.filter((p: Project) => p.projectGroupId === grp.id).map((p: Project) => p.productId);
            const grpProducts = store.products.filter((prod: Product) => grpProjectIds.includes(prod.id));

            return (
              <div key={grp.id} className="bg-[#161b22]/50 border border-[#30363d] rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-[#30363d] pb-3">
                  <FolderOpen size={16} className="text-[#58a6ff]" />
                  <h3 className="font-bold text-sm text-white">Группа проектов: {grp.name}</h3>
                  <span className="text-xs text-[#8b949e] font-mono">({grpProducts.length} продуктов)</span>
                </div>

                <div className="space-y-4">
                  {grpProducts.length === 0 ? (
                    <p className="text-xs text-[#8b949e] italic">Нет продуктов, привязанных к проектам данной группы.</p>
                  ) : (
                    grpProducts.map((prod: Product) => renderProductCard(prod))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
