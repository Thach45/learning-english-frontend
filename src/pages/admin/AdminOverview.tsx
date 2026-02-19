import React, { useState } from "react";
import { useAdminStats } from "../../hooks/useAdmin";

const AdminOverview: React.FC = () => {
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");
  const query = appliedFrom || appliedTo ? { from: appliedFrom || undefined, to: appliedTo || undefined } : undefined;
  const { data, isLoading, error } = useAdminStats(query);

  const handleApply = () => {
    setAppliedFrom(fromInput);
    setAppliedTo(toInput);
  };

  if (isLoading) return <div className="text-gray-500">Đang tải...</div>;
  if (error) return <div className="text-red-600">Lỗi tải thống kê</div>;

  const stats = data ?? {
    totalUsers: 0,
    newUsersInRange: 0,
    totalPosts: 0,
    totalComments: 0,
  };

  const cards = [
    { label: "Tổng user", value: stats.totalUsers },
    { label: "User mới (khoảng thời gian)", value: stats.newUsersInRange },
    { label: "Tổng bài viết", value: stats.totalPosts },
    { label: "Tổng comment", value: stats.totalComments },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Tổng quan</h1>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Từ ngày</label>
          <input
            type="date"
            value={fromInput}
            onChange={(e) => setFromInput(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Đến ngày</label>
          <input
            type="date"
            value={toInput}
            onChange={(e) => setToInput(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button
          type="button"
          onClick={handleApply}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 mt-6"
        >
          Xem thống kê
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
