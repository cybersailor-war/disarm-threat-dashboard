import React, { useState } from 'react';
import {
  LayoutDashboard,
  Grid,
  Table as TableIcon,
  BookOpen,
} from 'lucide-react';
import { Header } from './components/Header';
import { OverviewDashboard } from './components/OverviewDashboard';
import { MatrixView } from './components/MatrixView';
import { TableView } from './components/TableView';
import { OfficialDisarmNavigatorView } from './components/OfficialDisarmNavigatorView';
import { TTPDetailDrawer } from './components/TTPDetailDrawer';
import { UploadModal } from './components/UploadModal';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { ManualTtpModal } from './components/ManualTtpModal';
import { HackingForInfluenceAnalyzerModal } from './components/HackingForInfluenceAnalyzerModal';
import { DisarmCampaign, DisarmTechnique } from './types/disarm';
import { OfficialDisarmTechnique } from './data/officialDisarmData';
import { MOCK_CAMPAIGN_DOPPELGANGER } from './data/mockDisarmData';
import { buildTacticsList } from './utils/disarmParser';

type ActiveTab = 'overview' | 'matrix' | 'navigator' | 'table';

export const App: React.FC = () => {
  const [currentCampaign, setCurrentCampaign] = useState<DisarmCampaign>(() => {
    return {
      ...MOCK_CAMPAIGN_DOPPELGANGER,
      tactics: buildTacticsList(MOCK_CAMPAIGN_DOPPELGANGER.techniques),
    };
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedTacticFilter, setSelectedTacticFilter] = useState<string | 'ALL'>('ALL');
  const [selectedTechnique, setSelectedTechnique] = useState<DisarmTechnique | null>(null);

  // Modals state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [analyzerModalOpen, setAnalyzerModalOpen] = useState(false);
  const [manualTtpModalOpen, setManualTtpModalOpen] = useState(false);
  const [editingTtp, setEditingTtp] = useState<DisarmTechnique | null>(null);
  const [initialOfficialTech, setInitialOfficialTech] = useState<OfficialDisarmTechnique | null>(null);

  const handleCampaignChange = (campaign: DisarmCampaign) => {
    const enrichedCampaign = {
      ...campaign,
      tactics: campaign.tactics.length > 0 ? campaign.tactics : buildTacticsList(campaign.techniques),
    };
    setCurrentCampaign(enrichedCampaign);
    setSelectedTacticFilter('ALL');
    setSelectedTechnique(null);
  };

  const handleFilterByTacticFromOverview = (tacticId: string | 'ALL') => {
    setSelectedTacticFilter(tacticId);
    setActiveTab('matrix');
  };

  // Save (Add or Update) TTP
  const handleSaveTtp = (savedTtp: DisarmTechnique) => {
    const existingIndex = currentCampaign.techniques.findIndex((t) => t.id === savedTtp.id);
    let updatedTechniques: DisarmTechnique[];

    if (existingIndex >= 0) {
      updatedTechniques = [...currentCampaign.techniques];
      updatedTechniques[existingIndex] = savedTtp;
    } else {
      updatedTechniques = [savedTtp, ...currentCampaign.techniques];
    }

    const updatedTactics = buildTacticsList(updatedTechniques);

    setCurrentCampaign({
      ...currentCampaign,
      techniques: updatedTechniques,
      tactics: updatedTactics,
      lastUpdated: new Date().toISOString(),
    });

    if (selectedTechnique?.id === savedTtp.id) {
      setSelectedTechnique(savedTtp);
    }
  };

  // Delete TTP
  const handleDeleteTtp = (techniqueId: string) => {
    const updatedTechniques = currentCampaign.techniques.filter((t) => t.id !== techniqueId);
    const updatedTactics = buildTacticsList(updatedTechniques);

    setCurrentCampaign({
      ...currentCampaign,
      techniques: updatedTechniques,
      tactics: updatedTactics,
      lastUpdated: new Date().toISOString(),
    });

    if (selectedTechnique?.id === techniqueId) {
      setSelectedTechnique(null);
    }
  };

  // Open editor for a technique
  const handleOpenEditTtp = (technique: DisarmTechnique) => {
    setEditingTtp(technique);
    setInitialOfficialTech(null);
    setManualTtpModalOpen(true);
  };

  // Add technique from Official Navigator View
  const handleAddOfficialTechFromNavigator = (tech: OfficialDisarmTechnique) => {
    setEditingTtp(null);
    setInitialOfficialTech(tech);
    setManualTtpModalOpen(true);
  };

  // Open empty manual TTP modal
  const handleOpenNewManualTtp = () => {
    setEditingTtp(null);
    setInitialOfficialTech(null);
    setManualTtpModalOpen(true);
  };

  // Apply new investigation from Analyzer
  const handleApplyAnalyzedInvestigation = (newCampaign: DisarmCampaign) => {
    handleCampaignChange(newCampaign);
    setActiveTab('matrix');
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        currentCampaign={currentCampaign}
        onSelectCampaign={handleCampaignChange}
        onOpenUpload={() => setUploadModalOpen(true)}
        onOpenReport={() => setReportModalOpen(true)}
        onOpenAnalyzer={() => setAnalyzerModalOpen(true)}
        onOpenManualTtp={handleOpenNewManualTtp}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#111827] border border-white/[0.08] w-fit">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Visão Geral & Métricas</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === 'matrix'
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Matriz do Caso Ativo</span>
            </button>

            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === 'table'
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>Tabela Operacional de TTPs</span>
            </button>

            <button
              onClick={() => setActiveTab('navigator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === 'navigator'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Framework Oficial (Navigator 16 TAs)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="hidden sm:inline">Modo:</span>
            <span className="px-2 py-1 rounded bg-[#111827] border border-white/[0.08] text-white">
              {activeTab === 'overview' && 'Dashboard Analítico'}
              {activeTab === 'matrix' && 'Navegador Tático da Operação'}
              {activeTab === 'navigator' && 'Catálogo Completo DISARM Foundation (16 TAs)'}
              {activeTab === 'table' && 'Inventário Operacional de Procedimentos'}
            </span>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'overview' && (
          <OverviewDashboard
            campaign={currentCampaign}
            onSelectTechnique={(tech) => setSelectedTechnique(tech)}
            onFilterByTactic={handleFilterByTacticFromOverview}
          />
        )}

        {activeTab === 'matrix' && (
          <MatrixView
            campaign={currentCampaign}
            onSelectTechnique={(tech) => setSelectedTechnique(tech)}
            selectedTacticFilter={selectedTacticFilter}
            onTacticFilterChange={setSelectedTacticFilter}
          />
        )}

        {activeTab === 'navigator' && (
          <OfficialDisarmNavigatorView
            campaign={currentCampaign}
            onAddTechniqueToCampaign={handleAddOfficialTechFromNavigator}
            onSelectActiveTechnique={(tech) => setSelectedTechnique(tech)}
          />
        )}

        {activeTab === 'table' && (
          <TableView
            campaign={currentCampaign}
            onSelectTechnique={(tech) => setSelectedTechnique(tech)}
            selectedTacticFilter={selectedTacticFilter}
            onTacticFilterChange={setSelectedTacticFilter}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/[0.08] bg-[#090A0F] py-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-sky-400 font-bold">DISARM Red Team Threat Platform</span>
            <span>•</span>
            <span>DISARM Foundation Framework Oficial (16 Táticas • 257 Técnicas)</span>
          </div>
          <div>
            Análise Operacional de Táticas, Técnicas e Procedimentos (TTPs)
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <TTPDetailDrawer
        technique={selectedTechnique}
        onClose={() => setSelectedTechnique(null)}
        onEdit={handleOpenEditTtp}
        onDelete={handleDeleteTtp}
      />

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onCampaignLoaded={handleCampaignChange}
      />

      <ExecutiveReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        campaign={currentCampaign}
      />

      <ManualTtpModal
        isOpen={manualTtpModalOpen}
        onClose={() => {
          setManualTtpModalOpen(false);
          setEditingTtp(null);
          setInitialOfficialTech(null);
        }}
        onSave={handleSaveTtp}
        initialTtp={editingTtp}
        initialOfficialTech={initialOfficialTech}
      />

      <HackingForInfluenceAnalyzerModal
        isOpen={analyzerModalOpen}
        onClose={() => setAnalyzerModalOpen(false)}
        onApplyInvestigation={handleApplyAnalyzedInvestigation}
        currentCampaign={currentCampaign}
      />
    </div>
  );
};

export default App;
