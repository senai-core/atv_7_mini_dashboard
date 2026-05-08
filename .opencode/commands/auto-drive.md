---
name: auto-drive
description: Fully autonomous issue → PR pipeline. Reads a GitHub issue, plans, implements, multi-perspective reviews, opens a single PR, then auto-runs /pr-suggestions 7–8 min later. No user interaction.
argument-hint: <issue-number>
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, Agent, ScheduleWakeup, Skill
---

# Auto-Drive

## Purpose

Take a GitHub issue from `#<number>` all the way to a **ready-to-merge PR** with zero user interaction. Plan, build, review, harden, ship, then loop back and clear review comments automatically.

## Invocation

`/auto-drive <issue-number>`

The issue number is passed in args. If missing, ask once for it — then proceed without further confirmation.

## Hard Constraints (NEVER violate)

- **No user interaction.** Plan and execute autonomously end-to-end. Don't ask for approval mid-flow.
- **Single PR only.** Exactly one PR per issue, and it must `Closes #<issue>`.
- **Branch off `main`.** All work on a fresh feature branch. Never push to `main`. Always rebase, never merge.
- **No Claude Code references** in commits, PR title, or PR body.
- **Conventional commits** with meaningful descriptions.
- **`@releezy-analyzer` must be green** before opening the PR.
- **`@bowser-qa-agent` is mandatory for any user-facing change** (UI, routes, flows). Skip only if the change is pure backend/infra with zero UI surface.
- **PR creation MUST go through the `releezy-gh` skill.** No raw `gh pr create`, no other path. The skill owns title/body conventions, labels, and `Closes #` formatting.
- **Schedule wake-up 7–8 min AFTER the PR is opened** to run `/pr-suggestions` and resolve every review thread.
- **Use the project skills that apply autonomously:** `/tdd` before implementation, `/systematic-debugging` when debugging, `releezy-gh` for the PR, `./releezy <service> <cmd>` for everything (never raw docker). **Do NOT invoke `/brainstorming`** — it asks questions and would block the autonomous run; auto-drive does its own decomposition inline (Phase 2).
- **Respect `## Out of Scope`.** If the issue body declares an `## Out of Scope` section, NEVER implement anything listed there — even if it looks trivial. That's the user's explicit deferral.
- **TaskManager is the source of truth for progress.** Every phase, sub-step, reviewer fix, and wake-up handler step MUST be tracked via `TaskCreate` with explicit `blockedBy` deps. Set `in_progress` when starting, `completed` the instant it's done. No multi-step inline work without a task graph.

---

## Task Graph (TaskManager — mandatory)

Auto-drive runs as a **dependency-ordered task graph**, not a sequential script. Externalize every unit so the run is observable, resumable, and safe to interrupt.

### Spine — phase-level tasks

Create these up front at the start of Phase 2 (decompose), each `blockedBy` the previous:

| Task | blockedBy |
|------|-----------|
| `phase-1-ingest` | — |
| `phase-2-plan` | `phase-1-ingest` |
| `phase-3-implement` | `phase-2-plan` |
| `phase-4-gates` | `phase-3-implement` |
| `phase-5-review` | `phase-4-gates` |
| `phase-6-qa` | `phase-5-review` |
| `phase-7-docs` | `phase-6-qa` |
| `phase-8-pr` | `phase-7-docs` |
| `phase-9-schedule-wakeup` | `phase-8-pr` |
| `phase-10-wakeup-sweep` | `phase-9-schedule-wakeup` |

### Ribs — sub-tasks under each phase

Decompose each phase into concrete sub-tasks, all `blockedBy` their parent phase. Examples:

- **Under `phase-3-implement`:** one task per acceptance criterion, each `blockedBy` its `tdd-test-<n>` task. Implementation tasks `blockedBy` their failing-test task.
- **Under `phase-4-gates`:** one task per `./releezy <svc> test` + one per analyzer service. All siblings (parallel-safe).
- **Under `phase-5-review`:** one task per spawned reviewer lens, plus one `consolidate-findings` task `blockedBy` ALL reviewer tasks, plus one `apply-fixes` task `blockedBy` `consolidate-findings`.
- **Under `phase-7-docs`:** one task per file the sweep proposes to update.
- **Under `phase-10-wakeup-sweep`:** `pr-suggestions-run` → `re-run-analyzer` → `re-run-qa-if-ui` → `final-summary`, each `blockedBy` the previous.

