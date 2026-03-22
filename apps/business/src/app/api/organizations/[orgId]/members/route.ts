import { NextResponse } from "next/server"
import { createClient } from "@/lib/auth/server"
import { db } from "@/db"
import { organizationMembers } from "@/db/schema"
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

    const members = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organization_id, orgId),
          eq(organizationMembers.is_deleted, false),
        ),
      )

    return NextResponse.json(members)
  } catch (error) {
    console.error("Failed to fetch members:", error)
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
    if (!member || !["owner", "admin"].includes(member.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    const [invited] = await db
      .insert(organizationMembers)
      .values({
        organization_id: orgId,
        user_id: body.user_id ?? "00000000-0000-0000-0000-000000000000",
        role: body.role ?? "viewer",
        invited_email: body.email,
        invited_at: new Date(),
        is_active: false,
      })
      .returning()

    return NextResponse.json(invited, { status: 201 })
  } catch (error) {
    console.error("Failed to invite member:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
