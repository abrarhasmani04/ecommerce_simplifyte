const Input = ({ label, error, ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
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
          focus:border-blue-500
        "
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
