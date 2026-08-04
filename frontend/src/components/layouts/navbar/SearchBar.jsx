import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full rounded-l-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="rounded-r-lg bg-blue-600 px-5 text-white hover:bg-blue-700"
      >
        <Search size={18} />
      </button>
    </form>
  );
};

export default SearchBar;
