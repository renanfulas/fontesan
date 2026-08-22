# Plano de aquisição Fontesan — janela CVS-3/2026

**Data:** 22/08/2026 · **Prazo-âncora:** 04/10/2026 (6 semanas) · **Equipe:** Giovanna (técnica, CRN-3 67286) + Renan (dev)

---

## 1. Veredito sobre as três ideias

### Ideia 1 — Automatizar postagens no Instagram: **MANTER, mas rebaixar a prioridade**

É a única das três que passa no teste técnico sem ressalva. A Content Publishing API é oficial, gratuita, publica feed/carrossel/reels/stories e **não exige App Review nem verificação de negócio** quando se publica só na conta própria.

O problema é outro: o teto da API é **100 posts por 24h** — cerca de 30 vezes o que a Fontesan vai usar. Isso prova que **o gargalo não é publicar, é escrever**. Automatizar o disparo economiza minutos do Renan e não gera um lead sequer. Pior: construir publisher próprio agora cria dívida operacional real (token que expira a cada 60 dias sem renovação automática, JPEG obrigatório enquanto a marca é SVG/PNG, sem agendamento nativo, reels sem áudio em alta) — e falha silenciosa de token durante a janela CVS-3 significa parar de postar sem ninguém perceber.

**Correção:** publicação via **Metricool grátis** (cobre Instagram **e** Google Perfil da Empresa na mesma conta) + Meta Business Suite para stories/reels. Zero código, zero custo. O que vale automatizar é a **produção** do conteúdo a partir dos 47 chunks do RAG — não o clique de publicar. Publisher próprio só se a cadência manual sobreviver 8 semanas e os ~20 posts/mês do Metricool virarem gargalo real.

### Ideia 2 — Tráfego pago para o site: **MANTER a verba, TROCAR o objetivo e o destino**

Duas correções não-negociáveis:

**a) O objetivo não é visita, é conversa iniciada pelo prospect.** Só ela resolve simultaneamente o opt-in que o WhatsApp exige e a legítima expectativa que a LGPD exige. Comprar "Tráfego" no Meta entrega o clique mais barato do mundo e o lead mais caro.

**b) O site atual não pode ser o destino.** Verifiquei: `site/assets` tem **23 MB**, 11 arquivos MP4 (o hero `cap1-limoes.mp4` sozinho tem 4,7 MB), 7 capítulos de vídeo em scroll antes de qualquer oferta e o formulário no fim da página. E o `index.html` **não tem uma única linha de tag** — sem GA4, sem gtag, sem fbq. E a tabela `fontesan_leads` (migration 020) tem exatamente cinco colunas: `nome, tipo_negocio, telefone, mensagem, created_at`. **Não existe uma coluna de origem.** Subir campanha assim é doar dinheiro sem nunca saber o que funcionou.

O site é excelente para quem chega por indicação e deve continuar exatamente como está. Como destino de anúncio ele cobra do visitante uma atenção que ninguém dá com 4 segundos de paciência no 4G.

**Correção:** instrumentar primeiro (semana 1, custo R$0), landing page dedicada `/cvs3` sem vídeo, **Google Search de intenção pura** antes de Meta — o Google absorveu os impostos brasileiros em 2026 enquanto a Meta repassa **12,15%** (PIS/COFINS 9,25% + ISS 2,9%), o que em R$2.000 de verba é ~R$243/mês de entrega a mais pela mesma nota fiscal.

### Ideia 3 — Leads frios do Google via WhatsApp: **DESCARTAR o canal, APROVEITAR a lista (com outra fonte)**

Esta ideia tem a metade certa e a metade suicida.

**A metade suicida — o canal.** O disparo frio por WhatsApp falha nas **duas** pernas da Messaging Policy da Meta, que exige cumulativamente que a pessoa (a) tenha dado o número a você **e** (b) tenha dado opt-in. Um número raspado do Google falha nas duas. Além disso, a **Lei estadual SP 17.832/2023** inclui literalmente "envio de mensagens de aplicativos associados à linha" no cadastro Não Me Ligue, com responsabilidade solidária. E o bridge Baileys é acesso automatizado não autorizado, violação direta dos Termos, cuja penalidade **se estende à organização inteira**, não só ao número.

O pior cenário aqui não é multa da ANPD — a exposição financeira de uma consultoria de 2 pessoas é baixa, porque a multa é percentual do faturamento. **O pior cenário é perder o 5511947811422**, que é o CTA principal do site, do fontesan.online, do Instagram e do selo físico no cliente. Nenhum volume de lead compensa isso.

**Consequência direta:** o pareamento do Baileys falhando por IP de datacenter **não é um bug a consertar — é detecção funcionando, e ela está protegendo a Fontesan.** Desligar `deploy/whatsapp-bridge` é ação desta semana, não depuração.

**A metade certa — a lista.** Montar a base é totalmente viável e legal, **mas não pelo Google Maps**: a cláusula 3.2.3(a) dos ToS do Google Maps Platform proíbe literalmente exportar ou raspar conteúdo, e mesmo pagando a Places API só se pode armazenar o `place_id`. A fonte correta é a **base pública de CNPJ da Receita Federal**: gratuita, mensal, com nome fantasia, CNAE, endereço, DDD+telefone 1 e 2, e-mail, porte, situação cadastral e **data de início de atividade** — e o reuso comercial é explicitamente autorizado pelo Decreto 8.777/2016.

**Correção do CNAE (o plano original erra dois):**

| Segmento | CNAE correto |
|---|---|
| Padaria com produção própria | `1091-1/02` |
| Padaria com predominância de revenda | `4721-1/02` |
| Restaurantes e similares | `5611-2/01` |
| Lanchonetes, casas de chá e sucos | `5611-2/03` |
| **Minimercado, mercearia, armazém** | **`4712-1/00`** ← o mercadinho de bairro, cliente-alvo real |
| Supermercado (300–5.000 m²) | `4711-3/02` ← não é minimercado |

Sem o `4712-1/00`, o cliente-alvo descrito fica **de fora do filtro**.

**Canal de primeira abordagem:** e-mail corporativo (campo da própria Receita) e telefone. E-mail é o único canal de envio ativo sem política de plataforma proibindo e sem equivalente do Não Me Ligue, e é onde o legítimo interesse do art. 7º, IX sustenta o peso. WhatsApp entra **só depois** que o prospect responde.

---

## 2. A tese única do plano

**Inverter o vetor: usar a CVS-3/2026 como pretexto genuinamente útil para que o prospect abra a conversa.** Um aviso regulatório datado e verificável serve ao destinatário mesmo que ele nunca compre — o que fortalece as fases de finalidade e necessidade do teste da ANPD, resolve o opt-in do WhatsApp por dentro, e muda o assunto da mensagem de "a Fontesan" para "o seu prazo".

As 6 semanas não são um tema de conteúdo. São **o prazo editorial que o mercado inteiro compartilha** — a única vez no ano em que a pauta técnica da Fontesan coincide com a urgência do cliente.

---

## 3. Automatizável hoje × trabalho humano irredutível × armadilha

### Automatizável de verdade (roda na VPS que já existe, custo ~zero)

| O quê | Como |
|---|---|
| Captura de atribuição e consentimento | migration 021 + JS de first-touch no site |
| Autodiagnóstico e geração do PDF | página estática + `POST /web/fontesan/leads` que já existe |
| ETL mensal da base CNPJ | `COPY` no Postgres 14 + systemd timer |
| Fila de e-mails com retry e idempotência | **`operational_outbox` já implementado** — não escrever fila nova |
| Supressão consultada antes de todo envio | tabela + função `is_suppressed()` chamada por todo produtor |
| Geração de rascunho de conteúdo a partir do RAG | script Python + `gpt-4o-mini` com a chave já configurada |
| Páginas `/norma` estáticas geradas do agente | Nginx já serve estático nesse diretório |
| Meta Pixel server-side (CAPI) com dedupe | o `lead_id` retornado pela API vira o `event_id` |
| Upload de conversão offline (gclid → cliente) | CSV mensal do Postgres |

### Trabalho humano irredutível (não terceirizar, não automatizar)

1. **Revisão técnica dos 11 arquivos de conhecimento** — 4h da Giovanna. Bloqueia legitimamente quase tudo (ver §5).
2. **Aprovação peça a peça** — o código de ética atribui responsabilidade **integral** à nutricionista pelo que é divulgado, e o CRN-3 aceita denúncia anônima.
3. **Ligar para 4–6 sindicatos e associações** — a maior alavanca por hora do plano inteiro.
4. **1h/dia de ligações** para a fila priorizada.
5. **Atendimento no WhatsApp** quando a conversa chega.
6. **Gravar vídeo** (1h/mês em lote, celular no tripé).
7. **Conferir o texto oficial da CVS-3/2026 na fonte do CVS/SP e arquivar o PDF** — a Fontesan responde pelo que afirma por escrito a terceiros.

### Parece automatizável, é armadilha

- Disparo de WhatsApp em massa (qualquer versão, inclusive "só 50 por dia").
- **DM fria no Instagram** — não existe caminho oficial; mensageria é reativa com janela de 24h. Forçar por via não-oficial repete o erro do Baileys arriscando agora a conta da marca.
- **Publicar sem revisão humana.**
- **Publisher próprio de Instagram agora** (token 60 dias, JPEG-only, sem agendamento nativo).
- **Performance Max e AI Max** — a Fontesan terá <30 conversões/mês e nenhuma conversão offline nos primeiros 60 dias, exatamente as condições em que o próprio Google documenta que a automação não funciona: *"AI Max won't be effective if campaigns are limited by budget"*.
- **Sequência infinita de follow-up** — máx. 3 toques por prospect, e qualquer resposta cancela a sequência.
- **Chatbot genérico no WhatsApp** — proibido desde 15/01/2026; bot de escopo travado continua permitido.
- **Comprar lista pronta** — transfere um vício de origem impossível de sanear. A primeira sanção da história da ANPD (Telekall, R$14,4 mil) nasceu de denúncia sobre oferta de listagem de contatos de WhatsApp, e o fundamento foi **falta de base legal**.

