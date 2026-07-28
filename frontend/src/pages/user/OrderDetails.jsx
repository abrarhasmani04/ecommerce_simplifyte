import { useParams, Link } from "react-router-dom";
import { Package, ArrowLeft } from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <h1 className="text-3xl font-bold mb-8">Order Details</h1>

      <div className="rounded-xl border bg-white p-12 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition">
        <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-5">
          <Package size={36} className="text-indigo-400" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Order #{id || "—"}</h2>
        <p className="text-gray-500 max-w-xs">
          Full order details will be available here once orders are connected to the API.
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;
