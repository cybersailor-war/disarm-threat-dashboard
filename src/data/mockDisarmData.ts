import { DisarmCampaign } from '../types/disarm';
import { DISARM_TECHNIQUES_DATABASE } from './disarmMaster';

/**
 * Operação Real e Histórica Documentada de Hacking for Influence:
 * Iranian State Actors Conduct Cyber Operations Against the Government of Albania (HomeLand Justice)
 * Fonte Oficial: CISA & FBI Joint Cybersecurity Advisory (AA22-264A) & Microsoft Threat Intelligence (DEV-0861 /Polonium / MOIS).
 */
export const REAL_CAMPAIGN_ALBANIA_HOMELAND_JUSTICE: DisarmCampaign = {
  id: 'CAMP-REAL-HFI-2022-ALBANIA-HJ',
  name: 'Iranian State Actors Conduct Cyber Operations Against the Government of Albania (HomeLand Justice)',
  version: '2.0',
  domain: 'disarm-redteam',
  threatActor: 'Atores Estatais Iranianos (MOIS / DEV-0861) sob a Persona "HomeLand Justice"',
  campaignStatus: 'Historical',
  overallSeverity: 'critical',
  description:
    'Operação coordenada de Hacking for Influence conduzida por atores estatais iranianos (Ministério de Inteligência e Segurança do Irã - MOIS) contra o Governo da Albânia em julho de 2022 (documentada no alerta conjunto CISA/FBI AA22-264A). Após 14 meses de acesso persistente na rede governamental albanesa (AKSHI / portal e-Albania) explorando vulnerabilidades do Microsoft SharePoint e Exchange, os operadores combinaram ataques destrutivos (ransomware RoadSweep e wiper ZeroCleare) com uma campanha de influência psicológica sob a persona hacktivista forjada "HomeLand Justice". O grupo lançou o portal dedicado homelandjustice[.]ru e canais no Telegram para vazar gigabytes de documentos governamentais exfiltrados, e-mails de ministros e dados pessoais de cidadãos (doxing), além de difundir vídeos e hashtags (#HomeLandJustice, #Maneuver_of_Conquerors) visando intimidar a população e paralisar a decisão governamental albanesa.',
  dateCreated: '2022-07-18T08:00:00Z',
  lastUpdated: '2022-09-23T18:00:00Z',
  targetRegions: ['Albânia', 'Tirana', 'OTAN / Balcãs'],
  targetSectors: ['Serviços Públicos Digitais (e-Albania / AKSHI)', 'Governo e Parlamento Albanês', 'Opinião Pública'],
  rawSourceType: 'disarm-navigator',
  techniques: [
    {
      ...DISARM_TECHNIQUES_DATABASE['T0002'],
      severity: 'critical',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HJ-001',
        techniqueId: 'T0002',
        title: 'Diretriz Estatal de Coerção Geopolítica contra o Governo da Albânia',
        operationalNote:
          'Atores vinculados ao Estado iraniano (MOIS) planejaram e executaram uma operação híbrida combinando sabotagem cibernética de serviços públicos essenciais (portal e-Albania) e campanha de influência para coagir o governo albanês a cancelar a Cúpula Mundial do Irã Livre (MEK) em Durrës e corroer a confiança dos cidadãos na segurança do Estado.',
        observedArtifacts: [
          'CISA / FBI Joint Cybersecurity Advisory AA22-264A',
          'Relatório Microsoft Threat Intelligence Center (MSTIC) sobre DEV-0861'
        ],
        evidenceUrls: [
          'https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-264a'
        ],
        targetedEntities: ['Governo da Albânia', 'Agência Nacional para a Sociedade da Informação (AKSHI)'],
        confidence: 'confirmed',
        dateObserved: '2022-07-17',
        analyst: 'Analista CTI / CISA AA22-264A'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0123'],
      severity: 'critical',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HJ-002',
        techniqueId: 'T0123',
        title: 'Intrusão Cibernética Ofensiva na Rede AKSHI e Implantação de RoadSweep / ZeroCleare',
        operationalNote:
          'Os operadores obtiveram acesso inicial cerca de 14 meses antes do ataque explorando servidores vulneráveis (CVE-2019-0604 no SharePoint e CVE-2021-26855 ProxyLogon no Exchange), mantendo persistência via web shells (.aspx) e ferramentas de acesso remoto antes de acionar o ransomware RoadSweep e o wiper destrutivo ZeroCleare com o banner político da HomeLand Justice.',
        observedArtifacts: [
          'Ransomware RoadSweep e Wiper ZeroCleare (CISA AA22-264A)',
          'Web shells ASPX em servidores governamentais albaneses',
          'Banner de bloqueio de tela exigindo "Why should our taxes be spent on the benefit of DURRES terrorists?"'
        ],
        evidenceUrls: [
          'https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-264a'
        ],
        targetedEntities: ['Infraestrutura Governamental e-Albania (AKSHI)', 'Servidores Microsoft Exchange e SharePoint'],
        confidence: 'confirmed',
        dateObserved: '2022-07-18',
        analyst: 'Equipe de Resposta a Incidentes CISA / FBI'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0089'],
      severity: 'critical',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HJ-003',
        techniqueId: 'T0089',
        title: 'Exfiltração de Documentos Governamentais, E-mails Ministeriais e Dados de Cidadãos',
        operationalNote:
          'Durante os meses de acesso furtivo à rede governamental albanesa, os atores estatais exfiltraram grandes volumes de correspondências oficiais do gabinete do Primeiro-Ministro, registros policiais, dados do sistema TIMS de controle de fronteiras e documentos confidenciais de segurança nacional para municiar a campanha de vazamentos.',
        observedArtifacts: [
          'Arquivos compactados contendo dumps de caixas postais governamentais (.pst / .rar)',
          'Registros exfiltrados do sistema fronteiriço TIMS e portal e-Albania'
        ],
        evidenceUrls: [
          'https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-264a'
        ],
        targetedEntities: ['Gabinete do Primeiro-Ministro da Albânia', 'Ministério do Interior e Polícia Estatal'],
        confidence: 'confirmed',
        dateObserved: '2022-07-18',
        analyst: 'Perito Forense Digital (DFIR)'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0097.104'],
      severity: 'critical',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HJ-004',
        techniqueId: 'T0097.104',
        title: 'Criação da Persona Hacktivista Forjada "HomeLand Justice" (Falsa Bandeira Doméstica)',
        operationalNote:
          'Para ocultar o patrocínio estatal iraniano e simular uma revolta popular interna, o MOIS fabricou a persona hacktivista "HomeLand Justice", apresentando-se falsamente como um grupo de cidadãos nacionalistas albaneses indignados com a corrupção governamental e com o abrigo concedido a dissidentes estrangeiros.',
        observedArtifacts: [
          'Identidade visual e logotipo "HomeLand Justice"',
          'Manifestos políticos redigidos em albanês e inglês atribuindo o ataque a "cidadãos locais"'
        ],
        evidenceUrls: [
          'https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-264a'
        ],
        targetedEntities: ['Opinião pública albanesa', 'Imprensa nacional e internacional'],
        confidence: 'confirmed',
        dateObserved: '2022-07-19',
        analyst: 'Analista de Operações de Influência & Atribuição'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0149.001'],
      severity: 'high',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HJ-005',
        techniqueId: 'T0149.001',
        title: 'Registro e Operação do Portal Dedicado de Vazamentos homelandjustice.ru',
        operationalNote:
          'Os operadores registraram o domínio dedicado homelandjustice[.]ru para hospedar os lotes de documentos exfiltrados, vídeos de reivindicação do ataque cibernético e comunicados contra o governo albanês, servindo como repositório central da operação de Hack-and-Leak.',
        observedArtifacts: [
          'Domínio de vazamento: homelandjustice[.]ru',
          'Repositórios públicos de arquivos governamentais vazados'
        ],
        evidenceUrls: [
          'https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-264a'
        ],
        targetedEntities: ['Jornalistas, pesquisadores e cidadãos albaneses'],
        confidence: 'confirmed',
        dateObserved: '2022-07-21',
        analyst: 'Analista de Infraestrutura de Ameaças (OSINT)'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0094'],
      severity: 'high',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HJ-006',
        techniqueId: 'T0094',
        title: 'Disseminação Massiva e Coordenação via Canal no Telegram (@HomeLandJustice)',
        operationalNote:
          'Após a derrubada de perfis em redes sociais convencionais, a campanha concentrou sua distribuição em canais do Telegram operados pela persona HomeLand Justice, utilizando enquetes interativas para perguntar aos seguidores "de qual político ou instituição devemos vazar os dados agora?", gamificando o vazamento para maximizar o engajamento.',
        observedArtifacts: [
          'Canal Telegram: t.me/HomeLandJustice',
          'Vídeos de captura de tela da invasão aos servidores governamentais publicados no Telegram'
        ],
        evidenceUrls: [
          'https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-264a'
        ],
        targetedEntities: ['Usuários do Telegram nos Balcãs', 'Mídia local albanesa'],
        confidence: 'confirmed',
        dateObserved: '2022-07-23',
        analyst: 'Especialista em Monitoramento de Mídias Sociais'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0048.004'],
      severity: 'critical',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HJ-007',
        techniqueId: 'T0048.004',
        title: 'Doxing Sistemático de Autoridades Governamentais, Policiais e Cidadãos',
        operationalNote:
          'A operação publicou listas contendo números de identidade pessoal (NID), números de telefone, salários, placas de veículos e registros de entrada e saída do país de autoridades albanesas, ex-chefes de polícia e milhares de cidadãos, gerando temor coletivo, constrangimento institucional e pressão política direta sobre o Estado.',
        observedArtifacts: [
          'Planilhas PDF/XLSX com dados pessoais e números de telefone de servidores públicos e cidadãos',
          'Vazamento de e-mails e documentos de identidade de autoridades do governo'
        ],
        evidenceUrls: [
          'https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-264a'
        ],
        targetedEntities: ['Autoridades governamentais, agentes de segurança e população civil da Albânia'],
        confidence: 'confirmed',
        dateObserved: '2022-08-05',
        analyst: 'Analista de Proteção de Dados & Ameaças Híbridas'
      }
    },
    {
      ...DISARM_TECHNIQUES_DATABASE['T0093.002'],
      severity: 'high',
      isActive: true,
      procedureEvidence: {
        id: 'PROC-HJ-008',
        techniqueId: 'T0093.002',
        title: 'Amplificação Coordenada por Bots e Contas Inautênticas nas Redes Sociais',
        operationalNote:
          'Contas automatizadas e perfis inautênticos recém-criados responderam de forma coordenada às postagens oficiais de ministérios e veículos de imprensa da Albânia, espalhando links para o portal homelandjustice[.]ru e promovendo hashtags como #HomeLandJustice e #Maneuver_of_Conquerors.',
        observedArtifacts: [
          'Hashtags coordenadas: #HomeLandJustice, #Maneuver_of_Conquerors',
          'Rede de bots respondendo sincronizadamente a perfis governamentais no Twitter/X'
        ],
        evidenceUrls: [
          'https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-264a'
        ],
        targetedEntities: ['Debate público digital na Albânia', 'Perfis oficiais de imprensa e governo'],
        confidence: 'confirmed',
        dateObserved: '2022-07-25',
        analyst: 'Analista de Comportamento Inautêntico Coordenado (CIB)'
      }
    }
  ],
  tactics: []
};