---

## 4. Construir × comprar

### CONSTRUIR (o motor já está 80% pronto e ocioso)

O backend tem `operational_outbox` com `idempotency_key`, máquina de estados, `attempt_count`, `available_at` e dead-letter — **isso é literalmente um sequenciador de cadência com retry**. Tem `support_cases`, `staff_members`, console interno, `dispatch_outbox.py`, cliente oficial da Meta Cloud API e scripts de preflight de ativação. Falta uma tabela de prospects e um worker, não uma mensalidade.

Construir: LP `/cvs3` + autodiagnóstico, migrations 021/022, ETL CNPJ, sequenciador, páginas `/norma`, CAPI server-side, conversão offline.

### COMPRAR ou usar de graça

| Ferramenta | Custo | Por quê não construir |
|---|---|---|
| Metricool (Free) | R$0 | Cobre IG + Google Perfil da Empresa; substitui semanas de dev |
| Meta Business Suite | R$0 | Agenda stories e reels nativamente |
| Amazon SES | ~US$0,10/mil | Reputação de IP e bounce handling não se constrói |
| Google Ads / Meta Ads | mídia | — |
| OpenAI API | já contratada | — |

### NÃO comprar

RD Station, HubSpot, Pipedrive (pagar mensalidade para exportar a base para fora do Postgres onde vivem o `gclid` e o `partner_slug`). **Speedio** (a partir de R$719/mês por 300 empresas, fidelidade 12 meses) e **Econodata** (R$590–890/mês) — caríssimo perto de uma base gratuita de milhares. Gestor de tráfego com essa verba. Cloud API/BSP antes de existir base opt-in. Later/Buffer pagos.

---

## 5. Ondas com datas

### ONDA 0 — Semana de 24 a 30/08: **destravar** (custo de mídia: R$0)

**Faça isto primeiro, nesta ordem, nesta semana:**

1. **Segunda 24/08 — desligar o bridge Baileys.** Remover o serviço systemd de `deploy/whatsapp-bridge`, arquivar o diretório. 15 minutos. É a ação de maior redução de risco do plano inteiro.
2. **Segunda 24/08 — Giovanna liga para SAMPAPÃO, ABRASEL-SP e APAS** oferecendo uma aula gratuita de 60–90 min "O que muda com a CVS-3/2026 a partir de 04/10" para os associados. Essa ligação tem que sair esta semana porque evento se agenda com 3 semanas de antecedência. **Maior alavanca por hora de todo o documento.**
3. **Segunda 24/08 — baixar o texto oficial da Portaria CVS-3/2026** (DOE-SP) e arquivar o PDF no repositório. Nenhuma peça vai ao ar antes disso.
4. **Terça 25/08 — migration 021** (`consent_text`, `consent_at`, `consent_ip`, `origem`, `origem_url`, `utm_*`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `fbp`, `fbc`, `landing_path`, `referrer`, `partner_slug`, `status`, `payload JSONB`) + tabela `suppression_list` com hash HMAC (padrão que `case_whatsapp_bindings` já usa) + função `is_suppressed()` **com teste unitário que falha se algum caminho de envio pular a checagem**.
5. **Terça 25/08 — política de privacidade** em `site/privacidade/index.html` com os 7 itens do art. 9º e menção explícita ao art. 18; canal `privacidade@fontesan.com.br`. Pelo regime de agente de pequeno porte (Res. CD/ANPD 2/2022), esse canal **dispensa encarregado formal**. Isso corrige uma exposição que já existe hoje, independente de campanha.
6. **Quarta 26/08 — GA4 + tag do Google Ads + evento `contato_whatsapp`.** Listener delegado em `a[href*="wa.me"]` cobre de uma vez os 5 links do site. Marcar `generate_lead` e `contato_whatsapp` como conversões primárias. Consent Mode v2 com `denied` por padrão.
7. **Quarta 26/08 — marcador de origem na mensagem do WhatsApp.** Os 5 links `wa.me` do site hoje usam **exatamente o mesmo texto**. Trocar por texto distinto por posição ("Vim pelo topo do site", "Vim pela página da CVS-3", "Vim pelo anúncio") + etiquetas correspondentes no app WhatsApp Business. Custo: zero tecnologia.
8. **Quinta e sexta 27–28/08 — Giovanna revisa os 11 arquivos** de `backend/domains/fontesan/knowledge/` (5 artigos + 6 FAQs). O `domain.yaml` marca a base literalmente como *"PRIMEIRO RASCUNHO... PENDENTE de revisão técnica"* e ela **já responde ao público**. Prioridade absoluta para `portaria-cvs-3-2026-nova-norma-sp-outubro.md` e `metodo-fontesan-auditoria-vigilancia-sanitaria.md` (know-how proprietário que a IA inventou). Renan converte cada markdown num documento de uma afirmação por linha com coluna confere/corrige/apaga. Depois: reingestão no pgvector, `run_domain_eval fontesan` 8/8, e remover o comentário de rascunho.
9. **Sexta 28/08 — gate ético de 6 itens escrito** e aplicado uma vez: rodapé do site, bio do Instagram, assinatura de e-mail, perfil do WhatsApp → **"Giovanna Fontes Rios — Nutricionista — CRN-3 67286"**.
10. **Durante a semana, em paralelo (burocracia com lead time longo):** reivindicar o **Google Perfil da Empresa** e submeter o formulário de Basic API Access (exige perfil verificado e ativo há 60+ dias — pedir em outubro é não ter API em dezembro); protocolar **consulta formal ao Setor de Ética do CRN-3** sobre "diagnóstico gratuito" e sobre pagamento variável por indicação a não-nutricionista; **verificar o status da PJ Fontesan no CRN-3**; protocolar **pedido via LAI à COVISA** pela relação de autuações em serviços de alimentação nos últimos 12 meses; configurar **SPF, DKIM e DMARC** no DNS.

**Critério de saída da Onda 0:** Baileys desligado, migration 021 aplicada, GA4 medindo, política publicada, base de conhecimento revisada, pelo menos 1 entidade de classe com reunião marcada.

---

### ONDA 1 — 31/08 a 06/09: **capturar** (custo de mídia: R$0)

- **LP `site/cvs3/index.html`** — reaproveita o bloco de tokens de estilo do `index.html` (paleta creme/verde/laranja, Fraunces/Public Sans) **sem nenhuma tag `<video>`**. Headline datada, 5 obrigações concretas, formulário de 3 campos, botão `wa.me` com texto próprio, bloco "Quem assina" com CRN. **Alvo de peso: menos de 400 KB.** Gate de publicação: PageSpeed mobile com LCP abaixo de 2,5s.
- **Autodiagnóstico `/cvs3/diagnostico`** — **15 perguntas, não 30** (ver conflito resolvido em §6). Resultado **na tela, de graça, antes de pedir contato**. PDF gerado no cliente. Cada item reprovado ganha botão "entender esse item" que abre o chat do fontesan.online com a pergunta pré-preenchida — **o RAG sai de ocioso e vira capturador**. Disclaimer do Art. 55, parágrafo único, obrigatório.
- **Calendário `content/campanha-cvs3.yaml`** com 18 temas × 6 semanas: S1 documentos e guarda de 180 dias; S2 manipuladores (exames anuais, curso de 8h); S3 temperaturas; S4 delivery com lacre e sachês; S5 estrutura física e POPs novos; S6 contagem factual dos dias.
- **Script gerador de conteúdo** (versão enxuta): lê os markdown pelo `DomainLoader` que já existe, gera 6 saídas por tema (carrossel, post GBP, texto de site, item de newsletter, resposta rápida do WhatsApp, roteiro de reel), grava em arquivo. **Sem tabela, sem SPA, sem tela `/aprovar`** nesta onda — aprovação por markdown revisado. Custo de LLM nesse volume: menos de R$20 no período (estimativa).
- **Cadência de publicação começa:** 3 posts/semana via Metricool (IG + GBP).
- **ETL CNPJ rodando**, tabela `prospects` materializada com os 7 CNAEs corrigidos × 39 municípios da RMSP × situação cadastral ativa. View `prospects_novos` (abertos nos últimos 12 meses).

**Critério de saída:** LP com LCP <2,5s no ar, autodiagnóstico funcionando ponta a ponta gravando `origem`, base de prospects contada por CNAE e município.

---

### ONDA 2 — 07/09 a 20/09: **alcance** (mídia: ~R$1.100)

- **07/09 — Google Search no ar.** Rede de Pesquisa apenas (**desmarcar** Parceiros de Pesquisa e Display), localização em modo **"Presença"** e não o padrão "Presença ou interesse" — isso sozinho salva 20–35% da verba de um anunciante local. Correspondência **frase e exata apenas**. 5 grupos: G1 CVS-3, G2 Documentação, G3 Urgência/autuação (criado e **pausado**), G4 Consultoria, G5 Licença. Lance: Maximizar Cliques com teto de CPC R$8 nos 14 primeiros dias; sem histórico de conversão não dá para usar tCPA.
  - **Negativas obrigatórias no nível da conta:** curso, grátis, gratuito, pdf, download, modelo, apostila, ebook, template, exemplo, concurso, emprego, vaga, salário, faculdade, senac, senai, "o que é", edital, prova — e o bloco que quase todo mundo esquece: **denúncia, denunciar, reclamação, reclamar, telefone da vigilância** (são buscas de consumidor querendo denunciar restaurante, não de dono querendo se adequar).
