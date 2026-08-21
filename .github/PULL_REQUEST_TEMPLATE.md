## Resumo

Explique a mudanca em 2-4 linhas.

## Tipo de mudanca

- [ ] Feature
- [ ] Fix
- [ ] Docs
- [ ] Seguranca
- [ ] Refactor
- [ ] Governanca/CI

## Validacao

- [ ] Mudanca em `backend/`: `python -m compileall app tests scripts` e `python -m pytest` (rodar dentro de `backend/`)
- [ ] Mudanca em `backend/`: evals rodados quando a mudanca toca prompt, retrieval, dominio ou handoff
- [ ] Mudanca em `site/`: prevía local checada no navegador (`npx http-server site -p 8330`)
- [ ] Docs atualizados quando necessario

## Seguranca

- [ ] Nao adicionei secrets
- [ ] Nao adicionei PII em logs
- [ ] Nao expus tokens, prompts sensiveis ou session_id bruto

## Ownership

- [ ] A mudanca respeita a responsabilidade da frente afetada
- [ ] Coordenei com o responsavel quando toquei deploy, DB, LangChain ou seguranca
