import { NextResponse } from "next/server"
import { createClient } from "@/lib/auth/server"
import { db } from "@/db"
import {
  dianInvoices,
  dianInvoiceLines,
  organizationMembers,
} from "@/db/schema"
import { eq, and } from "drizzle-orm"

async function verifyMembership(userId: string, orgId: string) {
  const [member] = await db
    .select()
    .from(organizationMembers)
    .where(
      and(
        eq(organizationMembers.organization_id, orgId),
        eq(organizationMembers.user_id, userId),
        eq(organizationMembers.is_active, true),
      ),
    )
    .limit(1)

  return member ?? null
}

export async function GET(
  _request: Request,
  {
    params,
  }: { params: Promise<{ orgId: string; invoiceId: string }> },
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orgId, invoiceId } = await params

    const member = await verifyMembership(user.id, orgId)
    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const [invoice] = await db
      .select()
      .from(dianInvoices)
      .where(
        and(
          eq(dianInvoices.id, invoiceId),
          eq(dianInvoices.organization_id, orgId),
          eq(dianInvoices.is_deleted, false),
        ),
      )
      .limit(1)

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 },
      )
    }

    const lines = await db
      .select()
      .from(dianInvoiceLines)
      .where(eq(dianInvoiceLines.invoice_id, invoiceId))
      .orderBy(dianInvoiceLines.line_number)

    return NextResponse.json({ ...invoice, lines })
  } catch (error) {
    console.error("Failed to fetch invoice:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
