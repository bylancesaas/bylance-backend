-- Migration: add_tenant_onboarding_fields
-- Run this SQL in the Supabase SQL Editor (https://app.supabase.com → SQL Editor)

ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS razao_social          TEXT,
  ADD COLUMN IF NOT EXISTS cnpj                  TEXT,
  ADD COLUMN IF NOT EXISTS inscricao_estadual    TEXT,
  ADD COLUMN IF NOT EXISTS inscricao_municipal   TEXT,
  ADD COLUMN IF NOT EXISTS porte                 TEXT,
  ADD COLUMN IF NOT EXISTS site                  TEXT,
  ADD COLUMN IF NOT EXISTS telefone              TEXT,
  ADD COLUMN IF NOT EXISTS cep                   TEXT,
  ADD COLUMN IF NOT EXISTS logradouro            TEXT,
  ADD COLUMN IF NOT EXISTS numero                TEXT,
  ADD COLUMN IF NOT EXISTS complemento           TEXT,
  ADD COLUMN IF NOT EXISTS bairro                TEXT,
  ADD COLUMN IF NOT EXISTS cidade                TEXT,
  ADD COLUMN IF NOT EXISTS estado                TEXT,
  ADD COLUMN IF NOT EXISTS responsavel_nome      TEXT,
  ADD COLUMN IF NOT EXISTS responsavel_email     TEXT,
  ADD COLUMN IF NOT EXISTS responsavel_telefone  TEXT,
  ADD COLUMN IF NOT EXISTS responsavel_cargo     TEXT,
  ADD COLUMN IF NOT EXISTS plan_status           TEXT NOT NULL DEFAULT 'ativo',
  ADD COLUMN IF NOT EXISTS plan_value            DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS plan_billing_type     TEXT,
  ADD COLUMN IF NOT EXISTS plan_start_date       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS plan_end_date         TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS plan_notes            TEXT,
  ADD COLUMN IF NOT EXISTS max_users             INTEGER NOT NULL DEFAULT 10;

-- Phase 5: Onboarding status, contract tracking, LGPD compliance
ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS onboarding_status       TEXT NOT NULL DEFAULT 'pendente',
  ADD COLUMN IF NOT EXISTS deleted_at              TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS contract_status         TEXT NOT NULL DEFAULT 'nao_gerado',
  ADD COLUMN IF NOT EXISTS contract_generated_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS contract_sent_at        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS contract_sent_to        TEXT,
  ADD COLUMN IF NOT EXISTS contract_signed_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS contract_signed_by      TEXT,
  ADD COLUMN IF NOT EXISTS contract_file_url       TEXT,
  ADD COLUMN IF NOT EXISTS contract_notes          TEXT;

-- Audit log table for full traceability (LGPD Art. 37)
CREATE TABLE IF NOT EXISTS tenant_audit_logs (
  id            TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  tenant_id     TEXT        NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  action        TEXT        NOT NULL,
  category      TEXT        NOT NULL DEFAULT 'geral',
  description   TEXT        NOT NULL,
  performed_by  TEXT        NOT NULL,
  performed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  meta          TEXT
);

CREATE INDEX IF NOT EXISTS idx_tenant_audit_logs_tenant_id ON tenant_audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_audit_logs_performed_at ON tenant_audit_logs(performed_at DESC);

-- Soft-delete index for fast active-tenant queries
CREATE INDEX IF NOT EXISTS idx_tenants_deleted_at ON tenants(deleted_at) WHERE deleted_at IS NULL;
