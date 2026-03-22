import { NextResponse } from "next/server"
import { createClient } from "@/lib/auth/server"
import { db } from "@/db"
import { accountingEntries, organizationMembers } from "@/db/schema"
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
  { params }: { params: Promise<{ orgId: string }> },
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orgId } = await params

    const member = await verifyMembership(user.id, orgId)
    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const entries = await db
      .select()
      .from(accountingEntries)
      .where(
        and(
          eq(accountingEntries.organization_id, orgId),
          eq(accountingEntries.is_deleted, false),
        ),
      )
      .orderBy(accountingEntries.created_at)

    return NextResponse.json(entries)
  } catch (error) {
    console.error("Failed to fetch accounting entries:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgId: string }> },
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orgId } = await params

    const member = await verifyMembership(user.id, orgId)
    if (!member || !["owner", "admin", "accountant"].includes(member.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    const [entry] = await db
      .insert(accountingEntries)
      .values({
        organization_id: orgId,
        invoice_id: body.invoice_id,
        provider: body.provider,
        entry_type: body.entry_type ?? "causacion",
        debit_account: body.debit_account,
        credit_account: body.credit_account,
        amount: body.amount,
        description: body.description,
      })
      .returning()

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error("Failed to create accounting entry:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
