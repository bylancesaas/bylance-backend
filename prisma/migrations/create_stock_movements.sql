CREATE TABLE IF NOT EXISTS stock_movements (
  id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  type TEXT NOT NULL,
  entry_type TEXT,
  quantity INTEGER NOT NULL,
  unit_cost DOUBLE PRECISION,
  supplier TEXT,
  document TEXT,
  notes TEXT,
  movement_date TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  previous_quantity INTEGER NOT NULL,
  resulting_quantity INTEGER NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT stock_movements_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS stock_movements_tenant_item_date_idx
  ON stock_movements (tenant_id, item_id, movement_date);

ALTER TABLE stock_movements
  DROP CONSTRAINT IF EXISTS stock_movements_tenant_id_fkey;
ALTER TABLE stock_movements
  ADD CONSTRAINT stock_movements_tenant_id_fkey
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE stock_movements
  DROP CONSTRAINT IF EXISTS stock_movements_item_id_fkey;
ALTER TABLE stock_movements
  ADD CONSTRAINT stock_movements_item_id_fkey
  FOREIGN KEY (item_id) REFERENCES items(id)
  ON DELETE CASCADE ON UPDATE CASCADE;
