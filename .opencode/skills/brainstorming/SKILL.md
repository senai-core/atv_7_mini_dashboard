---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Decomposes problems, evaluates strategies, surfaces risks, then enters Plan Mode."
---

# Brainstorming: Systems Thinking Before Execution

## Overview

Pure planning interface. No code, no execution. You are a systems thinker — decompose the problem, evaluate strategies, surface risks, then hand off to Plan Mode.

```
task → structured analysis → Plan Mode → execution
```

This reduces dumb mistakes, avoids wrong-approach lock-in, and exposes hidden complexity early. Planning is the bottleneck, not typing.

<HARD-GATE>
Do NOT write code, create files, scaffold anything, or take ANY implementation action.
Do NOT invoke any other skill.
The ONLY terminal action is `EnterPlanMode`.
If you drift into execution mode — you lost the whole point.
</HARD-GATE>

## Checklist

You MUST create a task for each of these items and complete them in order:

1. **Explore project context** — files, docs, recent commits, CLAUDE.md
2. **Ask clarifying questions** — only what code can't answer; pre-recommend every answer
3. **Build problem model + system impact analysis** — decompose, map, identify deep modules
4. **Evaluate strategies + surface risks** — 2-3 approaches with tradeoffs and dependency graphs
5. **Present structured analysis** — section by section, get user approval
6. **Enter Plan Mode** — `EnterPlanMode`

## Phase 1: Explore & Understand

**Project context (do this BEFORE asking anything):**
- Read the project's `CLAUDE.md` for domain knowledge, vocabulary, and constraints
- Read `docs/teacher-task.md` for the rubric and hard requirements
- Skim recent commits in the area you're touching
- Identify existing patterns, utilities, and code that can be reused
- Use the project's vocabulary throughout the analysis — never invent parallel terms

**Questions — read the codebase first:**
- If a question can be answered by exploring the codebase, EXPLORE — never ask the user.
- Use `AskUserQuestion` for all real questions — never inline in prose.
- **Pre-recommend an answer for every question** so the user can validate or redirect instead of generating from scratch.
- Batch 1-4 closely related questions per call. For branchy decisions where each answer changes the next question, ask one at a time and walk the tree.
- Prefer `multiple_choice` when options are enumerable; `open_ended` only when the space is truly open.
- Focus on: purpose, constraints, success criteria, who's affected, what "done" looks like.

## Phase 2: Decompose & Analyze

Build a structured analysis. Present each section to the user and confirm before moving on.

### Output Structure

```
[PROBLEM MODEL]
- What's actually being asked (user's perspective, not implementation)
- Inferred constraints
- Hidden assumptions worth calling out

[SYSTEM IMPACT]
- Modules / sections touched (logical names, not file paths)
- Existing code that can be reused
- Deep modules to extract: simple, testable interfaces over rich functionality

[STRATEGIES]
1. Approach A (e.g. fast, risky)
   - Pros
   - Cons
   - Dependency graph: step A → enables B, B + C → enables D
2. Approach B (e.g. safe, slower)
   - Pros / Cons / Dependency graph
3. Approach C (optional, e.g. refactor-heavy)
   - Pros / Cons / Dependency graph

[RISKS]
- Breaking existing behavior
- Hidden coupling between modules
- Rubric compliance risks (e.g. forbidden constructs slipping in)
- Browser-compat or runtime surprises

[VALIDATION]
- How do we know it worked? (external behavior, not implementation details)
- Manual verification steps in the browser (DevTools console clean, smoke flow passes)
- Rubric criteria that this change must satisfy

[OUT OF SCOPE]
- What we are NOT doing in this round (and why)
- Adjacent improvements explicitly deferred

[RECOMMENDED PLAN]
- Ordered steps as a dependency graph, NOT a flat checklist
- step 1 → enables step 2
- step 2 + step 3 → enables step 4

[NEXT ACTION]
- Single first step to start with
```

**Key rules for this phase:**
- Strategies must include dependency graphs, not flat checklists
- Always evaluate multiple approaches before recommending one
- Risks come BEFORE any implementation thinking
- Validation is defined BEFORE code is written
- Lead with your recommended strategy and explain why
- **Never include specific file paths or code snippets** — they decay; describe modules, interfaces, and behaviors

## Phase 3: Enter Plan Mode

After the user approves the structured analysis:

1. Call `EnterPlanMode`
2. Plan Mode handles creating and writing the plan file — that's its job, not yours
3. Do NOT write any files yourself

## Key Principles

- **AskUserQuestion for everything** — never drop questions inline in prose
- **Codebase first** — never ask the user what the code can answer
- **Pre-recommend answers** — every question carries your best guess so the user can validate or redirect
- **Batch questions** — up to 4 related per call; one-at-a-time when answers cascade
- **Multiple choice preferred** — easier to answer than open-ended
- **YAGNI ruthlessly** — strip unnecessary scope, then formalize what's cut into `[OUT OF SCOPE]`
- **Dependency graphs over checklists** — order matters, dependencies matter
- **Deep modules** — encapsulate functionality behind simple, testable interfaces that rarely change
- **No file paths, no code snippets** — they decay; describe modules, interfaces, behaviors
- **Surface risks early** — what can go wrong if we touch this?
- **Incremental validation** — present analysis section by section, confirm before moving on
- **No code, no files, no execution** — terminal action is Plan Mode, nothing else

## AskUserQuestion Usage Reference

```
// Batch related questions (up to 4) — each with a recommended answer
AskUserQuestion({
  questions: [
    {
      question: "What's the primary goal of this change? (recommend: add genre filter)",
      type: "open_ended"
    },
    {
      question: "Should the filter be a select or a free-text input? (recommend: select — finite genres)",
      type: "multiple_choice",
      options: ["select", "free-text input", "both"]
    }
  ]
})

// One-at-a-time when answers cascade
AskUserQuestion({
  questions: [{
    question: "Should new records persist immediately or on form submit only? (recommend: on submit — matches rubric example)",
    type: "multiple_choice",
    options: ["Immediately on every keystroke", "On form submit only", "Both with debounce"]
  }]
})
```

Use `multiple_choice` for: scope, priority, approach selection, enumerable options.
Use `open_ended` for: description of behavior, success criteria, constraints the user defines themselves.
