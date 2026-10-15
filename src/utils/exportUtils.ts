import { jsPDF } from 'jspdf';
import { DisarmCampaign, DisarmTechnique } from '../types/disarm';
import { computeCampaignMetrics } from './disarmParser';
import { DISARM_TACTICS_MASTER } from '../data/disarmMaster';

/**
 * Clean raw HTML tags (like <br>, <b>, etc.) and HTML entities from text.
 */
export function cleanHtmlText(text?: string): string {
  if (!text) return '';
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

/**
 * Filter out DISARM framework documentation links from incident evidence URLs.
 * Evidence URLs must only contain actual investigative sources, not the DISARM manual.
 */
export function filterRealEvidenceUrls(urls?: string[]): string[] {
  if (!urls || !Array.isArray(urls)) return [];
  return urls.filter(
    (url) =>
      url &&
      typeof url === 'string' &&
      !url.includes('github.com/DISARMFoundation') &&
      !url.includes('disarmfoundation.github.io') &&
      !url.includes('/generated_pages/T')
  );
}

export function generateMarkdownReport(campaign: DisarmCampaign): string {
  const metrics = computeCampaignMetrics(campaign);
  const dateFormatted = new Date(campaign.lastUpdated).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let md = `# RELATÓRIO OPERACIONAL DE INTELIGÊNCIA DE AMEAÇAS (DISARM RED TEAM)
**Classificação:** TLP:AMBER | **Framework:** DISARM Red Team Framework (16 Táticas Oficiais)  
**Operação / Campanha:** ${campaign.name}  
**Identificador:** \`${campaign.id}\`  
**Ator da Ameaça Atribuído:** ${campaign.threatActor}  
**Severidade Geral:** ${campaign.overallSeverity.toUpperCase()}  
**Status Operacional:** ${campaign.campaignStatus}  
**Data da Análise:** ${dateFormatted}  
**Regiões-Alvo:** ${campaign.targetRegions.join(', ') || 'Não especificadas'}  
**Setores Visados:** ${campaign.targetSectors.join(', ') || 'Não especificados'}  

---

## 1. Sumário Executivo & Contexto da Operação
${campaign.description}

### Métricas Quantitativas Extraídas
- **Táticas DISARM Mobilizadas:** ${metrics.activeTacticsCount} de ${metrics.totalTactics} (${Math.round((metrics.activeTacticsCount / metrics.totalTactics) * 100)}% da matriz oficial)
- **Técnicas Mapeadas:** ${metrics.totalTechniques}
- **Procedimentos com Evidência:** ${metrics.proceduresCount}
- **Artefatos e IOCs Catalogados:** ${metrics.totalArtifactsCount}
- **Distribuição de Severidade:** Crítico: ${metrics.severityCounts.critical} | Alto: ${metrics.severityCounts.high} | Médio: ${metrics.severityCounts.medium}

---

## 2. Mobilização de Táticas Oficiais DISARM

| ID | Tática Oficial DISARM | Técnicas Ativas | Explicação & Foco Tático DISARM |
| :--- | :--- | :---: | :--- |
`;

  campaign.tactics.forEach((tactic) => {
    const masterDef = DISARM_TACTICS_MASTER.find((t) => t.id === tactic.id);
    const desc = masterDef?.description || tactic.description;
    md += `| **${tactic.id}** | ${tactic.name} | ${tactic.techniques.length} | ${desc} |\n`;
  });

  md += `\n---\n\n## 3. Detalhamento de Táticas, Técnicas e Evidências Operacionais\n\n`;

  // Group techniques by tactic for clarity
  campaign.tactics.forEach((tactic) => {
    const masterDef = DISARM_TACTICS_MASTER.find((t) => t.id === tactic.id);
    const desc = masterDef?.description || tactic.description;

    md += `### Tática ${tactic.id}: ${tactic.name}\n`;
    md += `*Definição DISARM:* ${desc}\n\n`;

    tactic.techniques.forEach((tech) => {
      md += `#### [${tech.id}] ${tech.name}\n`;
      md += `- **Severidade:** ${tech.severity.toUpperCase()}\n`;
      md += `- **Objetivo do Adversário:** ${tech.adversaryObjective}\n`;
      md += `- **Conceito Técnico DISARM:** ${tech.description}\n`;

      if (tech.procedureEvidence) {
        md += `\n**Evidência / Procedimento Observado:**\n`;
        md += `> **${tech.procedureEvidence.title}** (Confiança: ${tech.procedureEvidence.confidence})\n>\n`;
        md += `> ${tech.procedureEvidence.operationalNote}\n\n`;

        if (tech.procedureEvidence.observedArtifacts && tech.procedureEvidence.observedArtifacts.length > 0) {
          md += `**Artefatos Digitais & IOCs:**\n`;
          tech.procedureEvidence.observedArtifacts.forEach((art) => {
            md += `- \`${art}\`\n`;
          });
          md += `\n`;
        }

        const realUrls = filterRealEvidenceUrls(tech.procedureEvidence.evidenceUrls);
        if (realUrls.length > 0) {
          md += `**Fontes / Repositórios de Evidência:**\n`;
          realUrls.forEach((url) => {
            md += `- [${url}](${url})\n`;
          });
          md += `\n`;
        }

        if (tech.procedureEvidence.targetedEntities && tech.procedureEvidence.targetedEntities.length > 0) {
          md += `**Alvos / Entidades Específicas:** ${tech.procedureEvidence.targetedEntities.join(', ')}\n\n`;
        }
      }

      md += `\n`;
    });

    md += `---\n\n`;
  });

  md += `## 4. Recomendações Táticas do Red Team
1. **Contramedidas Imediatas:** Desmantelamento de infraestrutura de clonagem (takedown de domínios typosquatted via registradores e provedores DNS).
2. **Atribuição & CTI:** Correlação contínua com indicadores de atores estatais e coletivos alinhados.
3. **Resiliência de Informação:** Divulgação de alertas públicos aos veículos de imprensa e canais oficiais visados para desacreditar antecipadamente narrativas forjadas.

---
*Relatório de inteligência operacional gerado pela DISARM Red Team Threat Platform.*`;

  return md;
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportCampaignAsMarkdown(campaign: DisarmCampaign) {
  const markdown = generateMarkdownReport(campaign);
  const safeName = campaign.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  downloadFile(markdown, `relatorio_disarm_operacional_${safeName}.md`, 'text/markdown;charset=utf-8');
}

export function exportCampaignAsJson(campaign: DisarmCampaign) {
  const json = JSON.stringify(campaign, null, 2);
  const safeName = campaign.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  downloadFile(json, `disarm_campaign_${safeName}.json`, 'application/json;charset=utf-8');
}

/**
 * Generate and download a standard, highly professional Cyber Threat Intelligence (CTI)
 * PDF Report for the active DISARM campaign.
 */
export function exportCampaignAsPdf(campaign: DisarmCampaign) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182mm
  let y = 16;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = 18;
      drawRunningHeader();
    }
  };

  const drawRunningHeader = () => {
    doc.setFillColor(15, 23, 42); // #0f172a
    doc.rect(marginX, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('TLP:AMBER • RELATÓRIO OPERACIONAL DE INTELIGÊNCIA • DISARM RED TEAM', marginX + 3, y + 4.2);
    y += 10;
  };

  // --- Cover / Header Banner ---
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(marginX, y, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('TLP:AMBER  |  DOCUMENTO DE INTELIGÊNCIA OPERACIONAL (DISARM FRAMEWORK v2.0)', marginX + 3, y + 5.5);
  y += 13;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  const splitTitle = doc.splitTextToSize(campaign.name, contentWidth);
  doc.text(splitTitle, marginX, y);
  y += splitTitle.length * 6.5 + 2;

  // Accent line
  doc.setDrawColor(14, 165, 233); // sky-500
  doc.setLineWidth(0.8);
  doc.line(marginX, y, marginX + contentWidth, y);
  y += 6;

  // Metadata Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(marginX, y, contentWidth, 26, 2, 2, 'FD');

  const metaCol1 = marginX + 3;
  const metaCol2 = marginX + 70;
  const metaCol3 = marginX + 130;

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('ID DA OPERAÇÃO:', metaCol1, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(campaign.id, metaCol1, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('ATOR DE AMEAÇA:', metaCol1, y + 15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(185, 28, 28); // red-700
  const actorTruncated = campaign.threatActor.length > 38 ? campaign.threatActor.slice(0, 36) + '...' : campaign.threatActor;
  doc.text(actorTruncated, metaCol1, y + 19);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('SEVERIDADE:', metaCol2, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text(campaign.overallSeverity.toUpperCase(), metaCol2, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('STATUS:', metaCol2, y + 15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 132, 199);
  doc.text(campaign.campaignStatus, metaCol2, y + 19);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('ATUALIZAÇÃO:', metaCol3, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(new Date(campaign.lastUpdated).toLocaleDateString('pt-BR'), metaCol3, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('SETOR / ESCOPO:', metaCol3, y + 15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  const sectorsSummary = campaign.targetSectors.slice(0, 2).join(', ') || 'Geral';
  doc.text(sectorsSummary.length > 25 ? sectorsSummary.slice(0, 23) + '...' : sectorsSummary, metaCol3, y + 19);

  y += 31;

  // --- Section 1: Sumário Executivo & Contexto Operacional ---
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. SUMÁRIO EXECUTIVO & CONTEXTO OPERACIONAL', marginX, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const descLines = doc.splitTextToSize(cleanHtmlText(campaign.description), contentWidth);
  doc.text(descLines, marginX, y);
  y += descLines.length * 4.2 + 6;

  // Regions & Sectors details
  if (campaign.targetRegions.length > 0 || campaign.targetSectors.length > 0) {
    checkPageBreak(12);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`• Regiões-Alvo Observadas: ${campaign.targetRegions.join(', ') || 'Não especificadas'}`, marginX + 2, y);
    y += 4;
    doc.text(`• Setores Institucionais Afetados: ${campaign.targetSectors.join(', ') || 'Não especificados'}`, marginX + 2, y);
    y += 7;
  }

  // --- Section 2: Métricas Operacionais Extraídas ---
  checkPageBreak(25);
  const metrics = computeCampaignMetrics(campaign);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. MÉTRICAS QUANTITATIVAS DA OPERAÇÃO (CTI)', marginX, y);
  y += 5;

  // Metric pills
  const cardW = (contentWidth - 6) / 4; // 4 cards
  const cards = [
    { label: 'TÁTICAS MAPEADAS', val: `${metrics.activeTacticsCount} / ${metrics.totalTactics}`, sub: `${Math.round((metrics.activeTacticsCount / metrics.totalTactics) * 100)}% da matriz` },
    { label: 'TÉCNICAS ATIVAS', val: `${metrics.totalTechniques}`, sub: `${metrics.severityCounts.critical} críticas` },
    { label: 'PROCEDIMENTOS', val: `${metrics.proceduresCount}`, sub: `${metrics.confidenceCounts.confirmed} confirmados` },
    { label: 'ARTEFATOS / IOCS', val: `${metrics.totalArtifactsCount}`, sub: 'Indicadores técnicos' },
  ];

  cards.forEach((c, idx) => {
    const cardX = marginX + idx * (cardW + 2);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(cardX, y, cardW, 14, 1.5, 1.5, 'FD');

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(c.label, cardX + 2.5, y + 4);

    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(c.val, cardX + 2.5, y + 8.5);

    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(14, 165, 233);
    doc.text(c.sub, cardX + 2.5, y + 12);
  });
  y += 19;

  // --- Section 3: Análise Tática e Detalhamento das Técnicas (Apenas Técnicas e Táticas Efetivamente Identificadas) ---
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('3. DETALHAMENTO DE TÁTICAS E TÉCNICAS DISARM IDENTIFICADAS', marginX, y);
  y += 6;

  // Filter tactics to strictly those with identified active techniques
  const activeTactics = campaign.tactics
    .map((tactic) => ({
      ...tactic,
      techniques: (tactic.techniques || []).filter((tech) => tech.isActive !== false),
    }))
    .filter((tactic) => tactic.techniques.length > 0);

  activeTactics.forEach((tactic) => {
    const masterDef = DISARM_TACTICS_MASTER.find((t) => t.id === tactic.id);
    const tacticDesc = cleanHtmlText(masterDef?.description || tactic.description);

    checkPageBreak(22);

    // Tactic Header Box
    doc.setFillColor(241, 245, 249); // slate-100
    doc.setDrawColor(14, 165, 233); // sky-500
    doc.rect(marginX, y, contentWidth, 7, 'F');
    doc.setLineWidth(0.6);
    doc.line(marginX, y, marginX, y + 7); // left accent line

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(2, 132, 199); // sky-600
    doc.text(`${tactic.id}: ${tactic.name.toUpperCase()}`, marginX + 3, y + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`(${tactic.techniques.length} ${tactic.techniques.length === 1 ? 'técnica' : 'técnicas'})`, marginX + contentWidth - 25, y + 4.8);

    y += 9;

    // Official Tactic explanation
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const tacticDescLines = doc.splitTextToSize(`Conceito DISARM da Tática: ${tacticDesc}`, contentWidth - 4);
    doc.text(tacticDescLines, marginX + 2, y);
    y += tacticDescLines.length * 3.6 + 4;

    // Active techniques inside this tactic
    tactic.techniques.forEach((tech) => {
      checkPageBreak(28);

      // Technique Card
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.setLineWidth(0.3);

      // Title line: [ID] Name | Severity
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`[${tech.id}] ${tech.name}`, marginX + 2, y + 4);

      doc.setFontSize(7);
      if (tech.severity === 'critical') {
        doc.setTextColor(220, 38, 38);
      } else if (tech.severity === 'high') {
        doc.setTextColor(217, 119, 6);
      } else {
        doc.setTextColor(2, 132, 199);
      }
      doc.text(`SEVERIDADE: ${tech.severity.toUpperCase()}`, marginX + contentWidth - 36, y + 4);
      y += 7;

      // Cleaned DISARM Definition (strip HTML tags and keep concise)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const cleanedDef = cleanHtmlText(tech.description);
      const primaryParagraph = cleanedDef.split('\n\n')[0] || cleanedDef;
      const defLines = doc.splitTextToSize(`Definição DISARM: ${primaryParagraph}`, contentWidth - 6);
      doc.text(defLines, marginX + 3, y);
      y += defLines.length * 3.6 + 2;

      // Adversary Objective
      if (tech.adversaryObjective && tech.adversaryObjective !== tech.description) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(185, 28, 28);
        doc.text('Objetivo do Adversário: ', marginX + 3, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const objText = cleanHtmlText(tech.adversaryObjective);
        const objLines = doc.splitTextToSize(objText, contentWidth - 36);
        doc.text(objLines, marginX + 33, y);
        y += objLines.length * 3.6 + 2;
      }

      // Procedure Evidence Box
      if (tech.procedureEvidence) {
        checkPageBreak(20);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        
        const cleanedNote = cleanHtmlText(tech.procedureEvidence.operationalNote);
        const evidenceLines = doc.splitTextToSize(`"${cleanedNote}"`, contentWidth - 10);
        const boxHeight = 10 + evidenceLines.length * 3.6 + (tech.procedureEvidence.observedArtifacts.length > 0 ? 8 : 0);
        
        doc.roundedRect(marginX + 2, y, contentWidth - 4, boxHeight, 1, 1, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(5, 150, 105); // emerald-600
        doc.text(`Evidência Observada: ${tech.procedureEvidence.title} (Confiança: ${tech.procedureEvidence.confidence})`, marginX + 5, y + 4.5);

        doc.setFont('helvetica', 'italic');
        doc.setTextColor(51, 65, 85);
        doc.text(evidenceLines, marginX + 5, y + 8.5);

        let innerY = y + 8.5 + evidenceLines.length * 3.6 + 1.5;

        // Artifacts
        if (tech.procedureEvidence.observedArtifacts && tech.procedureEvidence.observedArtifacts.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6.8);
          doc.setTextColor(100, 116, 139);
          doc.text('Artefatos & IOCs: ', marginX + 5, innerY);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(15, 23, 42);
          const arts = tech.procedureEvidence.observedArtifacts.join('  |  ');
          const artLines = doc.splitTextToSize(arts, contentWidth - 30);
          doc.text(artLines, marginX + 26, innerY);
          innerY += artLines.length * 3.4;
        }

        // Real Evidence URLs (filter out DISARM framework pages)
        const realUrls = filterRealEvidenceUrls(tech.procedureEvidence.evidenceUrls);
        if (realUrls.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6.8);
          doc.setTextColor(14, 165, 233);
          doc.text(`Fontes de Evidência: ${realUrls.join(', ')}`, marginX + 5, innerY + 3);
          innerY += 4;
        }

        y += boxHeight + 4;
      } else {
        y += 3;
      }

      // Draw bottom separator
      doc.setDrawColor(241, 245, 249);
      doc.line(marginX, y, marginX + contentWidth, y);
      y += 4;
    });

    y += 3;
  });

  // --- Add Page Numbers & Running Footers to ALL Pages ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(marginX, pageHeight - 12, marginX + contentWidth, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `DISARM Red Team Threat Assessment  |  ${campaign.name.slice(0, 45)}  |  TLP:AMBER`,
      marginX,
      pageHeight - 8
    );
    doc.text(`Página ${i} de ${totalPages}`, marginX + contentWidth - 18, pageHeight - 8);
  }

  // Save the PDF
  const safeName = campaign.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`relatorio_inteligencia_disarm_${safeName}.pdf`);
}
