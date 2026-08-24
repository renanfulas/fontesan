# Plano de SEO Fontesan

**Data:** 23/08/2026 · **Equipe:** Giovanna (técnica, CRN-3 67286) + Renan (dev) · **Complementa:** `automacao-marketing-vendas.md`

---

## 1. O veredito, antes de qualquer tática

**O SEO orgânico não ganha a janela da CVS-3/2026.** Faltam seis semanas para 04/10. Um domínio novo, sem backlink, em nicho YMYL, começa a receber impressão de 2 a 8 semanas depois de indexado e só converte com regularidade a partir do quarto ao oitavo mês. Não existe caminho legítimo que encurte isso.

Escrever essa frase agora é a parte mais importante deste documento. Sem ela, em 60 dias alguém olha o painel vazio, conclui que "SEO não funciona para a Fontesan" e corta o canal exatamente quando ele começaria a pagar.

O que muda o resultado até 04/10 é o que já está no plano de aquisição: entidades de classe, carteira existente, Google Perfil da Empresa e mídia paga. **O SEO tem dois papéis nessas seis semanas, e nenhum deles é ranquear:**

1. **Parar de perder o que já chega.** O site tem coisas quebradas que custam lead hoje — preview de WhatsApp quebrado, formulário sem aviso de privacidade, texto que viola o código de ética. Isso é reparo, não crescimento, e cabe em horas.
2. **Plantar o que só paga em 2027.** Uma página e um perfil verificado — o perfil porque tem lead time de até cinco semanas, a página porque vai receber o tráfego pago de qualquer jeito. Se não forem plantados agora, em fevereiro a Fontesan estará na mesma posição de hoje.

A tese de fundo: **a Fontesan tem um ativo de conteúdo que nenhum concorrente da Grande SP tem** — 11 arquivos técnicos e o PDF oficial da CVS-3 arquivado — e ele está 100% fora do índice do Google, trancado num diretório do backend.

---

## 2. O que a auditoria derrubou

Seis lentes auditaram o repositório e cada achado passou por um verificador com ordem de refutar. Três coisas que pareciam verdadeiras não sobreviveram, e valem mais que os achados confirmados porque impediriam trabalho errado:

**Os arquivos `deploy/nginx-*.conf.example` não são a configuração de produção.** A linha 2 deles declara isso, e o `deploy-via-git.md` registra que o servidor foi montado com certbot, que reescreveu o arquivo vivo. Todo achado sobre redirect 301, HSTS ou compressão baseado nesses arquivos é achado sobre um documento. **Antes de editar Nginx, medir a produção** (§7.1).

**A SPA `fontesan.online` não é o problema que parecia.** O achado de "soft 404 em qualquer caminho" e "rota /leads exposta" foi refutado na verificação de código. O que resta é real e menor: ela é indexável, disputa a busca de marca com o título "Fontesan — Suporte" e precisa de `noindex` por header — não de redesenho.

**Não existe mapa embedado para remover.** Achado inventado a partir de uma boa prática genérica.

E uma refutação que me pegou: eu disse aos auditores que os números da CVS-3 estavam "conferidos item a item". **Estava errado.** Ver §3.

---

## 3. Bloqueantes — o que está errado e já está no ar

Estes sete itens não são otimização. São defeitos que já existem — cinco publicados sob a assinatura de uma profissional registrada, e dois (§3.6 e §3.7) que tornariam a mídia paga inatribuível. Nada de conteúdo novo sobe antes deles, e nenhum real de mídia é gasto antes do §3.6.

### 3.1 Dois erros factuais na base de conhecimento (conferidos por mim contra o PDF)

O `sources/README.md` registra o artigo da CVS-3 como "conferido item a item em 22/08/2026". Refiz a conferência contra o texto extraído do PDF oficial. **Oito de dez afirmações numéricas estão corretas. Duas não.**

| Onde | O que diz | O que a portaria diz |
|---|---|---|
| `articles/portaria-cvs-3-2026-nova-norma-sp-outubro.md:29` e `faqs/temperaturas-de-conservacao-de-alimentos.md:16` | "Pescado e carnes cruas: 0°C a 5°C" | A tabela separa **Refrigerados Pescados: 2 a 3°C** de **Preparações com pescados crus ou carnes cruas: 0 a 5°C.** As duas linhas foram fundidas. |
| `articles/portaria-cvs-3-2026-nova-norma-sp-outubro.md:24` | Máscara — "art. 21, §3º" | É o **art. 15, §3º**. O art. 21 é o programa de educação permanente; o art. 22 é o curso de 8h. Os números foram embaralhados entre os tópicos. |

O erro do pescado é o grave: não é imprecisão de redação, é um número que leva o leitor a regular a câmara em 5°C achando que está conforme quando a norma pede 2–3°C.

