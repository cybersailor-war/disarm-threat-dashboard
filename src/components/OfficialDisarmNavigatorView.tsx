import React, { useState, useMemo } from 'react';
import {
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Plus,
  CheckCircle2,
  Info,
  Maximize2,
  Minimize2,
  Layers,
  BookOpen,
  Filter,
  Eye,
  ShieldAlert
} from 'lucide-react';
import {
  OFFICIAL_DISARM_TACTICS,
  OFFICIAL_DISARM_TECHNIQUES,
  OfficialDisarmTactic,
  OfficialDisarmTechnique
} from '../data/officialDisarmData';
import { DisarmCampaign, DisarmTechnique } from '../types/disarm';

interface OfficialDisarmNavigatorViewProps {
  campaign: DisarmCampaign;
  onAddTechniqueToCampaign: (technique: OfficialDisarmTechnique) => void;
  onSelectActiveTechnique?: (technique: DisarmTechnique) => void;
}

export const OfficialDisarmNavigatorView: React.FC<OfficialDisarmNavigatorViewProps> = ({
  campaign,
  onAddTechniqueToCampaign,
  onSelectActiveTechnique
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'active-only' | 'parents-only'>('all');
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});
  const [selectedTech, setSelectedTech] = useState<OfficialDisarmTechnique | null>(null);

  // Set of technique IDs already in current campaign
  const activeCampaignTechIds = useMemo(() => {
    return new Set(campaign.techniques.map((t) => t.id));
  }, [campaign.techniques]);

  // Group all techniques by tactic and parent
  const tacticsStructure = useMemo(() => {
    return OFFICIAL_DISARM_TACTICS.map((tactic) => {
      // Find all techniques for this tactic
      const techsForTactic = OFFICIAL_DISARM_TECHNIQUES.filter(
        (t) => t.tacticId === tactic.id || t.tacticShortname === tactic.shortname
      );

      // Separate top-level and subtechniques
      const topLevel = techsForTactic.filter((t) => !t.isSubtechnique);
      const subtechniques = techsForTactic.filter((t) => t.isSubtechnique);

      // Map subtechniques to parents
      const parentWithSubs = topLevel.map((parent) => {
        const subs = subtechniques.filter((s) => s.parentTechniqueId === parent.id);
        const activeSubsCount = subs.filter((s) => activeCampaignTechIds.has(s.id)).length;
        const isParentActive = activeCampaignTechIds.has(parent.id);

        return {
          parent,
          subs,
          activeSubsCount,
          isParentActive,
        };
      });

      return {
        tactic,
        totalTechsCount: techsForTactic.length,
        topLevelCount: topLevel.length,
        parentWithSubs,
      };
    });
  }, [activeCampaignTechIds]);

  // Expand all / collapse all
  const toggleAllSubtechniques = (expand: boolean) => {
    const newState: Record<string, boolean> = {};
    OFFICIAL_DISARM_TECHNIQUES.forEach((t) => {
      if (!t.isSubtechnique) {
        newState[t.id] = expand;
      }
    });
    setExpandedParents(newState);
  };

  const toggleParent = (parentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedParents((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  // Filter logic
  const matchesSearch = (tech: OfficialDisarmTechnique) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      tech.id.toLowerCase().includes(q) ||
      tech.name.toLowerCase().includes(q) ||
      tech.description.toLowerCase().includes(q)
    );
  };

  return (
    <div className="space-y-4">
      {/* Navigator Top Control Banner */}
      <div className="tactical-panel p-4 sm:p-5 space-y-4">
        {/* Row 1: Header Title & Summary Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500/20 via-sky-600/10 to-transparent border border-sky-500/30 text-sky-400 flex-shrink-0 shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-base font-bold text-white tracking-wide font-mono">
                  DISARM Foundation Matrix Navigator (Oficial)
                </h2>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold shadow-sm">
                  16 Táticas • 391 Técnicas (103 Principais + 288 Subs)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Visualização 1:1 integrada idêntica ao DISARM Navigator oficial. Navegue pelo catálogo completo ou filtre técnicas do caso ativo.
              </p>
            </div>
          </div>

          {/* External Link */}
          <a
            href="https://disarmfoundation.github.io/disarm-navigator/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition-all self-start sm:self-center flex-shrink-0 cursor-pointer"
            title="Abrir a ferramenta oficial externa do DISARM Navigator"
          >
            <span>Navigator Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Row 2: Search Input & Action Controls Toolbar */}
        <div className="pt-3 border-t border-white/[0.06] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input - Generous and prominent */}
          <div className="relative flex-1 max-w-lg min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar ID ou técnica DISARM (ex: T0098, clon, bot, persona)..."
              className="w-full pl-10 pr-9 py-2 text-xs rounded-xl bg-[#070b13] border border-white/[0.1] hover:border-sky-500/40 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white p-0.5 cursor-pointer"
                title="Limpar busca"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter options & Subtechnique toggles */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter pills: Todas vs No Caso Ativo */}
            <div className="flex items-center bg-[#070b13] border border-white/[0.1] rounded-xl p-1 text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Todas (391)
              </button>
              <button
                onClick={() => setFilterMode('active-only')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  filterMode === 'active-only'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>No Caso Ativo</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  filterMode === 'active-only'
                    ? 'bg-black/20 text-slate-950'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {activeCampaignTechIds.size}
                </span>
              </button>
            </div>

            {/* Expand / Collapse Subtechniques */}
            <div className="flex items-center gap-1.5 bg-[#070b13] border border-white/[0.1] rounded-xl p-1">
              <button
                onClick={() => toggleAllSubtechniques(true)}
                className="px-2.5 py-1 rounded-lg hover:bg-white/[0.08] text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Expandir todas as subtécnicas"
              >
                <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-[11px]">Expandir Subs</span>
              </button>
              <button
                onClick={() => toggleAllSubtechniques(false)}
                className="px-2.5 py-1 rounded-lg hover:bg-white/[0.08] text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Recolher todas as subtécnicas"
              >
                <Minimize2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px]">Recolher</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 16-Column Official DISARM Matrix Horizontal Board */}
      <div className="tactical-panel p-3 overflow-x-auto pb-4">
        <div className="min-w-[3200px] flex gap-3">
          {tacticsStructure.map(({ tactic, totalTechsCount, topLevelCount, parentWithSubs }) => (
            <div
              key={tactic.id}
              className="w-[200px] flex-shrink-0 flex flex-col rounded-xl bg-[#0a0f18]/90 border border-white/[0.08] overflow-hidden"
            >
              {/* Column Header */}
              <div
                className="p-3 border-b border-white/[0.08] relative"
                style={{
                  background: `linear-gradient(180deg, ${tactic.color}15 0%, rgba(10,15,24,0) 100%)`,
                  borderTop: `3px solid ${tactic.color}`,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${tactic.color}25`, color: tactic.color }}
                  >
                    {tactic.id}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {topLevelCount} técnicas
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white leading-tight min-h-[32px] flex items-center">
                  {tactic.name}
                </h3>
              </div>

              {/* Technique Cards in Column */}
              <div className="p-2 space-y-1.5 flex-1 overflow-y-auto max-h-[750px] scrollbar-thin">
                {parentWithSubs.map(({ parent, subs, activeSubsCount, isParentActive }) => {
                  const isExpanded = expandedParents[parent.id] || Boolean(searchQuery);
                  const parentMatches = matchesSearch(parent);
                  const matchingSubs = subs.filter(matchesSearch);

                  if (
                    filterMode === 'active-only' &&
                    !isParentActive &&
                    activeSubsCount === 0
                  ) {
                    return null;
                  }

                  if (searchQuery && !parentMatches && matchingSubs.length === 0) {
                    return null;
                  }

                  return (
                    <div key={parent.id} className="space-y-1">
                      {/* Parent Technique Card */}
                      <div
                        onClick={() => setSelectedTech(parent)}
                        className={`group relative p-2 rounded-lg border text-left transition-all cursor-pointer ${
                          isParentActive
                            ? 'bg-sky-950/40 border-sky-400/60 shadow-[0_0_12px_rgba(56,189,248,0.25)] ring-1 ring-sky-400/40'
                            : 'bg-[#0f172a]/70 hover:bg-[#1e293b]/90 border-white/[0.06] hover:border-white/[0.18]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="text-[10px] font-mono font-bold text-sky-400">
                            {parent.id}
                          </span>

                          <div className="flex items-center gap-1">
                            {isParentActive && (
                              <span
                                title="Ativa na Investigação"
                                className="flex items-center text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 rounded border border-emerald-500/20"
                              >
                                Ativa
                              </span>
                            )}

                            {subs.length > 0 && (
                              <button
                                onClick={(e) => toggleParent(parent.id, e)}
                                className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-white/[0.08]"
                                title={isExpanded ? 'Recolher subtécnicas' : 'Expandir subtécnicas'}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-3 h-3 text-sky-400" />
                                ) : (
                                  <ChevronRight className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-[11px] font-medium text-slate-200 group-hover:text-white leading-snug line-clamp-2">
                          {parent.name}
                        </p>

                        {/* Subtechnique Counter Pill */}
                        {subs.length > 0 && (
                          <div className="mt-1.5 flex items-center justify-between text-[9px] font-mono text-slate-400">
                            <span className="text-slate-500">
                              ({activeSubsCount}/{subs.length} subs)
                            </span>
                            <span
                              onClick={(e) => toggleParent(parent.id, e)}
                              className="text-sky-400 hover:underline cursor-pointer"
                            >
                              {isExpanded ? 'ocultar' : 'ver todas'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Subtechniques Child List */}
                      {isExpanded && subs.length > 0 && (
                        <div className="pl-2 space-y-1 border-l-2 border-white/[0.1] ml-2">
                          {subs.map((sub) => {
                            const isSubActive = activeCampaignTechIds.has(sub.id);
                            const subMatches = matchesSearch(sub);

                            if (searchQuery && !subMatches) return null;
                            if (filterMode === 'active-only' && !isSubActive) return null;

                            return (
                              <div
                                key={sub.id}
                                onClick={() => setSelectedTech(sub)}
                                className={`p-1.5 rounded-md border text-left transition-all cursor-pointer ${
                                  isSubActive
                                    ? 'bg-sky-950/30 border-sky-500/50 text-sky-200'
                                    : 'bg-[#0d131f]/60 hover:bg-[#162033] border-white/[0.04] text-slate-300 hover:text-white'
                                }`}
                              >
                                <div className="flex items-center justify-between text-[9px] font-mono">
                                  <span className="text-sky-300 font-semibold">{sub.id}</span>
                                  {isSubActive && (
                                    <span className="text-[8px] font-mono text-emerald-400">● Ativa</span>
                                  )}
                                </div>
                                <p className="text-[10px] leading-tight mt-0.5 line-clamp-2">
                                  {sub.name}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal / Inspector Drawer for Selected Technique */}
      {selectedTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f172a] border border-white/[0.12] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/[0.08] flex items-start justify-between bg-gradient-to-r from-sky-950/30 via-slate-900/50 to-slate-900/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    {selectedTech.id}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {selectedTech.tacticId} • {selectedTech.tacticName}
                  </span>
                  {selectedTech.isSubtechnique && (
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      Subtécnica de {selectedTech.parentTechniqueId}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white">{selectedTech.name}</h3>
              </div>

              <button
                onClick={() => setSelectedTech(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Status Alert if in campaign */}
              {activeCampaignTechIds.has(selectedTech.id) ? (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-400 text-xs">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Esta técnica <strong>já está registrada</strong> no caso investigado ativo.
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-between gap-2 text-sky-300 text-xs">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 flex-shrink-0 text-sky-400" />
                    <span>Esta técnica faz parte da matriz oficial DISARM Red Team.</span>
                  </div>
                  <button
                    onClick={() => {
                      onAddTechniqueToCampaign(selectedTech);
                      setSelectedTech(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all cursor-pointer flex-shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar ao Caso Ativo</span>
                  </button>
                </div>
              )}

              {/* Official Description */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  Descrição Oficial DISARM
                </h4>
                <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.06] text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedTech.description || 'Descrição não especificada na documentação oficial.'}
                </div>
              </div>

              {/* Official DISARM Foundation Reference Link */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Documentação Externa Oficial
                </h4>
                <a
                  href={selectedTech.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-[#090d16] hover:bg-[#0f172a] border border-white/[0.06] hover:border-sky-500/40 text-xs text-slate-300 group transition-all"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-sky-400" />
                    <span className="font-mono text-sky-400 group-hover:underline">
                      DISARMframeworks / generated_pages / {selectedTech.id}.md
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">Abrir no GitHub →</span>
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/[0.08] bg-[#090d16] flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">
                DISARM Framework v1.4 / Red Team Taxonomia
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTech(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition-all"
                >
                  Fechar
                </button>
                {!activeCampaignTechIds.has(selectedTech.id) && (
                  <button
                    onClick={() => {
                      onAddTechniqueToCampaign(selectedTech);
                      setSelectedTech(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all shadow-glow-cyan"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar à Investigação</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
