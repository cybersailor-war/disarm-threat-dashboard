import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega o arquivo oficial do disarmfoundation.github.io/disarm-navigator/assets/DISARM.json
const jsonPath = path.join(__dirname, '../src/data/DISARM_LIVE.json');
const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

const rawTactics = rawData.objects.filter((o) => o.type === 'x-mitre-tactic');
const rawTechniques = rawData.objects.filter((o) => o.type === 'attack-pattern');

const tacticColors = {
  'plan-strategy': '#38bdf8',
  'plan-objectives': '#0ea5e9',
  'target-audience-analysis': '#0284c7',
  'develop-narratives': '#818cf8',
  'develop-content': '#a855f7',
  'establish-assets': '#c084fc',
  'establish-legitimacy': '#e879f9',
  'microtarget': '#f472b6',
  'select-channels-and-affordances': '#fb7185',
  'conduct-pump-priming': '#f97316',
  'deliver-content': '#fbbf24',
  'maximise-exposure': '#f59e0b',
  'drive-online-harms': '#ef4444',
  'drive-offline-activity': '#dc2626',
  'persist-in-the-information-environment': '#b91c1c',
  'assess-effectiveness': '#10b981',
};

// Ordem exata das 16 colunas do DISARM Navigator oficial
const orderedShortnames = [
  'plan-strategy',
  'plan-objectives',
  'target-audience-analysis',
  'develop-narratives',
  'develop-content',
  'establish-assets',
  'establish-legitimacy',
  'microtarget',
  'select-channels-and-affordances',
  'conduct-pump-priming',
  'deliver-content',
  'maximise-exposure',
  'drive-online-harms',
  'drive-offline-activity',
  'persist-in-the-information-environment',
  'assess-effectiveness',
];

const tactics = orderedShortnames.map((sn, idx) => {
  const rawT = rawTactics.find((t) => t.x_mitre_shortname === sn) || {};
  const extId =
    rawT.external_references?.[0]?.external_id ||
    `TA${String(idx + 1).padStart(2, '0')}`;
  return {
    id: extId,
    name: rawT.name || sn,
    shortname: sn,
    tacticNumber: idx + 1,
    description: (rawT.description || '').replace(/\r?\n/g, ' ').trim(),
    color: tacticColors[sn] || '#38bdf8',
  };
});

const techniques = [];
rawTechniques.forEach((t) => {
  const extRef = t.external_references?.[0] || {};
  const extId = extRef.external_id;
  if (!extId) return;

  const isSub = Boolean(t.x_mitre_is_subtechnique);
  const parentId = isSub ? extId.split('.')[0] : undefined;

  const phase = t.kill_chain_phases?.[0]?.phase_name;
  const tac = tactics.find((tac) => tac.shortname === phase);

  // Link oficial gerado no repositório ativo DISARMFoundation/DISARMframeworks
  const officialUrl =
    extRef.url && extRef.url.includes('DISARMframeworks')
      ? extRef.url
      : `https://github.com/DISARMFoundation/DISARMframeworks/blob/main/generated_pages/techniques/${extId}.md`;

  techniques.push({
    id: extId,
    name: t.name || '',
    description: (t.description || '').replace(/\r?\n/g, ' ').trim(),
    isSubtechnique: isSub,
    parentTechniqueId: parentId,
    tacticId: tac ? tac.id : 'TA01',
    tacticName: tac ? tac.name : 'Plan Strategy',
    tacticShortname: phase || 'plan-strategy',
    url: officialUrl,
  });
});

techniques.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

const tsContent = `// Base Oficial DISARM Foundation (16 Táticas e 391 Técnicas: 103 Top-level + 288 Subtécnicas)
// Sincronizado 1:1 diretamente do live DISARM Navigator (disarmfoundation.github.io/disarm-navigator)

export interface OfficialDisarmTactic {
  id: string;
  name: string;
  shortname: string;
  tacticNumber: number;
  description: string;
  color: string;
}

export interface OfficialDisarmTechnique {
  id: string;
  name: string;
  description: string;
  isSubtechnique: boolean;
  parentTechniqueId?: string;
  tacticId: string;
  tacticName: string;
  tacticShortname: string;
  url: string;
}

export const OFFICIAL_DISARM_TACTICS: OfficialDisarmTactic[] = ${JSON.stringify(tactics, null, 2)};

export const OFFICIAL_DISARM_TECHNIQUES: OfficialDisarmTechnique[] = ${JSON.stringify(techniques, null, 2)};

export const OFFICIAL_TECHNIQUES_MAP: Record<string, OfficialDisarmTechnique> = OFFICIAL_DISARM_TECHNIQUES.reduce(
  (acc, tech) => {
    acc[tech.id] = tech;
    return acc;
  },
  {} as Record<string, OfficialDisarmTechnique>
);
`;

const outputPath = path.join(__dirname, '../src/data/officialDisarmData.ts');
fs.writeFileSync(outputPath, tsContent, 'utf-8');
console.log('Built officialDisarmData.ts successfully from DISARM_LIVE.json:');
console.log(`- Tactics: ${tactics.length}`);
console.log(`- Techniques: ${techniques.length} (${techniques.filter(t => !t.isSubtechnique).length} top-level, ${techniques.filter(t => t.isSubtechnique).length} subs)`);
