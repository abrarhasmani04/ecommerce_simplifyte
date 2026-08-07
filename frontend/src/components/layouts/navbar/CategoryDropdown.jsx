import { useState, useEffect, useRef } from "react";
import { ChevronDown, LayoutGrid } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import api from "@/services/axios";

const CategoryDropdown = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const ref = useRef(null);

  const selectedId   = searchParams.get("category") ?? "";
  const selectedName = categories.find((c) => c._id === selectedId)?.name ?? null;

  useEffect(() => {
    api.get("/category/")
      .then(({ data }) => setCategories(Array.isArray(data) ? data : (data.categories ?? [])))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <div ref={ref} style={{ position: "relative" }}>
        <button
          onClick={() => setOpen((p) => !p)}
          className="cd-trigger"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "8px 14px",
            borderRadius: "12px",
            border: `1.5px solid ${open ? "#2563eb" : "#e2e8f0"}`,
            background: open ? "#eff6ff" : "#f8fafc",
            color: open ? "#2563eb" : "#475569",
            fontSize: "0.83rem",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "border-color 0.15s, background 0.15s, color 0.15s",
            maxWidth: "160px",
          }}
        >
          <LayoutGrid size={15} strokeWidth={2} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {selectedName ?? "Categories"}
          </span>
          <ChevronDown
            size={14}
            strokeWidth={2.5}
            style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.18s" }}
          />
        </button>

        {open && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "calc(100% + 8px)",
              zIndex: 50,
              width: "220px",
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              boxShadow: "0 12px 40px rgba(15,23,42,0.12)",
              padding: "6px",
              overflow: "hidden",
            }}
          >
            <Link
              to="/products"
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 12px",
                borderRadius: "10px",
                fontSize: "0.83rem",
                fontWeight: !selectedId ? 700 : 500,
                color: !selectedId ? "#2563eb" : "#64748b",
                background: !selectedId ? "#eff6ff" : "transparent",
                textDecoration: "none",
                transition: "background 0.13s",
              }}
            >
              All Categories
            </Link>

            <div style={{ height: "1px", background: "#f1f5f9", margin: "4px 0" }} />

            <div style={{ maxHeight: "260px", overflowY: "auto" }}>
              {categories.length === 0 ? (
                <p style={{ padding: "10px 12px", fontSize: "0.78rem", color: "#94a3b8" }}>Loading…</p>
              ) : (
                categories.map((cat) => {
                  const active = selectedId === cat._id;
                  return (
                    <Link
                      key={cat._id}
                      to={`/products?category=${cat._id}`}
                      onClick={() => setOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "9px 12px",
                        borderRadius: "10px",
                        fontSize: "0.83rem",
                        fontWeight: active ? 700 : 500,
                        color: active ? "#2563eb" : "#374151",
                        background: active ? "#eff6ff" : "transparent",
                        textDecoration: "none",
                        transition: "background 0.13s, color 0.13s",
                      }}
                      className="cd-item"
                    >
                      {cat.name}
                      {active && (
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2563eb", flexShrink: 0 }} />
                      )}
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .cd-item:hover { background: #f8fafc !important; color: #2563eb !important; }
      `}</style>
    </>
  );
};

export default CategoryDropdown;
