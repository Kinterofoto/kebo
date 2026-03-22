-- Migration: Add Kebo for Business tables
-- Date: 2026-03-21

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE org_member_role AS ENUM ('owner', 'admin', 'accountant', 'viewer');
CREATE TYPE company_size AS ENUM ('micro', 'small', 'medium', 'large');
CREATE TYPE invoice_direction AS ENUM ('emitted', 'received');
CREATE TYPE invoice_type AS ENUM ('factura', 'nota_credito', 'nota_debito', 'factura_exportacion');
CREATE TYPE invoice_status AS ENUM ('pending', 'approved', 'rejected', 'processing');
CREATE TYPE dian_sync_status AS ENUM ('synced', 'pending', 'error');
CREATE TYPE accounting_provider AS ENUM ('siigo', 'alegra', 'world_office');
CREATE TYPE accounting_connection_status AS ENUM ('active', 'disconnected', 'error');
CREATE TYPE accounting_entry_type AS ENUM ('causacion', 'pago', 'ajuste');
CREATE TYPE accounting_entry_status AS ENUM ('draft', 'synced', 'error', 'skipped');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Organizations
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  nit varchar(20) NOT NULL,
  dv varchar(1),
  legal_name varchar(500),
  company_size company_size,
  industry varchar(100),
  address text,
  city varchar(100),
  department varchar(100),
  phone varchar(50),
  email varchar(255),
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false,
  deleted_at timestamptz
);

-- Organization Members
CREATE TABLE organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  role org_member_role NOT NULL DEFAULT 'viewer',
  invited_email varchar(255),
  invited_at timestamptz,
  accepted_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false,
  deleted_at timestamptz,
  UNIQUE(organization_id, user_id)
);

-- DIAN Invoices
CREATE TABLE dian_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  cufe varchar(255) UNIQUE,
  invoice_number varchar(50),
  prefix varchar(10),
  direction invoice_direction NOT NULL,
  invoice_type invoice_type NOT NULL DEFAULT 'factura',
  status invoice_status NOT NULL DEFAULT 'pending',
  issuer_nit varchar(20) NOT NULL,
  issuer_name varchar(500) NOT NULL,
  receiver_nit varchar(20) NOT NULL,
  receiver_name varchar(500) NOT NULL,
  issue_date timestamptz NOT NULL,
  due_date timestamptz,
  subtotal numeric(18,2) NOT NULL DEFAULT 0,
  tax_total numeric(18,2) NOT NULL DEFAULT 0,
  total numeric(18,2) NOT NULL DEFAULT 0,
  currency varchar(3) NOT NULL DEFAULT 'COP',
  xml_url text,
  pdf_url text,
  raw_xml text,
  parsed_data jsonb,
  dian_sync_status dian_sync_status NOT NULL DEFAULT 'pending',
  dian_synced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false,
  deleted_at timestamptz
);

-- DIAN Invoice Lines
CREATE TABLE dian_invoice_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES dian_invoices(id) ON DELETE CASCADE,
  line_number integer NOT NULL,
  description varchar(1000),
  quantity numeric(12,4) NOT NULL DEFAULT 0,
  unit_price numeric(18,2) NOT NULL DEFAULT 0,
  tax_amount numeric(18,2) NOT NULL DEFAULT 0,
  tax_percentage numeric(5,2) NOT NULL DEFAULT 0,
  line_total numeric(18,2) NOT NULL DEFAULT 0,
  product_code varchar(50),
  created_at timestamptz DEFAULT now()
);

-- Accounting Connections
CREATE TABLE accounting_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  provider accounting_provider NOT NULL,
  credentials jsonb,
  status accounting_connection_status NOT NULL DEFAULT 'disconnected',
  last_sync_at timestamptz,
  sync_config jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false,
  deleted_at timestamptz,
  UNIQUE(organization_id, provider)
);

