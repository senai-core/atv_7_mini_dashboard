# Mulberry — Mini Dashboard de Streaming Musical

AT07 (SENAI) — Dashboard interativo em HTML + CSS + JavaScript puro com persistência em `localStorage`. Atividade em quartetos.

## Stack

- HTML5 semântico (`header`, `main`, `section`, `aside`, `footer`)
- CSS3 + Tailwind via CDN
- JavaScript vanilla (ES6+, sem build tools)
- [Chart.js](https://www.chartjs.org/) via CDN — donut chart de gêneros
- Google Fonts (Cinzel) — tipografia
- Persistência: `localStorage`

## Como rodar

`fetch('dados.json')` não funciona via `file://` (CORS no protocolo). Sirva por HTTP local:

```bash
git clone https://github.com/senai-core/atv_7_mini_dashboard.git
cd atv_7_mini_dashboard
python3 -m http.server 8765
```

Abra `http://localhost:8765` no browser.

> Alternativa: extensão "Live Server" no VS Code, `npx serve`, etc.

## Estrutura

```
.
├── index.html           # markup semântico + modais (add música, perfil)
├── style.css            # paleta + animações + responsivo
├── script.js            # 3 seções: Dados/Estado | Lógica | Interface
├── dados.json           # seed das músicas (skip-worktree, ver abaixo)
├── docs/
│   ├── CLAUDE.md        # índice da pasta docs
│   ├── teacher-task.md  # rubrica oficial do AT07
│   └── decisions/       # decisões de design tomadas
└── README.md
```

## Sobre o `dados.json`

`dados.json` é versionado uma única vez (vai pra GitHub, qualquer `git clone` recebe o seed). Mas localmente é tratado como **read-only** via `git update-index --skip-worktree`, pra que modificações pessoais (músicas adicionadas, etc.) não poluam commits.

**Após clonar pela primeira vez**, marca o arquivo:

```bash
git update-index --skip-worktree dados.json
```

**Pra parar de ignorar** (ex.: você quer commitar uma atualização do seed):

```bash
git update-index --no-skip-worktree dados.json
git add dados.json
git commit -m "chore: update music seed"
git update-index --skip-worktree dados.json
```

> Ele também aparece no `.gitignore` como nota de intenção, mas o flag de skip-worktree é o que efetivamente impede o tracking — gitignore não desresgatra arquivos já trackeados.

## Funcionalidades

- **Listagem** em grid responsivo (4→3→2→1 colunas conforme largura)
- **Filtro por gênero** via dropdown dinâmico (gera opções a partir das músicas atuais)
- **Busca** por nome, artista ou gênero
- **Adicionar música** (modal — `push()` no array + `localStorage`)
- **Editar perfil** (nome + avatar via URL — salvo em `localStorage` como JSON)
- **Indicadores calculados**: total de músicas, duração total, ouvintes/mês
- **Donut chart** com distribuição de gêneros
- **Layout viewport-locked no desktop** — só a lista de músicas scrolla; header, filtros e sidebar ficam fixos
- **Persistência via `localStorage`** — música e perfil sobrevivem ao reload

## Quarteto AT07

- Rafael Pellegrini
- (membros do grupo)

---

Atividade SENAI — bloco Front-end. Capacidades CT3, CT5, CT6, CS3.
