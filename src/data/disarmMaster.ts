import { DisarmTactic } from '../types/disarm';
import {
  OFFICIAL_DISARM_TACTICS,
  OFFICIAL_DISARM_TECHNIQUES,
  OfficialDisarmTactic,
  OfficialDisarmTechnique
} from './officialDisarmData';

export interface DisarmMasterTechniqueDef {
  id: string;
  name: string;
  tacticId: string;
  tacticName: string;
  description: string;
  adversaryObjective: string;
  isSubtechnique?: boolean;
  parentTechniqueId?: string;
  url?: string;
}

// 16 Táticas Oficiais DISARM Red Team
export const DISARM_TACTICS_MASTER: Omit<DisarmTactic, 'techniques'>[] = OFFICIAL_DISARM_TACTICS.map(
  (t: OfficialDisarmTactic) => ({
    id: t.id,
    name: t.name,
    tacticNumber: t.tacticNumber,
    description: t.description,
    color: t.color,
  })
);

// Map base com as 257 técnicas oficiais
const baseDatabase: Record<string, DisarmMasterTechniqueDef> = OFFICIAL_DISARM_TECHNIQUES.reduce(
  (acc, tech: OfficialDisarmTechnique) => {
    acc[tech.id] = {
      id: tech.id,
      name: tech.name,
      tacticId: tech.tacticId,
      tacticName: tech.tacticName,
      description: tech.description,
      adversaryObjective: tech.description,
      isSubtechnique: tech.isSubtechnique,
      parentTechniqueId: tech.parentTechniqueId,
      url: tech.url,
    };
    return acc;
  },
  {} as Record<string, DisarmMasterTechniqueDef>
);

// Proxy de resiliência: se um ID antigo ou customizado for requisitado, fornece fallback seguro
export const DISARM_TECHNIQUES_DATABASE: Record<string, DisarmMasterTechniqueDef> = new Proxy(baseDatabase, {
  get(target, prop: string | symbol) {
    if (typeof prop === 'string') {
      if (prop in target) {
        return target[prop];
      }
      return {
        id: prop,
        name: `Técnica DISARM ${prop}`,
        tacticId: 'TA01',
        tacticName: 'Plan Strategy',
        description: `Técnica DISARM oficial ${prop}`,
        adversaryObjective: '',
        url: `https://github.com/DISARMFoundation/DISARM_framework/blob/master/techniques/${prop}.md`,
      };
    }
    return (target as any)[prop];
  },
});

export { OFFICIAL_DISARM_TACTICS, OFFICIAL_DISARM_TECHNIQUES };