- **08/09 a 20/09 — campanha de e-mail CVS-3.** Aquecimento obrigatório: 100/dia na semana 1, dobrando a cada 3 dias até ~500/dia. Nunca disparar 3 mil de um domínio novo. Assunto com a data, 5 linhas de fato, link para o autodiagnóstico, **origem do dado declarada em texto** ("sua empresa consta na base pública de CNPJ da Receita Federal"), opt-out one-click e assinatura com CRN-3. Enfileira no `operational_outbox`; bounce e complaint do SES voltam por webhook em `internal_webhooks.py` e alimentam a `suppression_list` automaticamente.
- **08/09 — bloco diário de ligações** (1h, 12–15 chamadas). Fila gerada às 8h pelo worker e enviada ao WhatsApp da Giovanna. **Pré-requisito: cadastro da Fontesan no sistema do Procon-SP** para consultar a lista Não Me Ligue e excluir linhas bloqueadas. Abertura pelo fato: *"ligo porque a Portaria CVS-3 entra em vigor em 04/10 e substitui a CVS-5; queria confirmar se vocês já receberam a informação sobre o exame anual dos manipuladores."*
- **14/09 — Meta Click-to-WhatsApp.** Vincular o 5511947811422 à Página do Facebook por OTP — **o app WhatsApp Business gratuito basta**, não precisa de Cloud API, não precisa de BSP, não apaga histórico. Objetivo Engajamento, conversão WhatsApp, raio na Grande SP, **público amplo** (segmentação por interesse morreu em 15/01/2026; hoje quem segmenta é o criativo). Criativos: reaproveitar `vert-escolha.mp4` e `vert-coentro.mp4`, que **já existem no repositório** em 9:16 e na voz da marca. A janela gratuita de 72h cobre toda a resposta. Métrica: **custo por conversa iniciada (CPiC)**, não CPM nem CTR.
- **Webinar/aula presencial com a primeira entidade de classe.** URL própria `fontesan.com.br/cvs3?origem=sampapao` e QR code no último slide. Lista de presença = formulário com checkbox, nunca papel.
- **Primeiros 5 escritórios de contabilidade contatados** (CNAE `6920-6/01` da mesma base, custo zero). Mecânica: **reciprocidade útil, não comissão** — material co-branded sobre a CVS-3 que o contador manda para a carteira dele com o nome dele.
- **Meta Pixel + Conversions API server-side**, com `event_id` = `lead_id` para deduplicação.

---

### ONDA 3 — 21/09 a 04/10: **aperto final** (mídia: ~R$850)

- **Remarketing** para quem visitou `/cvs3` e não converteu, R$8–10/dia, criativo **diferente** do de aquisição: no de aquisição a norma, no de remarketing a autoridade (bloco "Quem assina").
- **LP `/checklist`** com o Checklist do Fiscal, entrega **imediata na própria tela** após o POST, com cópia por e-mail (nunca depender só do e-mail).
- **8 a 12 páginas `/norma`** publicadas manualmente, com pauta minerada das conversas reais que o backend já grava + `evals/cases.yaml`. Registrar no Search Console e enviar sitemap.
- **Bloco de vídeo:** 1h de gravação → 8 reels de 40s + 1 vídeo longo no YouTube.
- **Segundo evento com entidade de classe.**
- **30/09 — pivô de mensagem pronto e agendado.** Em 03/10: pausar G1 (termos prospectivos), ativar G3 de urgência (`[recebi notificação vigilância sanitária]`, `[auto de infração sanitária]`, `[prazo para adequação vigilância sanitária]`), trocar títulos datados por "A CVS-3/2026 já está em vigor", publicar `/cvs3` v2. **A semana de 04/10 vai ser de atendimento, não de painel.**

---

### ONDA 4 — a partir de 05/10: **infraestrutura e recorrência**

Motor de conteúdo completo (migration 022 `content_items` + rota `/internal/content-queue` + tela `/aprovar` clonada de `LeadsPage.tsx`); gerador automático de páginas `/norma`; comment-to-DM oficial no Instagram (private reply, 1 mensagem por comentário, até 7 dias, **zero follow-up**); coletor do DOC-SP com `pg_trgm`; primeiro upload de conversão offline (**restrição dura: o clique precisa ter no máximo 63 dias** — não pode esperar novembro); programa de indicação com o selo físico "Casa em dia" e QR único por cliente; avaliação da Cloud API **em segundo chip** apenas se a base opt-in justificar.

---

## 6. Conflitos entre as lentes — decisões

| Conflito | Decisão | Justificativa |
|---|---|---|
| Autodiagnóstico: 30 perguntas (orgânico) × 12–15 (outbound) | **15 perguntas** | 30 derruba a taxa de conclusão justamente no canal frio, que é o mais frágil. Cobertura suficiente para pautar a reunião. |
| Uma LP `/cvs3` × várias páginas | **Uma família: `/cvs3` (LP leve) + `/cvs3/diagnostico`** | Uma URL para anúncio, e-mail, QR do evento e Perfil da Empresa. Menos superfície para manter. |
| Três versões de migration 021 | **Uma migration com a união das colunas** | Forward-only, aplicada uma vez. |
| Motor de conteúdo com banco + SPA nas semanas 2–3 (orgânico) | **Adiado para a Onda 4; nas 6 semanas, script + arquivo** | Dev time do Renan é o recurso mais escasso e está comprometido com LP, instrumentação e ETL. A tela de aprovação otimiza um fluxo que ainda não existe. |
| Cloud API em segundo chip agora (outbound) × app grátis (pago) | **App grátis + CTWA agora.** Verificação de negócio protocolada (grátis, lead time longo, sem downside), Cloud API só na Onda 4 | API sem lista opt-in própria é custo sem receita. E CTWA funciona com o app gratuito. |
| Newsletter própria × sequência de e-mail CVS-3 | **Uma coisa só:** mesma tabela, mesmo SES, mesma supressão | Não construir dois canais de e-mail. |
| Código de ética: 599/2018 vigente (pesquisa CRN) × 856/2026 já em vigor (pesquisa tráfego) | **Obedecer à interseção das proibições — a regra mais dura** | Há divergência de fonte secundária sobre a prorrogação. Na dúvida, o CRN-3 aceita denúncia anônima e um concorrente irritado não precisa se expor. Consulta formal protocolada na Onda 0. |
| Divulgar preço (Art. 68 do 856 permitiria) | **Não divulgar preço em canal público.** Valores só no privado | Mesma lógica acima. |
| Coletor do DOC-SP nas 6 semanas | **LAI agora (custo zero, prazo legal de 20 dias), coletor na Onda 4** | O pedido via LAI pode entregar de uma vez o que o coletor levaria meses para acumular. |
| CVS-3 confirmada (pesquisa de leads) × não verificada (pesquisa LGPD) | **Tratar como NÃO verificada até baixar o PDF oficial** | A Fontesan responde por escrito perante terceiros pelo que afirma. |

---

## 7. Números

### Verba de mídia nas 6 semanas

| Canal | Período | Diário | Mídia | Fatura |
|---|---|---|---|---|
| Google Search | 07/09–04/10 (28 d) | R$40 | R$1.120 | R$1.120 |
| Meta CTWA | 14/09–04/10 (21 d) | R$30 | R$630 | ~R$707 (+12,15%) |
| Remarketing Meta | 21/09–04/10 (14 d) | R$8 | R$112 | ~R$126 |
| Amazon SES (~3.000 e-mails) | 08/09–30/09 | — | ~US$0,30 | desprezível |
| LLM (geração de conteúdo) | contínuo | — | <R$20 | <R$20 |
| **Total** | | | | **~R$1.975** |

Reservar folga de R$500 → **teto de R$2.500 até 04/10**. Infra adicional: **R$0** (VPS, Postgres, Nginx e OpenAI já existem; Metricool e Business Suite são gratuitos).

### Regra de verba, corte e escala — decidida **antes** do primeiro real

- **Pré-requisito (03/09):** rodar o Planejador de Palavras-Chave para Grande SP. Se a soma dos termos-alvo passar de **1.500 buscas/mês**, Search leva 70% da verba; entre **500 e 1.500**, 50/50 com CTWA; **abaixo de 500**, Search com teto de R$20/dia só nos termos de urgência e o resto vai para Meta. *(Não consegui levantar esse volume — exige login. É o número que decide se o Search consegue sequer gastar a verba.)*
- **Corte:** grupo de anúncios que passar de 40 cliques sem nenhuma conversa iniciada é pausado, sem discussão.
- **Escala:** +20% a cada 4 dias enquanto o CPL estiver abaixo de R$250 **e** a parcela de impressões perdida por orçamento estiver acima de 20%.
- **Saturação:** se a perda por orçamento cair abaixo de 10%, o canal saturou por demanda, não por dinheiro — verba nova vai para o Meta, não para o Search.
- Ritual: 20 minutos toda segunda-feira, uma planilha. Não precisa de gestor de tráfego.

### Metas até 04/10 (estimativas minhas, ancoradas nos benchmarks de CPC R$6–12 e CPL R$120–280 para B2B/serviços profissionais no Brasil — dados de agência, não auditados)

