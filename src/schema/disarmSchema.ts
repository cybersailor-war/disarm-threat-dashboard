import { z } from 'zod';

export const NavigatorMetadataItemSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const NavigatorTechniqueSchema = z.object({
  techniqueID: z.string(),
  tactic: z.string().optional(),
  score: z.number().optional(),
  color: z.string().optional(),
  comment: z.string().optional(),
  enabled: z.boolean().optional(),
  metadata: z.array(NavigatorMetadataItemSchema).optional(),
  showSubtechniques: z.boolean().optional(),
});

export const DisarmNavigatorLayerSchema = z.object({
  name: z.string().optional().default('Camada DISARM'),
  version: z.string().optional().default('2.0'),
  domain: z.string().optional().default('disarm'),
  description: z.string().optional().default(''),
  filters: z
    .object({
      stages: z.array(z.string()).optional(),
      platforms: z.array(z.string()).optional(),
    })
    .optional(),
  techniques: z.array(NavigatorTechniqueSchema),
  gradient: z
    .object({
      colors: z.array(z.string()).optional(),
      minValue: z.number().optional(),
      maxValue: z.number().optional(),
    })
    .optional(),
  legendItems: z
    .array(
      z.object({
        label: z.string(),
        color: z.string(),
      })
    )
    .optional(),
  metadata: z.array(NavigatorMetadataItemSchema).optional(),
});

// Comprehensive Campaign Schema for rich JSON threat analysis
export const DisarmCustomCampaignSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  version: z.string().optional().default('2.0'),
  threatActor: z.string().optional().default('Desconhecido / Ator Estatal Não-Atribuído'),
  campaignStatus: z.enum(['Active Ongoing', 'Contained', 'Historical', 'Emerging']).optional(),
  overallSeverity: z.enum(['critical', 'high', 'medium', 'low', 'informational']).optional(),
  description: z.string().optional().default(''),
  targetRegions: z.array(z.string()).optional().default([]),
  targetSectors: z.array(z.string()).optional().default([]),
  techniques: z.array(
    z.object({
      id: z.string(),
      subtechniqueId: z.string().optional(),
      name: z.string().optional(),
      tacticId: z.string().optional(),
      tacticName: z.string().optional(),
      phase: z.string().optional(),
      description: z.string().optional(),
      adversaryObjective: z.string().optional(),
      score: z.number().optional(),
      severity: z.string().optional(),
      procedureEvidence: z
        .object({
          id: z.string().optional(),
          title: z.string().optional(),
          operationalNote: z.string(),
          observedArtifacts: z.array(z.string()).optional(),
          evidenceUrls: z.array(z.string()).optional(),
          targetedEntities: z.array(z.string()).optional(),
          confidence: z.enum(['confirmed', 'probable', 'possible']).optional(),
        })
        .optional(),
      mitigations: z
        .array(
          z.object({
            id: z.string().optional(),
            category: z.string().optional(),
            title: z.string(),
            description: z.string(),
            actionableSteps: z.array(z.string()).optional(),
            priority: z.enum(['immediate', 'medium', 'routine']).optional(),
          })
        )
        .optional(),
    })
  ),
});

export type ValidatedNavigatorLayer = z.infer<typeof DisarmNavigatorLayerSchema>;
export type ValidatedCustomCampaign = z.infer<typeof DisarmCustomCampaignSchema>;

export type DetectedSchemaType = 'disarm-navigator' | 'disarm-custom' | 'misp-galaxy' | 'unknown';

export interface ValidationResult {
  isValid: boolean;
  schemaType: DetectedSchemaType;
  errors: string[];
  data?: any;
  warnings?: string[];
  stats?: {
    techniquesCount: number;
    hasProcedures: boolean;
    layerName: string;
    version: string;
  };
}

export function validateDisarmJson(rawJson: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rawJson || typeof rawJson !== 'object') {
    return {
      isValid: false,
      schemaType: 'unknown',
      errors: ['O arquivo fornecido não é um objeto JSON válido.'],
    };
  }

  const obj = rawJson as Record<string, any>;

  // Check if it's DISARM Navigator Layer format
  if (Array.isArray(obj.techniques) && obj.techniques.length > 0 && typeof obj.techniques[0]?.techniqueID === 'string') {
    const navResult = DisarmNavigatorLayerSchema.safeParse(obj);
    if (navResult.success) {
      const data = navResult.data;
      const count = data.techniques.length;
      const hasComments = data.techniques.some((t) => !!t.comment);
      return {
        isValid: true,
        schemaType: 'disarm-navigator',
        errors: [],
        warnings,
        data,
        stats: {
          techniquesCount: count,
          hasProcedures: hasComments,
          layerName: data.name || 'Camada DISARM Navigator',
          version: data.version || '2.0',
        },
      };
    } else {
      errors.push(...navResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`));
    }
  }

  // Check if it's DISARM Custom Threat Campaign format
  if (typeof obj.name === 'string' && Array.isArray(obj.techniques)) {
    const customResult = DisarmCustomCampaignSchema.safeParse(obj);
    if (customResult.success) {
      const data = customResult.data;
      return {
        isValid: true,
        schemaType: 'disarm-custom',
        errors: [],
        warnings,
        data,
        stats: {
          techniquesCount: data.techniques.length,
          hasProcedures: data.techniques.some((t) => !!t.procedureEvidence),
          layerName: data.name,
          version: data.version || '2.0',
        },
      };
    } else {
      errors.push(...customResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`));
    }
  }

  // Check if MISP Galaxy
  if (Array.isArray(obj.values) || (obj.Galaxy && obj.Cluster)) {
    return {
      isValid: true,
      schemaType: 'misp-galaxy',
      errors: [],
      data: obj,
      stats: {
        techniquesCount: Array.isArray(obj.values) ? obj.values.length : 1,
        hasProcedures: false,
        layerName: obj.name || 'Exportação MISP-DISARM',
        version: 'MISP 2.4+',
      },
    };
  }

  return {
    isValid: false,
    schemaType: 'unknown',
    errors: errors.length > 0 ? errors.slice(0, 5) : ['O formato do arquivo não corresponde a uma exportação DISARM Navigator, MISP ou Campanha DISARM válida.'],
  };
}
