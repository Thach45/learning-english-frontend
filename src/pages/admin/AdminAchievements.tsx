import React, { useState } from "react";
import {
  useAdminAchievements,
  useCreateAchievement,
  useUpdateAchievement,
  useDeleteAchievement,
} from "../../hooks/useAdminAchievements";
import type {
  Achievement,
  CreateAchievementPayload,
  UpdateAchievementPayload,
  GetAchievementsQuery,
} from "../../types/achievement";
import {
  AchievementType,
  AchievementRarity,
} from "../../types/achievement";
import ConfirmDeleteModal from "../../components/shared/ConfirmDeleteModal";
import Pagination from "../../components/Pagination";

const TYPE_LABELS: Record<string, string> = {
  TOTAL_WORDS_LEARNED: "Từ đã học",
  STREAK_DAYS: "Streak",
  LEVEL_REACHED: "Cấp độ",
  TOTAL_WORDS_REVIEWED: "Từ đã ôn",
};

const RARITY_LABELS: Record<string, string> = {
  COMMON: "Thường",
  RARE: "Hiếm",
  EPIC: "Epic",
  LEGENDARY: "Huyền thoại",
};

const defaultForm: CreateAchievementPayload = {
  title: "",
  description: "",
  type: AchievementType.TOTAL_WORDS_LEARNED,
  targetValue: 1,
  rarity: AchievementRarity.COMMON,
  xpReward: 0,
};

const AdminAchievements: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [rarityFilter, setRarityFilter] = useState<string>("");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [appliedQuery, setAppliedQuery] = useState<{
    type?: string;
    rarity?: string;
    isActive?: boolean;
  }>({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [form, setForm] = useState<CreateAchievementPayload>(defaultForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const query: GetAchievementsQuery = {
    page,
    pageSize,
    ...(appliedQuery.type && { type: appliedQuery.type as AchievementType }),
    ...(appliedQuery.rarity && { rarity: appliedQuery.rarity as AchievementRarity }),
    ...(appliedQuery.isActive !== undefined && { isActive: appliedQuery.isActive }),
  };
  const { data, isLoading, error } = useAdminAchievements(query);
  const list = data?.items ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) || 1 : 1;
  const createMutation = useCreateAchievement();
  const updateMutation = useUpdateAchievement();
  const deleteMutation = useDeleteAchievement();

  const handleSearch = () => {
    setPage(1);
    setAppliedQuery({
      type: typeFilter || undefined,
      rarity: rarityFilter || undefined,
      isActive:
        isActiveFilter === ""
          ? undefined
          : isActiveFilter === "true",
    });
  };

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setShowForm(true);
  };

  const openEdit = (a: Achievement) => {
    setEditing(a);
    setForm({
      title: a.title,
      description: a.description,
      type: a.type as AchievementType,
      targetValue: a.targetValue,
      duration: a.duration,
      rarity: a.rarity as AchievementRarity,
      icon: a.icon,
      xpReward: a.xpReward ?? 0,
      isActive: a.isActive,
    } as CreateAchievementPayload & { isActive?: boolean });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (editing) {
      const payload: UpdateAchievementPayload = {
        title: form.title,
        description: form.description,
        targetValue: form.targetValue,
        duration: form.duration,
        rarity: form.rarity,
        icon: form.icon,
        xpReward: form.xpReward,
      };
      if ("isActive" in form && typeof form.isActive === "boolean") payload.isActive = form.isActive;
      updateMutation.mutate(
        { id: editing.id, payload },
        { onSuccess: () => setShowForm(false) }
      );
    } else {
      createMutation.mutate(form, { onSuccess: () => setShowForm(false) });
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  if (isLoading) return <div className="text-gray-500">Đang tải...</div>;
  if (error) return <div className="text-red-600">Lỗi tải danh sách thành tựu</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Quản lý thành tựu
      </h1>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Loại</option>
          {Object.entries(TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select
          value={rarityFilter}
          onChange={(e) => setRarityFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Độ hiếm</option>
          {Object.entries(RARITY_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select
          value={isActiveFilter}
          onChange={(e) => setIsActiveFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Trạng thái</option>
          <option value="true">Đang dùng</option>
          <option value="false">Ẩn</option>
        </select>
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
        >
          Lọc
        </button>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Thêm thành tựu
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tiêu đề</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Loại</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Độ hiếm</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Mục tiêu</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">XP</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Trạng thái</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {list.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">{a.title}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{TYPE_LABELS[a.type] ?? a.type}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{RARITY_LABELS[a.rarity] ?? a.rarity}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{a.targetValue}{a.duration != null ? ` (${a.duration}d)` : ""}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{a.xpReward ?? 0}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{a.isActive ? "Đang dùng" : "Ẩn"}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => openEdit(a)}
                    className="text-indigo-600 hover:underline mr-2 text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => setDeleteId(a.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editing ? "Sửa thành tựu" : "Thêm thành tựu"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tiêu đề</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Loại</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as AchievementType }))}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  disabled={!!editing}
                >
                  {Object.entries(TYPE_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Giá trị mục tiêu</label>
                  <input
                    type="number"
                    min={1}
                    value={form.targetValue}
                    onChange={(e) => setForm((f) => ({ ...f, targetValue: Number(e.target.value) || 1 }))}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Thời gian (ngày, tùy chọn)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.duration ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value ? Number(e.target.value) : undefined }))}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    placeholder="Để trống nếu không giới hạn"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Độ hiếm</label>
                <select
                  value={form.rarity}
                  onChange={(e) => setForm((f) => ({ ...f, rarity: e.target.value as AchievementRarity }))}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                >
                  {Object.entries(RARITY_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Icon (tùy chọn)</label>
                <input
                  value={form.icon ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value || undefined }))}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="Tên icon"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">XP thưởng</label>
                <input
                  type="number"
                  min={0}
                  value={form.xpReward ?? 0}
                  onChange={(e) => setForm((f) => ({ ...f, xpReward: Number(e.target.value) || 0 }))}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              {editing && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="form-isActive"
                    checked={(form as UpdateAchievementPayload).isActive ?? editing.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="form-isActive" className="text-sm text-gray-600">Đang dùng (hiển thị cho user)</label>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!form.title.trim() || !form.description.trim() || createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {editing ? (updateMutation.isPending ? "Đang lưu..." : "Lưu") : (createMutation.isPending ? "Đang tạo..." : "Tạo")}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xóa thành tựu"
        message="Thành tựu sẽ bị ẩn (soft delete). Bạn có chắc?"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AdminAchievements;
