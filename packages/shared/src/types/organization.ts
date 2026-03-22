export enum OrgRole {
  Owner = "owner",
  Admin = "admin",
  Accountant = "accountant",
  Viewer = "viewer",
}

export enum CompanySize {
  Micro = "micro",
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export interface Organization {
  id: string;
  name: string;
  nit: string;
  dv: string;
  legal_name: string;
  company_size: CompanySize;
  industry: string | null;
  address: string | null;
  city: string | null;
  department: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrgRole;
  invited_email: string | null;
  invited_at: string | null;
  accepted_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
}
