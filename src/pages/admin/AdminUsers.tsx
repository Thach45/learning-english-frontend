import React, { useState } from "react";
import {
  useAdminUsers,
  useUpdateUserRole,
  useUpdateUserStatus,
} from "../../hooks/useAdmin";
import type { AdminUserItem, AdminRole } from "../../types/admin";
import Pagination from "../../components/Pagination";

const ROLE_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "ADMIN", label: "Admin" },
  { value: "MODERATOR", label: "Moderator" },
  { value: "USER", label: "User" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "banned", label: "Banned" },
];

const AdminUsers: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [roleFilterInput, setRoleFilterInput] = useState("");
  const [statusFilterInput, setStatusFilterInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedRole, setAppliedRole] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [roleModal, setRoleModal] = useState<AdminUserItem | null>(null);
  const [statusModal, setStatusModal] = useState<AdminUserItem | null>(null);
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const params = {
    page,
    pageSize,
    search: appliedSearch || undefined,
    role: appliedRole || undefined,
    status: appliedStatus || undefined,
  };

  const handleSearch = () => {
    setAppliedSearch(searchInput);
    setAppliedRole(roleFilterInput);
    setAppliedStatus(statusFilterInput);
    setPage(1);
  };

  const { data, isLoading, error } = useAdminUsers(params);
  const updateRole = useUpdateUserRole();
  const updateStatus = useUpdateUserStatus();

  const handleRoleSubmit = () => {
    if (!roleModal || !selectedRoleName) return;
    updateRole.mutate(
      { userId: roleModal.id, payload: { roleName: selectedRoleName } },
      {
        onSuccess: () => {
          setRoleModal(null);
          setSelectedRoleName("");
        },
      }
    );
  };

  const handleStatusSubmit = () => {
    if (!statusModal || !selectedStatus) return;
    updateStatus.mutate(
      { userId: statusModal.id, payload: { status: selectedStatus } },
      {
        onSuccess: () => {
          setStatusModal(null);
          setSelectedStatus("");
        },
      }
    );
  };

  if (isLoading) return <div className="text-gray-500">Đang tải...</div>;
  if (error) return <div className="text-red-600">Lỗi tải danh sách user</div>;

  const { items = [], pagination } = data ?? { items: [], pagination: { page: 1, pageSize: 10, total: 0 } };
  const totalPages = Math.ceil((pagination?.total ?? 0) / (pagination?.pageSize ?? pageSize)) || 1;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Quản lý User</h1>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Tìm theo tên, email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="border border-gray-300 rounded px-3 py-2 w-64"
        />
        <select
          value={roleFilterInput}
          onChange={(e) => setRoleFilterInput(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          {ROLE_OPTIONS.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilterInput}
          onChange={(e) => setStatusFilterInput(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Tìm kiếm
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tên</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Vai trò</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Trạng thái</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((u: AdminUserItem) => (
              <tr key={u.id}>
                <td className="px-4 py-2 text-sm text-gray-600">{u.id.slice(0, 8)}...</td>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">{u.name}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{u.email}</td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {u.roles?.map((r: AdminRole) => r.displayName || r.name).join(", ") || "-"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{u.status}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      setRoleModal(u);
                      setSelectedRoleName(u.roles?.[0]?.name ?? "USER");
                    }}
                    className="text-indigo-600 hover:underline mr-2 text-sm"
                  >
                    Sửa role
                  </button>
                  <button
                    onClick={() => {
                      setStatusModal(u);
                      setSelectedStatus(u.status);
                    }}
                    className="text-indigo-600 hover:underline text-sm"
                  >
                    Đổi trạng thái
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination?.page ?? page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Role modal */}
      {roleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Đổi vai trò: {roleModal.name}</h3>
            <select
              value={selectedRoleName}
              onChange={(e) => setSelectedRoleName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            >
              {ROLE_OPTIONS.filter((o) => o.value).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setRoleModal(null)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleRoleSubmit}
                disabled={updateRole.isPending}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {updateRole.isPending ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status modal */}
      {statusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Đổi trạng thái: {statusModal.name}</h3>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            >
              {STATUS_OPTIONS.filter((o) => o.value).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setStatusModal(null)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleStatusSubmit}
                disabled={updateStatus.isPending}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {updateStatus.isPending ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
