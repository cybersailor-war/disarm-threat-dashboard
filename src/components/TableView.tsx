import React, { useState, useMemo } from 'react';
import {
  Search,
  FileSearch,
  ChevronRight,
  Copy,
  Check,
  ArrowUpDown,
  Database,
} from 'lucide-react';
import { DisarmCampaign, DisarmTechnique, ThreatSeverity } from '../types/disarm';
import { DISARM_TACTICS_MASTER } from '../data/disarmMaster';

interface TableViewProps {
  campaign: DisarmCampaign;
  onSelectTechnique: (technique: DisarmTechnique) => void;
  selectedTacticFilter?: string | 'ALL';
  onTacticFilterChange?: (tacticId: string | 'ALL') => void;
}

type SortField = 'id' | 'name' | 'tacticId' | 'severity';
type SortDirection = 'asc' | 'desc';

export const TableView: React.FC<TableViewProps> = ({
  campaign,
  onSelectTechnique,
  selectedTacticFilter = 'ALL',
  onTacticFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [onlyWithEvidence, setOnlyWithEvidence] = useState(false);
  const [sortField, setSortField] = useState<SortField>('tacticId');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedTechniques = useMemo(() => {
    let result = campaign.techniques.filter((tech) => {
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

      if (severityFilter !== 'ALL' && tech.severity !== severityFilter) {
        return false;
      }

      if (onlyWithEvidence && (!tech.procedureEvidence || !tech.procedureEvidence.operationalNote)) {
        return false;
      }

      return true;
    });

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'tacticId':
          comparison = a.tacticId.localeCompare(b.tacticId);
          break;
        case 'severity':
          const order: Record<ThreatSeverity, number> = {
            critical: 4,
            high: 3,
            medium: 2,
            low: 1,
            informational: 0,
          };
          comparison = (order[a.severity] || 0) - (order[b.severity] || 0);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [campaign.techniques, searchQuery, selectedTacticFilter, severityFilter, onlyWithEvidence, sortField, sortDirection]);

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
      {/* Toolbar */}
      <div className="tactical-panel p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar tabela por ID, técnica, procedimento operacional ou artefato..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#090A0F] border border-white/[0.08] focus:border-sky-500/50 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tactic Filter */}
          <div className="flex items-center gap-1.5 bg-[#090A0F] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Tática:</span>
            <select
              value={selectedTacticFilter}
              onChange={(e) =>
                onTacticFilterChange && onTacticFilterChange(e.target.value)
              }
              className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer max-w-[180px] truncate"
            >
              <option value="ALL" className="bg-[#111827]">Todas as Táticas</option>
              {DISARM_TACTICS_MASTER.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#111827]">
                  {t.id} - {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5 bg-[#090A0F] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Severidade:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#111827]">Todas</option>
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

      {/* Table Container */}
      <div className="tactical-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#090A0F]/80 border-b border-white/[0.08] text-slate-400 text-[11px] uppercase tracking-wider select-none">
              <tr>
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Técnica DISARM</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('tacticId')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Tática DISARM</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('severity')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white transition-colors"
                  title="Grau de severidade atribuído à técnica no contexto desta investigação (avaliação analítica operacional, não intrínseco à matriz estática do DISARM)"
                >
                  <div className="flex items-center gap-1">
                    <span>Severidade (Caso)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold text-center">Procedimento / Evidência</th>
                <th className="py-3 px-4 font-semibold text-center">Artefatos / IOCs</th>
                <th className="py-3 px-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04]">
              {filteredAndSortedTechniques.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 italic">
                    Nenhuma técnica encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredAndSortedTechniques.map((tech) => {
                  const hasEvidence = !!tech.procedureEvidence?.operationalNote;
                  const artifactsCount = tech.procedureEvidence?.observedArtifacts.length || 0;

                  return (
                    <tr
                      key={tech.id}
                      onClick={() => onSelectTechnique(tech)}
                      className="hover:bg-white/[0.03] cursor-pointer transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-3 px-4 font-bold text-sky-400 group-hover:text-sky-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{tech.id}</span>
                          <button
                            onClick={(e) => handleCopyId(e, tech.id)}
                            className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors"
                            title="Copiar ID"
                          >
                            {copiedId === tech.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Name & Concept */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white group-hover:text-sky-300 transition-colors">
                          {tech.name}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-sans">
                          {tech.description}
                        </div>
                      </td>

                      {/* Tactic */}
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        <span className="text-sky-400 font-bold mr-1.5">{tech.tacticId}</span>
                        <span>{tech.tacticName}</span>
                      </td>

                      {/* Severity */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded border text-[11px] uppercase font-bold ${getSeverityBadge(
                            tech.severity
                          )}`}
                        >
                          {tech.severity}
                        </span>
                      </td>

                      {/* Evidence */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {hasEvidence ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px]">
                            <FileSearch className="w-3 h-3" />
                            <span>Mapeado ({tech.procedureEvidence?.confidence})</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Artifacts */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {artifactsCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[11px]">
                            <Database className="w-3 h-3" />
                            <span>{artifactsCount} artefato(s)</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectTechnique(tech)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[11px] font-semibold transition-all group-hover:border-sky-500/50"
                        >
                          <span>Inspecionar</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </button>
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
  );
};
