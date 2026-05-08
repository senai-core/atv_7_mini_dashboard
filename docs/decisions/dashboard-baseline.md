---
status: ativo
ultima-atualizacao: 2026-05-08
---

# Decisões de baseline do dashboard Mulberry

Registra as escolhas feitas na rodada de refino do PR #1 e nas iterações subsequentes.

## Layout

- **Viewport-locked no desktop (≥1024px)**: só a `.music-grid` scrolla. Header, filtros e sidebar ficam fixos. Mobile mantém scroll de página inteiro porque o layout stacka.
- **Grid de 4 colunas no desktop wide** (≥1280px), descendo pra 3, 2, 1 nas larguras menores. Mockup mostrava 3 mas o usuário pediu 4.
- **Avatar do usuário saiu do header** e virou o botão de perfil no fim da search bar.

## Filtros

- **Substituído chips por dropdown único "Filtros"**. Razão: chips estáticos não acompanhavam novos gêneros adicionados via form. Dropdown popula opções dinamicamente a partir do array de músicas (`listarGeneros()`), então sempre fica em sincronia.
- **Search bar estendida** (flex-1) com botão de perfil embedado no fim — visualmente uma única "pill" de busca + perfil.

## Perfil

- **Nome + avatar URL apenas**. Sem upload de arquivo (vanilla browser-only não escreve em disco).
- **Default vem do `dados.json`** (chave `user`); persistência da edição vai pro `localStorage` chave `mulberry_profile`.
- **Modal de edição** abre ao clicar no avatar; preview ao vivo enquanto digita a URL.

## Dados

- **`dados.json` é a fonte única de seed** — estrutura `{ user, musicas }`. `user` define o perfil default; `musicas` define os 8 registros iniciais.
- **Carregamento (`carregarEstado`)**: se `localStorage` já tem ambas as chaves, pula o fetch. Senão, faz `fetch('dados.json')` uma vez e popula só o que falta. Decisões locais sempre prevalecem sobre o seed.
- **Skip-worktree pattern**: arquivo é versionado uma vez (vai pra GitHub, novos clones recebem). Localmente, marcado com `git update-index --skip-worktree` pra que mudanças pessoais não virem commit. Também listado no `.gitignore` como nota de intenção (apesar de gitignore não afetar arquivos já trackeados).
- **Pra atualizar o seed**: desliga skip-worktree (`git update-index --no-skip-worktree dados.json`), edita, commita, religa.
- **Trade-off**: requer servir via HTTP (`fetch` não funciona em `file://`). README documenta.

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
