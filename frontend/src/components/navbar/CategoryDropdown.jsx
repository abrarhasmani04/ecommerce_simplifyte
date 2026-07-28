import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  "Electronics",
  "Fashion",
  "Shoes",
  "Beauty",
  "Furniture",
  "Sports",
  "Books",
  "Toys",
];

const CategoryDropdown = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative hidden md:block">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
      >
        Categories <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute left-0 top-11 z-50 w-48 rounded-xl border bg-white py-2 shadow-lg">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-gray-50"
            >
              {cat}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
