export enum InvoiceDirection {
  Emitted = "emitted",
  Received = "received",
}

export enum InvoiceType {
  Factura = "factura",
  NotaCredito = "nota_credito",
  NotaDebito = "nota_debito",
  FacturaExportacion = "factura_exportacion",
}

export enum InvoiceStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
  Processing = "processing",
}

export enum DianSyncStatus {
  Synced = "synced",
  Pending = "pending",
  Error = "error",
}

export interface DianInvoice {
  id: string;
  organization_id: string;
  cufe: string;
  invoice_number: string;
  prefix: string | null;
  direction: InvoiceDirection;
  invoice_type: InvoiceType;
  status: InvoiceStatus;
  issuer_nit: string;
  issuer_name: string;
  receiver_nit: string;
  receiver_name: string;
  issue_date: string;
  due_date: string | null;
  subtotal: string;
  tax_total: string;
  total: string;
  currency: string;
  xml_url: string | null;
  pdf_url: string | null;
  parsed_data: Record<string, unknown> | null;
  dian_sync_status: DianSyncStatus;
  dian_synced_at: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
}

export interface DianInvoiceLine {
  id: string;
  invoice_id: string;
  line_number: number;
  description: string;
  quantity: string;
  unit_price: string;
  tax_amount: string;
  tax_percentage: string;
  line_total: string;
  product_code: string | null;
  created_at: string;
}