-- Accounting Entries
CREATE TABLE accounting_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  invoice_id uuid REFERENCES dian_invoices(id),
  provider accounting_provider NOT NULL,
  external_id varchar(255),
  entry_type accounting_entry_type NOT NULL DEFAULT 'causacion',
  status accounting_entry_status NOT NULL DEFAULT 'draft',
  debit_account varchar(20),
  credit_account varchar(20),
  amount numeric(18,2) NOT NULL DEFAULT 0,
  description text,
  sync_error text,
  synced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false,
  deleted_at timestamptz
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_organization_members_org_user ON organization_members(organization_id, user_id);
CREATE INDEX idx_dian_invoices_org_direction ON dian_invoices(organization_id, direction);
CREATE INDEX idx_dian_invoices_org_issue_date ON dian_invoices(organization_id, issue_date);
CREATE INDEX idx_dian_invoices_cufe ON dian_invoices(cufe);
CREATE INDEX idx_accounting_entries_org_invoice ON accounting_entries(organization_id, invoice_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE dian_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE dian_invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_entries ENABLE ROW LEVEL SECURITY;

-- Helper: check if user is a member of an organization
CREATE OR REPLACE FUNCTION is_org_member(org_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM organization_members
    WHERE organization_id = org_id
      AND user_id = auth.uid()
      AND is_active = true
      AND is_deleted = false
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Organizations: members can SELECT, owners/admins can INSERT/UPDATE
CREATE POLICY "org_select" ON organizations
  FOR SELECT TO authenticated
  USING (is_org_member(id));

CREATE POLICY "org_insert" ON organizations
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "org_update" ON organizations
  FOR UPDATE TO authenticated
  USING (is_org_member(id));

CREATE POLICY "org_delete" ON organizations
  FOR DELETE TO authenticated
  USING (is_org_member(id));

-- Organization Members: members can see co-members, manage their own membership
CREATE POLICY "org_members_select" ON organization_members
  FOR SELECT TO authenticated
  USING (is_org_member(organization_id));

CREATE POLICY "org_members_insert" ON organization_members
  FOR INSERT TO authenticated
  WITH CHECK (is_org_member(organization_id) OR user_id = auth.uid());

CREATE POLICY "org_members_update" ON organization_members
  FOR UPDATE TO authenticated
  USING (is_org_member(organization_id));

CREATE POLICY "org_members_delete" ON organization_members
  FOR DELETE TO authenticated
  USING (is_org_member(organization_id));

-- DIAN Invoices: org members can access
CREATE POLICY "dian_invoices_select" ON dian_invoices
  FOR SELECT TO authenticated
  USING (is_org_member(organization_id));

CREATE POLICY "dian_invoices_insert" ON dian_invoices
  FOR INSERT TO authenticated
  WITH CHECK (is_org_member(organization_id));

CREATE POLICY "dian_invoices_update" ON dian_invoices
  FOR UPDATE TO authenticated
  USING (is_org_member(organization_id));

CREATE POLICY "dian_invoices_delete" ON dian_invoices
  FOR DELETE TO authenticated
  USING (is_org_member(organization_id));

-- DIAN Invoice Lines: access through parent invoice's org membership
CREATE POLICY "dian_invoice_lines_select" ON dian_invoice_lines
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM dian_invoices
    WHERE dian_invoices.id = dian_invoice_lines.invoice_id
      AND is_org_member(dian_invoices.organization_id)
  ));

CREATE POLICY "dian_invoice_lines_insert" ON dian_invoice_lines
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM dian_invoices
    WHERE dian_invoices.id = dian_invoice_lines.invoice_id
      AND is_org_member(dian_invoices.organization_id)
  ));

CREATE POLICY "dian_invoice_lines_update" ON dian_invoice_lines
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM dian_invoices
    WHERE dian_invoices.id = dian_invoice_lines.invoice_id
      AND is_org_member(dian_invoices.organization_id)
  ));

CREATE POLICY "dian_invoice_lines_delete" ON dian_invoice_lines
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM dian_invoices
    WHERE dian_invoices.id = dian_invoice_lines.invoice_id
      AND is_org_member(dian_invoices.organization_id)
  ));

-- Accounting Connections: org members can access
CREATE POLICY "accounting_connections_select" ON accounting_connections
  FOR SELECT TO authenticated
  USING (is_org_member(organization_id));

CREATE POLICY "accounting_connections_insert" ON accounting_connections
  FOR INSERT TO authenticated
  WITH CHECK (is_org_member(organization_id));

CREATE POLICY "accounting_connections_update" ON accounting_connections
  FOR UPDATE TO authenticated
  USING (is_org_member(organization_id));

CREATE POLICY "accounting_connections_delete" ON accounting_connections
  FOR DELETE TO authenticated
  USING (is_org_member(organization_id));

-- Accounting Entries: org members can access
CREATE POLICY "accounting_entries_select" ON accounting_entries
  FOR SELECT TO authenticated
  USING (is_org_member(organization_id));

CREATE POLICY "accounting_entries_insert" ON accounting_entries
  FOR INSERT TO authenticated
  WITH CHECK (is_org_member(organization_id));

CREATE POLICY "accounting_entries_update" ON accounting_entries
  FOR UPDATE TO authenticated
  USING (is_org_member(organization_id));

CREATE POLICY "accounting_entries_delete" ON accounting_entries
  FOR DELETE TO authenticated
  USING (is_org_member(organization_id));

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_organizations
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_organization_members
  BEFORE UPDATE ON organization_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_dian_invoices
  BEFORE UPDATE ON dian_invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_accounting_connections
  BEFORE UPDATE ON accounting_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_accounting_entries
  BEFORE UPDATE ON accounting_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
