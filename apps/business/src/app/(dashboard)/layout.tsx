import { AppSidebar } from "@/components/app-sidebar"
import { ThemeSwitcherToggle } from "@/components/theme-switcher-toggle"
import { SidebarInset, SidebarProvider } from "@kebo/ui"
import { SidebarTrigger } from "@kebo/ui"
import { Separator } from "@kebo/ui"
import { createClient } from "@/lib/auth/server"
import { redirect } from "next/navigation"
import { NuqsAdapter } from "nuqs/adapters/next/app"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication on the server
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <NuqsAdapter>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-sm font-medium">Kebo Business</h1>
            </div>
            <ThemeSwitcherToggle />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </NuqsAdapter>
  )
}
