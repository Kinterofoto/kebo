import { Card, CardContent, CardHeader, CardTitle } from "@kebo/ui"

export default function TeamPage() {
  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Equipo</h2>
        <p className="text-muted-foreground">
          Gestiona los miembros de tu equipo y sus permisos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Miembros del Equipo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Proximamente - Invita y gestiona los miembros de tu organizacion.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
