# DISARM Red Team Threat Analysis Dashboard - Hacking for Influence

Plataforma analítica moderna focada em operações de **Hacking for Influence** e análise operacional de ameaças informacionais, desenhada e estruturada segundo as especificações do **DISARM Red Team Framework** (DISARM Foundation).

---

## 🚀 Tecnologias Utilizadas
- **Framework:** React 18 + TypeScript + Vite
- **Estilização:** Tailwind CSS (Dark Mode estrito / Tactical Palette)
- **Ícones:** Lucide Icons
- **Visualização de Dados:** Recharts (Distribuição Tática, Métricas e Severidade)
- **Validação de Esquemas:** Zod (Validação de camadas JSON do DISARM Navigator e MISP-DISARM)
- **Tipografia:** Inter (texto corrido) e JetBrains Mono (identificadores técnicos: `T0038`, `TA01`, `IOCs`)

---

## 🛡️ Estética & Design System (Dark Tactical Clean)
- **Fundo Principal:** Preto profundo carvão (`#090A0F`)
- **Superfícies/Cards:** Cinza ardósia escuro (`#111827`, com bordas sutis `rgba(255, 255, 255, 0.08)`)
- **Acentos Táticos:**
  - Azul/Ciano Fosco (`#38BDF8` / `#0284C7`)
  - Vermelho Carmesim Tático (`#EF4444`) para destaques e severidades críticas
  - Âmbar Operacional (`#F59E0B`) e Verde Esmeralda (`#10B981`)

---

## 📦 Funcionalidades Implementadas

### 1. Ingestão de Arquivo (Upload & Parsing Zod)
- **Drag-and-Drop:** Zona intuitiva para arquivos `.json` exportados do DISARM Navigator ou MISP-DISARM.
- **Validador de Esquema Zod:** Identifica automaticamente o formato da camada, versão do DISARM, técnicas ativas, pontuações e anotações operacionais.
- **Carregamento Imediato:** Botão de 1 clique para carregar amostras de teste pré-configuradas (*Doppelgänger* e *Ghostwriter*) ou baixar o arquivo `.json` de camada para testes locais.

### 2. Dashboard de Visão Geral (Overview)
- **Resumo Executivo da Campanha:** Indicador de Severidade Geral (`CRITICAL`, `HIGH`, `MEDIUM`), Ator Atribuído (ex: *Social Design Agency / Structura*), Regiões e Setores Alvo.
- **4 Bento Cards Métricos:**
  - Táticas DISARM Cobertas (ex: 7/16) com barra percentual de matriz.
  - Técnicas Mapeadas (100% tipadas com contagem por severidade).
  - Procedimentos em Evidência (notas analíticas e nível de confiança).
  - Artefatos e IOCs Catalogados (domínios typosquatted, IPs, hashes e contas).
- **Rastreador de Táticas Oficiais DISARM (TA01 a TA16):**
  - Sequência horizontal e interativa das 16 táticas do DISARM Red Team.
  - Indicadores de status mobilizado, contadores de técnicas e filtro imediato ao clicar.
- **Gráficos Táticos:**
  - Distribuição de Técnicas por Tática DISARM (Bar Chart com tema escuro).
  - Vitrine de Vetores Críticos de Maior Risco com acesso rápido para inspeção.

### 3. Módulo Especial: Hacking for Influence Analyzer
- **Analisador Cognitivo e de Influência:** Avaliação focada na convergência entre invasão cibernética, vazamentos direcionados (*hack-and-leak*) e manipulação psicológica de narrativas.
- **Indicadores Estratégicos:** Métricas de amplificação, canais de distribuição e vetores de exploração cognitiva.

### 4. Navegador e Explorador de TTPs
- **Navegador Oficial DISARM (v4):**
  - Matriz completa do DISARM Foundation com 16 táticas e 77+ técnicas oficiais carregadas do STIX 2.1.
  - Busca textual instantânea (por ID, nome, notas operacionais ou artefatos) e filtro de severidade.
