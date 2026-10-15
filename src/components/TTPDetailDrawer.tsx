import React, { useState, useEffect } from 'react';
import {
  X,
  Crosshair,
  FileSearch,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Database,
  Calendar,
  UserCheck,
  Languages,
  FileText,
  Target,
} from 'lucide-react';
import { DisarmTechnique, ThreatSeverity } from '../types/disarm';
import { filterRealEvidenceUrls } from '../utils/exportUtils';
import { getDisarmPortugueseTranslation, formatCleanText } from '../utils/disarmTranslations';

interface TTPDetailDrawerProps {
  technique: DisarmTechnique | null;
  onClose: () => void;
  onEdit?: (technique: DisarmTechnique) => void;
  onDelete?: (techniqueId: string) => void;
}

export const TTPDetailDrawer: React.FC<TTPDetailDrawerProps> = ({
  technique,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [copiedArtifact, setCopiedArtifact] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    setShowTranslation(false);
  }, [technique?.id]);

  if (!technique) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedArtifact(text);
    setTimeout(() => setCopiedArtifact(null), 2000);
  };

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

  const hasEvidence = !!technique.procedureEvidence?.operationalNote;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-[#111827] border-l border-white/[0.1] shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/[0.08] bg-[#0d131f] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  {technique.id}
                </span>
                {technique.subtechniqueId && (
                  <span className="text-xs font-mono text-slate-400 bg-white/[0.05] px-1.5 py-0.5 rounded">
                    {technique.subtechniqueId}
                  </span>
                )}
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded border uppercase ${getSeverityBadge(
                    technique.severity
                  )}`}
                >
                  {technique.severity}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(technique)}
                    className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-mono transition-all"
                  >
                    Editar TTP
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={() => {
                      if (confirm(`Deseja remover ${technique.id} (${technique.name}) da investigação ativa?`)) {
                        onDelete(technique.id);
                        onClose();
                      }
                    }}
                    className="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono transition-all"
                    title="Remover TTP do caso"
                  >
                    Remover
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
                {technique.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs font-mono text-slate-400">
                <span className="text-slate-300">Tática DISARM:</span>
                <span className="text-sky-400 font-medium">{technique.tacticId} - {technique.tacticName}</span>
              </div>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
            {/* Canonical DISARM Definition */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400">
                    <FileSearch className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-mono font-bold text-sky-400 tracking-wide uppercase">
                    Definição Oficial DISARM Framework
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                    showTranslation
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold shadow-sm'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/[0.08] hover:text-white'
                  }`}
                  title="Alternar tradução para Português"
                >
                  <Languages className="w-3.5 h-3.5 text-sky-400" />
                  <span>{showTranslation ? 'Ver Original (EN)' : 'Traduzir para Português'}</span>
                </button>
              </div>

              <div className="bg-[#090A0F] p-4 rounded-xl border border-white/[0.06] font-sans shadow-inner">
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {showTranslation
                    ? getDisarmPortugueseTranslation(technique.id, technique.description)
                    : formatCleanText(technique.description)}
                </p>
              </div>
            </div>

            {/* Custom Adversary Objective if different from description */}
            {technique.adversaryObjective && technique.adversaryObjective !== technique.description && (
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                  <Crosshair className="w-4 h-4" />
                  <span>Objetivo Operacional Específico</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {technique.adversaryObjective}
                </p>
              </div>
            )}

            {/* Mapped Operational Procedure (Evidence) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <FileSearch className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400 tracking-wide uppercase">
                    Procedimento Mapeado na Operação
                  </span>
                </div>
                {technique.procedureEvidence && (
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    Confiança: {technique.procedureEvidence.confidence}
                  </span>
                )}
              </div>

              {hasEvidence && technique.procedureEvidence ? (
                <div className="p-4 rounded-xl bg-[#090A0F] border border-white/[0.08] space-y-4 shadow-inner">
                  {/* Subtitle 1: Procedimento Operacional Observado */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
                      <FileText className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>Procedimento Operacional Observado:</span>
                    </span>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-white font-mono">
                        {technique.procedureEvidence.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed bg-[#070b13] p-3 rounded-lg border border-white/[0.05]">
                        {technique.procedureEvidence.operationalNote}
                      </p>
                    </div>
                  </div>

                  {/* Subtitle 2: Artefatos & IOCs */}
                  {technique.procedureEvidence.observedArtifacts &&
                    technique.procedureEvidence.observedArtifacts.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-white/[0.05]">
                        <span className="text-[11px] font-mono font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
                          <Database className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                          <span>Artefatos Digitais & Indicadores de Comprometimento (IOCs):</span>
                        </span>
                        <div className="space-y-1 pl-1">
                          {technique.procedureEvidence.observedArtifacts.map((artifact, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between gap-2 py-0.5 group text-xs font-mono text-slate-300 hover:text-white"
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400/80 flex-shrink-0" />
                                <span className="truncate select-all">{artifact}</span>
                              </div>
                              <button
                                onClick={() => handleCopy(artifact)}
                                className="text-slate-500 hover:text-sky-300 p-0.5 rounded transition-colors flex-shrink-0 cursor-pointer opacity-70 group-hover:opacity-100"
                                title="Copiar artefato"
                              >
                                {copiedArtifact === artifact ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Evidence URLs */}
                  {filterRealEvidenceUrls(technique.procedureEvidence.evidenceUrls).length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-white/[0.05]">
                      <span className="text-[11px] font-mono font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
                        <ExternalLink className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        <span>Fontes & Repositórios de Evidência:</span>
                      </span>
                      <div className="space-y-1">
                        {filterRealEvidenceUrls(technique.procedureEvidence.evidenceUrls).map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-mono text-sky-400 hover:text-sky-300 hover:underline truncate py-0.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{url}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subtitle 3: Targeted Entities */}
                  {technique.procedureEvidence.targetedEntities &&
                    technique.procedureEvidence.targetedEntities.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-white/[0.05]">
                        <span className="text-[11px] font-mono font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
                          <Target className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span>Alvos & Entidades Visadas:</span>
                        </span>
                        <div className="flex flex-wrap gap-2 pt-0.5">
                          {technique.procedureEvidence.targetedEntities.map((tgt, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#070b13] border border-amber-500/25 text-amber-200/90 font-mono text-[11px] font-medium shadow-sm"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                              <span>{tgt}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Date and Analyst */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.04] text-[10px] font-mono text-slate-500">
                    {technique.procedureEvidence.analyst && (
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        Analista: {technique.procedureEvidence.analyst}
                      </span>
                    )}
                    {technique.procedureEvidence.dateObserved && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Observado em: {technique.procedureEvidence.dateObserved}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#090A0F] border border-white/[0.06] text-center text-slate-500 text-xs italic">
                  Nenhum procedimento operacional específico registrado para esta técnica nesta camada.
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-[#0d131f] flex items-center justify-between text-xs font-mono">
            <a
              href="https://github.com/DISARMFoundation/DISARM_framework"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-sky-400 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>DISARM Foundation Framework</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 transition-colors"
            >
              Fechar Painel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
