"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Button,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kebo/ui"
import { Link2, Mail, ClipboardPaste, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export default function DianPage() {
  const [link, setLink] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handlePasteLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!link.trim()) return

    setIsLoading(true)
    // TODO: send link to backend for scraping
    toast.info("Procesando link de la DIAN...")
    setTimeout(() => {
      toast.success("Link recibido. Importando facturas...")
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Conexion DIAN</h2>
        <p className="text-muted-foreground">
          Importa las facturas electronicas de tu empresa directamente desde la DIAN
        </p>
      </div>

      <Tabs defaultValue="manual" className="space-y-4">
        <TabsList>
          <TabsTrigger value="manual" className="gap-2">
            <ClipboardPaste className="h-4 w-4" />
            Pegar Link
          </TabsTrigger>
          <TabsTrigger value="automatico" className="gap-2">
            <Mail className="h-4 w-4" />
            Automatico
          </TabsTrigger>
        </TabsList>

        {/* Option 1: Paste DIAN link manually */}
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Pegar link de la DIAN</CardTitle>
                <Badge variant="secondary">Recomendado</Badge>
              </div>
              <CardDescription>
                La DIAN envia un link de acceso al correo del representante legal. Pegalo aqui y nosotros nos encargamos del resto.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kebo-500/10 text-xs font-medium text-kebo-500">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ingresa al portal de la DIAN</p>
                    <p className="text-xs text-muted-foreground">
                      Ve a la DIAN y solicita acceso. Te enviaran un link al correo del representante legal.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kebo-500/10 text-xs font-medium text-kebo-500">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium">Copia el link del correo</p>
                    <p className="text-xs text-muted-foreground">
                      Abre el correo que te envio la DIAN y copia el link de acceso.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kebo-500/10 text-xs font-medium text-kebo-500">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pegalo aqui</p>
                    <p className="text-xs text-muted-foreground">
                      Nosotros extraemos todas tus facturas emitidas y recibidas automaticamente.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePasteLink} className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="url"
                    placeholder="https://muisca.dian.gov.co/..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button type="submit" disabled={isLoading || !link.trim()}>
                  {isLoading ? "Procesando..." : "Importar"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Option 2: Automatic via email forwarding */}
        <TabsContent value="automatico">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Configuracion automatica</CardTitle>
                <Badge variant="outline">Avanzado</Badge>
              </div>
              <CardDescription>
                Configura tu correo para que reenvie automaticamente los emails de la DIAN. Nosotros extraemos el link y hacemos el scraping sin que tengas que hacer nada.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kebo-500/10 text-xs font-medium text-kebo-500">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium">Configura el reenvio de correo</p>
                    <p className="text-xs text-muted-foreground">
                      En tu proveedor de correo (Gmail, Outlook, etc.), crea una regla que reenvie los correos de la DIAN con el asunto del token a la siguiente direccion:
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                        dian@ingest.kebo.app
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText("dian@ingest.kebo.app")
                          toast.success("Correo copiado")
                        }}
                      >
                        Copiar
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kebo-500/10 text-xs font-medium text-kebo-500">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium">Nosotros hacemos el resto</p>
                    <p className="text-xs text-muted-foreground">
                      Cada vez que la DIAN te envie un correo con el link de acceso, nosotros lo recibimos, extraemos el link, ingresamos al portal y descargamos todas tus facturas automaticamente.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-dashed p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Estado de la conexion</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-neutral-500" />
                  <p className="text-xs text-muted-foreground">
                    No configurado — Aun no hemos recibido ningun correo reenviado.
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">
                  <strong>Como configurar en Gmail:</strong> Ve a Configuracion → Filtros y direcciones bloqueadas → Crear un filtro nuevo. En "De" pon el remitente de la DIAN, y en la accion selecciona "Reenviar a" con la direccion de arriba.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
