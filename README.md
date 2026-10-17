# DISARM.AI — Hacking for Influence & Threat Analysis Dashboard
### Plataforma Tática de Análise de Ameaças Informacionais, Guerra Híbrida e Mapeamento de TTPs (DISARM Red Team Framework)

O **DISARM.AI** é uma plataforma analítica moderna, soberana e de alta prontidão operacional, projetada especificamente para analistas de **Cyber Threat Intelligence (CTI)**, operadores de **Operações de Informação (InfoOps/PsyOps)** e comandos de **Defesa Cibernética**.

A aplicação materializa operacionalmente a taxonomia e as ontologias do **DISARM Red Team Framework (v1.4)** — mantido pela *DISARM Foundation* — permitindo diagnosticar, mapear, decompor e mitigar campanhas complexas de **Hacking for Influence (HFI)**, operações *Hack-and-Leak*, desinformação coordenada e manipulação cognitiva.

---

## ⚡ Pilares Arquiteturais & Filosofia Operacional

1. **Arquitetura 100% Client-Side (*Zero-Cloud Trust* & *Air-Gap Ready*):**
   - Todo o processamento analítico, parse de arquivos, renderização visual e extração heurística de ameaças ocorrem **exclusivamente no navegador do analista (motor V8)**.
   - Nenhum byte de dados confidenciais, relatos de inteligência ou indicadores de comprometimento trafega para servidores de terceiros ou nuvens comerciais externas.
   - Compatibilidade total com redes militares isoladas (*air-gapped*).

2. **Inteligência Artificial Simbólica & Heurística Semântica Nativa:**
   - O motor analítico embutido ([`HackingForInfluenceAnalyzerModal.tsx`](src/components/HackingForInfluenceAnalyzerModal.tsx)) opera como um **Sistema Especialista Baseado em Conhecimento**.
   - Processa relatos de incidentes em linguagem natural bruta, extrai automaticamente Indicadores de Comprometimento (IOCs) e aplica regras dedutivas para mapear TTPs DISARM correspondentes com nível de confiança e justificativa tática.
   - **Custo Zero & Zero Alucinação:** Não depende de tokens, chaves de API pagas ou modelos probabilísticos do tipo "caixa-preta".

3. **Ontologia Canônica DISARM Foundation:**
   - Integração completa da base canônica DISARM: **16 Táticas Oficiais** e **391 Técnicas** (103 Top-level + 288 Subtécnicas).
   - Suporte a identificadores canônicos oficiais e camadas JSON compatíveis com o ecossistema DISARM Navigator e MISP.

4. **Tradução Literal Estrita (1:1 com a DISARM Foundation):**
   - Dicionário técnico bilíngue fiel ao pé da letra ([`disarmTranslations.ts`](src/utils/disarmTranslations.ts)), garantindo que nenhum conceito doutrinário seja distorcido ou adaptado.
   - Alternância ágil entre `Tradução Literal (PT-BR)` e `Ver Original (EN)` com selo de conformidade normativa.

---

## 🖥️ Visões e Funcionalidades Principais

A interface foi estruturada em 4 abas operacionais táticas, complementadas por módulos analíticos avançados:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  DISARM.AI RED TEAM  │ Caso Ativo: [Operação Real 2016...] [Salvar] │ [Analisar Caso] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  [ Visão Geral & Métricas ]  [ Matriz do Caso Ativo ]  [ Tabela TTPs ]  [ DISARM Red ] │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1. Visão Geral & Métricas (`OverviewDashboard`)
* **Sumário Executivo:** Identificação do ator atribuído, severidade global (`CRITICAL`, `HIGH`, `MEDIUM`), escopo geográfico e setores impactados.
* **Bento Cards Métricos:**
  * **Táticas Cobertas:** Percentual de cobertura na matriz DISARM (ex: 7/16 fases mobilizadas).
  * **Técnicas Mapeadas:** Total de técnicas mobilizadas com segmentação por criticidade.
  * **Procedimentos em Evidência:** Contagem de notas de campo e evidências forenses.
  * **Artefatos e IOCs:** Inventário de domínios *typosquatted*, hashes SHA-256, IPs de C2 e hashtags.
* **Rastreador Horizontal das 16 Táticas (TA01 a TA16):** Régua tática com contadores dinâmicos e filtros reativos de 1 clique.
* **Concentração de Técnicas por Tática:** Gráfico de barras tático demonstrando onde o ataque concentra seus esforços.
* **Vitrine de Vetores Críticos:** Cards de acesso rápido às técnicas de severidade máxima para resposta tempestiva.

### 2. Matriz do Caso Ativo (`MatrixView`)
* Visualização matricial analítica inspirada no DISARM Navigator, exibindo exclusivamente as colunas táticas mobilizadas no caso em investigação.
* Códigos de cores táticos por severidade, busca textual instantânea e acesso imediato aos detalhes da técnica.

### 3. Tabela Operacional de TTPs (`TableView`)
* Listagem tabular detalhada de todas as TTPs do caso, com ordenação por identificador (`T0089`, `T0098.001`), tática, severidade, nível de confiança analítica e notas de procedimento.
* Filtros rápidos por severidade e busca contextual de evidências.

### 4. DISARM Red Framework — DISARM Navigator v4.8.2 (`OfficialDisarmNavigatorView`)
* **Navegador Canônico Completo:** Horizontal board com as **16 Táticas** e **391 Técnicas Oficiais** do DISARM Framework.
* **Controles Operacionais:**
  * Alternância entre exibição de **Todas as 391 Técnicas** ou **Apenas as do Caso Ativo**.
  * Botões de **Expandir Subtécnicas** e **Recolher Subtécnicas**.
  * Busca por código de técnica, nome ou termos conceituais.
  * Indicadores de presença no caso ativo com realce em anéis coloridos e badges.
  * Links diretos para as páginas oficiais da DISARM Foundation no GitHub.