**Corretos e conferidos:** 40s de higienização das mãos (art. 15 §1º), 75°C de cocção (art. 59) e de reaquecimento (art. 68), 96h de guarda de amostras, 16°C/2h por lote ou 30 min em ambiente (art. 55), sobremesas com recheio a 4°C/3 dias, monitoramento de equipamento 2×/dia (art. 48), alimento exposto a cada 2h (art. 73), guarda de documentos por 180 dias (art. 181).

**Uma terceira incoerência, interna:** `faqs/asseio-pessoal-do-colaborador.md:13` diz que a máscara "deixa de ser proibida" enquanto o artigo diz "não é obrigatória". São afirmações diferentes e uma delas está errada.

**Consequência:** a base de conhecimento **não está verificada**, e a revisão da Giovanna prevista na Onda 0 do plano de aquisição continua sendo pré-requisito de tudo. O portão de saída dela não é `run_domain_eval 8/8` — é *zero afirmação numérica sem artigo citado.*

### 3.2 FAQ de preço viola o código de ética — `site/index.html:584`

Está no ar: *"O que dá para garantir: custa menos que uma multa, e muito menos que uma interdição."* É a palavra "garantir", é comparação de honorário com penalidade e é ancoragem no medo. Também é resposta ruim de busca: não diz o que determina o preço.

```html
<!-- DEPOIS -->
<details><summary>Quanto custa uma consultoria de vigilância sanitária?</summary><p>O valor depende do porte do estabelecimento, do número de manipuladores e do que o diagnóstico encontrar. Não existe tabela pronta porque uma padaria de bairro e uma cozinha industrial não têm o mesmo escopo de documentação nem o mesmo tempo de visita. Na visita de diagnóstico a responsável técnica levanta ponto a ponto o que precisa ser feito e devolve uma proposta por escrito, com escopo, prazo e valores. Por conduta profissional, valores são tratados diretamente com você e não divulgados em canal público.</p></details>
```

Repare no fecho: descreve a **própria conduta**, não interpreta a norma de terceiro. Há divergência não resolvida sobre qual código do CFN vige, e afirmar o que ele "determina" é criar uma exposição nova para fechar outra.

### 3.3 FAQ de notificação promete resultado — `site/index.html:582`

Está no ar: *"Quase sempre, sim. O protocolo prevê prazo de adequação antes da segunda visita."* É promessa de resultado sobre processo administrativo e afirmação normativa sem fonte que varia por município. Pior: **o agente RAG escala esse tema** (`domain.yaml:43`, `:48`) enquanto o site promete. O robô é mais prudente que o site.

E esta é a busca de maior valor do negócio inteiro — *"recebi notificação vigilância sanitária"* — hoje gasta em duas frases que não dão um passo acionável.

```html
<!-- DEPOIS -->
<details><summary>Recebi uma notificação da vigilância sanitária com prazo. O que faço agora?</summary><p>Comece lendo o documento e separando três informações: quais itens foram apontados, qual o prazo de cada um e se há data marcada de reinspeção. Guarde o original e fotografe cada página. Prazo e regra de prorrogação variam conforme o município da Grande São Paulo e conforme o que foi apontado, então não existe resposta única: quem avalia caso a caso é a responsável técnica, com o documento à vista. O que a Fontesan faz nesse momento é ler a notificação com você, separar o que é ajuste imediato do que exige obra ou compra, e organizar a evidência documental de cada item corrigido. Não emitimos parecer sobre auto de infração sem ver o documento e não prometemos resultado de processo administrativo.</p></details>
```

As duas últimas frases são simultaneamente o escudo ético e o diferencial de confiança. Em YMYL, dizer o que **não** se faz é dos sinais de E-E-A-T mais fortes que existem, e é exatamente o trecho que um motor de IA reproduz ao descrever um prestador.

### 3.4 Estatísticas sem fonte verificável — `site/index.html:519-524`

Os números 16%, 10%, 31% e 20% estão no ar, em texto, sob CRN-3 67286, com fonte declarada apenas como *"estudo de autuações em capital do Nordeste"* — referência que não se localiza, não está arquivada e é de outra região, usada para dimensionar o risco de um negócio da Grande SP.

Apagar as linhas 519, 520, 521 e 524. Manter o card "?" e o H2, que funcionam sozinhos. O `~650` não se perde: a mesma informação já está publicada em prosa, com fonte, na linha 400.

Não consertar antes o bug do contador (o HTML serve `0%` e o JS anima até o valor) — consertar o HTML sem conferir os números só publica com mais clareza um dado que ninguém verificou.

### 3.5 Formulário coleta dado pessoal sem aviso

`site/index.html:599-626` coleta nome, tipo de negócio, telefone e mensagem. Não existe página de privacidade no site (`find` por *privac* em `site/` retorna vazio) nem checkbox de consentimento. Isso é exposição que existe hoje, independente de campanha, e `/privacidade/` é o segundo URL indexável mais barato do projeto.

---

