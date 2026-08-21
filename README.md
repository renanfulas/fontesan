# Fontesan

Site institucional da Fontesan: consultoria em segurança de alimentos e vigilância sanitária para padarias, restaurantes e mercados na Grande São Paulo.

Página única com scroll cinematográfico, HTML, CSS e JavaScript puros, sem build step. Sete capítulos contam a história do alimento, do olhar até a mesa, e desaguam numa única chamada para ação: WhatsApp ou formulário de diagnóstico.

## Estrutura

```text
site/               deploy real: index.html + assets (vídeos, imagens, ícones)
design-package.md   premissa da marca, paleta, tipografia, copy verbatim, mapa de capítulos
deploy/             config de referência do Nginx para a VPS (não aplicada automaticamente)
```

## Rodar a prévia local

O site é estático, então qualquer servidor local serve:

```bash
npx http-server site -p 8330
```

Abra `http://localhost:8330`. Dois caminhos de prévia: abrir `site/index.html` direto no navegador mostra a versão estática (imagem parada, sem os vídeos que raspam com o scroll, porque navegadores bloqueiam `fetch` em `file://`); o servidor local acima mostra a experiência completa.

## Deploy

O site roda numa VPS junto do [supportfaqagent](https://github.com/renanfulas/supportfaqagent), atrás do mesmo Nginx e mesmo domínio (same-origin, sem CORS). O formulário de contato chama `POST /web/fontesan/leads` nesse backend e grava direto no Postgres que já roda lá.

Config de referência do Nginx, com checklist de deploy: [`deploy/nginx-fontesan.conf.example`](deploy/nginx-fontesan.conf.example).

## Vídeos brutos

Os vídeos originais (antes de recortados e comprimidos para a web) não ficam neste repositório por tamanho. Estão disponíveis na [Release de assets brutos](../../releases).
