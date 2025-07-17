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
import CategoryStudySetsModal from '../components/pageCategory/CategoryStudySetsModal';
import CategoryCard from '../components/pageCategory/CategoryCard';
import CategoryModal from '../components/pageCategory/CategoryModal';
import ConfirmDeleteModal from '../components/pageCategory/ConfirmDeleteModal';
import ConfirmEditModal from '../components/pageCategory/ConfirmEditModal';

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
  
  const [showStudySetsModal, setShowStudySetsModal] = useState<{
    open: boolean;
    category: Category | null;
  }>({ open: false, category: null });
  const [modalStudySets, setModalStudySets] = useState<{
    loading: boolean;
    data: any[];
  }>({ loading: false, data: [] });
  const [visibleCount, setVisibleCount] = useState(4);

  const handleOpenStudySetsModal = async (category: Category, page: number) => {
    setShowStudySetsModal({ open: true, category });
    setModalStudySets({ loading: true, data: [] });
    try {
      const res = await api.get(
        `/study-sets?category=${category.id}&page=1&pageSize=10000`
      );
      console.log("res", res.data.data.data);
      setModalStudySets({
        loading: false,
        data: res.data.data.data.map((ss: any) => ({
          id: ss.id,
          title: ss.title,
          level: ss.level,
          vocabularyCount: ss.vocabularyCount,
          likesCount: ss.likesCount,
          tags: ss.tags,
          createdAt: ss.createdAt,
          isPublic: ss.isPublic,
          })),
        
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

  useEffect(() => {
    if (showStudySetsModal.open) setVisibleCount(4);
  }, [showStudySetsModal.open]);

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
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
              onViewStudySets={handleOpenStudySetsModal}
              onCreateStudySet={openCreateStudySetModal}
              expanded={expandedCategory === category.id}
              onToggleExpand={handleToggleStudySets}
              studySets={categoryStudySets[category.id]?.data || []}
              loadingStudySets={categoryStudySets[category.id]?.loading || false}
              navigate={navigate}
              deleteLoading={deleteLoading}
            />
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
      <CategoryModal
        open={showModal}
        mode={modalMode}
        category={modalCategory}
        onChange={setModalCategory}
        onClose={() => {
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
        onSubmit={handleModalSubmit}
        loading={modalLoading}
        error={modalError}
        iconOptions={iconOptions}
        colorOptions={colorOptions}
      />
      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={!!confirmDeleteId}
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={confirmDelete}
        loading={deleteLoading === confirmDeleteId}
      />
      {/* Confirm Edit Modal (before save) */}
      <ConfirmEditModal
        open={confirmEdit}
        category={modalCategory}
        onCancel={() => setConfirmEdit(false)}
        onConfirm={doSaveCategory}
        loading={modalLoading}
      />

      {/* Study Sets Modal */}
      {showStudySetsModal.open && showStudySetsModal.category && (
        <CategoryStudySetsModal
          open={showStudySetsModal.open}
          category={showStudySetsModal.category}
          studySets={modalStudySets.data}
          loading={modalStudySets.loading}
          onClose={handleCloseStudySetsModal}
          onViewStudySet={id => navigate(`/study-sets/${id}`)}
          onCreateStudySet={openCreateStudySetModal}
        />
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
