import React, { useState } from 'react';
import {
  LayoutDashboard,
  Grid,
  Table as TableIcon,
  BookOpen,
  Plus,
} from 'lucide-react';
import { Header } from './components/Header';
import { OverviewDashboard } from './components/OverviewDashboard';
import { MatrixView } from './components/MatrixView';
import { TableView } from './components/TableView';
import { OfficialDisarmNavigatorView } from './components/OfficialDisarmNavigatorView';
import { EmptyOperationState } from './components/EmptyOperationState';
import { TTPDetailDrawer } from './components/TTPDetailDrawer';
import { UploadModal } from './components/UploadModal';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { ManualTtpModal } from './components/ManualTtpModal';
import { HackingForInfluenceAnalyzerModal } from './components/HackingForInfluenceAnalyzerModal';
import { DisarmCampaign, DisarmTechnique } from './types/disarm';
import { OfficialDisarmTechnique } from './data/officialDisarmData';
import { REAL_CAMPAIGN_DNC_HACK_LEAK } from './data/mockDisarmData';
import { buildTacticsList } from './utils/disarmParser';

type ActiveTab = 'overview' | 'matrix' | 'navigator' | 'table';

const LOCAL_STORAGE_KEY = 'disarm_campaigns_store_v2';
const ACTIVE_CAMPAIGN_KEY = 'disarm_active_campaign_id_v2';

const getInitialCampaigns = (): DisarmCampaign[] => {
  // Limpar resíduos antigos de mocks do localStorage se existirem
  try {
    localStorage.removeItem('disarm_campaigns_store_v1');
    localStorage.removeItem('disarm_active_campaign_id_v1');
  } catch {}

  const defaultList: DisarmCampaign[] = [
    {
      ...REAL_CAMPAIGN_DNC_HACK_LEAK,
      tactics: buildTacticsList(REAL_CAMPAIGN_DNC_HACK_LEAK.techniques),
    },
  ];

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Garantir que mocks antigos não permaneçam
        const valid = parsed.filter(
          (c: DisarmCampaign) => c.id !== 'CAMP-HFI-2026-089' && c.id !== 'CAMP-HFI-2026-042'
        );
        if (valid.length > 0) {
          return valid.map((c: DisarmCampaign) => ({
            ...c,
            tactics: c.tactics && c.tactics.length > 0 ? c.tactics : buildTacticsList(c.techniques || []),
          }));
        }
      }
    }
  } catch (err) {
    console.warn('Erro ao restaurar operações salvas do localStorage:', err);
  }

  return defaultList;
};

