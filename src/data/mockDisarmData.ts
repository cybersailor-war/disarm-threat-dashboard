import { DisarmCampaign } from '../types/disarm';
import { DISARM_TECHNIQUES_DATABASE } from './disarmMaster';

/**
 * Operação Real e Histórica Documentada de Hacking for Influence:
 * Operação Grizzly Steppe / DNC & Podesta Hack-and-Leak (2016)
 * Atribuída pelo Departamento de Justiça dos EUA (DOJ Indictment 1:18-cr-00215-ABJ),
 * Comitê de Inteligência do Senado dos EUA (SSCI Vol. 2) e CISA/FBI.
 */
export const REAL_CAMPAIGN_DNC_HACK_LEAK: DisarmCampaign = {
  id: 'CAMP-REAL-HFI-2016-DNC',
  name: 'Operação Grizzly Steppe: DNC & Podesta Hack-and-Leak (Guccifer 2.0 & DCLeaks)',
  version: '2.0',
  domain: 'disarm-redteam',
  threatActor: 'APT28 (Fancy Bear / Unidade 26165 GRU) & Unidade 74455 GRU (Federação Russa)',
  campaignStatus: 'Historical',
  overallSeverity: 'critical',
  description:
    'Caso real e canônico de Hacking for Influence (Hack-and-Leak conduzido pelo serviço militar de inteligência russo GRU) durante o ciclo eleitoral presidencial dos Estados Unidos em 2016. A operação integrou intrusão cibernética ofensiva via spear-phishing e implantação de malwares Sofacy/X-Agent nos servidores do DNC/DCCC, roubo de credenciais da conta pessoal de John Podesta, exfiltração de mais de 50.000 e-mails confidenciais, forja da persona hacktivista "Guccifer 2.0" e do portal dcleaks.com, e vazamentos sincronizados com momentos-chave de campanha via WikiLeaks e grande imprensa.',
  dateCreated: '2016-03-15T09:00:00Z',
  lastUpdated: '2016-11-08T23:59:00Z',
  targetRegions: ['Estados Unidos', 'Washington D.C.'],
  targetSectors: ['Processo Eleitoral Presidencial', 'Partidos Políticos (DNC/DCCC)', 'Mídia & Imprensa Investigativa', 'Opinião Pública'],
  rawSourceType: 'disarm-navigator',
  techniques: [
    {
      ...DISARM_TECHNIQUES_DATABASE['T0002'],
      severity: 'critical',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HFI-001',
        techniqueId: 'T0002',
        title: 'Diretriz Estratégica Governamental de Desestabilização Eleitoral',
        operationalNote:
          'Oficiais de alta patente da inteligência militar russa (GRU - Unidades Militares 26165 e 74455) receberam diretrizes governamentais explícitas para planejar e executar operações cibernéticas ofensivas combinadas com medidas ativas de influência psicológica para aprofundar polarizações sócio-políticas e enfraquecer a confiança pública no sistema democrático ocidental.',
        observedArtifacts: [
          'DOJ Indictment 1:18-cr-00215-ABJ (Grand Jury Mueller Report)',
          'Relatório Bipartidário do Comitê de Inteligência do Senado dos EUA (SSCI Vol. 2)'
        ],
        evidenceUrls: [
          'https://www.justice.gov/opa/pr/grand-jury-indicts-12-russian-intelligence-officers-hacking-offenses-related-to-2016-presidential',
          'https://www.intelligence.senate.gov/sites/default/files/documents/Report_Volume2.pdf'
        ],
        targetedEntities: ['Eleitorado norte-americano', 'Sistema político e institucional dos EUA'],
        confidence: 'confirmed',
        dateObserved: '2016-03-15',
        analyst: 'Relatório Conjunto de Inteligência CTI & Red Team DISARM'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0081.008'],
      severity: 'high',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HFI-002',
        techniqueId: 'T0081.008',
        title: 'Mapeamento da Voracidade do Ciclo de Notícias de 24h e Correspondentes Políticos',
        operationalNote:
          'Os operadores mapearam as fragilidades estruturais da imprensa de Washington, identificando que redações digitais e colunistas de bastidores priorizam a velocidade e o furo jornalístico sobre a checagem rigorosa da proveniência ilícita de materiais vazados.',
        observedArtifacts: [
          'Mapeamento de jornalistas investigativos (The Smoking Gun, Motherboard, Gawker)',
          'Dossiê de Vulnerabilidade do Ciclo Noticioso Político'
        ],
        evidenceUrls: ['https://www.intelligence.senate.gov/sites/default/files/documents/Report_Volume2.pdf'],
        targetedEntities: ['Jornalistas e repórteres do ecossistema político de Washington'],
        confidence: 'confirmed',
        dateObserved: '2016-03-22',
        analyst: 'Especialista em Ecossistemas Midiáticos'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0083'],
      severity: 'high',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HFI-003',
        techniqueId: 'T0083',
        title: 'Exploração de Tensões e Fraturas Internas no Partido Democrata',
        operationalNote:
          'A exploração narrativa foi calibrada para explorar o ressentimento entre a ala progressista (apoiadores de Bernie Sanders) e o establishment partidário (Hillary Clinton), selecionando trechos de e-mails de dirigentes partidários do DNC que sugeriam favoritismo e desdém contra a candidatura insurgente.',
        observedArtifacts: [
          'Compilação de e-mails internos do DNC classificados por potencial de fricção interna',
          'Campanhas de hashtags dirigidas #DNCGate e #BernieWasRobbed'
        ],
        evidenceUrls: ['https://www.dni.gov/files/documents/ICA_2017_01.pdf'],
        targetedEntities: ['Apoiadores democratas independentes', 'Delegados da Convenção Partidária'],
        confidence: 'confirmed',
        dateObserved: '2016-04-10',
        analyst: 'Analista de Estratégia Narrativa e Dinâmicas Eleitorais'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0149.003'],
      severity: 'critical',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HFI-004',
        techniqueId: 'T0149.003',
        title: 'Spear-Phishing com Domínio Falso Google Lookalike contra John Podesta',
        operationalNote:
          'Em 19 de março de 2016, operadores da Unidade 26165 enviaram e-mail de falso alerta de segurança a John Podesta com link encurtado bit.ly/1WvD74X mascarando o domínio malicioso myaccount.google.com-securitysettingpage[.]info. A vítima inseriu suas credenciais, concedendo aos operadores russos acesso total à sua caixa postal com mais de 50.000 mensagens privadas.',
        observedArtifacts: [
          'Domínio Phishing: myaccount.google.com-securitysettingpage.info',
          'Encurtador Bit.ly (conta russa "hirsh_arm")',
          'E-mail com remetente forjado: no-reply@accounts.googlesupport.com'
        ],
        evidenceUrls: ['https://www.justice.gov/file/1080281/download'],
        targetedEntities: ['John Podesta (Presidente de Campanha)', 'Equipe de Finanças e Relações Governamentais'],
        confidence: 'confirmed',
        dateObserved: '2016-03-19',
        analyst: 'Unidade de Inteligência de Ameaças Cibernéticas (CTI)'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0123'],
      severity: 'critical',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HFI-005',
        techniqueId: 'T0123',
        title: 'Invasão Cibernética Ofensiva da Rede do DNC/DCCC com Malwares Sofacy e X-Agent',
        operationalNote:
          'Operadores da Unidade 26165 do GRU penetraram na rede corporativa do Comitê de Campanha Congressional Democrata (DCCC) e do DNC em abril de 2016. Foram implantados keyloggers e o backdoor X-Agent (Sofacy), além do utilitário X-Tunnel para extrair tráfego e controlar remotamente estações de trabalho e servidores Exchange.',
        observedArtifacts: [
          'Implante X-Agent (MD5: 7c5d984cfb72183e8b4e3e3b33df1b80)',
          'Servidor de Comando e Controle (C2) IP 176.31.112.70',
          'Dump de análise de memória CrowdStrike Falcon'
        ],
        evidenceUrls: [
          'https://www.crowdstrike.com/blog/bears-in-the-midst-intrusion-democratic-national-committee/',
          'https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-296a'
        ],
        targetedEntities: ['Servidores Exchange do DNC', 'Estações de trabalho do DCCC'],
        confidence: 'confirmed',
        dateObserved: '2016-04-18',
        analyst: 'Perito Forense de Resposta a Incidentes (DFIR)'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0089'],
      severity: 'critical',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HFI-006',
        techniqueId: 'T0089',
        title: 'Exfiltração e Compactação de dezenas de Gigabytes de Dados Confidenciais',
        operationalNote:
          'Operadores da Unidade 74455 do GRU compactaram gigabytes de e-mails, listas de doadores e memorandos estratégicos dos servidores invadidos em arquivos RAR protegidos por senha (ex: 70850.rar) e os exfiltraram via túneis SSL seguros para servidores arrendados na Europa.',
        observedArtifacts: [
          'Volume criptografado de exfiltração: 70850.rar (5.2 GB de correspondências .eml)',
          'Tráfego anômalo na porta 443 direcionado ao IP 185.86.151.11'
        ],
        evidenceUrls: ['https://www.justice.gov/file/1080281/download'],
        targetedEntities: ['Comitê Nacional Democrata (DNC)', 'Comitê Financeiro Partidário'],
        confidence: 'confirmed',
        dateObserved: '2016-04-22',
        analyst: 'Analista de Forense em Redes & Tráfego Exfiltrado'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0149.001'],
      severity: 'high',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HFI-007',
        techniqueId: 'T0149.001',
        title: 'Aquisição do Domínio dcleaks.com com Bitcoins Lavados pela Unidade 74455',
        operationalNote:
          'Em 19 de abril de 2016, a Unidade 74455 do GRU registrou o domínio dcleaks[.]com usando o serviço de proxy PrivacyProtect na Malásia. O pagamento da hospedagem e registro foi feito em frações de Bitcoin mineradas e operadas pelos próprios militares russos para impedir a atribuição bancária.',
        observedArtifacts: [
          'Histórico WHOIS de dcleaks.com (PrivacyProtect.org)',
          'Transação Bitcoin na blockchain: carteira 1E18vy2L... vinculada ao GRU'
        ],
        evidenceUrls: ['https://www.justice.gov/file/1080281/download'],
        targetedEntities: ['Infraestrutura pública de vazamentos independentes'],
        confidence: 'confirmed',
        dateObserved: '2016-04-19',
        analyst: 'Perito Forense de Rastreamento em Blockchain & OSINT'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0097.104'],
      severity: 'critical',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HFI-008',
        techniqueId: 'T0097.104',
        title: 'Criação da Persona Hacktivista Forjada "Guccifer 2.0" para Falsificar Atribuição',
        operationalNote:
          'Após o anúncio público da CrowdStrike identificando a autoria russa na invasão em junho de 2016, o GRU criou no dia seguinte a persona forjada "Guccifer 2.0", alegando ser um hacktivista independente da Romênia. Uma falha de segurança operacional (OPSEC) revelou acessos sem VPN com IP associado diretamente ao complexo do GRU em Moscou, além de metadados em língua russa ("Феликс Эдмундович") nos documentos em Word vazados.',
        observedArtifacts: [
          'Blog WordPress: guccifer2.wordpress.com',
          'Documento "DNC-confidential-memo.docx" com autor russo nos metadados',
          'Log de conexão sem VPN da sede do GRU na rua Komsomolsky em Moscou'
        ],
        evidenceUrls: [
          'https://www.justice.gov/file/1080281/download',
          'https://www.mandiant.com/resources/apt28-at-the-center-of-the-storm'
        ],
        targetedEntities: ['Comunidade internacional de CTI', 'Imprensa e opinião pública global'],
        confidence: 'confirmed',
        dateObserved: '2016-06-15',
        analyst: 'Especialista em Atribuição de Ameaças Estatais (APTs)'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0144.001'],
      severity: 'high',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HFI-009',
        techniqueId: 'T0144.001',
        title: 'Presença Cruzada da Persona Guccifer 2.0 e DCLeaks em Múltiplas Plataformas',
        operationalNote:
          'A persona forjada operava de maneira coordenada em perfis no Twitter (@Guccifer_2 e @DCleaks), no blog WordPress oficial e em canais de mensageria direta, mantendo consistência de tom, identidade visual e links cruzados para simular autenticidade perante repórteres.',
        observedArtifacts: [
          'Conta do Twitter @Guccifer_2 (ID 743118942004240384)',
          'Feed RSS e diretórios públicos de arquivos no portal dcleaks.com'
        ],
        evidenceUrls: ['https://www.justice.gov/file/1080281/download'],
        targetedEntities: ['Usuários de redes sociais', 'Jornalistas investigativos'],
        confidence: 'confirmed',
        dateObserved: '2016-06-20',
        analyst: 'Analista de Identidade Digital e Personas Operacionais'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0155.007'],
      severity: 'high',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HFI-010',
        techniqueId: 'T0155.007',
        title: 'Transferência Criptografada de Dados Exfiltrados para a Organização WikiLeaks',
        operationalNote:
          'Em meados de julho de 2016, operadores da Unidade 74455 estabeleceram canais criptografados via Twitter DMs e túneis VPN utilizando chaves PGP com a organização WikiLeaks. Foi transferido um lote de 1 Gigabyte contendo milhares de e-mails internos do DNC com instruções de cronograma de publicação.',
        observedArtifacts: [
          'Conversas em DMs criptografadas entre @Guccifer_2 e @wikileaks',
          'Arquivo protegido por chave PGP transferido via VPN com saída na Alemanha'
        ],
        evidenceUrls: ['https://www.justice.gov/file/1080281/download'],
        targetedEntities: ['Redação editorial da WikiLeaks', 'Mídia internacional'],
        confidence: 'confirmed',
        dateObserved: '2016-07-14',
        analyst: 'Perito Forense de Criptografia & Canais Ocultos'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0117'],
      severity: 'critical',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HFI-011',
        techniqueId: 'T0117',
        title: 'Alavancagem e Sedução da Grande Imprensa com Furos Exclusivos de Dados Hackeados',
        operationalNote:
          'Os operadores russos enviaram e-mails e mensagens diretas oferecendo acessos antecipados e senhas exclusivas de diretórios do dcleaks[.]com a jornalistas de veículos prestigiados como The Smoking Gun, Motherboard/Vice, Gawker e The Wall Street Journal, transformando a imprensa investigativa em vetor involuntário de difusão da operação.',
        observedArtifacts: [
          'Mensagens DMs de @Guccifer_2 oferecendo pastas de documentos de campanhas',
          'Matérias de capa publicadas na grande imprensa com documentos do dcleaks.com'
        ],
        evidenceUrls: ['https://www.justice.gov/file/1080281/download'],
        targetedEntities: ['Redações de jornais de circulação nacional e portais de notícias'],
        confidence: 'confirmed',
        dateObserved: '2016-07-18',
        analyst: 'Analista de Ecossistema Midiático'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0015'],
      severity: 'critical',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HFI-012',
        techniqueId: 'T0015',
        title: 'Liberação Sincronizada com a Convenção Democrata e Debates Presidenciais',
        operationalNote:
          'Os vazamentos foram calibrados com precisão cirúrgica: 19.252 e-mails do DNC foram liberados pela WikiLeaks em 22 de julho de 2016, 72 horas antes da abertura da Convenção Democrata na Filadélfia, forçando a renúncia da presidente do comitê. Em 7 de outubro de 2016, 33 minutos após a revelação da fita de áudio do candidato republicano, a WikiLeaks iniciou a publicação diária contínua dos e-mails de John Podesta, recapturando e dominando o ciclo de notícias de 24 horas até a votação.',
        observedArtifacts: [
          'Cronologia comparativa dos lotes de vazamento vs eventos de campanha de 2016',
          'Picos de buscas no Google Trends e menções no Twitter'
        ],
        evidenceUrls: ['https://www.cisa.gov/sites/default/files/publications/tactics-of-disinformation_508.pdf'],
        targetedEntities: ['Convenção Nacional Democrata', 'Audiências de debates presidenciais'],
        confidence: 'confirmed',
        dateObserved: '2016-07-22',
        analyst: 'Especialista em Cronologia de Operações de Influência'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0093.002'],
      severity: 'high',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HFI-013',
        techniqueId: 'T0093.002',
        title: 'Amplificação por Redes Automatizadas (Botnets) da Internet Research Agency (IRA)',
        operationalNote:
          'Em paralelo à intrusão cibernética do GRU, a Internet Research Agency (IRA / Project Lakhta de São Petersburgo) mobilizou fazendas de milhares de bots automatizados e contas inautênticas no Twitter e Facebook para retweetar os vazamentos e forçar hashtags como #DNCLeak, #PodestaEmails e #Guccifer2 nos trending topics mundiais.',
        observedArtifacts: [
          'Dataset do Twitter de operações atribuídas à Federação Russa (Twitter Transparency)',
          'Mais de 3.800 contas inautênticas coordenadas identificadas pelo comitê do Senado'
        ],
        evidenceUrls: ['https://www.intelligence.senate.gov/sites/default/files/documents/Report_Volume2.pdf'],
        targetedEntities: ['Algoritmos de trending topics das redes sociais', 'Eleitores em swing states'],
        confidence: 'confirmed',
        dateObserved: '2016-07-24',
        analyst: 'Perito em Comportamento Inautêntico Coordenado (CIB)'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0134.002'],
      severity: 'medium',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HFI-014',
        techniqueId: 'T0134.002',
        title: 'Monitoramento Contínuo de Métricas de Engajamento e Repercussão Eleitoral',
        operationalNote:
          'Avaliação periódica do alcance orgânico, volume de retuítes das postagens de Guccifer 2.0, número de downloads dos arquivos brutos no DCLeaks e frequência de citações nas sabatinas de domingo da grande imprensa americana, subsidiando o ritmo dos próximos lotes.',
        observedArtifacts: [
          'Planilhas de mensuração de KPI de cobertura de imprensa e impacto de audiência',
          'Relatório de Desempenho de Campanha de Informação'
        ],
        evidenceUrls: ['https://www.dni.gov/files/documents/ICA_2017_01.pdf'],
        targetedEntities: ['Metrificação de impacto em eleitores e mídia'],
        confidence: 'confirmed',
        dateObserved: '2016-10-15',
        analyst: 'Analista de Avaliação de Eficácia & Impacto Estratégico'
      }
    }
  ],
  tactics: []
};

