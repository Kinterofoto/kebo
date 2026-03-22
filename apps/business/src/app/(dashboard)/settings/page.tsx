import { Card, CardContent, CardHeader, CardTitle } from "@kebo/ui"

export default function SettingsPage() {
  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuracion</h2>
        <p className="text-muted-foreground">
          Configura tu cuenta y tu organizacion
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajustes Generales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Proximamente - Configura los datos de tu empresa, moneda, impuestos y preferencias.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
