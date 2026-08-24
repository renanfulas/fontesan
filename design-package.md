# Pacote de Design: Fontesan

Documento único do Loop de Direção Criativa. Todo texto aqui presente vai para o site verbatim. Números de faixas são pontos de partida, validados pelo teste de flick.

## 1. A premissa da marca

Você escolhe o alimento com os olhos, mas a segurança ninguém vê. Ela é feita antes: nas mãos, nos processos, na rotina de quem prepara. A página inteira ensina e vende essa ideia, e a Fontesan é quem transforma esse cuidado invisível em rotina visível, documentada e aprovada, para padarias, restaurantes e mercados.

Uma palavra: **rotina**. O selo é o símbolo dela.

## 2. A paleta (extraída dos vídeos)

Do flat-lay "vegetais passando" (fundo bege quente), do verde da salsa/coentro e do citrino de "escolhendo limões":

```css
:root{
  --canvas:#f5eee1;        /* creme quente, tom do fundo do flat-lay */
  --panel:#fbf7ee;         /* cartões claros */
  --panel-deep:#ece2cf;    /* superfícies rebaixadas */
  --deep:#16281c;          /* seções escuras: fatos, settle, rodapé (verde profundo da salsa) */
  --deep-panel:#1f3627;
  --ink:#1f3826;           /* texto principal sobre creme */
  --text-secondary:#5d6d54;
  --accent:#d9821b;        /* laranja cítrico do hero; botões, com texto escuro por cima */
  --accent-hover:#b76a10;
  --accent-ink:#9c5a0d;    /* accent para TEXTO sobre creme (contraste 4.5+) */
  --accent-muted:rgba(217,130,27,.16);
  --cream-on-deep:#f2ecdd; /* texto sobre --deep */
}
```

Contraste verificado: ink/canvas ≈ 10:1; secondary/canvas ≈ 4.7:1; accent como fundo de botão com texto #1c130a ≈ 6:1; accent-ink/canvas ≈ 4.6:1. Canvas nunca é branco puro; deep nunca é preto puro.

Nota de direção, dita em voz alta: creme + comida é vizinho de um look clichê, mas aqui é o mundo literal da filmagem (a mesa bege do flat-lay). Ganho o desvio com o selo assinatura, tipografia própria e nenhum layout de template.

## 3. O trio tipográfico

- **Display: Fraunces** (500, 600; opsz auto). Serifa com calor de comida e seriedade de instituição.
- **Corpo: Public Sans** (400, 600). Sans limpa de linhagem governamental: a voz da vigilância, domesticada.
- **Mono: IBM Plex Mono** (400, 500). Rótulos pequenos, números de capítulo, citações de fonte, microcopy técnico.

Google Fonts com preconnect, só os pesos listados. Nunca Inter/Roboto.

## 4. O motor (desvio declarado da skill)

Sete vídeos reais de cenas distintas: em vez de um único vídeo raspado pelo scroll, a página é uma **história em capítulos**. Cada capítulo é uma seção alta (~170 a 220vh) com palco sticky de 100vh: o vídeo toca em loop lento (muted, playsinline, playbackRate 0.9), carregado preguiçosamente ao se aproximar, e o texto monta e desmonta guiado pelo progresso de scroll da seção (variável --k, escrita delta-gated). Sem seeks, sem blob scrub: o pipeline pesado de scrub não se aplica. O restante do padrão permanece inteiro: coreografia por entrada, scrims em quatro camadas, pausa fora de tela, página completa sem vídeo, movimento reduzido honrado ao vivo.

Celular: mantém os vídeos (arquivos de 2 a 4 MB, carregados só ao chegar perto). Save-Data ou movimento reduzido: pôsteres compostos, nenhum vídeo baixado.

## 5. O mapa de capítulos (texto verbatim)

Hero: layout 60/70 pedido pelo usuário: vídeo dominando, coluna de texto na área calma (superior direita, prateleiras desfocadas).