---

## 🔬 Módulos Auxiliares de Inteligência

### 🧠 Analisador de Hacking for Influence (`Analisar Caso`)
* **Principal fluxo de entrada da ferramenta**, localizado no cabeçalho.
* Permite ao analista colar relatos de incidentes em linguagem natural bruta e listas de IOCs.
* O motor algorítmico extrai os artefatos técnicos por regex estrito (domínios, IPs, hashes, URLs, hashtags) e deduz as técnicas DISARM aplicáveis.
* Permite revisar, selecionar ou desmarcar propostas antes de incorporá-las ao caso ativo com 1 clique.

### 📑 Gaveta Lateral de Detalhes da TTP (`TTPDetailDrawer`)
* **Definição Canônica Oficial:** Texto oficial da técnica com alternância para tradução literal estrita em português.
* **Objetivo do Adversário:** Finalidade operacional do ator hostil.
* **Evidência Operacional (Procedimento Mapeado):** Fatos observados no incidente analisado, URLs de evidência com validação de formato e cópia rápida de IOCs.
* **Mitigações e Contramedidas Recomendadas:** Catálogo estruturado de respostas (*Counter-Narrative, Technical Attribution, Platform Takedown, Prebunking/Inoculation, Forensics*).

### 📤 Exportação Direta de Relatórios de Inteligência
* **Exportação PDF em 1 Clique:** Geração imediata de relatório executivo em PDF de padrão profissional formatado via `jsPDF` e `jspdf-autotable`.
* **Exportação Markdown (`.md`):** Arquivo estruturado para integração em documentações táticas.
* **Exportação JSON:** Camada de dados completa para interoperabilidade entre estações.

---

## 💻 Ecossistema Tecnológico

| Componente | Tecnologia Empregada | Finalidade |
| :--- | :--- | :--- |
| **Core Framework** | React 18 + TypeScript | Renderização declarativa e tipagem estrita de TTPs e campanhas |
| **Build Tool** | Vite 5 | Bundling ultrarrápido com Hot Module Replacement (HMR) |
| **Estilização** | Tailwind CSS | Design System dark mode tático (`#090A0F`, slate, cyan, crimson) |
| **Visualização** | Recharts | Gráficos responsivos de distribuição e cobertura tática |
| **Ícones** | Lucide React | Iconografia operacional militar e analítica |
| **Exportação PDF** | jsPDF + jsPDF-AutoTable | Síntese de relatórios operacionais para impressão e comando |
| **Validação de Dados**| Zod | Parsing defensivo de esquemas JSON de camadas DISARM |

---

## 📂 Estrutura de Diretórios

```
disarm-threat-dashboard/
├── src/
│   ├── types/
│   │   └── disarm.ts                   # Interfaces TypeScript (Campaign, Technique, Mitigation)
│   ├── data/
│   │   ├── officialDisarmData.ts       # Base canônica DISARM (16 Táticas e 391 Técnicas)
│   │   └── mockDisarmData.ts           # Casos reais modelados (DNC/Podesta 2016 Hack-and-Leak)
│   ├── utils/
│   │   ├── disarmTranslations.ts       # Dicionário de tradução literal estrita (PT-BR)
│   │   ├── exportUtils.ts              # Utilitários de exportação (PDF, Markdown, JSON)
│   │   └── disarmParser.ts             # Parser de camadas e cálculo de métricas
│   ├── components/
│   │   ├── Header.tsx                  # Barra de comando, seletor de casos e botões de ação
│   │   ├── OverviewDashboard.tsx       # Visão geral, régua tática TA01-TA16 e gráficos
│   │   ├── MatrixView.tsx              # Matriz analítica do caso ativo
│   │   ├── TableView.tsx               # Tabela operacional filtrável de TTPs
│   │   ├── OfficialDisarmNavigatorView.tsx # DISARM Navigator v4.8.2 completo
│   │   ├── HackingForInfluenceAnalyzerModal.tsx # Motor de IA Simbólica / Heurística
│   │   ├── TTPDetailDrawer.tsx         # Gaveta detalhada de procedimentos e mitigações
│   │   ├── UploadModal.tsx             # Modal de ingestão de JSON / Camadas Navigator
│   │   └── ManualTtpModal.tsx          # Cadastro e edição manual de TTPs
│   ├── App.tsx                         # Orquestrador da aplicação e gerenciador de estado
│   └── main.tsx                        # Ponto de entrada React
├── package.json
└── tailwind.config.js
```

---

## 🚀 Instalação e Execução

### Pré-requisitos
* **Node.js** (v18 ou superior)
* **npm** ou **yarn**

### 1. Clonar o repositório
```bash
git clone https://github.com/cybersailor-war/disarm-threat-dashboard.git
cd disarm-threat-dashboard
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Executar o servidor de desenvolvimento
```bash
npm run dev
```
Acesse a aplicação no seu navegador: 👉 **http://localhost:5173**

### 4. Build de Produção
```bash
npm run build
```
Os artefatos otimizados serão compilados no diretório `/dist`.

---

## 📜 Referências e Alinhamento Doutrinário
* **DISARM Foundation:** *DISARM Red Team Framework (v1.4)*. Taxonomy and Model for Information Operations and Disinformation Tactics, Techniques, and Procedures (TTPs).
* **DoD (United States):** *Strategy for Operations in the Information Environment (OIE)*, 2023.
* **Ministério da Defesa (Brasil):** *MD33-M-02: Manual de Operações de Informação*, 2ª Edição, 2021.
* **Russell, S.; Norvig, P.:** *Artificial Intelligence: A Modern Approach*, 4th ed., Pearson, 2020.
