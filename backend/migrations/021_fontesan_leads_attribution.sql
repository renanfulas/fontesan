-- Migration 021 - Atribuicao, consentimento e lista de supressao da Fontesan
--
-- Onda 0 do plano de aquisicao (branding/automacao-marketing-vendas.md):
-- ate aqui, fontesan_leads nao tinha nenhuma coluna de origem, o que torna
-- qualquer campanha paga ou organica impossivel de medir. Tambem cobre o
-- consentimento explicito exigido para contato subsequente e a lista de
-- supressao que toda campanha de e-mail/outbound futura (Onda 2) precisa
-- consultar antes de qualquer envio.
--
-- Todas as colunas novas sao opcionais: linhas existentes e submissoes do
-- formulario ainda nao atualizado no site continuam funcionando sem elas,
-- igual ao padrao ja usado por mensagem/site em fontesan_leads.

ALTER TABLE fontesan_leads
  ADD COLUMN consent_text TEXT,
  ADD COLUMN consent_at TIMESTAMPTZ,
  ADD COLUMN consent_ip INET,
  ADD COLUMN origem TEXT,
  ADD COLUMN origem_url TEXT,
  ADD COLUMN utm_source TEXT,
  ADD COLUMN utm_medium TEXT,
  ADD COLUMN utm_campaign TEXT,
  ADD COLUMN utm_term TEXT,
  ADD COLUMN utm_content TEXT,
  ADD COLUMN gclid TEXT,
  ADD COLUMN gbraid TEXT,
  ADD COLUMN wbraid TEXT,
  ADD COLUMN fbclid TEXT,
  ADD COLUMN fbp TEXT,
  ADD COLUMN fbc TEXT,
  ADD COLUMN landing_path TEXT,
  ADD COLUMN referrer TEXT,
  ADD COLUMN partner_slug TEXT,
  ADD COLUMN status TEXT NOT NULL DEFAULT 'novo',
  ADD COLUMN payload JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE fontesan_leads
  ADD CONSTRAINT fontesan_leads_status_check
  CHECK (status IN ('novo', 'contatado', 'diagnostico_agendado', 'proposta', 'cliente', 'perdido'));

-- Painel de leads (fontesan_leads_admin) e futura triagem: filtrar por
-- estagio do funil e por origem sem table scan.
CREATE INDEX idx_fontesan_leads_status ON fontesan_leads(status);
CREATE INDEX idx_fontesan_leads_origem ON fontesan_leads(origem) WHERE origem IS NOT NULL;
CREATE INDEX idx_fontesan_leads_utm_campaign ON fontesan_leads(utm_campaign) WHERE utm_campaign IS NOT NULL;

-- Lista de supressao: contato (e-mail ou telefone) que nao deve mais receber
-- outbound (opt-out, bounce, reclamacao, ou importado do Nao Me Ligue/Procon-SP).
-- Guarda so o HASH HMAC deterministico (mesma funcao de
-- app/core/privacy.py:hash_sensitive_value, PERSISTENCE_HASH_SECRET), nunca o
-- contato em claro -- consistente com o padrao de wa_id_hash em
-- case_whatsapp_bindings (migration 016).
CREATE TABLE suppression_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_type TEXT NOT NULL CHECK (contact_type IN ('email', 'phone')),
  contact_hash TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (
    reason IN ('opt_out', 'bounce', 'complaint', 'nao_me_ligue', 'manual')
  ),
  source TEXT,
  suppressed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT suppression_list_contact_unique UNIQUE (contact_type, contact_hash)
);

-- Toda funcao de envio futura (Onda 2: e-mail, WhatsApp) chama esta funcao
-- ANTES de enfileirar. SECURITY DEFINER nao e necessario (mesma role da app);
-- IMMUTABLE nao se aplica (consulta tabela). STABLE porque o resultado so
-- muda quando a tabela muda, nao a cada chamada dentro da mesma transacao.
CREATE OR REPLACE FUNCTION is_suppressed(p_contact_type TEXT, p_contact_hash TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM suppression_list
    WHERE contact_type = p_contact_type AND contact_hash = p_contact_hash
  );
$$ LANGUAGE sql STABLE;

CREATE INDEX idx_suppression_list_lookup ON suppression_list(contact_type, contact_hash);