### 3.6 A camada de atribuição é encanamento sem água

O achado mais consequente de toda a auditoria, e o único que nenhuma das seis lentes viu — saiu da crítica de viabilidade e eu confirmei linha a linha:

| Camada | Estado |
|---|---|
| `migrations/021_fontesan_leads_attribution.sql` | cria **21 colunas**: `origem`, `origem_url`, `utm_*` (5), `gclid`, `gbraid`, `wbraid`, `fbclid`, `fbp`, `fbc`, `landing_path`, `referrer`, `partner_slug`, `consent_text`, `consent_at`, `consent_ip`, `status`, `payload` |
| `app/api/schemas/fontesan_leads.py:38-56` | aceita **17 campos** de atribuição + `consent_given` |
| `site/index.html:928` | envia **cinco**: `nome`, `tipo_negocio`, `telefone`, `mensagem`, `site` (honeypot) |

Ou seja: a tabela, a migration e o schema estão prontos, e **nada escreve neles**. Os R$2.000 de mídia do plano de aquisição entrariam sem nenhuma atribuição possível, e as duas métricas-mãe da Onda 0 — ">90% de leads com `origem` preenchida" e "100% com `consent_text`" — seriam 0%, não por falha de operação, mas porque o formulário não manda o dado.

Custo do conserto: **~20 linhas de JavaScript.** É o melhor retorno por hora do documento inteiro.

```html
<script>
/* Atribuição de primeiro toque. Roda antes do submit; sessionStorage
   preserva a origem através de navegação interna. */
(function(){
  var K='fontesan_attr';
  if(sessionStorage.getItem(K)) return;
  var q=new URLSearchParams(location.search), c=document.cookie, a={};
  ['utm_source','utm_medium','utm_campaign','utm_term','utm_content',
   'gclid','gbraid','wbraid','fbclid','origem','partner_slug'
  ].forEach(function(k){ if(q.get(k)) a[k]=q.get(k).slice(0,200); });
  function cookie(n){ var m=c.match('(^|; )'+n+'=([^;]*)'); return m?decodeURIComponent(m[2]):null; }
  a.fbp=cookie('_fbp'); a.fbc=cookie('_fbc');
  a.landing_path=location.pathname.slice(0,300);
  a.referrer=document.referrer.slice(0,500)||null;
  a.origem_url=location.href.slice(0,500);
  if(!a.origem) a.origem = a.gclid ? 'google_ads'
                : a.fbclid ? 'meta_ads'
                : a.utm_source ? a.utm_source
                : (a.referrer ? 'referral' : 'direto');
  sessionStorage.setItem(K, JSON.stringify(a));
})();
</script>
```

E no `fetch` da linha 928, trocar o corpo por:

```js
body: JSON.stringify(Object.assign(
  { nome:nome, tipo_negocio:tipo, telefone:fone, mensagem:extra||null, site:honeypot||null,
    consent_given: document.getElementById('f-consent').checked },
  JSON.parse(sessionStorage.getItem('fontesan_attr')||'{}')
))
```

**Verificar:** abrir `/cvs3?utm_source=teste&gclid=abc123`, enviar o formulário, e conferir no Postgres que a linha nasceu com `origem='google_ads'` e `gclid='abc123'`. Enquanto esse teste não passar, não gastar o primeiro real de mídia.

### 3.7 A landing page não pode mandar o clique pago para a home

O template proposto pela auditoria fecha com `<a href="/#contato">` — ou seja, manda o clique de R$1.120 do Google Search para a home de 23 MB, exatamente o que o plano de aquisição proíbe no §9, item 5.

A LP precisa ter, **na própria página**: formulário de 3 campos postando em `/web/fontesan/leads` com os campos de atribuição acima, botão `wa.me` com texto próprio ("Vim pela página da CVS-3") e o checkbox de consentimento. Nenhum CTA dela aponta para a home enquanto a home pesar mais de 1 MB.

---

## 4. A arquitetura: quatro URLs, não catorze

O site inteiro é um arquivo. Todos os `href` internos são fragmentos (`#servicos`, `#faq`, `#contato`). Não existe URL para nenhuma intenção de busca — e é por isso que nenhuma correção de tag muda posição: não há página para posicionar.

A auditoria de conteúdo propôs 14 páginas. A verificação cortou para quatro, e a crítica cortou de novo: **dentro da janela, uma.** As outras três são perenes, não têm prazo, e publicar em outubro custa o mesmo e rende o mesmo. Esta tabela é o destino; a §5 diz o que entra antes de 04/10.

**Regra de URL:** sempre `/pasta/` com barra final, servida por `site/<pasta>/index.html`. O Nginx atual já resolve isso sem config nova. Nunca linkar as duas formas.

**Regra de termo:** `/portaria-cvs-3-2026/` é a **única** URL autorizada a ter a CVS-3/2026 como termo primário. Isso resolve, de uma vez, a canibalização que o plano de aquisição deixou em aberto entre a LP `/cvs3` e as futuras páginas `/norma`.

