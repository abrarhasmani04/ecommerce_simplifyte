import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/services/axios";

const PAGE_SIZE = 10;

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/product/", {
        params: { page, limit: PAGE_SIZE },
      });

      // Backend returns paginated object OR plain array
      if (Array.isArray(data)) {
        // Plain array — no server pagination, show all
        setProducts(data);
        setTotalProducts(data.length);
        setTotalPages(Math.max(1, Math.ceil(data.length / PAGE_SIZE)));
      } else {
        const list =
          data.products ?? data.data ?? data.result ?? data.items ?? [];
        const total =
          data.total ?? data.totalProducts ?? data.count ?? list.length;
        const tp =
          data.totalPages ??
          data.pages ??
          Math.max(1, Math.ceil(total / PAGE_SIZE));
        setProducts(list);
        setTotalProducts(total);
        setTotalPages(tp);
      }
    } catch (err) {
      console.error("Failed to load products", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const goTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteConfirm = async (product) => {
    try {
      setConfirmDeleteId(null);
      setDeletingId(product._id);
      await api.delete(`/product/${product._id}`);
      // Re-fetch current page after delete (count may change)
      await fetchProducts(currentPage);
      toast.success(`"${product.name}" deleted successfully`);
    } catch (err) {
      console.error("Delete failed", err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  // Page numbers with ellipsis
  const pageNumbers = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const nums = new Set(
      [1, totalPages, currentPage, currentPage - 1, currentPage + 1].filter(
        (n) => n >= 1 && n <= totalPages
      )
    );
    const sorted = [...nums].sort((a, b) => a - b);
    const result = [];
    sorted.forEach((n, i) => {
      if (i > 0 && n - sorted[i - 1] > 1) result.push("…");
      result.push(n);
    });
    return result;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-slate-500">
            {!loading && `${totalProducts} total product${totalProducts !== 1 ? "s" : ""}`}
            {!loading && totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
            {loading && "Manage all products"}
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* States */}
      {loading && (
        <p className="text-slate-500 py-10 text-center">Loading products...</p>
      )}

      {error && !loading && (
        <p className="text-red-500 py-10 text-center">{error}</p>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl border overflow-hidden">
          {products.length === 0 ? (
            <p className="text-slate-400 text-center py-10">
              No products found. Add your first product.
            </p>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Brand</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Stock</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t">
                    <td className="p-4">{product.name}</td>
                    <td className="p-4">{product.brand}</td>
                    <td className="p-4">₹{product.price}</td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">
                      {product.category?.name ?? product.category ?? "—"}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-3 items-center">
                        {confirmDeleteId === product._id ? (
                          <>
                            <span className="text-xs text-slate-500">
                              Delete?
                            </span>
                            <button
                              onClick={() => handleDeleteConfirm(product)}
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
                              onClick={() =>
                                navigate(`/admin/products/${product._id}/edit`)
                              }
                              className="text-blue-600 hover:text-blue-800 disabled:opacity-40"
                              disabled={deletingId === product._id}
                              title="Edit product"
                            >
                              <Edit size={18} />
                            </button>

                            <button
                              onClick={() => setConfirmDeleteId(product._id)}
                              disabled={deletingId === product._id}
                              className="text-red-600 hover:text-red-800 disabled:opacity-40"
                              title="Delete product"
                            >
                              {deletingId === product._id ? (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-slate-500">
                Showing{" "}
                {Math.min((currentPage - 1) * PAGE_SIZE + 1, totalProducts)}–
                {Math.min(currentPage * PAGE_SIZE, totalProducts)} of{" "}
                {totalProducts} products
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => goTo(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>

                {pageNumbers().map((n, i) =>
                  n === "…" ? (
                    <span key={`e-${i}`} className="px-1 text-slate-400 text-sm">
                      …
                    </span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => goTo(n)}
                      className={`w-8 h-8 rounded text-sm font-medium ${
                        n === currentPage
                          ? "bg-blue-600 text-white"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}

                <button
                  onClick={() => goTo(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
