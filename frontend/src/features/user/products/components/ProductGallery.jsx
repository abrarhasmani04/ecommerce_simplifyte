import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductGallery = ({ images = [], title = "" }) => {
  const [selected, setSelected] = useState(0);

  const prev = () =>
    setSelected((s) => (s === 0 ? images.length - 1 : s - 1));
  const next = () =>
    setSelected((s) => (s === images.length - 1 ? 0 : s + 1));

  if (!images.length) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 text-sm">
        No Image Available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <img
          src={images[selected]}
          alt={`${title} - view ${selected + 1}`}
          className="mx-auto h-96 w-full object-contain p-6 transition-all duration-300"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow hover:bg-white transition"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow hover:bg-white transition"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 h-16 w-16 overflow-hidden rounded-xl border-2 transition ${
                selected === i
                  ? "border-blue-600 shadow-md"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <img
                src={src}
                alt={`${title} thumbnail ${i + 1}`}
                className="h-full w-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
