# Identidade da marca Fontesan

Material de marca, separado do site de propósito. Nada aqui está publicado ainda.

## Comece por aqui

| Arquivo | O que é |
|---|---|
| [`assets-png/brandboard.png`](assets-png/brandboard.png) | **A marca inteira numa imagem só.** Melhor ponto de partida para ver tudo junto. |
| [`marca-fontesan.md`](marca-fontesan.md) | Brand book: história, missão, valores, posicionamento, voz, cores, tipografia, regras de uso. |
| [`marketing-fontesan.md`](marketing-fontesan.md) | Estratégia: personas, canais por prioridade, campanha, métricas e ordem de execução. |

## Pastas

```text
logos/          arquivos oficiais da marca em SVG (vetor, escala infinita)
assets-png/     tudo renderizado em PNG alta resolução, pronto para usar
fotografia/     frames dos próprios vídeos como referência de direção de arte
_render/        bastidor: código que gera os arquivos acima (não é entregável)
```

## Qual arquivo usar em cada lugar

**Redes sociais, WhatsApp, Google:** `assets-png/avatar.png` como foto de perfil, `assets-png/capa.png` como capa.

**Posts prontos:** `post-lancamento.png`, `post-detalhe.png`, `post-urgencia.png` (todos 1080x1350, formato de feed do Instagram).

**Gráfica (cartão, adesivo):** mande os arquivos de `logos/` (SVG) para a gráfica. Se pedirem PNG, use os de `assets-png/`, que estão em resolução alta o bastante para impressão. O cartão sai em `cartao-frente.png` e `cartao-verso.png` (proporção 90x50mm).

**Documentos técnicos (laudo, manual, POP):** `logos/logo-horizontal.svg` no cabeçalho, `logos/selo.svg` no rodapé junto do nome e do CRN.

**Carimbo físico ou impressão em uma cor só:** `logos/icone-mono-preto.svg`.

## Detalhe técnico que evita dor de cabeça

Todo texto dos SVGs está **convertido em curvas**. Isso significa que o logo abre igual em qualquer lugar (gráfica, Canva, Illustrator, computador sem internet) sem precisar instalar fonte nenhuma. Foi testado com o acesso às fontes bloqueado, justamente para provar isso.

Se um dia alguém precisar editar o texto do logo, aí sim vai precisar das fontes originais: Fraunces e IBM Plex Mono, ambas gratuitas no Google Fonts.

## Como regerar tudo

Só é necessário se a marca mudar. Dentro de `_render/`:

```bash
npm install opentype.js
node gera-logos.mjs      # gera os SVGs com texto em curvas
node shots.mjs finais.html ../assets-png 2      # gera os PNGs
node shots.mjs brandboard.html ../assets-png 1  # gera o brand board
```

As fontes usadas na geração não são versionadas; baixe de `fonts.googleapis.com` para `_render/fonts/` se precisar rodar de novo (os links estão no histórico deste repositório).
