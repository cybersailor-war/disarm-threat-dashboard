import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  ShieldAlert,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Tag
} from 'lucide-react';
import {
  OFFICIAL_DISARM_TECHNIQUES,
  OFFICIAL_DISARM_TACTICS,
  OfficialDisarmTechnique
} from '../data/officialDisarmData';
import { DisarmTechnique, ThreatSeverity, ProcedureEvidence } from '../types/disarm';

interface ManualTtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (technique: DisarmTechnique) => void;
  initialTtp?: DisarmTechnique | null;
  initialOfficialTech?: OfficialDisarmTechnique | null;
}

export const ManualTtpModal: React.FC<ManualTtpModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTtp,
  initialOfficialTech
}) => {
  const isEditing = Boolean(initialTtp);

  // Selected official technique
  const [selectedTechId, setSelectedTechId] = useState<string>('');
  const [techSearch, setTechSearch] = useState<string>('');

  // TTP form state
  const [severity, setSeverity] = useState<ThreatSeverity>('high');
  const [confidence, setConfidence] = useState<'confirmed' | 'probable' | 'possible'>('probable');
  const [procedureTitle, setProcedureTitle] = useState('');
  const [operationalNote, setOperationalNote] = useState('');
  const [analyst, setAnalyst] = useState('Operador de Inteligência');
  const [dateObserved, setDateObserved] = useState(new Date().toISOString().split('T')[0]);

  // Lists
  const [artifacts, setArtifacts] = useState<string[]>([]);
  const [newArtifact, setNewArtifact] = useState('');

  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [newEvidenceUrl, setNewEvidenceUrl] = useState('');

  const [targetedEntities, setTargetedEntities] = useState<string[]>([]);
  const [newTargetEntity, setNewTargetEntity] = useState('');

  // Pre-fill state when editing or receiving initialOfficialTech
  useEffect(() => {
    if (initialTtp) {
      setSelectedTechId(initialTtp.id);
      setSeverity(initialTtp.severity);
      if (initialTtp.procedureEvidence) {
        setProcedureTitle(initialTtp.procedureEvidence.title || '');
        setOperationalNote(initialTtp.procedureEvidence.operationalNote || '');
        setConfidence(initialTtp.procedureEvidence.confidence || 'probable');
        setAnalyst(initialTtp.procedureEvidence.analyst || 'Operador de Inteligência');
        setDateObserved(initialTtp.procedureEvidence.dateObserved || new Date().toISOString().split('T')[0]);
        setArtifacts(initialTtp.procedureEvidence.observedArtifacts || []);
        setEvidenceUrls(initialTtp.procedureEvidence.evidenceUrls || []);
        setTargetedEntities(initialTtp.procedureEvidence.targetedEntities || []);
      }
    } else if (initialOfficialTech) {
      setSelectedTechId(initialOfficialTech.id);
      setProcedureTitle(`Procedimento observado: ${initialOfficialTech.name}`);
      setOperationalNote(initialOfficialTech.description);
      setSeverity('high');
      setConfidence('probable');
      setArtifacts([]);
      setEvidenceUrls([]);
      setTargetedEntities([]);
    } else {
      setSelectedTechId('T0074');
      setProcedureTitle('');
      setOperationalNote('');
      setSeverity('high');
      setConfidence('probable');
      setArtifacts([]);
      setEvidenceUrls([]);
      setTargetedEntities([]);
    }
  }, [initialTtp, initialOfficialTech, isOpen]);

  if (!isOpen) return null;

  // Selected technique object
  const selectedOfficial = OFFICIAL_DISARM_TECHNIQUES.find((t) => t.id === selectedTechId);

  // Filtered list of techniques for search
  const filteredTechniques = OFFICIAL_DISARM_TECHNIQUES.filter((t) => {
    if (!techSearch.trim()) return true;
    const q = techSearch.toLowerCase();
    return t.id.toLowerCase().includes(q) || t.name.toLowerCase().includes(q) || t.tacticName.toLowerCase().includes(q);
  });

  const handleAddArtifact = () => {
    if (newArtifact.trim() && !artifacts.includes(newArtifact.trim())) {
      setArtifacts([...artifacts, newArtifact.trim()]);
      setNewArtifact('');
    }
  };

  const handleRemoveArtifact = (index: number) => {
    setArtifacts(artifacts.filter((_, i) => i !== index));
  };

  const handleAddUrl = () => {
    if (newEvidenceUrl.trim() && !evidenceUrls.includes(newEvidenceUrl.trim())) {
      setEvidenceUrls([...evidenceUrls, newEvidenceUrl.trim()]);
      setNewEvidenceUrl('');
    }
  };

  const handleRemoveUrl = (index: number) => {
    setEvidenceUrls(evidenceUrls.filter((_, i) => i !== index));
  };

  const handleAddEntity = () => {
    if (newTargetEntity.trim() && !targetedEntities.includes(newTargetEntity.trim())) {
      setTargetedEntities([...targetedEntities, newTargetEntity.trim()]);
      setNewTargetEntity('');
    }
  };

  const handleRemoveEntity = (index: number) => {
    setTargetedEntities(targetedEntities.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfficial) return;

    const procedure: ProcedureEvidence = {
      id: initialTtp?.procedureEvidence?.id || `PROC-${Date.now().toString().slice(-4)}`,
      techniqueId: selectedOfficial.id,
      title: procedureTitle.trim() || `Aplicação de ${selectedOfficial.name}`,
      operationalNote: operationalNote.trim() || selectedOfficial.description,
      observedArtifacts: artifacts,
      evidenceUrls: evidenceUrls,
      targetedEntities: targetedEntities,
      confidence: confidence,
      dateObserved: dateObserved,
      analyst: analyst.trim() || 'Operador de Inteligência',
    };

    const updatedTechnique: DisarmTechnique = {
      id: selectedOfficial.id,
      name: selectedOfficial.name,
      tacticId: selectedOfficial.tacticId,
      tacticName: selectedOfficial.tacticName,
      description: selectedOfficial.description,
      adversaryObjective: selectedOfficial.description,
      severity: severity,
      confidence: confidence,
      isActive: true,
      procedureEvidence: procedure,
      disarmRefUrl: selectedOfficial.url,
      isSubtechnique: selectedOfficial.isSubtechnique,
      parentTechniqueId: selectedOfficial.parentTechniqueId,
    };

    onSave(updatedTechnique);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#0b101b] border border-white/[0.12] rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#0e1626]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEditing ? 'Editar Procedimento / TTP no Caso' : 'Adicionar TTP Manualmente ao Caso'}
              </h3>
              <p className="text-xs text-slate-400">
                Selecione a técnica oficial DISARM e registre os procedimentos operacionais e evidências observadas.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Technique Picker */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Técnica Oficial DISARM (257 disponíveis) *
            </label>

            {isEditing ? (
              <div className="p-3 rounded-lg bg-[#070b12] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-sky-400 mr-2">{selectedOfficial?.id}</span>
                  <span className="text-xs font-semibold text-white">{selectedOfficial?.name}</span>
                  <span className="block text-[11px] font-mono text-slate-500 mt-0.5">
                    {selectedOfficial?.tacticId} • {selectedOfficial?.tacticName}
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Fixado no Editor
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={techSearch}
                    onChange={(e) => setTechSearch(e.target.value)}
                    placeholder="Filtrar técnica por nome ou ID..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-[#070b12] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <select
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#070b12] border border-white/[0.08] text-white focus:outline-none focus:border-sky-500 font-mono"
                  size={5}
                >
                  {filteredTechniques.map((t) => (
                    <option key={t.id} value={t.id} className="py-1">
                      [{t.id}] {t.name} ({t.tacticId} - {t.tacticName})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Severity & Confidence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Nível de Severidade / Criticidade *
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as ThreatSeverity)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#070b12] border border-white/[0.08] text-white focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="critical">Crítica (Impacto Extremo)</option>
                <option value="high">Alta (Impacto Severo)</option>
                <option value="medium">Média (Impacto Moderado)</option>
                <option value="low">Baixa (Impacto Residual)</option>
                <option value="informational">Informativa</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Grau de Confiança Analítica *
              </label>
              <select
                value={confidence}
                onChange={(e) => setConfidence(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#070b12] border border-white/[0.08] text-white focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="confirmed">Confirmado (Evidências Conclusivas)</option>
                <option value="probable">Provável (Alta Probabilidade Técnica)</option>
                <option value="possible">Possível (Hipótese em Averiguação)</option>
              </select>
            </div>
          </div>

          {/* Procedure Title */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Título do Procedimento Operacional *
            </label>
            <input
              type="text"
              value={procedureTitle}
              onChange={(e) => setProcedureTitle(e.target.value)}
              placeholder="Ex: Clonagem de portais governamentais com certificados SSL forjados"
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#070b12] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          {/* Operational Notes / Adversary Behavior */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Nota Operacional / O que o adversário fez? *
            </label>
            <textarea
              value={operationalNote}
              onChange={(e) => setOperationalNote(e.target.value)}
              placeholder="Descreva detalhadamente o procedimento executado pelo atacante, ferramentas empregadas e metodologia observada..."
              rows={4}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#070b12] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
              required
            />
          </div>

          {/* Observed Artifacts / IOCs */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Artefatos & IOCs Observados</span>
              <span className="text-slate-500 text-[10px]">Domínios, IPs, Hashes, Hashtags, Contas</span>
            </label>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newArtifact}
                onChange={(e) => setNewArtifact(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddArtifact();
                  }
                }}
                placeholder="Ex: lemonde.ltd, IP: 185.220.101.45, #HashtagMaliciosa"
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#070b12] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
              />
              <button
                type="button"
                onClick={handleAddArtifact}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.08]"
              >
                + Adicionar
              </button>
            </div>

            {artifacts.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-[#070b12] border border-white/[0.05]">
                {artifacts.map((art, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-sky-950/50 text-sky-300 border border-sky-500/30"
                  >
                    <span>{art}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveArtifact(idx)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Targeted Entities */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Entidades ou Públicos Alvo
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTargetEntity}
                onChange={(e) => setNewTargetEntity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddEntity();
                  }
                }}
                placeholder="Ex: Tribunal Superior Eleitoral, Eleitores Jovens, Redações de Imprensa"
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#070b12] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
              />
              <button
                type="button"
                onClick={handleAddEntity}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.08]"
              >
                + Adicionar
              </button>
            </div>

            {targetedEntities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-[#070b12] border border-white/[0.05]">
                {targetedEntities.map((ent, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-purple-950/50 text-purple-300 border border-purple-500/30"
                  >
                    <span>{ent}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEntity(idx)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Evidence URLs */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Links de Evidência / Arquivos da Investigação
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newEvidenceUrl}
                onChange={(e) => setNewEvidenceUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
                placeholder="Ex: https://archive.is/xyz, https://virustotal.com/gui/..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#070b12] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.08]"
              >
                + Adicionar
              </button>
            </div>

            {evidenceUrls.length > 0 && (
              <div className="space-y-1 p-2 rounded-lg bg-[#070b12] border border-white/[0.05]">
                {evidenceUrls.map((url, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-mono text-sky-400">
                    <span className="truncate max-w-[85%]">{url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveUrl(idx)}
                      className="text-slate-400 hover:text-red-400 px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Controls inside Form */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500">
              {selectedOfficial ? `Tática: ${selectedOfficial.tacticId} (${selectedOfficial.tacticName})` : ''}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-glow-cyan transition-all cursor-pointer"
              >
                {isEditing ? 'Salvar Alterações no TTP' : 'Adicionar TTP ao Caso'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
