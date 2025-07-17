import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Search,
  PlusCircle,
  ChevronDown,
  X,
} from "lucide-react";
import { Category } from "../types";
import api from "../utils/api";

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createData, setCreateData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    tags: [] as string[],
    isPublic: false,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const [categoryStudySets, setCategoryStudySets] = useState<{
    [key: string]: { loading: boolean; data: { id: string; title: string }[] };
  }>({});

  const [modalCategory, setModalCategory] = useState({
    id: "",
    name: "",
    description: "",
    icon: "📚",
    color: "bg-blue-500",
    imageUrl: "",
  });
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null); // id of deleting category
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [page, setPage] = useState(1);
  
  const [showStudySetsModal, setShowStudySetsModal] = useState<{
    open: boolean;
    category: Category | null;
  }>({ open: false, category: null });
  const [modalStudySets, setModalStudySets] = useState<{
    loading: boolean;
    data: any[];
  }>({ loading: false, data: [] });

  const handleOpenStudySetsModal = async (category: Category, page: number) => {
    setShowStudySetsModal({ open: true, category });
    setModalStudySets({ loading: true, data: [] });
    try {
      const res = await api.get(
        `/study-sets?category=${category.id}&page=${page}`
      );
      console.log("res", res.data.data.data);
      setModalStudySets({
        loading: false,
        data: {
          ...modalStudySets.data,
          ...res.data.data.data.map((ss: any) => ({
          id: ss.id,
          title: ss.title,
          level: ss.level,
          vocabularyCount: ss.vocabularyCount,
          likesCount: ss.likesCount,
          tags: ss.tags,
          createdAt: ss.createdAt,
          isPublic: ss.isPublic,
          })),
        },
      });
      console.log("modalStudySets", modalStudySets);
    } catch {
      setModalStudySets({ loading: false, data: [] });
    }
  };
  const handleCloseStudySetsModal = () => {
    setShowStudySetsModal({ open: false, category: null });
    setModalStudySets({ loading: false, data: [] });
  };

  // Helper to fetch categories from backend and map safely
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/categories");
      const apiCategories = response.data?.data?.data || [];
      const mapped: Category[] = apiCategories.map((cat: any) => ({
        id: cat.id,
        name: cat.name || "",
        description: cat.description || "",
        icon: cat.icon || "📚",
        color: cat.color || "bg-blue-500",
        vocabularyCount: 0,
        imageUrl: cat.imageUrl || null,
        totalStudySet: cat.totalStudySet || 0,
      }));
      setCategories(mapped);
    } catch (err: any) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  // Modal submit handler (create or edit)
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!modalCategory.name.trim()) {
      setModalError("Name is required");
      return;
    }
    if (!modalCategory.icon) {
      setModalError("Icon is required");
      return;
    }
    if (!modalCategory.color) {
      setModalError("Color is required");
      return;
    }
    if (modalMode === "edit") {
      setConfirmEdit(true);
      return;
    }
    await doSaveCategory();
  };

  // Actually save after confirm (edit or create)
  const doSaveCategory = async () => {
    setModalLoading(true);
    try {
      const payload = {
        name: modalCategory.name,
        description: modalCategory.description,
        icon: modalCategory.icon,
        color: modalCategory.color,
        imageUrl: modalCategory.imageUrl || undefined,
      };
      if (modalMode === "create") {
        await api.post("/categories", payload);
      } else {
        await api.put(`/categories/${modalCategory.id}`, payload);
      }
      setShowModal(false);
      setConfirmEdit(false);
      setModalCategory({
        id: "",
        name: "",
        description: "",
        icon: "📚",
        color: "bg-blue-500",
        imageUrl: "",
      });
      fetchCategories();
    } catch (err: any) {
      setModalError(err?.response?.data?.message || "Failed to save category");
    } finally {
      setModalLoading(false);
    }
  };

  // Open modal for create
  const openCreateModal = () => {
    setModalMode("create");
    setModalCategory({
      id: "",
      name: "",
      description: "",
      icon: "📚",
      color: "bg-blue-500",
      imageUrl: "",
    });
    setModalError(null);
    setShowModal(true);
  };

  // Open modal for edit
  const handleEditCategory = (category: Category) => {
    setModalMode("edit");
    setModalCategory({
      id: category.id,
      name: category.name || "",
      description: category.description || "",
      icon: category.icon || "📚",
      color: category.color || "bg-blue-500",
      imageUrl: category.imageUrl || "",
    });
    setModalError(null);
    setShowModal(true);
  };
  const openCreateStudySetModal = (categoryId: string) => {
    setCreateData((d) => ({ ...d, category: categoryId }));
    setShowCreateModal(true);
    setLoadingCategories(true);
    api
      .get("/categories")
      .then((res) => {
        setCategories(
          res.data.data.data.map((cat: any) => ({ id: cat.id, name: cat.name }))
        );
        setCreateData((prev) => ({
          ...prev,
          category: categoryId || res.data.data.data[0]?.id || "",
        }));
      })
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false));
  };

  const handleCreateStudySet = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      if (!createData.title.trim()) {
        alert("Vui lòng nhập tiêu đề");
        setCreateLoading(false);
        return;
      }
      if (!createData.category) {
        alert("Vui lòng chọn chủ đề");
        setCreateLoading(false);
        return;
      }
      let level = "BEGINNER";
      if (createData.level === "intermediate") level = "INTERMEDIATE";
      if (createData.level === "advanced") level = "ADVANCED";
      const payload = {
        title: createData.title,
        description: createData.description,
        categoryId: createData.category,
        level,
        tags: createData.tags,
        isPublic: createData.isPublic,
      };
      const res = await api.post("/study-sets", payload);
      setShowCreateModal(false);
      setCreateLoading(false);
      setCreateData({
        title: "",
        description: "",
        category: "",
        level: "beginner",
        tags: [],
        isPublic: false,
      });
      // Reload danh sách study set trong modal nếu đang mở
      if (showStudySetsModal.open && showStudySetsModal.category) {
        handleOpenStudySetsModal(showStudySetsModal.category, 1);
      }
      // Chuyển hướng sang trang chi tiết để thêm từ vựng
      navigate(`/study-sets/${res.data.data.id}`);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Tạo study set thất bại.");
      setCreateLoading(false);
    }
  };
  const handleToggleStudySets = async (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      return;
    }
    setExpandedCategory(categoryId);
    if (!categoryStudySets[categoryId]) {
      setCategoryStudySets((prev) => ({
        ...prev,
        [categoryId]: { loading: true, data: [] },
      }));
      try {
        const res = await api.get(`/study-sets?category=${categoryId}`);
        setCategoryStudySets((prev) => ({
          ...prev,
          [categoryId]: {
            loading: false,
            data: res.data.data.data.map((ss: any) => ({
              id: ss.id,
              title: ss.title,
            })),
          },
        }));
      } catch {
        setCategoryStudySets((prev) => ({
          ...prev,
          [categoryId]: { loading: false, data: [] },
        }));
      }
    }
  };
  // Delete category (show confirm modal)
  const handleDeleteCategory = (id: string) => {
    setConfirmDeleteId(id);
  };

  // Actually delete after confirm
  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleteLoading(confirmDeleteId);
    try {
      await api.delete(`/categories/${confirmDeleteId}`);
      setConfirmDeleteId(null);
      fetchCategories();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete category");
    } finally {
      setDeleteLoading(null);
    }
  };

  const iconOptions = [
    "📚",
    "💼",
    "✈️",
    "💻",
    "🏠",
    "❤️",
    "🎓",
    "🌍",
    "🎨",
    "🔬",
    "🏃‍♂️",
    "🍳",
  ];
  const colorOptions = [
    { value: "bg-blue-500", label: "Blue", color: "#3B82F6" },
    { value: "bg-green-500", label: "Green", color: "#22C55E" },
    { value: "bg-red-500", label: "Red", color: "#EF4444" },
    { value: "bg-yellow-500", label: "Yellow", color: "#EAB308" },
    { value: "bg-purple-500", label: "Purple", color: "#A21CAF" },
    { value: "bg-pink-500", label: "Pink", color: "#EC4899" },
    { value: "bg-gray-500", label: "Gray", color: "#6B7280" },
    { value: "bg-orange-500", label: "Orange", color: "#F97316" },
  ];
  const filteredCategories = categories?.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
            Categories
          </h1>
          <p className="text-gray-500">
            Organize your vocabulary by topics and subjects
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Category
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">
          Loading categories...
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="group bg-white rounded-xl shadow transition-all border border-gray-100 hover:shadow-xl hover:scale-[1.025] p-0 flex flex-col overflow-hidden relative"
            >
              {/* Image or Icon */}
              <div className="flex items-center justify-center h-32 bg-gradient-to-br from-blue-50 to-purple-50 relative">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg bg-gray-100"
                  />
                ) : (
                  <div
                    className={`w-20 h-20 flex items-center justify-center text-4xl font-bold rounded-full shadow-lg ${category.color} bg-opacity-90 text-white border-4 border-white`}
                  >
                    {category.icon}
                  </div>
                )}
                {/* Edit/Delete buttons (absolute, only visible on hover desktop, always on mobile) */}
                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:bg-blue-100 text-blue-600 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="Edit category"
                    disabled={deleteLoading === category.id}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className={`w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:bg-red-100 text-red-600 border border-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 ${
                      deleteLoading === category.id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    aria-label="Delete category"
                    disabled={deleteLoading === category.id}
                  >
                    {deleteLoading === category.id ? (
                      <span className="w-5 h-5 inline-block animate-spin border-2 border-gray-400 border-t-transparent rounded-full"></span>
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {/* Content */}
              <div className="flex-1 flex flex-col px-6 pt-4 pb-6">
                <div className="flex items-center mb-2">
                  <h3
                    className="text-xl font-bold text-gray-900 flex-1 truncate"
                    title={category.name}
                  >
                    {category.name}
                  </h3>
                </div>
                <div className="flex items-center mb-2">
                  <BookOpen className="h-5 w-5 text-blue-400 mr-1" />
                  <span className="font-semibold text-blue-700 text-sm">
                    {category.totalStudySet} study set
                    {category.totalStudySet === 1 ? "" : "s"}
                  </span>
                </div>
                {category.description && (
                  <div className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {category.description}
                  </div>
                )}
                {/* Action buttons */}
                <div className="flex items-center mt-4 space-x-2">
                  <button
                    className="flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium"
                    onClick={() => handleOpenStudySetsModal(category, 1)}
                  >
                    <ChevronDown className="w-4 h-4 mr-1" />
                    View Study Sets
                  </button>
                  <button
                    className="flex items-center px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-sm font-medium"
                    onClick={() => openCreateStudySetModal(category.id)}
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Create Study Set
                  </button>
                </div>
                {/* Collapse study sets list */}
                {expandedCategory === category.id && (
                  <div className="mt-4 bg-gray-50 rounded p-3 border border-gray-200">
                    {categoryStudySets[category.id]?.loading ? (
                      <div className="text-gray-400 text-sm">
                        Loading study sets...
                      </div>
                    ) : categoryStudySets[category.id]?.data.length ? (
                      <ul className="space-y-1">
                        {categoryStudySets[category.id].data.map((ss) => (
                          <li key={ss.id}>
                            <button
                              className="text-blue-600 hover:underline text-sm"
                              onClick={() => navigate(`/study-sets/${ss.id}`)}
                            >
                              {ss.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        No study sets in this category.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No categories found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? "Try adjusting your search terms."
              : "No categories available."}
          </p>
        </div>
      )}

      {/* Create/Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {modalMode === "create" ? "Create New Category" : "Edit Category"}
            </h3>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={modalCategory.name}
                  onChange={(e) =>
                    setModalCategory({ ...modalCategory, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Business English"
                  required
                  disabled={modalLoading}
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={modalCategory.description}
                  onChange={(e) =>
                    setModalCategory({
                      ...modalCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Describe what this category covers..."
                  disabled={modalLoading}
                />
              </div>
              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon *
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() =>
                        setModalCategory({ ...modalCategory, icon })
                      }
                      className={`p-3 text-xl border-2 rounded-lg transition-colors ${
                        modalCategory.icon === icon
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      disabled={modalLoading}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() =>
                        setModalCategory({
                          ...modalCategory,
                          color: color.value,
                        })
                      }
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        modalCategory.color === color.value
                          ? "border-gray-800"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color.color }}
                      disabled={modalLoading}
                    >
                      <span className="text-white font-medium text-sm">
                        {color.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (optional)
                </label>
                <input
                  type="text"
                  value={modalCategory.imageUrl}
                  onChange={(e) =>
                    setModalCategory({
                      ...modalCategory,
                      imageUrl: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://..."
                  disabled={modalLoading}
                />
              </div>
              {modalError && (
                <div className="text-red-500 text-sm">{modalError}</div>
              )}
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setModalCategory({
                      id: "",
                      name: "",
                      description: "",
                      icon: "📚",
                      color: "bg-blue-500",
                      imageUrl: "",
                    });
                    setModalError(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={modalLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  disabled={modalLoading}
                >
                  {modalLoading
                    ? modalMode === "create"
                      ? "Creating..."
                      : "Saving..."
                    : modalMode === "create"
                    ? "Create"
                    : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Category
            </h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this category? This action cannot
              be undone.
            </p>
            <div className="flex space-x-3">
              <button
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleteLoading === confirmDeleteId}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:bg-gray-400"
                onClick={confirmDelete}
                disabled={deleteLoading === confirmDeleteId}
              >
                {deleteLoading === confirmDeleteId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Edit Modal (before save) */}
      {confirmEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Edit
            </h3>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span
                  className={`w-8 h-8 ${modalCategory.color} rounded-lg flex items-center justify-center text-xl mr-2`}
                >
                  {modalCategory.icon}
                </span>
                <span className="font-bold text-gray-900">
                  {modalCategory.name}
                </span>
              </div>
              <div className="text-gray-700 text-sm mb-1">
                {modalCategory.description}
              </div>
              {modalCategory.imageUrl && (
                <div className="text-xs text-gray-500">
                  Image: {modalCategory.imageUrl}
                </div>
              )}
            </div>
            <p className="mb-6 text-gray-700">
              Are you sure you want to save these changes?
            </p>
            <div className="flex space-x-3">
              <button
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setConfirmEdit(false)}
                disabled={modalLoading}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-400"
                onClick={doSaveCategory}
                disabled={modalLoading}
              >
                {modalLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Study Sets Modal */}
      {showStudySetsModal.open && showStudySetsModal.category && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative max-h-[80vh]">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={handleCloseStudySetsModal}
            >
              <span className="text-2xl">&times;</span>
            </button>
            <h3 className="text-xl font-bold mb-4">
              Study Sets in "{showStudySetsModal.category.name}"
            </h3>
            {modalStudySets.loading ? (
              <div className="text-gray-400 text-center py-8">
                Loading study sets...
              </div>
            ) : modalStudySets.data.length ? (
              <div className="space-y-4 mb-4 max-h-[50vh] overflow-y-auto">
                {modalStudySets.data.map((ss) => (
                  <div
                    key={ss.id}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition flex flex-col cursor-pointer"
                    onClick={() => {
                      handleCloseStudySetsModal();
                      navigate(`/study-sets/${ss.id}`);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg font-bold text-blue-800 line-clamp-1">
                        {ss.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ml-2 ${
                          ss.level === "BEGINNER"
                            ? "bg-green-100 text-green-700"
                            : ss.level === "INTERMEDIATE"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {ss.level}
                      </span>
                      {ss.isPublic ? (
                        <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                          Public
                        </span>
                      ) : (
                        <span className="ml-2 px-2 py-0.5 rounded bg-gray-200 text-gray-600 text-xs font-medium">
                          Private
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1 space-x-4">
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {ss.vocabularyCount} terms
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">{ss.likesCount}</span>
                        <span role="img" aria-label="likes">
                          ❤️
                        </span>
                      </span>
                      <span className="text-xs text-gray-400">
                        {ss.createdAt
                          ? new Date(ss.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    {ss.tags && ss.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {ss.tags.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex justify-center">
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-base"
                    onClick={() => {
                      setPage(page + 1);
                      handleOpenStudySetsModal(
                        showStudySetsModal.category!,
                        page
                      );
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                No study sets in this category.
              </div>
            )}
            {showStudySetsModal.category && (
              <button
                className="mt-2 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-base"
                onClick={() =>
                  openCreateStudySetModal(showStudySetsModal.category!.id)
                }
              >
                + Create Study Set
              </button>
            )}
          </div>
        </div>
      )}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowCreateModal(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Tạo Study Set mới</h2>
            <form onSubmit={handleCreateStudySet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  value={createData.title}
                  onChange={(e) =>
                    setCreateData((d) => ({ ...d, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  value={createData.description}
                  onChange={(e) =>
                    setCreateData((d) => ({
                      ...d,
                      description: e.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Chủ đề *
                </label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={createData.category}
                  onChange={(e) =>
                    setCreateData((d) => ({ ...d, category: e.target.value }))
                  }
                  required
                  disabled={loadingCategories}
                >
                  {loadingCategories ? (
                    <option>Đang tải...</option>
                  ) : (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cấp độ *
                </label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={createData.level}
                  onChange={(e) =>
                    setCreateData((d) => ({ ...d, level: e.target.value }))
                  }
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  value={createData.tags.join(", ")}
                  onChange={(e) =>
                    setCreateData((d) => ({
                      ...d,
                      tags: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean) as string[],
                    }))
                  }
                  placeholder="Cách nhau bởi dấu phẩy"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={createData.isPublic}
                  onChange={(e) =>
                    setCreateData((d) => ({ ...d, isPublic: e.target.checked }))
                  }
                />
                <span>Công khai</span>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                disabled={createLoading}
              >
                {createLoading ? "Đang tạo..." : "Tạo Study Set"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
