# Bridge WhatsApp da Fontesan (Hermes/Baileys)

Canal **não-oficial** (WhatsApp Web automatizado via Baileys) para conectar o
número real da Fontesan, **(11) 94781-1422**, ao domínio `fontesan` do backend
supportfaqagent. Risco aceito conscientemente: automação não-oficial pode
levar o WhatsApp a banir o número. Ver `docs/quality-plans/hermes-chat-bridge-plan.md`
e `docs/runbooks/hermes-chat-cutover.md` no `backend/` para o histórico desse
mesmo padrão em outro projeto.

## O que este bridge faz

- Mantém uma sessão WhatsApp Web pareada (QR code, uma vez só).
- Recebe mensagem de texto 1:1 (ignora grupo) e repassa (`forward`) assinada
  por HMAC para `POST /integrations/hermes/chat/webhook` no backend.
- Expõe `POST /send {chatId, message}` para o backend responder pelo mesmo
  número.
- Só escuta em `127.0.0.1` — nunca fica acessível pela internet.

## Passo a passo na VPS

1. **Instalar dependências** (Node 20 já está instalado na VPS; o código já
   chega aqui via `git pull` no mesmo checkout do site/backend):

   ```bash
   cd /var/www/fontesan/deploy/whatsapp-bridge
   npm install
   ```

2. **Gerar o segredo compartilhado** com o backend:

   ```bash
   openssl rand -hex 32
   ```

   Colar o mesmo valor em `HERMES_CHAT_FORWARD_SECRET` no `.env` do bridge
   (`/var/www/fontesan/deploy/whatsapp-bridge/.env`) **e** no `.env` do
   backend (`/var/www/fontesan/backend/.env`).

3. **Configurar o `.env` do bridge** a partir de `.env.example`. Deixar
   `WHATSAPP_ALLOWED_USERS` com só um número de teste no início (o seu, por
   exemplo) — a base de conhecimento `fontesan` ainda está em rascunho, então
   não faz sentido abrir para clientes reais antes da Giovanna revisar o
   conteúdo e configurar o provider de LLM.

4. **Configurar o backend** (`/var/www/fontesan/backend/.env`):

   ```
   ENABLE_HERMES_CHAT=true
   HERMES_BRIDGE_URL=http://127.0.0.1:3000
   HERMES_BASE_URL=http://127.0.0.1:3000
   HERMES_WEBHOOK_SECRET=<gerar com openssl rand -hex 32, valor diferente do forward secret>
   HERMES_CHAT_FORWARD_SECRET=<o mesmo valor do passo 2>
   DEFAULT_DOMAIN=fontesan
   ```

   `DEFAULT_DOMAIN` hoje está como `suporte-vps-whatsapp` (resquício da cópia
   do repositório antigo) — precisa virar `fontesan` para que toda mensagem
   recebida neste número vá para o domínio certo. Sem
   `ENABLE_WHATSAPP_DOMAIN_ROUTER=true`, o backend não mostra menu nenhum: vai
   direto para o `default_domain`, que é exatamente o comportamento certo para
   um número dedicado a um único domínio.

   Depois: `sudo systemctl restart fontesan-backend` e confirmar `/health`.

5. **Subir o serviço do bridge**:

   ```bash
   cp fontesan-whatsapp-bridge.service.example /etc/systemd/system/fontesan-whatsapp-bridge.service
   systemctl daemon-reload
   systemctl enable --now fontesan-whatsapp-bridge
   journalctl -u fontesan-whatsapp-bridge -f
   ```

6. **Parear via QR code** (passo manual, só quem tem o celular com o WhatsApp
   do (11) 94781-1422 pode fazer):

   - O QR code aparece no `journalctl` acima.
   - No celular: WhatsApp > Configurações > Aparelhos conectados > Conectar
     um aparelho > escanear o QR.
   - A sessão fica salva em `/var/www/fontesan/deploy/whatsapp-bridge/auth_state/` —
     reinícios do serviço não pedem QR de novo, só um logout manual no
     próprio celular exige repetir este passo.

7. **Smoke test** com o número de teste da allowlist: mandar "oi" pelo
   WhatsApp real e confirmar que a resposta do domínio `fontesan` chega.
   Antes disso, confira que o backend tem um provider de LLM configurado
   (`OPENAI_API_KEY`) — sem isso toda mensagem cai em erro de provider e
   escalonamento, mesmo com o bridge funcionando perfeitamente.

## Antes de abrir para clientes reais (`WHATSAPP_ALLOWED_USERS=*`)

- Giovanna já revisou o conteúdo de `backend/domains/fontesan/knowledge/`.
- `OPENAI_API_KEY` configurada e testada.
- Ingestão real no pgvector rodada (`RETRIEVAL_BACKEND=pgvector`) ou, no
  mínimo, validado que o retrieval lexical atual dá respostas aceitáveis.
- Alguém validou pelo menos os casos de `backend/domains/fontesan/evals/cases.yaml`
  contra o provider real, não só contra o mock local.

## Rollback

- Remover `HERMES_CHAT_FORWARD_URL` do `.env` do bridge (ou `ENABLE_HERMES_CHAT=false`
  no backend) + restart dos dois serviços: mensagens param de chegar ao bot,
  sem desconectar a sessão WhatsApp em si.
- Para desconectar de vez: `systemctl stop fontesan-whatsapp-bridge` e, se
  quiser reverter o pareamento, deslogar pelo próprio celular (WhatsApp >
  Aparelhos conectados > remover "Fontesan Bot").
