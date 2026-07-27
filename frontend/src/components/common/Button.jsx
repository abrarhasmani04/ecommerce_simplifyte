const Button = ({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) => {
  const base =
    "w-full rounded-xl py-3 font-semibold transition-all duration-300";

  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",

    secondary: "border border-gray-300 bg-white hover:bg-gray-100",

    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      className={`${base} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
