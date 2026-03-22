import { createClient } from "@/lib/auth/client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, data: unknown) {
    super(`API Error: ${status}`)
    this.status = status
    this.data = data
  }
}

export async function getAccessToken(): Promise<string | undefined> {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token
}

export { API_BASE_URL }
