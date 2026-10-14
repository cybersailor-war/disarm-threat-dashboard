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
} from 'lucide-react';
import { DisarmCampaign } from '../types/disarm';
import { MOCK_CAMPAIGN_DOPPELGANGER, MOCK_CAMPAIGN_GHOSTWRITER } from '../data/mockDisarmData';
import { exportCampaignAsMarkdown, exportCampaignAsJson } from '../utils/exportUtils';

interface HeaderProps {
  currentCampaign: DisarmCampaign;
  onSelectCampaign: (campaign: DisarmCampaign) => void;
  onOpenUpload: () => void;
  onOpenReport: () => void;
  onOpenAnalyzer: () => void;
  onOpenManualTtp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCampaign,
  onSelectCampaign,
  onOpenUpload,
  onOpenReport,
  onOpenAnalyzer,
  onOpenManualTtp,
}) => {
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [campaignDropdownOpen, setCampaignDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#070a12]/95 backdrop-blur-md border-b border-white/[0.08] px-4 lg:px-8 py-2.5 transition-all">
      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6">
        {/* Left: Brand Identity & Subtitle */}
        <div className="flex items-center gap-3.5 w-full lg:w-auto justify-between lg:justify-start">
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
                  DISARM<span className="text-sky-400">.OPS</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-red-500/15 text-red-400 border border-red-500/30 font-bold tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                  RED TEAM
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans tracking-tight leading-tight mt-0.5">
                Disinformation Analysis &amp; Risk Management <span className="text-slate-500">•</span> <span className="text-sky-300/90 font-medium">Hacking for Influence</span>
              </p>
            </div>
          </div>

          {/* Mobile Upload Icon */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenUpload}
              className="p-2 rounded-lg bg-white/[0.04] text-sky-400 border border-white/[0.08]"
              title="Upload JSON"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Operation Selector */}
        <div className="relative w-full lg:w-auto flex-1 max-w-md">
          <button
            onClick={() => setCampaignDropdownOpen(!campaignDropdownOpen)}
            className="w-full flex items-center justify-between gap-3 px-3.5 py-1.5 rounded-xl bg-[#0e1422] hover:bg-[#121a2c] border border-white/[0.08] hover:border-sky-500/40 text-left transition-all text-xs group"
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Operação:</span>
              <span className="font-semibold text-slate-100 truncate group-hover:text-sky-300 transition-colors">
                {currentCampaign.name}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors flex-shrink-0" />
          </button>

          {campaignDropdownOpen && (
            <div className="absolute left-0 mt-2 w-full sm:w-[420px] bg-[#0d131f] border border-white/[0.12] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in duration-150">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/[0.06] mb-1">
                Selecione o Caso de Investigação
              </div>

              <button
                onClick={() => {
                  onSelectCampaign(MOCK_CAMPAIGN_DOPPELGANGER);
                  setCampaignDropdownOpen(false);
                }}
                className="w-full flex flex-col gap-1 p-2.5 rounded-lg hover:bg-white/[0.04] text-left transition-colors border border-transparent hover:border-sky-500/20 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-100 group-hover:text-sky-300">
                    Operação Doppelgänger / Matryoshka
                  </span>
                  <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 font-bold">
                    CRÍTICO
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  Clonagem estrutural do Le Monde/Spiegel, redes de bots e ad cloaking.
                </p>
              </button>

              <button
                onClick={() => {
                  onSelectCampaign(MOCK_CAMPAIGN_GHOSTWRITER);
                  setCampaignDropdownOpen(false);
                }}
                className="w-full flex flex-col gap-1 p-2.5 rounded-lg hover:bg-white/[0.04] text-left transition-colors border border-transparent hover:border-sky-500/20 group mt-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-100 group-hover:text-sky-300">
                    Operação Ghostwriter / UNC1151
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                    ALTO
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  Comprometimento de CMS e falsificação de ofícios militares da OTAN.
                </p>
              </button>
            </div>
          )}
        </div>

        {/* Right: Unified Professional Action Toolbar (Single Horizontal Row) */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end flex-nowrap overflow-x-auto scrollbar-none">
          {/* Analisar Caso (HFI) -> Analisar Caso */}
          <button
            onClick={onOpenAnalyzer}
            className="flex items-center gap-2 px-3.5 h-8.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 rounded-lg shadow-[0_0_12px_rgba(16,185,129,0.15)] transition-all whitespace-nowrap cursor-pointer flex-shrink-0"
            title="Análise assistida por inteligência heurística para incidentes de Hacking for Influence"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Analisar Caso</span>
          </button>

          {/* + Novo TTP */}
          <button
            onClick={onOpenManualTtp}
            className="flex items-center gap-1.5 px-3 h-8.5 text-xs font-semibold text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 hover:border-sky-500/50 rounded-lg shadow-[0_0_12px_rgba(56,189,248,0.15)] transition-all whitespace-nowrap cursor-pointer flex-shrink-0"
            title="Adicionar ou registrar técnica manualmente"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Novo TTP</span>
          </button>

          {/* Subtle Vertical Divider */}
          <div className="h-5 w-px bg-white/[0.1] mx-0.5 hidden sm:block flex-shrink-0" />

          {/* Upload JSON (formerly Ingerir JSON) */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 h-8.5 text-xs font-medium text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.18] rounded-lg transition-all whitespace-nowrap cursor-pointer flex-shrink-0"
            title="Upload de arquivo JSON ou camada DISARM Navigator"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Upload JSON</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="flex items-center gap-1.5 px-3 h-8.5 text-xs font-medium text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.18] rounded-lg transition-all whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Exportar</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0d131f] border border-white/[0.12] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in duration-150">
                <button
                  onClick={() => {
                    onOpenReport();
                    setExportDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-white/[0.06] rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>Visualizar Relatório Executivo</span>
                </button>

                <button
                  onClick={() => {
                    exportCampaignAsMarkdown(currentCampaign);
                    setExportDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-white/[0.06] rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Exportar Resumo (.md)</span>
                </button>

                <button
                  onClick={() => {
                    exportCampaignAsJson(currentCampaign);
                    setExportDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-white/[0.06] rounded-lg transition-colors"
                >
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Exportar JSON da Campanha</span>
                </button>

                <button
                  onClick={() => {
                    onOpenReport();
                    setExportDropdownOpen(false);
                    setTimeout(() => window.print(), 300);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-white/[0.06] rounded-lg transition-colors border-t border-white/[0.06] mt-1 pt-2"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Imprimir / Salvar em PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
