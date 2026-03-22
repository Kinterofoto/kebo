import { Card, CardContent, CardHeader, CardTitle } from "@kebo/ui"

export default function UploadInvoicePage() {
  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Subir Facturas</h2>
        <p className="text-muted-foreground">
          Sube tus facturas electronicas en formato XML o PDF
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subir Archivos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Proximamente - Arrastra y suelta tus facturas aqui para procesarlas automaticamente.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
