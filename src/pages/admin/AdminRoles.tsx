import React, { useState } from "react";
import {
  useRolesWithPermissions,
  useAvailablePermissionsForRole,
  useAssignPermissionToRole,
  useRemovePermissionFromRole,
} from "../../hooks/useRolePermissions";
import type { RoleWithPermissions, PermissionItem } from "../../types/role";

const AdminRoles: React.FC = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [addPermissionId, setAddPermissionId] = useState<string>("");

  const { data: rolesData, isLoading: loadingRoles, error: errorRoles } = useRolesWithPermissions();
  const { data: availableList, isLoading: loadingAvailable } = useAvailablePermissionsForRole(
    selectedRoleId || undefined
  );
  const assignMutation = useAssignPermissionToRole(selectedRoleId);
  const removeMutation = useRemovePermissionFromRole(selectedRoleId);

  const roles: RoleWithPermissions[] = rolesData ?? [];
  const selectedRole = roles.find((r) => r.id === selectedRoleId);
  const currentPermissions = selectedRole?.permissions ?? [];
  const availablePermissions: PermissionItem[] = availableList ?? [];

  const handleAdd = () => {
    if (!addPermissionId) return;
    assignMutation.mutate(addPermissionId, {
      onSuccess: () => setAddPermissionId(""),
    });
  };

  const handleRemove = (permissionId: string) => {
    removeMutation.mutate(permissionId);
  };

  if (loadingRoles) return <div className="text-gray-500">Đang tải...</div>;
  if (errorRoles) return <div className="text-red-600">Lỗi tải danh sách role</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Role & Permission
      </h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chọn role
        </label>
        <select
          value={selectedRoleId}
          onChange={(e) => setSelectedRoleId(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 min-w-[200px] bg-white"
        >
          <option value="">-- Chọn role --</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.displayName || r.name} ({r.permissions?.length ?? 0})
            </option>
          ))}
        </select>
      </div>

      {!selectedRoleId ? (
        <p className="text-gray-500">Chọn một role để xem và sửa permission.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current permissions */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="font-medium text-gray-800">
                Permission hiện có ({currentPermissions.length})
              </h2>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {currentPermissions.length === 0 ? (
                <p className="p-4 text-gray-500 text-sm">Chưa có permission nào.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {currentPermissions.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between gap-2 px-4 py-2 hover:bg-gray-50"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-gray-900 block truncate">
                          {p.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {p.method} {p.path ?? ""}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(p.id)}
                        disabled={removeMutation.isPending}
                        className="shrink-0 text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                      >
                        Gỡ
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Add permission */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="font-medium text-gray-800">Thêm permission</h2>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600">
                Chọn permission chưa gán cho role này để thêm vào.
              </p>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={addPermissionId}
                  onChange={(e) => setAddPermissionId(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 flex-1 min-w-[200px] bg-white text-sm"
                >
                  <option value="">-- Chọn permission --</option>
                  {availablePermissions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!addPermissionId || assignMutation.isPending}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {assignMutation.isPending ? "Đang thêm..." : "Thêm"}
                </button>
              </div>
              {loadingAvailable && (
                <p className="text-sm text-gray-500">Đang tải danh sách...</p>
              )}
              {!loadingAvailable && availablePermissions.length === 0 && selectedRoleId && (
                <p className="text-sm text-gray-500">
                  Role này đã có đủ toàn bộ permission.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoles;
