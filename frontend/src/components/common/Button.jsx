const Button = ({
  children,
  type = "button",
  disabled = false,
  variant = "primary",
  onClick,
}) => {

  const styles =
    variant === "secondary"
      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
      : "bg-blue-600 text-white hover:bg-blue-700";


  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        w-full
        py-3
        rounded-lg
        font-semibold
        transition
        duration-200
        ${styles}
        disabled:opacity-50
        disabled:cursor-not-allowed
      `}
    >
      {children}
    </button>
  );
};


export default Button;