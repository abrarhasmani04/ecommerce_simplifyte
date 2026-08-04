const PasswordInput = ({ label, ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        type="password"

        {...props}

        className="
          w-full
          px-4
          py-2.5
          border
          border-gray-300
          rounded-lg
          outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />
    </div>
  );
};

export default PasswordInput;
