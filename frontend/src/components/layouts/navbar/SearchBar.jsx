import { Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(query.trim())}`);
    }
  };

  const clear = () => setQuery("");

  return (
    <>
      <form
        onSubmit={handleSearch}
        className="sb-form"
        style={{
          width: "100%",
          maxWidth: "520px",
          display: "flex",
          alignItems: "center",
          background: focused ? "#fff" : "#f8fafc",
          border: `1.5px solid ${focused ? "#2563eb" : "#e2e8f0"}`,
          borderRadius: "12px",
          overflow: "hidden",
          transition: "border-color 0.18s, background 0.18s, box-shadow 0.18s",
          boxShadow: focused ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
        }}
      >
        {/* Search icon */}
        <div style={{ paddingLeft: "14px", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <Search size={16} color={focused ? "#2563eb" : "#94a3b8"} strokeWidth={2.2} style={{ transition: "color 0.18s" }} />
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search products, brands, categories…"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            padding: "10px 8px 10px 10px",
            fontSize: "0.84rem",
            color: "#0f172a",
          }}
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={clear}
            style={{ padding: "0 6px", display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={14} color="#94a3b8" />
          </button>
        )}

        {/* Submit */}
        <button
          type="submit"
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #2563eb, #4f46e5)",
            color: "#fff",
            border: "none",
            padding: "0 18px",
            height: "100%",
            minHeight: "42px",
            fontWeight: 700,
            fontSize: "0.8rem",
            cursor: "pointer",
            gap: "6px",
            transition: "opacity 0.15s",
          }}
        >
          <Search size={15} strokeWidth={2.5} />
          <span className="sb-btn-text">Search</span>
        </button>
      </form>

      <style>{`
        .sb-btn-text { display: none; }
        @media (min-width: 900px) { .sb-btn-text { display: inline; } }
      `}</style>
    </>
  );
};

export default SearchBar;
