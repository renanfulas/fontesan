# Fontesan

Site institucional e backend da Fontesan: consultoria em segurança de alimentos e vigilância sanitária para padarias, restaurantes e mercados na Grande São Paulo.

No ar em [fontesan.com.br](https://fontesan.com.br). O backend vai abrir em breve em `fontesan.online`.

Monorepo com duas partes: o site público (`site/`) e o agente de suporte que recebe os leads do formulário (`backend/`). Vivem no mesmo repositório e na mesma VPS, atrás do mesmo Nginx.

## Estrutura

```text
site/               deploy real do site: index.html + assets (vídeos, imagens, ícones)
design-package.md   premissa da marca, paleta, tipografia, copy verbatim, mapa de capítulos
branding/           identidade da marca: logo, brand book e estratégia (ainda fora do site)
backend/            agente de suporte (FastAPI + Postgres/pgvector) que recebe POST /web/fontesan/leads
deploy/             config de referência do Nginx para a VPS (não aplicada automaticamente)
.github/workflows/  CI: testes e gates do backend (backend-*.yml), varredura de segredos no repo inteiro (security.yml)
```

## Site: rodar a prévia local

O site é estático, então qualquer servidor local serve:

```bash
npx http-server site -p 8330
```

Abra `http://localhost:8330`. Dois caminhos de prévia: abrir `site/index.html` direto no navegador mostra a versão estática (imagem parada, sem os vídeos que raspam com o scroll, porque navegadores bloqueiam `fetch` em `file://`); o servidor local acima mostra a experiência completa.

## Marca

Identidade visual, brand book e estratégia de marketing em [`branding/`](branding/). Comece pelo [brand board](branding/assets-png/brandboard.png), que mostra a marca inteira numa imagem só. Nada de `branding/` está aplicado no site ainda.

## Backend

FastAPI + PostgreSQL/pgvector. Detalhes completos de arquitetura, convenções e o mapa de documentação em [`backend/README.md`](backend/README.md) e [`backend/CLAUDE.md`](backend/CLAUDE.md).

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate   # ou source .venv/bin/activate no Linux/Mac
pip install -e ".[dev]"
python -m pytest
```

O formulário de contato do site chama `POST /web/fontesan/leads` neste backend e grava direto no Postgres. A rota, a migration e o serviço ficam em `backend/app/fontesan_leads/`, `backend/app/api/routes/fontesan_leads.py` e `backend/migrations/020_fontesan_leads.sql`.

## Deploy

Site e backend rodam na mesma VPS, atrás do mesmo Nginx e mesmo domínio (same-origin, sem CORS — o backend não tem `CORSMiddleware` configurado).

A VPS clona o repositório direto do GitHub com uma chave de deploy (o repositório é privado) e atualiza com `git pull`. Passo a passo completo: [`deploy/deploy-via-git.md`](deploy/deploy-via-git.md). Config de referência do Nginx, com checklist de deploy: [`deploy/nginx-fontesan.conf.example`](deploy/nginx-fontesan.conf.example).

## Vídeos brutos

Os vídeos originais do site (antes de recortados e comprimidos para a web) não ficam neste repositório por tamanho. Estão disponíveis na [Release de vídeos brutos](https://github.com/renanfulas/fontesan/releases/tag/videos-brutos).
