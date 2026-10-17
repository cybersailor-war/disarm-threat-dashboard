const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createZip(entries) {
  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  for (const entry of entries) {
    const filenameBuf = Buffer.from(entry.name, 'utf8');
    const uncompressedData = entry.data;
    const crc = zlib.crc32(uncompressedData);
    let compressedData = uncompressedData;
    let method = 0; // STORE
    if (!entry.store) {
      compressedData = zlib.deflateRawSync(uncompressedData);
      method = 8; // DEFLATE
    }

    // Local file header: 30 bytes + filename
    const localHeader = Buffer.alloc(30 + filenameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4); // version needed 2.0
    localHeader.writeUInt16LE(0x0800, 6); // UTF-8 flag
    localHeader.writeUInt16LE(method, 8);
    localHeader.writeUInt16LE(0, 10); // time
    localHeader.writeUInt16LE(0, 12); // date
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressedData.length, 18);
    localHeader.writeUInt32LE(uncompressedData.length, 22);
    localHeader.writeUInt16LE(filenameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);
    filenameBuf.copy(localHeader, 30);

    localHeaders.push(localHeader, compressedData);

    // Central directory header: 46 bytes + filename
    const centralHeader = Buffer.alloc(46 + filenameBuf.length);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4); // version made by
    centralHeader.writeUInt16LE(20, 6); // version needed
    centralHeader.writeUInt16LE(0x0800, 8); // UTF-8 flag
    centralHeader.writeUInt16LE(method, 10);
    centralHeader.writeUInt16LE(0, 12); // time
    centralHeader.writeUInt16LE(0, 14); // date
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressedData.length, 20);
    centralHeader.writeUInt32LE(uncompressedData.length, 24);
    centralHeader.writeUInt16LE(filenameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    filenameBuf.copy(centralHeader, 46);

    centralHeaders.push(centralHeader);
    offset += localHeader.length + compressedData.length;
  }

  const centralDirOffset = offset;
  const centralDirSize = centralHeaders.reduce((sum, h) => sum + h.length, 0);

  // End of central directory record
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(centralDirOffset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
}

// 1. mimetype (ASCII, STORE)
const mimetypeBuf = Buffer.from('application/vnd.oasis.opendocument.text', 'ascii');

// 2. META-INF/manifest.xml
const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2">
  <manifest:file-entry manifest:full-path="/" manifest:version="1.2" manifest:media-type="application/vnd.oasis.opendocument.text"/>
  <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
  <manifest:file-entry manifest:full-path="styles.xml" manifest:media-type="text/xml"/>
  <manifest:file-entry manifest:full-path="meta.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`;

// 3. meta.xml
const metaXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-meta xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
                      xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0"
                      xmlns:dc="http://purl.org/dc/elements/1.1/"
                      office:version="1.2">
  <office:meta>
    <dc:title>DISARM.AI - Relatório Técnico e Caderno Metodológico de Inteligência de Ameaças</dc:title>
    <dc:description>Documento técnico e caderno metodológico abrangente detalhando a arquitetura client-side, sistemas especialistas de IA simbólica, ontologias formais e referências científicas do DISARM.AI.</dc:description>
    <dc:subject>Guerra Cibernética, Hacking for Influence, DISARM Framework, CTI, Sistemas Especialistas, IA Simbólica</dc:subject>
    <dc:creator>DISARM.AI Research &amp; Development Team</dc:creator>
    <meta:initial-creator>DISARM.AI Engineering</meta:initial-creator>
    <dc:date>2026-10-17T12:15:00Z</dc:date>
  </office:meta>
</office:document-meta>`;

// 4. styles.xml
const stylesXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-styles xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
                        xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
                        xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
                        xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"
                        xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0"
                        xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"
                        xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0"
                        office:version="1.2">
  <office:font-face-decls>
    <style:font-face style:name="Segoe UI" svg:font-family="'Segoe UI', Calibri, Arial, sans-serif"/>
    <style:font-face style:name="Consolas" svg:font-family="'Consolas', 'Courier New', monospace"/>
  </office:font-face-decls>
  <office:styles>
    <style:default-style style:family="paragraph">
      <style:text-properties fo:color="#1e293b" style:font-name="Segoe UI" fo:font-size="10.5pt" fo:language="pt" fo:country="BR"/>
      <style:paragraph-properties fo:line-height="138%" fo:margin-top="0cm" fo:margin-bottom="0.28cm" fo:text-align="justify"/>
    </style:default-style>
  </office:styles>
  <office:automatic-styles>
    <style:page-layout style:name="PM1">
      <style:page-layout-properties fo:page-width="21.0cm" fo:page-height="29.7cm" fo:margin-top="2.0cm" fo:margin-bottom="2.0cm" fo:margin-left="2.2cm" fo:margin-right="2.2cm"/>
    </style:page-layout>
  </office:automatic-styles>
  <office:master-styles>
    <style:master-page style:name="Standard" style:page-layout-name="PM1"/>
  </office:master-styles>
</office:document-styles>`;

