import { Star } from "lucide-react";

const Rating = ({ value = 0, max = 5 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < Math.round(value)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
      <span className="ml-1 text-xs text-gray-500">({value.toFixed(1)})</span>
    </div>
  );
};

export default Rating;
