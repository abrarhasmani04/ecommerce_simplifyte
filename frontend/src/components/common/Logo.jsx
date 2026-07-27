import logo from "../../assets/logo/logo.jpg";

const Logo = () => {
  return (
    <div className="mb-10 flex flex-col items-center">
      {/* Logo + Brand Name */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="Simplifyte Logo"
          className="h-12 w-80 rounded-lg object-cover"
        />
      </div>

      {/* Tagline */}
      <p className="mt-2 text-sm text-gray-500">Smart Shopping Platform</p>
    </div>
  );
};

export default Logo;
