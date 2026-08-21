-- Migration 020 - Fontesan Leads
--
-- Public contact-form leads from the separate Fontesan static site
-- (POST /web/fontesan/leads). Deliberately not domain-scoped: this table has
-- no FK to domains, it is a plain lead inbox shared by this backend the way
-- feedback already is.

CREATE TABLE fontesan_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo_negocio TEXT NOT NULL,
  telefone TEXT NOT NULL,
  mensagem TEXT,
  redaction_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_fontesan_leads_created_at ON fontesan_leads(created_at DESC);
