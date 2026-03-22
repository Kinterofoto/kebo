/**
 * Internal API client for the business app.
 * All API routes are served by Next.js route handlers within this app.
 */

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, data: unknown) {
    super(`API Error: ${status}`)
    this.status = status
    this.data = data
  }
}

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new ApiError(res.status, data)
  }

  return res.json()
}

// Organization helpers
export const api = {
  organizations: {
    list: () => request("/api/organizations"),
    get: (orgId: string) => request(`/api/organizations/${orgId}`),
    create: (data: Record<string, unknown>) =>
      request("/api/organizations", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (orgId: string, data: Record<string, unknown>) =>
      request(`/api/organizations/${orgId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },

  members: {
    list: (orgId: string) =>
      request(`/api/organizations/${orgId}/members`),
    invite: (orgId: string, data: Record<string, unknown>) =>
      request(`/api/organizations/${orgId}/members`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  invoices: {
    list: (orgId: string, filters?: Record<string, string>) => {
      const params = new URLSearchParams(filters)
      const qs = params.toString()
      return request(
        `/api/organizations/${orgId}/invoices${qs ? `?${qs}` : ""}`,
      )
    },
    get: (orgId: string, invoiceId: string) =>
      request(`/api/organizations/${orgId}/invoices/${invoiceId}`),
    create: (orgId: string, data: Record<string, unknown>) =>
      request(`/api/organizations/${orgId}/invoices`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    upload: (orgId: string, formData: FormData) =>
      fetch(`/api/organizations/${orgId}/invoices/upload`, {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          throw new ApiError(res.status, data)
        }
        return res.json()
      }),
  },

  accounting: {
    connections: {
      list: (orgId: string) =>
        request(`/api/organizations/${orgId}/accounting/connections`),
      create: (orgId: string, data: Record<string, unknown>) =>
        request(`/api/organizations/${orgId}/accounting/connections`, {
          method: "POST",
          body: JSON.stringify(data),
        }),
    },
    entries: {
      list: (orgId: string) =>
        request(`/api/organizations/${orgId}/accounting/entries`),
      create: (orgId: string, data: Record<string, unknown>) =>
        request(`/api/organizations/${orgId}/accounting/entries`, {
          method: "POST",
          body: JSON.stringify(data),
        }),
    },
  },
}
