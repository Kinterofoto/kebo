"use client"

import {
  Home,
  FileText,
  Link2,
  Settings,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@kebo/ui"

const navItems: { href: string; icon: LucideIcon; label: string }[] = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/invoices", icon: FileText, label: "Facturas" },
  { href: "/dian", icon: Link2, label: "Conexion DIAN" },
  { href: "/settings", icon: Settings, label: "Configuracion" },
]

export function NavMain() {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
