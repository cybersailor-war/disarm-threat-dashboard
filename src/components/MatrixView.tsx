import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  FileSearch,
  ChevronRight,
} from 'lucide-react';
import { DisarmCampaign, DisarmTechnique, ThreatSeverity } from '../types/disarm';
import { DISARM_TACTICS_MASTER } from '../data/disarmMaster';

interface MatrixViewProps {
  campaign: DisarmCampaign;
  onSelectTechnique: (technique: DisarmTechnique) => void;
  selectedTacticFilter?: string | 'ALL';
  onTacticFilterChange?: (tacticId: string | 'ALL') => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  campaign,
  onSelectTechnique,
  selectedTacticFilter = 'ALL',
  onTacticFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyWithEvidence, setOnlyWithEvidence] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filteredTechniques = useMemo(() => {
    return campaign.techniques.filter((tech) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = tech.id.toLowerCase().includes(query);
        const matchesName = tech.name.toLowerCase().includes(query);
        const matchesTactic = tech.tacticName.toLowerCase().includes(query);
        const matchesNote = tech.procedureEvidence?.operationalNote?.toLowerCase().includes(query) || false;
        const matchesArtifacts =
          tech.procedureEvidence?.observedArtifacts.some((a) => a.toLowerCase().includes(query)) || false;

        if (!matchesId && !matchesName && !matchesTactic && !matchesNote && !matchesArtifacts) {
          return false;
        }
      }

      if (selectedTacticFilter !== 'ALL' && tech.tacticId !== selectedTacticFilter) {
        return false;
      }

      if (onlyWithEvidence && (!tech.procedureEvidence || !tech.procedureEvidence.operationalNote)) {
        return false;
      }

      if (severityFilter !== 'ALL' && tech.severity !== severityFilter) {
        return false;
      }

      return true;
    });
  }, [campaign.techniques, searchQuery, selectedTacticFilter, onlyWithEvidence, severityFilter]);

  const tacticsWithFilteredTechniques = useMemo(() => {
    const list = selectedTacticFilter === 'ALL'
      ? DISARM_TACTICS_MASTER
      : DISARM_TACTICS_MASTER.filter((t) => t.id === selectedTacticFilter);

    return list.map((masterTactic) => {
      const techniques = filteredTechniques.filter(
        (t) => t.tacticId === masterTactic.id || t.tacticName.toLowerCase() === masterTactic.name.toLowerCase()
      );
      return {
        ...masterTactic,
        techniques,
      };
    });
  }, [filteredTechniques, selectedTacticFilter]);

  const getSeverityBadge = (severity: ThreatSeverity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'high':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'medium':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="tactical-panel p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar TTP por ID (ex: T0089), Nome, Evidência ou Artefato..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#090A0F] border border-white/[0.08] focus:border-sky-500/50 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-mono"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tactic Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#090A0F] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Tática:</span>
            <select
              value={selectedTacticFilter}
              onChange={(e) =>
                onTacticFilterChange && onTacticFilterChange(e.target.value)
              }
              className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer max-w-[180px] truncate"
            >
              <option value="ALL" className="bg-[#111827] text-white">Todas as Táticas (TA01 - TA13)</option>
              {DISARM_TACTICS_MASTER.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#111827] text-white">
                  {t.id} - {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#090A0F] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Severidade:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#111827] text-white">Todas</option>
              <option value="critical" className="bg-[#111827] text-red-400">Crítico</option>
              <option value="high" className="bg-[#111827] text-amber-400">Alto</option>
              <option value="medium" className="bg-[#111827] text-sky-400">Médio</option>
            </select>
          </div>

          {/* Evidence Toggle */}
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#090A0F] border border-white/[0.08] hover:border-white/[0.15] cursor-pointer text-xs text-slate-300 font-mono select-none">
            <input
              type="checkbox"
              checked={onlyWithEvidence}
              onChange={(e) => setOnlyWithEvidence(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0 focus:ring-offset-0"
            />
            <span>Apenas com Evidências</span>
          </label>
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
        <div>
          Mostrando <span className="text-sky-400 font-bold">{filteredTechniques.length}</span> de{' '}
          <span className="text-white font-bold">{campaign.techniques.length}</span> técnicas mapeadas
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Crítico
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Alto
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span> Médio
          </span>
        </div>
      </div>

      {/* DISARM Matrix Horizontally Scrollable Grid */}
      <div className="overflow-x-auto pb-4 pt-1">
        <div className="flex gap-3 min-w-max">
          {tacticsWithFilteredTechniques.map((tactic) => {
            const hasActiveTechniques = tactic.techniques.length > 0;

            return (
              <div
                key={tactic.id}
                className={`w-64 flex flex-col rounded-xl border transition-all ${
                  hasActiveTechniques
                    ? 'bg-[#111827]/90 border-white/[0.08]'
                    : 'bg-[#111827]/30 border-white/[0.03] opacity-50'
                }`}
              >
                {/* Tactic Column Header */}
                <div
                  className="p-3 border-b border-white/[0.08] rounded-t-xl"
                  style={{ borderTop: `3px solid ${tactic.color}` }}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span className="font-bold" style={{ color: tactic.color }}>
                      {tactic.id}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-slate-400">
                      Tática {tactic.tacticNumber}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white tracking-tight line-clamp-1" title={tactic.name}>
                    {tactic.name}
                  </h3>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/[0.04] text-[10px] font-mono text-slate-400">
                    <span>{tactic.techniques.length} ativa(s)</span>
                    {hasActiveTechniques && (
                      <span className="text-emerald-400 font-semibold">Mapeado</span>
                    )}
                  </div>
                </div>

                {/* Technique Cards */}
                <div className="p-2 space-y-2 flex-1 max-h-[600px] overflow-y-auto">
                  {tactic.techniques.length === 0 ? (
                    <div className="p-4 text-center text-[11px] font-mono text-slate-600 italic">
                      Nenhuma técnica nesta tática
                    </div>
                  ) : (
                    tactic.techniques.map((tech) => {
                      const hasEvidence = !!tech.procedureEvidence?.operationalNote;

                      return (
                        <div
                          key={tech.id}
                          onClick={() => onSelectTechnique(tech)}
                          className="p-2.5 rounded-lg bg-[#090A0F] border border-white/[0.08] hover:border-sky-500/50 hover:bg-[#131c2e] cursor-pointer transition-all duration-150 group shadow-sm flex flex-col justify-between gap-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-sky-400 group-hover:text-sky-300">
                              {tech.id}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${getSeverityBadge(
                                tech.severity
                              )}`}
                            >
                              {tech.severity}
                            </span>
                          </div>

                          <p className="text-xs font-medium text-slate-200 group-hover:text-white line-clamp-2 leading-snug">
                            {tech.name}
                          </p>

                          <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[10px] font-mono">
                            {hasEvidence ? (
                              <span className="flex items-center gap-1 text-emerald-400">
                                <FileSearch className="w-3 h-3" />
                                <span>Evidência</span>
                              </span>
                            ) : (
                              <span className="text-slate-600">Sem evidência</span>
                            )}

                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
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
    </div>
  );
};
