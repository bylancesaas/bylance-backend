-- ============================================================
-- Bylance – Seed inicial para Supabase
-- Cole este SQL no: Supabase Dashboard → SQL Editor → New query
-- EXECUTE APÓS o supabase-schema.sql
-- ============================================================

-- IDs fixos para referência cruzada
DO $$
DECLARE
  v_admin_id TEXT := gen_random_uuid()::TEXT;
  v_tenant_id TEXT := gen_random_uuid()::TEXT;
  v_director_id TEXT := gen_random_uuid()::TEXT;
  v_mod TEXT;
  v_mod_list TEXT[] := ARRAY['dashboard','clients','items','services','serviceOrders','warranties','financial','userManagement'];
BEGIN

  -- Super Admin (sem tenant)
  INSERT INTO "users" ("id","name","email","password","role","active","tenant_id","created_at","updated_at")
  VALUES (
    v_admin_id,
    'Super Admin',
    'admin@scale.com',
    '$2a$12$G9Z8eT1AMa/Yl7kxiIN2pO96JMrG1e/3DhDlAIxFPuJtpavs6J3oG',
    'super_admin',
    true,
    NULL,
    NOW(), NOW()
  )
  ON CONFLICT ("email") DO NOTHING;

  -- Tenant Demo
  INSERT INTO "tenants" ("id","name","slug","primary_color","secondary_color","business_type","active","plan","created_at","updated_at")
  VALUES (
    v_tenant_id,
    'Empresa Demo',
    'demo',
    '#1e40af',
    '#3b82f6',
    'refrigeracao',
    true,
    'premium',
    NOW(), NOW()
  )
  ON CONFLICT ("slug") DO NOTHING;

  -- Resolve o ID real do tenant (caso já existisse)
  SELECT "id" INTO v_tenant_id FROM "tenants" WHERE "slug" = 'demo';

  -- Módulos do tenant demo
  FOREACH v_mod IN ARRAY v_mod_list LOOP
    INSERT INTO "tenant_modules" ("id","tenant_id","module","active")
    VALUES (gen_random_uuid()::TEXT, v_tenant_id, v_mod, true)
    ON CONFLICT ("tenant_id","module") DO NOTHING;
  END LOOP;

  -- Diretor do tenant demo
  INSERT INTO "users" ("id","name","email","password","role","active","tenant_id","created_at","updated_at")
  VALUES (
    v_director_id,
    'Diretor Demo',
    'diretor@demo.com',
    '$2a$12$xPam3O/nke3hm7OtqCXoQuyz9IBIsBVFne6y3EuwjlsBBfTgxolb.',
    'director',
    true,
    v_tenant_id,
    NOW(), NOW()
  )
  ON CONFLICT ("email") DO NOTHING;

END $$;

-- Confirma o que foi criado
SELECT 'users' as tabela, count(*) as registros FROM "users"
UNION ALL
SELECT 'tenants', count(*) FROM "tenants"
UNION ALL
SELECT 'tenant_modules', count(*) FROM "tenant_modules";
