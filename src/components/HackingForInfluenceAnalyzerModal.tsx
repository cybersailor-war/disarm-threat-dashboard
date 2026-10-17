import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  FileText,
  Layers,
  Edit2,
  Trash2,
  ListFilter,
  Check,
  Eye,
  Crosshair,
  Globe,
  Building2,
} from 'lucide-react';
import {
  OFFICIAL_DISARM_TECHNIQUES,
  OFFICIAL_DISARM_TACTICS,
  OfficialDisarmTechnique
} from '../data/officialDisarmData';
import { DisarmCampaign, DisarmTechnique, ThreatSeverity, ProcedureEvidence } from '../types/disarm';
import { buildTacticsList } from '../utils/disarmParser';

interface HackingForInfluenceAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyInvestigation: (newCampaign: DisarmCampaign) => void;
  currentCampaign?: DisarmCampaign;
}

interface ProposedTtp {
  id: string;
  technique: OfficialDisarmTechnique;
  severity: ThreatSeverity;
  confidence: 'confirmed' | 'probable' | 'possible';
  rationale: string;
  extractedProcedureTitle: string;
  extractedNote: string;
  extractedArtifacts: string[];
  selected: boolean;
}

export const HackingForInfluenceAnalyzerModal: React.FC<HackingForInfluenceAnalyzerModalProps> = ({
  isOpen,
  onClose,
  onApplyInvestigation,
  currentCampaign,
}) => {
  // Wizard steps: 'input' | 'review'
  const [step, setStep] = useState<'input' | 'review'>('input');

  // Form input state
  const [caseTitle, setCaseTitle] = useState(
    currentCampaign ? currentCampaign.name : 'Incidente de Vazamento & Manipulação de Narrativa (Hacking for Influence)'
  );
  // Threat actor, target regions and sectors will be populated after TTP analysis in Step 2
  const [threatActor, setThreatActor] = useState(
    currentCampaign ? currentCampaign.threatActor : 'Ator de Ameaça sob Investigação'
  );
  const [targetRegions, setTargetRegions] = useState('Brasil, América Latina');
  const [targetSectors, setTargetSectors] = useState('Governamental, Processo Eleitoral, Mídia');
  const [incidentText, setIncidentText] = useState('');
  const [rawIocs, setRawIocs] = useState('');

  // Proposed TTPs state
  const [proposedTtps, setProposedTtps] = useState<ProposedTtp[]>([]);
  const [editingTtpId, setEditingTtpId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Preset quick examples for operator convenience
  const loadExampleHackingForInfluence = () => {
    setCaseTitle('Operação Vazamento Hack-and-Leak & Clones de Imprensa');
    setIncidentText(
      `Detectada invasão prévia de caixas de e-mail e servidores de arquivos de oficiais militares através de campanhas de spear-phishing. Documentos autênticos roubados foram adulterados digitalmente para inserir cláusulas falsas indicando envio de tropas ao exterior.
Em seguida, foram registrados 15 domínios typosquatted clonando o layout do jornal Le Monde (ex: lemonde.ltd) e Der Spiegel.
Para disseminação, ativou-se uma rede com centenas de perfis automatizados (bots) no X/Twitter utilizando avatares criados com fotos de inteligência artificial (StyleGAN) e selos azuis comprados. Os bots responderam sincronizadamente às postagens oficiais de ministérios, impulsionando a hashtag #VerdadeOculta.
Além disso, anúncios patrocinados no Facebook utilizaram scripts de cloaking para burlar os sistemas de moderação e redirecionar cidadãos locais para os artigos forjados.`
    );
    setRawIocs(
      `lemonde.ltd
der-spiegel.info
185.220.101.45
194.36.177.12
#VerdadeOculta
dossie_vazamento_militar_alterado.pdf
SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
    );
  };

  // Automated heuristic pattern analysis engine
  const handleAnalyze = () => {
    const text = `${incidentText} ${rawIocs}`.toLowerCase();
    const proposals: ProposedTtp[] = [];

    // Extract raw IOC lines
    const parsedIocs = rawIocs
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const checkAndAdd = (
      techId: string,
      keywords: string[],
      rationale: string,
      defaultTitle: string,
      severity: ThreatSeverity,
      confidence: 'confirmed' | 'probable'
    ) => {
      const matchFound = keywords.some((kw) => text.includes(kw.toLowerCase()));
      if (matchFound) {
        const official = OFFICIAL_DISARM_TECHNIQUES.find((t) => t.id === techId);
        if (official && !proposals.some((p) => p.technique.id === techId)) {
          // Filter related artifacts for this technique
          const relatedArtifacts = parsedIocs.filter((ioc) => {
            if (techId.startsWith('T0089') || techId === 'T0045') {
              return ioc.includes('.pdf') || ioc.includes('SHA256');
            }
            if (techId === 'T0099' || techId.includes('130')) {
              return ioc.includes('.') || ioc.includes('http') || ioc.includes('185.') || ioc.includes('194.');
            }
            if (techId.includes('0015') || techId.includes('0019')) {
              return ioc.startsWith('#');
            }
            return false;
          });

          proposals.push({
            id: `PROP-${techId}-${Date.now()}`,
            technique: official,
            severity,
            confidence,
            rationale,
            extractedProcedureTitle: defaultTitle,
            extractedNote: `Observado no incidente analisado: ${rationale}. Procedimento correlato à tática ${official.tacticName}.`,
            extractedArtifacts: relatedArtifacts.length > 0 ? relatedArtifacts : parsedIocs.slice(0, 2),
            selected: true,
          });
        }
      }
    };

    // 1. Hack and leak & document manipulation
    checkAndAdd(
      'T0089.003',
      ['adulterado', 'alterado', 'modificado', 'falsificado', 'cláusulas falsas', 'forjad'],
      'Menção explícita a adulteração de documentos ou dados legítimos roubados (Hack and Leak)',
      'Adulteração de Documentos Oficiais Autênticos',
      'critical',
      'confirmed'
    );

    checkAndAdd(
      'T0089',
      ['invasão', 'roubados', 'vazamento', 'spear-phishing', 'exfiltração', 'hack', 'e-mail'],
      'Comprometimento de caixas de entrada ou exfiltração de dados confidenciais',
      'Obtenção Não Autorizada de Documentos e Comunicações Privadas',
      'critical',
      'confirmed'
    );

    // 2. Clone sites & Impersonation
    checkAndAdd(
      'T0098.001',
      ['clon', 'typosquat', 'portal falso', 'impersonat', 'le monde', 'der spiegel', 'cópia de site'],
      'Criação de portais clonados ou domínios typosquatted imitando veículos respeitados de imprensa',
      'Criação de Portais Clonados Inautênticos (Le Monde, Der Spiegel)',
      'critical',
      'confirmed'
    );

    // 3. Personas & Bots
    checkAndAdd(
      'T0093.002',
      ['bot', 'automatizad', 'fazenda de contas', 'enxame', 'sincronizad', 'perfis falsos', 'botnet'],
      'Identificação de contas automatizadas coordenadas ou botnet atuando em redes sociais',
      'Disparo Coordenado via Rede de Contas Automatizadas (Bots)',
      'high',
      'confirmed'
    );

    checkAndAdd(
      'T0097',
      ['avatar', 'stylegan', 'inteligência artificial', 'foto gerada', 'persona', 'foto de perfil'],
      'Utilização de avatares sintéticos gerados por IA para criar personas inautênticas',
      'Criação de Personas com Avatares Sintéticos Gerados por IA',
      'high',
      'probable'
    );

    // 4. Hashtag hijacking / search pollution
    checkAndAdd(
      'T0015',
      ['hashtag', '#', 'tag', 'palavra-chave'],
      'Emprego de hashtags coordenadas para agrupar e disseminar mensagens da operação',
      'Criação e Propagação de Hashtags da Campanha',
      'medium',
      'confirmed'
    );

    checkAndAdd(
      'T0019.002',
      ['sequestro de hashtag', 'poluindo', 'poluição de busca', 'responderam', 'injetad'],
      'Inundação de seções de comentários e sequestro de hashtags governamentais',
      'Sequestro de Hashtags e Inundação de Respostas em Contas Oficiais',
      'high',
      'probable'
    );

    // 5. Cloaking & Ads
    checkAndAdd(
      'T0072.004',
      ['segmentação', 'anúncio', 'cloaking', 'meta', 'facebook', 'ad library', 'público'],
      'Uso de anúncios patrocinados hiper-segmentados e técnicas de ad cloaking',
      'Segmentação Psicográfica e Evasão via Ad Cloaking',
      'high',
      'probable'
    );

    // 6. Propaganda / Strategic objectives
    checkAndAdd(
      'T0002',
      ['propaganda', 'estado', 'desacreditar', 'narrativa', 'desestabiliza'],
      'Objetivo de amplificar mensagens propagandísticas e enfraquecer instituições',
      'Promoção de Mensagens Alinhadas aos Objetivos do Adversário',
      'high',
      'probable'
    );

    checkAndAdd(
      'T0074',
      ['planejamento', 'estratégia', 'objetivo', 'meta', 'campanha'],
      'Definição de objetivos estratégicos e direcionamento de impacto de influência',
      'Definição de Objetivos Finais Estratégicos da Operação',
      'medium',
      'probable'
    );

    // If nothing matched, suggest baseline core techniques
    if (proposals.length === 0) {
      const defaultIds = ['T0074', 'T0002', 'T0089', 'T0098.001', 'T0093.002'];
      defaultIds.forEach((id) => {
        const off = OFFICIAL_DISARM_TECHNIQUES.find((t) => t.id === id);
        if (off) {
          proposals.push({
            id: `PROP-${id}-${Date.now()}`,
            technique: off,
            severity: 'high',
            confidence: 'probable',
            rationale: 'TTP fundamental comumente mobilizado em incidentes de Hacking for Influence',
            extractedProcedureTitle: off.name,
            extractedNote: off.description,
            extractedArtifacts: parsedIocs.slice(0, 2),
            selected: true,
          });
        }
      });
    }

    setProposedTtps(proposals);
    setStep('review');
  };

  const toggleSelectTtp = (id: string) => {
    setProposedTtps((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const removeProposedTtp = (id: string) => {
    setProposedTtps((prev) => prev.filter((p) => p.id !== id));
  };

  const handleConfirmAndLoad = () => {
    const selectedProposals = proposedTtps.filter((p) => p.selected);
    if (selectedProposals.length === 0) return;

    // Build DisarmTechnique list
    const techniques: DisarmTechnique[] = selectedProposals.map((p) => {
      const procedure: ProcedureEvidence = {
        id: `PROC-${Date.now().toString().slice(-4)}-${p.technique.id}`,
        techniqueId: p.technique.id,
        title: p.extractedProcedureTitle,
        operationalNote: p.extractedNote,
        observedArtifacts: p.extractedArtifacts,
        evidenceUrls: [],
        targetedEntities: targetSectors.split(',').map((s) => s.trim()),
        confidence: p.confidence,
        dateObserved: new Date().toISOString().split('T')[0],
        analyst: 'Operador de Inteligência (Análise Heurística)',
      };

      return {
        id: p.technique.id,
        name: p.technique.name,
        tacticId: p.technique.tacticId,
        tacticName: p.technique.tacticName,
        description: p.technique.description,
        adversaryObjective: p.technique.description,
        severity: p.severity,
        confidence: p.confidence,
        isActive: true,
        procedureEvidence: procedure,
        disarmRefUrl: p.technique.url,
        isSubtechnique: p.technique.isSubtechnique,
        parentTechniqueId: p.technique.parentTechniqueId,
      };
    });

    const tactics = buildTacticsList(techniques);

    const newCampaign: DisarmCampaign = {
      id: `CAMP-HFI-${Date.now().toString().slice(-6)}`,
      name: caseTitle.trim() || 'Incidente de Hacking for Influence',
      version: '2.0',
      domain: 'disarm-redteam',
      threatActor: threatActor.trim() || 'Ator de Ameaça em Investigação',
      campaignStatus: 'Active Ongoing',
      overallSeverity: 'critical',
      description: incidentText.trim() || 'Investigação de operação de influência gerada via módulo de análise.',
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      targetRegions: targetRegions.split(',').map((r) => r.trim()),
      targetSectors: targetSectors.split(',').map((s) => s.trim()),
      techniques,
      tactics,
      rawSourceType: 'custom-threat-report',
    };

    onApplyInvestigation(newCampaign);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#0b101b] border border-white/[0.12] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#0e1626]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500/20 to-purple-500/20 border border-sky-500/30 text-sky-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Analisador de Caso / Situação (Hacking for Influence)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  DISARM AI / Heurística
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Insira o relato dos fatos observados e os artefatos coletados para que a plataforma analise o contexto e proponha os TTPs adequados.
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

        {/* Content Body: Step 1 (Input) vs Step 2 (Review) */}
        {step === 'input' ? (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Case Title */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Título da Operação / Caso *
              </label>
              <input
                type="text"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                placeholder="Ex: Operação Hack-and-Leak & Clones de Imprensa"
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#070b12] border border-white/[0.08] text-white focus:outline-none focus:border-sky-500 font-medium"
                required
              />
            </div>

            {/* Incident Text Context */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Relato do Incidente / Situação Analisada (Hacking for Influence) *</span>
                <span className="text-slate-500 text-[10px]">O que aconteceu? Descreva as etapas do ataque</span>
              </label>
              <textarea
                value={incidentText}
                onChange={(e) => setIncidentText(e.target.value)}
                rows={7}
                placeholder="Exemplo de entrada:
Detectamos a invasão de caixas postais de autoridades públicas com exfiltração de minutas internas. Trechos de documentos foram adulterados para imputar crimes a candidatos.
Simultaneamente, registraram 20 domínios falsos que clonam o portal de notícias do jornal Le Monde e Der Spiegel.
Centenas de perfis no Twitter/X com avatares gerados por IA e selos de verificação comprados realizaram disparos sincronizados promovendo a hashtag #VerdadeOculta..."
                className="w-full px-3 py-2.5 text-xs rounded-lg bg-[#070b12] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 font-sans leading-relaxed"
                required
              />
            </div>

            {/* Raw IOCs / Artifacts */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Artefatos & IOCs Brutos Coletados (opcional)</span>
                <span className="text-slate-500 text-[10px]">1 item por linha: IPs, domínios, hashes, URLs, hashtags</span>
              </label>
              <textarea
                value={rawIocs}
                onChange={(e) => setRawIocs(e.target.value)}
                rows={4}
                placeholder={`lemonde.ltd\n185.220.101.45\n#VerdadeOculta\ndossie_militar_alterado.pdf\nSHA256: 3b0c44298fc1c14...`}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#070b12] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>
        ) : (
          /* Step 2: Review and Customization of Proposed TTPs */
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Campaign Metadata Fields */}
            <div className="p-4 rounded-xl bg-[#0c121e] border border-white/[0.08] space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                Metadados da Investigação
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1">
                    <Crosshair className="w-3 h-3 text-red-400" />
                    Ator de Ameaça (Opcional)
                  </label>
                  <input
                    type="text"
                    value={threatActor}
                    onChange={(e) => setThreatActor(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#070b12] border border-white/[0.08] text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-sky-400" />
                    Regiões-Alvo
                  </label>
                  <input
                    type="text"
                    value={targetRegions}
                    onChange={(e) => setTargetRegions(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#070b12] border border-white/[0.08] text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-amber-400" />
                    Setores / Instituições Alvo
                  </label>
                  <input
                    type="text"
                    value={targetSectors}
                    onChange={(e) => setTargetSectors(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#070b12] border border-white/[0.08] text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* TTPs summary count */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>
                  A análise identificou <strong>{proposedTtps.length} TTPs oficiais do DISARM</strong> correlacionados ao seu incidente.
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-300 font-bold">
                {proposedTtps.filter((p) => p.selected).length} selecionados
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Revise as técnicas sugeridas abaixo. Você pode desmarcar o que não se aplicar ou ajustar as informações antes de carregar na matriz de investigação ativa.
            </p>

            {/* List of Proposed TTPs */}
            <div className="space-y-3">
              {proposedTtps.map((prop) => (
                <div
                  key={prop.id}
                  className={`p-4 rounded-xl border transition-all ${
                    prop.selected
                      ? 'bg-[#0e1626] border-sky-500/40 shadow-sm'
                      : 'bg-[#070b12]/60 border-white/[0.05] opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={prop.selected}
                        onChange={() => toggleSelectTtp(prop.id)}
                        className="mt-1 w-4 h-4 rounded text-sky-500 bg-[#070b12] border-white/[0.2] focus:ring-0 cursor-pointer"
                      />

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                            {prop.technique.id}
                          </span>
                          <span className="text-sm font-bold text-white">{prop.technique.name}</span>
                          <span className="text-[11px] font-mono text-slate-400">
                            ({prop.technique.tacticId} - {prop.technique.tacticName})
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase ${
                              prop.severity === 'critical'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {prop.severity}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {prop.confidence}
                          </span>
                        </div>

                        {/* Rationale */}
                        <div className="text-xs text-sky-300 font-mono flex items-center gap-1.5 pt-1">
                          <Sparkles className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                          <span>Motivo da sugestão: {prop.rationale}</span>
                        </div>

                        {/* Extracted Title and Note */}
                        <p className="text-xs text-slate-300 pt-1 font-sans">
                          <strong>Procedimento Proposto:</strong> {prop.extractedProcedureTitle}
                        </p>

                        {prop.extractedArtifacts.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                            <span className="text-[10px] font-mono text-slate-500">IOCs extraídos:</span>
                            {prop.extractedArtifacts.map((art, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/40 text-slate-300 border border-white/[0.05]"
                              >
                                {art}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeProposedTtp(prop.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Excluir proposta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#070b12] flex items-center justify-between">
          {step === 'review' ? (
            <button
              type="button"
              onClick={() => setStep('input')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] transition-all"
            >
              ← Voltar e Ajustar Relato
            </button>
          ) : (
            <span className="text-[11px] font-mono text-slate-500">
              Mapeamento automatizado contra a base oficial DISARM Foundation (257 técnicas)
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition-all"
            >
              Cancelar
            </button>

            {step === 'input' ? (
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!incidentText.trim()}
                className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg transition-all shadow-glow-cyan ${
                  incidentText.trim()
                    ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 cursor-pointer'
                    : 'bg-white/[0.05] text-slate-500 cursor-not-allowed'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span>Analisar Situação & Propor TTPs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmAndLoad}
                disabled={proposedTtps.filter((p) => p.selected).length === 0}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-glow-cyan transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Carregar TTPs na Matriz da Investigação</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