| # | URL | Title | Intenção | Fonte | Bloqueio |
|---|---|---|---|---|---|
| 1 | `/` | Fontesan · Consultoria em vigilância sanitária na Grande São Paulo | marca + navegacional | copy própria | §3.2–3.4 |
| 2 | `/portaria-cvs-3-2026/` | Portaria CVS-3/2026: o que muda em SP a partir de 04/10/2026 | informacional + comercial | `articles/portaria-cvs-3-2026-*.md` | revisão da Giovanna + §3.1 |
| 3 | `/documentos-que-a-vigilancia-pede/` | Documentos que a vigilância sanitária pede na vistoria | informacional pré-vistoria | `faqs/documentos-que-a-vigilancia-costuma-pedir.md` | revisão da Giovanna |
| 4 | `/temperaturas/` | Temperaturas de alimentos e equipamentos: RDC 216 e CVS-3/2026 | informacional | **fusão** das duas FAQs de temperatura | §3.1 + conferir RDC 216 |

Mais `/privacidade/` (não é SEO, é pré-requisito legal) e `/quem-assina/` (nasce junto com a primeira página técnica, para a byline ser linkável).

Três decisões embutidas:

- **As duas FAQs de temperatura viram uma página.** Elas repetem os mesmos três valores; duas páginas se canibalizariam.
- **`portaria-cvs-5-2013-boas-praticas-sp.md` não vira página.** Tem 1.826 bytes — vira a seção "o que vale até 04/10" dentro da página da CVS-3.
- **Publicar em `/cvs3`, e não em `/portaria-cvs-3-2026/`.** Eu tinha decidido o contrário; a crítica me convenceu. O slug bonito é sinal fraquíssimo de posição, e `/cvs3` **é o caminho que o plano de aquisição já distribuiu** no QR code do evento (`automacao-marketing-vendas.md:170`). Renomear agora acrescenta um redirect, uma peça móvel no caminho crítico e a armadilha do `$is_args$args` — que, se esquecida, mata a atribuição da migration 021 justamente no QR do evento. Renomear depois de 04/10, se ainda fizer sentido:

```nginx
# só em outubro, se a página virar aposta orgânica
location = /cvs3  { return 301 /portaria-cvs-3-2026/$is_args$args; }
location = /cvs3/ { return 301 /portaria-cvs-3-2026/$is_args$args; }
```

**O que NÃO vira página:** `/recebi-notificacao-da-vigilancia-sanitaria/`. É a busca de maior intenção do negócio e a Fontesan não pode respondê-la por escrito sem entrar em avaliação de processo administrativo, que o `domain.yaml:48` declara fora de escopo. A intenção é atendida pelo FAQ reescrito da home (§3.3), que é o formato honesto: orienta o primeiro passo e para onde a competência acaba.

---

## 5. Ordem de execução

Teto explícito: **Renan 12h/semana, Giovanna 8h/semana.** O que não couber não acontece — e está escrito abaixo o que não vai acontecer.

A auditoria produziu 59 itens, algo entre 60 e 75 horas do Renan e 40 a 60 da Giovanna. Isso é quatro vezes a capacidade, empilhado sobre um plano de aquisição que já estava quatro vezes acima da capacidade. Um plano que não cabe não é ambicioso, é um plano que vai ser abandonado pela metade — com a agravante de que várias dessas frentes deixam custo de manutenção para trás.

**Um dono por arquivo.** A especificação técnica e a de conteúdo reescrevem as mesmas linhas 9-14 do `index.html` com conteúdos diferentes e entregam blocos JSON-LD concorrentes para a mesma home. Vale o `<head>` da §6.1 e o `@graph` da §6.3, e mais nenhum.

### Até 04/10 — o que cabe (~20h de Renan, ~10h de Giovanna)

