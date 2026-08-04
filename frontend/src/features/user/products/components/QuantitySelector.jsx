import { Minus, Plus } from "lucide-react";

const QuantitySelector = ({ value = 1, min = 1, max = 99, disabled = false, onChange }) => {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };
  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center gap-0">
      <button
        onClick={decrement}
        disabled={disabled || value <= min}
        className="flex h-10 w-10 items-center justify-center rounded-l-lg border border-gray-300 bg-gray-50 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>

      <span className="flex h-10 w-12 items-center justify-center border-y border-gray-300 bg-white text-sm font-semibold text-gray-800 select-none">
        {value}
      </span>

      <button
        onClick={increment}
        disabled={disabled || value >= max}
        className="flex h-10 w-10 items-center justify-center rounded-r-lg border border-gray-300 bg-gray-50 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

export default QuantitySelector;
