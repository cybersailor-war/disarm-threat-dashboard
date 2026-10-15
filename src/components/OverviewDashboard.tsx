import React from 'react';
import {
  Target,
  Zap,
  Activity,
  Layers,
  Crosshair,
  ArrowRight,
  Globe,
  Building2,
  Calendar,
  Database,
  CheckCircle2,
  Search,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { DisarmCampaign, DisarmTechnique } from '../types/disarm';
import { computeCampaignMetrics } from '../utils/disarmParser';
import { DISARM_TACTICS_MASTER } from '../data/disarmMaster';

interface OverviewDashboardProps {
  campaign: DisarmCampaign;
  onSelectTechnique: (technique: DisarmTechnique) => void;
  onFilterByTactic?: (tacticId: string | 'ALL') => void;
  onOpenAttributionModal?: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  campaign,
  onSelectTechnique,
  onFilterByTactic,
  onOpenAttributionModal,
}) => {
  const metrics = computeCampaignMetrics(campaign);

  // Bar chart data for all tactics
  const tacticChartData = campaign.tactics
    .filter((t) => t.techniques.length > 0)
    .map((t) => ({
      name: t.id,
      fullName: t.name,
      count: t.techniques.length,
      color: t.color,
    }));

  return (
    <div className="space-y-6">
      {/* Campaign Threat Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#111827] via-[#0f172a] to-[#111827] border border-white/[0.08] p-6 shadow-tactical">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                SEVERIDADE: {campaign.overallSeverity.toUpperCase()}
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20">
                {campaign.campaignStatus}
              </span>

              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Atualizado: {new Date(campaign.lastUpdated).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {campaign.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {campaign.description}
              </p>
            </div>

            {/* Target Entities / Geographies */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Crosshair className="w-4 h-4 text-red-400" />
                <span className="text-slate-300">Ator de Ameaça:</span>
                <span className="text-white font-medium">{campaign.threatActor}</span>
                {onOpenAttributionModal && (
                  <button
                    onClick={onOpenAttributionModal}
                    className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 transition-colors cursor-pointer"
                    title="Correlacionar TTPs observados com perfis de APTs conhecidos (Base CTI)"
                  >
                    <Search className="w-3 h-3" />
                    Correlacionar CTI (APT)
                  </button>
                )}
              </div>

              {campaign.targetRegions.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-sky-400" />
                  <span className="text-slate-300">Regiões-Alvo:</span>
                  <span className="text-slate-200">{campaign.targetRegions.join(', ')}</span>
                </div>
              )}

              {campaign.targetSectors.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300">Setores:</span>
                  <span className="text-slate-200">{campaign.targetSectors.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3 Factual Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Táticas Mapeadas */}
        <div className="tactical-panel p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Táticas Mapeadas</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">{metrics.activeTacticsCount}</span>
            <span className="text-xs text-slate-400 font-mono">de {metrics.totalTactics} da matriz oficial</span>
          </div>
          <div className="w-full bg-white/[0.06] rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-sky-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(metrics.activeTacticsCount / metrics.totalTactics) * 100}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block font-mono">
            {Math.round((metrics.activeTacticsCount / metrics.totalTactics) * 100)}% das táticas do DISARM
          </span>
        </div>

        {/* Card 2: Técnicas Mapeadas */}
        <div className="tactical-panel p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Técnicas Mapeadas</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">{metrics.totalTechniques}</span>
            <span className="text-xs text-slate-400 font-mono">TTPs ativas</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs font-mono text-slate-400">
            <span className="text-red-400 font-semibold">{metrics.severityCounts.critical} críticas</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">{metrics.severityCounts.high} altas</span>
          </div>
        </div>

        {/* Card 3: Artefatos e IOCs */}
        <div className="tactical-panel p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Artefatos e IOCs</span>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">{metrics.totalArtifactsCount}</span>
            <span className="text-xs text-slate-400 font-mono">indicadores catalogados</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-3 block font-mono">
            Domínios typosquatted, IPs, hashes e contas
          </span>
        </div>
      </div>

      {/* Official DISARM Tactics Sequence Tracker (TA01 -> TA13) */}
      <div className="tactical-panel p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              Táticas Oficiais DISARM Red Team (16 Táticas Oficiais)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Sequência oficial de táticas do DISARM Foundation. Clique em qualquer tática para inspecionar as técnicas no navegador.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-black/40 px-3 py-1 rounded-md border border-white/[0.04]">
            Estrutura Padrão DISARM Foundation
          </div>
        </div>

        {/* Horizontal Tactic Grid: 4x4 balanced layout (16 official tactics) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
          {DISARM_TACTICS_MASTER.map((tactic) => {
            const activeTacticInCampaign = campaign.tactics.find((t) => t.id === tactic.id);
            const count = activeTacticInCampaign?.techniques.length || 0;
            const isMobilized = count > 0;

            return (
              <button
                key={tactic.id}
                onClick={() => onFilterByTactic && onFilterByTactic(tactic.id)}
                className={`flex flex-col justify-between p-3 rounded-xl border text-left transition-all duration-150 group ${
                  isMobilized
                    ? 'bg-[#111827] border-white/[0.12] hover:border-sky-500/60 hover:bg-[#131c2e] cursor-pointer'
                    : 'bg-[#111827]/30 border-white/[0.03] opacity-40 cursor-default'
                }`}
                style={{ borderTop: `2px solid ${isMobilized ? tactic.color : 'rgba(255,255,255,0.05)'}` }}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="font-bold" style={{ color: isMobilized ? tactic.color : '#64748B' }}>
                      {tactic.id}
                    </span>
                    {isMobilized && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white font-mono tracking-tight line-clamp-1" title={tactic.name}>
                    {tactic.name}
                  </h4>
                </div>

                <div className="mt-3 pt-1.5 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono">
                  <span className={isMobilized ? 'text-white font-bold' : 'text-slate-600'}>
                    {count} {count === 1 ? 'técnica' : 'técnicas'}
                  </span>
                  {isMobilized && (
                    <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Distribution Chart */}
      <div className="tactical-panel p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-sky-400" />
              Concentração de Técnicas por Tática DISARM
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Número de técnicas adversárias ativas mapeadas em cada tática
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-black/40 px-3 py-1 rounded-md border border-white/[0.04]">
            Distribuição Quantitativa de TTPs
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tacticChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis
                dataKey="name"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#111827] border border-white/[0.1] rounded-lg p-2.5 shadow-xl text-xs font-mono">
                        <span className="text-sky-400 font-bold block">{data.name} - {data.fullName}</span>
                        <span className="text-slate-300">{data.count} técnica(s) identificada(s)</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {tacticChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#38BDF8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
