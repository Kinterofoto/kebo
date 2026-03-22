import { Card, CardContent, CardHeader, CardTitle } from "@kebo/ui"

export default function AccountingPage() {
  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Contabilidad</h2>
        <p className="text-muted-foreground">
          Administra la contabilidad de tu empresa
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen Contable</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Proximamente - Visualiza el estado contable de tu empresa.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