export const SAMPLE_NAVIGATOR_LAYER_JSON = {
  name: 'DISARM Layer - DNC & Podesta Hack-and-Leak (Grizzly Steppe / APT28)',
  version: '2.0',
  domain: 'disarm-redteam',
  description:
    'Camada oficial no formato padrão DISARM Navigator mapeando o caso real de Hacking for Influence (APT28 / GRU)',
  techniques: [
    {
      techniqueID: 'T0002',
      score: 90,
      color: '#ef4444',
      comment: 'Facilitate State Propaganda - Diretriz Estratégica do GRU',
      enabled: true
    },
    {
      techniqueID: 'T0123',
      score: 95,
      color: '#dc2626',
      comment: 'Offensive Cyberspace Operations - Invasão Sofacy/X-Agent',
      enabled: true
    },
    {
      techniqueID: 'T0149.003',
      score: 95,
      color: '#dc2626',
      comment: 'Lookalike Domain - Phishing John Podesta',
      enabled: true
    },
    {
      techniqueID: 'T0089',
      score: 95,
      color: '#dc2626',
      comment: 'Obtain Private Documents - Exfiltração de e-mails do DNC',
      enabled: true
    },
    {
      techniqueID: 'T0097.104',
      score: 95,
      color: '#dc2626',
      comment: 'Hacktivist Persona - Guccifer 2.0',
      enabled: true
    },
    {
      techniqueID: 'T0117',
      score: 90,
      color: '#ef4444',
      comment: 'Attract Traditional Media - Sedução de jornalistas com furos',
      enabled: true
    },
    {
      techniqueID: 'T0015',
      score: 95,
      color: '#dc2626',
      comment: 'Event & Trend Hijacking - Liberação sincronizada',
      enabled: true
    },
    {
      techniqueID: 'T0093.002',
      score: 85,
      color: '#f97316',
      comment: 'Acquire Botnets - Amplificação por bots da IRA',
      enabled: true
    }
  ]
};
