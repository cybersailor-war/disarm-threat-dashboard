import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  Calendar,
  Database,
  Crosshair,
} from 'lucide-react';
import { DisarmCampaign } from '../types/disarm';
import { computeCampaignMetrics } from '../utils/disarmParser';
import {
  exportCampaignAsMarkdown,
  exportCampaignAsPdf,
  filterRealEvidenceUrls,
  generateMarkdownReport
} from '../utils/exportUtils';
import { DISARM_TACTICS_MASTER } from '../data/disarmMaster';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: DisarmCampaign;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  campaign,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const metrics = computeCampaignMetrics(campaign);
  const markdownText = generateMarkdownReport(campaign);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 lg:p-10 flex justify-center animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#111827] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Action Bar */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0d131f]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Relatório Técnico Operacional DISARM Red Team - Hacking for Influence
              </h2>
              <p className="text-xs text-slate-400">Exportação em Markdown ou impressão em PDF</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar MD'}</span>
            </button>

            <button
              onClick={() => exportCampaignAsMarkdown(campaign)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Baixar (.md)</span>
            </button>

            <button
              onClick={() => exportCampaignAsPdf(campaign)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono transition-colors shadow-glow-cyan"
              title="Baixar Relatório de Inteligência em PDF formatado"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Relatório PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="p-8 sm:p-12 overflow-y-auto space-y-8 text-slate-200 print:text-black print:p-0">
          {/* Document Header */}
          <div className="border-b-2 border-sky-500/40 pb-6 print:border-black">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30 font-bold">
                  DOCUMENTO OPERACIONAL RED TEAM
                </span>
                <span className="text-xs font-mono text-slate-400">DISARM FRAMEWORK v2.0</span>
              </div>
              <span className="text-xs font-mono text-slate-400">ID: {campaign.id}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white print:text-black tracking-tight">
              {campaign.name}
            </h1>
            <p className="text-sm text-slate-300 print:text-slate-800 mt-2 leading-relaxed">
              {campaign.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-white/[0.08] print:border-slate-300 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Ator Atribuído</span>
                <span className="font-bold text-white print:text-black">{campaign.threatActor}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Severidade Geral</span>
                <span className="font-bold text-red-400 print:text-red-700 uppercase">
                  {campaign.overallSeverity}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Status da Operação</span>
                <span className="font-bold text-sky-400 print:text-sky-800">{campaign.campaignStatus}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Data de Atualização</span>
                <span className="font-bold text-slate-200 print:text-black">
                  {new Date(campaign.lastUpdated).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* Factual Metrics */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 print:text-sky-800">
              1. Resumo Quantitativo Extraído do Arquivo
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-[#090A0F] print:bg-slate-100 border border-white/[0.08] print:border-slate-300">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Táticas DISARM</span>
                <span className="text-xl font-bold font-mono text-white print:text-black">
                  {metrics.activeTacticsCount} / {metrics.totalTactics}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#090A0F] print:bg-slate-100 border border-white/[0.08] print:border-slate-300">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Técnicas Mapeadas</span>
                <span className="text-xl font-bold font-mono text-white print:text-black">
                  {metrics.totalTechniques}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#090A0F] print:bg-slate-100 border border-white/[0.08] print:border-slate-300">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Procedimentos / Notas</span>
                <span className="text-xl font-bold font-mono text-emerald-400 print:text-emerald-700">
                  {metrics.proceduresCount}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#090A0F] print:bg-slate-100 border border-white/[0.08] print:border-slate-300">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Artefatos e IOCs</span>
                <span className="text-xl font-bold font-mono text-sky-400 print:text-sky-700">
                  {metrics.totalArtifactsCount}
                </span>
              </div>
            </div>
          </div>

          {/* Official Tactics Mobilized Table */}
          <div className="space-y-3 print-break-inside-avoid">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 print:text-sky-800">
              2. Táticas Oficiais DISARM Mobilizadas na Operação
            </h3>
            <div className="border border-white/[0.08] print:border-slate-300 rounded-lg overflow-hidden text-xs font-mono">
              <table className="w-full text-left">
                <thead className="bg-[#090A0F] print:bg-slate-200 border-b border-white/[0.08] print:border-slate-300 text-slate-400 print:text-slate-700 text-[11px]">
                  <tr>
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Tática Oficial DISARM</th>
                    <th className="p-2.5">Técnicas Ativas</th>
                    <th className="p-2.5">Explicação Oficial DISARM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] print:divide-slate-200">
                  {campaign.tactics.map((tactic) => {
                    const masterDef = DISARM_TACTICS_MASTER.find((m) => m.id === tactic.id);
                    const desc = masterDef?.description || tactic.description;
                    return (
                      <tr key={tactic.id}>
                        <td className="p-2.5 font-bold text-sky-400 print:text-black">{tactic.id}</td>
                        <td className="p-2.5 font-bold text-white print:text-black">{tactic.name}</td>
                        <td className="p-2.5 font-bold">{tactic.techniques.length}</td>
                        <td className="p-2.5 text-slate-300 print:text-slate-700 leading-relaxed">{desc}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed TTP & Mapped Procedures Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 print:text-sky-800">
              3. Detalhamento de TTPs, Procedimentos Operacionais e IOCs
            </h3>

            <div className="space-y-4">
              {campaign.techniques.map((tech) => (
                <div
                  key={tech.id}
                  className="p-4 rounded-xl bg-[#090A0F] print:bg-white border border-white/[0.08] print:border-slate-300 space-y-3 print-break-inside-avoid"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/[0.06] print:border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sky-400 print:text-sky-700">{tech.id}</span>
                      <span className="font-bold text-white print:text-black text-sm">{tech.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 print:text-slate-600">
                      Tática: {tech.tacticId} - {tech.tacticName} • Severidade: {tech.severity.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                    <strong className="text-sky-300 print:text-sky-800">Definição DISARM:</strong> {tech.description}
                  </p>

                  <div className="text-xs text-red-400 print:text-red-700">
                    <strong>Objetivo do Adversário:</strong> {tech.adversaryObjective}
                  </div>

                  {/* Evidence Box */}
                  {tech.procedureEvidence && (
                    <div className="p-3 rounded-lg bg-black/40 print:bg-slate-50 border border-white/[0.04] print:border-slate-200 text-xs space-y-2">
                      <span className="font-mono font-bold text-emerald-400 print:text-emerald-700 block text-[11px] uppercase">
                        🔍 Evidência Mapeada: {tech.procedureEvidence.title} (Confiança: {tech.procedureEvidence.confidence})
                      </span>
                      <p className="text-slate-300 print:text-slate-800 italic">
                        "{tech.procedureEvidence.operationalNote}"
                      </p>
                      {tech.procedureEvidence.observedArtifacts.length > 0 && (
                        <div className="pt-1 font-mono text-[11px] text-slate-400 print:text-slate-600">
                          <strong>Artefatos / IOCs:</strong> {tech.procedureEvidence.observedArtifacts.join(' | ')}
                        </div>
                      )}
                      {filterRealEvidenceUrls(tech.procedureEvidence.evidenceUrls).length > 0 && (
                        <div className="pt-1 font-mono text-[11px] text-sky-400 print:text-sky-700">
                          <strong>Fontes de Evidência:</strong> {filterRealEvidenceUrls(tech.procedureEvidence.evidenceUrls).join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
