---
name: supportfaq-next-step-planner
description: Use when someone asks what to do next in the supportFAQagent project, wants to start a task, or wants to validate whether an intended change is aligned with the technical plan. This skill checks main/current state, recent commits or PRs, the technical plan, and then asks only what the person intends to change before recommending the safest next step.
---

# supportFAQagent Next Step Planner

## O que esta skill faz

Skill que ajuda a decidir "o que fazer agora" sem atropelar o plano tecnico. Ela verifica a `main`, ultimos commits/PRs e docs do plano, pergunta apenas o que a pessoa pretende mexer, e entao sugere o menor proximo passo seguro.

Use this skill when a contributor asks:

- "O que eu faco agora?"
- "Qual proximo passo?"
- "Posso mexer nisso?"
- "Estou pensando em implementar X."

Goal: act as a lightweight technical coordinator. Do not implement first. First align intent, plan, and next safe action.

When the task touches README, docs, PR text, onboarding, or agent instructions, keep recommendations aligned with `docs/product-positioning.md`: commercial-technical, safe, traceable, and honest about MVP limits.

## Core Rule

Ask this question when the user's intent is missing:

```text
O que voce pretende implementar ou mexer?
```

If it is already clear from the conversation, do not ask again.

## Required Context Check

Before recommending a next step, inspect the current project state.

Preferred commands:

```bash
git status --short --branch
git log --oneline --decorate -15
```

If safe and useful, update local main first:

```bash
git switch main
git pull --ff-only
```

Do not force reset or discard user changes.

## Required Docs

Read these first:

1. `README.md`
2. `docs/product-positioning.md`
3. `docs/MVP/technical-implementation-plan.md`
4. `docs/MVP/mvp-plan.md`
5. `docs/navigation.md`

Then read only the task-specific docs:

| Intended area | Additional docs |
| --- | --- |
| README/docs/product narrative | `docs/product-positioning.md`, `docs/agent-skills.md` |
| API/Meta WhatsApp/Hermes/contracts | `docs/architecture/integration-contracts.md`, `docs/architecture/observability.md` |
| Domain config | `docs/architecture/domain-contract.md` |
| Knowledge/RAG content | `docs/architecture/knowledge-authoring.md`, `docs/architecture/domain-evals.md` |
| GitHub document loader or external source loading | `docs/architecture/knowledge-authoring.md`, `docs/MVP/technical-implementation-plan.md`, `app/ingestion/github_loader.py`, `scripts/fetch_github_document.py` |
| Evals/calibration | `docs/architecture/domain-evals.md` |
| Observability/security | `docs/architecture/observability.md`, `docs/architecture/code-standards.md` |
| PostgreSQL/pgvector | `docs/MVP/technical-implementation-plan.md` SQL sections |
| LangChain/splitters/loaders | `docs/MVP/technical-implementation-plan.md`, ingestion sections |
| Dependency management/security audit | `pyproject.toml`, `.github/workflows/security.yml`, `CONTRIBUTING.md` |
| Contribution/commit/PR | `CONTRIBUTING.md`, `.agents/skills/supportfaq-git-flow/SKILL.md` |

## Planning Output

After context + intent + name are known, respond with:

```md
## Status atual

Resumo curto do que a main ja tem relacionado a essa area.

## Alinhamento com o plano

Se esta dentro do plano, adiantado demais, bloqueado ou dependente de outra frente.

## Risco tecnico

Baixo/medio/alto e por que.

## Proximo passo seguro

Menor tarefa implementavel agora.

## Docs e arquivos para ler

Lista curta.

## Validacao esperada

Testes, evals ou checks que devem rodar.
```

Keep the answer practical. Do not write a long architecture essay unless asked.

## Decision Heuristics

- If the task changes the GitHub Contents API loader, dependency strategy, install commands, or audit gates, validate the contracts before implementing.
- If the task touches public exposure, security, secrets, PII, or logs, require hardening and tests.

## What Not To Do

- Do not implement before asking intent when missing.
- Do not recommend rewriting the architecture from scratch.
- Do not move intelligence rules into Meta, Hermes or any external transport.
- Do not make Chroma the production source of truth unless the team explicitly decides.
- Do not bypass pgvector as the production vector store by creating a parallel one.
- Do not tell someone to edit files before pointing them to the relevant docs.

## Hand-off To Other Skills

Use with:

- `supportfaq-project-navigator` after the next step is chosen and before implementation.
- `supportfaq-git-flow` before commit, push, or PR.
