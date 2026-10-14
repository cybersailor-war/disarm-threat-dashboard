export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational';

export interface ProcedureEvidence {
  id: string;
  techniqueId: string;
  title: string;
  operationalNote: string;
  observedArtifacts: string[];
  evidenceUrls: string[];
  targetedEntities: string[];
  confidence: 'confirmed' | 'probable' | 'possible';
  dateObserved?: string;
  analyst?: string;
}

export interface DisarmTechnique {
  id: string;
  subtechniqueId?: string;
  name: string;
  tacticId: string;
  tacticName: string;
  description: string;
  adversaryObjective: string;
  score?: number;
  severity: ThreatSeverity;
  confidence?: 'confirmed' | 'probable' | 'possible';
  procedureEvidence?: ProcedureEvidence;
  disarmRefUrl?: string;
  isActive: boolean;
  color?: string;
  tags?: string[];
  isSubtechnique?: boolean;
  parentTechniqueId?: string;
}

export interface DisarmTactic {
  id: string;
  name: string;
  tacticNumber: number;
  description: string;
  techniques: DisarmTechnique[];
  color: string;
}

export interface DisarmCampaign {
  id: string;
  name: string;
  version: string;
  domain: string;
  threatActor: string;
  campaignStatus: 'Active Ongoing' | 'Contained' | 'Historical' | 'Emerging';
  overallSeverity: ThreatSeverity;
  description: string;
  dateCreated: string;
  lastUpdated: string;
  targetRegions: string[];
  targetSectors: string[];
  techniques: DisarmTechnique[];
  tactics: DisarmTactic[];
  metadata?: Record<string, string>;
  rawSourceType: 'disarm-navigator' | 'misp-disarm' | 'custom-threat-report';
}

export interface DisarmNavigatorTechnique {
  techniqueID: string;
  tactic?: string;
  score?: number;
  color?: string;
  comment?: string;
  enabled?: boolean;
  metadata?: Array<{ name: string; value: string }>;
  showSubtechniques?: boolean;
}

export interface DisarmNavigatorLayer {
  name?: string;
  version?: string;
  domain?: string;
  description?: string;
  filters?: {
    stages?: string[];
    platforms?: string[];
  };
  techniques: DisarmNavigatorTechnique[];
  gradient?: {
    colors: string[];
    minValue: number;
    maxValue: number;
  };
  legendItems?: Array<{ label: string; color: string }>;
  metadata?: Array<{ name: string; value: string }>;
}