| Quando | Quem | Tempo | O quê |
|---|---|---|---|
| Seg 24/08 | Giovanna | 15 min | Decidir **qual endereço** será verificado e qual conta Google (da empresa, com 2FA) é proprietária. Nada de Perfil da Empresa anda sem isso, e é o item de maior lead time de todo o documento. |
| ~~Seg 24/08~~ | ~~Renan~~ | — | ~~E-mail e cartão~~ **Já corrigido em 23/08** (§10.1). |
| Seg 24/08 | Renan | 30 min | `<head>` da §6.1 no ar. Conserta o card do WhatsApp, que é o canal principal. |
| Seg 24/08 | Renan | 30 min | `audit-headers.sh` (§7.1) + Search Console como propriedade de **domínio** + pedir indexação da home. |
| Ter 25/08 | Giovanna | 2h | Reivindicar o Perfil da Empresa e disparar a verificação por vídeo. |
| Ter 25/08 | ambos | 1h | Reescrever os dois FAQs (§3.2, §3.3) e apagar as estatísticas sem fonte (§3.4). |
| Qua-Qui 26-27/08 | Renan | **1 dia** | `/privacidade/` + checkbox de consentimento + gravação de `consent_text` no backend + migration 021. |
| Qua 26/08 | Renan | **1h** | **Captura de atribuição (§3.6).** Nenhum real de mídia antes do teste `?gclid=abc123` passar. |
| Qui 27/08 | Renan | meio dia | GA4 + Consent Mode + os 5 links `wa.me` com texto distinto (§8). |
| Qui-Sex 27-28/08 | Giovanna | 4-6h | Revisar **só** o artigo da CVS-3, corrigindo os dois erros do §3.1 e numerando o artigo ao lado de cada afirmação. |
| Sex 28/08 | Renan | 2h | Recomprimir os posters (§7.2). Começar por `cap2-vegetais`: 5 minutos, -123 KB em 100% das visitas. |
| 29-31/08 | Renan | 1 dia | Publicar `site/cvs3/index.html`. |
| a partir de 01/09 | ambos | 30 min/sem | 1 post no Perfil da Empresa + o painel (§8). |

### A reclassificação que muda tudo: `/cvs3` não é peça de SEO

Uma página publicada em ~31/08, num domínio sem autoridade, contra concorrentes indexados desde 07/07, não posiciona em cinco semanas. E a demanda pelo termo "CVS-3" **despenca em 05/10**, quando a norma deixa de ser novidade e vira rotina.

Então `/cvs3` é **landing page de tráfego pago, de QR de evento e de material de contador** — e deve ser construída e julgada como tal. Sai dela: `Article` schema, `BreadcrumbList`, byline linkada, histórico de revisões, IndexNow. Fica: resposta direta nas primeiras 60 palavras, tabela *hoje × a partir de 04/10* com o artigo citado em cada linha, CRN visível, formulário e `wa.me` com texto próprio.

**Métrica dela: conversa iniciada. Não posição.**

### Explicitamente fora da janela

Nada disto acontece antes de 04/10, e isso é decisão, não atraso:

- As outras três URLs (`/temperaturas/`, `/documentos-que-a-vigilancia-pede/`, `/quem-assina/`) e o hub. Perenes, sem prazo.
- Revisão dos outros dez arquivos de conhecimento. É o gargalo mais caro do projeto e não se gasta com o que não vai ao ar.
- Os blocos JSON-LD (§6.3). Consolidação de entidade rende em meses.
- `robots.txt` e `sitemap.xml` — nascem no commit da segunda página, não da primeira.
- Build script markdown→HTML. HTML à mão é mais barato até a quinta página.
- Reencode dos MP4, auto-hospedagem de fontes, favicon real, `X-Robots-Tag` no `.online`, IndexNow, Bing Places, Apple Business Connect.
- Reescrita do Nginx. Fica só o `audit-headers.sh`. **HSTS não entra na janela em hipótese alguma** — é a única linha irreversível do documento.
- Três das quatro frentes de link building. Fica só entidades de classe, que já é item da Onda 0 e é a de maior retorno por hora.

### Resiliência a adiamento

Precedente análogo e recente: o CFN prorrogou o próprio código de ética em 180 dias em julho de 2026. Se o CVS/SP adiar a CVS-3 em setembro, a Fontesan terá material datado no ar assinado por CRN.

Regra para toda peça: **a obrigação concreta na manchete, a data em segundo plano**, e sempre "conforme publicada no DOE-SP de 06/07/2026". Assim uma prorrogação transforma a página em citação correta de um fato que mudou depois — não em erro assinado.

---

## 6. Artefatos

### 6.1 O `<head>` — substitui as linhas 9-18 de `site/index.html`

Não depende de arquivo novo nenhum. Usa o `cap1-limoes-poster.jpg` que já existe (1728×972, 16:9 — acima do mínimo de 1200×630, não precisa criar arte).

```html
<link rel="canonical" href="https://fontesan.com.br/">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="author" content="Giovanna Fontes Rios — Nutricionista — CRN-3 67286">

<meta property="og:site_name" content="Fontesan">
<meta property="og:locale" content="pt_BR">
<meta property="og:type" content="website">
<meta property="og:url" content="https://fontesan.com.br/">
<meta property="og:title" content="Fontesan · Segurança de alimentos">
<meta property="og:description" content="Você escolhe com os olhos. A segurança de um alimento, ninguém vê. Consultoria em vigilância sanitária para padarias, restaurantes e mercados na Grande São Paulo.">
<meta property="og:image" content="https://fontesan.com.br/assets/cap1-limoes-poster.jpg">
<meta property="og:image:width" content="1728">
<meta property="og:image:height" content="972">
<meta property="og:image:alt" content="Limões sendo escolhidos à mão — Fontesan, segurança de alimentos">

<meta name="twitter:card" content="summary_large_image">

<link rel="preload" as="image" href="/assets/cap1-limoes-poster.jpg" fetchpriority="high">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Public+Sans:wght@400;600&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet">
```

