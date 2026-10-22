import React from 'react';
import {
  FolderOpen,
  Brain,
  Plus,
  Upload,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { DisarmCampaign } from '../types/disarm';

interface EmptyOperationStateProps {
  allCampaigns: DisarmCampaign[];
  onSelectCampaign: (campaign: DisarmCampaign) => void;
  onOpenAnalyzer: () => void;
  onCreateNewCampaign: () => void;
  onOpenUpload: () => void;
  onExploreFramework: () => void;
}

export const EmptyOperationState: React.FC<EmptyOperationStateProps> = ({
  allCampaigns,
  onSelectCampaign,
  onOpenAnalyzer,
  onCreateNewCampaign,
  onOpenUpload,
  onExploreFramework,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
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
            A ferramenta foi iniciada em estado limpo. Você pode selecionar uma investigação armazenada em{' '}
            <strong className="text-sky-300 font-medium">Operações Salvas</strong>, iniciar uma nova análise heurística de{' '}
            <strong className="text-emerald-300 font-medium">Hacking for Influence</strong> a partir de um relato de incidente, ou criar uma operação em branco.
          </p>
        </div>
      </div>

      {/* Grid of Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Saved Operations List */}
        <div className="lg:col-span-2 space-y-4 rounded-2xl bg-[#0b101c] border border-white/[0.08] p-5 shadow-tactical">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Operações Salvas</h3>
                <p className="text-xs text-slate-400 font-mono">
                  {allCampaigns.length} {allCampaigns.length === 1 ? 'caso disponível' : 'casos disponíveis na estação'}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              Persistência Local Ativa
            </span>
          </div>

          {allCampaigns.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs font-mono">
              Nenhuma operação salva encontrada no armazenamento local.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {allCampaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0e1424] hover:bg-[#131b30] border border-white/[0.06] hover:border-sky-500/40 transition-all group"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-sky-300 transition-colors truncate">
                        {camp.name}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded border font-bold uppercase flex-shrink-0 ${
                          camp.overallSeverity === 'critical'
                            ? 'text-red-400 bg-red-500/10 border-red-500/30'
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                        }`}
                      >
                        {camp.overallSeverity}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono flex-wrap">
                      <span>{camp.threatActor || 'Ator não atribuído'}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-sky-400 font-semibold">{camp.techniques.length} TTPs mapeadas</span>
                      <span className="text-slate-600">•</span>
                      <span>Atualizado em {new Date(camp.lastUpdated).toLocaleDateString('pt-BR')}</span>
                    </div>

                    {camp.description && (
                      <p className="text-xs text-slate-400 line-clamp-1 font-sans">
                        {camp.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectCampaign(camp)}
                    className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold font-mono text-sky-300 hover:text-white bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 hover:border-sky-500/50 transition-all cursor-pointer whitespace-nowrap flex-shrink-0 shadow-sm"
                  >
                    <span>Carregar Operação</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 3: Quick Creation & Analysis Options */}
        <div className="space-y-4">
          {/* Option A: Analisar Caso (HFI) */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-950/20 via-[#0b101c] to-[#0b101c] border border-emerald-500/30 p-5 space-y-3 shadow-tactical">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Analisar Novo Caso</h3>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Cole a narrativa do incidente e a lista de IOCs brutos (IPs, domínios, hashes) para inferência automática contra a base DISARM.
            </p>
            <button
              onClick={onOpenAnalyzer}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 hover:border-emerald-400 transition-all cursor-pointer shadow-sm"
            >
              <Brain className="w-4 h-4" />
              <span>Abrir Analisador de Caso</span>
            </button>
          </div>

          {/* Option B: Nova Operação em Branco */}
          <div className="rounded-2xl bg-[#0b101c] border border-white/[0.08] p-5 space-y-3 shadow-tactical">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300">
                <Plus className="w-5 h-5 text-sky-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Nova Investigação Vazia</h3>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Inicie um caso em branco para montagem manual de técnicas na matriz ou importação de TTPs.
            </p>
            <button
              onClick={onCreateNewCampaign}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Caso em Branco</span>
            </button>
          </div>

          {/* Quick Links: Upload JSON & Framework */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenUpload}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] transition-all cursor-pointer"
              title="Importar camada DISARM Navigator em JSON"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Upload JSON</span>
            </button>
            <button
              onClick={onExploreFramework}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] transition-all cursor-pointer"
              title="Consultar catálogo de 16 Táticas e 391 Técnicas"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ver Framework</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
