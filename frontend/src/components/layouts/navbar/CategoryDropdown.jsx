import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import api from "@/services/axios";

const CategoryDropdown = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const ref = useRef(null);

  const selectedId = searchParams.get("category") ?? "";

  const selectedName =
    categories.find((c) => c._id === selectedId)?.name ?? null;

  useEffect(() => {
    api
      .get("/category/")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : (data.categories ?? []);
        setCategories(list);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 max-w-[160px]"
      >
        <span className="truncate">{selectedName ?? "Categories"}</span>
        <ChevronDown size={16} className="shrink-0" />
      </button>

      {open && (
        <div className="absolute left-0 top-11 z-50 w-52 rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
          <Link
            to="/products"
            onClick={() => setOpen(false)}
            className={`block px-4 py-2 text-sm transition hover:bg-gray-50 ${
              !selectedId ? "font-semibold text-blue-600" : "text-gray-500"
            }`}
          >
            All Categories
          </Link>

          <hr className="my-1 border-gray-100" />

          {categories.length === 0 ? (
            <p className="px-4 py-2 text-xs text-gray-400">Loading…</p>
          ) : (
            categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 text-sm transition hover:bg-gray-50 ${
                  selectedId === cat._id
                    ? "font-semibold text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {cat.name}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
