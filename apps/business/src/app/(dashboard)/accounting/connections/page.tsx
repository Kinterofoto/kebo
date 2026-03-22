import { Card, CardContent, CardHeader, CardTitle } from "@kebo/ui"

export default function ConnectionsPage() {
  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Conexiones</h2>
        <p className="text-muted-foreground">
          Conecta tus cuentas bancarias y servicios contables
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Servicios Conectados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Proximamente - Configura las integraciones con bancos y software contable.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
