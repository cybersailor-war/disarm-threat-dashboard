import React, { useState, useEffect } from 'react';
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
  Zap,
  RotateCcw,
} from 'lucide-react';
import {
  OFFICIAL_DISARM_TECHNIQUES,
  OFFICIAL_DISARM_TACTICS,
  OfficialDisarmTechnique,
} from '../data/officialDisarmData';
import { DisarmCampaign, DisarmTechnique, ThreatSeverity, ProcedureEvidence } from '../types/disarm';
import { buildTacticsList } from '../utils/disarmParser';
import { extractIocsFromText } from '../utils/iocExtractor';

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
}) => {
  // Wizard steps: 'input' | 'review'
  const [step, setStep] = useState<'input' | 'review'>('input');

  // Form input state
  const [caseTitle, setCaseTitle] = useState('');
  const [threatActor, setThreatActor] = useState('');
  const [targetRegions, setTargetRegions] = useState('Brasil, América Latina');
  const [targetSectors, setTargetSectors] = useState('Governamental, Defesa, Mídia');
  const [incidentText, setIncidentText] = useState('');
  const [rawIocs, setRawIocs] = useState('');

  // Extraction feedback
  const [extractionFeedback, setExtractionFeedback] = useState<string | null>(null);

  // Proposed TTPs state
  const [proposedTtps, setProposedTtps] = useState<ProposedTtp[]>([]);

  // Limpar todos os campos do formulário para nova análise
  const handleResetForm = () => {
    setCaseTitle('');
    setThreatActor('');
    setTargetRegions('Brasil, América Latina');
    setTargetSectors('Governamental, Defesa, Mídia');
    setIncidentText('');
    setRawIocs('');
    setProposedTtps([]);
    setStep('input');
    setExtractionFeedback(null);
  };

  // Resetar campos ao abrir o modal para garantir início em estado limpo
  useEffect(() => {
    if (isOpen) {
      handleResetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Extração inteligente de artefatos a partir da narrativa
  const handleExtractIocsFromNarrative = () => {
    if (!incidentText.trim()) {
      setExtractionFeedback('Insira primeiro o relato do incidente para extrair os artefatos.');
      setTimeout(() => setExtractionFeedback(null), 3500);
      return;
    }

    const result = extractIocsFromText(incidentText);
    if (result.all.length === 0) {
      setExtractionFeedback('Nenhum artefato específico (IP, domínio, hash, URL, arquivo ou hashtag) identificado no texto.');
      setTimeout(() => setExtractionFeedback(null), 3500);
      return;
    }

    const currentLines = rawIocs
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const combined = Array.from(new Set([...currentLines, ...result.all]));
    setRawIocs(combined.join('\n'));
    setExtractionFeedback(`${result.all.length} artefato(s) extraído(s) automaticamente a partir do relato!`);
    setTimeout(() => setExtractionFeedback(null), 4000);
  };

  // Automated heuristic pattern analysis engine across the DISARM Framework
  const handleAnalyze = () => {
    // Se o analista não preencheu o campo de IOCs, extrair automaticamente da narrativa
    let effectiveIocsText = rawIocs.trim();
    if (!effectiveIocsText && incidentText.trim()) {
      const autoExtracted = extractIocsFromText(incidentText);
      if (autoExtracted.all.length > 0) {
        effectiveIocsText = autoExtracted.all.join('\n');
        setRawIocs(effectiveIocsText);
      }
    }

    const parsedIocs = effectiveIocsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const text = `${incidentText} ${effectiveIocsText}`.toLowerCase();
    const proposals: ProposedTtp[] = [];

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
          // Filtrar artefatos relacionados especificamente a esta técnica
          const relatedArtifacts = parsedIocs.filter((ioc) => {
            const lower = ioc.toLowerCase();
            if (techId.startsWith('T0089') || techId === 'T0088' || techId === 'T0042') {
              return lower.includes('.pdf') || lower.includes('.xlsx') || lower.includes('.docx') || lower.includes('sha256') || lower.includes('hash');
            }
            if (techId.startsWith('T0098') || techId === 'T0099' || techId === 'T0020') {
              return lower.includes('.') || lower.includes('http') || lower.includes('bit.ly') || lower.includes('auth');
            }
            if (techId === 'T0094' || techId === 'T0026') {
              return lower.includes('t.me') || lower.includes('telegram');
            }
            if (techId.includes('0015') || techId.includes('0049')) {
              return lower.startsWith('#');
            }
            if (techId === 'T0093.002' || techId === 'T0072.004') {
              return lower.includes('185.') || lower.includes('194.') || lower.includes('.');
            }
            return false;
          });

          proposals.push({
            id: `PROP-${techId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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

    // --- 1. TA01: Plan Strategy ---
    checkAndAdd(
      'T0074',
      ['estratégia', 'estratégic', 'objetivo estratégico', 'sabotagem', 'neutralizar', 'impedir consolidação', 'impacto assimétrico', 'plano estratégico'],
      'Definição de objetivos finais e direcionamento de impacto estratégico da operação de influência',
      'Definição de Objetivos Estratégicos da Operação',
      'critical',
      'confirmed'
    );

    checkAndAdd(
      'T0002',
      ['propaganda', 'estatal', 'pró-estado', 'narrativa do país', 'desacreditar estado', 'potência militar'],
      'Amplificação de mensagens estatais alinhadas aos interesses geopolíticos do adversário',
      'Alinhamento com Narrativas Estratégicas e Propaganda Estatal',
      'high',
      'probable'
    );

    checkAndAdd(
      'T0059',
      ['longo prazo', 'long game', 'preparação prolongada', 'anos de tensão', 'operação continuada'],
      'Estratégia de influência com desenvolvimento lento e metódico no ambiente de informação',
      'Operação de Longo Prazo e Preparação de Terreno',
      'medium',
      'probable'
    );

    // --- 2. TA02: Plan Objectives ---
    checkAndAdd(
      'T0003',
      ['narrativa existente', 'narrativas existentes', 'tensão prévia', 'atrito histórico', 'derrota militar', 'ressentimento', 'anexação'],
      'Aproveitamento e instrumentalização de atritos históricos ou narrativas preexistentes',
      'Instrumentalização de Narrativas e Ressentimentos Pré-Existentes',
      'high',
      'confirmed'
    );

    // --- 3. TA13: Target Audience Analysis ---
    checkAndAdd(
      'T0080',
      ['mapear público', 'mapeamento de alvos', 'mapearam', 'engenheiros-chefes', 'especialistas recém-retornados', 'parlamentares', 'diretoria-geral', 'dgsn', 'osint'],
      'Mapeamento detalhado e perfilamento de engenheiros, tomadores de decisão e alvos-chave',
      'Mapeamento e Perfilamento de Público-Alvo e Especialistas-Chave',
      'high',
      'confirmed'
    );

    // --- 4. TA06: Develop Content ---
    checkAndAdd(
      'T0089.003',
      ['adulterado', 'alterado', 'modificado', 'falsificado', 'cláusulas falsas', 'forjad', 'laudo adulterado', 'planilha falsificada', 'documentos falsificados', 'backdoor', 'risco radiológico'],
      'Adulteração cirúrgica de documentos autênticos exfiltrados para inserir alegações forjadas',
      'Adulteração de Documentos Oficiais Autênticos (Hack-and-Leak)',
      'critical',
      'confirmed'
    );

    checkAndAdd(
      'T0089',
      ['hack and leak', 'hack-and-leak', 'vazamento', 'exfiltração', 'caixas de e-mail', 'atas de gestão', 'relatórios de integração', 'roubo de credenciais', 'arquivos originais'],
      'Desenvolvimento de pacote de dados vazados combinando documentos reais e adulterados',
      'Desenvolvimento de Pacote de Dados Vazados (Hack-and-Leak)',
      'critical',
      'confirmed'
    );

    checkAndAdd(
      'T0087',
      ['deepfake', 'sintétic', 'vídeo deepfake', 'áudio sintético', 'clonagem de voz', 'inteligência artificial', 'ia generativa', 'vídeo forjado'],
      'Produção de conteúdo multimídia sintético (deepfake) simulando declarações de autoridade',
      'Criação de Mídia Sintética e Vídeos Deepfake',
      'critical',
      'confirmed'
    );

    // --- 5. TA15: Establish Assets ---
    checkAndAdd(
      'T0098.001',
      ['clon', 'typosquat', 'portal falso', 'impersonat', 'domínio falso', 'domínios falsos', 'cópia de site', 'le monde', 'der spiegel', 'portal-naval-auth', 'lemonde.ltd', 'defesanacional'],
      'Registro e configuração de domínios typosquatted ou clones de portais legítimos de imprensa e portais corporativos',
      'Criação de Portais Clonados e Domínios Typosquatted',
      'critical',
      'confirmed'
    );

    checkAndAdd(
      'T0097',
      ['avatar', 'stylegan', 'foto gerada', 'persona', 'foto de perfil', 'foto de inteligência artificial', 'rosto sintético'],
      'Criação de avatares sintéticos com rostos gerados por redes neurais (IA) para perfis inautênticos',
      'Criação de Personas com Avatares Sintéticos Gerados por IA',
      'high',
      'confirmed'
    );

    checkAndAdd(
      'T0093.002',
      ['bot', 'automatizad', 'fazenda de contas', 'enxame', 'sincronizad', 'perfis falsos', 'botnet', 'contas automatizadas', 'disparos de bots'],
      'Estruturação de rede coordenada de contas automatizadas (bots) para amplificação em redes sociais',
      'Disparo Coordenado via Rede de Contas Automatizadas (Bots)',
      'high',
      'confirmed'
    );

    checkAndAdd(
      'T0094',
      ['telegram', 't.me', 'canal anônimo', 'grupo anônimo', 'canal de vazamento', 'canal no telegram'],
      'Estabelecimento de canais de mensageria anônimos para publicação inicial e distribuição do vazamento',
      'Estabelecimento de Canais Anônimos de Vazamento (Telegram)',
      'high',
      'confirmed'
    );

    // --- 6. TA16: Establish Legitimacy ---
    checkAndAdd(
      'T0101',
      ['selo azul', 'selos azuis', 'verificação comprada', 'conta com selo', 'badge de verificação'],
      'Aquisição de selos de verificação em redes sociais para conferir falsa autoridade aos perfis da operação',
      'Aquisição Comercial de Selos de Verificação de Perfil',
      'medium',
      'confirmed'
    );

    checkAndAdd(
      'T0045',
      ['falso especialista', 'pseudo-especialista', 'especialista forjado', 'parecer de especialista', 'perito forjado'],
      'Mobilização de pseudo-especialistas para conferir falso endosso técnico às alegações do vazamento',
      'Mobilização de Falsos Especialistas Técnicos',
      'high',
      'probable'
    );

    checkAndAdd(
      'T0099',
      ['impersonar', 'se passar por', 'clonar imprensa', 'clonavam veículos de imprensa', 'identidade forjada'],
      'Uso indevido da identidade visual e reputação de veículos legítimos de imprensa e portais de defesa',
      'Impersonificação de Órgãos de Imprensa e Instituições',
      'critical',
      'confirmed'
    );

    // --- 7. TA05: Microtarget ---
    checkAndAdd(
      'T0072.004',
      ['cloaking', 'ad cloaking', 'anúncio', 'anúncios patrocinados', 'malvertising', 'meta ads', 'facebook', 'burlar moderação'],
      'Uso de scripts de evasão (ad cloaking) em anúncios patrocinados segmentados para tomadores de decisão',
      'Segmentação Psicográfica e Evasão via Ad Cloaking',
      'high',
      'confirmed'
    );

    checkAndAdd(
      'T0072',
      ['segmentação', 'segmentado', 'público específico', 'direcionado ao parlamento', 'direcionado a engenheiros', 'parlamento'],
      'Microsegmentação e direcionamento da desinformação para alvos parlamentares e formadores de opinião',
      'Segmentação de Audiência e Microtargeting Político',
      'high',
      'confirmed'
    );

    // --- 8. TA07: Deliver Content ---
    checkAndAdd(
      'T0020',
      ['spear-phishing', 'phishing', 'links encurtados', 'bit.ly', 'credenciais', 'roubo de credenciais', 'e-mail de spear-phishing'],
      'Disparo de campanhas direcionadas de spear-phishing com links encurtados para roubo de credenciais de acesso',
      'Campanha de Spear-Phishing para Roubo de Credenciais',
      'critical',
      'confirmed'
    );

    // --- 9. TA09 / TA17: Maximise Exposure & Amplify ---
    checkAndAdd(
      'T0015',
      ['hashtag', '#', 'tag', 'palavra-chave', '#chernobylnomar', '#farsanetuno', '#verdadeoculta'],
      'Criação e indução de hashtags coordenadas para agrupar e disseminar mensagens de impacto na opinião pública',
      'Criação e Propagação de Hashtags de Campanha',
      'medium',
      'confirmed'
    );

    checkAndAdd(
      'T0049.002',
      ['inundar', 'sequestro de hashtag', 'poluição de busca', 'responderam sincronizadamente', 'inundação'],
      'Inundação de seções de comentários e sequestro de fluxos de busca de postagens oficiais',
      'Inundação de Comentários e Sequestro de Hashtags',
      'high',
      'confirmed'
    );

    // --- 10. TA18: Drive Online Harms / Coerce ---
    checkAndAdd(
      'T0036',
      ['doxing', 'doxxing', 'dados pessoais vazados', 'coação psicológica', 'assédio', 'intimidar engenheiros', 'ameaça'],
      'Vazamento malicioso de dados pessoais (doxing) e coação psicológica contra engenheiros e oficiais do projeto',
      'Doxing e Assédio Psicológico a Profissionais do Projeto',
      'critical',
      'confirmed'
    );

    // --- 11. TA11: Persist in the Information Environment ---
    checkAndAdd(
      'T0042',
      ['90%', 'intactos', 'parcialmente autêntico', 'mistura de verdade', 'meia-verdade', 'documentos reais misturados'],
      'Mistura cirúrgica de documentos verídicos com arquivos forjados para dificultar a desmentida rápida',
      'Apresentação de Meias-Verdades e Documentos Misto-Falsificados',
      'high',
      'confirmed'
    );

    // Fallback de contingência caso nenhum padrão tenha correspondido
    if (proposals.length === 0) {
      const defaultIds = ['T0074', 'T0003', 'T0089', 'T0098.001', 'T0093.002'];
      defaultIds.forEach((id) => {
        const off = OFFICIAL_DISARM_TECHNIQUES.find((t) => t.id === id);
        if (off) {
          proposals.push({
            id: `PROP-${id}-${Date.now()}`,
            technique: off,
            severity: 'high',
            confidence: 'probable',
            rationale: 'TTP fundamental identificado a partir do escopo de Hacking for Influence',
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

    // Construção das técnicas tipadas
    const techniques: DisarmTechnique[] = selectedProposals.map((p) => {
      const procedure: ProcedureEvidence = {
        id: `PROC-${Date.now().toString().slice(-4)}-${p.technique.id}`,
        techniqueId: p.technique.id,
        title: p.extractedProcedureTitle,
        operationalNote: p.extractedNote,
        observedArtifacts: p.extractedArtifacts,
        evidenceUrls: [],
        targetedEntities: targetSectors.split(',').map((s) => s.trim()).filter((s) => s.length > 0),
        confidence: p.confidence,
        dateObserved: new Date().toISOString().split('T')[0],
        analyst: 'Operador de Inteligência (Análise Heurística DISARM)',
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
      threatActor: threatActor.trim() || 'Ator de Ameaça sob Investigação',
      campaignStatus: 'Active Ongoing',
      overallSeverity: 'critical',
      description: incidentText.trim() || 'Investigação de operação de influência gerada via módulo de análise.',
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      targetRegions: targetRegions.split(',').map((r) => r.trim()).filter((r) => r.length > 0),
      targetSectors: targetSectors.split(',').map((s) => s.trim()).filter((s) => s.length > 0),
      techniques,
      tactics,
      rawSourceType: 'custom-threat-report',
    };

    onApplyInvestigation(newCampaign);
    handleResetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#0b101b] border border-white/[0.12] rounded-2xl max-w-6xl xl:max-w-7xl w-full max-h-[95vh] h-[90vh] overflow-hidden flex flex-col shadow-2xl">
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetForm}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/[0.08] transition-all"
              title="Limpar formulário e reiniciar campos"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Limpar</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
              title="Fechar janela"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
                placeholder="Ex: Operação Netuno - Sabotagem do SN Vanguarda"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#070b12] border border-white/[0.08] text-white focus:outline-none focus:border-sky-500 font-semibold"
                required
              />
            </div>

            {/* Two-Column Grid for Incident Narrative & Raw IOCs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column (7 cols): Incident Text Context */}
              <div className="lg:col-span-7 flex flex-col">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Relato do Incidente / Situação Analisada (Hacking for Influence) *</span>
                  <span className="text-slate-500 text-[10px]">Descreva as etapas, alvos e vetores do ataque</span>
                </label>
                <textarea
                  value={incidentText}
                  onChange={(e) => setIncidentText(e.target.value)}
                  rows={13}
                  placeholder="Exemplo de entrada (Cenário Operacional):
Detectamos a invasão de caixas postais de autoridades públicas e engenheiros navais com exfiltração de minutas internas de projetos estratégicos.
Documentos confidenciais foram adulterados para forjar laudos de riscos radiológicos e simular backdoors em sistemas de combate.
Simultaneamente, registraram 15 domínios falsos que clonam veículos de imprensa e criaram canal anônimo no Telegram para vazamento.
Vídeo em deepfake de autoridade confirmando falsa fraude foi impulsionado via anúncios segmentados para o Parlamento.
Redes de bots com avatares de IA coordenaram disparos das hashtags de pânico e realizaram doxing de especialistas..."
                  className="w-full px-3.5 py-3 text-xs sm:text-sm rounded-xl bg-[#070b12] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 font-sans leading-relaxed resize-y flex-1"
                  required
                />
              </div>

              {/* Right Column (5 cols): Raw IOCs + Extraction Intelligence Card */}
              <div className="lg:col-span-5 flex flex-col space-y-4">
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                      Artefatos &amp; IOCs Coletados
                    </label>
                    <button
                      type="button"
                      onClick={handleExtractIocsFromNarrative}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer"
                      title="Identificar e extrair automaticamente IPs, domínios, hashes, URLs, arquivos e hashtags contidos no relato"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Extrair do Relato</span>
                    </button>
                  </div>

                  <textarea
                    value={rawIocs}
                    onChange={(e) => setRawIocs(e.target.value)}
                    rows={7}
                    placeholder="portal-naval-auth.com&#10;185.220.101.45&#10;bit.ly/3xNetunoAuth&#10;t.me/VerdadeOcultaNetuno&#10;defesanacional-azul.org&#10;laudo_reator_cpn_v4_confidencial.pdf&#10;auditoria_obsolescencia_combate.xlsx&#10;#ChernobylNoMar&#10;#FarsaNetuno&#10;SHA256: 3b0c44298fc1c14..."
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-[#070b12] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono leading-relaxed resize-y flex-1"
                  />

                  {extractionFeedback && (
                    <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono flex items-center gap-1.5 animate-in fade-in">
                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                      <span>{extractionFeedback}</span>
                    </div>
                  )}
                </div>

                {/* Scope & Framework Coverage Card */}
                <div className="p-3.5 rounded-xl bg-[#0e1628] border border-white/[0.06] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-sky-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5" />
                      Motor Heurístico DISARM
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      16 Táticas Ativas
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Mapeamento multidimensional que correlaciona o relato e os artefatos com o catálogo oficial das <strong>16 Táticas</strong> e técnicas canônicas do DISARM Red Team Framework (Estratégia, Narrativas, Desenvolvimento de Conteúdo, Infraestrutura de Ativos, Microtarget, Disseminação, Amplificação e Evasão).
                  </p>

                  <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-300">
                      Planejamento Estratégico
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
                      Hack-and-Leak &amp; Clones
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-300">
                      Mídia Sintética &amp; Doxing
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      Extração de IOCs Integrada
                    </span>
                  </div>
                </div>
              </div>
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
                    placeholder="Ex: Unidade 404 / País VERMELHO"
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
                            <span className="text-[10px] font-mono text-slate-500">IOCs vinculados:</span>
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
              Mapeamento automatizado contra a base oficial DISARM Foundation
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
                <span>Analisar Situação &amp; Propor TTPs</span>
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
