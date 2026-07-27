import React from "react";

const Input = React.forwardRef(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}

        <input
          ref={ref}
          {...props}
          className={`w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 ${className}`}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