| Canal | Volume esperado | Conversas iniciadas |
|---|---|---|
| Google Search | ~140 cliques | 8–14 |
| Meta CTWA | teto de R$60/CPiC | 8–12 |
| E-mail CVS-3 | ~2.000 entregues, 1–2% de resposta | 5–12 |
| Eventos com entidades | 1–2 eventos, 40–60 presentes | 10–20 |
| Ligações | ~250 chamadas | 5–10 |
| **Total** | | **~40–60** |

Disso: **12–20 diagnósticos agendados** e **3–6 contratos fechados** (estimativa; não sei o ticket médio da Fontesan, então não calculo ROI). Com R$2.000 de mídia e 4 contratos, o CAC de mídia fica em ~R$500 por cliente.

### Métricas por onda

| Onda | Métrica-mãe | Meta |
|---|---|---|
| 0 | % de leads com `origem` preenchida | >90% a partir de 31/08 (hoje é 0% — a coluna não existe) |
| 0 | % de leads com `consent_text` + `consent_at` gravados | **100%.** Qualquer valor abaixo significa que existe caminho de captura ilegal aberto no site |
| 1 | Autodiagnósticos iniciados / concluídos / identificados | 300 / 40% / 25% dos concluídos |
| 1 | Horas da Giovanna em conteúdo | máx. 4h/mês depois do mês 1 |
| 2 | **Conversas iniciadas pelo prospect** (métrica-mãe do plano) | 25/semana em setembro |
| 2 | CPiC (Search + CTWA somados) | teto R$60 nos primeiros 30 dias |
| 2 | Taxa de resposta sobre e-mails entregues | mín. 2%. Abaixo de 1% o problema é o assunto ou a lista — aumentar volume nesse cenário só queima domínio |
| 2–3 | CPL por campanha | corte automático em R$280 |
| 3 | Conversa → diagnóstico agendado | mín. 25% |
| 3 | Saúde do canal: opt-out + bounce + spam | **abaixo de 0,3%** e **zero descadastramentos não honrados** |
| 3 | Parcela de impressões perdida por orçamento × por classificação | ver regra de escala |
| 4 | CAC por cliente fechado (via gclid reconciliado) | teto de 15% do primeiro contrato |

**Métricas proibidas:** CTR, CPM, CPC bonito, alcance, seguidores. Em conta pequena, métrica de vaidade é pior que nenhuma métrica — dá a sensação de que a campanha funciona enquanto o telefone não toca.

---

## 8. Riscos e mitigação

| # | Risco | Gravidade | Mitigação concreta |
|---|---|---|---|
| 1 | **Banimento permanente do 5511947811422** | **Existencial** | Desligar o Baileys em 24/08. Zero envio ativo frio. Só `wa.me` e CTWA. Opt-in gravado em coluna dedicada. Não migrar o número para a Cloud API (a migração apaga o histórico e é praticamente irreversível) |
| 2 | Falta de base legal LGPD | Alta | LIA de 2 páginas nas 3 fases do Guia da ANPD; `origem` gravada na coleta; opt-out one-click; política publicada; `is_suppressed()` chamada antes de todo envio, com teste que falha se algum caminho pular |
| 3 | Lei SP 17.832/2023 (Não Me Ligue) | Alta | Cadastrar a Fontesan no sistema do Procon-SP e excluir linhas bloqueadas da fila **antes** de ligar. Nunca app de mensagem para número não-optado. Há responsabilidade solidária |
| 4 | Autuação do CRN por publicidade | Média | Gate de 6 itens no pipeline: (1) CRN visível, (2) sem preço/grátis/promoção/sorteio, (3) sem promessa de resultado, (4) sem marca de terceiro, (5) sem imagem de resultado, (6) base normativa citada. Pré-filtro regex procurando `R$`, grátis, promoção, desconto, garantimos, 100%, "a melhor", "nunca mais". Multa de até 10× a anuidade (~R$5.997 hoje, PF) |
| 5 | PJ de consultoria sem registro no CRN-3 | Média | Verificar status e regularizar. Res. CFN 702/2021 Art. 3º, VI exige registro. Atenção: **nutricionista não pode ser MEI**, e a isenção de anuidade PJ só vale se o único sócio for nutricionista — se Renan entrar no quadro, passa a haver anuidade |
| 6 | Publicar dado técnico errado assinado com CRN | Alta | A base de 47 chunks é **rascunho gerado por IA, documentado como tal no `domain.yaml`, e já responde ao público**. Nenhum número, prazo ou temperatura sai antes da revisão da Onda 0 |
| 7 | Afirmar conteúdo errado da CVS-3 a terceiros | Alta | Baixar o texto oficial e arquivar antes de qualquer peça. Citar o artigo ao lado de cada afirmação numérica |
| 8 | Violação dos ToS do Google Maps | Média | Base CNPJ da Receita. Se um dia a Places API for usada, guardar **só** `place_id`, consultar o resto ao vivo, exibir atribuição |
| 9 | Domínio queimado no e-mail | Média | SPF, DKIM e DMARC antes do primeiro envio. Aquecimento de 100/dia dobrando a cada 3 dias. Bounce e complaint alimentam supressão automaticamente |
| 10 | Migração automática para AI Max em 01/09 | Média | Não ativar correspondência ampla em nível de campanha nem recursos criados automaticamente. Frase e exata apenas |
| 11 | Sensacionalismo / promessa de resultado | Média | Proibido: "sua padaria vai ser interditada", "garantimos aprovação", "100% de aprovação", "a melhor consultoria de SP". Permitido e mais forte: *"A Portaria CVS-3/2026 entra em vigor em 04/10/2026 e revoga a CVS-5/2013; ela passa a exigir X, Y e Z."* O fato datado é mais forte que o pânico e não gera processo |
| 12 | Falha silenciosa de automação na janela crítica | Baixa | Alerta em toda tarefa cron. Se o e-mail ou o post parar, alguém precisa saber no mesmo dia |

---

## 9. Lista consolidada do que NÃO fazer

1. Não raspar Google Maps — nem "só uns 50 por dia".
2. Não disparar WhatsApp frio em nenhuma versão, nem por bridge, nem por lista de transmissão (que só entrega a quem já salvou o número, então nem funciona), nem por Status.
3. Não tentar consertar o pareamento do Baileys.
4. Não migrar o 5511947811422 para a Cloud API.
5. Não mandar clique pago para o `index.html` de 23 MB.
6. Não comprar "visitas" nem usar objetivo Tráfego/Alcance.
7. Não usar Performance Max nem AI Max.
8. Não criar campanha de marca "Fontesan" (volume de busca praticamente zero, nenhum concorrente comprando).
9. Não subir lista de terceiros como público personalizado da Meta — só quem preencheu formulário próprio com opt-in gravado, e lookalike 1% a partir daí.
10. Não anunciar preço, "diagnóstico gratuito", desconto, sorteio ou garantia de resultado em canal público.
11. Não citar marca de sanitizante, termômetro, embalagem, fornecedor ou equipamento nos posts, e não aceitar permuta de indústria de alimentos.
12. Não publicar nenhuma peça sem aprovação da Giovanna — inclusive o texto fixo do comment-to-DM.
13. Não construir publisher próprio de Instagram agora.
14. Não contratar CRM SaaS nem plataforma de prospecção.
15. Não montar sequência infinita de follow-up (máx. 3 toques; qualquer resposta cancela).
16. Não comprar lista pronta.
17. Não perseguir volume de posts nem abrir blog genérico de "dicas de higiene" — a escassez está na autoria, não na distribuição.

---

## 10. Incertezas que precisam de verificação humana antes de decidir

1. **Texto oficial e vigência da CVS-3/2026** — toda a tese de urgência depende disso e a Fontesan afirma isso por escrito a terceiros. Fonte oficial CVS/SP. **Bloqueante.**
2. **Volume de busca na Grande SP** para os termos-alvo — decide se o Search consegue gastar R$40/dia ou se a verba tem que migrar para Meta. Exige login no Planejador. **Bloqueante para a alocação.**
3. **Qual código de ética está em vigor hoje** (599/2018 com vacância prorrogada até 23/01/2027 × 856/2026 já vigente). Confirmar por escrito com o CRN-3. Enquanto isso, regra mais dura.
4. **Status da PJ Fontesan no CRN-3** — registrada? RT anotada? CRR válida? Só sai por consulta com o login da empresa.
5. **Se "diagnóstico gratuito" é promoção vedada** pelo Art. 57 — protocolar consulta formal e **guardar a resposta por escrito**; resposta do próprio conselho é a melhor blindagem possível.
6. **Se pagamento por indicação a contador beira divisão de honorário** — enquanto não houver resposta do CRN-3, operar só por reciprocidade (co-marketing e webinar), que é indiscutível.
7. **Taxa de preenchimento de telefone e e-mail** na base CNPJ para os CNAEs-alvo na RMSP — só medindo depois de baixar o snapshot. Suspeita razoável de muito telefone fixo antigo e e-mail de contador.
8. **Se o Não Me Ligue alcança contato B2B** — não há jurisprudência nem decisão da ANPD. Leitura segura: consultar antes de qualquer contato telefônico ou por app em SP.
9. **Tarifas reais da Meta em BRL** e se mensagens de serviço passam a ser cobradas em 01/10/2026 (cinco fontes de BSP afirmam, a documentação oficial não confirma). **Irrelevante enquanto a Fontesan ficar no app gratuito** — vira relevante só se a Cloud API entrar na Onda 4.
10. **Limite real de posts do plano Free do Metricool** (20 ou 50/mês) — confirmar dentro da conta antes de fechar o calendário editorial.

---

## Uma frase para fechar

A CVS-3/2026 não é uma campanha de marketing — é a única vez neste ano em que a coisa mais chata que a Fontesan sabe fazer vira a coisa mais urgente que o cliente dela precisa resolver. O plano inteiro cabe em: **arrumar a casa esta semana, colocar o prazo dele na frente dele nas seis seguintes, e deixar que ele levante a mão.**
---

