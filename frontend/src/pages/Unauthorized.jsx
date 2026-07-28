import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-red-600">401</h1>
      <p className="text-xl text-gray-700">Unauthorized</p>
      <p className="text-gray-500">
        You don't have permission to access this page.
      </p>
      <Link
        to="/login"
        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Go to Login
      </Link>
    </div>
  );
};

export default Unauthorized;