- **Tabela Operacional de TTPs:**
  - Visualização tabular estruturada com ordenação por colunas (ID, Nome, Tática, Severidade, Score).
  - Botão de cópia rápida de ID com 1 clique.
- **Cadastro e Edição Manual de TTPs:**
  - Modal interativo para adicionar novas técnicas ou editar procedimentos e evidências da campanha.
- **Gaveta de Detalhes da TTP (TTP Detail Drawer):**
  - **Objetivo do Adversário:** Destaque em card tático com ícone de mira.
  - **Definição Conceitual DISARM:** Explicação detalhada da técnica.
  - **Procedimento Mapeado (Evidência Operacional):** Trecho analítico real, artefatos/IOCs com botão de cópia, URLs de evidência, entidades visadas e nível de confiança.
  - **Mitigações e Contramedidas:** Categorizadas em *Counter-Narrative*, *Technical Attribution*, *Platform Takedown*, *De-amplification*, *Prebunking / Inoculation* e *Forensics*, com lista de passos de ação.

### 5. Exportação & Relatórios
- **Relatório Executivo Completo:** Modal com sumário estratégico, métricas operacionais e inventário completo de TTPs com evidências e mitigações.
- **Exportação em Markdown (`.md`):** Download direto do relatório formatado para documentação ou compartilhamento rápido.
- **Impressão / PDF:** Folha de estilos otimizada para `@media print` pronta para salvar em PDF de alta qualidade.
- **Exportação JSON:** Download da campanha completa estruturada.

---

## 📁 Estrutura do Projeto
```
/
├── index.html                   # HTML base com fontes Inter e JetBrains Mono
├── package.json                 # Dependências e scripts
├── tailwind.config.js           # Tokens e paleta tática dark clean
├── vite.config.ts               # Configuração do Vite com aliases
└── src/
    ├── types/disarm.ts          # Tipos TypeScript para campanhas, TTPs, evidências e mitigações
    ├── schema/disarmSchema.ts   # Esquemas Zod para validação de exports DISARM
    ├── data/
    │   ├── disarmMaster.ts      # Base de conhecimento de táticas, técnicas e mitigações padrão
    │   ├── mockDisarmData.ts    # Datasets mock pré-configurados (Doppelgänger e Ghostwriter)
    │   ├── officialDisarmData.ts# Base oficial do DISARM Foundation (STIX 2.1)
    │   ├── DISARM.json          # Dataset oficial DISARM
    │   └── DISARM_LIVE.json     # Dataset oficial DISARM atualizado
    ├── utils/
    │   ├── disarmParser.ts      # Parser, conversor de camadas e agregador de métricas
    │   └── exportUtils.ts       # Geradores de Markdown, download de arquivos e impressão
    ├── components/
    │   ├── Header.tsx           # Barra superior com seletor de campanha, upload e exports
    │   ├── OverviewDashboard.tsx# Visão geral, rastreador de táticas DISARM e gráficos Recharts
    │   ├── MatrixView.tsx       # Matriz interativa no estilo DISARM Navigator
    │   ├── OfficialDisarmNavigatorView.tsx # Navegador oficial DISARM v4
    │   ├── TableView.tsx        # Tabela operacional filtrável e ordenável
    │   ├── TTPDetailDrawer.tsx  # Gaveta lateral detalhada da técnica/procedimento
    │   ├── ManualTtpModal.tsx   # Modal de cadastro/edição manual de TTPs
    │   ├── HackingForInfluenceAnalyzerModal.tsx # Analisador Hacking for Influence
    │   ├── UploadModal.tsx      # Modal de upload drag-and-drop com validação Zod
    │   └── ExecutiveReportModal.tsx # Relatório executivo para impressão/PDF e Markdown
    ├── App.tsx                  # Orquestrador da aplicação e gerenciador de abas
    ├── main.tsx                 # Ponto de entrada React
    └── index.css                # Estilização global, scrollbars e regras de impressão
```

---

## 🛠️ Como Executar Localmente

Basta executar esses comandos:

```bash
npm install
npm run dev
```

E acessar a página no navegador:
👉 **http://localhost:5173/**

