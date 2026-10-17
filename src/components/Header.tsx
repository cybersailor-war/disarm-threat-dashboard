import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Download,
  Printer,
  ChevronDown,
  Layers,
  Radar,
  Brain,
  Plus,
  Save,
  Check,
  Trash2,
  FileDown,
  MoreVertical,
} from 'lucide-react';
import { DisarmCampaign } from '../types/disarm';
import {
  exportCampaignAsMarkdown,
  exportCampaignAsJson,
  exportCampaignAsPdf,
} from '../utils/exportUtils';

interface HeaderProps {
  currentCampaign: DisarmCampaign;
  allCampaigns: DisarmCampaign[];
  onSelectCampaign: (campaign: DisarmCampaign) => void;
  onSaveCampaign: () => void;
  isSavedRecently: boolean;
  onCreateNewCampaign?: () => void;
  onDeleteCampaign: (campaignId: string) => void;
  onOpenUpload: () => void;
  onOpenReport: () => void;
  onOpenAnalyzer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCampaign,
  allCampaigns,
  onSelectCampaign,
  onSaveCampaign,
  isSavedRecently,
  onCreateNewCampaign,
  onDeleteCampaign,
  onOpenUpload,
  onOpenReport,
  onOpenAnalyzer,
}) => {
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [campaignDropdownOpen, setCampaignDropdownOpen] = useState(false);

  const handleDirectPdfExport = () => {
    try {
      exportCampaignAsPdf(currentCampaign);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      // Fallback opens the modal
      onOpenReport();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070a12]/95 backdrop-blur-md border-b border-white/[0.08] px-4 lg:px-8 py-2.5 transition-all">
      <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 lg:gap-4 flex-wrap xl:flex-nowrap">
        {/* Left: Brand Identity & Subtitle */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Tactical Radar Badge */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 via-sky-600/10 to-transparent border border-sky-500/30 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)] flex-shrink-0">
              <Radar className="w-5 h-5 animate-pulse text-sky-400" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-wider text-white font-mono">
                  DISARM<span className="text-sky-400">.AI</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-red-500/15 text-red-400 border border-red-500/30 font-bold tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                  RED TEAM
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans tracking-tight leading-tight mt-0.5">
                AI-Assisted Disinformation Analysis &amp; Risk Management <span className="text-slate-500">•</span>{' '}
                <span className="text-sky-300/90 font-medium">Hacking for Influence</span>
              </p>
            </div>
          </div>

          {/* Mobile Upload Icon */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenUpload}
              className="p-2 rounded-lg bg-white/[0.04] text-sky-400 border border-white/[0.08]"
              title="Upload JSON"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Operation Selector WITH Contextual Save Button directly inside */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-1 max-w-md xl:max-w-xl min-w-0">
          {/* Operation Selector Dropdown */}
          <div className="relative flex-1 min-w-0">
            <button
              onClick={() => setCampaignDropdownOpen(!campaignDropdownOpen)}
              className="w-full flex items-center justify-between gap-3 px-4 h-10 rounded-xl bg-[#0e1422] hover:bg-[#131b2e] border border-white/[0.1] hover:border-sky-500/50 text-left transition-all text-xs group cursor-pointer min-w-0 shadow-sm"
            >
              <div className="flex items-center gap-2.5 min-w-0 truncate">
                <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex-shrink-0 font-medium">Caso Ativo:</span>
                <span className="font-semibold text-slate-100 truncate group-hover:text-sky-300 transition-colors text-xs sm:text-sm">
                  {currentCampaign.name}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors flex-shrink-0 ml-1" />
            </button>

            {campaignDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full sm:w-[460px] bg-[#0d131f] border border-white/[0.12] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in duration-150 max-h-[80vh] overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/[0.06] mb-1 flex items-center justify-between">
                  <span>Operações Salvas &amp; Casos de Investigação ({allCampaigns.length})</span>
                  <span className="text-emerald-400 text-[9px] font-mono">Persistência Ativa</span>
                </div>

                <div className="space-y-1">
                  {allCampaigns.map((camp) => {
                    const isActive = camp.id === currentCampaign.id;
                    const isPreset = ['CAMP-REAL-HFI-2016-DNC'].includes(camp.id);

                    return (
                      <div
                        key={camp.id}
                        className={`flex items-center justify-between gap-2 p-2 rounded-lg border transition-all ${
                          isActive
                            ? 'bg-sky-500/10 border-sky-500/30'
                            : 'border-transparent hover:border-white/[0.08] hover:bg-white/[0.04]'
                        }`}
                      >
                        <button
                          onClick={() => {
                            onSelectCampaign(camp);
                            setCampaignDropdownOpen(false);
                          }}
                          className="flex-1 text-left truncate cursor-pointer group"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs font-semibold truncate ${
                                isActive ? 'text-sky-300 font-bold' : 'text-slate-200 group-hover:text-sky-300'
                              }`}
                            >
                              {camp.name}
                            </span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-bold uppercase flex-shrink-0 ${
                                camp.overallSeverity === 'critical'
                                  ? 'text-red-400 bg-red-500/10 border-red-500/20'
                                  : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                              }`}
                            >
                              {camp.overallSeverity}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5 font-sans">
                            {camp.threatActor || 'Ator em investigação'} • {camp.techniques.length} técnicas
                          </p>
                        </button>

                        {allCampaigns.length > 1 && !isPreset && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Deseja remover a operação "${camp.name}"?`)) {
                                onDeleteCampaign(camp.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors flex-shrink-0"
                            title="Remover operação"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Botão Salvar Operação */}
          <button
            onClick={onSaveCampaign}
            className={`flex items-center gap-2 px-4 h-10 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer flex-shrink-0 border shadow-sm ${
              isSavedRecently
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'bg-[#0e1422] hover:bg-[#141d30] text-slate-200 hover:text-white border-white/[0.1] hover:border-sky-500/40'
            }`}
            title={`Salvar alterações na operação "${currentCampaign.name}"`}
          >
            {isSavedRecently ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Save className="w-4 h-4 text-sky-400" />
            )}
            <span>{isSavedRecently ? 'Salvo!' : 'Salvar Operação'}</span>
          </button>
        </div>

        {/* Right: Actions Toolbar (Analisar Caso + Upload JSON + Exportar PDF) */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-nowrap flex-shrink-0">
          {/* Analisar Caso (HFI - Principal meio de alimentação da plataforma) */}
          <button
            onClick={onOpenAnalyzer}
            className="flex items-center gap-2.5 px-5 h-10 text-xs font-semibold text-emerald-300 hover:text-emerald-100 bg-gradient-to-r from-emerald-500/20 to-teal-500/15 hover:from-emerald-500/30 hover:to-teal-500/25 border border-emerald-500/40 hover:border-emerald-400 rounded-xl shadow-[0_0_16px_rgba(16,185,129,0.2)] hover:shadow-[0_0_22px_rgba(16,185,129,0.35)] transition-all whitespace-nowrap cursor-pointer flex-shrink-0 group"
            title="Análise assistida por inteligência heurística para incidentes de Hacking for Influence (Principal fluxo de entrada)"
          >
            <Brain className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Analisar Caso</span>
          </button>

          {/* Upload JSON */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 h-10 text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] rounded-xl transition-all whitespace-nowrap cursor-pointer flex-shrink-0"
            title="Upload de arquivo JSON ou camada DISARM Navigator"
          >
            <Upload className="w-4 h-4 text-sky-400" />
            <span>Upload JSON</span>
          </button>

          {/* Subtle Vertical Divider */}
          <div className="h-6 w-px bg-white/[0.12] mx-1 hidden sm:block flex-shrink-0" />

          {/* Direct 1-Click PDF Export Button */}
          <div className="flex items-center rounded-xl bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-400 hover:to-sky-300 shadow-glow-cyan transition-all flex-shrink-0 h-10">
            <button
              onClick={handleDirectPdfExport}
              className="flex items-center gap-2 px-4 h-10 text-xs font-semibold text-slate-950 transition-all cursor-pointer whitespace-nowrap"
              title="Exportar e baixar imediatamente o Relatório de Inteligência em PDF formatado"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Exportar PDF</span>
            </button>

            {/* Additional Export Options Toggle */}
            <div className="relative h-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExportDropdownOpen(!exportDropdownOpen);
                }}
                className="h-10 px-2.5 text-slate-950 hover:bg-black/10 rounded-r-xl border-l border-black/15 flex items-center justify-center transition-colors cursor-pointer"
                title="Mais opções de exportação"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {exportDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0d131f] border border-white/[0.12] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/[0.06] mb-1">
                    Formatos de Exportação
                  </div>

                  <button
                    onClick={() => {
                      handleDirectPdfExport();
                      setExportDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-sky-400 hover:bg-white/[0.06] rounded-lg transition-colors text-left"
                  >
                    <Download className="w-4 h-4 text-sky-400" />
                    <span>Baixar Relatório PDF (.pdf)</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenReport();
                      setExportDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-white/[0.06] rounded-lg transition-colors text-left"
                  >
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>Visualizar Relatório na Tela</span>
                  </button>

                  <button
                    onClick={() => {
                      exportCampaignAsMarkdown(currentCampaign);
                      setExportDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-white/[0.06] rounded-lg transition-colors text-left"
                  >
                    <FileDown className="w-4 h-4 text-emerald-400" />
                    <span>Exportar Resumo (.md)</span>
                  </button>

                  <button
                    onClick={() => {
                      exportCampaignAsJson(currentCampaign);
                      setExportDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-white/[0.06] rounded-lg transition-colors text-left"
                  >
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Exportar JSON da Campanha</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenReport();
                      setExportDropdownOpen(false);
                      setTimeout(() => window.print(), 350);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-white/[0.06] rounded-lg transition-colors border-t border-white/[0.06] mt-1 pt-2 text-left"
                  >
                    <Printer className="w-4 h-4 text-slate-400" />
                    <span>Imprimir via Navegador</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
