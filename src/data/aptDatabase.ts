export interface AptProfile {
  id: string;
  name: string;
  aliases: string[];
  countryOfOrigin: string;
  sponsor: string;
  primaryMotivation: 'Influência Geopolítica & Desestabilização' | 'Espionagem & Hack-and-Leak' | 'Sabotagem & Pânico Social' | 'Interferência Eleitoral';
  typicalSeverity: 'critical' | 'high' | 'medium';
  characteristicTtps: string[]; // List of DISARM technique IDs
  typicalTargetRegions: string[];
  typicalTargetSectors: string[];
  description: string;
  historicalPrecedents: string;
  sourceReferences: string[];
}

export interface AptCorrelationResult {
  apt: AptProfile;
  matchScore: number; // 0 to 100%
  matchedTtps: { id: string; name?: string }[];
  unmatchedTtps: { id: string; name?: string }[];
  attributionConfidence: 'Muito Alta' | 'Alta' | 'Moderada' | 'Baixa';
  rationale: string;
}

export const CTI_APT_DATABASE: AptProfile[] = [
  {
    id: 'APT-SDA-STRUCTURA',
    name: 'Social Design Agency (SDA) / Structura',
    aliases: ['Doppelgänger Group', 'Structura National Technology', 'Operation Matryoshka'],
    countryOfOrigin: 'Federação Russa',
    sponsor: 'Administração Presidencial Russa (Alinhado ao Kremlin)',
    primaryMotivation: 'Influência Geopolítica & Desestabilização',
    typicalSeverity: 'critical',
    characteristicTtps: [
      'T0098.001', // Portais Clonados Inautênticos (Le Monde, Der Spiegel)
      'T0076',     // Distorção & Ad Cloaking no Facebook/Meta
      'T0146.007', // Enxames de Bots com Avatares StyleGAN (IA)
      'T0146.003', // Contas com Selo Azul Comprado (Verified Assets)
      'T0088',     // Áudio Sintético / Clonagem de Voz por IA
      'T0003',     // Exploração de Tensões Sociais e Inflacionárias
      'T0074',     // Diretriz de Desestabilização Europeia
      'T0118',     // Transbordamento Viral para TikTok
      'T0130.002', // Provedores Bulletproof e Proxies de Redirecionamento
      'T0072.004', // Segmentação Psicográfica de Comunidades
      'T0059',     // Contas Dormentes de Longo Prazo
    ],
    typicalTargetRegions: ['União Europeia', 'França', 'Alemanha', 'Ucrânia', 'América Latina', 'Estados Unidos'],
    typicalTargetSectors: ['Mídia & Imprensa', 'Processo Eleitoral', 'Defesa & Forças Armadas', 'Opinião Pública'],
    description:
      'Organização de marketing político e operações de influência sancionada pela União Europeia e EUA. Notória pela campanha transnacional Doppelgänger, clonando meticulosamente mais de 40 portais de grandes jornais mundiais para inserir matérias fabricadas e impulsioná-las com ad cloaking e fazendas de bots.',
    historicalPrecedents: 'Clonagem do Le Monde, Le Figaro, Der Spiegel e Süddeutsche Zeitung documentada pelo VIGINUM francês em 2023-2025.',
    sourceReferences: ['VIGINUM Rapport Doppelgänger', 'EU DisinfoLab', 'Mandiant Threat Intelligence'],
  },
  {
    id: 'APT-UNC1151-GHOSTWRITER',
    name: 'UNC1151 / Ghostwriter',
    aliases: ['Ghostwriter', 'TA445', 'Pushcha'],
    countryOfOrigin: 'Belarus / Federação Russa',
    sponsor: 'Ministério da Defesa de Belarus / Forças Armadas Russas',
    primaryMotivation: 'Sabotagem & Pânico Social',
    typicalSeverity: 'high',
    characteristicTtps: [
      'T0116.001', // Invasão e Publicação Direta em CMS Hackeado de Notícias
      'T0089.003', // Falsificação de Minutas Militares e Assinaturas Oficiais
      'T0089',     // Roubo de Credenciais e Exfiltração de E-mails
      'T0074',     // Fomentar Hostilidade Pública Contra Tropas da OTAN
      'T0015',     // Sequestro e Propagação de Hashtags
      'T0090.003', // Disparo Automatizado em Redes Sociais
    ],
    typicalTargetRegions: ['Polônia', 'Lituânia', 'Letônia', 'Ucrânia', 'Europa Oriental'],
    typicalTargetSectors: ['Defesa & Forças Armadas', 'Governos Regionais', 'Imprensa Local e Rádios'],
    description:
      'Grupo focado em comprometer sistemas de gerenciamento de conteúdo (CMS) de portais de notícias regionais e websites governamentais locais para publicar artigos e cartas forjadas atribuídas a comandantes militares da OTAN, semeando discórdia entre países vizinhos.',
    historicalPrecedents: 'Invasão de portais poloneses e publicação de falsas cartas antimilitaristas documentada pelo CERT da Polônia e Mandiant.',
    sourceReferences: ['Mandiant UNC1151 Ghostwriter Report', 'CERT-PL Incident Response'],
  },
  {
    id: 'APT-APT28-FANCYBEAR',
    name: 'APT28 / Fancy Bear (GRU Unidade 26165)',
    aliases: ['Strontium', 'Sednit', 'Sofacy', 'Pawn Storm', 'Forest Blizzard'],
    countryOfOrigin: 'Federação Russa',
    sponsor: 'GRU (Diretoria Principal de Inteligência do Estado-Maior Russo)',
    primaryMotivation: 'Espionagem & Hack-and-Leak',
    typicalSeverity: 'critical',
    characteristicTtps: [
      'T0089',     // Hack-and-Leak (Exfiltração Massiva de E-mails)
      'T0089.003', // Adulteração Seletiva de Documentos Oficiais Vazados
      'T0090.003', // Criação de Personas Hacktivistas Fictícias (DCLeaks, Guccifer 2.0)
      'T0002',     // Promoção de Narrativas Anti-Ocidentais
      'T0074',     // Interferência em Processos Eleitorais Soberanos
      'T0015',     // Amplificação via Hashtags e Mídias Sociais
      'T0099',     // Clonagem de Portais de Acesso e Webmail Institucional
    ],
    typicalTargetRegions: ['Estados Unidos', 'União Europeia', 'França', 'Alemanha', 'OTAN', 'Ucrânia'],
    typicalTargetSectors: ['Partidos Políticos', 'Comitês Eleitorais', 'Think Tanks de Relações Internacionais', 'Defesa'],
    description:
      'Unidade de ciberguerra militar russa responsável pelas operações de maior impacto geopolítico da última década, combinando intrusões de rede com vazamentos orquestrados e falsificação documental para desacreditar eleições democráticas.',
    historicalPrecedents: 'Vazamentos do Comitê Nacional Democrata (DNC) nos EUA e ataques à campanha eleitoral francesa de 2017.',
    sourceReferences: ['DOJ Indictments GRU Officers', 'CISA Cybersecurity Advisories', 'MITRE ATT&CK Group G0007'],
  },
  {
    id: 'APT-STORM-1516-COPYCOP',
    name: 'Storm-1516 / CopyCop',
    aliases: ['CopyCop', 'Célula MTAC-1516'],
    countryOfOrigin: 'Federação Russa',
    sponsor: 'Centro de Pesquisa de Opinião Pública / Grupos Afiliados ao Kremlin',
    primaryMotivation: 'Interferência Eleitoral',
    typicalSeverity: 'critical',
    characteristicTtps: [
      'T0088',     // Áudio Sintético e Vídeos Deepfake Encenados com Atores
      'T0097',     // Personas Fictícias de Denunciantes (Whistleblowers)
      'T0098.001', // Portais de Notícias Falsos com Nomes de Jornais Locais
      'T0019.002', // Inundação Coordenada em Perfis de Políticos
      'T0118',     // Transbordamento Viral para Redes de Vídeo (TikTok, YouTube)
      'T0003',     // Exploração de Tensões Sociais e Escândalos Sexuais / Financeiros Forjados
    ],
    typicalTargetRegions: ['Estados Unidos', 'Ucrânia', 'Reino Unido', 'França'],
    typicalTargetSectors: ['Processo Eleitoral', 'Lideranças Políticas', 'Congresso / Parlamento'],
    description:
      'Célula especializada na fabricação de falsos "escândalos" através de atores contratados que gravam vídeos mascarados afirmando ser delatores de segredos de Estado, divulgados em falsos jornais de cidades americanas e europeias para forçar repercussão na grande imprensa.',
    historicalPrecedents: 'Mais de 50 vídeos de falsos delatores desmascarados pelo Microsoft Threat Analysis Center (MTAC) em 2024-2025.',
    sourceReferences: ['Microsoft MTAC Special Reports', 'Recorded Future Insikt Group'],
  },
  {
    id: 'APT-PORTAL-KOMBAT',
    name: 'TigerWeb / Portal Kombat (Rede Pravda)',
    aliases: ['Portal Kombat', 'Pravda Network Ecosystem'],
    countryOfOrigin: 'Federação Russa',
    sponsor: 'TigerWeb / Agências de Comunicação da Crimeia e Moscou',
    primaryMotivation: 'Influência Geopolítica & Desestabilização',
    typicalSeverity: 'high',
    characteristicTtps: [
      'T0098.001', // Rede de 193 Portais de Informação Espelhos em Línguas Ocidentais
      'T0090.003', // Automação de RSS Scraping e Tradução por Inteligência Artificial
      'T0015',     // Amplificação Coordenada em Canais de Telegram
      'T0002',     // Re-publicação em Massa de Despachos de Agências Oficiais
      'T0059',     // Manutenção de Redes Dormentes para Ativação Rápida
      'T0130.002', // Infraestrutura Hospedada em Provedores Bulletproof
    ],
    typicalTargetRegions: ['França', 'Alemanha', 'Polônia', 'Espanha', 'União Europeia'],
    typicalTargetSectors: ['Imprensa & Noticiários', 'Motores de Busca (SEO Poisoning)', 'Opinião Pública'],
    description:
      'Infraestrutura maciça de 193 sites clonados (pravda-fr.com, pravda-de.com, pravda-es.com) que republicam notícias locais com parágrafos pró-Kremlin inseridos automaticamente para inundar os motores de busca e o Google Notícias.',
    historicalPrecedents: 'Investigação oficial francesa divulgada pelo VIGINUM em fevereiro de 2024 desarticulando a rede.',
    sourceReferences: ['VIGINUM Rapport Portal Kombat 2024', 'CERT-EU Threat Advisory'],
  },
  {
    id: 'APT-SANDWORM-GRU',
    name: 'Sandworm (GRU Unidade 74455)',
    aliases: ['TeleBots', 'Voodoo Bear', 'BlackEnergy Group', 'Seashell Blizzard'],
    countryOfOrigin: 'Federação Russa',
    sponsor: 'GRU (Diretoria Principal de Inteligência Militar)',
    primaryMotivation: 'Sabotagem & Pânico Social',
    typicalSeverity: 'critical',
    characteristicTtps: [
      'T0089',     // Ciberataques Disruptivos Combinados com Hack-and-Leak
      'T0090.003', // Canais de Telegram Hacktivistas Falsos (ex: CyberBerkut)
      'T0074',     // Ataques Psicológicos a Infraestruturas Críticas
      'T0015',     // Injeção de Hashtags e Mensagens de Pânico
      'T0089.003', // Adulteração de Bancos de Dados Oficiais
    ],
    typicalTargetRegions: ['Ucrânia', 'Polônia', 'Países Bálticos', 'Estados Unidos'],
    typicalTargetSectors: ['Energia & Elétrico', 'Infraestrutura Crítica', 'Defesa', 'Telecomunicações'],
    description:
      'Braço de ciberguerra militar mais agressivo da Rússia, notório por ataques a redes elétricas e uso de personas hacktivistas forjadas no Telegram para amplificar os impactos psicológicos das invasões cibernéticas.',
    historicalPrecedents: 'Ataques NotPetya, sabotagem de subestações de energia na Ucrânia e vazamento de listas de servidores públicos.',
    sourceReferences: ['CISA Joint Advisory Sandworm', 'Mandiant Sandworm Deep Dive'],
  },
  {
    id: 'APT-STORM-0062-MINT',
    name: 'Mint Sandstorm / APT42 (Guarda Revolucionária do Irã)',
    aliases: ['Charming Kitten', 'Phosphorus', 'APT42', 'Yellow Garuda'],
    countryOfOrigin: 'República Islâmica do Irã',
    sponsor: 'Corpo da Guarda Revolucionária Islâmica (IRGC-IO)',
    primaryMotivation: 'Espionagem & Hack-and-Leak',
    typicalSeverity: 'high',
    characteristicTtps: [
      'T0097',     // Personas Sintéticas de Jornalistas e Acadêmicos Internacionais
      'T0089',     // Spear-Phishing Altamente Personalizado e Roubo de E-mails
      'T0003',     // Exploração de Tensões Religiosas e Conflitos Regionais
      'T0098.001', // Portais Clonados de Think Tanks e Fóruns de Relações Internacionais
      'T0074',     // Tentativas de Desacreditar Ativistas e Dissidentes Políticos
    ],
    typicalTargetRegions: ['Israel', 'Estados Unidos', 'Reino Unido', 'Oriente Médio'],
    typicalTargetSectors: ['Think Tanks de Segurança', 'Diplomacia & Embaixadas', 'Dissidentes Políticos', 'Jornalistas'],
    description:
      'Grupo iraniano altamente persistente que cria identidades falsas de jornalistas conceituados (ex: BBC, Washington Post) para conduzir entrevistas falsas com autoridades e coletar dados estratégicos e credenciais de acesso.',
    historicalPrecedents: 'Operações de engenharia social contra especialistas em segurança nuclear e campanhas presidenciais norte-americanas.',
    sourceReferences: ['Microsoft Threat Intelligence IRGC Report', 'Mandiant APT42 Advisory'],
  },
];

