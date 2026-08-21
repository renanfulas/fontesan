# Deploy via Git (VPS puxando direto do GitHub)

> **Status: aplicado em 2026-08-21.** `https://fontesan.com.br` está no ar seguindo
> exatamente este guia (VPS HostGator, commit `2774b39`). Backend rodando como
> serviço systemd `fontesan-backend`, banco `fontesan_prod`. Este documento
> descreve tanto o passo a passo quanto o estado real do servidor — use-o
> também como referência de "como foi montado" na próxima manutenção.

Guia para a VPS clonar e atualizar o site (e depois o backend) direto de
`github.com/renanfulas/fontesan`, sem passar arquivo por `rsync`/`scp`.

**Eu não tenho acesso à VPS.** Todo comando abaixo é para rodar por SSH, na
própria VPS, por quem administra ela.

## Por que uma chave de deploy

O repositório vai ficar **privado** em breve. Depois disso, `git clone`
anônimo para de funcionar: a VPS precisa de uma credencial. A forma certa é
uma **chave de deploy** (deploy key): uma chave SSH gerada só para isso, com
permissão de **leitura**, vinculada só a este repositório. Ela nunca sai da
VPS, e mesmo se vazasse, não dá acesso a mais nada da sua conta GitHub.

Não use sua chave SSH pessoal nem um token de acesso pessoal (PAT) para isso:
os dois têm alcance maior que o necessário.

## Passo 1 — gerar a chave, na VPS

```bash
ssh-keygen -t ed25519 -C "fontesan-deploy" -f ~/.ssh/fontesan_deploy -N ""
cat ~/.ssh/fontesan_deploy.pub
```

Copie a saída do `cat` (começa com `ssh-ed25519`).

## Passo 2 — adicionar a chave pública no GitHub

No repositório, **Settings → Deploy keys → Add deploy key**:

- Title: `VPS HostGator (fontesan.com.br)`
- Key: cole a chave pública do passo 1
- **Não marque** "Allow write access" — leitura basta para um deploy que só puxa código

## Passo 3 — ensinar o SSH da VPS a usar essa chave para este repositório

```bash
cat >> ~/.ssh/config <<'EOF'
Host github-fontesan
  HostName github.com
  User git
  IdentityFile ~/.ssh/fontesan_deploy
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
```

Testar (a primeira vez pede para confirmar a fingerprint do GitHub, responda `yes`):

```bash
ssh -T github-fontesan
# esperado: "Hi renanfulas/fontesan! You've successfully authenticated..."
```

## Passo 4 — clonar

```bash
sudo mkdir -p /var/www/fontesan
sudo chown $USER:$USER /var/www/fontesan
git clone github-fontesan:renanfulas/fontesan.git /var/www/fontesan
```

O site fica em `/var/www/fontesan/site` — é esse o caminho que o
[`nginx-fontesan.conf.example`](nginx-fontesan.conf.example) já usa como `root`.

## Passo 5 — Nginx, migration, `.env`

Siga o checklist em [`nginx-fontesan.conf.example`](nginx-fontesan.conf.example)
a partir do passo 2 (aplicar a migration do backend, configurar o `.env`,
aplicar a config do Nginx, emitir o certificado HTTPS, testar com `curl`).

## Atualizar o site depois de qualquer mudança

```bash
cd /var/www/fontesan
git pull
```

Arquivo estático, sem build step: `git pull` já é o deploy inteiro. Nada para
reiniciar no Nginx (a menos que a própria config do Nginx tenha mudado, aí sim
`sudo nginx -t && sudo systemctl reload nginx`).

Se o `backend/` mudar (rota nova, migration nova), depois do `git pull`
também é preciso, dentro de `backend/`, com o venv ativo e o `.env` carregado
(`set -a && source .env && set +a`):

```bash
./.venv/bin/python -m pip install -e ".[dev]"     # se pyproject.toml mudou
./.venv/bin/python -m scripts.migrate apply       # se houver migration nova
systemctl restart fontesan-backend                # sempre, para carregar o código novo
```

## Referência do que já está montado na VPS

- Serviço: `systemctl status fontesan-backend` (unit em
  `/etc/systemd/system/fontesan-backend.service`, roda
  `uvicorn app.main:app --host 127.0.0.1 --port 8000` como `root`,
  `Restart=on-failure`, habilitado no boot).
- Banco: PostgreSQL 14 nativo (sem Docker), banco `fontesan_prod`, role
  `fontesan_app` (senha só em `/root/.fontesan_dbpass` na própria VPS).
  Extensão `vector` **compilada do código-fonte** (`pgvector` v0.7.4): não
  existe pacote apt pronto para PG14 no Ubuntu 22.04. `vector`/`pgcrypto`
  foram criadas via `sudo -u postgres psql -d fontesan_prod -c 'CREATE
  EXTENSION ...'` antes da migration 001, porque criar extensão exige
  superusuário e o app não é superusuário.
- Segredos: `backend/.env` (chmod 600) com `API_SECRET_KEY` e
  `PERSISTENCE_HASH_SECRET` gerados via `openssl rand -hex 32`.
- Exposição: Postgres e o backend só escutam em `127.0.0.1` (confirmar com
  `ss -tlnp`); só Nginx (80/443) e SSH ficam públicos. `ufw` está inativo —
  considerar habilitar (`ufw allow 22022,80,443 && ufw enable`, nessa ordem,
  para não travar o próprio acesso SSH).
- Logs do backend: `journalctl -u fontesan-backend -f`.

## fontesan.online (mais adiante)

Quando o supportfaqagent for exposto em `https://fontesan.online`, o mesmo
clone em `/var/www/fontesan` já serve: o backend mora em
`/var/www/fontesan/backend`. Só falta um novo `server {}` no Nginx para esse
domínio, apontando para o mesmo `127.0.0.1:8000`, e o próprio certificado
HTTPS dele. Ainda não escrito aqui de propósito: sem CORS configurado no
backend, decidir se `fontesan.online` serve alguma UI própria (e portanto
precisa de CORS liberado para `fontesan.com.br` chamar `POST
/web/fontesan/leads` de um domínio diferente) ou só expõe a API para uso
servidor-servidor muda a config. Revisar quando chegar a hora.
