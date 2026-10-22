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