O que mudou: `og:url` deixa de ser `assets/`, que resolvia para um **404** (não há `index.html` dentro de `site/assets/`); `og:image` deixa de ser relativo, que o rastreador do WhatsApp não resolve; e o IBM Plex Mono perde o peso 500, que é **um arquivo de fonte inteiro baixado e nunca usado** — verificado: `font-weight:500` aparece uma única vez em todo o `index.html`, na linha 200, e ali a família é `var(--disp)`, que é Fraunces.

**Verificar:** mandar o link para si mesmo no WhatsApp. O card tem que vir com a foto dos limões.

### 6.2 `robots.txt`

```
# site/robots.txt — fontesan.com.br
User-agent: *
Allow: /
Disallow: /web/

# Rastreadores de LLM: liberados de propósito. Eles não executam JavaScript,
# e o texto deste site está todo no HTML servido.
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: https://fontesan.com.br/sitemap.xml
```

Para o `fontesan.online`, quando subir: **`Allow`, nunca `Disallow`.** O bloqueio é por header `X-Robots-Tag: noindex`. Se o `robots.txt` impedisse o rastreamento, o Google nunca buscaria a página e portanto nunca veria o `noindex` — e o domínio ficaria indexado para sempre com o snippet vazio. É o erro clássico e ele é irreversível na prática.

### 6.3 JSON-LD — antes de `</head>` · **depois de 04/10**

Consolidação de entidade rende em meses, não em seis semanas. Fica escrito e pronto para colar, mas não entra na janela.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": "https://fontesan.com.br/#website",
      "url": "https://fontesan.com.br/", "name": "Fontesan", "inLanguage": "pt-BR",
      "publisher": { "@id": "https://fontesan.com.br/#org" } },
    { "@type": "LocalBusiness", "@id": "https://fontesan.com.br/#org",
      "name": "Fontesan", "url": "https://fontesan.com.br/",
      "telephone": "+5511947811422",
      "image": "https://fontesan.com.br/assets/cap1-limoes-poster.jpg",
      "description": "Consultoria em segurança de alimentos e vigilância sanitária para padarias, restaurantes, lanchonetes e mercados na Grande São Paulo.",
      "areaServed": [{ "@type": "AdministrativeArea", "name": "Região Metropolitana de São Paulo" }],
      "knowsAbout": ["Vigilância sanitária","Segurança de alimentos","Manual de Boas Práticas",
                     "Procedimento Operacional Padronizado (POP)","Portaria CVS-3/2026","RDC 216/2004"],
      "employee": { "@id": "https://fontesan.com.br/#giovanna" } },
    { "@type": "Person", "@id": "https://fontesan.com.br/#giovanna",
      "name": "Giovanna Fontes Rios", "jobTitle": "Nutricionista",
      "hasCredential": { "@type": "EducationalOccupationalCredential",
                         "credentialCategory": "Registro profissional",
                         "recognizedBy": { "@type": "Organization", "name": "CRN-3" },
                         "identifier": "CRN-3 67286" } }
  ]
}
```

Omissões deliberadas, todas com motivo:

- **`LocalBusiness`, não `ProfessionalService`** — o schema.org marca `ProfessionalService` como não recomendado por ambiguidade.
- **Sem `address`** enquanto o endereço for residencial.
- **Sem `priceRange`, sem `aggregateRating`, sem `review`** — preço em canal público é vedado pelo CFN, e `aggregateRating` autodeclarado é violação de diretriz do Google.
- **Sem `founder`** até a condição societária estar confirmada. `employee` afirma menos e é verdadeiro.
- **Sem `FAQPage`.** O Google não concede rich result de FAQ a site privado desde agosto de 2023 — o schema custa manutenção (o `acceptedAnswer` tem que bater byte a byte com o `<p>` visível) e não devolve nada visível. A reescrita das respostas (§3.2, §3.3) continua obrigatória: ela é ética e de conteúdo, não de marcação.

### 6.4 NAP canônica

```
Nome:      Fontesan
Telefone:  (11) 94781-1422            [E.164: +5511947811422]
E-mail:    atendimento@fontesan.com.br
Site:      https://fontesan.com.br
Área:      Grande São Paulo
Assinatura: Giovanna Fontes Rios — Nutricionista — CRN-3 67286
```

**Não escrever "Responsável técnica"** em nenhum dos treze lugares até o registro da PJ e a anotação da RT estarem confirmados no CRN-3. O anexo do plano de aquisição já mandou trocar por "nutricionista responsável pelo serviço", que descreve o mesmo fato sem invocar um status formal que pode não existir. O cartão de visita já está na formulação segura ("NUTRICIONISTA · CRN-3 67286"); é o site (`index.html:639`) que precisa se alinhar a ele. Escalar isso em JSON-LD, ficha do Perfil da Empresa e Q&A antes da confirmação multiplica uma afirmação que talvez precise ser retirada.

Nunca "Fontesan Consultoria". Nunca `fontesan.online` como site oficial. Nunca "São Paulo e região" — uma formulação só, em todos os treze lugares onde ela aparece (perfil, rodapé, JSON-LD, WhatsApp Business, Instagram, Facebook, Bing Places, Apple Business Connect, assinatura de e-mail, propostas, checklist, adesivo, slides).

Acrescentar no rodapé e em `#contato`: `<a href="tel:+5511947811422">(11) 94781-1422</a>`

