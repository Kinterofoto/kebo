import { NextResponse } from "next/server"
import { createClient } from "@/lib/auth/server"
import { db } from "@/db"
import { dianInvoices, dianInvoiceLines, organizationMembers } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { XMLParser } from "fast-xml-parser"

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

function parseInvoiceXml(xmlString: string) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    removeNSPrefix: true,
  })

  const parsed = parser.parse(xmlString)

  // Navigate the UBL invoice structure
  const invoice =
    parsed.Invoice ?? parsed.CreditNote ?? parsed.DebitNote ?? {}

  const issuerParty =
    invoice.AccountingSupplierParty?.Party ?? {}
  const receiverParty =
    invoice.AccountingCustomerParty?.Party ?? {}

  const issuerNit =
    issuerParty.PartyTaxScheme?.CompanyID ??
    issuerParty.PartyIdentification?.ID ??
    ""
  const issuerName =
    issuerParty.PartyTaxScheme?.RegistrationName ??
    issuerParty.PartyName?.Name ??
    ""
  const receiverNit =
    receiverParty.PartyTaxScheme?.CompanyID ??
    receiverParty.PartyIdentification?.ID ??
    ""
  const receiverName =
    receiverParty.PartyTaxScheme?.RegistrationName ??
    receiverParty.PartyName?.Name ??
    ""

  const legalMonetary = invoice.LegalMonetaryTotal ?? {}
  const taxTotal = invoice.TaxTotal?.TaxAmount ?? "0"

  // Determine invoice type
  let invoiceType: "factura" | "nota_credito" | "nota_debito" = "factura"
  if (parsed.CreditNote) invoiceType = "nota_credito"
  if (parsed.DebitNote) invoiceType = "nota_debito"

  // Parse lines
  const rawLines = invoice.InvoiceLine ?? invoice.CreditNoteLine ?? invoice.DebitNoteLine ?? []
  const linesArray = Array.isArray(rawLines) ? rawLines : [rawLines]

  const lines = (linesArray.filter((l: unknown) => l != null) as Record<string, unknown>[])
    .map((line, idx) => ({
      line_number: idx + 1,
      description: String(
        (line.Item as Record<string, unknown>)?.Description ?? "",
      ),
      quantity: String(line.InvoicedQuantity ?? line.CreditedQuantity ?? line.DebitedQuantity ?? "0"),
      unit_price: String(
        (line.Price as Record<string, unknown>)?.PriceAmount ?? "0",
      ),
      tax_amount: String(
        (line.TaxTotal as Record<string, unknown>)?.TaxAmount ?? "0",
      ),
      tax_percentage: "0",
      line_total: String(line.LineExtensionAmount ?? "0"),
      product_code: String(
        (line.Item as Record<string, unknown>)?.SellersItemIdentification
          ? ((line.Item as Record<string, unknown>)
              ?.SellersItemIdentification as Record<string, unknown>)?.ID
          : "",
      ) || null,
    }))

  return {
    invoice: {
      cufe: String(invoice.UUID ?? ""),
      invoice_number: String(invoice.ID ?? ""),
      prefix: String(invoice.Prefix ?? ""),
      invoice_type: invoiceType,
      issuer_nit: String(issuerNit),
      issuer_name: String(issuerName),
      receiver_nit: String(receiverNit),
      receiver_name: String(receiverName),
      issue_date: invoice.IssueDate
        ? new Date(String(invoice.IssueDate))
        : new Date(),
      due_date: invoice.DueDate ? new Date(String(invoice.DueDate)) : null,
      subtotal: String(legalMonetary.LineExtensionAmount ?? "0"),
      tax_total: String(taxTotal),
      total: String(legalMonetary.PayableAmount ?? "0"),
      currency: String(invoice.DocumentCurrencyCode ?? "COP"),
    },
    lines,
    parsed_data: parsed,
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

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const direction = (formData.get("direction") as string) ?? "received"

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 },
      )
    }

    const xmlString = await file.text()
    const { invoice: invoiceData, lines, parsed_data } = parseInvoiceXml(xmlString)

    const [invoice] = await db
      .insert(dianInvoices)
      .values({
        organization_id: orgId,
        direction: direction as "emitted" | "received",
        raw_xml: xmlString,
        parsed_data,
        ...invoiceData,
      })
      .returning()

    if (lines.length > 0) {
      await db.insert(dianInvoiceLines).values(
        lines.map((line) => ({
          invoice_id: invoice.id,
          ...line,
        })),
      )
    }

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error("Failed to upload invoice:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
