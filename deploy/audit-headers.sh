#!/usr/bin/env bash
# deploy/audit-headers.sh — 30 segundos. Roda de qualquer máquina, não precisa de VPS.
#
# POR QUE ESTE ARQUIVO EXISTE: nginx-fontesan.conf.example declara na própria
# linha 2 que NÃO foi aplicado, e deploy-via-git.md registra que o servidor foi
# montado com certbot, que reescreveu a config viva. Ou seja: ninguém sabe o que
# a produção realmente devolve. Editar Nginx antes de medir é trabalhar às cegas.
#
# Uso:  bash deploy/audit-headers.sh
set -u

URLS=(
  "http://fontesan.com.br/"
  "http://www.fontesan.com.br/"
  "https://www.fontesan.com.br/"
  "https://fontesan.com.br/"
  "https://fontesan.com.br/robots.txt"
  "https://fontesan.com.br/sitemap.xml"
  "https://fontesan.com.br/assets/cap1-limoes-poster.jpg"
)

for u in "${URLS[@]}"; do
  echo "===== $u"
  curl -sS -o /dev/null -D - --max-time 10 \
       -H 'Accept-Encoding: gzip' \
       -A 'Mozilla/5.0 (perf-audit fontesan)' "$u" \
    | grep -iE '^(HTTP/|location:|content-encoding:|content-type:|content-length:|cache-control:|vary:|strict-transport-security:|x-robots-tag:)' \
    || echo '  (sem resposta)'
  echo
done

echo '===== Tamanho do HTML da home como ele chega na rede'
bytes=$(curl -sS -H 'Accept-Encoding: gzip' https://fontesan.com.br/ --output - | wc -c)
echo "  $bytes bytes"
echo '  referência: 56182 bytes cru · ~16000 bytes se o gzip estiver ligado'

cat <<'LEITURA'

===== COMO LER
  Content-Encoding: gzip AUSENTE na home      -> ligar gzip no Nginx
  http:// respondendo 200 em vez de 301       -> falta o redirect para HTTPS
  https://www respondendo 200 em vez de 301   -> falta o server block de www -> apex
  Cache-Control ausente no HTML               -> adicionar must-revalidate
  Strict-Transport-Security ausente           -> esperado por ora; só ligar depois
                                                 de confirmar que o certbot renova
  robots.txt / sitemap.xml em 404             -> esperado hoje; deixam de estar
                                                 no commit que publica a 1a página

Anotar a saída (com a data) no topo de deploy/nginx-fontesan.conf.example.
Sem esse registro, toda edição de Nginx é feita no escuro.
LEITURA
