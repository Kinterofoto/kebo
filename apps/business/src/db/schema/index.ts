import { relations } from "drizzle-orm"

// Export all schemas
export * from "./business-enums"
export * from "./organizations"
export * from "./dian-invoices"
export * from "./accounting"

// Import for relations
import {
  accountingConnections,
  accountingEntries,
} from "./accounting"
import { dianInvoices, dianInvoiceLines } from "./dian-invoices"
import { organizations, organizationMembers } from "./organizations"

// Business relations
export const organizationsRelations = relations(
  organizations,
  ({ many }) => ({
    members: many(organizationMembers),
    dianInvoices: many(dianInvoices),
    accountingConnections: many(accountingConnections),
    accountingEntries: many(accountingEntries),
  }),
)

export const organizationMembersRelations = relations(
  organizationMembers,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [organizationMembers.organization_id],
      references: [organizations.id],
    }),
  }),
)

export const dianInvoicesRelations = relations(
  dianInvoices,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [dianInvoices.organization_id],
      references: [organizations.id],
    }),
    lines: many(dianInvoiceLines),
    accountingEntries: many(accountingEntries),
  }),
)

export const dianInvoiceLinesRelations = relations(
  dianInvoiceLines,
  ({ one }) => ({
    invoice: one(dianInvoices, {
      fields: [dianInvoiceLines.invoice_id],
      references: [dianInvoices.id],
    }),
  }),
)

export const accountingConnectionsRelations = relations(
  accountingConnections,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [accountingConnections.organization_id],
      references: [organizations.id],
    }),
  }),
)

export const accountingEntriesRelations = relations(
  accountingEntries,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [accountingEntries.organization_id],
      references: [organizations.id],
    }),
    invoice: one(dianInvoices, {
      fields: [accountingEntries.invoice_id],
      references: [dianInvoices.id],
    }),
  }),
)