| # | Vídeo | Kicker (mono) | Texto (verbatim) | Entrada (eco) |
|---|---|---|---|---|
| 1 | escolhendo limões | FONTESAN · SEGURANÇA DE ALIMENTOS | **Você escolhe com os olhos.** / A segurança de um alimento, ninguém vê. Ela é feita antes, nas mãos e na rotina de quem prepara. | Subida palavra a palavra, rampa de carga (abre montado) |
| 2 | vegetais passando | CAP. 02 · O CAMINHO | **Do fornecedor à mesa, todo alimento percorre um caminho.** / Recebimento, armazenamento, preparo, exposição. Cada etapa protege ou contamina. Não existe meio-termo. | Drift-down (eco do flat-lay pousado) |
| 3 | luvas e embalagens | CAP. 03 · O MÉTODO | **Cuidado de verdade tem método.** / Luvas, temperatura certa, embalagem íntegra, registro no papel. É essa rotina que mantém o risco longe do balcão. | Grid snap-align (eco das embalagens enfileiradas) |
| 4 | morango descascado | CAP. 04 · O DETALHE | **A segurança mora nos detalhes.** / Uma tábua trocada, uma mão lavada, um grau a menos na geladeira. Gestos pequenos, repetidos todos os dias, no ponto certo. | Blur-to-sharp (eco do foco de perto) |
| 5 | familia feliz | CAP. 05 · O MOTIVO | **No fim do caminho, tem sempre uma mesa.** / Quem come confia de olhos fechados. Essa confiança é o bem mais valioso do seu negócio. | Scatter suave (eco da família se juntando) |
| 6 | criança bebendo leite | CAP. 06 · OS PRIMEIROS | **E tem quem dependa dela por inteiro.** / Crianças, gestantes e idosos sentem primeiro, e sentem mais forte, qualquer falha que escapar da cozinha. | Drift-down lento, beat quieto |
| 7 | criança melancia | CAP. 07 · O RISCO | **Um descuido invisível desfaz tudo isso.** / O Brasil notifica cerca de 650 surtos de doenças transmitidas por alimentos por ano. Restaurantes e padarias estão entre os lugares onde eles mais nascem. Ninguém percebe o erro até alguém adoecer. | Word-punch com overshoot em "descuido" e "desfaz" |
| S | settle (poster do hero como imagem de fundo? não: fundo --deep com selo) | | **É aqui que a Fontesan entra.** / Consultoria em segurança de alimentos e vigilância sanitária para padarias, restaurantes e mercados. O cuidado invisível, feito rotina. / [Chamar no WhatsApp] [Pedir um diagnóstico] | Settle encenado: título, depois sub, depois CTAs |

Pauta de pacing: platô de cada beat ≥ 100vh; rampas ~20vh; validar com flick de 120/240/360px.

## 6. Abaixo da dobra (verbatim)

**Nav:** selo + Fontesan · A história · Serviços · Como funciona · Perguntas · [WhatsApp]

**Serviços ("O que a Fontesan faz")** , 4 cartões:
1. *Consultoria em vigilância sanitária* — Adequação completa às exigências da sua cidade: licenças, laudos e o que o fiscal pede na porta.
2. *Treinamento de manipuladores* — Sua equipe aprende o porquê de cada regra, no seu balcão, com a sua rotina. Gente treinada erra menos.
3. *Documentação técnica* — Manual de Boas Práticas e POPs escritos para o seu negócio, do jeito que a RDC 216 exige. Nada de modelo genérico.
4. *Auditorias e visitas* — Checklist, visita periódica e correção antes que o problema vire notificação.

**Para quem** (vídeo restaurante + três colunas):
- *Padarias* — Produção própria, manipulação intensa, público todo dia. Risco alto numa rotina corrida.
- *Restaurantes e cozinhas* — Do recebimento ao prato, cada turno é uma prova de processo.
- *Mercados e hortifrútis* — Exposição, refrigeração e validade sob o olhar do cliente e do fiscal.

**Como funciona** (3 passos + momento interativo):
1. *Diagnóstico* — Visitamos o seu negócio e mapeamos, ponto a ponto, o que está em dia e o que está em risco.
2. *Adequação* — Plano claro, prazos reais, documentos escritos, equipe treinada. Sem parar a operação.
3. *Rotina* — Visita e auditoria periódicas para a casa seguir em dia. Fiscal na porta deixa de ser susto.

Momento interativo: **"Segure para aprovar"**. O visitante segura o botão; o selo Fontesan se desenha e carimba EM DIA sobre um cartão de checklist; soltar cedo desfaz com suavidade; completar acende os três passos em sequência. Movimento reduzido: estado final direto.

**Fatos (faixa escura, fontes em mono pequeno):**
- ~650 surtos de doenças transmitidas por alimentos notificados por ano no Brasil.
- 16% dos surtos nascem em restaurantes, padarias e similares.
- 10% das punições chegam à interdição total. Antes dela vêm advertência (31%) e multa (20%).
- E a maior parte dos casos nunca vira estatística.
Fonte: SINAN / Ministério da Saúde; estudo de autuações em capital do Nordeste.

**Interlúdio vertical** (coentro + escolhendo vegetais, lado a lado):
*Alimento bom se reconhece no olhar. Alimento seguro se constrói na rotina.*

**Quem assina** (credencial, entre o interlúdio e a FAQ):
Kicker *Quem assina*, título *Toda rotina precisa de alguém que responda por ela.*
Cartão em formato de carteira profissional: faixa escura com *Responsável técnica* e *CRN-3 67286*; corpo claro com o selo, o nome **Giovanna Fontes Rios**, a linha *Nutricionista, pós-graduada em Vigilância Sanitária e Qualidade de Alimentos*, o parágrafo *Quem visita o seu negócio, escreve os documentos e assina o trabalho é a mesma pessoa. Sem terceirizar, sem intermediário.* e três marcadores: *Atendimento presencial em toda a Grande São Paulo* · *Registro ativo no Conselho Regional de Nutricionistas da 3ª região* · *Do diagnóstico à auditoria de rotina, com o mesmo responsável*.

