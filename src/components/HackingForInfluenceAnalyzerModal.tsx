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
import { extractIocsFromText, extractIncidentMetadata } from '../utils/iocExtractor';

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
  const [targetRegions, setTargetRegions] = useState('');
  const [targetSectors, setTargetSectors] = useState('');
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
    setTargetRegions('');
    setTargetSectors('');
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
    // 1. Consolidação de IOCs (extrair da narrativa se o analista não tiver preenchido manualmente)
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

    const fullAnalysisCorpus = `${incidentText} ${effectiveIocsText}`;

    // 2. Extração inteligente de Metadados da Investigação (Ator, Regiões, Setores)
    // Se o operador ainda não digitou manualmente, preenche com o inferido do relato
    const detectedMeta = extractIncidentMetadata(fullAnalysisCorpus);
    if (!threatActor.trim() && detectedMeta.threatActor) {
      setThreatActor(detectedMeta.threatActor);
    }
    if (!targetRegions.trim() && detectedMeta.targetRegions) {
      setTargetRegions(detectedMeta.targetRegions);
    }
    if (!targetSectors.trim() && detectedMeta.targetSectors) {
      setTargetSectors(detectedMeta.targetSectors);
    }

    // 3. Motor Heurístico Simbólico DISARM de Alta Precisão (24 Técnicas Canônicas)
    const proposals: ProposedTtp[] = [];

    const evaluateRule = (
      techId: string,
      pattern: RegExp,
      rationale: string,
      defaultTitle: string,
      severity: ThreatSeverity,
      confidence: 'confirmed' | 'probable',
      extraArtifactFilter?: (ioc: string) => boolean
    ) => {
      const textMatches = pattern.test(fullAnalysisCorpus);

      const relatedArtifacts = parsedIocs.filter((ioc) => {
        if (extraArtifactFilter) {
          return extraArtifactFilter(ioc);
        }
        const lower = ioc.toLowerCase();

        // 1. Arquivos vazados ou adulterados e hashes (.pdf, .xlsx, .docx, SHA256)
        // Pertencem estritamente a T0089 (Obtain Private Documents) e T0089.003 (Alter Authentic Documents)
        if (techId === 'T0089' || techId === 'T0089.003') {
          return /\.(pdf|xlsx?|docx?|zip|rar|csv)$/i.test(lower) || lower.includes('sha256') || lower.includes('hash');
        }

        // 2. Portais e domínios clonados/falsos (ex: lemonde.ltd, site-auth.com)
        // Pertencem estritamente a T0098.001 (Create Inauthentic News Sites) ou T0143.003 (Impersonated Persona)
        if (techId === 'T0098.001' || techId === 'T0143.003') {
          return (
            !lower.includes('bit.ly') &&
            !lower.includes('t.me') &&
            !lower.startsWith('#') &&
            !/\.(pdf|xlsx?|docx?)$/i.test(lower) &&
            /\.(ltd|news|site|com|org|net|auth|online)\b/i.test(lower)
          );
        }

        // 3. Canais de Mensageria Criptografada / Telegram (t.me/...)
        // Pertencem estritamente a T0155.007 (Encrypted Communication Channel)
        if (techId === 'T0155.007') {
          return lower.includes('t.me') || lower.includes('telegram');
        }

        // 4. Links encurtados de phishing / redirecionamento (bit.ly/...)
        // Pertencem estritamente a T0153.003 (Shortened Link Asset) e T0123 (Offensive Cyberspace Operations)
        if (techId === 'T0153.003' || techId === 'T0123') {
          return lower.includes('bit.ly') || lower.includes('tinyurl') || lower.includes('auth');
        }

        // 5. Hashtags de campanha (#Campanha)
        // Pertencem estritamente a T0015 (Create Hashtags) e T0049.002 (Flood Existing Hashtag)
        if (techId === 'T0015' || techId === 'T0049.002') {
          return lower.startsWith('#');
        }

        // 6. Endereços IPv4 de infraestrutura / botnets
        // Pertencem estritamente a T0093.002 (Acquire Botnets)
        if (techId === 'T0093.002') {
          return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(lower);
        }

        // Técnicas estratégicas, de análise de audiência e conceituais (T0074, T0002, T0003, T0059, T0080, T0072, T0042, etc.)
        // NÃO possuem IOCs técnicos de rede/arquivo associados.
        return false;
      });

      const hasCorroboratingArtifacts = relatedArtifacts.length > 0;

      // Dispara se o padrão textual for confirmado OU houver IOCs inequívocos
      if (textMatches || (hasCorroboratingArtifacts && (techId === 'T0153.003' || techId === 'T0155.007' || techId === 'T0015'))) {
        const official = OFFICIAL_DISARM_TECHNIQUES.find((t) => t.id === techId);
        if (official && !proposals.some((p) => p.technique.id === techId)) {
          proposals.push({
            id: `PROP-${techId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            technique: official,
            severity,
            confidence: hasCorroboratingArtifacts || confidence === 'confirmed' ? 'confirmed' : 'probable',
            rationale,
            extractedProcedureTitle: defaultTitle,
            extractedNote: `Observado no incidente analisado: ${rationale}. Procedimento correlato à tática ${official.tacticName}.`,
            extractedArtifacts: relatedArtifacts,
            selected: true,
          });
        }
      }
    };

    // --- 1. TA01: Plan Strategy ---
    evaluateRule(
      'T0074',
      /\b(objetivos? estrat[eé]gicos?|sabotagem (estrat[eé]gica|informacional|cognitiva)|impacto assim[eé]trico|neutralizar (o programa|a coopera[çc][aã]o|alian[çc]a)|impedir consolida[çc][aã]o|plano estrat[eé]gico de influ[eê]ncia)\b/i,
      'Definição de objetivos finais e direcionamento de impacto estratégico da operação de influência',
      'Definição de Objetivos Estratégicos da Operação',
      'critical',
      'confirmed'
    );

    evaluateRule(
      'T0059',
      /\b(longo prazo|long game|prepara[çc][aã]o prolongada|opera[çc][aã]o continuada por meses|fase preparat[oó]ria prolongada|desgaste prolongado)\b/i,
      'Estratégia de influência com desenvolvimento lento e metódico no ambiente de informação',
      'Operação de Longo Prazo e Preparação de Terreno',
      'medium',
      'probable'
    );

    // --- 2. TA02: Plan Objectives ---
    evaluateRule(
      'T0002',
      /\b(propaganda estatal|m[ií]dia estatal|ve[ií]culos? oficiais? de propaganda|ag[eê]ncia estatal de not[ií]cias|alinhamento com propaganda de estado|canais estatais)\b/i,
      'Amplificação de mensagens e narrativas através de veículos de propaganda estatal do adversário',
      'Alinhamento com Narrativas Estratégicas e Propaganda Estatal',
      'high',
      'probable'
    );

    evaluateRule(
      'T0003',
      /\b(narrativas? (existentes?|preexistentes?)|atritos? hist[oó]ricos?|ressentimentos? hist[oó]ricos?|tens[oõ]es? pr[eé]vias?|fraturas? sociais? preexistentes?)\b/i,
      'Aproveitamento e instrumentalização de atritos históricos ou narrativas pré-existentes',
      'Instrumentalização de Narrativas e Ressentimentos Pré-Existentes',
      'high',
      'confirmed'
    );

    // --- 3. TA13: Target Audience Analysis ---
    evaluateRule(
      'T0080',
      /\b(mapeamento de p[uú]blico|perfilamento de alvos|reconhecimento de alvos|perfilamento de (engenheiros|oficiais|tomadores|especialistas)|osint contra funcion[aá]rios|an[aá]lise de vulnerabilidades de pessoal)\b/i,
      'Mapeamento detalhado e perfilamento de engenheiros, tomadores de decisão e alvos-chave',
      'Mapeamento e Perfilamento de Público-Alvo e Especialistas-Chave',
      'high',
      'confirmed'
    );

    // --- 4. TA06: Develop Content ---
    evaluateRule(
      'T0089',
      /\b(hack-and-leak|hack and leak|exfiltra[çc][aã]o de (dados|documentos|e-mails|arquivos)|vazamento de documentos|arquivos confidenciais vazados|caixas de e-mail invadidas|atas de gest[aã]o exfiltradas)\b/i,
      'Exfiltração cibernética e preparação de pacote de dados vazados para alimentar a operação',
      'Desenvolvimento de Pacote de Dados Vazados (Hack-and-Leak)',
      'critical',
      'confirmed'
    );

    evaluateRule(
      'T0089.003',
      /\b(laudo(s)? adulterado(s)?|documento(s)? adulterado(s)?|planilha(s)? falsificada(s)?|inser[çc][aã]o de cl[aá]usulas falsas|adultera[çc][aã]o de relat[oó]rio|documentos? forjados?|modifica[çc][aã]o maliciosa de arquivo)\b/i,
      'Adulteração cirúrgica de documentos autênticos exfiltrados para inserir alegações forjadas',
      'Adulteração de Documentos Oficiais Autênticos',
      'critical',
      'confirmed'
    );

    evaluateRule(
      'T0087',
      /\b(deepfake[s]?|v[ií]deo(s)? deepfake|áudio(s)? sint[eé]tico(s)?|clonagem de voz|m[ií]dia sint[eé]tica|v[ií]deo forjado com ia)\b/i,
      'Produção de conteúdo multimídia sintético (deepfake) simulando declarações de autoridade',
      'Criação de Mídia Sintética e Vídeos Deepfake',
      'critical',
      'confirmed'
    );

    // --- 5. TA15: Establish Assets ---
    evaluateRule(
      'T0098.001',
      /\b(typosquat(ting)?|portal clonado|portais clonados|site(s)? clonado(s)?|dom[ií]nio(s)? lookalike|c[oó]pia de portal de not[ií]cias|portal falso de not[ií]cias|portais falsos)\b/i,
      'Registro e configuração de domínios typosquatted ou clones de portais legítimos de imprensa e portais corporativos',
      'Criação de Portais Clonados e Domínios Typosquatted',
      'critical',
      'confirmed'
    );

    evaluateRule(
      'T0097',
      /\b(avatar(es)? sint[eé]tico(s)?|rostos? gerados? por ia|stylegan|fotos? de perfil falsa(s)? gerada(s)?|persona(s)? sint[eé]tica(s)?|rosto sint[eé]tico)\b/i,
      'Criação de avatares sintéticos com rostos gerados por redes neurais (IA) para perfis inautênticos',
      'Criação de Personas com Avatares Sintéticos Gerados por IA',
      'high',
      'confirmed'
    );

    evaluateRule(
      'T0093.002',
      /\b(botnet[s]?|enxame de bots|fazenda(s)? de contas|contas automatizadas|disparos? coordenados? de bots|rede de bots|disparos sincronizados de bots)\b/i,
      'Estruturação de rede coordenada de contas automatizadas (bots) para amplificação em redes sociais',
      'Disparo Coordenado via Rede de Contas Automatizadas (Bots)',
      'high',
      'confirmed'
    );

    // --- 6. TA08: Select Channels and Affordances ---
    evaluateRule(
      'T0155.007',
      /\b(telegram|t\.me|canal an[oô]nimo de vazamento|grupo de vazamento no telegram|aplicativo de mensageria criptografada|signal)\b/i,
      'Estabelecimento de canais de mensageria anônimos e criptografados para distribuição do vazamento',
      'Estabelecimento de Canais Anônimos de Vazamento (Telegram)',
      'high',
      'confirmed'
    );

    evaluateRule(
      'T0153.003',
      /\b(link(s)? encurtado(s)?|bit\.ly|tinyurl|url(s)? encurtada(s)?)\b/i,
      'Emprego de plataformas de link shortening para camuflar links maliciosos e monitorar cliques',
      'Uso de Links Encurtados para Camuflagem de Destino',
      'medium',
      'confirmed'
    );

    // --- 7. TA16: Establish Legitimacy ---
    evaluateRule(
      'T0101',
      /\b(selo[s]? azul|selo[s]? de verifica[çc][aã]o (comprado|pago)|badge[s]? de verifica[çc][aã]o|verifica[çc][aã]o comercial)\b/i,
      'Aquisição de selos de verificação em redes sociais para conferir falsa autoridade aos perfis da operação',
      'Aquisição Comercial de Selos de Verificação de Perfil',
      'medium',
      'confirmed'
    );

    evaluateRule(
      'T0045',
      /\b(falso(s)? especialista(s)?|pseudo-especialista[s]?|perito(s)? forjado(s)?|parecer t[eé]cnico forjado|especialista independente forjado)\b/i,
      'Mobilização de pseudo-especialistas para conferir falso endosso técnico às alegações do vazamento',
      'Mobilização de Falsos Especialistas Técnicos',
      'high',
      'probable'
    );

    evaluateRule(
      'T0143.003',
      /\b(impersona[çc][aã]o|se passar por (jornalistas?|ve[ií]culos?|portais?)|usurpa[çc][aã]o de identidade de imprensa|clonagem visual de ve[ií]culo)\b/i,
      'Uso indevido da identidade visual e reputação de veículos legítimos de imprensa e portais de defesa',
      'Impersonificação de Órgãos de Imprensa e Instituições',
      'critical',
      'confirmed'
    );

    // --- 8. TA05: Microtarget ---
    evaluateRule(
      'T0072.004',
      /\b(ad cloaking|cloaking|malvertising|burlar modera[çc][aã]o de an[uú]ncios|an[uú]ncios patrocinados maliciosos)\b/i,
      'Uso de scripts de evasão (ad cloaking) em anúncios patrocinados segmentados para tomadores de decisão',
      'Segmentação Psicográfica e Evasão via Ad Cloaking',
      'high',
      'confirmed'
    );

    evaluateRule(
      'T0072',
      /\b(microtargeting|segmenta[çc][aã]o psicogr[aá]fica|microsegmenta[çc][aã]o de p[uú]blico|direcionamento cir[uú]rgico de an[uú]ncios|perfilamento de audi[eê]ncia)\b/i,
      'Microsegmentação e direcionamento da desinformação para públicos específicos e formadores de opinião',
      'Segmentação de Audiência e Microtargeting Político',
      'high',
      'confirmed'
    );

    // --- 9. TA07: Deliver Content ---
    evaluateRule(
      'T0123',
      /\b(spear-phishing|phishing direcionado|opera[çc][aã]o cibern[eé]tica ofensiva|intrus[aã]o de rede|captura de credenciais|roubo de credenciais via e-mail|e-mail de phishing)\b/i,
      'Emprego de operações cibernéticas ofensivas (spear-phishing, intrusão) para subsidiar a operação de influência',
      'Operações Cibernéticas Ofensivas e Spear-Phishing',
      'critical',
      'confirmed'
    );

    evaluateRule(
      'T0117',
      /\b(atrair a imprensa|atrair jornalistas|pauta para a grande m[ií]dia|cobertura da imprensa tradicional|entregar furo jornal[ií]stico)\b/i,
      'Mobilização de jornalistas tradicionais para lavagem de informação e ampliação de audiência',
      'Seduzir e Atrair Cobertura da Mídia Tradicional',
      'medium',
      'probable'
    );

    // --- 10. TA09 / TA17: Maximise Exposure & Amplify ---
    evaluateRule(
      'T0015',
      /\b(hashtags? coordenadas?|sequestro de hashtags?|cria[çc][aã]o de hashtags?|induzir trending topics?|#[a-zA-Z0-9_]+)\b/i,
      'Criação e indução de hashtags coordenadas para agrupar e disseminar mensagens de impacto na opinião pública',
      'Criação e Propagação de Hashtags de Campanha',
      'medium',
      'confirmed'
    );

    evaluateRule(
      'T0049.002',
      /\b(inunda[çc][aã]o de coment[aá]rios|comment flooding|brigading|inundar (se[çc][oõ]es de )?coment[aá]rios|respostas sincronizadas em perfis oficiais)\b/i,
      'Inundação de seções de comentários e sequestro de fluxos de busca de postagens oficiais',
      'Inundação de Comentários e Sequestro de Fluxos Oficiais',
      'high',
      'confirmed'
    );

    // --- 11. TA18: Drive Online Harms / Coerce ---
    evaluateRule(
      'T0048.004',
      /\b(dox(x)?ing|vazamento de dados pessoais|exposi[çc][aã]o de telefones e endere[çc]os|coa[çc][aã]o psicol[oó]gica|ass[eé]dio a engenheiros|intimida[çc][aã]o de funcion[aá]rios)\b/i,
      'Vazamento malicioso de dados pessoais (doxing) e coação psicológica contra engenheiros e oficiais do projeto',
      'Doxing e Assédio Psicológico a Profissionais do Projeto',
      'critical',
      'confirmed'
    );

    // --- 12. TA11: Persist in the Information Environment ---
    evaluateRule(
      'T0042',
      /\b(meia[s]?-verdade[s]?|mistura de (documentos|dados) reais e falsos|documentos? parcialmente aut[eê]nticos?|combinar fatos ver[ií]dicos com (alega[çc][oõ]es forjadas|mentiras)|camuflar falsifica[çc][aã]o em documentos reais)\b/i,
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
            extractedArtifacts: [],
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
      targetRegions: targetRegions.trim()
        ? targetRegions.split(',').map((r) => r.trim()).filter((r) => r.length > 0)
        : ['Área de Operações'],
      targetSectors: targetSectors.trim()
        ? targetSectors.split(',').map((s) => s.trim()).filter((s) => s.length > 0)
        : ['Governamental, Defesa'],
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
          <div className="p-6 space-y-3.5 flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Case Title */}
            <div className="flex-shrink-0">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Título da Operação / Caso *
              </label>
              <input
                type="text"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#070b12] border border-white/[0.08] text-white focus:outline-none focus:border-sky-500 font-semibold"
                required
              />
            </div>

            {/* Two-Column Grid for Incident Narrative & Raw IOCs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0">
              {/* Left Column (7 cols): Incident Text Context */}
              <div className="lg:col-span-7 flex flex-col h-full min-h-0">
                <div className="flex items-center justify-between mb-1.5 flex-shrink-0">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    Relato do Incidente *
                  </label>
                  <span className="text-slate-500 text-[11px] font-sans">
                    Descreva as etapas, alvos e vetores da operação
                  </span>
                </div>
                <textarea
                  value={incidentText}
                  onChange={(e) => setIncidentText(e.target.value)}
                  className="w-full h-full flex-1 min-h-0 p-3.5 text-xs sm:text-sm rounded-xl bg-[#070b12] border border-white/[0.08] text-white focus:outline-none focus:border-sky-500 font-sans leading-relaxed resize-none"
                  required
                />
              </div>

              {/* Right Column (5 cols): Raw IOCs + Scope Indicator */}
              <div className="lg:col-span-5 flex flex-col h-full min-h-0 space-y-3">
                <div className="flex flex-col flex-1 min-h-0">
                  <div className="flex items-center justify-between mb-1.5 flex-shrink-0">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
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
                    className="w-full h-full flex-1 min-h-0 p-3 text-xs rounded-xl bg-[#070b12] border border-white/[0.08] text-white focus:outline-none focus:border-sky-500 font-mono leading-relaxed resize-none"
                  />

                  {extractionFeedback && (
                    <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono flex items-center gap-1.5 animate-in fade-in flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                      <span>{extractionFeedback}</span>
                    </div>
                  )}
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
                    placeholder="Unidade 404 / País VERMELHO"
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
                    placeholder="País AZUL, Região sob Investigação..."
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
                    placeholder="Defesa, Governamental, Mídia..."
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
