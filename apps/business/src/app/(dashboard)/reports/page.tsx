import { Card, CardContent, CardHeader, CardTitle } from "@kebo/ui"

export default function ReportsPage() {
  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reportes</h2>
        <p className="text-muted-foreground">
          Genera reportes financieros y fiscales
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reportes Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Proximamente - Genera reportes de ingresos, gastos, impuestos y mas.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
