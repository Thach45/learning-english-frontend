import React, { useState } from "react";
import { useAdminPosts, useAdminPost, useDeletePost } from "../../hooks/useAdmin";
import type { AdminPostItem } from "../../types/admin";
import Pagination from "../../components/Pagination";
import ConfirmDeleteModal from "../../components/shared/ConfirmDeleteModal";

const MAX_CONTENT_LEN = 80;

const AdminPosts: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [authorIdInput, setAuthorIdInput] = useState("");
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [appliedAuthorId, setAppliedAuthorId] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");
  const [viewPostId, setViewPostId] = useState<string | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  const params = {
    page,
    pageSize,
    authorId: appliedAuthorId || undefined,
    from: appliedFrom || undefined,
    to: appliedTo || undefined,
  };

  const handleSearch = () => {
    setAppliedAuthorId(authorIdInput);
    setAppliedFrom(fromInput);
    setAppliedTo(toInput);
    setPage(1);
  };

  const { data, isLoading, error } = useAdminPosts(params);
  const { data: postDetail, isLoading: loadingDetail } = useAdminPost(viewPostId ?? undefined);
  const deletePost = useDeletePost();

  const handleDelete = () => {
    if (!deletePostId) return;
    deletePost.mutate(deletePostId, {
      onSuccess: () => setDeletePostId(null),
    });
  };

  if (isLoading) return <div className="text-gray-500">Đang tải...</div>;
  if (error) return <div className="text-red-600">Lỗi tải danh sách bài viết</div>;

  const { items = [], pagination } = data ?? { items: [], pagination: { page: 1, pageSize: 10, total: 0 } };
  const totalPages = Math.ceil((pagination?.total ?? 0) / (pagination?.pageSize ?? pageSize)) || 1;

  const shorten = (s: string | null) =>
    s ? (s.length > MAX_CONTENT_LEN ? s.slice(0, MAX_CONTENT_LEN) + "..." : s) : "-";

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Quản lý Bài viết</h1>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Author ID"
          value={authorIdInput}
          onChange={(e) => setAuthorIdInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="border border-gray-300 rounded px-3 py-2 w-48"
        />
        <input
          type="date"
          value={fromInput}
          onChange={(e) => setFromInput(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="date"
          value={toInput}
          onChange={(e) => setToInput(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
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
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tác giả</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nội dung</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Likes</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Comments</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ngày tạo</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((p: AdminPostItem) => (
              <tr key={p.id}>
                <td className="px-4 py-2 text-sm text-gray-600">{p.id.slice(0, 8)}...</td>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">{p.author?.name ?? "-"}</td>
                <td className="px-4 py-2 text-sm text-gray-600 max-w-xs truncate">{shorten(p.content)}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{p.likesCount}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{p.commentsCount}</td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setViewPostId(p.id)}
                    className="text-indigo-600 hover:underline mr-2 text-sm"
                  >
                    Xem
                  </button>
                  <button
                    onClick={() => setDeletePostId(p.id)}
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

      <Pagination
        currentPage={pagination?.page ?? page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* View post modal */}
      {viewPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Chi tiết bài viết</h3>
              <button
                onClick={() => setViewPostId(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            {loadingDetail ? (
              <p className="text-gray-500">Đang tải...</p>
            ) : postDetail ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  <strong>Tác giả:</strong> {postDetail.author?.name} ({postDetail.author?.email})
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Ngày tạo:</strong>{" "}
                  {postDetail.createdAt ? new Date(postDetail.createdAt).toLocaleString() : "-"}
                </p>
                <p className="whitespace-pre-wrap">{postDetail.content || "-"}</p>
                {postDetail.imageUrls?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {postDetail.imageUrls.map((url, i) => (
                      <img key={i} src={url} alt="" className="max-h-32 rounded object-cover" />
                    ))}
                  </div>
                )}
                <div>
                  <strong className="text-sm">Bình luận ({postDetail.comments?.length ?? 0}):</strong>
                  <ul className="mt-2 space-y-2">
                    {(postDetail.comments ?? []).map((c) => (
                      <li key={c.id} className="text-sm bg-gray-50 p-2 rounded">
                        <span className="font-medium">{c.author?.name}:</span> {c.content}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Không tải được nội dung</p>
            )}
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={!!deletePostId}
        onClose={() => setDeletePostId(null)}
        onConfirm={handleDelete}
        title="Xóa bài viết"
        message="Bạn có chắc muốn xóa bài viết này?"
        loading={deletePost.isPending}
      />
    </div>
  );
};

export default AdminPosts;
