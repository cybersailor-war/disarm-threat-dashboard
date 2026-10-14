import {
  DisarmCampaign,
  DisarmNavigatorLayer,
  DisarmTactic,
  DisarmTechnique,
  ThreatSeverity,
} from '../types/disarm';
import { DISARM_TACTICS_MASTER, DISARM_TECHNIQUES_DATABASE } from '../data/disarmMaster';
import { validateDisarmJson, ValidationResult } from '../schema/disarmSchema';

export function calculateSeverityFromScore(score?: number): ThreatSeverity {
  if (score === undefined || score === null) return 'medium';
  if (score >= 90) return 'critical';
  if (score >= 75) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

export function parseDisarmNavigatorLayer(layer: DisarmNavigatorLayer): DisarmCampaign {
  const techniques: DisarmTechnique[] = layer.techniques.map((rawTech) => {
    const master = DISARM_TECHNIQUES_DATABASE[rawTech.techniqueID];
    const severity = calculateSeverityFromScore(rawTech.score);

    if (master) {
      return {
        id: master.id,
        name: master.name,
        tacticId: rawTech.tactic || master.tacticId,
        tacticName: master.tacticName,
        description: master.description,
        adversaryObjective: master.adversaryObjective,
        score: rawTech.score,
        severity,
        isActive: rawTech.enabled !== false,
        color: rawTech.color,
        procedureEvidence: rawTech.comment
          ? {
              id: `PROC-${rawTech.techniqueID}`,
              techniqueId: rawTech.techniqueID,
              title: `Evidência Operacional Mapeada (${rawTech.techniqueID})`,
              operationalNote: rawTech.comment,
              observedArtifacts: rawTech.metadata?.map((m) => `${m.name}: ${m.value}`) || [],
              evidenceUrls: [],
              targetedEntities: [],
              confidence: 'confirmed',
            }
          : undefined,
      };
    }

    const tacticId = rawTech.tactic || 'TA01';
    const tacticMatch = DISARM_TACTICS_MASTER.find((t) => t.id === tacticId);

    return {
      id: rawTech.techniqueID,
      name: `Técnica ${rawTech.techniqueID}`,
      tacticId,
      tacticName: tacticMatch?.name || 'Tática Operacional',
      description: rawTech.comment || 'Técnica DISARM importada do arquivo de camada.',
      adversaryObjective: 'Avançar na operação de coerção informacional.',
      score: rawTech.score,
      severity,
      isActive: rawTech.enabled !== false,
      color: rawTech.color,
      procedureEvidence: rawTech.comment
        ? {
            id: `PROC-${rawTech.techniqueID}`,
            techniqueId: rawTech.techniqueID,
            title: `Anotação de Procedimento (${rawTech.techniqueID})`,
            operationalNote: rawTech.comment,
            observedArtifacts: rawTech.metadata?.map((m) => `${m.name}: ${m.value}`) || [],
            evidenceUrls: [],
            targetedEntities: [],
            confidence: 'probable',
          }
        : undefined,
    };
  });

  const tactics = buildTacticsList(techniques);

  const hasCritical = techniques.some((t) => t.severity === 'critical');
  const hasHigh = techniques.some((t) => t.severity === 'high');
  const overallSeverity: ThreatSeverity = hasCritical ? 'critical' : hasHigh ? 'high' : 'medium';

  return {
    id: `CAMPAIGN-${Date.now()}`,
    name: layer.name || 'Operação Ingerida via DISARM Navigator',
    version: layer.version || '2.0',
    domain: layer.domain || 'disarm',
    threatActor: 'Ator de Ameaça Mapeado no Arquivo',
    campaignStatus: 'Active Ongoing',
    overallSeverity,
    description:
      layer.description ||
      'Camada exportada contendo mapeamento estruturado de Táticas, Técnicas e Procedimentos (TTPs) de acordo com o framework DISARM Foundation.',
    dateCreated: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    targetRegions: ['Global / Regiões Mapeadas'],
    targetSectors: ['Opinião Pública', 'Governamental / Eleitoral'],
    techniques,
    tactics,
    rawSourceType: 'disarm-navigator',
  };
}

export function buildTacticsList(techniques: DisarmTechnique[]): DisarmTactic[] {
  return DISARM_TACTICS_MASTER.map((masterTactic) => {
    const matchedTechniques = techniques.filter(
      (tech) => tech.tacticId === masterTactic.id || tech.tacticName.toLowerCase() === masterTactic.name.toLowerCase()
    );

    return {
      ...masterTactic,
      techniques: matchedTechniques,
    };
  });
}

export function parseUploadedDisarmFile(rawJson: unknown): {
  campaign: DisarmCampaign | null;
  validation: ValidationResult;
} {
  const validation = validateDisarmJson(rawJson);

  if (!validation.isValid || !validation.data) {
    return {
      campaign: null,
      validation,
    };
  }

  if (validation.schemaType === 'disarm-navigator') {
    const campaign = parseDisarmNavigatorLayer(validation.data as DisarmNavigatorLayer);
    return { campaign, validation };
  }

  if (validation.schemaType === 'disarm-custom') {
    const custom = validation.data as any;
    const techniques: DisarmTechnique[] = (custom.techniques || []).map((t: any) => {
      const master = DISARM_TECHNIQUES_DATABASE[t.id];
      const severity: ThreatSeverity = (t.severity as ThreatSeverity) || calculateSeverityFromScore(t.score);
      return {
        id: t.id,
        subtechniqueId: t.subtechniqueId,
        name: t.name || master?.name || `Técnica ${t.id}`,
        tacticId: t.tacticId || master?.tacticId || 'TA01',
        tacticName: t.tacticName || master?.tacticName || 'Tática Operacional',
        description: t.description || master?.description || '',
        adversaryObjective: t.adversaryObjective || master?.adversaryObjective || '',
        score: t.score,
        severity,
        isActive: true,
        procedureEvidence: t.procedureEvidence,
      };
    });

    const tactics = buildTacticsList(techniques);

    const campaign: DisarmCampaign = {
      id: custom.id || `CAMP-${Date.now()}`,
      name: custom.name,
      version: custom.version || '2.0',
      domain: 'disarm',
      threatActor: custom.threatActor || 'Ator Não Atribuído',
      campaignStatus: custom.campaignStatus || 'Active Ongoing',
      overallSeverity: custom.overallSeverity || 'critical',
      description: custom.description || 'Campanha de análise operacional carregada.',
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      targetRegions: custom.targetRegions || ['Global'],
      targetSectors: custom.targetSectors || ['Mídia e Governo'],
      techniques,
      tactics,
      rawSourceType: 'custom-threat-report',
    };

    return { campaign, validation };
  }

  return {
    campaign: null,
    validation: {
      ...validation,
      isValid: false,
      errors: ['Formato de dados não pôde ser transformado em uma campanha DISARM.'],
    },
  };
}

export interface CampaignMetrics {
  totalTechniques: number;
  activeTacticsCount: number;
  totalTactics: number;
  proceduresCount: number;
  totalArtifactsCount: number;
  severityCounts: Record<ThreatSeverity, number>;
  confidenceCounts: {
    confirmed: number;
    probable: number;
    possible: number;
  };
}

export function computeCampaignMetrics(campaign: DisarmCampaign): CampaignMetrics {
  const totalTactics = DISARM_TACTICS_MASTER.length;
  const activeTactics = campaign.tactics.filter((t) => t.techniques.length > 0);
  const activeTacticsCount = activeTactics.length;

  const severityCounts: Record<ThreatSeverity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    informational: 0,
  };

  const confidenceCounts = {
    confirmed: 0,
    probable: 0,
    possible: 0,
  };

  let proceduresCount = 0;
  let totalArtifactsCount = 0;

  campaign.techniques.forEach((tech) => {
    if (tech.severity in severityCounts) {
      severityCounts[tech.severity]++;
    }
    if (tech.procedureEvidence && tech.procedureEvidence.operationalNote) {
      proceduresCount++;
      totalArtifactsCount += tech.procedureEvidence.observedArtifacts?.length || 0;
      if (tech.procedureEvidence.confidence) {
        confidenceCounts[tech.procedureEvidence.confidence]++;
      }
    }
  });

  return {
    totalTechniques: campaign.techniques.length,
    activeTacticsCount,
    totalTactics,
    proceduresCount,
    totalArtifactsCount,
    severityCounts,
    confidenceCounts,
  };
}
