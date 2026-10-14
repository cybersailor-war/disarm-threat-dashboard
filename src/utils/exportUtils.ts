import { DisarmCampaign } from '../types/disarm';
import { computeCampaignMetrics } from './disarmParser';

export function generateMarkdownReport(campaign: DisarmCampaign): string {
  const metrics = computeCampaignMetrics(campaign);
  const dateFormatted = new Date(campaign.lastUpdated).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let md = `# RELATÓRIO OPERACIONAL DE INTELIGÊNCIA DE AMEAÇAS (DISARM RED TEAM - HACKING FOR INFLUENCE)
**Framework de Referência:** DISARM Red Team Framework (DISARM Foundation)  
**Operação / Campanha:** ${campaign.name}  
**Identificador:** \`${campaign.id}\`  
**Ator da Ameaça Atribuído:** ${campaign.threatActor}  
**Severidade Geral:** ${campaign.overallSeverity.toUpperCase()}  
**Status Operacional:** ${campaign.campaignStatus}  
**Data de Análise:** ${dateFormatted}  

---

## 1. Sumário Operacional
${campaign.description}

### Métricas Fatuais Extraídas
- **Táticas DISARM Mobilizadas:** ${metrics.activeTacticsCount} de ${metrics.totalTactics} (${Math.round((metrics.activeTacticsCount / metrics.totalTactics) * 100)}% da matriz oficial)
- **Técnicas Mapeadas:** ${metrics.totalTechniques}
- **Procedimentos com Evidência:** ${metrics.proceduresCount}
- **Artefatos e IOCs Catalogados:** ${metrics.totalArtifactsCount}
- **Distribuição de Severidade:** Crítico: ${metrics.severityCounts.critical} | Alto: ${metrics.severityCounts.high} | Médio: ${metrics.severityCounts.medium}

---

## 2. Mobilização de Táticas DISARM (TA01 a TA13)

| ID | Tática Oficial DISARM | Técnicas Ativas | Foco do Adversário |
| :--- | :--- | :---: | :--- |
`;

  campaign.tactics.forEach((tactic) => {
    md += `| **${tactic.id}** | ${tactic.name} | ${tactic.techniques.length} | ${tactic.description} |\n`;
  });

  md += `\n---\n\n## 3. Detalhamento de Técnicas, Procedimentos e Artefatos (IOCs)\n\n`;

  campaign.techniques.forEach((tech, index) => {
    md += `### ${index + 1}. [${tech.id}] ${tech.name}\n`;
    md += `- **Tática DISARM:** ${tech.tacticName} (\`${tech.tacticId}\`)\n`;
    md += `- **Severidade:** ${tech.severity.toUpperCase()}\n`;
    md += `- **Objetivo do Adversário:** ${tech.adversaryObjective}\n`;
    md += `- **Conceito DISARM:** ${tech.description}\n\n`;

    if (tech.procedureEvidence) {
      md += `#### 🔍 Procedimento Mapeado:\n`;
      md += `> **${tech.procedureEvidence.title}**\n>\n`;
      md += `> ${tech.procedureEvidence.operationalNote}\n\n`;

      if (tech.procedureEvidence.observedArtifacts.length > 0) {
        md += `**Artefatos Digitais & IOCs:**\n`;
        tech.procedureEvidence.observedArtifacts.forEach((art) => {
          md += `- \`${art}\`\n`;
        });
        md += `\n`;
      }

      if (tech.procedureEvidence.evidenceUrls.length > 0) {
        md += `**Fontes de Evidência:**\n`;
        tech.procedureEvidence.evidenceUrls.forEach((url) => {
          md += `- [${url}](${url})\n`;
        });
        md += `\n`;
      }

      if (tech.procedureEvidence.targetedEntities && tech.procedureEvidence.targetedEntities.length > 0) {
        md += `**Entidades Visadas:** ${tech.procedureEvidence.targetedEntities.join(', ')}\n\n`;
      }
    }

    md += `---\n\n`;
  });

  md += `*Relatório operacional de inteligência gerado via DISARM Red Team Platform.*`;

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
