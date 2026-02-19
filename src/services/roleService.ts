import api from "../utils/api";
import type { RoleWithPermissions, PermissionItem } from "../types/role";

const unwrap = <T>(res: any): T =>
  res?.data?.data?.data ? res.data.data.data : res.data.data;

export async function getRolesWithPermissions(): Promise<RoleWithPermissions[]> {
  const res = await api.get("/roles/with-permissions");
  return unwrap<RoleWithPermissions[]>(res);
}

export async function getRoleWithPermissions(
  roleId: string
): Promise<RoleWithPermissions> {
  const res = await api.get(`/roles/${roleId}/permissions`);
  return unwrap<RoleWithPermissions>(res);
}

export async function getAvailablePermissionsForRole(
  roleId: string
): Promise<PermissionItem[]> {
  const res = await api.get(`/roles/${roleId}/available-permissions`);
  return unwrap<PermissionItem[]>(res);
}

export async function assignPermissionToRole(
  roleId: string,
  permissionId: string
): Promise<RoleWithPermissions> {
  const res = await api.post(`/roles/${roleId}/permissions`, {
    permissionId,
  });
  return unwrap<RoleWithPermissions>(res);
}

export async function removePermissionFromRole(
  roleId: string,
  permissionId: string
): Promise<RoleWithPermissions> {
  const res = await api.delete(`/roles/${roleId}/permissions`, {
    data: { permissionId },
  });
  return unwrap<RoleWithPermissions>(res);
}

export async function assignPermissionsBulk(
  roleId: string,
  permissionIds: string[]
): Promise<RoleWithPermissions> {
  const res = await api.post(`/roles/${roleId}/permissions/bulk`, {
    permissionIds,
  });
  return unwrap<RoleWithPermissions>(res);
}

export async function removePermissionsBulk(
  roleId: string,
  permissionIds: string[]
): Promise<RoleWithPermissions> {
  const res = await api.delete(`/roles/${roleId}/permissions/bulk`, {
    data: { permissionIds },
  });
  return unwrap<RoleWithPermissions>(res);
}

export async function replaceRolePermissions(
  roleId: string,
  permissionIds: string[]
): Promise<RoleWithPermissions> {
  const res = await api.put(`/roles/${roleId}/permissions`, {
    permissionIds,
  });
  return unwrap<RoleWithPermissions>(res);
}
