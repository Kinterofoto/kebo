import { NextResponse } from "next/server"
import { createClient } from "@/lib/auth/server"
import { db } from "@/db"
import { organizations, organizationMembers } from "@/db/schema"
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

    const [org] = await db
      .select()
      .from(organizations)
      .where(
        and(eq(organizations.id, orgId), eq(organizations.is_deleted, false)),
      )
      .limit(1)

    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(org)
  } catch (error) {
    console.error("Failed to fetch organization:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

export async function PATCH(
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
    if (!member || !["owner", "admin"].includes(member.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    const [updated] = await db
      .update(organizations)
      .set({
        ...body,
        updated_at: new Date(),
      })
      .where(eq(organizations.id, orgId))
      .returning()

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Failed to update organization:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