# Anexo — Revisão adversarial do plano

Duas críticas independentes rodadas contra o plano acima (uma de risco legal/ético, uma de viabilidade), antes de qualquer execução. 24 problemas levantados: 11 críticos, 12 sérios, 1 menor. Onde o anexo contradiz o corpo do plano, **o anexo vence** — ele foi escrito depois e com acesso ao repositório real.

## Crítica 1 — Risco legal e ético

**Veredito:** O plano é forte exatamente onde a maioria erra: ele mata o disparo frio de WhatsApp, aposenta o Baileys, corrige a fonte de leads e recusa PMax/AI Max — essas decisões estão certas e não têm o que consertar. O problema é o ponto cego estrutural: ele audita com rigor a campanha que ainda não existe e trata os ativos que JÁ estão no ar como seguros. Verifiquei no repositório e o oposto é verdade — o `domain.yaml` proíbe literalmente ligar o pgvector em produção antes da revisão da Giovanna, e o agente está ingerido e respondendo ao público com um artigo sobre a CVS-3 cheio de números específicos gerados por IA; o `index.html` tem a palavra "garantir" numa comparação de preço com multa e responde "quase sempre, sim" sobre auto de infração, que o próprio `evals/cases.yaml` exige escalar; e o `cases.yaml` que o plano usa como portão de qualidade não testa um único fato. Pior: o plano manda deixar o site "exatamente como está" e agenda a revisão da base para quinta-feira, dia 4 da semana — para uma empresa que vende compliance, cada dia com o agente no ar dizendo "cocção sobe de 74°C para 75°C" sem conferência é responsabilidade técnica acumulando sob o CRN-3 67286. Corrija a ordem: desligar o domínio `fontesan` é a ação de segunda-feira, antes do Baileys.

### [CRITICO] O agente RAG está no ar servindo norma gerada por IA, sob o nome e o CRN da Giovanna, e o plano só encara isso na quinta-feira da semana 1. O arquivo D:\Octobox\fontesan\backend\domains\fontesan\domain.yaml diz literalmente: 'PENDENTE de revisao tecnica... Nao ligar RETRIEVAL_BACKEND=pgvector para este dominio em producao antes dessa revisao' — e os 47 chunks estão ingeridos e respondendo. O artigo D:\Octobox\fontesan\backend\domains\fontesan\knowledge\articles\portaria-cvs-3-2026-nova-norma-sp-outubro.md contém cerca de 30 afirmações numéricas específicas que ninguém conferiu, várias com cara de alucinação: 'Tempo de higienização das mãos passa de 3 minutos para 40 segundos', 'Temperatura mínima de cocção sobe de 74°C para 75°C', 'Uso de máscara deixa de ser proibido', '16°C por até 2 horas por lote', 'pH igual ou inferior a 4,5', 'amostras sobem de 72 para 96 horas'. Um dono de padaria que ajustar o forno com base nisso e adoecer alguém tem um rastro escrito apontando para uma nutricionista registrada. O próprio README do bridge já reconhecia o problema e mandava não abrir para clientes reais.

**Correção:** Mover para segunda-feira 24/08, ANTES do Baileys: desligar o domínio fontesan em produção (RETRIEVAL_BACKEND fora de pgvector para esse domínio, ou rota do chat desativada) e trocar por uma mensagem única de 'em revisão técnica, fale com a responsável'. Só religar depois da conferência artigo por artigo contra o PDF oficial. O custo de ficar 5 dias sem chat é zero; o custo de 5 dias afirmando temperatura errada com CRN embaixo não é.

### [CRITICO] O plano afirma que o site 'deve continuar exatamente como está'. Ele não pode. Verifiquei D:\Octobox\fontesan\site\index.html e há três violações concretas, todas em texto público hoje. (1) Linha 584, FAQ 'Quanto custa?': 'O que dá para garantir: custa menos que uma multa, e muito menos que uma interdição' — usa 'garantir', é comparação de preço com o valor de honorários e ainda ancora no medo; bate de frente com o Art. 56 (garantia/sensacionalismo) e tangencia o Art. 57 (honorários como publicidade) da Res. CFN 599/2018. (2) FAQ 'Recebi uma notificação com prazo. Dá tempo?': 'Quase sempre, sim. O protocolo prevê prazo de adequação antes da segunda visita' — promessa de resultado sobre processo administrativo em curso, afirmação normativa sem fonte e que varia por município, e o próprio domain.yaml lista 'avaliação de auto de infração, processo administrativo' como fora de escopo, com o eval 'fora-de-escopo-autuacao-em-andamento' exigindo escalonamento. O robô recusa; o site promete. (3) Linhas 519-524, bloco 'O tamanho do risco': '10% das punições chegam à interdição total... Fontes: SINAN / Ministério da Saúde · estudo de autuações em capital do Nordeste' — número de outra região usado para dimensionar o risco de um negócio da Grande SP, com fonte impossível de verificar, sob um cabeçalho de risco imediatamente antes da oferta.

**Correção:** Auditoria de copy do index.html na Onda 0, junto com a política de privacidade. Trocar a resposta de preço por 'o investimento depende do porte e do estado do negócio; falamos de valores no diagnóstico' — sem 'garantir', sem comparar com multa. Trocar a resposta de notificação por 'depende do prazo do auto e do que a fiscalização apontou; isso a Giovanna avalia caso a caso' — igual ao comportamento do agente. Substituir a estatística por dado de SP com autor, ano e link, ou remover o bloco; e a mesma regra vale para a LP /cvs3, que o plano pretende alimentar com o mesmo material.

### [CRITICO] O portão de qualidade escolhido pelo plano para liberar a base revisada — 'run_domain_eval fontesan 8/8' — não valida absolutamente nenhum fato. Li D:\Octobox\fontesan\backend\domains\fontesan\evals\cases.yaml inteiro: os 8 casos checam apenas should_escalate, a presença do termo 'responsável técnica' e qual arquivo foi citado. Não há uma única asserção sobre conteúdo. A base pode continuar com 'cocção 75°C' e '40 segundos' inventados e passar 8/8 tranquilamente. Isso significa que a remediação do risco número 1 do plano termina com um carimbo verde que não prova nada — e, pior, gera um registro interno dizendo que a base foi validada.

**Correção:** Antes de religar o domínio: (a) acrescentar casos de eval com expectativa factual explícita (temperatura de cocção, prazo de guarda, data de vigência) e uma lista de termos PROIBIDOS na resposta ('garantimos', 'aprovação garantida', 'não vai ser autuado'); (b) produzir uma planilha de rastreio com uma afirmação por linha e a coluna 'artigo da CVS-3 que sustenta' — sem número de artigo preenchido, a afirmação sai da base. O critério de saída da Onda 0 deve ser 'zero afirmações numéricas sem artigo citado', não '8/8'.

### [SERIO] O selo físico 'Casa em dia' colado na porta do estabelecimento do cliente é um atestado de conformidade contínua emitido por quem formalmente não pode assumir responsabilidade técnica pelo cliente. Vi o artefato em D:\Octobox\fontesan\branding\logos\adesivo-casa-em-dia.svg: círculo verde, anel laranja, check grande e texto circular 'FONTESAN · SEGURANÇA DE ALIMENTOS · ROTINA' com o ano. O D:\Octobox\fontesan\branding\marca-fontesan.md descreve o selo como peça 'para situações de autoridade' e 'carimbo de aprovação', e o marketing-fontesan.md diz que o cliente exibe para dar 'confiança para o consumidor dele'. Três problemas somados: o consumidor pode confundir com classificação sanitária oficial; a Res. CFN 576/2016 Art. 15 diz que o CRN não concede RT ao nutricionista que atua como consultor ou auditor, ou seja, a Giovanna não pode responder pela conformidade contínua que o selo sugere; e se o estabelecimento for interditado com o adesivo na porta, a marca que aparece no noticiário é a Fontesan. A Onda 4 ainda amplia isso com QR único por cliente.

**Correção:** Reposicionar ou matar. Se mantiver: tirar o check e qualquer semântica de aprovação, escrever 'Cliente Fontesan · acompanhamento técnico desde MM/AAAA' em vez de 'Casa em dia', incluir em letra legível 'Não é certificação oficial e não substitui a licença sanitária', e colocar no contrato a obrigação de retirar o adesivo ao fim do acompanhamento, com a Fontesan podendo exigir a retirada. Se o QR for adiante, ele deve levar a uma página com data da última visita, nunca a um status de conformidade.

### [SERIO] O roteiro de ligação e o de e-mail têm enquadramento quase-oficial, que é o pior modo de falha possível para quem vende compliance. O script proposto é: 'ligo porque a Portaria CVS-3 entra em vigor em 04/10 e substitui a CVS-5; queria confirmar se vocês já receberam a informação sobre o exame anual dos manipuladores.' 'Confirmar se já receberam a informação' sugere que existe uma comunicação oficial em curso e que a Fontesan faz parte dela. O e-mail repete o padrão ao abrir declarando 'sua empresa consta na base pública de CNPJ da Receita Federal' — declaração de origem é obrigação de transparência e está certa, mas usada como primeira frase de uma mensagem sobre prazo regulatório ela reforça a leitura de comunicado oficial. Se um dono de padaria contar ao contador que 'a vigilância ligou' e o contador ligar para o CVS, a Fontesan vira a consultoria que se passou por fiscal.