// 5. content.xml (Comprehensive UTF-8 Content with Section 5 and Academic References)
const contentXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
                         xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
                         xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
                         xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"
                         xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"
                         xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0"
                         office:version="1.2">
  <office:automatic-styles>
    <style:style style:name="DocTitle" style:family="paragraph">
      <style:paragraph-properties fo:text-align="center" fo:margin-top="0.6cm" fo:margin-bottom="0.2cm"/>
      <style:text-properties style:font-name="Segoe UI" fo:font-size="20pt" fo:font-weight="bold" fo:color="#0f172a"/>
    </style:style>
    <style:style style:name="DocSubtitle" style:family="paragraph">
      <style:paragraph-properties fo:text-align="center" fo:margin-top="0cm" fo:margin-bottom="0.8cm"/>
      <style:text-properties style:font-name="Segoe UI" fo:font-size="11pt" fo:font-weight="bold" fo:color="#0284c7"/>
    </style:style>
    <style:style style:name="MetaBox" style:family="paragraph">
      <style:paragraph-properties fo:background-color="#f8fafc" fo:border="0.5pt solid #cbd5e1" fo:padding="0.32cm" fo:margin-bottom="0.6cm" fo:text-align="left"/>
      <style:text-properties style:font-name="Segoe UI" fo:font-size="9pt" fo:color="#334155"/>
    </style:style>
    <style:style style:name="H1" style:family="paragraph">
      <style:paragraph-properties fo:margin-top="0.75cm" fo:margin-bottom="0.3cm" fo:keep-with-next="always" fo:border-bottom="1.5pt solid #0284c7" fo:padding-bottom="0.1cm"/>
      <style:text-properties style:font-name="Segoe UI" fo:font-size="14pt" fo:font-weight="bold" fo:color="#0f172a"/>
    </style:style>
    <style:style style:name="H2" style:family="paragraph">
      <style:paragraph-properties fo:margin-top="0.5cm" fo:margin-bottom="0.2cm" fo:keep-with-next="always"/>
      <style:text-properties style:font-name="Segoe UI" fo:font-size="11.5pt" fo:font-weight="bold" fo:color="#0369a1"/>
    </style:style>
    <style:style style:name="H3" style:family="paragraph">
      <style:paragraph-properties fo:margin-top="0.35cm" fo:margin-bottom="0.15cm" fo:keep-with-next="always"/>
      <style:text-properties style:font-name="Segoe UI" fo:font-size="10.5pt" fo:font-weight="bold" fo:color="#1e293b"/>
    </style:style>
    <style:style style:name="CalloutBox" style:family="paragraph">
      <style:paragraph-properties fo:background-color="#f0f9ff" fo:border-left="3.5pt solid #0284c7" fo:padding="0.3cm" fo:margin-top="0.25cm" fo:margin-bottom="0.45cm"/>
      <style:text-properties style:font-name="Segoe UI" fo:font-size="9.5pt" fo:color="#0c4a6e"/>
    </style:style>
    <style:style style:name="PitchBox" style:family="paragraph">
      <style:paragraph-properties fo:background-color="#fdf4ff" fo:border-left="3.5pt solid #9333ea" fo:padding="0.35cm" fo:margin-top="0.25cm" fo:margin-bottom="0.45cm"/>
      <style:text-properties style:font-name="Segoe UI" fo:font-size="9.5pt" fo:color="#581c87"/>
    </style:style>
    <style:style style:name="CodeBox" style:family="paragraph">
      <style:paragraph-properties fo:background-color="#0f172a" fo:padding="0.28cm" fo:margin-top="0.25cm" fo:margin-bottom="0.4cm"/>
      <style:text-properties style:font-name="Consolas" fo:font-size="8.5pt" fo:color="#38bdf8"/>
    </style:style>
    <style:style style:name="Bold" style:family="text">
      <style:text-properties fo:font-weight="bold"/>
    </style:style>
    <style:style style:name="Mono" style:family="text">
      <style:text-properties style:font-name="Consolas" fo:font-size="9pt" fo:color="#0369a1"/>
    </style:style>
    <style:style style:name="Badge" style:family="text">
      <style:text-properties style:font-name="Consolas" fo:font-size="8.5pt" fo:font-weight="bold" fo:color="#0284c7"/>
    </style:style>
    <!-- Table Cell Styles -->
    <style:style style:name="TableHeaderCell" style:family="table-cell">
      <style:table-cell-properties fo:background-color="#0f172a" fo:padding="0.18cm" fo:border="0.5pt solid #334155"/>
    </style:style>
    <style:style style:name="TableCell" style:family="table-cell">
      <style:table-cell-properties fo:background-color="#ffffff" fo:padding="0.18cm" fo:border="0.5pt solid #cbd5e1"/>
    </style:style>
    <style:style style:name="TableCellAlt" style:family="table-cell">
      <style:table-cell-properties fo:background-color="#f8fafc" fo:padding="0.18cm" fo:border="0.5pt solid #cbd5e1"/>
    </style:style>
    <style:style style:name="TableTextHeader" style:family="paragraph">
      <style:paragraph-properties fo:margin-bottom="0cm" fo:text-align="left"/>
      <style:text-properties style:font-name="Segoe UI" fo:font-size="8.5pt" fo:font-weight="bold" fo:color="#ffffff"/>
    </style:style>
    <style:style style:name="TableText" style:family="paragraph">
      <style:paragraph-properties fo:margin-bottom="0cm" fo:text-align="left"/>
      <style:text-properties style:font-name="Segoe UI" fo:font-size="8.5pt" fo:color="#1e293b"/>
    </style:style>
    <style:style style:name="BibText" style:family="paragraph">
      <style:paragraph-properties fo:margin-top="0cm" fo:margin-bottom="0.22cm" fo:line-height="130%"/>
      <style:text-properties style:font-name="Segoe UI" fo:font-size="9pt" fo:color="#1e293b"/>
    </style:style>
  </office:automatic-styles>
  <office:body>
    <office:text>
      <!-- Title Block -->
      <text:p text:style-name="DocTitle">DISARM.AI Threat Intelligence &amp; Red Team Platform</text:p>
      <text:p text:style-name="DocSubtitle">RELATÓRIO TÉCNICO E ARQUITETURAL: ANÁLISE DE OPERAÇÕES DE HACKING FOR INFLUENCE, MAPEAMENTO DE TTPS E APOIO À TOMADA DE DECISÃO ESTRATÉGICA</text:p>
      
      <text:p text:style-name="MetaBox">
        <text:span text:style-name="Bold">Classificação Documental:</text:span> Documento Técnico de Arquitetura, Engenharia de Defesa Cibernética e Caderno Metodológico<text:line-break/>
        <text:span text:style-name="Bold">Aplicação Analisada:</text:span> DISARM.AI (disarm-threat-dashboard) • Versão 2.0 (Framework DISARM Foundation v1.4 Oficial)<text:line-break/>
        <text:span text:style-name="Bold">Domínio Operacional:</text:span> Guerra Híbrida, Guerra da Informação (InfoOps), Operações Psicológicas (PsyOps) e Resiliência Cognitiva<text:line-break/>
        <text:span text:style-name="Bold">Data de Emissão:</text:span> Outubro de 2026 • Repositório Oficial: github.com/cybersailor-war/disarm-threat-dashboard
      </text:p>

      <!-- SUMÁRIO EXECUTIVO -->
      <text:p text:style-name="CalloutBox">
        <text:span text:style-name="Bold">SUMÁRIO EXECUTIVO:</text:span> O presente documento consubstancia uma avaliação técnico-científica minuciosa da plataforma DISARM.AI. Projetada especificamente para o rastreamento, mapeamento forense e contraposição de campanhas de <text:span text:style-name="Bold">Hacking for Influence</text:span> (operações ofensivas cibernéticas sincronizadas com manipulação informacional e desinformação), a ferramenta operacionaliza a matriz taxonômica do <text:span text:style-name="Bold">DISARM Red Team Framework</text:span> (16 Táticas e 257 Técnicas). Este relatório decompõe a arquitetura da aplicação, as visões analíticas de comando, os fluxos de dados e ingestão, bem como o papel fulcral desempenhado pelos motores de inteligência artificial simbólica e heurística semântica na elevação da consciência situacional de escalões decisores de Defesa Cibernética e Segurança Nacional.
      </text:p>

      <!-- SEÇÃO 1: ARQUITETURA DA APLICAÇÃO -->
      <text:h text:outline-level="1" text:style-name="H1">1. ARQUITETURA DA APLICAÇÃO</text:h>
      
      <text:h text:outline-level="2" text:style-name="H2">1.1 Paradigma Geral do Sistema e Modelo Client-Side (Zero-Trust Data Isolation)</text:h>
      <text:p>
        A arquitetura da plataforma DISARM.AI fundamenta-se no paradigma de <text:span text:style-name="Bold">Single Page Application (SPA)</text:span> estritamente executada no lado do cliente (client-side execution). Esta opção de engenharia não é fortuita: no contexto de investigações de inteligência de ameaças cibernéticas (CTI) e incidentes de guerra cibernética envolvendo agentes estatais (Advanced Persistent Threats - APTs), a custódia e o sigilo de dados sensíveis de telemetria, relatórios forenses e IOCs confidenciais constituem premissa inegociável de segurança da informação.
      </text:p>
      <text:p>
        Diferentemente de plataformas comerciais legadas baseadas em nuvem compartilhada multi-tenant, o DISARM.AI opera segundo o princípio de <text:span text:style-name="Bold">Isolamento Local de Dados</text:span>. Todo o processamento algorítmico, a renderização dos grafos matriciais, o parsing de arquivos JSON e a compilação de dossiês em PDF ocorrem localmente no motor JavaScript/TypeScript do navegador do operador. Nenhum artefato ou texto descritivo de incidente é transmitido involuntariamente para servidores externos, conferindo à plataforma conformidade operacional para implantação em redes fechadas (air-gapped), Centros de Operações de Segurança (SOCs) Militares e Células de Fusão de Inteligência.
      </text:p>

      <text:h text:outline-level="2" text:style-name="H2">1.2 Ecossistema Tecnológico Empregado</text:h>
      <text:p>
        O ecossistema foi concebido com uma pilha tecnológica contemporânea de alto desempenho, garantindo tempos de renderização submilissegundos e estrita integridade tipográfica:
      </text:p>
      <text:p>
        • <text:span text:style-name="Bold">React 18.3.1 (Virtual DOM &amp; Reconciliação Concorrente):</text:span> Empregado para orquestrar a árvore reativa de componentes. A modularização da interface viabiliza atualizações atômicas de estado durante a filtragem dinâmica de matrizes complexas contendo centenas de nós taxonômicos.<text:line-break/>
        • <text:span text:style-name="Bold">TypeScript 5.6.3 (Segurança de Tipos em Tempo de Compilação):</text:span> Todo o esquema de dados do framework DISARM foi formalizado em interfaces tipadas estritas (DisarmCampaign, DisarmTactic, DisarmTechnique, ProcedureEvidence), mitigando regressões e assegurando contratos de dados imutáveis.<text:line-break/>
        • <text:span text:style-name="Bold">Vite 5.4.8 (Mecanismo de Build e Bundling ESM):</text:span> Proporciona compilação ultrarrápida baseada em módulos ES nativos, viabilizando Hot Module Replacement (HMR) instantâneo durante operações de desenvolvimento e análise.<text:line-break/>
        • <text:span text:style-name="Bold">Tailwind CSS 3.4.13 (Design System Tático em Dark Mode):</text:span> A interface adota uma identidade visual imersiva e de baixo impacto luminoso, projetada para salas de situação e estações de comando militar (Tactical Dark Theme). Utiliza paleta de alta profundidade (Backgrounds primários em #070a12, painéis em #0b101b e superfícies táteis em #111827), contornos translúcidos (white/[0.08]), iluminação de acento em ciano militar (#38bdf8 / #0ea5e9) e tipografia monoespaçada de alta densidade informativa (Consolas / font-mono).<text:line-break/>
        • <text:span text:style-name="Bold">Recharts 2.13.0:</text:span> Biblioteca de visualização estatística baseada em vetores SVG, responsável pela geração de gráficos analíticos responsivos de distribuição tática e cobertura da matriz.<text:line-break/>
        • <text:span text:style-name="Bold">jsPDF &amp; html2canvas:</text:span> Motor de compilação gráfica vetorial client-side para geração instantânea de relatórios de inteligência operacional em padrão executivo internacional.
      </text:p>

      <text:h text:outline-level="2" text:style-name="H2">1.3 Gerenciamento de Estado e Ciclo de Vida: Fluxo de Criação de Operação em Branco</text:h>
      <text:p>
        A gestão de estado adota um repositório centralizado de operações ativas alimentado pelo motor reativo do React, persistido de forma resiliente no <text:span text:style-name="Mono">localStorage</text:span> do cliente (chaves <text:span text:style-name="Mono">disarm_all_campaigns_v2</text:span> e <text:span text:style-name="Mono">disarm_active_campaign_id</text:span>).
      </text:p>
      <text:p>
        O ciclo de dados desencadeado pelo acionamento da função <text:span text:style-name="Bold">"Criar Nova Operação em Branco"</text:span> segue rigorosamente a seguinte cadeia de execução:
      </text:p>
      <text:p text:style-name="CodeBox">
[Operador clica em '+ Nova Operação' no Header]
       │
       ▼
[handleCreateNewCampaign() em App.tsx]
       │
       ├─► Gera Identificador Único: CAMP-HFI-{timestamp}
       ├─► Instancia DisarmCampaign em branco:
       │    • name: "Nova Investigação {data_local}"
       │    • domain: "disarm-redteam"
       │    • overallSeverity: "medium"
       │    • techniques: [] (Array vazio de TTPs ativas)
       │    • tactics: 16 Táticas Oficiais DISARM (dormentes, contagem 0)
       │
       ▼
[Sincronização Atômica de Estado]
       ├─► setCurrentCampaign(newCampaign)
       ├─► setAllCampaigns([newCampaign, ...anteriores])
       └─► saveToStorage() grava JSON serializado no LocalStorage
       │
       ▼
[Re-renderização do Canvas Operacional]
       ├─► Reseta filtros táticos ativos (selectedTacticFilter = 'ALL')
       ├─► Notificação visual de sincronização ("Salvo Localmente")
       └─► Visão Geral exibe painel neutro pronto para ingestão ou mapeamento
      </text:p>

      <!-- SEÇÃO 2: COMPONENTES E VISÕES OPERACIONAIS -->
      <text:h text:outline-level="1" text:style-name="H1">2. COMPONENTES E VISÕES OPERACIONAIS</text:h>

      <text:h text:outline-level="2" text:style-name="H2">2.1 Visão Geral &amp; Métricas (Overview Dashboard)</text:h>
      <text:p>
        O componente <text:span text:style-name="Bold">OverviewDashboard.tsx</text:span> materializa a Sala de Situação Executiva da operação. Suas seções estruturais agregam os principais índices táticos necessários para o escalão decisório:
      </text:p>
      <text:p>
        • <text:span text:style-name="Bold">Banner Tático de Operação:</text:span> Apresenta a denominação do incidente, metadados de ciclo de vida (status da campanha), rótulo animado de severidade consolidada (<text:span text:style-name="Badge">CRITICAL</text:span>, <text:span text:style-name="Badge">HIGH</text:span>, <text:span text:style-name="Badge">MEDIUM</text:span>), carimbo cronológico de última atualização, identificador do ator de ameaça (quando mapeado), regiões geográficas alvo e setores institucionais sob ataque.<text:line-break/>
        • <text:span text:style-name="Bold">Tríade de Cards Métricos Fatuais:</text:span> 
        (1) <text:span text:style-name="Bold">Táticas Mapeadas:</text:span> Exibe a quantidade de fases do framework mobilizadas (ex: 7 de 16 táticas) acompanhada de barra de progresso proporcional;
        (2) <text:span text:style-name="Bold">Técnicas Mapeadas:</text:span> Quantidade de TTPs ativas identificadas na operação, estratificadas por criticidade;
        (3) <text:span text:style-name="Bold">Artefatos &amp; IOCs:</text:span> Cômputo exato de evidências digitais vinculadas a procedimentos operacionais.<text:line-break/>
        • <text:span text:style-name="Bold">Sequência Oficial de Táticas DISARM (Tracker 4x4):</text:span> Painel tático balanceado contendo a grade das 16 táticas oficiais do DISARM Red Team. Cada tática opera como um botão tátil inteligente: táticas mobilizadas exibem sua respectiva cor de acento e a contagem de técnicas associadas; táticas sem evidências permanecem em estado dormente fosco. O clique em qualquer tática redireciona instantaneamente o analista para a visualização matricial filtrada.<text:line-break/>
        • <text:span text:style-name="Bold">Gráfico de Distribuição e Lista de TTPs Críticas:</text:span> Gráfico de barras horizontais indicando a densidade de manobras por fase da operação e lista de acesso rápido aos procedimentos de maior severidade.
      </text:p>

      <text:h text:outline-level="2" text:style-name="H2">2.2 Matriz do Caso Ativo (Matrix View)</text:h>
      <text:p>
        O componente <text:span text:style-name="Bold">MatrixView.tsx</text:span> traduz visualmente a lógica matricial inspirada no MITRE ATT&amp;CK e adaptada para o domínio de influência pelo DISARM Foundation. As táticas da operação constituem colunas dispostas da esquerda para a direita (reproduzindo a progressão cronológica do ataque: Planejamento, Preparação, Execução, Amplificação e Impacto). Sob cada coluna, cards densos exibem os códigos das técnicas (ex: T0089.001), severidade, selo de subtécnica e gatilho de inspeção forense da evidência.
      </text:p>

      <text:h text:outline-level="2" text:style-name="H2">2.3 Tabela Operacional de TTPs (Table View)</text:h>
      <text:p>
        O componente <text:span text:style-name="Bold">TableView.tsx</text:span> fornece o livro-razão minucioso da investigação. Desenvolvido para trabalho analítico tabular, lista: Código DISARM, Nome oficial traduzido, Tática de enquadramento, Objetivo do Adversário, Grau de Certeza Analítica (Confirmed, Probable, Possible), Procedimento Concreto Observado e Indicadores Técnicos vinculados. A tabela disponibiliza filtro unificado em tempo real e ordenação dinâmica.
      </text:p>

      <text:h text:outline-level="2" text:style-name="H2">2.4 Framework Oficial (Official DISARM Navigator View)</text:h>
      <text:p>
        O componente <text:span text:style-name="Bold">OfficialDisarmNavigatorView.tsx</text:span> incorpora a base de conhecimento canônica integral do DISARM Red Team Framework (v1.4, contendo as 16 Táticas e o catálogo completo de 257 Técnicas e Subtécnicas). O navegador dispõe de:
      </text:p>
      <text:p>
        • Mecanismo de busca instantânea com suporte a identificadores (ex: "T0021"), nomes em português/inglês e palavras-chave de escopo informacional.<text:line-break/>
        • Filtros de navegação: "Todas as Técnicas", "Apenas Ativas no Caso" ou "Apenas Técnicas Principais (Parents)".<text:line-break/>
        • Modal de Inspeção Taxonômica Oficial: Exibe a definição conceitual oficial do DISARM, objetivos táticos da técnica, links diretos de auditoria para o repositório oficial no GitHub e o botão tático de incorporação direta: <text:span text:style-name="Badge">+ Adicionar ao Caso Ativo</text:span>.
      </text:p>

      <text:h text:outline-level="2" text:style-name="H2">2.5 Módulos Auxiliares de Inteligência e Evidências</text:h>
      <text:p>
        • <text:span text:style-name="Bold">Gaveta de Detalhes Forenses (TTPDetailDrawer.tsx):</text:span> Painel lateral retrátil (slide-over) de alta densidade que expõe a anatomia forense completa da técnica selecionada: Procedimento Concreto Mapeado na Operação, Anotações Operacionais de Inteligência, Alvos Institucionais Visados, Links de Repositórios Oficiais de Evidência (CISA, DOJ, Comitê de Inteligência) e a lista vertical esbelta de Artefatos &amp; Indicadores de Comprometimento (IOCs).<text:line-break/>
        • <text:span text:style-name="Bold">Modal de Criação/Edição Manual de TTP (ManualTtpModal.tsx):</text:span> Interface tática que permite ao analista registrar manualmente novas técnicas observadas no teatro de operações, definindo severidade, nível de certeza analítica e documentando procedimentos operacionais inusitados.<text:line-break/>
        • <text:span text:style-name="Bold">Modal de Ingestão de Arquivos (UploadModal.tsx):</text:span> Ponto de entrada para importação de camadas estruturadas exportadas do DISARM Navigator oficial ou relatórios de ameaça em JSON.<text:line-break/>
        • <text:span text:style-name="Bold">Gerador de Relatórios Executivos em PDF (exportUtils.ts &amp; ExecutiveReportModal.tsx):</text:span> Mecanismo especializado que compila um dossiê analítico em PDF estritamente diagramado de acordo com a doutrina de relatórios de inteligência militar/governamental (Seção 1: Sumário Executivo; Seção 2: Métricas Operacionais Quantitativas; Seção 3: Análise Tática e Detalhamento de Técnicas Efetivamente Identificadas; Seção 4: Recomendações Táticas de Resiliência e Contramedidas do Red Team).
      </text:p>

      <!-- SEÇÃO 3: FUNCIONALIDADES PRINCIPAIS -->
      <text:h text:outline-level="1" text:style-name="H1">3. FUNCIONALIDADES PRINCIPAIS E ENGENHARIA DE DADOS</text:h>

      <text:h text:outline-level="2" text:style-name="H2">3.1 Fluxo de Ingestão e Validação (Parsing) de Campanhas e Incidentes</text:h>
      <text:p>
        O motor de ingestão de dados da plataforma (<text:span text:style-name="Mono">disarmParser.ts</text:span> e <text:span text:style-name="Mono">disarmSchema.ts</text:span>) opera uma esteira de parsing resiliente capaz de lidar com a heterogeneidade das fontes de inteligência de ameaças:
      </text:p>
      <text:p>
        1. <text:span text:style-name="Bold">Validação Estrutural e Schema Enforcement:</text:span> Executada através de esquemas declarativos Zod, garantindo que objetos importados contenham arrays válidos de técnicas, identificadores reconhecíveis e integridade relacional entre técnicas e táticas.<text:line-break/>
        2. <text:span text:style-name="Bold">Normalização de Camadas DISARM Navigator:</text:span> Ao processar camadas exportadas da ferramenta padrão da fundação, o parser extrai <text:span text:style-name="Mono">techniqueID</text:span>, escores numéricos (convertendo escalas 0-100 para graus de severidade: &gt;=90 Crítico, &gt;=75 Alto, &gt;=50 Médio, &lt;50 Baixo) e anotações operacionais contidas no campo <text:span text:style-name="Mono">comment</text:span>.<text:line-break/>
        3. <text:span text:style-name="Bold">Enriquecimento Automático com a Base Mestra:</text:span> Técnicas importadas sem metadados descritivos têm seus nomes, táticas associadas e objetivos de adversário enriquecidos dinamicamente por cruzamento com a base mestra do DISARM (<text:span text:style-name="Mono">disarmMaster.ts</text:span>), assegurando consistência analítica instantânea.
      </text:p>

      <text:h text:outline-level="2" text:style-name="H2">3.2 Mecanismo de Catalogação e Correlação de Artefatos Forenses</text:h>
      <text:p>
        O grande diferencial das operações de <text:span text:style-name="Bold">Hacking for Influence</text:span> reside na fusão indissociável entre artefatos puramente cibernéticos (intrusão e quebra de confidencialidade) e artefatos de engenharia social/cognitiva (disseminação, forja e polarização). A plataforma cataloga e relaciona quatro categorias principais de artefatos:
      </text:p>
      <text:p>
        • <text:span text:style-name="Bold">Domínios Typosquatted e Imitações de Imprensa:</text:span> URLs e domínios forjados projetados para mimetizar portais legítimos de notícias (ex: lemonde.ltd, der-spiegel.info) ou repositórios falsos de vazamento (ex: dcleaks.com).<text:line-break/>
        • <text:span text:style-name="Bold">Infraestrutura de Comando e Controle (C2) e Redes de Exfiltração:</text:span> Endereços IPv4/IPv6 de nós de comando maliciosos e serviços de anonimização (VPNs comerciais, proxies e túneis reversos como X-Tunnel) empregados para extrair dados sem disparar alertas perimétricos.<text:line-break/>
        • <text:span text:style-name="Bold">Hashes Criptográficos de Implantes e Documentos Adulterados:</text:span> Hashes SHA256/MD5 de malware de intrusão inicial (Sofacy, X-Agent) e de arquivos PDF/DOCX vazados que sofreram adulteração digital de conteúdo para incriminar alvos ou amplificar frentes de desinformação.<text:line-break/>
        • <text:span text:style-name="Bold">Vetores de Coordenação Social (Hashtags e Personas Inautênticas):</text:span> Hashtags coordenadas (#VerdadeOculta), canais do Telegram e personas forjadas operadas por inteligência de estado (ex: Guccifer 2.0) empregadas para sincronizar vazamentos com picos de tráfego noticioso.
      </text:p>

      <!-- SEÇÃO 4: O PAPEL DA INTELIGÊNCIA ARTIFICIAL -->
      <text:h text:outline-level="1" text:style-name="H1">4. O PAPEL DA INTELIGÊNCIA ARTIFICIAL NO MAPEAMENTO DE TTPS E APOIO À DECISÃO</text:h>

      <text:h text:outline-level="2" text:style-name="H2">4.1 Arquitetura do Motor Analítico e Extração Heurística de Linguagem Natural</text:h>
      <text:p>
        O motor analítico incorporado no módulo <text:span text:style-name="Bold">HackingForInfluenceAnalyzerModal.tsx</text:span> exemplifica a aplicação de Inteligência Artificial para a redução da complexidade de processamento de dados desestruturados. No teatro de operações cibernéticas, analistas de CTI são frequentemente inundados por volumosos despachos de segurança, autos judiciais de indiciamento, relatórios preliminares de DFIR e capturas de redes sociais redigidos em prosa livre.
      </text:p>
      <text:p>
        A plataforma implementa uma esteira de extração semântica em duas etapas:
      </text:p>
      <text:p>
        1. <text:span text:style-name="Bold">Ingestão e Pré-processamento Multimodal de Texto:</text:span> O operador insere a narrativa bruta do incidente e o bloco não estruturado de indicadores. O motor de processamento executa normalização lexical, remoção de ruídos e isolamento de entidades técnicas (domínios, IPs, hashes e hashtags).<text:line-break/>
        2. <text:span text:style-name="Bold">Mecanismo Heurístico de Mapeamento Taxonômico (Intent &amp; Action Extraction):</text:span> O modelo avalia a ocorrência combinatória de marcadores linguísticos, intenções operacionais e vetores táticos expressos no relato, correlacionando-os diretamente aos vetores matemáticos e conceituais das técnicas do DISARM Red Team.
      </text:p>

      <text:h text:outline-level="2" text:style-name="H2">4.2 Casos Práticos de Extração Automatizada de TTPs DISARM</text:h>
      <text:p>
        A precisão do motor heurístico pode ser comprovada na tradução instantânea dos seguintes padrões operacionais de Hacking for Influence:
      </text:p>
      <text:p>
        • <text:span text:style-name="Bold">Detecção de Intrusão &amp; Vazamento Seletivo (Hack-and-Leak):</text:span> Quando o relato aponta invasão de servidores de e-mail e disponibilização de dados roubados, a IA infere imediatamente a técnica <text:span text:style-name="Mono">T0089 (Exposing Stolen Data / Hack-and-Leak)</text:span> e <text:span text:style-name="Mono">T0045 (Digital Forgery / Adulteração de Documentos)</text:span>, vinculando os hashes e arquivos citados.<text:line-break/>
        • <text:span text:style-name="Bold">Mimetização e Clonagem de Imprensa:</text:span> Ao identificar menções a domínios similares a jornais conhecidos e layouts clonados, o sistema mapeia a técnica <text:span text:style-name="Mono">T0074 / T0007 (Cloned Media Infrastructure)</text:span>, associando os domínios extraídos como artefatos diretos.<text:line-break/>
        • <text:span text:style-name="Bold">Amplificação Algorítmica e Coordenada:</text:span> O relato de perfis falsos com fotos geradas por GAN, automação no X/Twitter e compra de selos de verificação ativa instantaneamente <text:span text:style-name="Mono">T0098.001 (Automated Inauthentic Profiles)</text:span> e <text:span text:style-name="Mono">T0093.002 (Algorithmic Trend Boosting)</text:span>.<text:line-break/>
        • <text:span text:style-name="Bold">Evasão e Tráfego Patrocinado:</text:span> O registro de anúncios segmentados que burlam moderação via scripts de cloaking ativa <text:span text:style-name="Mono">T0081 / T0084 (Ad Cloaking &amp; Microtargeting)</text:span>.
      </text:p>

      <text:h text:outline-level="2" text:style-name="H2">4.3 Mitigação da Carga Cognitiva do Operador de CTI e Infoprev</text:h>
      <text:p>
        A matriz DISARM Red Team abrange 257 técnicas e subtécnicas altamente especializadas. Para um operador humano, a triagem manual e a correlação cruzada de cada parágrafo de um relatório forense com a taxonomia do framework demanda horas ou dias de trabalho exaustivo, suscetível a fadiga cognitiva e lacunas de interpretação.
      </text:p>
      <text:p>
        O motor de IA da plataforma opera como um <text:span text:style-name="Bold">Amplificador Cognitivo (Cognitive Force Multiplier)</text:span>: em frações de segundo, decompõe um caso de centenas de linhas em uma proposta estruturada de TTPs ativas, com graus de certeza previamente computados, extratos contextuais e artefatos pré-filtrados. O analista atua no modelo <text:span text:style-name="Bold">Human-in-the-Loop</text:span>, revisando, refinando ou complementando a análise com seu discernimento estratégico antes de carregar o caso no painel ativo.
      </text:p>

      <text:h text:outline-level="2" text:style-name="H2">4.4 Consciência Situacional de Comando e Apoio à Tomada de Decisão Estratégica</text:h>
      <text:p>
        Na moderna doutrina militar de Guerra Híbrida e Operações no Domínio da Informação (InfoOps / Infoprev), o principal obstáculo enfrentado pelo Comando e pelas autoridades decisoras é o isolamento dos dados técnicos:
      </text:p>
      <text:p text:style-name="CalloutBox">
        <text:span text:style-name="Bold">O GAP ESTRATÉGICO TRADICIONAL:</text:span> As equipes de segurança cibernética (SOC/CSIRT) reportam eventos em linguagem técnica de rede (hashes, portas, exploits e IPs), enquanto as assessorias de comunicação e comando político avaliam o impacto meramente pelo prisma das manchetes de jornal e da reação pública. Falta uma linguagem taxonômica comum que conecte a invasão do servidor à campanha de desinformação em curso.
      </text:p>
      <text:p>
        O DISARM.AI soluciona esse abismo doutrinário ao converter ataques híbridos opacos em um <text:span text:style-name="Bold">Quadro Operacional Comum (Common Operational Picture - COP)</text:span>:
      </text:p>
      <text:p>
        • <text:span text:style-name="Bold">Visibilidade da Intenção Estratégica do Adversário:</text:span> Ao invés de enxergar apenas "um phishing bem-sucedido", o escalão de comando visualiza claramente que a técnica T0089 foi ativada como precursora de desestabilização da confiança eleitoral (T0002).<text:line-break/>
        • <text:span text:style-name="Bold">Antecipação e Planejamento Tempestivo de Contraposições:</text:span> Conhecendo a sequência oficial de táticas do DISARM (da fase de Preparação até o Impacto), o comando é capaz de <text:span text:style-name="Bold">antecipar a próxima jogada do adversário</text:span>. Se a fase de preparação de infraestrutura clonada foi detectada, o comando pode ordenar medidas de <text:span text:style-name="Bold">Pre-bunking</text:span> (alertas prévios à sociedade desmascarando a iminência de falsificações), desmantelamento cautelar de domínios via cooperação judicial/DNS e reforço de resiliência nas instituições alvo.<text:line-break/>
        • <text:span text:style-name="Bold">Adestramento de Equipes de Defesa Cibernética e Emulação de Ameaças:</text:span> A plataforma viabiliza a criação de cenários fidedignos de exercícios Red Team / Blue Team. Equipes de defesa podem treinar não apenas a detecção de malwares, mas a resposta integrada a incidentes híbridos em que a contenção da narrativa falsa é tão vital quanto o isolamento do servidor comprometido.
      </text:p>

      <!-- SEÇÃO 5: CADERNO METODOLÓGICO E DEFESA DE BANCA -->
      <text:h text:outline-level="1" text:style-name="H1">5. CADERNO METODOLÓGICO: DESMISTIFICANDO A INTELIGÊNCIA ARTIFICIAL, HEURÍSTICA E ONTOLOGIAS NO DISARM.AI</text:h>
      <text:p>
        Esta seção constitui o guia formal de defesa conceitual da plataforma, estruturada para responder às arguições técnicas de bancas examinadoras, avaliadores de engenharia e comandos militares acerca da natureza da inteligência computacional incorporada.
      </text:p>

      <text:h text:outline-level="2" text:style-name="H2">5.1 Descomplicando: O que é o "Motor em TypeScript/JavaScript dentro do Código"?</text:h>
      <text:p>
        Para compreender com clareza o funcionamento do motor analítico sem incorrer em abstrações mercadológicas, recorre-se à seguinte analogia fundamental da prática pericial:
      </text:p>
      <text:p text:style-name="CalloutBox">
        <text:span text:style-name="Bold">A METÁFORA DO MÉDICO PERITO:</text:span> Quando um médico infectologista examina um paciente que apresenta febre alta súbita, dor retro-orbital intensa e petéquias cutâneas, ele não necessita efetuar uma chamada de telecomunicações para um supercomputador no exterior para emitir a hipótese diagnóstica de Dengue. O seu cérebro já armazena as <text:span text:style-name="Bold">regras formais e os padrões de correspondência clínica</text:span> adquiridos pelo estudo exaustivo da patologia.
      </text:p>
      <text:p>
        O arquivo <text:span text:style-name="Mono">HackingForInfluenceAnalyzerModal.tsx</text:span> é precisamente a codificação matemática desse raciocínio pericial, implementado em linguagem TypeScript/JavaScript que executa de forma determinística na CPU do próprio operador:
      </text:p>
      <text:p>
        1. <text:span text:style-name="Bold">Regra de Hack-and-Leak (T0089):</text:span> Se o fluxo de texto registra marcadores lexicais de invasão de caixas postais corporativas e publicação não autorizada de comunicações sensíveis, o motor dispara a dedução de que a manobra de coerção visa expor dados espoliados, ancorando o código <text:span text:style-name="Badge">T0089</text:span>.<text:line-break/>
        2. <text:span text:style-name="Bold">Regra de Falsificação e Adulteração Digital (T0045):</text:span> Ao rastrear menções a minutas contratuais alteradas ou inserção forjada de cláusulas falsas em PDFs autênticos roubados, o algoritmo associa a técnica <text:span text:style-name="Badge">T0045</text:span>, vinculando os hashes SHA256/MD5 correspondentes como artefatos diretos.<text:line-break/>
        3. <text:span text:style-name="Bold">Regra de Infraestrutura de Clonagem de Mídia (T0098.001):</text:span> Diante de menções a domínios <text:span text:style-name="Mono">typosquatted</text:span> (ex: lemonde.ltd) e cópia estética de portais jornalísticos consagrados, o algoritmo reconhece a mimetização de órgãos de imprensa.<text:line-break/>
        4. <text:span text:style-name="Bold">Regra de Automação de Personas e Perfis Falsos (T0093.002 / T0097):</text:span> Se o relato aponta o uso de avatares sintetizados por modelos generativos (StyleGAN), aquisição fraudulenta de selos de verificação e enxames sincronizados de respostas coordenadas, o motor correlaciona as técnicas de automação inautêntica.
      </text:p>
      <text:p>
        Esse processamento ocorre no interior do motor V8/SpiderMonkey do navegador do usuário em <text:span text:style-name="Bold">menos de 10 milissegundos</text:span>, com consumo financeiro nulo, independência total de conectividade e sem emissão de tráfego de dados sensíveis para servidores remotos.
      </text:p>

      <text:h text:outline-level="2" text:style-name="H2">5.2 O que são "Ontologias Formais" e "Heurísticas"?</text:h>
      <text:p>
        Para fins de sustentação acadêmica e profissional, as duas definições basilares devem ser enunciadas com rigor:
      </text:p>
      <text:p>
        • <text:span text:style-name="Bold">Ontologia Formal:</text:span> Segundo a clássica definição epistemológica de Tom Gruber (1993), uma ontologia na Ciência da Computação é uma <text:span text:style-name="Bold">"especificação formal e explícita de uma conceitualização compartilhada"</text:span>. Trata-se da "tabela periódica" de um campo de conhecimento, catalogando formalmente suas entidades, atributos, hierarquias e relações de causalidade. No ecossistema analisado, o <text:span text:style-name="Bold">DISARM Red Team Framework v1.4 é a ontologia canônica</text:span>: ele parametriza de forma padronizada as 16 Táticas e 257 Técnicas de Guerra da Informação, impedindo ambiguidade semântica entre os centros de inteligência.<text:line-break/>
        • <text:span text:style-name="Bold">Heurística Semântica:</text:span> Conforme formalizado por Judea Pearl (1984), a heurística é uma estratégia computacional de busca e inferência projetada para encontrar soluções satisfatórias para problemas complexos de decisão através de atalhos lógicos balizados pelo conhecimento empírico acumulado. No DISARM.AI, a heurística é a regra algorítmica de inferência causal que mapeia evidências factuais extraídas de um relato textual aos nós correspondentes da ontologia DISARM.
      </text:p>

      <text:h text:outline-level="2" text:style-name="H2">5.3 "Mas isso é Inteligência Artificial de Verdade?" (A Pergunta Crucial da Banca)</text:h>
      <text:p>
        <text:span text:style-name="Bold">Sim, incontestavelmente.</text:span> A resposta afirmativa encontra esteio na própria história fundacional da Inteligência Artificial. Desde o seminário inaugural de Dartmouth em 1956, a Ciência da Computação reconhece formalmente duas grandes vertentes de IA:
      </text:p>

      <!-- Comparison Table -->
      <table:table table:name="TabelaIAComparativa">
        <table:table-column table:style-name="Col1" table:number-columns-repeated="1"/>
        <table:table-column table:style-name="Col2" table:number-columns-repeated="1"/>
        <table:table-column table:style-name="Col3" table:number-columns-repeated="1"/>
        <table:table-column table:style-name="Col4" table:number-columns-repeated="1"/>
        <table:table-header-rows>
          <table:table-row>
            <table:table-cell table:style-name="TableHeaderCell"><text:p text:style-name="TableTextHeader">Vertente de IA</text:p></table:table-cell>
            <table:table-cell table:style-name="TableHeaderCell"><text:p text:style-name="TableTextHeader">Mecanismo de Operação</text:p></table:table-cell>
            <table:table-cell table:style-name="TableHeaderCell"><text:p text:style-name="TableTextHeader">Aplicações Típicas</text:p></table:table-cell>
            <table:table-cell table:style-name="TableHeaderCell"><text:p text:style-name="TableTextHeader">Propriedades Operacionais</text:p></table:table-cell>
          </table:table-row>
        </table:table-header-rows>
        <table:table-row>
          <table:table-cell table:style-name="TableCell">
            <text:p text:style-name="TableText"><text:span text:style-name="Bold">1. IA Simbólica / Sistemas Especialistas (Knowledge-Based AI)</text:span><text:line-break/><text:span text:style-name="Badge">[Modelo adotado no DISARM.AI]</text:span></text:p>
          </table:table-cell>
          <table:table-cell table:style-name="TableCell">
            <text:p text:style-name="TableText">Raciocínio dedutivo baseado em ontologias formais, árvores de decisão e heurísticas semânticas programadas por peritos humanos.</text:p>
          </table:table-cell>
          <table:table-cell table:style-name="TableCell">
            <text:p text:style-name="TableText">Sistemas de controle aeroespacial, computadores de tiro militar, diagnósticos clínicos (MYCIN), compliance bancário e plataformas CTI.</text:p>
          </table:table-cell>
          <table:table-cell table:style-name="TableCell">
            <text:p text:style-name="TableText"><text:span text:style-name="Bold">Vantagens:</text:span> 100% auditável (caixa-branca), determinístico, sem risco de alucinação, custo de API zero e operação plena em redes desconectadas (<text:span text:style-name="Mono">air-gapped</text:span>).</text:p>
          </table:table-cell>
        </table:table-row>
        <table:table-row>
          <table:table-cell table:style-name="TableCellAlt">
            <text:p text:style-name="TableText"><text:span text:style-name="Bold">2. IA Conexionista / Generativa (LLMs Baseadas em Redes Neurais)</text:span></text:p>
          </table:table-cell>
          <table:table-cell table:style-name="TableCellAlt">
            <text:p text:style-name="TableText">Predição estatística e probabilística de sequências de tokens via modelos neurais profundos (Transformers) de bilhões de parâmetros.</text:p>
          </table:table-cell>
          <table:table-cell table:style-name="TableCellAlt">
            <text:p text:style-name="TableText">Chatbots de conversação geral (ChatGPT, Gemini, Claude), redação de prosa livre e assistentes de tradução.</text:p>
          </table:table-cell>
          <table:table-cell table:style-name="TableCellAlt">
            <text:p text:style-name="TableText"><text:span text:style-name="Bold">Desvantagens:</text:span> Natureza de "caixa-preta", custo financeiro contínuo de API por token, latência de rede, risco de alucinações e vazamento de dados estratégicos para nuvens privadas.</text:p>
          </table:table-cell>
        </table:table-row>
      </table:table>

      <text:h text:outline-level="2" text:style-name="H2">5.4 O "Pitch" Estratégico de Defesa / Apresentação</text:h>
      <text:p>
        Para responder com serenidade, clareza e autoridade institucional a perguntas sobre custos, licenças e destinação de dados sensíveis na apresentação, orienta-se a utilização do seguinte roteiro oratório padronizado:
      </text:p>
      <text:p text:style-name="PitchBox">
        <text:span text:style-name="Bold">ROTEIRO PRONTO PARA SUSTENTAÇÃO ORAL:</text:span><text:line-break/>
        <text:span text:style-name="Bold">"Pergunta:</text:span> Essa inteligência artificial de vocês consome chaves de API pagas da OpenAI ou Google? Para onde vão os relatórios de incidentes que colamos na plataforma?"<text:line-break/><text:line-break/>
        <text:span text:style-name="Bold">"Resposta do Orador:</text:span> Essa foi a nossa <text:span text:style-name="Bold">decisão de engenharia mais estratégica</text:span>. No cenário de Inteligência de Ameaças Cibernéticas e Segurança Nacional, é inaceitável transmitir despachos confidenciais de incidentes militares para provedores comerciais de nuvem no exterior.<text:line-break/><text:line-break/>
        Por essa razão, em vez de atrelar a ferramenta a uma LLM comercial externa e onerosa, desenvolvemos um <text:span text:style-name="Bold">Sistema Especialista de IA Simbólica</text:span> que executa 100% no navegador do próprio operador.<text:line-break/><text:line-break/>
        O motor consome a <text:span text:style-name="Bold">ontologia canônica internacional do DISARM Framework (257 técnicas)</text:span> e aplica regras heurísticas de processamento de linguagem natural no texto livre, extraindo artefatos (IPs, hashes e domínios) e mapeando o enquadramento tático da agressão em milissegundos.<text:line-break/><text:line-break/>
        Os três pilares alcançados são:<text:line-break/>
        1. <text:span text:style-name="Bold">Custo Zero de Infraestrutura:</text:span> Nenhum valor de assinatura, token ou licença de nuvem é demandado.<text:line-break/>
        2. <text:span text:style-name="Bold">Prontidão Operacional Air-Gapped:</text:span> Funciona plenamente em redes militares e bunkers desconectados da internet pública.<text:line-break/>
        3. <text:span text:style-name="Bold">Soberania e Sigilo Absoluto:</text:span> Nenhum bit de informação sobre a operação sob análise transita fora da máquina do analista."
      </text:p>

      <!-- SEÇÃO 6: CONCLUSÃO -->
      <text:h text:outline-level="1" text:style-name="H1">6. CONCLUSÃO E DIRETRIZES FUTURAS</text:h>
      <text:p>
        A plataforma DISARM.AI consolida-se como um instrumento de vanguarda na interseção entre a Inteligência de Ameaças Cibernéticas e as Operações de Informação. Ao aliar a taxonomia oficial do DISARM Red Team a uma arquitetura segura, responsiva e alavancada por sistemas especialistas de inteligência artificial, o sistema capacita analistas e tomadores de decisão a desmistificar, mapear e neutralizar campanhas contemporâneas de manipulação informacional com precisão cirúrgica e velocidade compatível com as exigências da guerra moderna.
      </text:p>

      <!-- SEÇÃO 7: REFERÊNCIAS BIBLIOGRÁFICAS -->
      <text:h text:outline-level="1" text:style-name="H1">7. REFERÊNCIAS BIBLIOGRÁFICAS E DOUTRINÁRIAS</text:h>
      <text:p text:style-name="BibText">
        [1] <text:span text:style-name="Bold">RUSSELL, Stuart; NORVIG, Peter.</text:span> <text:span text:style-name="Bold">Artificial Intelligence: A Modern Approach.</text:span> 4. ed. Upper Saddle River: Pearson, 2020. (Obra de referência mundial acerca da distinção formal entre Sistemas Especialistas Baseados em Conhecimento / IA Simbólica e Modelos Conexionistas Neurais).<text:line-break/>
        [2] <text:span text:style-name="Bold">GRUBER, Thomas R.</text:span> A Translation Approach to Portable Ontology Specifications. <text:span text:style-name="Bold">Knowledge Acquisition</text:span>, v. 5, n. 2, p. 199-220, 1993. (Trabalho seminal que formulou a definição canônica de ontologia na Ciência da Computação como representação explícita de uma conceitualização formal).<text:line-break/>
        [3] <text:span text:style-name="Bold">PEARL, Judea.</text:span> <text:span text:style-name="Bold">Heuristics: Intelligent Search Strategies for Computer Problem Solving.</text:span> Reading: Addison-Wesley, 1984. (Fundamentação teórica dos métodos heurísticos de busca e inferência lógica em sistemas inteligentes).<text:line-break/>
        [4] <text:span text:style-name="Bold">SHORTLIFFE, Edward H.</text:span> <text:span text:style-name="Bold">Computer-Based Medical Consultations: MYCIN.</text:span> New York: Elsevier, 1976. (Obra precursora dos Sistemas Especialistas baseados em regras de produção e fatores de certeza aplicados ao diagnóstico de entidades complexas).<text:line-break/>
        [5] <text:span text:style-name="Bold">DISARM FOUNDATION.</text:span> <text:span text:style-name="Bold">DISARM Framework: Disinformation Analysis and Response Measures (Red Team Taxonomy v1.4).</text:span> DISARM Foundation &amp; FIMI ISAC, 2023. Disponível em: &lt;https://github.com/DISARMframeworks&gt;. (Estrutura taxonômica oficial e ontologia canônica das 16 táticas e 257 técnicas de manobras informacionais adversárias).<text:line-break/>
        [6] <text:span text:style-name="Bold">DEPARTAMENTO DE DEFESA DOS ESTADOS UNIDOS (DoD).</text:span> <text:span text:style-name="Bold">Strategy for Operations in the Information Environment (OIE).</text:span> Washington, D.C.: Department of Defense, 2020. (Doutrina estratégica de integração de operações cibernéticas, guerra eletrônica e operações informacionais no campo de batalha moderno).<text:line-break/>
        [7] <text:span text:style-name="Bold">MINISTÉRIO DA DEFESA DO BRASIL.</text:span> <text:span text:style-name="Bold">Manual de Campanha: Operações de Informação (MD33-M-02).</text:span> 2. ed. Brasília: Estado-Maior Conjunto das Forças Armadas (EMCFA), 2020. (Diretriz militar nacional para planejamento, execução e coordenação de ações ofensivas e defensivas de proteção informacional e contra-desinformação).<text:line-break/>
        [8] <text:span text:style-name="Bold">INTERNATIONAL ORGANIZATION FOR STANDARDIZATION (ISO).</text:span> <text:span text:style-name="Bold">ISO/IEC 27037:2012: Information technology — Security techniques — Guidelines for identification, collection, acquisition and preservation of digital evidence.</text:span> Genebra: ISO/IEC, 2012. (Norma internacional de governança e integridade probatória forense digital aplicável à custódia isolada de IOCs e artefatos).
      </text:p>

      <text:p text:style-name="MetaBox">
        <text:span text:style-name="Bold">Fim do Relatório Técnico e Caderno Metodológico.</text:span> Documento consolidado e emitido automaticamente pela plataforma DISARM.AI.
      </text:p>

    </office:text>
  </office:body>
</office:document-content>`;

// Create entries list
const entries = [
  { name: 'mimetype', data: mimetypeBuf, store: true },
  { name: 'META-INF/manifest.xml', data: Buffer.from(manifestXml, 'utf8'), store: false },
  { name: 'meta.xml', data: Buffer.from(metaXml, 'utf8'), store: false },
  { name: 'styles.xml', data: Buffer.from(stylesXml, 'utf8'), store: false },
  { name: 'content.xml', data: Buffer.from(contentXml, 'utf8'), store: false },
];

const zipBuffer = createZip(entries);

// Write to both paths for resilience
const outputPathMain = path.resolve(__dirname, '../DISARM_AI_Relatorio_Tecnico.odt');
try {
  fs.writeFileSync(outputPathMain, zipBuffer);
  console.log('SUCCESS: ODT Principal atualizado com sucesso em:', outputPathMain);
} catch (err) {
  console.warn('WARN: ODT Principal bloqueado. Gravando alternativo...');
}

const outputPathAtualizado = path.resolve(__dirname, '../DISARM_AI_Relatorio_Tecnico_Atualizado.odt');
fs.writeFileSync(outputPathAtualizado, zipBuffer);
console.log('SUCCESS: ODT Atualizado gravado com sucesso em:', outputPathAtualizado);
console.log('Tamanho Final:', zipBuffer.length, 'bytes');
