export const queryKeys = {
  organizations: {
    all: ["organizations"] as const,
    lists: () => [...queryKeys.organizations.all, "list"] as const,
    list: () => [...queryKeys.organizations.lists()] as const,
    details: () => [...queryKeys.organizations.all, "detail"] as const,
    detail: (id: string) =>
      [...queryKeys.organizations.details(), id] as const,
  },
  invoices: {
    all: ["invoices"] as const,
    lists: () => [...queryKeys.invoices.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.invoices.lists(), filters ?? {}] as const,
    details: () => [...queryKeys.invoices.all, "detail"] as const,
    detail: (id: string) =>
      [...queryKeys.invoices.details(), id] as const,
  },
  accounting: {
    all: ["accounting"] as const,
    entries: {
      all: ["accounting", "entries"] as const,
      lists: () => [...queryKeys.accounting.entries.all, "list"] as const,
      list: (filters?: Record<string, unknown>) =>
        [...queryKeys.accounting.entries.lists(), filters ?? {}] as const,
      details: () => [...queryKeys.accounting.entries.all, "detail"] as const,
      detail: (id: string) =>
        [...queryKeys.accounting.entries.details(), id] as const,
    },
    connections: {
      all: ["accounting", "connections"] as const,
      lists: () => [...queryKeys.accounting.connections.all, "list"] as const,
      list: () => [...queryKeys.accounting.connections.lists()] as const,
    },
  },
  team: {
    all: ["team"] as const,
    lists: () => [...queryKeys.team.all, "list"] as const,
    list: () => [...queryKeys.team.lists()] as const,
    details: () => [...queryKeys.team.all, "detail"] as const,
    detail: (id: string) =>
      [...queryKeys.team.details(), id] as const,
  },
  reports: {
    all: ["reports"] as const,
    summary: (params?: Record<string, unknown>) =>
      [...queryKeys.reports.all, "summary", params ?? {}] as const,
    taxReport: (params?: Record<string, unknown>) =>
      [...queryKeys.reports.all, "tax", params ?? {}] as const,
  },
  profile: {
    all: ["profile"] as const,
  },
}
