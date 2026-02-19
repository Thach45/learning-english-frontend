import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRolesWithPermissions,
  getRoleWithPermissions,
  getAvailablePermissionsForRole,
  assignPermissionToRole,
  removePermissionFromRole,
} from "../services/roleService";
import { useNotification } from "../context/NotificationContext";

export function useRolesWithPermissions() {
  return useQuery({
    queryKey: ["roles", "with-permissions"] as const,
    queryFn: getRolesWithPermissions,
  });
}

export function useRoleWithPermissions(roleId: string | undefined) {
  return useQuery({
    queryKey: ["roles", "permissions", roleId] as const,
    queryFn: () => getRoleWithPermissions(roleId!),
    enabled: !!roleId,
  });
}

export function useAvailablePermissionsForRole(roleId: string | undefined) {
  return useQuery({
    queryKey: ["roles", "available-permissions", roleId] as const,
    queryFn: () => getAvailablePermissionsForRole(roleId!),
    enabled: !!roleId,
  });
}

function useInvalidateRoles() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["roles"] });
  };
}

export function useAssignPermissionToRole(roleId: string) {
  const invalidate = useInvalidateRoles();
  const { addNotification } = useNotification();
  return useMutation({
    mutationFn: (permissionId: string) =>
      assignPermissionToRole(roleId, permissionId),
    onSuccess: () => {
      invalidate();
      addNotification({
        type: "success",
        title: "Thành công",
        message: "Đã gán permission cho role",
      });
    },
    onError: (err: any) => {
      addNotification({
        type: "error",
        title: "Lỗi",
        message: err?.response?.data?.message ?? "Không thể gán permission",
      });
    },
  });
}

export function useRemovePermissionFromRole(roleId: string) {
  const invalidate = useInvalidateRoles();
  const { addNotification } = useNotification();
  return useMutation({
    mutationFn: (permissionId: string) =>
      removePermissionFromRole(roleId, permissionId),
    onSuccess: () => {
      invalidate();
      addNotification({
        type: "success",
        title: "Thành công",
        message: "Đã gỡ permission khỏi role",
      });
    },
    onError: (err: any) => {
      addNotification({
        type: "error",
        title: "Lỗi",
        message: err?.response?.data?.message ?? "Không thể gỡ permission",
      });
    },
  });
}
