# atv_7_mini_dashboard — AI Instructions

## Idioma

***Sempre responder em português brasileiro***. Use termos técnicos em inglês quando for o padrão da indústria — não traduza: `array`, `push`, `for`, `const`, `let`, `localStorage`, `render`, `filter`, `commit`, `merge`, `rebase`, `branch`, `dashboard`, `card`, `DOM`, `event`, `console`, nomes de métodos/propriedades, etc. Prosa em pt-BR, jargão em inglês.

## Core Beliefs

### P0 — Non-negotiable

- ***Planning First*** — Ao desenhar um plano, entrar em Plan Mode, ou idear qualquer feature/arquitetura — use o skill `/brainstorming` ***SEMPRE*** antes de partir para implementação.
- ***Managing Tasks*** — Externalize trabalho não-trivial no TaskManager via `TaskCreate` com dependências explícitas (`blockedBy`). Nunca executar lógica multi-step inline sem um grafo de tarefas.
- ***Vanilla Stack Only*** — HTML + CSS + JavaScript puro. Sem build tools, sem bundlers, sem transpilers. Tailwind via CDN é aceitável. Libs JS via CDN são aceitáveis. Os 3 arquivos (`index.html`, `style.css`, `script.js`) ficam na raiz, abertos direto no browser.

### P1 — Standard

- **CLAUDE.md as living knowledge** — Se você descobrir algo da forma difícil, anote aqui pro próximo agente não queimar os mesmos ciclos. Skip o óbvio.
- **Incremental progress** — Mudanças pequenas que rodam end-to-end. Nada meio-pronto.
- **Validate with WebSearch** ao planejar — seu conhecimento pode estar desatualizado.

### P2 — Principles

- **Pragmatic over dogmatic** — É um projeto escolar (princípios básicos), adapte.
- **Clear intent over clever code** — Seja boring e óbvio.
- **Comments** — ÚNICA exceção à regra "no comments": os 3 dividers exigidos pela rubrica em `script.js` (`// Dados/Estado`, `// Lógica`, `// Interface`) e comentários de seção no `style.css`. Nada de inline explanations, nada de docstrings. Código deve ser auto-explicativo.
- **SRP, pragmatic** — Funções separadas para: `render`, `filter`, `calculate`, `persist`.

## What is This Project

Atividade escolar (AT07) — construir um mini-dashboard interativo do zero. **Leia `docs/teacher-task.md`** para a rubrica completa.

### Scenario (escolhido)

**Contexto B — Biblioteca de streaming de músicas**

- Registros (mínimo 5 atributos): `titulo`, `artista`, `genero`, `duracao` (segundos), `plays`.
- Filtros: por `artista` OU por `genero` (≥1 obrigatório, ambos é melhor).
- Indicadores calculados (≥2): ex. total de músicas, duração total formatada (mm:ss ou hh:mm), média de plays, música mais tocada, gênero mais frequente.

### Stack

- HTML5 semântico: `header`, `main`, `section`, `footer`.
- CSS3 + Flexbox responsivo. Tailwind via CDN permitido.
- JavaScript vanilla (ES6+). `const` e `let` apenas — **`var` é proibido pela rubrica**.
- Persistência: `localStorage` (sem backend).

### Architecture

```
atv_7_mini_dashboard/
├── index.html      # estrutura semântica + área de cards/tabela + filtro + resumo + form
├── style.css       # paleta, tipografia, flex layout, cards, indicadores destacados
├── script.js       # 3 seções comentadas: Dados/Estado | Lógica | Interface
├── docs/
│   └── teacher-task.md
└── README.md       # contexto, funcionalidades, como abrir no browser
```

### Hard Requirements (da rubrica)

**HTML**
- Tags semânticas (`header`, `main`, `section`, `footer` onde aplicável).
- Área de cards OU tabela para exibir registros.
- ≥1 input/select de filtro conectado ao JS.
- Bloco de resumo com indicadores calculados.
- Formulário para adicionar novo registro manualmente.

**CSS**
- Layout responsivo via Flexbox.
- Paleta de cores, tipografia e espaçamentos padronizados (variáveis CSS ou nomenclatura consistente — alvo: rubrica Avançado).
- Cards/rows legíveis. Indicadores de resumo visualmente destacados.
- Comentários de seção. Sem repetição desnecessária.

**JS**
- Array de objetos com **≥8 registros iniciais** de músicas.
- Função de render que itera com `for` (não `forEach`/`map`) e gera DOM dinamicamente — preferir `createElement` + `appendChild` para demonstrar domínio (alvo: rubrica Avançado).
- **≥1 filtro funcional** que atualiza a exibição sem reload.
- **≥2 indicadores calculados** a partir do array.
- Formulário que adiciona registro com `push()` e re-renderiza.
- `localStorage` — registros adicionados sobrevivem ao reload.
- Código em **3 seções comentadas**: `// Dados/Estado` | `// Lógica` | `// Interface`.
- Funções auxiliares com responsabilidade única: separar `render`, `filter`, `calculate`, `persist`.
- `const`/`let` apenas. **Zero `var`**.
- Console limpo — zero erros, zero warnings (alvo: rubrica Avançado).

## GIT Usage

- Branches a partir de `main`. ALWAYS rebase, never merge.
- NEVER push direto para `main`.
- NEVER referenciar Claude Code (ou qualquer AI agent) em commits ou PRs.
- Conventional commits com descrições boas. Exemplos da rubrica:
  - `feat: renderização inicial dos cards`
  - `feat: filtro por gênero`
  - `feat: indicadores de resumo`
  - `feat: formulário com push e re-render`
  - `feat: persistência via localStorage`
- **≥1 commit por aula de desenvolvimento** (exigência da rubrica CS3).
- Todo trabalho de implementação em uma nova branch.

## Testing

Sem framework de testes — validação manual:

- Abrir `index.html` direto no browser (`file://` ou `python -m http.server`).
- DevTools console: **zero erros, zero warnings**.
- Smoke test: render inicial → aplicar filtro → adicionar registro via form → recarregar página (persistência sobrevive).
