import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, ChevronDown, Star, SlidersHorizontal, RotateCcw } from "lucide-react";
import ProductCard from "../components/ProductCard";
import api from "@/services/axios";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "",           label: "Newest First" },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "rating",     label: "Top Rated" },
  { value: "name_asc",   label: "Name: A → Z" },
  { value: "name_desc",  label: "Name: Z → A" },
];

const RATING_OPTIONS = [
  { value: "4", label: "4★ & above" },
  { value: "3", label: "3★ & above" },
  { value: "2", label: "2★ & above" },
  { value: "1", label: "1★ & above" },
];

// ─── Generic dropdown ─────────────────────────────────────────────────────────
const Dropdown = ({ label, value, options, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition whitespace-nowrap ${
          value
            ? "border-blue-500 bg-blue-50 text-blue-700"
            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
        }`}
      >
        {selected ? selected.label : (placeholder ?? label)}
        {value
          ? <X size={13} className="ml-0.5 shrink-0" onClick={(e) => { e.stopPropagation(); onChange(""); }} />
          : <ChevronDown size={13} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
        }
      </button>

      {open && (
        <div className="absolute left-0 top-full z-40 mt-1.5 min-w-[170px] rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
          <button
            onClick={() => { onChange(""); setOpen(false); }}
            className={`flex w-full items-center px-3 py-2 text-sm transition hover:bg-gray-50 ${!value ? "font-semibold text-blue-600" : "text-gray-500"}`}
          >
            All {label}
          </button>
          <div className="my-1 border-t border-gray-100" />
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition hover:bg-gray-50 ${value === o.value ? "font-semibold text-blue-600 bg-blue-50/60" : "text-gray-700"}`}
            >
              {value === o.value && <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />}
              {o.stars && (
                <span className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((n) => (
                    <Star key={n} size={11} className={n <= o.stars ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} />
                  ))}
                </span>
              )}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Price dropdown ───────────────────────────────────────────────────────────
