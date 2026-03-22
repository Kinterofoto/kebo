export enum AccountingProvider {
  Siigo = "siigo",
  Alegra = "alegra",
  WorldOffice = "world_office",
}

export enum AccountingConnectionStatus {
  Active = "active",
  Disconnected = "disconnected",
  Error = "error",
}

export enum AccountingEntryType {
  Causacion = "causacion",
  Pago = "pago",
  Ajuste = "ajuste",
}

export enum AccountingEntryStatus {
  Draft = "draft",
  Synced = "synced",
  Error = "error",
  Skipped = "skipped",
}

export interface AccountingConnection {
  id: string;
  organization_id: string;
  provider: AccountingProvider;
  status: AccountingConnectionStatus;
  last_sync_at: string | null;
  sync_config: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
}

export interface AccountingEntry {
  id: string;
  organization_id: string;
  invoice_id: string | null;
  provider: AccountingProvider;
  external_id: string | null;
  entry_type: AccountingEntryType;
  status: AccountingEntryStatus;
  debit_account: string;
  credit_account: string;
  amount: string;
  description: string | null;
  sync_error: string | null;
  synced_at: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
}

export interface PUCAccount {
  code: string;
  name: string;
  level: number;
  type: "asset" | "liability" | "equity" | "revenue" | "expense";
}