---

## 7. Performance

### 7.1 Medir antes de editar

```bash
bash deploy/audit-headers.sh
```

O script pede as sete URLs que decidem tudo e reporta status, `location`, `content-encoding`, `cache-control` e `strict-transport-security`. Responde três perguntas que hoje ninguém sabe: a produção já comprime? `http` e `www` já redirecionam? `robots.txt` responde 200? Anotar a saída no topo do `.conf.example` com a data.

**Não ligar HSTS** antes de confirmar que o certbot renova sozinho. É a única linha desta seção que não tem volta: se o certificado quebrar depois de um `max-age` de um ano, o site fica inacessível e não há o que fazer do lado do servidor.

### 7.2 O gargalo real não é o vídeo

**1.026.060 bytes de posters JPEG são baixados em `scrollY=0`, em 100% das visitas** (medido: soma dos 10 `*-poster.jpg`), porque `background-image` de CSS não tem lazy-load: todo elemento na árvore de layout busca a imagem, mesmo a catorze telas de distância.

Dentro disso há um erro puro: `cap2-vegetais-poster.jpg` tem **208.749 bytes** enquanto `cap6-leite-poster.jpg` tem **85.301 bytes na mesma resolução**. Não é escolha de arte, é um export em qualidade ~95 por engano. Sozinho é 20% de todos os bytes de poster. **Se só houver cinco minutos, fazer só esse arquivo.**

```bash
cd site/assets && mkdir -p _webp
for f in cap1-limoes cap2-vegetais cap3-luvas cap4-morango cap5-familia \
         cap6-leite cap7-melancia sec-restaurante; do
  cwebp -q 75 -resize 1280 0 -m 6 "${f}-poster.jpg" -o "_webp/${f}-poster.webp"
done
for f in vert-coentro vert-escolha; do
  cwebp -q 74 -resize 540 0 -m 6 "${f}-poster.jpg" -o "_webp/${f}-poster.webp"
done
```

Total: 1.026.060 → ~492.000 bytes (**-52%**). Trocar as 10 URLs nas linhas 314, 329, 342, 355, 368, 381, 394, 460, 532, 535 e o `preload`.

**Manter `background-image`** — não converter para `<picture>`. A reescrita tocaria `.stage`, `.quem-video`, `.vslot`, as transições `.video-ready` e a regra `html.static-mode` da linha 267 (que esconde `video`, não `img`), e exigiria 10 textos `alt` assinados pela Giovanna. `og:image` continua apontando para o `.jpg`: o rastreador do WhatsApp é menos tolerante a WebP.

Os 22 MB de MP4 rendem outros ~15 MB, mas só depois de 04/10 — e com nome de arquivo novo, porque o cache `immutable` de 30 dias combinado com reencode produz o pior bug de deploy possível: metade dos visitantes recorrentes presa no arquivo velho por um mês.

---

## 8. Medição

**Search Console** como propriedade de **domínio** (registro TXT no DNS), não prefixo de URL. É a única forma de ver de uma vez qual variante o Google escolheu indexar. Prefixo exigiria quatro propriedades.

**Os cinco links `wa.me` usam hoje exatamente o mesmo texto** (linhas 306, 413, 597, 637 e o gerado em JS na 920). Sem texto distinto por posição, nenhuma conversa é atribuível à origem — e o canal gratuito mais caro de conseguir, o perfil verificado, fica impossível de provar. Quem corrigir só o HTML entrega 4 de 5 e perde justamente o do lead que já converteu no formulário, o de maior valor.

**Um painel semanal só, e ele já existe.** O anexo do plano de aquisição fixou quatro números — conversas recebidas, diagnósticos marcados, propostas enviadas, contratos fechados — e a auditoria de SEO propôs outros seis. Dois rituais semanais competindo é o jeito garantido de nenhum sobreviver. **O painel semanal continua sendo o de quatro números do anexo**, agora lido da coluna `status` da migration 021 em vez de contado à mão.

O SEO acrescenta uma **checagem mensal de 10 minutos**, não um segundo painel semanal:

1. Ações no Perfil da Empresa (chamadas + cliques + rotas) — a prova de vida do canal gratuito
2. Avaliações novas e nota
3. Impressões e **consultas novas** no Search Console — cada consulta nova é a pauta de conteúdo mais barata que existe
4. Páginas indexadas — se algo fica em "Descoberta, não indexada" por 3 semanas, o problema é falta de link interno, não de conteúdo

