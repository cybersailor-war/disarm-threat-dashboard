import React from 'react';
import {
  FolderOpen,
  Upload,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { DisarmCampaign } from '../types/disarm';

interface EmptyOperationStateProps {
  allCampaigns: DisarmCampaign[];
  onSelectCampaign: (campaign: DisarmCampaign) => void;
  onOpenUpload: () => void;
  onExploreFramework: () => void;
}

export const EmptyOperationState: React.FC<EmptyOperationStateProps> = ({
  allCampaigns,
  onSelectCampaign,
  onOpenUpload,
  onExploreFramework,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1322] via-[#0b101c] to-[#0d1322] border border-white/[0.08] p-6 lg:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            DISARM.AI • Modo de Prontidão Inicial
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Nenhuma Operação Carregada
          </h2>

          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            A ferramenta foi iniciada em estado limpo. Selecione uma investigação abaixo em{' '}
            <strong className="text-sky-300 font-medium">Operações Salvas</strong> ou inicie uma nova análise de incidente através do botão{' '}
            <strong className="text-emerald-300 font-medium">Analisar Caso</strong> no menu superior.
          </p>
        </div>
      </div>

      {/* Main Section: Operações Salvas (Full Width) */}
      <div className="space-y-4 rounded-2xl bg-[#0b101c] border border-white/[0.08] p-6 shadow-tactical">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Operações Salvas</h3>
              <p className="text-xs text-slate-400 font-mono">
                {allCampaigns.length} {allCampaigns.length === 1 ? 'caso disponível' : 'casos disponíveis na estação'}
              </p>
            </div>
          </div>

          {/* Secondary Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-mono text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
              title="Importar camada DISARM Navigator em JSON"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Upload JSON</span>
            </button>
            <button
              onClick={onExploreFramework}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-mono text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
              title="Consultar catálogo de 16 Táticas e 391 Técnicas"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>DISARM Red Framework</span>
            </button>
          </div>
        </div>

        {allCampaigns.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs font-mono">
            Nenhuma operação salva encontrada no armazenamento local.
          </div>
        ) : (
          <div className="space-y-3">
            {allCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#0e1424] hover:bg-[#131b30] border border-white/[0.06] hover:border-sky-500/40 transition-all group shadow-sm"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-sky-300 transition-colors truncate">
                      {camp.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase flex-shrink-0 ${
                        camp.overallSeverity === 'critical'
                          ? 'text-red-400 bg-red-500/10 border-red-500/30'
                          : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                      }`}
                    >
                      {camp.overallSeverity}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono flex-wrap">
                    <span className="text-slate-300">{camp.threatActor || 'Ator não atribuído'}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-sky-400 font-semibold">{camp.techniques.length} TTPs mapeadas</span>
                    <span className="text-slate-600">•</span>
                    <span>Atualizado em {new Date(camp.lastUpdated).toLocaleDateString('pt-BR')}</span>
                  </div>

                  {camp.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 font-sans leading-relaxed">
                      {camp.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onSelectCampaign(camp)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold font-mono text-sky-300 hover:text-white bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 hover:border-sky-500/50 transition-all cursor-pointer whitespace-nowrap flex-shrink-0 shadow-sm"
                >
                  <span>Carregar Operação</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
