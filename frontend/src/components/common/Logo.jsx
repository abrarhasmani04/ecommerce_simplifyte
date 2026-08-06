import { Link } from "react-router-dom";
import logo from "../../assets/E-commerce-logo.jpg";
import { ROUTES } from "../../constants/routes";

const Logo = ({ variant = "auth" }) => {
  if (variant === "navbar") {
    return (
      <Link
        to={ROUTES.HOME}
        className="group flex items-center gap-2 select-none"
      >
        <img
          src={logo}
          alt="E-Commerce logo"
          className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-100 group-hover:ring-blue-400 transition-all duration-200"
        />
        <span className="text-xl font-bold tracking-tight text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
          E&#8209;Commerce
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={ROUTES.HOME}
      className="group flex flex-col items-center gap-1 mb-6 select-none"
    >
      <img
        src={logo}
        alt="E-Commerce logo"
        className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-100 group-hover:ring-blue-400 transition-all duration-200"
      />
      <span className="text-2xl font-bold tracking-tight text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
        E&#8209;Commerce
      </span>
    </Link>
  );
};

export default Logo;
