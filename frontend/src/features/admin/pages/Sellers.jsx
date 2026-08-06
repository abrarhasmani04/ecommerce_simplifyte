import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Store } from "lucide-react";
import api from "@/services/axios";

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSellers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/get-sellers");
      const list = data?.sellers ?? data?.data ?? data;
      setSellers(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load sellers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  const fmtDate = (val) => {
    if (!val) return "—";
    return new Date(val).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sellers</h1>
          <p className="text-slate-500 text-sm">Manage seller accounts</p>
        </div>
        <button
          onClick={fetchSellers}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table card */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {loading && sellers.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <RefreshCw size={20} className="mr-2 animate-spin" /> Loading sellers...
          </div>
        ) : sellers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <Store size={40} className="text-slate-300" />
            <p className="text-sm">No sellers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Verified</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller, idx) => {
                  const id = seller._id ?? seller.id ?? idx;
                  return (
                    <tr key={id} className="border-t hover:bg-slate-50/60 transition">
                      {/* Name */}
                      <td className="p-4 font-medium text-slate-800">
                        {seller.name ?? "—"}
                      </td>

                      {/* Email */}
                      <td className="p-4 text-slate-600">
                        {seller.email ?? "—"}
                      </td>

                      {/* Verified */}
                      <td className="p-4">
                        {seller.isVerified ? (
                          <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-medium">
                            Verified
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-100 text-yellow-700 px-3 py-1 text-xs font-medium">
                            Unverified
                          </span>
                        )}
                      </td>

                      {/* Active status */}
                      <td className="p-4">
                        {seller.isActive ? (
                          <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-medium">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Joined date */}
                      <td className="p-4 text-slate-600 whitespace-nowrap">
                        {fmtDate(seller.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer count */}
      {!loading && sellers.length > 0 && (
        <p className="text-xs text-slate-400 text-right">
          Showing {sellers.length} seller{sellers.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default Sellers;
