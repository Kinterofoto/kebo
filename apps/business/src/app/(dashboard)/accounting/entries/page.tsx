import { Card, CardContent, CardHeader, CardTitle } from "@kebo/ui"

export default function AccountingEntriesPage() {
  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Entradas Contables
        </h2>
        <p className="text-muted-foreground">
          Registro de movimientos contables
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Libro de Entradas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Proximamente - Aqui veras todas las entradas contables registradas.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