export const App: React.FC = () => {
  const [allCampaigns, setAllCampaigns] = useState<DisarmCampaign[]>(getInitialCampaigns);
  
  // A aplicação sempre inicia sem nenhuma operação carregada (estado limpo)
  const [currentCampaign, setCurrentCampaign] = useState<DisarmCampaign | null>(null);

  const [isSavedRecently, setIsSavedRecently] = useState(false);
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

  const saveToStorage = (list: DisarmCampaign[], activeId?: string) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
      if (activeId) {
        localStorage.setItem(ACTIVE_CAMPAIGN_KEY, activeId);
      } else {
        localStorage.removeItem(ACTIVE_CAMPAIGN_KEY);
      }
    } catch (err) {
      console.warn('Erro ao salvar no localStorage:', err);
    }
  };

  // Switch campaign with automatic persistence of currently active campaign
  const handleCampaignChange = (targetCampaign: DisarmCampaign) => {
    let updatedList = allCampaigns;
    if (currentCampaign) {
      updatedList = allCampaigns.map((c) =>
        c.id === currentCampaign.id ? currentCampaign : c
      );
    }

    const exists = updatedList.some((c) => c.id === targetCampaign.id);
    const finalList = exists ? updatedList : [targetCampaign, ...updatedList];

    const target = finalList.find((c) => c.id === targetCampaign.id) || targetCampaign;
    const enrichedTarget: DisarmCampaign = {
      ...target,
      tactics: target.tactics && target.tactics.length > 0 ? target.tactics : buildTacticsList(target.techniques),
    };

    setAllCampaigns(finalList);
    setCurrentCampaign(enrichedTarget);
    saveToStorage(finalList, enrichedTarget.id);

    setSelectedTacticFilter('ALL');
    setSelectedTechnique(null);
  };

  // Descarregar operação para voltar à tela limpa
  const handleUnloadCampaign = () => {
    if (currentCampaign) {
      const updatedList = allCampaigns.map((c) =>
        c.id === currentCampaign.id ? currentCampaign : c
      );
      setAllCampaigns(updatedList);
      saveToStorage(updatedList);
    }
    setCurrentCampaign(null);
    setSelectedTechnique(null);
    setSelectedTacticFilter('ALL');
  };

  // Explicit Save Campaign handler
  const handleSaveCurrentCampaign = (overrideCampaign?: DisarmCampaign) => {
    const base = overrideCampaign || currentCampaign;
    if (!base) return;

    const updated: DisarmCampaign = {
      ...base,
      lastUpdated: new Date().toISOString(),
      tactics: base.tactics && base.tactics.length > 0 ? base.tactics : buildTacticsList(base.techniques),
    };

    const updatedList = allCampaigns.map((c) => (c.id === updated.id ? updated : c));
    const exists = allCampaigns.some((c) => c.id === updated.id);
    const finalList = exists ? updatedList : [updated, ...allCampaigns];

    setCurrentCampaign(updated);
    setAllCampaigns(finalList);
    saveToStorage(finalList, updated.id);

    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2200);
  };

  // Create brand new blank campaign
  const handleCreateNewCampaign = () => {
    const newId = `CAMP-HFI-${Date.now().toString().slice(-4)}`;
    const newCampaign: DisarmCampaign = {
      id: newId,
      name: `Nova Investigação ${new Date().toLocaleDateString('pt-BR')}`,
      version: '2.0',
      domain: 'disarm-redteam',
      threatActor: 'Ator de Ameaça em Investigação',
      campaignStatus: 'Active Ongoing',
      overallSeverity: 'high',
      description: 'Caso de investigação criado para mapeamento operacional de TTPs e procedimentos de influência.',
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      targetRegions: ['Brasil', 'América Latina'],
      targetSectors: ['Opinião Pública', 'Processo Eleitoral'],
      techniques: [],
      tactics: [],
      rawSourceType: 'custom-threat-report',
    };

    let finalList = allCampaigns;
    if (currentCampaign) {
      const listWithCurrent = allCampaigns.map((c) =>
        c.id === currentCampaign.id ? currentCampaign : c
      );
      finalList = [newCampaign, ...listWithCurrent];
    } else {
      finalList = [newCampaign, ...allCampaigns];
    }

    setAllCampaigns(finalList);
    setCurrentCampaign(newCampaign);
    saveToStorage(finalList, newCampaign.id);

    setSelectedTacticFilter('ALL');
    setSelectedTechnique(null);
    setActiveTab('matrix');
  };

  // Delete campaign
  const handleDeleteCampaign = (campaignId: string) => {
    const updatedList = allCampaigns.filter((c) => c.id !== campaignId);
    setAllCampaigns(updatedList);

    if (currentCampaign?.id === campaignId) {
      setCurrentCampaign(null);
      saveToStorage(updatedList);
    } else {
      saveToStorage(updatedList, currentCampaign?.id);
    }
  };

  const handleFilterByTacticFromOverview = (tacticId: string | 'ALL') => {
    setSelectedTacticFilter(tacticId);
    setActiveTab('matrix');
  };

  // Save (Add or Update) TTP
  const handleSaveTtp = (savedTtp: DisarmTechnique) => {
    const baseCampaign: DisarmCampaign = currentCampaign || {
      id: `CAMP-HFI-${Date.now().toString().slice(-4)}`,
      name: `Nova Investigação ${new Date().toLocaleDateString('pt-BR')}`,
      version: '2.0',
      domain: 'disarm-redteam',
      threatActor: 'Ator de Ameaça em Investigação',
      campaignStatus: 'Active Ongoing',
      overallSeverity: 'high',
      description: 'Caso de investigação criado para mapeamento operacional de TTPs e procedimentos de influência.',
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      targetRegions: ['Brasil', 'América Latina'],
      targetSectors: ['Opinião Pública'],
      techniques: [],
      tactics: [],
      rawSourceType: 'custom-threat-report',
    };

    const existingIndex = baseCampaign.techniques.findIndex((t) => t.id === savedTtp.id);
    let updatedTechniques: DisarmTechnique[];

    if (existingIndex >= 0) {
      updatedTechniques = [...baseCampaign.techniques];
      updatedTechniques[existingIndex] = savedTtp;
    } else {
      updatedTechniques = [savedTtp, ...baseCampaign.techniques];
    }

    const updatedTactics = buildTacticsList(updatedTechniques);

    const updatedCampaign: DisarmCampaign = {
      ...baseCampaign,
      techniques: updatedTechniques,
      tactics: updatedTactics,
      lastUpdated: new Date().toISOString(),
    };

    const exists = allCampaigns.some((c) => c.id === updatedCampaign.id);
    const updatedList = exists
      ? allCampaigns.map((c) => (c.id === updatedCampaign.id ? updatedCampaign : c))
      : [updatedCampaign, ...allCampaigns];

    setCurrentCampaign(updatedCampaign);
    setAllCampaigns(updatedList);
    saveToStorage(updatedList, updatedCampaign.id);

    if (selectedTechnique?.id === savedTtp.id) {
      setSelectedTechnique(savedTtp);
    }
  };

  // Delete TTP
  const handleDeleteTtp = (techniqueId: string) => {
    if (!currentCampaign) return;
    const updatedTechniques = currentCampaign.techniques.filter((t) => t.id !== techniqueId);
    const updatedTactics = buildTacticsList(updatedTechniques);

    const updatedCampaign: DisarmCampaign = {
      ...currentCampaign,
      techniques: updatedTechniques,
      tactics: updatedTactics,
      lastUpdated: new Date().toISOString(),
    };

    const updatedList = allCampaigns.map((c) =>
      c.id === updatedCampaign.id ? updatedCampaign : c
    );

    setCurrentCampaign(updatedCampaign);
    setAllCampaigns(updatedList);
    saveToStorage(updatedList, updatedCampaign.id);

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
    if (!currentCampaign) {
      handleCreateNewCampaign();
    }
    setEditingTtp(null);
    setInitialOfficialTech(tech);
    setManualTtpModalOpen(true);
  };

  // Open empty manual TTP modal
  const handleOpenNewManualTtp = () => {
    if (!currentCampaign) {
      handleCreateNewCampaign();
    }
    setEditingTtp(null);
    setInitialOfficialTech(null);
    setManualTtpModalOpen(true);
  };

  // Apply new investigation from Analyzer
  const handleApplyAnalyzedInvestigation = (newCampaign: DisarmCampaign) => {
    const enrichedCampaign = {
      ...newCampaign,
      tactics: newCampaign.tactics.length > 0 ? newCampaign.tactics : buildTacticsList(newCampaign.techniques),
    };

    let listWithCurrent = allCampaigns;
    if (currentCampaign) {
      listWithCurrent = allCampaigns.map((c) =>
        c.id === currentCampaign.id ? currentCampaign : c
      );
    }
    const updatedList = [enrichedCampaign, ...listWithCurrent.filter((c) => c.id !== enrichedCampaign.id)];

    setAllCampaigns(updatedList);
    setCurrentCampaign(enrichedCampaign);
    saveToStorage(updatedList, enrichedCampaign.id);

    setActiveTab('matrix');
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        currentCampaign={currentCampaign}
        allCampaigns={allCampaigns}
        onSelectCampaign={handleCampaignChange}
        onSaveCampaign={handleSaveCurrentCampaign}
        isSavedRecently={isSavedRecently}
        onCreateNewCampaign={handleCreateNewCampaign}
        onDeleteCampaign={handleDeleteCampaign}
        onOpenUpload={() => setUploadModalOpen(true)}
        onOpenReport={() => setReportModalOpen(true)}
        onOpenAnalyzer={() => setAnalyzerModalOpen(true)}
        onUnloadCampaign={handleUnloadCampaign}
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
              <span>Visão Geral &amp; Métricas</span>
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
              <span>DISARM Red Framework</span>
            </button>
          </div>

          {/* Contextual Action: Adicionar Nova TTP */}
          <button
            onClick={handleOpenNewManualTtp}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 hover:border-sky-500/50 transition-all cursor-pointer whitespace-nowrap shadow-sm"
            title="Adicionar uma nova TTP customizada à operação em análise"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Nova TTP</span>
          </button>
        </div>

        {/* Tab Views */}
        {!currentCampaign && activeTab !== 'navigator' ? (
          <EmptyOperationState
            allCampaigns={allCampaigns}
            onSelectCampaign={handleCampaignChange}
            onOpenUpload={() => setUploadModalOpen(true)}
            onExploreFramework={() => setActiveTab('navigator')}
          />
        ) : (
          <>
            {activeTab === 'overview' && currentCampaign && (
              <OverviewDashboard
                campaign={currentCampaign}
                onSelectTechnique={(tech) => setSelectedTechnique(tech)}
                onFilterByTactic={handleFilterByTacticFromOverview}
              />
            )}

            {activeTab === 'matrix' && currentCampaign && (
              <MatrixView
                campaign={currentCampaign}
                onSelectTechnique={(tech) => setSelectedTechnique(tech)}
                selectedTacticFilter={selectedTacticFilter}
                onTacticFilterChange={setSelectedTacticFilter}
              />
            )}

            {activeTab === 'table' && currentCampaign && (
              <TableView
                campaign={currentCampaign}
                onSelectTechnique={(tech) => setSelectedTechnique(tech)}
                selectedTacticFilter={selectedTacticFilter}
                onTacticFilterChange={setSelectedTacticFilter}
              />
            )}
          </>
        )}

        {activeTab === 'navigator' && (
          <OfficialDisarmNavigatorView
            campaign={currentCampaign}
            onAddTechniqueToCampaign={handleAddOfficialTechFromNavigator}
            onSelectActiveTechnique={(tech) => setSelectedTechnique(tech)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/[0.08] bg-[#070A11] py-5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col items-center justify-center gap-1.5 text-center">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-white tracking-wider">
              DISARM<span className="text-sky-400">.AI</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-medium">
              AI-Assisted Disinformation Analysis &amp; Risk Management
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-sky-400/90 font-medium font-mono text-[11px] px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
              Hacking for Influence
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-sans">
            © {new Date().getFullYear()} DISARM.AI Threat Dashboard • Mapeamento tático de TTPs baseado no DISARM Red Team Framework da DISARM Foundation.
          </p>
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

      {reportModalOpen && currentCampaign && (
        <ExecutiveReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          campaign={currentCampaign}
        />
      )}

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
        currentCampaign={currentCampaign || undefined}
      />
    </div>
  );
};

export default App;