**Correção:** Primeira frase de todo contato ativo, telefone e e-mail, identifica a natureza comercial e a pessoa: 'Aqui é da Fontesan, consultoria privada em segurança de alimentos; quem assina é a nutricionista Giovanna Fontes Rios, CRN-3 67286.' Só depois vem a norma. Acrescentar no rodapé de todo e-mail: 'Mensagem comercial. A Fontesan é empresa privada e não tem vínculo com o Centro de Vigilância Sanitária, com a Prefeitura nem com a Receita Federal.' Trocar 'confirmar se já receberam a informação' por 'queria saber se já é assunto conhecido aí'.

### [SERIO] O teste de balanceamento (LIA) nunca foi agendado. Ele aparece uma única vez no documento, dentro da célula de mitigação do risco 2 da tabela do §8 — 'LIA de 2 páginas nas 3 fases do Guia da ANPD'. A lista numerada da Onda 0 tem 10 itens e nenhum é o LIA; nenhuma outra onda o menciona. Na prática, o disparo de e-mail de 08/09 sai sem o documento que a ANPD pede primeiro quando questiona base legal — e foi exatamente a ausência de base legal que fundamentou a primeira sanção da história da agência. Mitigação que não vira item de agenda com dono e data não é mitigação, é intenção.

**Correção:** Virar item numerado da Onda 0, com dono (Renan escreve, Giovanna assina) e prazo 05/09, isto é, antes do primeiro envio e não junto dele. Três seções curtas seguindo o Guia: finalidade (avisar estabelecimento de SP sobre obrigação legal datada que se aplica a ele), necessidade (por que e-mail comercial público é o meio menos invasivo) e balanceamento/salvaguardas (minimização, origem registrada, opt-out em um clique, supressão permanente). Versionar no repositório junto com o PDF oficial da CVS-3, porque o valor dele é ser produzível na hora em que for pedido.

### [SERIO] A dívida de privacidade da base atual não é tratada, só a futura. Confirmei três coisas: não existe página de privacidade no site (busca por *privac* em D:\Octobox\fontesan\site retorna vazio); a tabela criada em D:\Octobox\fontesan\backend\migrations\020_fontesan_leads.sql tem cinco colunas e nenhuma de consentimento, origem ou finalidade; e em D:\Octobox\fontesan\backend\app\db\operational.py, linha ~929, o telefone é gravado em texto puro por decisão explícita, enquanto o mesmo backend hasheia telefone com HMAC em case_whatsapp_bindings (migration 016). Ou seja, o padrão de privacidade mais frouxo do repositório está justamente na tabela de dados de terceiros. A migration 021 conserta o futuro; os leads já coletados continuam sem aviso do art. 9 e sem base documentada, e o plano pretende usar a base para campanha e para público personalizado. Não há também prazo de retenção nem rotina de eliminação (art. 16), e a 021 ainda acrescenta consent_ip, fbp, fbc e gclid, aumentando o volume de dado pessoal guardado.

**Correção:** Na 021, marcar todo registro anterior com status='legado_sem_aviso' e proibir esses registros em qualquer envio ativo — eles só podem ser retomados por contato individual da Giovanna, que é a legítima expectativa de quem preencheu um formulário de contato. Definir retenção explícita (sugestão: 24 meses sem interação, depois expurgo) com um systemd timer que executa, não só um comentário na migration. Guardar o IP truncado em /24 ou como hash, não inteiro. E alinhar o tratamento do telefone ao padrão que o próprio repositório já usa em case_whatsapp_bindings.

### [SERIO] A instrumentação proposta cria um caminho de contorno do consentimento. O plano define 'Consent Mode v2 com denied por padrão' mas em nenhum lugar prevê construir o banner que permitiria o usuário conceder — sem banner, o estado fica em denied para sempre, e aí o GA4 e o Pixel client-side não deveriam disparar, o que colide com a própria meta da Onda 0 de '>90% de leads com origem preenchida'. A saída que o plano oferece é justamente a que a ANPD está monitorando: CAPI server-side com event_id igual ao lead_id, ou seja, telefone e e-mail hasheados indo para a Meta por fora do sinal de consentimento. Some-se a isso o §9.9, que autoriza subir leads próprios como público personalizado da Meta: um opt-in genérico de 'aceito receber contato' não cobre transferência do dado para a Meta, e o art. 9º, V exige informar expressamente o uso compartilhado. Uso secundário de dado pessoal para publicidade direcionada consta literalmente do Mapa de Temas Prioritários 2026-2027 da ANPD.

**Correção:** Incluir na Onda 0 um banner de consentimento simples (aceitar/recusar, sem dark pattern) e amarrar o disparo do CAPI ao mesmo estado de consentimento do client-side — server-side não é permissão para ignorar a recusa. O texto de opt-in gravado em consent_text deve nomear explicitamente o compartilhamento: 'autorizo o uso dos meus dados de contato para comunicação da Fontesan, inclusive de forma criptografada em plataformas de anúncio (Google e Meta)'. Sem essa frase gravada no registro, não subir a lista como público personalizado — e o lookalike derivado dela também não.

### [SERIO] O plano se contradiz sobre o 'grátis' e o autodiagnóstico vira quase-laudo. O §5 da Onda 1 promete resultado 'na tela, de graça, antes de pedir contato', enquanto o §9, item 10, proíbe anunciar 'diagnóstico gratuito'. As duas coisas não convivem na mesma landing page. Além disso, o entregável é um PDF de avaliação de conformidade gerado a partir de 15 perguntas, sem vistoria, num material que carrega o CRN-3 67286 e o selo da marca no rodapé (padrão descrito em branding\README.md para documentos técnicos: logo no cabeçalho, selo, nome e CRN no rodapé). Isso é exatamente o que o próprio domain.yaml classifica como fora de escopo — 'emissão de laudo técnico oficial ou assinatura de responsabilidade técnica a distância' — e o que o metodo-fontesan.md diz que a Fontesan não pode fazer: 'não pode confirmar que um estabelecimento específico está em conformidade sem vistoria presencial'.

**Correção:** A ferramenta pode ser gratuita; a palavra não pode aparecer. Chamar de 'autoavaliação da CVS-3' e nunca de 'diagnóstico gratuito' em anúncio, e-mail, post ou LP, até o Setor de Ética do CRN-3 responder por escrito. No PDF: sem selo, sem carimbo, sem assinatura, sem nada que pareça documento técnico emitido; cabeçalho dizendo 'Autoavaliação preenchida pelo próprio estabelecimento. Não é laudo, não é atestado de conformidade e não substitui vistoria presencial', mais a ressalva do Art. 55, parágrafo único. O CRN entra como identificação de quem escreveu o material, no rodapé em texto corrido, não como assinatura de laudo.

### [SERIO] Não existe plano B para o adiamento da CVS-3, num semestre em que o adiamento é o cenário documentado. O próprio pacote de pesquisa registra que o novo Código de Ética do CFN (Res. 856/2026) teve a vacância prorrogada por 180 dias em julho de 2026 — prorrogar norma às vésperas da vigência é rotina no Brasil. Se o CVS/SP publicar prorrogação em setembro, a Fontesan estará com cerca de 2.000 e-mails já entregues, anúncios no ar e posts agendados afirmando por escrito uma data que deixou de valer, tudo assinado por uma nutricionista com registro. Para uma consultoria que vende conformidade, ser a empresa que espalhou a data errada da norma é um dano de marca muito maior do que qualquer lead perdido. O plano só prevê o pivô para 03/10 no cenário em que tudo corre conforme o previsto.

**Correção:** Três medidas baratas: (a) monitoramento semanal do DOE-SP por 'CVS' até 04/10, com alerta — pode ser um cron simples na VPS que já existe; (b) toda peça escrita cita a fonte com data de publicação e a ressalva 'conforme publicada no DOE-SP de 06/07/2026', o que transforma uma eventual afirmação desatualizada em citação correta de um fato que mudou depois; (c) kill-switch operacional: uma variável que pausa a fila do operational_outbox e os posts agendados no Metricool em uma ação só, testada antes de 08/09, não improvisada no dia.

### [SERIO] O site chama a Giovanna de 'Responsável técnica' em dois lugares (index.html linhas ~639 e o bloco 'Quem assina') e afirma 'Registro ativo no Conselho Regional de Nutricionistas da 3ª região', enquanto o próprio plano admite não saber se a PJ Fontesan está registrada no CRN-3 nem se a RT está anotada. O plano trata isso como tarefa 'em paralelo, durante a semana', na alínea 10 da Onda 0, misturada com formulários do Google. É a exposição mais fácil de flagrar que existe: a Res. CFN 702/2021, Art. 3º, VI exige registro da PJ de consultoria em alimentação e nutrição, o Art. 15 exige nutricionista RT para o registro, e o CRN-3 aceita denúncia anônima — um concorrente irritado com os anúncios que estão prestes a subir não precisa se expor para acionar o conselho. E o plano vai justamente multiplicar a visibilidade dessa afirmação em anúncio pago, e-mail em massa e evento com sindicato.

**Correção:** Promover a item bloqueante da Onda 0: consultar o Autoatendimento do CRN-3 na segunda-feira e confirmar registro da PJ, anotação da RT e CRR válida, além de anuidade PF em dia (senão 'registro ativo' é afirmação falsa). Enquanto não houver confirmação documental, trocar 'Responsável técnica' por 'Nutricionista responsável pelo serviço' no site, nas assinaturas e nos criativos — descreve o mesmo fato sem invocar um status formal que pode não existir. Regularizar antes de escalar mídia, não depois.

