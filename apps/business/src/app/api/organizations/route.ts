import { NextResponse } from "next/server"
import { createClient } from "@/lib/auth/server"
import { db } from "@/db"
import { organizations, organizationMembers } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userOrgs = await db
      .select({
        organization: organizations,
        membership: organizationMembers,
      })
      .from(organizationMembers)
      .innerJoin(
        organizations,
        eq(organizationMembers.organization_id, organizations.id),
      )
      .where(
        and(
          eq(organizationMembers.user_id, user.id),
          eq(organizationMembers.is_active, true),
          eq(organizations.is_deleted, false),
        ),
      )

    return NextResponse.json(userOrgs)
  } catch (error) {
    console.error("Failed to fetch organizations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const [org] = await db
      .insert(organizations)
      .values({
        name: body.name,
        nit: body.nit,
        dv: body.dv,
        legal_name: body.legal_name,
        company_size: body.company_size,
        industry: body.industry,
        address: body.address,
        city: body.city,
        department: body.department,
        phone: body.phone,
        email: body.email,
      })
      .returning()

    // Add the creator as owner
    await db.insert(organizationMembers).values({
      organization_id: org.id,
      user_id: user.id,
      role: "owner",
      accepted_at: new Date(),
      is_active: true,
    })

    return NextResponse.json(org, { status: 201 })
  } catch (error) {
    console.error("Failed to create organization:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
