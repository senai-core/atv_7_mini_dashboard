---
status: ativo
ultima-atualizacao: 2026-05-08
---

# Decisões de baseline do dashboard Mulberry

Registra as escolhas feitas na rodada de refino do PR #1 e nas iterações subsequentes.

## Layout

- **Viewport-locked no desktop (≥1024px)**: só a `.music-grid` scrolla. Header, filtros e sidebar ficam fixos. Mobile mantém scroll de página inteiro porque o layout stacka.
- **Music grid**: `grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))`. Auto-fill (não auto-fit) garante que slots vazios fiquem reservados — assim filtrar pra 1 resultado não faz o card único esticar pra largura toda.
- **Avatar do usuário saiu do header** e virou o botão de perfil no fim da search bar.

## Filtros

- **Substituído chips por dropdown único "Filtros"**. Razão: chips estáticos não acompanhavam novos gêneros adicionados via form. Dropdown popula opções dinamicamente a partir do array de músicas (`listarGeneros()`), então sempre fica em sincronia.
- **Search bar estendida** (flex-1) com botão de perfil embedado no fim — visualmente uma única "pill" de busca + perfil.

## Perfil

- **Nome + avatar URL apenas**. Sem upload de arquivo (vanilla browser-only não escreve em disco).
- **Default vem do `ESTADO_INICIAL.profile`** hardcoded no `script.js`. Persistência da edição vai pro mesmo `mulberry_state` do `localStorage`.
- **Modal de edição** abre ao clicar no avatar; preview ao vivo enquanto digita a URL.
- **Nome aparece na tagline** do header (`editado por <nome>`) — sem isso, a edição parecia invisível.

## Dados

- **`localStorage` é a única fonte de persistência** — chave única `mulberry_state` com `{ musicas, profile }` num só JSON serializado. Sem `dados.json`, sem `fetch`, sem `async`.
- **Seed inicial hardcoded em `script.js`** (`ESTADO_INICIAL`). Carregado quando o `localStorage` está vazio.
- **Por que sem `dados.json`**: JS estático em browser não tem permissão de escrita em arquivo (sandbox de segurança). Manter um JSON externo só serviria como seed read-only — adicionava complexidade (fetch async, `file://` não funciona, gitignore + skip-worktree per-clone) sem ganho real. A rubrica também exige `localStorage` explicitamente.
- **Trade-off**: pra atualizar o seed (ex.: trocar o catálogo inicial entre clones), edita o array `ESTADO_INICIAL` direto no `script.js`. É código, não dado externo, e isso é OK pra um projeto deste porte.
- **Resetar estado local**: DevTools → Application → Local Storage → deleta `mulberry_state`. Reload mostra o seed.

## Renderização

- **`createElement` + `appendChild` + `textContent`** para os cards de música (alvo: rubrica Avançado em CT3/CT5). Evita XSS em dados do usuário.
- **`for` clássico** (não `forEach`/`map`) — exigência da rubrica.
- **3 seções comentadas** em `script.js`: Dados/Estado, Lógica, Interface.

## Indicadores

- Mockup só mostra "Total de músicas salvas". Mas rubrica exige ≥2 indicadores calculados. Solução: manter "Duração total" e "Ouvintes/mês" tucked como linha discreta abaixo do total grande, com `border-top` separador. Visualmente discreto, rubricamente conforme.
- **Removido o `genreMap` lossy** que mesclava "Heavy Metal"/"Groove Metal" → "Metal" e "Grunge"/"Countrycore" → "Rock". Estava conflitando com os filtros que usavam nomes não-mesclados, e perdia informação no chart.

## CSS

- **Tokens via CSS variables** (`--purple-dark`, `--purple-glow`, etc.) — alvo rubrica Avançado em CT6.
- **Comentários por seção** organizando o arquivo (Tokens, Background, Header, Filters, Grid, Sidebar, Modal, etc.).
- **Sem Tailwind `hidden`** em elementos toggleáveis — `display: none !important` do Tailwind não conseguia ser sobrescrito por `.modal.show { opacity: 1 }`. Usar classe própria.
