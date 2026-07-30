import { useState } from "react";

const ProductImages = ({ images = [], title = "" }) => {
  const [selected, setSelected] = useState(0);

  if (!images.length) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
        No Image
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="overflow-hidden rounded-xl border bg-white">
        <img
          src={images[selected]}
          alt={title}
          className="mx-auto h-80 object-contain p-4"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition ${
                selected === i ? "border-blue-600" : "border-transparent"
              }`}
            >
              <img
                src={src}
                alt={`${title} ${i + 1}`}
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