### Discipline

- **`in_progress` on entry, `completed` on exit.** Never batch completions at the end of a phase.
- **Failures don't silently delete tasks.** If a fix opens a new task (e.g., reviewer found a blocker), add it with `blockedBy` the current task — don't mutate history.
- **Re-evaluation loops** (Phase 5 second pass, Phase 10 reschedule) create *new* tasks; the original stays `completed`.
- **No phase starts before its `blockedBy` chain is fully `completed`.** This is what prevents a half-built diff from reaching `phase-8-pr`.

---

## Phase 1 — Ingest the issue

```bash
gh issue view $ARGUMENTS --repo Victorino-Software-LLC/releezy --json number,title,body,labels,assignees,milestone,comments
```

Read the body. Use whatever sections it gives you — richer issues (e.g. brainstorm-sourced ones with `## Recommended Plan`, `## Risks`, `## Out of Scope`, `## User Stories`) feed downstream phases more directly; sparse issues just mean you fill the gaps inline.

Extract:
- **Goal** — what bug/feature this is.
- **Acceptance criteria** — explicit or implied.
- **Affected services** — from labels and body (core / guardian / loop / site / nginx / migrations).
- **User-facing?** — decides whether bowser-qa is mandatory.

One-liner to chat: `Working on #<n>: <title>` and move on.

## Phase 2 — Decompose (autonomous)

**Do NOT call `/brainstorming`.** It asks questions and would block the run. Decompose inline.

If the issue body already provides a `## Recommended Plan` / `## Risks` / `## Out of Scope`, follow it. If not, sketch one inline: 2-3 candidate strategies with 1-line pros/cons, pick one, list 3-5 risks, lay out a dependency graph from the acceptance criteria. No skill calls, no questions.

Then build the task graph:

