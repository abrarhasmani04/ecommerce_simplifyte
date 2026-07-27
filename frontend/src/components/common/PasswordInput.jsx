import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = React.forwardRef(
  ({ label, error, className = "", ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>

        <div className="relative">
          <input
            ref={ref}
            type={show ? "text" : "password"}
            {...props}
            className={`w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-blue-600 ${className}`}
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-3"
          >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
