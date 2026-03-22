import { NextResponse } from "next/server"
import { createClient } from "@/lib/auth/server"
import { db } from "@/db"
import { accountingConnections, organizationMembers } from "@/db/schema"
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

    const connections = await db
      .select()
      .from(accountingConnections)
      .where(
        and(
          eq(accountingConnections.organization_id, orgId),
          eq(accountingConnections.is_deleted, false),
        ),
      )

    return NextResponse.json(connections)
  } catch (error) {
    console.error("Failed to fetch accounting connections:", error)
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

    const [connection] = await db
      .insert(accountingConnections)
      .values({
        organization_id: orgId,
        provider: body.provider,
        credentials: body.credentials,
        status: "active",
        sync_config: body.sync_config,
      })
      .returning()

    return NextResponse.json(connection, { status: 201 })
  } catch (error) {
    console.error("Failed to create accounting connection:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
