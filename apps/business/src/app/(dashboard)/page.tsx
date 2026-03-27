"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@kebo/ui"
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Link2,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"

const chartData = [
  { month: "Oct", ingresos: 0, gastos: 0 },
  { month: "Nov", ingresos: 0, gastos: 0 },
  { month: "Dic", ingresos: 0, gastos: 0 },
  { month: "Ene", ingresos: 0, gastos: 0 },
  { month: "Feb", ingresos: 0, gastos: 0 },
  { month: "Mar", ingresos: 0, gastos: 0 },
]

const chartConfig = {
  ingresos: {
    label: "Ingresos",
    color: "hsl(142, 71%, 45%)",
  },
  gastos: {
    label: "Gastos",
    color: "hsl(0, 84%, 60%)",
  },
} satisfies ChartConfig

export default function BusinessDashboardPage() {
  const totalIngresos = 0
  const totalGastos = 0
  const balance = totalIngresos - totalGastos
  const facturasEmitidas = 0
  const facturasRecibidas = 0
  const isConnected = false

  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Panel de Control</h2>
        <p className="text-muted-foreground">
          Resumen financiero de tu empresa basado en facturacion electronica DIAN.
        </p>
      </div>

      {!isConnected && (
        <Card className="border-dashed border-kebo-500/50 bg-kebo-500/5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-kebo-500/10">
              <Link2 className="h-5 w-5 text-kebo-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Conecta tu empresa con la DIAN</p>
              <p className="text-xs text-muted-foreground">
                Importa automaticamente todas tus facturas electronicas.
              </p>
            </div>
            <Link
              href="/dian"
              className="inline-flex h-9 items-center justify-center rounded-md bg-kebo-500 px-4 text-sm font-medium text-white transition-colors hover:bg-kebo-600"
            >
              Conectar
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIngresos)}</div>
            <CardDescription className="flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              {facturasEmitidas} facturas emitidas
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalGastos)}</div>
            <CardDescription className="flex items-center gap-1">
              <ArrowDownRight className="h-3 w-3 text-red-500" />
              {facturasRecibidas} facturas recibidas
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? "text-green-500" : "text-red-500"}`}>
              {formatCurrency(balance)}
            </div>
            <CardDescription>Ingresos - Gastos</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facturasEmitidas + facturasRecibidas}</div>
            <CardDescription>Total este periodo</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ingresos vs Gastos</CardTitle>
          <CardDescription>Ultimos 6 meses de facturacion electronica</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={chartData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000000}M`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="ingresos" fill="var(--color-ingresos)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gastos" fill="var(--color-gastos)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
