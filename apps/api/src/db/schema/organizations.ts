import {
  boolean,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { companySizeEnum, orgMemberRoleEnum } from "./business-enums"

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  nit: varchar("nit", { length: 20 }).notNull(),
  dv: varchar("dv", { length: 1 }),
  legal_name: varchar("legal_name", { length: 500 }),
  company_size: companySizeEnum("company_size"),
  industry: varchar("industry", { length: 100 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  department: varchar("department", { length: 100 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  logo_url: text("logo_url"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  is_deleted: boolean("is_deleted").default(false),
  deleted_at: timestamp("deleted_at", { withTimezone: true }),
})

export const organizationMembers = pgTable(
  "organization_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organization_id: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
    user_id: uuid("user_id").notNull(),
    role: orgMemberRoleEnum("role").notNull().default("viewer"),
    invited_email: varchar("invited_email", { length: 255 }),
    invited_at: timestamp("invited_at", { withTimezone: true }),
    accepted_at: timestamp("accepted_at", { withTimezone: true }),
    is_active: boolean("is_active").default(true),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    is_deleted: boolean("is_deleted").default(false),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    uniqueOrgUser: unique().on(table.organization_id, table.user_id),
  }),
)

export const insertOrganizationSchema = createInsertSchema(organizations)
export const selectOrganizationSchema = createSelectSchema(organizations)
export const insertOrganizationMemberSchema =
  createInsertSchema(organizationMembers)
export const selectOrganizationMemberSchema =
  createSelectSchema(organizationMembers)

export type Organization = typeof organizations.$inferSelect
export type NewOrganization = typeof organizations.$inferInsert
export type OrganizationMember = typeof organizationMembers.$inferSelect
export type NewOrganizationMember = typeof organizationMembers.$inferInsert
