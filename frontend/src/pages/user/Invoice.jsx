import { useParams, Link } from "react-router-dom";
import { FileText, Download, ArrowLeft } from "lucide-react";

const Invoice = () => {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Invoice</h1>
        <button className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
          <Download size={15} /> Download PDF
        </button>
      </div>

      <div className="rounded-xl border bg-white p-12 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5">
          <FileText size={36} className="text-blue-400" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Invoice #{id || "—"}</h2>
        <p className="text-gray-500 max-w-xs">
          The full invoice will be available here once orders are connected to the API.
        </p>
      </div>
    </div>
  );
};

export default Invoice;
