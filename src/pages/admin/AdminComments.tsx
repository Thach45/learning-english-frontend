import React, { useState } from "react";
import { useAdminComments, useDeleteComment } from "../../hooks/useAdmin";
import type { AdminCommentItem } from "../../types/admin";
import Pagination from "../../components/Pagination";
import ConfirmDeleteModal from "../../components/shared/ConfirmDeleteModal";

const MAX_CONTENT_LEN = 60;

const AdminComments: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [postIdInput, setPostIdInput] = useState("");
  const [authorIdInput, setAuthorIdInput] = useState("");
  const [appliedPostId, setAppliedPostId] = useState("");
  const [appliedAuthorId, setAppliedAuthorId] = useState("");
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

  const params = {
    page,
    pageSize,
    postId: appliedPostId || undefined,
    authorId: appliedAuthorId || undefined,
  };

  const handleSearch = () => {
    setAppliedPostId(postIdInput);
    setAppliedAuthorId(authorIdInput);
    setPage(1);
  };

  const { data, isLoading, error } = useAdminComments(params);
  const deleteComment = useDeleteComment();

  const handleDelete = () => {
    if (!deleteCommentId) return;
    deleteComment.mutate(deleteCommentId, {
      onSuccess: () => setDeleteCommentId(null),
    });
  };

  if (isLoading) return <div className="text-gray-500">Đang tải...</div>;
  if (error) return <div className="text-red-600">Lỗi tải danh sách comment</div>;

  const { items = [], pagination } = data ?? { items: [], pagination: { page: 1, pageSize: 10, total: 0 } };
  const totalPages = Math.ceil((pagination?.total ?? 0) / (pagination?.pageSize ?? pageSize)) || 1;

  const shorten = (s: string | null) =>
    s ? (s.length > MAX_CONTENT_LEN ? s.slice(0, MAX_CONTENT_LEN) + "..." : s) : "-";

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Quản lý Comment</h1>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Post ID"
          value={postIdInput}
          onChange={(e) => setPostIdInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="border border-gray-300 rounded px-3 py-2 w-48"
        />
        <input
          type="text"
          placeholder="Author ID"
          value={authorIdInput}
          onChange={(e) => setAuthorIdInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="border border-gray-300 rounded px-3 py-2 w-48"
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
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nội dung</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tác giả</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Post</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ngày tạo</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((c: AdminCommentItem) => (
              <tr key={c.id}>
                <td className="px-4 py-2 text-sm text-gray-600">{c.id.slice(0, 8)}...</td>
                <td className="px-4 py-2 text-sm text-gray-600 max-w-xs truncate">{shorten(c.content)}</td>
                <td className="px-4 py-2 text-sm font-medium text-gray-900">{c.author?.name ?? "-"}</td>
                <td className="px-4 py-2 text-sm text-gray-600 max-w-xs truncate">
                  {c.post ? shorten(c.post.content) : c.postId?.slice(0, 8) + "..."}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setDeleteCommentId(c.id)}
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

      <ConfirmDeleteModal
        isOpen={!!deleteCommentId}
        onClose={() => setDeleteCommentId(null)}
        onConfirm={handleDelete}
        title="Xóa bình luận"
        message="Bạn có chắc muốn xóa bình luận này?"
        loading={deleteComment.isPending}
      />
    </div>
  );
};

export default AdminComments;
