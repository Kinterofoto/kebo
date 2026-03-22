import { Card, CardContent, CardHeader, CardTitle } from "@kebo/ui"
import { Button } from "@kebo/ui"
import Link from "next/link"
import { Upload } from "lucide-react"

export default function InvoicesPage() {
  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Facturas</h2>
          <p className="text-muted-foreground">
            Gestiona las facturas de tu empresa
          </p>
        </div>
        <Button asChild>
          <Link href="/invoices/upload">
            <Upload className="mr-2 h-4 w-4" />
            Subir Factura
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Facturas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Proximamente - Aqui podras ver y gestionar todas tus facturas.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
