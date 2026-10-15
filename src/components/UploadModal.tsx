import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  FileCheck,
  AlertTriangle,
  FileCode,
  Download,
  Sparkles,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { DisarmCampaign } from '../types/disarm';
import { parseUploadedDisarmFile } from '../utils/disarmParser';
import { ValidationResult } from '../schema/disarmSchema';
import { SAMPLE_NAVIGATOR_LAYER_JSON } from '../data/mockDisarmData';
import { downloadFile } from '../utils/exportUtils';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignLoaded: (campaign: DisarmCampaign) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onCampaignLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [parsedCampaign, setParsedCampaign] = useState<DisarmCampaign | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessRawText = (text: string, filename: string, sizeBytes: number) => {
    try {
      const json = JSON.parse(text);
      const { campaign, validation } = parseUploadedDisarmFile(json);
      setFileDetails({
        name: filename,
        size: `${(sizeBytes / 1024).toFixed(1)} KB`,
      });
      setValidationResult(validation);
      setParsedCampaign(campaign);
    } catch (err: any) {
      setFileDetails({
        name: filename,
        size: `${(sizeBytes / 1024).toFixed(1)} KB`,
      });
      setValidationResult({
        isValid: false,
        schemaType: 'unknown',
        errors: [`Sintaxe JSON inválida: ${err.message || 'Erro de decodificação'}`],
      });
      setParsedCampaign(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        handleProcessRawText(text, file.name, file.size);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        handleProcessRawText(text, file.name, file.size);
      };
      reader.readAsText(file);
    }
  };

  const handleConfirm = () => {
    if (parsedCampaign) {
      onCampaignLoaded(parsedCampaign);
      onClose();
    }
  };

  const handleLoadSampleLayer = () => {
    const sampleString = JSON.stringify(SAMPLE_NAVIGATOR_LAYER_JSON, null, 2);
    handleProcessRawText(sampleString, 'disarm_sample_layer_export.json', sampleString.length);
  };

  const handleDownloadSample = () => {
    downloadFile(
      JSON.stringify(SAMPLE_NAVIGATOR_LAYER_JSON, null, 2),
      'exemplo_disarm_navigator_layer.json',
      'application/json'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111827] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0d131f]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100 font-mono tracking-wide">
                Ingestão de Arquivo DISARM (.json)
              </h2>
              <p className="text-xs text-slate-400">
                Suporta DISARM Foundation Navigator v2/v3, MISP-DISARM e esquemas operacionais
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer relative flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed transition-all duration-200 text-center ${
              isDragging
                ? 'border-sky-400 bg-sky-500/10'
                : 'border-white/[0.12] hover:border-sky-500/40 bg-white/[0.02] hover:bg-white/[0.04]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="w-12 h-12 rounded-xl bg-[#090A0F] border border-white/[0.08] flex items-center justify-center text-sky-400 mb-3 shadow-md">
              <Upload className="w-6 h-6 animate-bounce" />
            </div>

            <p className="text-sm font-medium text-slate-200 mb-1">
              Arraste seu arquivo JSON aqui ou <span className="text-sky-400 underline">clique para selecionar</span>
            </p>
            <p className="text-xs text-slate-500">Formatos aceitos: .json (DISARM Navigator Layer export)</p>
          </div>

          {/* Quick Demo Options */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#090A0F] border border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-xs text-slate-300">Demonstração Imediata:</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadSampleLayer}
                className="px-2.5 py-1.5 text-xs font-medium text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-lg transition-all"
              >
                Carregar Camada Exemplo
              </button>

              <button
                type="button"
                onClick={handleDownloadSample}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-lg transition-all"
                title="Baixar JSON para inspecionar no editor"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar JSON</span>
              </button>
            </div>
          </div>

          {/* Validation Feedback Card */}
          {validationResult && (
            <div
              className={`p-4 rounded-xl border transition-all ${
                validationResult.isValid
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : 'bg-red-500/5 border-red-500/30'
              }`}
            >
              <div className="flex items-start gap-3">
                {validationResult.isValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                )}

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-100 font-mono">
                      {validationResult.isValid
                        ? 'Esquema DISARM Validado com Sucesso'
                        : 'Falha na Validação do Esquema JSON'}
                    </span>
                    {fileDetails && (
                      <span className="text-xs font-mono text-slate-400">
                        {fileDetails.name} ({fileDetails.size})
                      </span>
                    )}
                  </div>

                  {validationResult.isValid && validationResult.stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                      <div className="p-2 rounded bg-black/30 border border-white/[0.04]">
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">Esquema Detectado</span>
                        <span className="font-semibold text-sky-400 uppercase font-mono">
                          {validationResult.schemaType}
                        </span>
                      </div>
                      <div className="p-2 rounded bg-black/30 border border-white/[0.04]">
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">Técnicas Mapeadas</span>
                        <span className="font-semibold text-emerald-400 font-mono">
                          {validationResult.stats.techniquesCount} TTPs
                        </span>
                      </div>
                      <div className="p-2 rounded bg-black/30 border border-white/[0.04]">
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">Evidências / Notas</span>
                        <span className="font-semibold text-amber-400 font-mono">
                          {validationResult.stats.hasProcedures ? 'Presentes' : 'Básicas'}
                        </span>
                      </div>
                    </div>
                  )}

                  {!validationResult.isValid && (
                    <ul className="list-disc list-inside text-xs text-red-300 space-y-1 pt-1 font-mono">
                      {validationResult.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.08] bg-[#0d131f]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition-all"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            disabled={!parsedCampaign || !validationResult?.isValid}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              parsedCampaign && validationResult?.isValid
                ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-glow-cyan cursor-pointer'
                : 'bg-white/[0.05] text-slate-500 cursor-not-allowed border border-white/[0.05]'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Confirmar Ingestão e Carregar TTPs</span>
          </button>
        </div>
      </div>
    </div>
  );
};
