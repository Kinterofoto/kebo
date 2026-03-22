const SECOND = 1_000
const MINUTE = 60 * SECOND

export const queryConfig = {
  organizations: {
    staleTime: 5 * MINUTE,
    gcTime: 10 * MINUTE,
  },
  invoices: {
    staleTime: 30 * SECOND,
    gcTime: 5 * MINUTE,
  },
  accounting: {
    staleTime: 2 * MINUTE,
    gcTime: 10 * MINUTE,
  },
  team: {
    staleTime: 5 * MINUTE,
    gcTime: 10 * MINUTE,
  },
  reports: {
    staleTime: 5 * MINUTE,
    gcTime: 15 * MINUTE,
  },
  profile: {
    staleTime: 5 * MINUTE,
    gcTime: 10 * MINUTE,
  },
}
