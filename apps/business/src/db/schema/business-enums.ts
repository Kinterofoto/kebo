import { pgEnum } from "drizzle-orm/pg-core"

// Organization member roles
export const orgMemberRoleEnum = pgEnum("org_member_role", [
  "owner",
  "admin",
  "accountant",
  "viewer",
])

// Company size classification
export const companySizeEnum = pgEnum("company_size", [
  "micro",
  "small",
  "medium",
  "large",
])

// Invoice direction
export const invoiceDirectionEnum = pgEnum("invoice_direction", [
  "emitted",
  "received",
])

// Invoice type
export const invoiceTypeEnum = pgEnum("invoice_type", [
  "factura",
  "nota_credito",
  "nota_debito",
  "factura_exportacion",
])

// Invoice status
export const invoiceStatusEnum = pgEnum("invoice_status", [
  "pending",
  "approved",
  "rejected",
  "processing",
])

// DIAN sync status
export const dianSyncStatusEnum = pgEnum("dian_sync_status", [
  "synced",
  "pending",
  "error",
])

// Accounting provider
export const accountingProviderEnum = pgEnum("accounting_provider", [
  "siigo",
  "alegra",
  "world_office",
])

// Accounting connection status
export const accountingConnectionStatusEnum = pgEnum(
  "accounting_connection_status",
  ["active", "disconnected", "error"],
)

// Accounting entry type
export const accountingEntryTypeEnum = pgEnum("accounting_entry_type", [
  "causacion",
  "pago",
  "ajuste",
])

// Accounting entry status
export const accountingEntryStatusEnum = pgEnum("accounting_entry_status", [
  "draft",
  "synced",
  "error",
  "skipped",
])
