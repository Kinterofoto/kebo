import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import {
  dianSyncStatusEnum,
  invoiceDirectionEnum,
  invoiceStatusEnum,
  invoiceTypeEnum,
} from "./business-enums"
import { organizations } from "./organizations"

export const dianInvoices = pgTable("dian_invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  organization_id: uuid("organization_id")
    .notNull()
    .references(() => organizations.id),
  cufe: varchar("cufe", { length: 255 }).unique(),
  invoice_number: varchar("invoice_number", { length: 50 }),
  prefix: varchar("prefix", { length: 10 }),
  direction: invoiceDirectionEnum("direction").notNull(),
  invoice_type: invoiceTypeEnum("invoice_type").notNull().default("factura"),
  status: invoiceStatusEnum("status").notNull().default("pending"),
  issuer_nit: varchar("issuer_nit", { length: 20 }).notNull(),
  issuer_name: varchar("issuer_name", { length: 500 }).notNull(),
  receiver_nit: varchar("receiver_nit", { length: 20 }).notNull(),
  receiver_name: varchar("receiver_name", { length: 500 }).notNull(),
  issue_date: timestamp("issue_date", { withTimezone: true }).notNull(),
  due_date: timestamp("due_date", { withTimezone: true }),
  subtotal: numeric("subtotal", { precision: 18, scale: 2 })
    .notNull()
    .default("0"),
  tax_total: numeric("tax_total", { precision: 18, scale: 2 })
    .notNull()
    .default("0"),
  total: numeric("total", { precision: 18, scale: 2 }).notNull().default("0"),
  currency: varchar("currency", { length: 3 }).notNull().default("COP"),
  xml_url: text("xml_url"),
  pdf_url: text("pdf_url"),
  raw_xml: text("raw_xml"),
  parsed_data: jsonb("parsed_data"),
  dian_sync_status: dianSyncStatusEnum("dian_sync_status")
    .notNull()
    .default("pending"),
  dian_synced_at: timestamp("dian_synced_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  is_deleted: boolean("is_deleted").default(false),
  deleted_at: timestamp("deleted_at", { withTimezone: true }),
})

export const dianInvoiceLines = pgTable("dian_invoice_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoice_id: uuid("invoice_id")
    .notNull()
    .references(() => dianInvoices.id, { onDelete: "cascade" }),
  line_number: integer("line_number").notNull(),
  description: varchar("description", { length: 1000 }),
  quantity: numeric("quantity", { precision: 12, scale: 4 })
    .notNull()
    .default("0"),
  unit_price: numeric("unit_price", { precision: 18, scale: 2 })
    .notNull()
    .default("0"),
  tax_amount: numeric("tax_amount", { precision: 18, scale: 2 })
    .notNull()
    .default("0"),
  tax_percentage: numeric("tax_percentage", { precision: 5, scale: 2 })
    .notNull()
    .default("0"),
  line_total: numeric("line_total", { precision: 18, scale: 2 })
    .notNull()
    .default("0"),
  product_code: varchar("product_code", { length: 50 }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

export const insertDianInvoiceSchema = createInsertSchema(dianInvoices)
export const selectDianInvoiceSchema = createSelectSchema(dianInvoices)
export const insertDianInvoiceLineSchema = createInsertSchema(dianInvoiceLines)
export const selectDianInvoiceLineSchema = createSelectSchema(dianInvoiceLines)

export type DianInvoice = typeof dianInvoices.$inferSelect
export type NewDianInvoice = typeof dianInvoices.$inferInsert
export type DianInvoiceLine = typeof dianInvoiceLines.$inferSelect
export type NewDianInvoiceLine = typeof dianInvoiceLines.$inferInsert