export const SAMPLE_NAVIGATOR_LAYER_JSON = {
  name: 'DISARM Layer - Iranian State Actors vs Government of Albania (HomeLand Justice / AA22-264A)',
  version: '2.0',
  domain: 'disarm-redteam',
  description:
    'Camada oficial no formato DISARM Navigator mapeando a operação de Hacking for Influence contra o Governo da Albânia (HomeLand Justice)',
  techniques: [
    {
      techniqueID: 'T0002',
      score: 95,
      color: '#dc2626',
      comment: 'Facilitate State Propaganda - Diretriz Estatal Iraniana (MOIS)',
      enabled: true
    },
    {
      techniqueID: 'T0123',
      score: 95,
      color: '#dc2626',
      comment: 'Offensive Cyberspace Operations - Intrusão AKSHI + RoadSweep/ZeroCleare',
      enabled: true
    },
    {
      techniqueID: 'T0089',
      score: 95,
      color: '#dc2626',
      comment: 'Obtain Private Documents - Exfiltração e-Albania e TIMS',
      enabled: true
    },
    {
      techniqueID: 'T0097.104',
      score: 95,
      color: '#dc2626',
      comment: 'Hacktivist Persona - Persona forjada HomeLand Justice',
      enabled: true
    },
    {
      techniqueID: 'T0149.001',
      score: 90,
      color: '#ef4444',
      comment: 'Acquire Domain - Portal de vazamentos homelandjustice.ru',
      enabled: true
    },
    {
      techniqueID: 'T0094',
      score: 90,
      color: '#ef4444',
      comment: 'Chat Apps - Disseminação no canal Telegram @HomeLandJustice',
      enabled: true
    },
    {
      techniqueID: 'T0048.004',
      score: 95,
      color: '#dc2626',
      comment: 'Doxing - Exposição de dados pessoais de autoridades e cidadãos',
      enabled: true
    },
    {
      techniqueID: 'T0093.002',
      score: 85,
      color: '#f97316',
      comment: 'Acquire Botnets - Amplificação #HomeLandJustice',
      enabled: true
    }
  ]
};
