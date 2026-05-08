# docs/ — Índice

Memória de longo prazo do projeto. Decisões, contexto e documentação de código não-trivial.

**Sempre ler antes de implementar. Sempre atualizar ao criar/renomear/deletar arquivos.**

## Estrutura

- `decisions/` — decisões tomadas: abordagem escolhida, tradeoffs, alternativas descartadas.
- `code/` — documentação de código: interfaces, invariantes, "por quê" de cada módulo.
- Arquivos na raiz de `docs/` — material institucional (rubrica, briefings).

## Convenção

- 1 arquivo por tópico. Slug em `kebab-case.md`.
- Cabeçalho mínimo: `# Título`, `**Status:**` (ativo/superseded), `**Última atualização:**` em decisões.
- Atualize a entrada existente ao mudar de ideia — não crie versões paralelas.
- Doc mentirosa é pior que doc ausente. Se ficar desalinhada com o código, corrija ou apague.

## Entradas

### Raiz

- [teacher-task.md](teacher-task.md) — rubrica oficial do AT07 (contexto B, requisitos técnicos, critérios de avaliação).

### Decisões (`decisions/`)

- [dashboard-baseline.md](decisions/dashboard-baseline.md) — escolhas de layout, filtros, perfil, dados e renderização do dashboard Mulberry.

### Código (`code/`)

_Vazio. Adicione entradas aqui conforme módulos forem escritos._
