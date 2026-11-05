/**
 * Extrator Inteligente de Artefatos & Indicadores de Comprometimento (IOCs)
 * Analisa relatos de inteligência desestruturados e extrai automaticamente:
 * - URLs e links encurtados (bit.ly, t.me, https, etc.)
 * - Domínios e hostnames (incluindo desofuscação de [.] ou (.))
 * - Endereços IPv4
 * - Hashes criptográficos (SHA256, MD5, SHA1)
 * - Nomes de arquivos suspeitos/adulterados (.pdf, .xlsx, .docx, .zip, etc.)
 * - Hashtags (#Campanha)
 */

export interface ExtractedIocsResult {
  all: string[];
  urls: string[];
  domains: string[];
  ips: string[];
  hashes: string[];
  files: string[];
  hashtags: string[];
}

export function extractIocsFromText(rawText: string): ExtractedIocsResult {
  if (!rawText || !rawText.trim()) {
    return {
      all: [],
      urls: [],
      domains: [],
      ips: [],
      hashes: [],
      files: [],
      hashtags: [],
    };
  }

  // Desofuscação comum de analistas de segurança cibernética (refang)
  // e.g. "hxxp://" -> "http://", "portal[.]com" -> "portal.com"
  const refanged = rawText
    .replace(/hxxps?:\/\//gi, (m) => (m.toLowerCase().startsWith('hxxps') ? 'https://' : 'http://'))
    .replace(/\[\.\]|\(\.\)|\{\.\}/g, '.')
    .replace(/\[:\]|\(:\)/g, ':');

  const urls: string[] = [];
  const domains: string[] = [];
  const ips: string[] = [];
  const hashes: string[] = [];
  const files: string[] = [];
  const hashtags: string[] = [];

  // 1. Extração de URLs (com http/https ou atalhos t.me / bit.ly / tinyurl)
  const urlRegex = /(?:https?:\/\/[^\s"'<>,;()[\]]+|(?:t\.me|bit\.ly|tinyurl\.com|goo\.gl)\/[^\s"'<>,;()[\]]+)/gi;
  let match: RegExpExecArray | null;
  while ((match = urlRegex.exec(refanged)) !== null) {
    const cleanUrl = match[0].replace(/[.,;:)]+$/, '');
    if (!urls.includes(cleanUrl)) {
      urls.push(cleanUrl);
    }
  }

  // 2. Extração de IPv4
  const ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
  while ((match = ipRegex.exec(refanged)) !== null) {
    const ip = match[0];
    if (!ips.includes(ip)) {
      ips.push(ip);
    }
  }

  // 3. Extração de Hashes (SHA-256: 64 hex, SHA-1: 40 hex, MD5: 32 hex)
  const hashRegex = /\b(?:SHA-?256:\s*)?([a-fA-F0-9]{64})\b|\b(?:SHA-?1:\s*)?([a-fA-F0-9]{40})\b|\b(?:MD5:\s*)?([a-fA-F0-9]{32})\b/gi;
  while ((match = hashRegex.exec(refanged)) !== null) {
    const h = match[1] || match[2] || match[3];
    if (h && !hashes.includes(h) && !urls.some((u) => u.includes(h))) {
      hashes.push(h);
    }
  }

  // 4. Extração de Nomes de Arquivos Técnicos/Adulterados
  const fileRegex = /\b[\w.-]+\.(?:pdf|xlsx?|docx?|pptx?|zip|rar|7z|tar|gz|exe|dll|sh|bat|apk|iso|vbs|csv|txt)\b/gi;
  while ((match = fileRegex.exec(refanged)) !== null) {
    const filename = match[0];
    if (!files.includes(filename) && !urls.some((u) => u.includes(filename))) {
      files.push(filename);
    }
  }

  // 5. Extração de Hashtags
  const hashtagRegex = /#[a-zA-Z0-9_À-ÿ]+/g;
  while ((match = hashtagRegex.exec(refanged)) !== null) {
    const tag = match[0];
    if (!hashtags.includes(tag)) {
      hashtags.push(tag);
    }
  }

  // 6. Extração de Domínios
  const domainRegex = /\b(?:[a-zA-Z0-9-]+\.)+(?:com|org|net|gov|mil|edu|io|info|ltd|ai|br|de|ru|fr|cn|uk|tech|online|news|site|app|live|xyz|tv|me|co)\b/gi;
  while ((match = domainRegex.exec(refanged)) !== null) {
    const dom = match[0].toLowerCase();
    // Excluir se já faz parte de URL capturada ou é um arquivo
    const isFile = files.some((f) => f.toLowerCase() === dom);
    const inUrl = urls.some((u) => u.toLowerCase().includes(dom));
    if (!domains.includes(dom) && !isFile && !inUrl) {
      domains.push(dom);
    }
  }

  // Lista consolidada única
  const allSet = new Set<string>();
  urls.forEach((u) => allSet.add(u));
  domains.forEach((d) => allSet.add(d));
  ips.forEach((i) => allSet.add(i));
  hashes.forEach((h) => allSet.add(h.length === 64 ? `SHA256: ${h}` : h));
  files.forEach((f) => allSet.add(f));
  hashtags.forEach((h) => allSet.add(h));

  return {
    all: Array.from(allSet),
    urls,
    domains,
    ips,
    hashes,
    files,
    hashtags,
  };
}

export interface ExtractedIncidentMetadata {
  threatActor?: string;
  targetRegions?: string;
  targetSectors?: string;
}

/**
 * Extrator Contextual de Metadados da Operação / Incidente
 * Infere a partir da narrativa textual:
 * - Ator de Ameaça (ex: Unidade 404, País VERMELHO, APTs, grupos estatais)
 * - Regiões-Alvo (ex: País AZUL, países específicos, regiões geográficas)
 * - Setores / Instituições Alvo (ex: Defesa / Naval, Energia Nuclear, Parlamento, Mídia)
 */
export function extractIncidentMetadata(text: string): ExtractedIncidentMetadata {
  if (!text || !text.trim()) {
    return {};
  }

  // 1. Detecção do Ator de Ameaça (Threat Actor)
  let threatActor = '';
  const actorMatches: string[] = [];
  if (/\bunidade\s*404\b/i.test(text)) actorMatches.push('Unidade 404');
  if (/pa[ií]s\s*vermelho/i.test(text)) actorMatches.push('País VERMELHO');
  if (/homeland\s*justice/i.test(text)) actorMatches.push('HomeLand Justice');
  if (/guccifer/i.test(text)) actorMatches.push('Guccifer 2.0');
  if (/sandworm/i.test(text)) actorMatches.push('Sandworm');
  if (/fancy\s*bear/i.test(text)) actorMatches.push('Fancy Bear (APT28)');
  if (/cozy\s*bear/i.test(text)) actorMatches.push('Cozy Bear (APT29)');
  if (/lazarus/i.test(text)) actorMatches.push('Lazarus Group');
  if (/\bapt[- ]?28\b/i.test(text) && !actorMatches.some((a) => a.includes('APT28'))) actorMatches.push('APT28');
  if (/\bapt[- ]?29\b/i.test(text) && !actorMatches.some((a) => a.includes('APT29'))) actorMatches.push('APT29');
  if (/\bapt[- ]?41\b/i.test(text)) actorMatches.push('APT41');
  const stormMatch = text.match(/\b(storm-\d{4})\b/i);
  if (stormMatch) actorMatches.push(stormMatch[1].toUpperCase());

  if (actorMatches.length > 0) {
    threatActor = Array.from(new Set(actorMatches)).join(' / ');
  } else {
    const explicitActor = text.match(/(?:ator(?: de ameaça)?|advers[áa]rio|grupo|amea[çc]a)\s*:\s*([^\n,.]+)/i);
    if (explicitActor && explicitActor[1]) {
      threatActor = explicitActor[1].trim();
    }
  }

  // 2. Detecção de Regiões-Alvo (Target Regions)
  const regionMatches: string[] = [];
  // Países fictícios de cenários de defesa / jogos de guerra
  if (/pa[ií]s\s*azul/i.test(text)) regionMatches.push('País AZUL');
  if (/pa[ií]s\s*branco/i.test(text) && !/alvo.*pa[ií]s\s*branco/i.test(text)) {
    if (!/pa[ií]s\s*azul/i.test(text)) {
      regionMatches.push('País BRANCO');
    }
  }
  if (/pa[ií]s\s*amarelo/i.test(text)) regionMatches.push('País AMARELO');
  if (/pa[ií]s\s*verde/i.test(text)) regionMatches.push('País VERDE');

  // Países e regiões reais
  if (/\bbrasil\b/i.test(text)) regionMatches.push('Brasil');
  if (/\bam[eé]rica latina\b/i.test(text)) regionMatches.push('América Latina');
  if (/\bam[eé]rica do sul\b/i.test(text)) regionMatches.push('América do Sul');
  if (/\balb[aâ]nia\b/i.test(text)) regionMatches.push('Albânia');
  if (/\bucr[aâ]nia\b/i.test(text)) regionMatches.push('Ucrânia');
  if (/\br[uú]ssia\b/i.test(text) && !actorMatches.includes('Rússia')) regionMatches.push('Rússia');
  if (/\bestados unidos\b|\beua\b/i.test(text)) regionMatches.push('Estados Unidos');
  if (/\btaiwan\b/i.test(text)) regionMatches.push('Taiwan');
  if (/\buni[aã]o europ[eé]ia\b|\beuropa\b/i.test(text)) regionMatches.push('Europa');
  if (/\boriente m[eé]dio\b/i.test(text)) regionMatches.push('Oriente Médio');

  const targetRegions = Array.from(new Set(regionMatches)).join(', ');

  // 3. Detecção de Setores / Instituições Alvo (Target Sectors)
  const sectors: string[] = [];
  if (/\b(estaleiro|naval|submarino|marinha|navio|dgsn)\b/i.test(text)) {
    sectors.push('Defesa / Setor Naval');
  } else if (/\b(defesa|militar|for[çc]as armadas|ex[eé]rcito|aeron[aá]utica)\b/i.test(text)) {
    sectors.push('Defesa & Forças Armadas');
  }

  if (/\b(nuclear|propuls[aã]o nuclear|radiol[oó]g\w*|reator)\b/i.test(text)) {
    sectors.push('Energia / Propulsão Nuclear');
  } else if (/\b(energia|el[eé]tric\w*|petr[oó]leo|pr[eé]-sal|plataforma|offshore)\b/i.test(text)) {
    sectors.push('Energia & Infraestrutura');
  }

  if (/\b(parlamento|deputad\w*|senad\w*|congress\w*)\b/i.test(text)) {
    sectors.push('Governamental / Parlamento');
  } else if (/\b(governo|minist[eé]rio|presid[eê]ncia|executivo|servi[çc]os p[uú]blicos)\b/i.test(text)) {
    sectors.push('Governamental / Serviços Públicos');
  }

  if (/\b(imprensa|jornalis\w*|m[ií]dia|redaa?[çc][aã]o|ve[ií]culo de not[ií]cia)\b/i.test(text)) {
    sectors.push('Mídia & Imprensa');
  }

  if (/\b(cabos? submarinos?|telecom\w*|comunica[çc][oõ]es globais|infraestrutura de rede)\b/i.test(text)) {
    sectors.push('Comunicações & Infraestrutura Crítica');
  }

  if (/\b(elei[çc][oõ]es|eleitoral|eleitores|vota[çc][aã]o)\b/i.test(text)) {
    sectors.push('Processo Eleitoral');
  }

  const targetSectors = Array.from(new Set(sectors)).join(', ');

  return {
    threatActor: threatActor || undefined,
    targetRegions: targetRegions || undefined,
    targetSectors: targetSectors || undefined,
  };
}
