import { NextResponse } from "next/server"
import { createClient } from "@/lib/auth/server"
import { db } from "@/db"
import {
  dianInvoices,
  organizationMembers,
} from "@/db/schema"
import { eq, and, gte, lte } from "drizzle-orm"
import type { SQL } from "drizzle-orm"

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
    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const direction = searchParams.get("direction")
    const status = searchParams.get("status")
    const dateFrom = searchParams.get("date_from")
    const dateTo = searchParams.get("date_to")

    const conditions: SQL[] = [
      eq(dianInvoices.organization_id, orgId),
      eq(dianInvoices.is_deleted, false),
    ]

    if (direction) {
      conditions.push(
        eq(
          dianInvoices.direction,
          direction as "emitted" | "received",
        ),
      )
    }

    if (status) {
      conditions.push(
        eq(
          dianInvoices.status,
          status as "pending" | "approved" | "rejected" | "processing",
        ),
      )
    }

    if (dateFrom) {
      conditions.push(gte(dianInvoices.issue_date, new Date(dateFrom)))
    }

    if (dateTo) {
      conditions.push(lte(dianInvoices.issue_date, new Date(dateTo)))
    }

    const invoices = await db
      .select()
      .from(dianInvoices)
      .where(and(...conditions))
      .orderBy(dianInvoices.issue_date)

    return NextResponse.json(invoices)
  } catch (error) {
    console.error("Failed to fetch invoices:", error)
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
    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    const [invoice] = await db
      .insert(dianInvoices)
      .values({
        organization_id: orgId,
        ...body,
      })
      .returning()

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error("Failed to create invoice:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
