/**
 * Dicionário de Tradução Literal Estrita do DISARM Framework (v1.4 Oficial).
 * 
 * DIRETRIZ DE INTEGRIDADE:
 * As traduções aqui contidas são ESTRITAMENTE LITERAIS (ao pé da letra),
 * preservando a integridade conceitual, os termos técnicos e os exemplos originais
 * estabelecidos pela DISARM Foundation, sem adaptações, paráfrases ou interferências editoriais.
 */

// Limpa tags HTML como <br>, <b>, etc. para apresentação limpa e preserva quebras de linha
export const formatCleanText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?b>/gi, '')
    .replace(/<\/?i>/gi, '')
    .replace(/<\/?p>/gi, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

export const DISARM_LITERAL_TRANSLATIONS: Record<string, string> = {
  // T0002: Facilitate State Propaganda
  // EN: Organise citizens around pro-state messaging. Coordinate paid or volunteer groups to push state propaganda.
  T0002:
    'Organizar cidadãos em torno de mensagens pró-Estado. Coordenar grupos pagos ou voluntários para impulsionar a propaganda do Estado.',

  // T0003: Leverage Existing Narratives
  // EN: Use or adapt existing narrative themes, where narratives are the baseline stories of a target audience...
  T0003:
    'Usar ou adaptar temas de narrativas existentes, onde narrativas são as histórias de base de um público-alvo. As narrativas formam o alicerce de nossas visões de mundo. Novas informações são compreendidas por meio de um processo firmemente fundamentado nesse alicerce. Se uma nova informação não for consistente com as narrativas predominantes de um público, ela será ignorada. Campanhas eficazes enquadrarão sua desinformação no contexto dessas narrativas. Campanhas altamente eficazes farão uso extensivo de arquétipos apropriados ao público e metanarrativas ao longo de suas práticas de criação e amplificação de conteúdo.',

  // T0015: Create Hashtags and Search Artefacts
  // EN: Create one or more hashtags and/or hashtag groups...
  T0015:
    'Criar uma ou mais hashtags e/ou grupos de hashtags. Muitas campanhas baseadas em incidentes criarão hashtags para promover seu evento fabricado. Criar uma hashtag para um incidente pode ter dois efeitos importantes:\n1. Criar uma percepção de realidade em torno de um evento. Certamente apenas eventos "reais" seriam discutidos em uma hashtag. Afinal, o evento tem um nome!, e\n2. Divulgar a história mais amplamente por meio de listas de tendências (trending topics) e comportamento de busca.\nAtivo necessário para direcionar/controlar/gerenciar a "conversa" conectada ao lançamento de novo incidente/campanha com nova hashtag para sites de redes sociais aplicáveis.',

  // T0015.001: Use Existing Hashtag
  'T0015.001':
    'Usar hashtags existentes para promover conteúdo ou narrativas de campanha.',

  // T0015.002: Create New Hashtag
  'T0015.002':
    'Criar uma nova hashtag especificamente para promover um evento ou narrativa fabricada.',

  // T0045: Use Fake Experts
  // EN: Use the fake experts that were set up during Establish Legitimacy...
  T0045:
    'Usar os falsos especialistas que foram estabelecidos durante a fase de Estabelecer Legitimidade. Pseudo-especialistas são ativos descartáveis que frequentemente aparecem uma vez e depois desaparecem. Dar "credibilidade" à desinformação. Tirar proveito do viés de credencial.',

  // T0049.002: Flood Existing Hashtag
  // EN: Hashtags can be used by communities to collate information...
  'T0049.002':
    'Hashtags podem ser usadas por comunidades para agrupar informações que publicam sobre tópicos específicos (como seus interesses ou eventos atuais) e os usuários podem encontrar comunidades para ingressar explorando hashtags de seu interesse.\n\nAtores de ameaça podem inundar uma hashtag existente para tentar arruinar a funcionalidade da hashtag, postando conteúdo não relacionado à hashtag junto a ela, tornando-a uma fonte menos confiável de informação relevante. Eles também podem tentar inundar hashtags existentes com conteúdo da campanha, com a intenção de maximizar a exposição aos usuários.\n\nEsta Técnica cobre casos em que atores de ameaça inundam hashtags existentes com conteúdo de campanha.\n\nEsta Técnica cobre comportamentos anteriormente documentados por T0019.002: Sequestrar Hashtags, que desde então foi descontinuada. Esta Técnica era anteriormente denominada Sequestrar Hashtag Existente.',

  // T0059: Play the Long Game
  // EN: Play the long game refers to two phenomena...
  T0059:
    'Jogar o jogo de longo prazo refere-se a dois fenômenos:\n1. Planejar as mensagens e permitir que elas cresçam organicamente sem conduzir a sua própria amplificação. Isso é metódico e lento, e requer anos para que a mensagem se consolide.\n2. Desenvolver uma série de narrativas de mensagens aparentemente desconectadas que eventualmente se combinam em uma nova narrativa.',

  // T0072.004: Psychographic Segmentation
  // EN: An influence operation may target populations based on psychographic segmentation...
  'T0072.004':
    'Uma operação de influência pode direcionar populações com base na segmentação psicográfica, que utiliza valores do público e processos de tomada de decisão. Uma operação pode coletar individualmente dados psicográficos com suas próprias pesquisas ou ferramentas de coleta, ou comprar externamente dados de empresas de redes sociais ou pesquisas online, como questionários de personalidade.',

  // T0074: Determine Strategic Ends
  // EN: These are the long-term end-states the campaign aims to bring about...
  T0074:
    'Estes são os estados finais de longo prazo que a campanha visa concretizar. Eles tipicamente envolvem uma posição vantajosa vis-à-vis concorrentes em termos de poder ou influência. O objetivo estratégico pode ser melhorar ou simplesmente manter a própria posição. A competição ocorre na esfera pública nos domínios da guerra, diplomacia, política, economia e ideologia, e pode se desenrolar entre grupos armados, estados-nações, partidos políticos, corporações, grupos de interesse ou indivíduos.',

  // T0076: Distort
  // EN: Twist the narrative. Take information, or artefacts like images, and change the framing around them.
  T0076:
    'Distorcer a narrativa. Pegar informações, ou artefatos como imagens, e mudar o enquadramento ao redor deles.',

  // T0081.008: Identify Media System Vulnerabilities
  // EN: An influence operation may exploit existing weaknesses in a target’s media system...
  'T0081.008':
    'Uma operação de influência pode explorar fraquezas existentes no sistema de mídia de um alvo. Essas fraquezas podem incluir vieses existentes entre agências de mídia, vulnerabilidade a agências de notícias falsas nas redes sociais, ou desconfiança existente de fontes de mídia tradicionais. Uma desconfiança existente entre o público na credibilidade do sistema de mídia possui alto potencial de exploração por uma operação de influência ao estabelecer agências de notícias alternativas para disseminar o conteúdo da operação.',

  // T0083: Integrate Target Audience Vulnerabilities into Narrative
  // EN: An influence operation may seek to exploit the preexisting weaknesses, fears, and enemies...
  T0083:
    'Uma operação de influência pode buscar explorar fraquezas, medos e inimigos preexistentes do público-alvo para integração nas narrativas e na estratégia geral da operação. Integrar vulnerabilidades existentes na abordagem operacional conserva recursos ao explorar áreas já enfraquecidas do ambiente de informação do alvo, em vez de forçar a operação a criar novas vulnerabilidades no ambiente.',

  // T0086.002: Develop AI-Generated Images (Deepfakes)
  'T0086.002':
    'Criar e editar imagens falsas ou enganosas geradas com o uso de tecnologias de Inteligência Artificial (IA) para uso em uma campanha de desinformação. Essas imagens também são referidas como "deepfakes", e podem ser usadas para fabricar evidências, personificar indivíduos ou criar conteúdo visual com forte apelo emocional para manipular públicos-alvo.',

  // T0087.001: Develop AI-Generated Videos (Deepfakes)
  'T0087.001':
    'Criar e editar vídeos falsos ou enganosos gerados com o uso de tecnologias de Inteligência Artificial (IA) para uso em uma campanha de desinformação. Esses vídeos também são referidos como "deepfakes".',

  // T0088: Develop Audio-Based Content
  // EN: Creating and editing false or misleading audio artefacts...
  T0088:
    'Criar e editar artefatos de áudio falsos ou enganosos, frequentemente alinhados a uma ou mais narrativas específicas, para uso em uma campanha de desinformação. Isso pode incluir a criação de conteúdo de áudio completamente novo, o reaproveitamento de artefatos de áudio existentes (incluindo cheap fakes) ou o uso de tecnologias de criação e edição de áudio geradas por IA (incluindo deepfakes).',

  // T0088.001: Develop AI-Generated Audio (Deepfakes)
  'T0088.001':
    'Criar e editar áudios falsos ou enganosos gerados com o uso de tecnologias de Inteligência Artificial (IA) para uso em uma campanha de desinformação. Esses áudios também são referidos como "deepfakes".',

  // T0089: Obtain Private Documents
  // EN: Procuring documents that are not publicly available, by whatever means...
  T0089:
    'Obter documentos que não estejam publicamente disponíveis, por qualquer meio — seja legal ou ilegal, com muitos recursos ou menos recursos. Esses documentos podem incluir documentos autênticos não públicos, documentos autênticos não públicos que foram alterados, ou documentos inautênticos com a intenção de parecerem como se fossem documentos autênticos não públicos. Todos esses tipos de documentos podem ser "vazados" durante estágios posteriores da operação.',

  // T0089.001: Obtain Authentic Documents
  'T0089.001':
    'Obter documentos autênticos que não estejam publicamente disponíveis para uso em uma operação de influência.',

  // T0089.003: Alter Authentic Documents
  // EN: Alter authentic documents (public or non-public) to achieve campaign goals...
  'T0089.003':
    'Alterar documentos autênticos (públicos ou não públicos) para atingir os objetivos da campanha. Os documentos alterados têm a intenção de parecerem como se fossem autênticos e podem ser "vazados" durante estágios posteriores da operação.',

  // T0093.002: Acquire Botnets
  // EN: A botnet is a group of bots that can function in coordination with each other.
  'T0093.002':
    'Uma botnet é um grupo de bots que pode funcionar em coordenação entre si.',

  // T0097: Present Persona
  // EN: This Technique contains different types of personas commonly taken on by threat actors during influence operations...
  T0097:
    'Esta Técnica contém diferentes tipos de personas comumente assumidas por atores de ameaça durante operações de influência.\n\nOs analistas devem utilizar as subtécnicas da T0097 para documentar o tipo de persona que uma conta está apresentando. Por exemplo, uma conta que se descreve como sendo um jornalista pode ser marcada com T0097.102: Persona de Jornalista.\n\nPersonas apresentadas por indivíduos incluem:\nT0097.100: Persona Individual\nT0097.101: Persona Local\nT0097.102: Persona de Jornalista\nT0097.103: Persona de Ativista\nT0097.104: Persona de Hacktivista\nT0097.105: Persona de Pessoal Militar\nT0097.106: Persona de Recrutador\nT0097.107: Persona de Pesquisador\nT0097.108: Persona de Especialista\nT0097.109: Persona de Pretendente Romântico\nT0097.110: Persona de Dirigente Partidário\nT0097.111: Persona de Autoridade Governamental\nT0097.112: Persona de Funcionário do Governo\n\nEsta Técnica também abriga personas institucionais comumente assumidas por atores de ameaça:\nT0097.200: Persona Institucional\nT0097.201: Persona de Instituição Local\nT0097.202: Persona de Veículo de Notícias\nT0097.203: Persona de Organização de Checagem de Fatos\nT0097.204: Persona de Think Tank\nT0097.205: Persona de Empresa Comercial\nT0097.206: Persona de Instituição Governamental\nT0097.207: Persona de ONG\nT0097.208: Persona de Causa Social\n\nAo usar uma persona, um ator de ameaça está adicionando a legitimidade percebida da persona às suas narrativas e atividades.',

  // T0097.100: Individual Persona
  'T0097.100':
    'Apresentar uma persona como um indivíduo comum para conduzir atividades de influência com apelo de cidadão comum.',

  // T0097.102: Journalist Persona
  'T0097.102':
    'Apresentar uma persona como jornalista para conferir credibilidade de apuração e investigação às informações disseminadas.',

  // T0097.103: Activist Persona
  'T0097.103':
    'Apresentar uma persona como ativista engajado em causas sociais, políticas ou ambientais para mobilizar públicos e legitimar reivindicações.',

  // T0097.104: Hacktivist Persona
  // EN: A person with a hacktivist persona presents themselves as an activist who conducts offensive cyber operations...
  'T0097.104':
    'Uma pessoa com uma persona de hacktivista se apresenta como um ativista que conduz operações cibernéticas ofensivas ou constrói infraestrutura técnica para propósitos políticos, em vez de motivações financeiras comumente atribuídas a hackers; hacktivistas são ativistas hackers que utilizam seu conhecimento técnico para realizar ação política. Hacktivistas podem construir infraestrutura técnica para apoiar outros ativistas, incluindo canais de comunicação seguros e evasão de vigilância e censura. Eles também podem conduzir ataques DDOS e outras operações cibernéticas ofensivas, com o objetivo de derrubar ativos digitais ou obter acesso a informações proprietárias. Uma operação de influência pode utilizar personas de hacktivistas para apoiar suas narrativas operacionais e legitimar suas atividades operacionais. Hacktivistas fabricados são por vezes referidos como "Faketivists".\n\nTécnicas e Subtécnicas Associadas:\nT0097.103: Persona de Ativista: Os analistas devem usar esta subtécnica para catalogar casos em que um indivíduo está se apresentando como alguém engajado em ativismo, mas não se apresenta utilizando ferramentas e métodos técnicos para alcançar seus objetivos.',

  // T0098: Establish Inauthentic News Sites
  // EN: Modern computational propaganda makes use of a cadre of imposter news sites...
  T0098:
    'A propaganda computacional moderna faz uso de um conjunto de sites de notícias impostores que se espalham globalmente. Esses sites, por vezes motivados por preocupações que não a propaganda — por exemplo, receita baseada em cliques —, frequentemente possuem alguns marcadores superficiais de autenticidade, tais como nomenclatura e design do site. Mas muitos podem ser rapidamente desmascarados com referência à sua propriedade, histórico de reportagens e detalhes de publicidade.',

  // T0098.001: Create Inauthentic News Sites
  // EN: Create Inauthentic News Sites
  'T0098.001':
    'Criar Sites de Notícias Inautênticos.',

  // T0116.001: Post Inauthentic Social Media Comment
  // EN: Use government-paid social media commenters, astroturfers, chat bots...
  'T0116.001':
    'Usar comentaristas de redes sociais pagos pelo governo, astroturfers ou chatbots (programados para responder a palavras-chave/hashtags específicas) para influenciar conversas online, avaliações de produtos e fóruns de comentários em websites.',

  // T0117: Attract Traditional Media
  // EN: Deliver content by attracting the attention of traditional media (earned media).
  T0117:
    'Entregar conteúdo atraindo a atenção da mídia tradicional (mídia espontânea / earned media).',

  // T0118: Amplify Existing Narrative
  // EN: An influence operation may amplify existing narratives that align with its narratives to support operation objectives.
  T0118:
    'Uma operação de influência pode amplificar narrativas existentes que se alinhem com as suas narrativas para apoiar os objetivos da operação.',

  // T0123: Control Information Environment through Offensive Cyberspace Operations
  // EN: Controlling the information environment through offensive cyberspace operations uses cyber tools and techniques...
  T0123:
    'Controlar o ambiente de informação por meio de operações ofensivas no ciberespaço utiliza ferramentas e técnicas cibernéticas para alterar a trajetória de conteúdo no espaço de informação, seja para priorizar as mensagens da operação ou para bloquear as mensagens da oposição.',

  // T0134.002: Social Media Engagement
  // EN: Monitor and evaluate social media engagement in misinformation incidents.
  'T0134.002':
    'Monitorar e avaliar o engajamento em redes sociais em incidentes de desinformação.',

  // T0143: Persona Legitimacy
  // EN: This Technique contains sub-techniques which analysts can use to assert whether an account is presenting...
  T0143:
    'Esta Técnica contém subtécnicas que os analistas podem usar para afirmar se uma conta está apresentando uma persona autêntica, fabricada ou de paródia:\n\nT0143.001: Persona Autêntica\nT0143.002: Persona Fabricada\nT0143.003: Persona Personificada\nT0143.004: Persona de Paródia',

  // T0143.001: Authentic Persona
  'T0143.001':
    'Uma persona autêntica é uma conta real pertencente e operada pela pessoa ou entidade representada.',

  // T0143.002: Fabricated Persona
  'T0143.002':
    'Uma persona fabricada é uma persona fictícia construída artificialmente com identidade forjada para operações de influência.',

  // T0143.003: Impersonated Persona
  'T0143.003':
    'Uma persona personificada assume fraudulentamente a identidade de uma pessoa ou organização real existente.',

  // T0143.004: Parody Persona
  'T0143.004':
    'Uma persona de paródia imita uma figura pública ou entidade sob pretexto de sátira ou humor.',

  // T0144.001: Present Persona across Platforms
  // EN: This sub-technique covers situations where analysts have identified the same persona being presented across multiple platforms...
  'T0144.001':
    'Esta subtécnica cobre situações em que analistas identificaram a mesma persona sendo apresentada em múltiplas plataformas.\n\nTer múltiplas contas apresentando a mesma persona não é um indicador de comportamento inautêntico; muitas pessoas criam contas e se apresentam como elas mesmas em múltiplas plataformas. No entanto, é sabido que atores de ameaça apresentam a mesma persona em múltiplas plataformas, beneficiando-se de um aumento na legitimidade percebida.',

  // T0149.001: Domain Asset
  // EN: A Domain is a web address (such as “google[.]com”)...
  'T0149.001':
    'Um Domínio é um endereço da web (como "google[.]com"), utilizado para navegar até Websites na internet. Domínios diferem de Websites no sentido de que Websites são considerados páginas web desenvolvidas que hospedam conteúdo, ao passo que Domínios não necessariamente hospedam conteúdo web voltado ao público. Um ator de ameaça pode registrar um novo domínio para contornar o bloqueio do domínio antigo.',

  // T0149.003: Lookalike Domain
  // EN: A Lookalike Domain is a Domain which is visually similar to another Domain...
  'T0149.003':
    'Um Domínio Semelhante (Lookalike Domain) é um domínio visualmente similar a outro domínio, com o potencial de que usuários da web confundam um domínio com o outro.\n\nAtores de ameaça que desejam se passar por websites de organizações têm sido observados utilizando uma variedade de métodos de personificação de domínio. Por exemplo, atores que desejam criar um domínio personificando netflix.com podem utilizar métodos como typosquatting (ex: n3tflix.com), combosquatting (ex: netflix-billing.com) ou troca de TLD (ex: netflix.top).',

  // T0155.007: Encrypted Communication Channel
  // EN: Some online platforms support encrypted communication between platform users...
  'T0155.007':
    'Algumas plataformas online suportam comunicação criptografada entre usuários da plataforma, por exemplo as Plataformas de Chat Telegram e Signal.',
};

/**
 * Retorna a tradução literal estrita em português se disponível no catálogo oficial,
 * ou null caso não haja tradução literal catalogada para a técnica.
 */
export const getDisarmPortugueseTranslation = (
  techniqueId: string,
  englishDescription: string
): { text: string; isLiteralCataloged: boolean } => {
  if (DISARM_LITERAL_TRANSLATIONS[techniqueId]) {
    return {
      text: DISARM_LITERAL_TRANSLATIONS[techniqueId],
      isLiteralCataloged: true,
    };
  }

  // Se não houver tradução literal catalogada, retorna o texto canônico limpo
  return {
    text: formatCleanText(englishDescription),
    isLiteralCataloged: false,
  };
};