/**
 * Correlates observed DISARM techniques with known APT threat actors from CTI databases.
 * Uses Jaccard overlap weighted by signature techniques.
 */
export function correlateTtpWithApts(
  observedTechniqueIds: string[],
  database: AptProfile[] = CTI_APT_DATABASE
): AptCorrelationResult[] {
  if (!observedTechniqueIds || observedTechniqueIds.length === 0) {
    return [];
  }

  const observedSet = new Set(observedTechniqueIds.map((id) => id.toUpperCase().trim()));

  const results: AptCorrelationResult[] = database.map((apt) => {
    const aptTtps = apt.characteristicTtps.map((id) => id.toUpperCase().trim());
    const aptSet = new Set(aptTtps);

    // Find intersection
    const matched = aptTtps.filter((t) => {
      // Direct match or parent match (e.g. T0098 matches T0098.001)
      if (observedSet.has(t)) return true;
      const parentId = t.split('.')[0];
      return Array.from(observedSet).some((obs) => obs === parentId || obs.startsWith(parentId));
    });

    const unmatched = aptTtps.filter((t) => !matched.includes(t));

    // Overlap calculation: relative to APT profile and observed techniques
    const overlapRatio = matched.length / aptTtps.length;
    const precisionRatio = matched.length / observedSet.size;

    // Harmonic F1-like score
    const combinedScore = (overlapRatio * 0.7 + precisionRatio * 0.3) * 100;
    const matchScore = Math.min(99, Math.round(combinedScore));

    let attributionConfidence: 'Muito Alta' | 'Alta' | 'Moderada' | 'Baixa' = 'Baixa';
    if (matchScore >= 75) attributionConfidence = 'Muito Alta';
    else if (matchScore >= 50) attributionConfidence = 'Alta';
    else if (matchScore >= 25) attributionConfidence = 'Moderada';

    const rationale =
      matched.length > 0
        ? `Coincidência técnica observada em ${matched.length} de ${aptTtps.length} TTPs característicos do modus operandi histórico do grupo (incluindo ${matched.slice(0, 3).join(', ')}).`
        : 'Nenhuma sobreposição direta de TTPs registrada no histórico deste grupo.';

    return {
      apt,
      matchScore,
      matchedTtps: matched.map((id) => ({ id })),
      unmatchedTtps: unmatched.map((id) => ({ id })),
      attributionConfidence,
      rationale,
    };
  });

  // Sort descending by matchScore
  return results.sort((a, b) => b.matchScore - a.matchScore);
}