**Perguntas de verdade (FAQ):**
0. *Vocês atendem a minha região?* — A Fontesan atende toda a Grande São Paulo presencialmente. Se o seu negócio fica um pouco além, chame no WhatsApp e a gente vê o que dá para fazer.
1. *Meu negócio é pequeno. Isso é para mim?* — A RDC 216 vale para qualquer serviço de alimentação, do food truck à rede. A fiscalização também. O tamanho muda o plano, nunca a obrigação.
2. *Recebi uma notificação com prazo. Dá tempo?* — Quase sempre, sim. O protocolo prevê prazo de adequação antes da segunda visita. Quanto antes começar, mais calmo e mais barato fica.
3. *Minha cozinha é limpa. Preciso mesmo de documentos?* — Precisa. Para a vigilância, cuidado sem registro é cuidado que não aconteceu. Manual de Boas Práticas e POPs são exigência legal.
4. *Quanto custa?* — Depende do tamanho e do estado do seu negócio, e por isso o primeiro passo é o diagnóstico. O que dá para garantir: custa menos que uma multa, e muito menos que uma interdição.
5. *Vou precisar fechar durante a adequação?* — Não. O plano é desenhado para rodar com a casa funcionando.

**CTA final + formulário:**
Título: *A visita do fiscal não tem hora marcada. A sua tranquilidade pode ter.*
Botão principal: **Chamar no WhatsApp** (wa.me/5511947811422, com mensagem pré-preenchida).
Formulário: Nome · Tipo de negócio (Padaria / Restaurante ou cozinha / Mercado ou hortifrúti / Outro) · WhatsApp ou telefone · Mensagem (opcional). Botão: **Quero um diagnóstico**. Microcopy: *Retornamos em até um dia útil.* Sucesso: *Recebido. A Fontesan fala com você em até um dia útil.*
Tratamento: serviço de formulário (Formspree ou planilha) ligado no deploy; até lá, estado de sucesso JS com aviso claro no chat, nunca no site.

**Rodapé:** selo + Fontesan · Segurança de alimentos e vigilância sanitária para padarias, restaurantes e mercados · Grande São Paulo · (11) 94781-1422 · atendimento@fontesan.com.br · Responsável técnica Giovanna Fontes Rios · CRN-3 67286 · *Imagens ilustrativas.* · ano.

## 7. O elemento assinatura e a camada vetorial

**O Selo Fontesan**: selo circular SVG desenhado à mão em código: anel duplo, texto circular "FONTESAN · SEGURANÇA DE ALIMENTOS", marca central (folha dentro de um escudo-check). Aparece: no nav (pequeno, estático), no settle (se desenha com o scroll), no momento interativo (carimba), no rodapé e como favicon. É a assinatura; o resto fica quieto.

Vetores de apoio, nível sussurro: linha de inspeção tracejada que se desenha descendo entre as seções abaixo da dobra, com pontos de checagem que acendem ao passar; grão sutilíssimo nas seções escuras. Tudo respeita movimento reduzido (estados finais, drives parados).

Um elemento vivo por seção (nível sussurro, ciclos ≥ 4s, delays negativos, pausa fora de tela e em aba oculta via classe no body).

## 8. A lista de engenharia

Palcos sticky por capítulo; IntersectionObserver arma/pausa vídeos e o rAF; --k por banda com escrita delta-gated (0.008); loops de vídeo lazy (data-src, troca ao aproximar, poster primeiro, erro esconde vídeo sobre poster); legibilidade em quatro camadas (scrim global radial, scrim por banda em ::before com pico 0.62 a 0.72, token --tshadow de três camadas, chip para texto pequeno) com auditoria de pior quadro ≥ 3.5:1; entradas só transform/opacity, reversíveis, banda 1 com rampa de carga; delays de stagger aposentados com especificidade correta; overflow-x clip em html e body (hidden antes como fallback); movimento reduzido completo e ao vivo nas duas direções; texto em ch no próprio elemento; alvos de toque 44px em pointer coarse; focus-visible no accent; landmarks semânticos + skip link; título real, meta description, theme-color, favicon SVG inline do selo; og:image e og:url com comentário <!-- DEPLOY STEP -->; baseline em linhas de texto; letras com cauda respiram em máscaras.

## 9. A linha do portão de copy

Todo texto acima vai verbatim. Antes de qualquer pessoa ver: grep por travessão (zero) e pelas palavras de estoque e tiques de IA (zero), varredura nas seções baixas incluída. Os dispositivos deliberados deste pacote (o staccato "Recebimento, armazenamento, preparo, exposição.", o par "protege ou contamina") são artesanato e ficam.