### [MENOR] A Onda 4 traz duas mecânicas que passaram por todos os filtros do documento sem serem examinadas. (1) As páginas /norma seriam pautadas 'das conversas reais que o backend já grava' — usar perguntas de clientes e leads, coletadas para atendimento, como insumo de conteúdo público é finalidade nova (art. 6º, I e art. 7º, §7º) e esbarra no dever de sigilo profissional; uma pergunta específica o bastante para render uma página é específica o bastante para identificar quem perguntou, ainda mais num nicho pequeno da Grande SP. (2) O programa de indicação herdado do marketing-fontesan.md dá ao cliente que indica 'uma visita extra de auditoria no ano' — serviço profissional oferecido como recompensa, que é exatamente a leitura de 'promoções de procedimentos ou serviços como forma de publicidade' vedada pelo Art. 57 da Res. CFN 599/2018 e repetida no Art. 68, III do 856/2026. O plano protocola consulta ao CRN-3 sobre pagamento a contador, mas não sobre esta, que é mais claramente enquadrável.

**Correção:** Para as páginas /norma: pautar por tema agregado, nunca por caso; regra escrita de que nenhuma página cita situação, bairro, porte ou detalhe operacional que permita reconhecer o estabelecimento; e incluir a finalidade 'melhoria e produção de conteúdo educativo, de forma agregada e anonimizada' na política de privacidade antes de usar qualquer conversa. Para o programa de indicação: incluir a pergunta na mesma consulta formal ao Setor de Ética do CRN-3 já prevista na Onda 0 e, até a resposta, operar por reconhecimento não-econômico (prioridade de agenda, menção no Instagram com autorização) em vez de serviço gratuito como prêmio.

## Crítica 2 — Viabilidade e completude

**Veredito:** O diagnóstico jurídico e de canal é a melhor parte do documento e deve ser preservado quase intacto — matar o disparo frio de WhatsApp, desligar o Baileys e trocar Google Maps pela base da Receita são decisões certas e bem fundamentadas. O plano de execução, porém, é um plano para uma equipe de cinco pessoas com verba, escrito para uma equipe de 1,5 pessoa em que a metade que fatura é a mesma que teria de aprovar peça, ligar para lead frio, dar aula, gravar vídeo e ainda atender cliente pagante. Três falhas estruturais: gasta as duas semanas de maior urgência construindo infraestrutura e só coloca mídia no ar em 07/09, quando já não sobra ciclo de venda até 04/10; nunca define a oferta, o preço nem quem entrega o que for vendido; e dá de graça (aula de 8h para associados) a única coisa do documento inteiro que escala e que a própria CVS-3 torna obrigatória para todo manipulador. Some-se a isso um ETL de 17 GB proposto para uma VPS que o próprio repositório documenta tendo batido 100% de disco, e um canal de e-mail de 2.000 disparos que não tem uma única linha de código escrita nem conta de envio aprovada. Corte para três frentes ou 04/10 chega com um funil bonito e a agenda vazia.

### [CRITICO] O plano consome de 60 a 90 horas por mês da Giovanna, que é a única pessoa que fatura. Somando o que está escrito: 4h de revisão da base de conhecimento, ~20h/mês de ligações frias (1h por dia útil), aprovação peça a peça de 3 posts/semana com 6 saídas cada, 1 a 2 eventos com entidades (12-20h entre preparo, deslocamento e execução), 1h/mês de gravação em lote (irreal para 8 reels), atendimento de WhatsApp em janela de 24h, ligações para 4-6 sindicatos, mais a entrega dos diagnósticos que a campanha promete vender. Isso é um segundo emprego em cima do primeiro. O plano reconhece o 'trabalho humano irredutível' em §3 mas nunca subtrai essas horas das horas faturáveis, e a única meta de tempo dela no documento é 'máx. 4h/mês em conteúdo', que cobre menos de 10% da carga real.

**Correção:** Definir um teto duro e explícito de 8h/semana de marketing para a Giovanna e caber o plano dentro dele. Cortar as ligações frias (12-15 chamadas/dia é o pior uso possível da hora da técnica: baixa conversão, alto desgaste e ainda exige cadastro no Procon-SP antes). Trocar aprovação peça a peça por um lote único de 30 minutos toda sexta, com o Renan já entregando o material formatado e pré-filtrado pelo gate de 6 itens. Manter dela apenas: revisão da base de conhecimento, ligação para as entidades de classe, a aula, e o atendimento de quem levanta a mão. Todo o resto é do Renan ou não acontece.

### [CRITICO] Não existe plano de entrega nem modelo de capacidade, e há uma contradição temporal na proposta de valor. O funil promete 40-60 conversas, 12-20 diagnósticos e 3-6 contratos até 04/10, com a promessa implícita de 'adequar antes do prazo'. Um contrato assinado em 25/09 não deixa uma padaria adequada em nove dias — exames de manipulador, curso de 8h, POPs novos e guarda documental não cabem nesse prazo. E o documento nunca responde quantos clientes a Giovanna consegue atender em paralelo. Ou o funil frustra quem comprou, ou ela vira o gargalo e a qualidade cai justamente na semana em que a fiscalização começa.

**Correção:** Antes de subir qualquer campanha, escrever em uma página: (a) quantos diagnósticos por semana a Giovanna consegue fazer sem prejudicar cliente atual (chute honesto: 3 a 4); (b) o que exatamente é entregue e em quanto tempo; (c) uma segunda oferta para quem chegar depois de ~20/09, que não prometa adequação retroativa — algo como 'plano de adequação assinado + prioridade de agenda em outubro'. Se a capacidade for de 3 diagnósticos/semana, o teto real do funil é ~15 no período, e a verba de mídia deve ser dimensionada por esse teto, não pelo CPL.

### [CRITICO] O curso obrigatório de 8h para manipuladores está no plano como brinde, não como produto — e é a maior oportunidade de receita ignorada no documento inteiro. A CVS-3 obriga TODO manipulador de TODO estabelecimento de alimentos de SP a ter curso de 8h com comprovação nominal, com prazo legal. Isso é: público cativo por força de lei, deadline dado, margem alta, marginal quase zero por aluno adicional, entregável em turma (presencial ou online), não exige visita técnica, e é a porta de entrada natural para a consultoria depois. O plano transforma exatamente isso em 'aula gratuita de 60-90 min para associados' de sindicato. Também ficam de fora: os exames anuais de coprocultura/parasitologia (parceria de indicação com laboratório, receita ou desconto para o cliente, contato zero-custo) e a obrigação de rotina contínua — que é literalmente a palavra da marca ('rotina') e nunca vira retainer mensal recorrente.

**Correção:** Criar UM produto vendável nas próximas duas semanas: turma de curso de manipuladores de 8h com certificado nominal, data marcada antes de 04/10, preço por pessoa, vendida por lote para o estabelecimento. Ela financia a campanha, gera lista opt-in legítima e qualifica quem depois compra consultoria. A aula para o sindicato continua gratuita, mas como isca da turma paga, não como substituto dela. Em paralelo, fechar uma parceria de indicação com um laboratório para os exames anuais e desenhar um retainer mensal simples ('rotina em dia': visita trimestral + revisão documental + canal de dúvidas) para vender no fechamento de todo diagnóstico.

### [CRITICO] A carteira de clientes atuais e antigos não aparece uma única vez no plano — e é o único público onde WhatsApp ativo é legal, legítimo e de conversão alta. Toda a pesquisa da própria ANPD citada no documento diz que os exemplos que passam no teste de legítimo interesse são justamente os de relação prévia; e a política do WhatsApp se satisfaz com quem já conversa com você. Ou seja: o plano gasta seis semanas construindo canais frios difíceis e ignora o canal quente que custa R$0 e já está pronto. Junto com isso ficam de fora três coisas de custo zero e retorno imediato: pedir avaliação no Google Perfil da Empresa aos clientes atuais (o fator mais forte de ranqueamento local, e o GBP é a prioridade nº 1 do documento de estratégia que já existe), pedir indicação nomeada ('quem você conhece que vai ter esse problema em outubro?'), e distribuir o selo físico 'Casa em dia' com QR — que o plano empurra para a Onda 4.

**Correção:** Semana de 24/08, antes de qualquer outra coisa: listar todo cliente atual, ex-cliente, contato de rede e quem já pediu orçamento e não fechou; mandar mensagem individual, escrita à mão, avisando da CVS-3 e do que muda para o negócio dele. Na mesma mensagem, pedir avaliação no Google e pedir uma indicação nomeada. Reivindicar e verificar o Google Perfil da Empresa nesta semana (a verificação leva de 1 a 5 semanas e negócio de prestação de serviço sem vitrine costuma travar — não é item 'em paralelo', é caminho crítico). Selo físico com QR nos clientes atuais na semana 1, não na Onda 4.

### [CRITICO] O canal de e-mail é o maior gerador de volume de outbound do plano (~2.000 a 3.000 envios) e é, ao mesmo tempo, o único que não tem uma linha de código escrita nem conta aprovada. Verifiquei o backend: não há biblioteca de envio (boto3 só existe como extra opcional em pyproject.toml), não há template, não há endpoint de descadastro em lugar nenhum (grep por 'unsubscribe'/'descadastr' em backend/app retorna zero), não há handler de bounce da SES e o operational_outbox entrega por rota HTTP, não por e-mail. Pior: a Amazon SES começa em sandbox (200/dia, só destinatários verificados) e sair de lá exige descrever à AWS como você obteve os endereços — 'base pública de CNPJ da Receita Federal' é exatamente a resposta que costuma ser recusada. E o campo de e-mail da Receita é notoriamente velho e frequentemente do contador; bounce acima de 5% derruba a conta SES e queima a reputação de fontesan.com.br, que é o domínio usado para falar com cliente real.

