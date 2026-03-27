"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
} from "@kebo/ui"
import { ArrowUpRight, ArrowDownRight, FileText } from "lucide-react"
import Link from "next/link"

export default function InvoicesPage() {
  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Facturas</h2>
          <p className="text-muted-foreground">
            Facturas electronicas importadas desde la DIAN
          </p>
        </div>
      </div>

      <Tabs defaultValue="recibidas">
        <TabsList>
          <TabsTrigger value="recibidas" className="gap-2">
            <ArrowDownRight className="h-4 w-4" />
            Recibidas (Gastos)
          </TabsTrigger>
          <TabsTrigger value="emitidas" className="gap-2">
            <ArrowUpRight className="h-4 w-4" />
            Emitidas (Ingresos)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recibidas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Facturas Recibidas
                <Badge variant="secondary">0</Badge>
              </CardTitle>
              <CardDescription>
                Facturas que otros le emiten a tu empresa — representan tus gastos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No hay facturas recibidas</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Conecta tu empresa con la DIAN para importar automaticamente todas las facturas que te han emitido.
                </p>
                <Link
                  href="/dian"
                  className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-kebo-500 px-4 text-sm font-medium text-white transition-colors hover:bg-kebo-600"
                >
                  Conectar con DIAN
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emitidas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Facturas Emitidas
                <Badge variant="secondary">0</Badge>
              </CardTitle>
              <CardDescription>
                Facturas que tu empresa emite a otros — representan tus ingresos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No hay facturas emitidas</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Conecta tu empresa con la DIAN para importar automaticamente todas las facturas que has emitido.
                </p>
                <Link
                  href="/dian"
                  className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-kebo-500 px-4 text-sm font-medium text-white transition-colors hover:bg-kebo-600"
                >
                  Conectar con DIAN
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
