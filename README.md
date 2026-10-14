# DISARM Red Team Threat Analysis Dashboard

Plataforma analítica moderna, focada em análise operacional de ameaças informacionais (FIMI - *Foreign Information Manipulation and Interference*), desenhada segundo as especificações do **DISARM Red Team Framework** (DISARM Foundation).

---

## 🚀 Tecnologias Utilizadas
- **Framework:** React 18 + TypeScript + Vite
- **Estilização:** Tailwind CSS (Dark Mode estrito / Tactical Palette)
- **Ícones:** Lucide Icons
- **Visualização de Dados:** Recharts (Distribuição Tática, Cadeia de Influência e Métricas)
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
- **Carregamento Imediato:** Botão de 1 clique para carregar amostras de teste pré-configuradas ou baixar o arquivo `.json` de camada para testes locais.

### 2. Dashboard de Visão Geral (Overview)
- **Resumo Executivo da Campanha:** Indicador de Severidade Geral (`CRITICAL`, `HIGH`, `MEDIUM`), Ator Atribuído (ex: *Social Design Agency / Structura*), Regiões e Setores Alvo.
- **4 Bento Cards Métricos:**
  - Táticas DISARM Cobertas (ex: 7/13) com barra percentual de matriz.
  - Técnicas Ativas Identificadas (100% tipadas).
  - Procedimentos & Evidências Mapeadas (IOCs, amostras, logs).
  - Contramedidas Sugeridas (Prebunking, Derrubada DNS, Atribuição).
- **Trilha da Cadeia de Influência (Influence Kill Chain Pipeline):**
  - Stepper visual e interativo das 6 fases: *Plan -> Prepare -> Execute -> Amplify -> Assess -> Persist*.
  - Clique em qualquer fase para filtrar a matriz e a tabela automaticamente.
- **Gráficos Táticos:**
  - Distribuição de Técnicas por Tática DISARM (Bar Chart com tema escuro).
  - Vitrine de Vetores Críticos de Maior Risco com acesso rápido para inspeção.

### 3. Navegador e Explorador de TTPs
- **Matriz DISARM (Navigator View):**
  - Colunas dedicadas para cada uma das táticas do DISARM (`TA01` a `TA13`).
  - Cards com identificadores (`T0038`, `T0042`, etc.), pontuação, status de severidade e sinalizador de evidência mapeada.
  - Busca textual instantânea (por ID, nome, notas operacionais ou artefatos) e filtro de severidade.
- **Tabela Operacional de TTPs:**
  - Visualização tabular estruturada com ordenação por colunas (ID, Nome, Tática, Fase, Severidade, Score).
  - Botão de cópia rápida de ID com 1 clique.
- **Gaveta de Detalhes da TTP (TTP Detail Drawer):**
  - **Objetivo do Adversário:** Destaque em card tático com ícone de mira.
  - **Definição Conceitual DISARM:** Explicação detalhada da técnica.
  - **Procedimento Mapeado (Evidência Operacional):** Trecho analítico real, artefatos/IOCs com botão de cópia, URLs de evidência, entidades visadas e nível de confiança.
  - **Mitigações e Contramedidas:** Categorizadas em *Counter-Narrative*, *Technical Attribution*, *Platform Takedown*, *De-amplification*, *Prebunking / Inoculation* e *Forensics*, com lista de passos de ação.

### 4. Exportação & Relatórios
- **Relatório Executivo Completo:** Modal com sumário estratégico, métricas operacionais, tabela da Kill Chain e inventário completo de TTPs com evidências e mitigações.
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
    │   └── mockDisarmData.ts    # Datasets mock pré-configurados (Doppelgänger e Ghostwriter)
    ├── utils/
    │   ├── disarmParser.ts      # Parser, conversor de camadas e agregador de métricas
    │   └── exportUtils.ts       # Geradores de Markdown, download de arquivos e impressão
    ├── components/
    │   ├── Header.tsx           # Barra superior com seletor de campanha, upload e exports
    │   ├── OverviewDashboard.tsx# Visão geral, Influence Kill Chain e gráficos Recharts
    │   ├── MatrixView.tsx       # Matriz interativa no estilo DISARM Navigator
    │   ├── TableView.tsx        # Tabela operacional filtrável e ordenável
    │   ├── TTPDetailDrawer.tsx  # Gaveta lateral detalhada da técnica/procedimento
    │   ├── UploadModal.tsx      # Modal de upload drag-and-drop com validação Zod
    │   └── ExecutiveReportModal.tsx # Relatório executivo para impressão/PDF e Markdown
    ├── App.tsx                  # Orquestrador da aplicação e gerenciador de abas
    ├── main.tsx                 # Ponto de entrada React
    └── index.css                # Estilização global, scrollbars e regras de impressão
```

---

## 🛠️ Como Executar Localmente

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:5173/`.

3. **Compilar para produção:**
   ```bash
   npm run build
   ```