1. `TaskCreate` the 10 spine tasks (`phase-1-ingest` … `phase-10-wakeup-sweep`) with their `blockedBy` chain.
2. Mark `phase-1-ingest` and `phase-2-plan` `completed` (you've already done them).
3. Decompose `phase-3-implement` into ribs — one TDD task pair (failing-test + impl) per acceptance criterion, ordered by the dependency graph.

Log the plan + task graph to chat and start executing. No approval gate.

## Phase 3 — Branch + implement

```bash
git switch main && git pull --rebase
git switch -c <type>/<short-slug>-<issue-number>
```

Branch naming: `feat/...`, `fix/...`, `refactor/...`, `chore/...` — pick from the issue's nature.

Implementation rules:
- **`/tdd` first.** Write the failing test, then make it pass. No exceptions for features or bugfixes.
- Small, conventional commits. Each commit compiles and passes its tests.
- If you hit unexpected behavior, switch to `/systematic-debugging` — don't guess-patch.
- Run service tests via `./releezy <service> test` after each meaningful chunk.

## Phase 4 — Local gates

Before opening the PR, all of these must pass:

```bash
./releezy core test           # if core touched
./releezy guardian test       # if guardian touched
./releezy loop test           # if loop touched
./releezy loop review         # static analysis suite, if loop touched
```

Then run `@releezy-analyzer` on every touched service. **Green or fix it.** Loop until clean.

## Phase 5 — Adaptive multi-perspective review (pre-PR)

Don't spawn a fixed roster. **Read the diff first, then pick reviewers that match the actual risk surface.** A docs-only change doesn't need a security audit; a migration needs a data-safety lens; a frontend change needs UX/a11y.

### 5.1 — Extract signals from the diff

```bash
git diff --stat main...HEAD
git diff main...HEAD --name-only
```

Compute these signals:

| Signal | How to detect |
|--------|---------------|
| `touches_db` | files in `migrations/`, anything matching `*Migration*`, schema changes, raw SQL |
| `touches_auth` | `core/app/Http/Middleware/`, JWT logic, nginx Lua, tenant scoping |
| `touches_ui` | `*.tsx`, `*.jsx`, `*.vue`, `*.astro`, `resources/views/`, `resources/js/Pages/` |
| `touches_api` | new routes, controllers, FastAPI endpoints, request/response schemas |
| `touches_agents` | `loop/agents/`, agent prompts, agent runtime |
| `touches_llm` | Prism / Groq / Gemini / Anthropic SDK calls, prompt strings |
| `touches_infra` | `Dockerfile*`, `docker-compose*`, nginx config, CI workflows |
| `touches_money` | billing, plans, quotas, usage metering |
| `touches_perf_hot` | sync loops, queries in loops, hot paths flagged by analyzer |
| `external_inputs` | webhook handlers, public endpoints, file uploads |
| `is_docs_only` | only `*.md` / comments changed |
| `change_size` | `S` (<100 LOC), `M` (100–400), `L` (400–1500), `XL` (>1500) |

### 5.2 — Reviewer roster

Pool to draw from. Each entry = subagent type + lens prompt focus.

| Lens | Focus | Trigger signals |
|------|-------|----------------|
| **Correctness** | Off-by-ones, null paths, race conditions, error handling, idempotency, test coverage of branches | **always-on** (baseline) |
| **Architecture & fit** | Service CLAUDE.md patterns, SRP, layering, multi-tenant boundaries, schema isolation | `change_size ≥ M` or new files added |
| **Security** | Injection, authz bypass, secret leakage, SSRF, IDOR, CSRF, JWT assumptions | `touches_auth` ∨ `external_inputs` ∨ `touches_api` |
| **Data safety** | Migration reversibility, locking, backfills under concurrent writes, NOT NULL on hot tables, data loss paths | `touches_db` |
| **UX / a11y / visual** | Keyboard nav, ARIA, contrast, loading/empty/error states, mobile, i18n (PT/EN), Inertia/React patterns | `touches_ui` |
| **API contract** | Backwards compat, request/response shape, status codes, pagination, idempotency keys, OpenAPI drift | `touches_api` |
| **Agent / prompt** | Prompt drift, tool-use safety, max_turns, cost ceilings, output parsing, retry semantics | `touches_agents` ∨ `touches_llm` |
| **Performance** | N+1, missing indexes, payload size, hot-path allocs, blocking I/O, cache invalidation | `touches_perf_hot` ∨ `change_size ≥ L` ∨ `touches_db` |
| **Infra & ops** | Image size, layer cache, secret handling, healthchecks, rollout safety, observability | `touches_infra` |
| **Billing / money** | Quota math, race on counters, refund paths, plan downgrade edges | `touches_money` |
| **DX / cleanup** | Dead code, log noise, comment hygiene, test quality, naming, dupe with `simplify` skill mindset | `change_size ≥ M` |

### 5.3 — Selection rules

1. **Correctness is always on.** Floor of 1 reviewer.
2. **Add every lens whose triggers fire.** Don't preempt — if both `touches_db` and `touches_auth` fire, both lenses get spawned.
3. **Cap by size** to avoid overkill:
   - `S` → max **2** reviewers (Correctness + at most one specialist)
   - `M` → max **3**
   - `L` → max **4**
   - `XL` → max **5**
   Rank specialists by risk (Security/Data safety/Billing > API/Agent > Perf > Infra > UX > Architecture > DX) and drop from the bottom if over cap.
4. **Docs-only short-circuit.** If `is_docs_only`, spawn **one** reviewer (Correctness lens narrowed to "accuracy, links, claims") and skip the rest.
5. **No specialist fires?** Run Correctness + Architecture only.

### 5.4 — Spawn

Send all picked reviewers in **a single message** with parallel `Agent` calls. Each call: `subagent_type: "general-purpose"`, prompt scoped to its lens, with explicit instructions to:

- Read the diff via `git diff main...HEAD` and the issue body for context. If the issue body has a `## Risks` section, validate the change against it instead of re-deriving risks from scratch.
- Return a numbered list of findings, each tagged `[blocker]` / `[nit]` / `[praise]`, with **exact file:line**.
- Skip generic advice — only findings tied to this diff.
- Cap response under ~400 words.

For a high-risk lens (Security, Data safety, Billing), use `subagent_type: "releezy-analyzer"` if the touched service matches its scope — it has the static-analysis context baked in.

### 5.5 — Triage and fix

Consolidate findings into a single table (lens, file:line, severity, action). Then:

- **Fix every `[blocker]`.** Non-negotiable.
- **Fix `[nit]` if cheap** (≤ 5 LOC and obvious). Otherwise note "deferred — out of scope" with one-line reason.
- **Praise** is informational only.

After fixes: re-run Phase 4 gates. If a fix touched a different risk surface than before, **re-evaluate signals** — a new specialist may now be needed. Loop at most twice; if a third pass would be needed, escalate the decision into the PR body and ship it.

## Phase 6 — UI verification (conditional)

If the change is user-facing, dispatch `@bowser-qa-agent` on **LOCAL** with concrete scenarios derived from the issue body — prefer `## User Stories` if present, otherwise acceptance criteria. Block until green. Fix any regression and loop.

If pure backend/infra with no UI surface, skip and explicitly note "no UI surface — bowser-qa skipped" in the PR body.

## Phase 7 — Documentation sweep

Invoke `/docs-n-claudes` against the final diff. Goal: no PR ships with stale or missing docs.

What it must check, scoped strictly to **what this branch changed**:

- **Service `CLAUDE.md`** for every touched service — new patterns, gotchas, non-obvious decisions, renamed/removed concepts.
- **Root `CLAUDE.md`** if architecture, services, or CLI surface changed.
- **`docs/`** — any document referencing renamed/removed APIs, routes, env vars, commands.
- **README files** — if commands or quick-start changed.

Rules:

- **Only update what this diff invalidates or what this diff revealed.** Don't refactor docs opportunistically.
- **If the code is self-explanatory, don't write a doc.** The CLAUDE.md guidance is explicit: skip if obvious from reading the code.
- **No new docs unless the issue or the change demands one.** Don't auto-generate `*.md` files.
- Any doc edits become part of the same branch + PR — commit them with a `docs:` conventional prefix (or fold into the most relevant feat/fix commit if tightly coupled).

After this phase, re-run Phase 4 gates (docs edits shouldn't break them, but cheap insurance).

## Phase 8 — Open the PR

**Mandatory path:** invoke the `releezy-gh` skill to create the PR. **No exceptions** — never call `gh pr create` directly, never hand-craft the PR body outside the skill. The skill owns title format, body sections, labels, and `Closes #` placement; bypassing it breaks the project's PR conventions.

Inputs to hand the skill:

- **Issue number** — for `Closes #<n>`.
- **Branch** — already pushed (`git push -u origin <branch>`).
- **Summary** — 1–3 bullets covering the actual change.
- **Test Plan** — checklist derived from the issue's acceptance criteria + what was actually validated (analyzer, gates, bowser-qa).
- **Affected services** — for label routing.

Hard rules the skill must respect:

- Title under 70 chars, conventional commit prefix.
- **Zero Claude Code references** in title or body.
- Single PR per issue.

After the skill returns: capture PR number and URL into chat.

## Phase 9 — Schedule the post-PR sweep

**Immediately after** the PR is opened, schedule a wake-up 7–8 minutes out to run `/pr-suggestions`:

```
ScheduleWakeup({
  delaySeconds: 450,           // 7.5 min — middle of the 7–8 min window
  reason: "Auto-drive post-PR sweep: run /pr-suggestions on PR #<n>",
  prompt: "/pr-suggestions for PR #<n> on branch <branch>. Implement valid suggestions, push, reply, resolve every thread. Re-run @releezy-analyzer green-or-fix loop. End-state: PR ready-to-merge."
})
```

Then return control to chat with a final summary: PR URL, gates status, wake-up scheduled at T+7.5min.

## Phase 10 — Wake-up handler (auto)

When the scheduled wake-up fires:

1. Run `/pr-suggestions` against the PR.
2. After it finishes, re-run `@releezy-analyzer` on touched services — green or fix.
3. If user-facing and changes were made, re-run `@bowser-qa-agent`.
4. Final chat message: `PR #<n> ready to merge — all threads resolved, analyzer green, QA green.`

If `/pr-suggestions` made zero changes (no review comments yet), reschedule one more wake-up at +10 min and stop after that second pass — don't loop forever.

---

## End-state checklist (must all be true)

- [ ] Single PR opened, `Closes #<issue>` in body
- [ ] Branch off main, rebased, no merge commits
- [ ] Conventional commits, no Claude Code references
- [ ] `@releezy-analyzer` green on all touched services
- [ ] `@bowser-qa-agent` green (or explicitly N/A — no UI surface)
- [ ] Adaptive multi-perspective review consolidated; all `[blocker]` findings fixed
- [ ] Nothing listed in the issue's `## Out of Scope` (if present) was implemented
- [ ] Wake-up scheduled and executed; `/pr-suggestions` cleared all threads
- [ ] TaskManager graph fully `completed` — no orphan or stuck tasks
- [ ] Zero user interaction across the whole run

**Proceed.**
