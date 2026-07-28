import { Link } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";

const Orders = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

      <div className="rounded-xl border bg-white p-12 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition">
        <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-5">
          <Package size={36} className="text-indigo-400" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6 max-w-xs">
          You haven't placed any orders yet. Start shopping and track your orders here!
        </p>
        <Link
          to="/home"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Start Shopping <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default Orders;
