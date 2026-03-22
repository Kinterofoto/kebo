import {
  boolean,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import {
  accountingConnectionStatusEnum,
  accountingEntryStatusEnum,
  accountingEntryTypeEnum,
  accountingProviderEnum,
} from "./business-enums"
import { dianInvoices } from "./dian-invoices"
import { organizations } from "./organizations"

export const accountingConnections = pgTable(
  "accounting_connections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organization_id: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
    provider: accountingProviderEnum("provider").notNull(),
    credentials: jsonb("credentials"),
    status: accountingConnectionStatusEnum("status")
      .notNull()
      .default("disconnected"),
    last_sync_at: timestamp("last_sync_at", { withTimezone: true }),
    sync_config: jsonb("sync_config"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    is_deleted: boolean("is_deleted").default(false),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    uniqueOrgProvider: unique().on(table.organization_id, table.provider),
  }),
)

export const accountingEntries = pgTable("accounting_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  organization_id: uuid("organization_id")
    .notNull()
    .references(() => organizations.id),
  invoice_id: uuid("invoice_id").references(() => dianInvoices.id),
  provider: accountingProviderEnum("provider").notNull(),
  external_id: varchar("external_id", { length: 255 }),
  entry_type: accountingEntryTypeEnum("entry_type")
    .notNull()
    .default("causacion"),
  status: accountingEntryStatusEnum("status").notNull().default("draft"),
  debit_account: varchar("debit_account", { length: 20 }),
  credit_account: varchar("credit_account", { length: 20 }),
  amount: numeric("amount", { precision: 18, scale: 2 })
    .notNull()
    .default("0"),
  description: text("description"),
  sync_error: text("sync_error"),
  synced_at: timestamp("synced_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  is_deleted: boolean("is_deleted").default(false),
  deleted_at: timestamp("deleted_at", { withTimezone: true }),
})

export const insertAccountingConnectionSchema =
  createInsertSchema(accountingConnections)
export const selectAccountingConnectionSchema =
  createSelectSchema(accountingConnections)
export const insertAccountingEntrySchema = createInsertSchema(accountingEntries)
export const selectAccountingEntrySchema = createSelectSchema(accountingEntries)

export type AccountingConnection = typeof accountingConnections.$inferSelect
export type NewAccountingConnection = typeof accountingConnections.$inferInsert
export type AccountingEntry = typeof accountingEntries.$inferSelect
export type NewAccountingEntry = typeof accountingEntries.$inferInsert
