import { Card, CardContent, CardHeader, CardTitle } from "@kebo/ui"

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Detalle de Factura
        </h2>
        <p className="text-muted-foreground">Factura #{id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informacion de la Factura</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Proximamente - Aqui veras los detalles completos de la factura.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