Um diagnóstico que só o cruzamento dá: **se há lead no banco e nenhuma conversa no WhatsApp, o problema é o retorno, não a captação.** E se os leads zeram por 7 dias, testar o formulário de ponta a ponta antes de qualquer outra hipótese — formulário quebrado é a causa mais comum e a mais invisível.

**Não olhar:** posição média (média de médias, engana) e o relatório de links (vazio por meses, desanima à toa). E as métricas já proibidas no plano de aquisição: CTR, CPM, alcance, seguidores.

---

## 9. Metas honestas

Domínio novo, sem autoridade, 1,5 pessoa.

**30 dias (até ~22/09)** — buscar "fontesan" no Google retorna o site em primeiro (hoje não retorna; isso é inegociável). Perfil verificado ou em segunda tentativa com data anotada. Search Console: dezenas a poucas centenas de impressões, 0 a 15 cliques. Leads orgânicos: **0 a 2 — e zero está dentro do esperado.**

**90 dias (até ~21/11)** — perfil no pacote local do município verificado (nos vizinhos ainda não; proximidade manda). 5 a 8 avaliações. 100 a 400 impressões/mês, 10 a 50 cliques. Três páginas indexadas. 1 backlink local real.

**180 dias (até ~19/02/2027)** — 12 a 20 avaliações. Top 3 do pacote local no município verificado. 300 a 1.200 impressões/mês, 40 a 150 cliques. 5 a 15 conversas/mês somando orgânico e perfil. **2 a 4 backlinks locais** — não 20; 20 em seis meses sem comprar link é mentira.

---

## 10. Incertezas

1. ~~O e-mail `atendimento@fontesan.com` é do domínio errado~~ **Resolvido em 23/08.** O endereço correto é `atendimento@fontesan.com.br` — faltava só o `.br`. Corrigido em `site/index.html:638`, `design-package.md:117`, `branding/_render/finais.html:80`, e o cartão de visita já foi re-renderizado (`assets-png/cartao-verso.png`).
2. **O cartão não tem o endereço do site.** Telefone, e-mail, "Grande São Paulo" — nenhuma URL, nenhum QR. É o ativo físico que mais circula na mão de contador e fornecedor.
3. **O site diz "Responsável técnica"; o cartão diz "Nutricionista".** A revisão adversarial do plano de aquisição aponta que o status formal de RT ainda não foi confirmado no CRN-3. O cartão já está na formulação segura — é o site que deve se alinhar a ele.
4. **A coluna "vale hoje" da tabela de temperaturas vem da RDC 216 e nunca foi conferida** — a checagem de 22/08 cobriu só a CVS-3. Conferir contra o texto da ANVISA antes de publicar `/temperaturas/`.
5. **Toda a leitura de SERP desta auditoria foi feita de fora do Brasil**, o que não expõe pacote local, AI Overview nem volume. O check manual de 20 minutos (cinco buscas num celular na Grande SP, anônimo) substitui isso e ainda não foi feito.

---

## 11. O que não fazer

1. Não editar Nginx antes de rodar o `audit-headers.sh` — os `.conf.example` não são produção.
2. Não pôr `Disallow` no `robots.txt` do `fontesan.online`. Bloqueio é por header, senão o `noindex` nunca é visto.
3. **Não gastar um real de mídia antes do teste de atribuição passar** (§3.6). Sem isso, os R$2.000 entram sem rastro.
4. Não mandar clique pago para a home de 23 MB. A LP tem formulário próprio (§3.7).
5. Não marcar `FAQPage`. Sem rich result para site privado desde ago/2023, e o `acceptedAnswer` tem que ser mantido em sincronia byte a byte com o texto visível.
6. Não renomear `/cvs3` agora. O QR do evento já aponta para lá; renomear é peça móvel no caminho crítico e a armadilha do `$is_args$args` mata a atribuição.
7. Não criar páginas de cidade. Teto de três, e só quando houver cliente atendido no município, com órgão fiscalizador nomeado e exigência local que difira da vizinha. Sem isso é doorway.
8. Não publicar `/recebi-notificacao-.../`. Fora de escopo declarado.
9. Não ligar HSTS antes de confirmar a renovação do certificado. É a única linha irreversível do documento.
10. Não declarar `aggregateRating` nem `priceRange` no JSON-LD.
11. Não escrever "Responsável técnica" até o CRN-3 confirmar o registro da PJ e a anotação da RT.
12. Não converter os posters para `<picture>` agora.
13. Não confiar na base de conhecimento como conferida — §3.1.
14. Não criar um segundo painel semanal. O painel é o de quatro números do anexo; o SEO é mensal (§8).
15. Não julgar o canal orgânico em 60 dias.