const PriceDropdown = ({ minPrice, maxPrice, onApply }) => {
  const [open, setOpen] = useState(false);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const ref = useRef(null);
  const hasValue = minPrice || maxPrice;

  useEffect(() => { setLocalMin(minPrice); }, [minPrice]);
  useEffect(() => { setLocalMax(maxPrice); }, [maxPrice]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label = hasValue
    ? `₹${minPrice || "0"} – ₹${maxPrice || "∞"}`
    : "Price";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition whitespace-nowrap ${
          hasValue
            ? "border-blue-500 bg-blue-50 text-blue-700"
            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
        }`}
      >
        {label}
        {hasValue
          ? <X size={13} className="ml-0.5 shrink-0" onClick={(e) => { e.stopPropagation(); setLocalMin(""); setLocalMax(""); onApply("", ""); }} />
          : <ChevronDown size={13} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
        }
      </button>

      {open && (
        <div className="absolute left-0 top-full z-40 mt-1.5 w-60 rounded-xl border border-gray-100 bg-white p-4 shadow-lg">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">Price Range</p>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Min ₹</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <span className="mt-5 text-gray-300">—</span>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Max ₹</label>
              <input
                type="number"
                min="0"
                placeholder="Any"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <button
            onClick={() => { onApply(localMin, localMax); setOpen(false); }}
            className="mt-3 w-full rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Active filter chip ───────────────────────────────────────────────────────
const Chip = ({ label, onRemove }) => (
  <span className="flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
    {label}
    <button onClick={onRemove} className="hover:text-red-500 transition"><X size={10} /></button>
  </span>
);

// ─── Pagination button ────────────────────────────────────────────────────────
const PagBtn = ({ children, onClick, disabled, active }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`min-w-9 rounded-lg border px-2.5 py-2 text-sm font-semibold transition
      ${active ? "border-blue-600 bg-blue-600 text-white"
        : disabled ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
        : "border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600"}`}
  >
    {children}
  </button>
);

// ─── Products Page ─────────────────────────────────────────────────────────────
const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword  = searchParams.get("keyword")  ?? "";
  const category = searchParams.get("category") ?? "";
  const brand    = searchParams.get("brand")    ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const rating   = searchParams.get("rating")   ?? "";
  const sort     = searchParams.get("sort")     ?? "";
  const page     = Number(searchParams.get("page") ?? "1");

  const [products, setProducts]     = useState([]);
  const [totalProducts, setTotal]   = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const setParam = useCallback((key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value); else next.delete(key);
      next.delete("page");
      return next;
    });
  }, [setSearchParams]);

  const setPage = (n) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (n > 1) next.set("page", String(n)); else next.delete("page");
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAll = () => setSearchParams({});

  const applyPrice = (min, max) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (min) next.set("minPrice", min); else next.delete("minPrice");
      if (max) next.set("maxPrice", max); else next.delete("maxPrice");
      next.delete("page");
      return next;
    });
  };

  // fetch categories once
  useEffect(() => {
    api.get("/category/")
      .then(({ data }) => setCategories(Array.isArray(data) ? data : data.categories ?? []))
      .catch(() => {});
  }, []);

  // fetch products
  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    const params = { page, limit: PAGE_SIZE };
    if (keyword)  params.keyword  = keyword;
    if (category) params.category = category;
    if (brand)    params.brand    = brand;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (rating)   params.rating   = rating;
    if (sort)     params.sort     = sort;

    api.get("/product/", { params, signal: ctrl.signal })
      .then(({ data }) => {
        const list  = data.products ?? data.data ?? (Array.isArray(data) ? data : []);
        const total = data.totalProducts ?? data.total ?? list.length;
        const tp    = data.totalPages ?? Math.max(1, Math.ceil(total / PAGE_SIZE));
        setProducts(list);
        setTotal(total);
        setTotalPages(tp);
        setBrands([...new Set(list.map((p) => p.brand).filter(Boolean))].sort());
      })
      .catch((err) => { if (err?.code !== "ERR_CANCELED") setError("Failed to load products."); })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [keyword, category, brand, minPrice, maxPrice, rating, sort, page]);

  const activeFilterCount = [category, brand, minPrice || maxPrice, rating].filter(Boolean).length;

  const safePage = Math.min(page, totalPages);
  const pageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const nums = new Set([1, totalPages, safePage, safePage-1, safePage+1].filter((n) => n >= 1 && n <= totalPages));
    const sorted = [...nums].sort((a, b) => a - b);
    const result = [];
    sorted.forEach((n, i) => { if (i > 0 && n - sorted[i-1] > 1) result.push("…"); result.push(n); });
    return result;
  };

  const catOptions    = categories.map((c) => ({ value: c._id, label: c.name }));
  const brandOptions  = brands.map((b) => ({ value: b, label: b }));
  const ratingOptions = RATING_OPTIONS.map((r) => ({ ...r, stars: Number(r.value) }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* ── Filter + Sort bar ── */}
      <div className="mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mr-1">
            <SlidersHorizontal size={13} /> Filters:
          </span>

          <Dropdown
            label="Categories"
            placeholder="Category"
            value={category}
            options={catOptions}
            onChange={(v) => setParam("category", v)}
          />

          {brandOptions.length > 0 && (
            <Dropdown
              label="Brands"
              placeholder="Brand"
              value={brand}
              options={brandOptions}
              onChange={(v) => setParam("brand", v)}
            />
          )}

          <PriceDropdown
            minPrice={minPrice}
            maxPrice={maxPrice}
            onApply={applyPrice}
          />

          <Dropdown
            label="Ratings"
            placeholder="Rating"
            value={rating}
            options={ratingOptions}
            onChange={(v) => setParam("rating", v)}
          />

          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
            >
              <RotateCcw size={11} /> Clear all
            </button>
          )}

          {/* spacer pushes Sort to the right */}
          <div className="flex-1" />

          {/* Sort */}
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-xs font-medium text-gray-400 hidden sm:inline">Sort by</span>
            <Dropdown
              label="Sort"
              placeholder={SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Newest First"}
              value={sort}
              options={SORT_OPTIONS.filter((o) => o.value !== "")}
              onChange={(v) => setParam("sort", v)}
            />
          </div>
        </div>
      </div>

      {/* ── Active filter chips + count ── */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {!loading && (
          <span className="text-sm text-gray-400 mr-1">
            <span className="font-semibold text-gray-700">{totalProducts}</span> product{totalProducts !== 1 ? "s" : ""}
            {totalPages > 1 && ` · Page ${safePage} of ${totalPages}`}
          </span>
        )}
        {category && (
          <Chip
            label={`Category: ${categories.find((c) => c._id === category)?.name ?? category}`}
            onRemove={() => setParam("category", "")}
          />
        )}
        {brand && <Chip label={`Brand: ${brand}`} onRemove={() => setParam("brand", "")} />}
        {(minPrice || maxPrice) && (
          <Chip
            label={`Price: ₹${minPrice || "0"} – ₹${maxPrice || "∞"}`}
            onRemove={() => applyPrice("", "")}
          />
        )}
        {rating && (
          <Chip
            label={`${rating}★ & above`}
            onRemove={() => setParam("rating", "")}
          />
        )}
        {keyword && (
          <Chip
            label={`"${keyword}"`}
            onRemove={() => setParam("keyword", "")}
          />
        )}
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(PAGE_SIZE)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border bg-white p-4 space-y-3">
              <div className="h-44 rounded-lg bg-gray-100" />
              <div className="h-4 w-3/4 rounded bg-gray-100" />
              <div className="h-4 w-1/2 rounded bg-gray-100" />
              <div className="h-9 rounded-lg bg-gray-100" />
            </div>
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div className="flex flex-col items-center gap-2 py-20 text-center">
          <p className="text-red-500">{error}</p>
          <button onClick={() => setSearchParams(searchParams)} className="text-sm text-blue-600 hover:underline">Retry</button>
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && !error && totalProducts === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <Search size={44} className="text-gray-200" />
          <p className="text-base font-semibold text-gray-500">No products found</p>
          <p className="text-sm text-gray-400">Try changing your search or filters</p>
          {(activeFilterCount > 0 || keyword) && (
            <button onClick={clearAll} className="mt-1 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition">
              Clear everything
            </button>
          )}
        </div>
      )}

      {/* ── Products grid ── */}
      {!loading && !error && products.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                id:            product._id,
                title:         product.name,
                price:         product.discountPrice ?? product.price,
                originalPrice: product.discountPrice ? product.price : null,
                image:         product.images?.[0] ?? "",
                rating:        product.ratings ?? product.rating ?? null,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
          <PagBtn onClick={() => setPage(safePage - 1)} disabled={safePage === 1}>← Prev</PagBtn>
          {pageNumbers().map((n, i) =>
            n === "…"
              ? <span key={`e-${i}`} className="px-1 text-gray-400">…</span>
              : <PagBtn key={n} onClick={() => setPage(n)} active={n === safePage}>{n}</PagBtn>
          )}
          <PagBtn onClick={() => setPage(safePage + 1)} disabled={safePage === totalPages}>Next →</PagBtn>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
