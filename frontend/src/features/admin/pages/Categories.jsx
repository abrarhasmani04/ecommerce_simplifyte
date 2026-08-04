import { useState, useEffect } from "react";
import { Edit, Trash2, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/services/axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // null  → add mode   |  object → edit mode
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({ name: "", description: "" });

  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // ── fetch ──────────────────────────────────────────────────────────────
  const fetchCategories = async () => {
    try {
      setListLoading(true);
      const { data } = await api.get("/category/");
      const list = Array.isArray(data) ? data : data.categories ?? [];
      setCategories(list);
    } catch (err) {
      console.error("Failed to load categories", err);
      toast.error("Failed to load categories");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ── form helpers ───────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description ?? "" });
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
  };

  // ── submit (add or update) ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      if (editingCategory) {
        const { data } = await api.put(
          `/category/${editingCategory._id}`,
          formData
        );
        const updated = data.category ?? data;
        setCategories((prev) =>
          prev.map((c) => (c._id === editingCategory._id ? updated : c))
        );
        toast.success("Category updated successfully");
        cancelEdit();
      } else {
        const { data } = await api.post("/category/", formData);
        const created = data.category ?? data;
        setCategories((prev) => [...prev, created]);
        toast.success("Category added successfully");
        setFormData({ name: "", description: "" });
      }
    } catch (error) {
      console.log("Category Error:", error.response?.data || error.message);
      const data = error.response?.data;
      const message =
        data?.errors?.[0]?.msg ||
        data?.message ||
        (editingCategory ? "Category update failed" : "Category add failed");
      toast.error(message);
    } finally {
      setFormLoading(false);
    }
  };

  // ── delete ─────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async (cat) => {
    try {
      setConfirmDeleteId(null);
      setDeletingId(cat._id);
      await api.delete(`/category/${cat._id}`);
      setCategories((prev) => prev.filter((c) => c._id !== cat._id));
      toast.success(`"${cat.name}" deleted successfully`);
    } catch (err) {
      console.error("Delete failed", err);
      const data = err.response?.data;
      toast.error(data?.errors?.[0]?.msg || data?.message || "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-slate-500">Manage product categories</p>
      </div>

      {/* Add / Edit form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl border shadow-sm space-y-5"
      >
        <h2 className="font-semibold text-lg">
          {editingCategory ? "Edit Category" : "Add New Category"}
        </h2>

        <div>
          <label className="font-medium">Category Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter category name"
            required
            className="w-full mt-2 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Enter category description"
            className="w-full mt-2 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={formLoading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {formLoading
              ? editingCategory
                ? "Saving..."
                : "Adding..."
              : editingCategory
              ? "Save Changes"
              : "Add Category"}
          </button>

          {editingCategory && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-6 py-2.5 rounded-lg border hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Category list */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">All Categories</h2>
        </div>

        {listLoading ? (
          <p className="text-slate-500 text-center py-10">
            Loading categories...
          </p>
        ) : categories.length === 0 ? (
          <p className="text-slate-400 text-center py-10">
            No categories found.
          </p>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-t">
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4 text-slate-500 text-sm">
                    {cat.description || "—"}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3 items-center">
                      {confirmDeleteId === cat._id ? (
                        <>
                          <span className="text-xs text-slate-500">
                            Delete?
                          </span>
                          <button
                            onClick={() => handleDeleteConfirm(cat)}
                            className="text-green-600 hover:text-green-800"
                            title="Confirm delete"
                          >
                            <Check size={17} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-slate-500 hover:text-slate-700"
                            title="Cancel"
                          >
                            <X size={17} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(cat)}
                            disabled={deletingId === cat._id}
                            className="text-blue-600 hover:text-blue-800 disabled:opacity-40"
                            title="Edit category"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(cat._id)}
                            disabled={deletingId === cat._id}
                            className="text-red-600 hover:text-red-800 disabled:opacity-40"
                            title="Delete category"
                          >
                            {deletingId === cat._id ? (
                              <span className="text-xs">...</span>
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Categories;
