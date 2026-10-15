/**
 * Dicionário e utilitário de tradução para definições oficiais do DISARM Framework.
 * Fornece traduções técnicas padronizadas em Português (PT-BR) para os analistas de CTI e Red Team.
 */

// Limpa tags HTML como <br>, <b>, etc. para apresentação limpa
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

export const DISARM_PORTUGUESE_TRANSLATIONS: Record<string, string> = {
  // Técnicas da Operação Real (DNC & Podesta Hack-and-Leak)
  T0002:
    'Organizar cidadãos e grupos em torno de narrativas pró-Estado. Coordenar equipes pagas ou voluntárias para promover e disseminar propaganda governamental direcionada.',
  
  'T0081.008':
    'Avaliar quais vulnerabilidades estruturais e pontos cegos existem no ecossistema de imprensa e mídia para serem explorados operacionalmente em campanhas de influência.',

  T0083:
    'Integrar vulnerabilidades, sensibilidades e fraturas sócio-políticas do público-alvo (identificadas na fase de análise de audiência) nas narrativas estratégicas da operação.',

  'T0149.003':
    'Domínios registrados com grafia deliberadamente semelhante a domínios legítimos e respeitados (typosquatting ou lookalike), utilizados para enganar usuários, capturar credenciais de acesso ou hospedar conteúdos manipulados.',

  T0123:
    'Controlar o ambiente de informação por meio de operações cibernéticas ofensivas no ciberespaço, incluindo invasão e comprometimento de redes adversárias, exfiltração de dados confidenciais ou derrubada de infraestruturas.',

  T0089:
    'Obter documentos que não estejam publicamente disponíveis, por qualquer meio — legal ou ilegal, com recursos avançados ou limitados. Esses materiais podem incluir documentos autênticos não públicos, documentos autênticos adulterados ou documentos inautênticos forjados para parecerem legítimos. Todos esses tipos de documentos podem ser "vazados" em fases posteriores da operação.',

  'T0149.001':
    'Domínios registrados ou adquiridos pela operação de influência para hospedar conteúdos próprios, direcionar tráfego de usuários ou estabelecer plataformas de autoridade operacional.',

  'T0097.104':
    'Apresentar persona de hacktivista: o operador apresenta-se como um ativista que conduz operações cibernéticas ofensivas ou desenvolve infraestrutura técnica por motivações políticas ou ideológicas, em vez de motivações financeiras comumente atribuídas a cibercriminosos convencionais. Hacktivistas forjados são frequentemente denominados "Faketivists".',

  'T0144.001':
    'Apresentar e operar a persona de forma coordenada em múltiplas plataformas online e redes sociais, construindo uma percepção ampliada de alcance, autenticidade e legitimidade perante o público e os alvos.',

  'T0155.007':
    'Utilizar canais de comunicação com criptografia de ponta a ponta para coordenar agentes, transferir materiais exfiltrados em segurança ou contornar interceptação e vigilância de inteligência.',

  T0117:
    'Atrair a cobertura de veículos de imprensa e canais de notícias tradicionais (rádio, TV, jornais de grande circulação) para amplificar as mensagens da operação e conferir credibilidade e ressonância pública.',

  T0015:
    'Sequestrar a atenção de eventos de grande repercussão, marcos políticos, convenções ou tendências em alta (trending topics) para redirecionar o foco das discussões públicas para as narrativas da operação.',

  'T0093.002':
    'Adquirir ou mobilizar redes de dispositivos comprometidos e contas automatizadas (botnets) para amplificação coordenada artificial, manipulação de seções de comentários e impulsão inautêntica de métricas de engajamento.',

  'T0134.002':
    'Avaliar métricas de engajamento e reação em plataformas de redes sociais para mensurar a taxa de penetração de narrativas, a receptividade do público-alvo e a eficácia operacional global.',

  // Técnicas Gerais Adicionais do DISARM
  T0003:
    'Utilizar ou adaptar temas e narrativas preexistentes no imaginário do público-alvo. Narrativas formam a base da visão de mundo de uma comunidade; mensagens que se apoiam nessas crenças preexistentes são absorvidas com muito mais facilidade e menor resistência crítica.',

  T0074:
    'Definir com clareza o estado final desejado e os objetivos estratégicos a serem alcançados pela operação de manipulação de informação no ambiente informacional.',

  T0098:
    'Criar réplicas inautênticas ou clonadas de portais legítimos de notícias, agências de governo ou organizações de checagem, copiando identidade visual e URLs para disseminar matérias fabricadas com aparência de credibilidade.',

  'T0098.001':
    'Clonar meticulosamente websites de veículos de imprensa respeitados (com layouts, fontes e logos oficiais idênticos) hospedando matérias forjadas para conferir legitimidade institucional à desinformação.',

  T0088:
    'Criar ou manipular mídias sintéticas (áudios deepfake, vídeos alterados ou imagens geradas por inteligência artificial) para atribuir declarações falsas ou forjar situações inexistentes.',

  T0076:
    'Manipular ou distorcer dados quantitativos, estatísticas oficiais, gráficos econômicos ou métricas científicas para sustentar uma narrativa desinformativa.',

  T0097:
    'Adotar diferentes tipos de personas durante operações de influência para adicionar a percepção de autoridade, independência ou representatividade social às atividades e narrativas do ator de ameaça.',

  T0143:
    'Estabelecer a legitimidade de uma persona no ambiente operacional, utilizando elementos visuais, históricos de postagens e interações para disfarçar sua inautenticidade.',

  T0059:
    'Manter presença prolongada e ativos dormentes ("sleeper accounts") no ecossistema digital, sustentando postagens rotineiras e neutras por meses ou anos para serem acionadas em crises futuras.',

  'T0116.001':
    'Publicar comentários inautênticos coordenados em postagens de redes sociais de figuras públicas, ministérios ou órgãos de imprensa para poluir o debate e direcionar a opinião pública.',

  T0118:
    'Distribuir conteúdos através de múltiplos formatos e plataformas audiovisuais emergentes para maximizar a capilaridade viral em segmentos mais jovens da audiência.',
};

/**
 * Retorna a tradução oficial em português se disponível no dicionário,
 * ou aplica formatação limpa e tradução assistida para o texto.
 */
export const getDisarmPortugueseTranslation = (
  techniqueId: string,
  englishDescription: string
): string => {
  if (DISARM_PORTUGUESE_TRANSLATIONS[techniqueId]) {
    return DISARM_PORTUGUESE_TRANSLATIONS[techniqueId];
  }

  // Se não houver tradução direta catalogada, retorna o texto formatado limpo
  return formatCleanText(englishDescription);
};
