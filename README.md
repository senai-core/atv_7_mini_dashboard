# Mulberry — Mini Dashboard de Streaming Musical

AT07 (SENAI) — Dashboard interativo em HTML + CSS + JavaScript puro com persistência em `localStorage`. Atividade em quartetos.

## Stack

- HTML5 semântico (`header`, `main`, `section`, `aside`, `footer`)
- CSS3 + Tailwind via CDN
- JavaScript vanilla (ES6+, sem build tools)
- [Chart.js](https://www.chartjs.org/) via CDN — donut chart de gêneros
- Google Fonts (Italiana, Hanken Grotesk, Kode Mono) — tipografia editorial
- Persistência: `localStorage` (chave única `mulberry_state`)

## Como rodar

Abrir o `index.html` direto no browser funciona — não tem fetch nem dependência de servidor.

```bash
git clone https://github.com/senai-core/atv_7_mini_dashboard.git
cd atv_7_mini_dashboard
xdg-open index.html      # Linux
open index.html          # macOS
start index.html         # Windows
```

> Se preferir HTTP local: `python3 -m http.server 8765` e abre `http://localhost:8765`.

## Estrutura

```
.
├── index.html           # markup semântico + modais (add música, perfil)
├── style.css            # paleta editorial + responsivo
├── script.js            # 3 seções: Dados/Estado | Lógica | Interface
├── docs/
│   ├── CLAUDE.md        # índice da pasta docs
│   ├── teacher-task.md  # rubrica oficial do AT07
│   └── decisions/       # decisões de design tomadas
└── README.md
```

## Persistência

Tudo vive em **`localStorage`** sob uma única chave: `mulberry_state`.

```jsonc
// localStorage["mulberry_state"]
{
  "musicas": [ /* array de objetos das músicas */ ],
  "profile": { "name": "Visitante", "avatarUrl": "" }
}
```

- **1º load** (storage vazio) → carrega o seed hardcoded em `script.js` (8 músicas + perfil padrão).
- **Edita perfil ou adiciona música** → grava em `localStorage`.
- **Reload** → lê de `localStorage`, não toca no seed.
- **Resetar** → DevTools → Application → Local Storage → deleta a chave `mulberry_state`. Reload mostra o seed de novo.

> Sem `dados.json`, sem `fetch`, sem `async/await`. Tudo síncrono e sem dependência de servidor. JS estático em browser não tem permissão pra escrever em arquivo do disco — `localStorage` é o único caminho de persistência vanilla.

## Funcionalidades

- **Listagem** em grid responsivo (auto-fill, mantém tamanho do card mesmo com 1 resultado)
- **Filtro por gênero** via dropdown dinâmico (gera opções a partir das músicas atuais)
- **Busca** por nome, artista ou gênero
- **Adicionar música** (modal — `push()` no array + `localStorage`)
- **Editar perfil** (nome + avatar via URL — salvo no mesmo `mulberry_state`)
- **Indicadores calculados**: total de músicas, duração total, ouvintes/mês
- **Donut chart** com distribuição de gêneros
- **Layout viewport-locked no desktop** — só a lista de músicas scrolla; header, filtros e sidebar ficam fixos
- **Persistência via `localStorage`** — música e perfil sobrevivem ao reload

## Quarteto AT07

- Rafael Pellegrini
- (membros do grupo)

---

Atividade SENAI — bloco Front-end. Capacidades CT3, CT5, CT6, CS3.
