export interface PermissionItem {
  id: string;
  name: string;
  path: string | null;
  method: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleWithPermissions {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: PermissionItem[];
}