**Correção:** Ou cortar o e-mail frio destas 6 semanas, ou tratá-lo como projeto próprio com pré-requisitos: (1) pedir saída do sandbox da SES nesta semana, com descrição honesta do uso; (2) enviar de um subdomínio separado (ex.: aviso.fontesan.com.br) com SPF/DKIM/DMARC próprios, para que um incidente não contamine o domínio principal; (3) validar uma amostra de 200 endereços da base antes de dimensionar qualquer volume — se o bounce da amostra passar de 5%, o canal morre ali; (4) construir endpoint de descadastro one-click e cabeçalho List-Unsubscribe ANTES do primeiro envio, não depois. Recomendação: adiar para depois de 04/10 e usar as horas do Renan na landing page e no Search.

### [CRITICO] O ETL da base CNPJ na VPS existente é apresentado como 'sem custo extra', mas o próprio repositório documenta que essa máquina já bateu 100% de disco. Em backend/docs/runbooks/vps-capacity-and-docker-cleanup.md os limiares são warning em 75%, crítico em 85% e crítico absoluto abaixo de 2 GiB livres; em backend/docs/documentation-status.md consta que em 18/06/2026 'o disco foi reduzido de 100% para 81%'. Ou seja: a máquina opera a poucos pontos do limiar crítico. Descompactar ~17 GB de arquivos da Receita e carregar no mesmo Postgres que serve o pgvector, o backend e o site tem chance real de derrubar fontesan.com.br, o chat do fontesan.online e o formulário de leads no meio da campanha — e o incidente aconteceria justamente na janela em que não se pode ficar fora do ar.

**Correção:** Não fazer o ETL na VPS. Baixar e processar na máquina do Renan (ou em instância temporária), filtrar por CNAE + municípios da RMSP + situação cadastral ativa ANTES de carregar, e subir para a VPS apenas a tabela final de prospects — que são milhares de linhas e alguns megabytes. Rodar `python -m scripts.check_runtime_capacity` e anotar o percentual real de disco livre antes de qualquer decisão. Se o objetivo é só dimensionar mercado por CNAE, isso sai de um CSV no laptop e não precisa entrar em produção nunca.

### [CRITICO] O sequenciamento está invertido: as duas semanas de maior urgência são gastas construindo infraestrutura e a mídia só entra em 07/09. O ciclo de decisão de uma consultoria de compliance (contato, visita, proposta, assinatura) é de 2 a 4 semanas. Isso significa que qualquer lead gerado depois de ~20/09 não fecha sob o argumento 'me adequar antes do prazo' — o argumento que sustenta o plano inteiro. A janela real de venda com urgência é de 25/08 a 20/09, e o plano só está totalmente no ar na metade dela. Além disso, nada do que bloqueia a mídia realmente precisa bloquear: colocar UTM nos links leva 10 minutos, e uma página estática sobre a CVS-3 leva um dia.

**Correção:** Inverter: publicar /cvs3 como página estática simples até 26/08 (headline datada, 5 obrigações, formulário de 3 campos, botão wa.me com texto próprio, CRN visível) e ligar o Google Search em 27/08 com R$30/dia. GA4, Consent Mode, migration 021 e autodiagnóstico chegam por cima, na semana seguinte, sem parar o gasto. O autodiagnóstico de 15 perguntas com PDF gerado no cliente é a peça mais cara de construir e a menos essencial — corte para 6 perguntas ou empurre para depois de 04/10.

### [CRITICO] São mais de 17 frentes simultâneas em 6 semanas para 1,5 pessoa: Google Search, Meta CTWA, remarketing, e-mail frio, ligações diárias, dois eventos, contadores, 3 posts/semana, landing page, autodiagnóstico, ETL da Receita, 8-12 páginas /norma, pedido de LAI, duas consultas ao CRN-3, cadastro no Procon-SP, Google Perfil da Empresa, SES, Meta CAPI server-side, conversão offline por gclid e produção de vídeo. Cada uma isolada é defensável; juntas são cerca de quatro vezes a capacidade real. O resultado previsível não é atraso uniforme: é tudo pela metade e nada terminado, com a agravante de que várias dessas frentes têm custo de manutenção contínuo (token, cron, fila, supressão) que sobra para depois.

**Correção:** Escolher no máximo três frentes para as 6 semanas e escrever explicitamente que o resto não acontece. A recomendação, por retorno por hora: (1) entidades de classe + carteira existente + curso de 8h pago; (2) Google Search + landing page + Google Perfil da Empresa; (3) Instagram em cadência mínima pelo Metricool. Cortar destas 6 semanas: e-mail frio, ligações frias, remarketing, CAPI server-side, conversão offline, páginas /norma, ETL da Receita, coletor do DOC-SP e motor de conteúdo. Nenhum desses muda o resultado até 04/10.

### [SERIO] O plano não define a oferta. Não há preço, não há descrição do que é 'o diagnóstico', não há proposta padronizada, não há roteiro de qualificação e não há follow-up depois da conversa. Todas as métricas param em 'conversa iniciada'. O documento chega a admitir 'não sei o ticket médio da Fontesan, então não calculo ROI' — e mesmo assim compromete R$2.500 de mídia. Para um time de duas pessoas, um modelo de proposta pronto e uma tabela de preço fechada economizam mais horas do que todo o motor de conteúdo somado, e são o que determina se R$2.500 de mídia é investimento ou doação.

**Correção:** Antes do primeiro real de mídia: fixar três pacotes com preço (diagnóstico, adequação completa, rotina mensal), escrever um modelo de proposta de uma página que só troca nome e escopo, e um roteiro de qualificação de 5 perguntas para o WhatsApp. Definir também o que é 'não-cliente' (fora da Grande SP, sem CNPJ ativo, sem intenção de prazo) para não gastar visita. Preço não vai para canal público — só no privado, o que é compatível com o código de ética.

### [SERIO] A medição prometida não é executável com o que existe, e uma decisão técnica do próprio plano a sabota. Consent Mode v2 com 'denied por padrão' sem nenhum banner de consentimento mencionado significa que os eventos de GA4 e Google Ads chegam bloqueados ou apenas modelados — o plano passa uma semana instrumentando e desliga a instrumentação na mesma linha. Além disso: 'conversas iniciadas pelo prospect' só existe dentro do app do WhatsApp e ninguém vai tabular à mão; 'conversa a diagnóstico agendado ≥25%' exige um pipeline que não existe (não há CRM e a tabela nova só ganha uma coluna 'status'); e 'CAC por cliente fechado via gclid reconciliado' exige registrar o fechamento e cruzar manualmente com o clique em até 63 dias — disciplina que evapora na primeira semana corrida.

**Correção:** Decidir agora o modelo de consentimento: ou banner real, ou analytics_storage granted com ad_storage denied e medir sem cookie de publicidade — não deixar para descobrir em setembro que o painel está vazio. Reduzir o painel a uma planilha semanal de quatro números preenchida em 10 minutos toda segunda: conversas recebidas, diagnósticos marcados, propostas enviadas, contratos fechados. Usar as etiquetas do app WhatsApp Business como fonte de verdade. Reconciliação de gclid só quando houver volume que justifique.

### [SERIO] Não há plano de resposta nem SLA — e é exatamente aí que o dinheiro vaza. A janela gratuita de 72h do CTWA e a janela de 24h do WhatsApp fazem da latência de resposta a variável mais cara do plano, e as duas pessoas estarão em cozinha de cliente, em visita ou em outro trabalho. O documento não define horário de atendimento, mensagem de ausência, quem responde quando, nem tempo máximo de primeira resposta. E o agente RAG do fontesan.online, que já existe, já responde perguntas reais de segurança de alimentos e está ocioso como canal, não é usado para primeira resposta em lugar nenhum do funil pago. Um lead pago que espera seis horas por resposta é um lead pago perdido.

**Correção:** Definir hoje: horário de atendimento publicado, mensagem de saudação automática do app WhatsApp Business que já reconhece a CVS-3 e faz a primeira pergunta de qualificação, mensagem de ausência com o link do chat do fontesan.online para quem chega fora de hora, e meta de primeira resposta em até 1h no horário comercial. Se ninguém consegue garantir isso, reduzir o orçamento diário de mídia até o volume que cabe na capacidade de resposta — vale mais gastar R$20/dia e responder em 10 minutos do que R$40/dia e responder amanhã.

### [SERIO] Não existe plano B se a CVS-3/2026 for adiada, retificada ou alterada. Adiamento de norma é evento comum e a própria pesquisa do documento registra um caso rigorosamente análogo: o CFN prorrogou a vigência do próprio código de ética em 180 dias. Se o CVS/SP publicar um adiamento no fim de setembro, com verba comprometida, criativos datados, e-mails enviados e uma aula agendada com sindicato em cima do prazo, o eixo inteiro da campanha evapora no ar — e pior, a Fontesan terá afirmado por escrito a centenas de terceiros uma data que deixou de valer. O plano trata isso apenas como 'verificar o texto oficial antes de publicar', que resolve a checagem inicial e não o risco de mudança em pleno voo.

**Correção:** Três medidas baratas: (1) baixar e arquivar o texto oficial no repositório até 26/08 e checar se há consulta pública, retificação ou pedido de prorrogação em andamento; (2) redigir toda peça de forma que sobreviva ao adiamento — falar da obrigação concreta ('exame anual do manipulador', 'curso de 8h com comprovação nominal') com a data como informação secundária, não como manchete única; (3) checagem semanal do DOE-SP durante a campanha, com regra pré-combinada: se houver adiamento, pausar mídia em 24h e trocar para o ângulo 'o prazo mudou, a exigência não'.
