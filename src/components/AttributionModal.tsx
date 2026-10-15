import React, { useMemo } from 'react';
import {
  X,
  Crosshair,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Globe,
  ExternalLink,
  Sparkles,
  ArrowRight,
  UserCheck,
  Flame,
} from 'lucide-react';
import { DisarmCampaign } from '../types/disarm';
import { correlateTtpWithApts, AptCorrelationResult } from '../data/aptDatabase';

interface AttributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: DisarmCampaign;
  onApplyAttribution: (attributedActor: string, regions?: string[], sectors?: string[]) => void;
}

export const AttributionModal: React.FC<AttributionModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onApplyAttribution,
}) => {
  const techniqueIds = useMemo(() => {
    return campaign.techniques.map((t) => t.id);
  }, [campaign.techniques]);

  const correlationResults: AptCorrelationResult[] = useMemo(() => {
    return correlateTtpWithApts(techniqueIds);
  }, [techniqueIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#0b101b] border border-white/[0.12] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#0e1626]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 via-sky-500/20 to-transparent border border-purple-500/30 text-purple-400">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide font-mono">
                  Mecanismo de Atribuição de Ameaça (CTI APT Correlation)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                  BASE DE CONHECIMENTO CTI
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cruzamento das {campaign.techniques.length} técnicas observadas na operação contra o histórico de grupos APT conhecidos.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Active Case Context Banner */}
          <div className="p-4 rounded-xl bg-[#070b13] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Operação em Análise:
              </span>
              <span className="text-sm font-bold text-white">{campaign.name}</span>
              <div className="text-slate-400 font-mono mt-0.5">
                Ator Atual: <span className="text-sky-300 font-semibold">{campaign.threatActor}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono bg-black/40 px-3 py-1.5 rounded-lg border border-white/[0.05]">
              <span className="text-slate-400">Assinatura Tática:</span>
              <span className="text-emerald-400 font-bold">{techniqueIds.length} TTPs mapeadas</span>
            </div>
          </div>

          {/* Explanation */}
          <p className="text-xs text-slate-300 leading-relaxed">
            O algoritmo analisa a sobreposição matemática entre as técnicas DISARM mobilizadas no seu caso e a assinatura comportamental (Modus Operandi) catalogada por agências de inteligência (MITRE ATT&amp;CK Groups, VIGINUM, Mandiant).
          </p>

          {/* Correlation Results List */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Grupos Adversários Compatíveis (Ranking por Similaridade)</span>
              <span className="text-purple-400 text-[11px]">
                {correlationResults.length} Perfis Avaliados
              </span>
            </div>

            {correlationResults.map((res, index) => {
              const isCurrent = campaign.threatActor.toLowerCase().includes(res.apt.name.toLowerCase().split(' ')[0]);

              return (
                <div
                  key={res.apt.id}
                  className={`p-4 rounded-xl border transition-all ${
                    index === 0
                      ? 'bg-[#0f172a]/80 border-purple-500/50 shadow-md ring-1 ring-purple-500/20'
                      : 'bg-[#070b13] border-white/[0.08] hover:border-white/[0.18]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {index === 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            MAIOR COMPATIBILIDADE
                          </span>
                        )}

                        <span
                          className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                            res.matchScore >= 70
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : res.matchScore >= 45
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-white/[0.05] text-slate-400 border border-white/[0.08]'
                          }`}
                        >
                          {res.matchScore}% de Correlação
                        </span>

                        <span className="text-xs font-mono text-slate-400">
                          Origem: <strong className="text-slate-200">{res.apt.countryOfOrigin}</strong>
                        </span>

                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20">
                            Ator Atualmente Atribuído
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white tracking-wide">
                        {res.apt.name}
                      </h4>

                      <p className="text-xs text-slate-400 font-mono">
                        Aliases: {res.apt.aliases.join(', ')} • Patrocínio: {res.apt.sponsor}
                      </p>

                      <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                        {res.apt.description}
                      </p>

                      {/* Overlap Rationale */}
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.05] space-y-1 mt-2 text-xs">
                        <div className="text-purple-300 font-mono font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                          <span>{res.rationale}</span>
                        </div>
                        <p className="text-slate-400 italic text-[11px]">
                          Precedente Histórico: "{res.apt.historicalPrecedents}"
                        </p>
                      </div>

                      {/* Matching TTP Badges */}
                      {res.matchedTtps.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                          <span className="text-[10px] font-mono text-slate-400">TTPs Coincidentes:</span>
                          {res.matchedTtps.map((m) => (
                            <span
                              key={m.id}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                            >
                              {m.id}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Attribution Action Button */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 flex-shrink-0">
                      <button
                        onClick={() => {
                          onApplyAttribution(
                            res.apt.name,
                            res.apt.typicalTargetRegions,
                            res.apt.typicalTargetSectors
                          );
                          onClose();
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold rounded-lg bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all cursor-pointer whitespace-nowrap"
                        title={`Atribuir ${res.apt.name} como o ator desta operação`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Atribuir este Ator</span>
                      </button>

                      <span className="text-[10px] font-mono text-slate-500">
                        Confiança: {res.attributionConfidence}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#070b13] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-purple-400 font-bold">● Base de Conhecimento CTI</span>
            <span>•</span>
            <span>MITRE ATT&amp;CK Groups / VIGINUM / Mandiant Intelligence</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttributionModal;
