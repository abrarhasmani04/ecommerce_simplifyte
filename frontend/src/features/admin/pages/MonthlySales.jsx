import { useState, useEffect, useCallback } from "react";
import { RefreshCw, TrendingUp, DollarSign, ShoppingCart, BarChart2 } from "lucide-react";
import api from "@/services/axios";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const fmt = (val) =>
  val !== undefined && val !== null
    ? `₹${Number(val).toLocaleString("en-IN")}`
    : "—";

const MonthlySales = () => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data: res } = await api.get("/admin/monthly-sales");
      const list = res?.monthlySales ?? res?.data ?? res;
      setData(Array.isArray(list) ? list : []);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setData([]);
      } else {
        setError(err?.response?.data?.message ?? "Failed to load monthly sales.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* Derived totals */
  const totalRevenue = data.reduce((sum, d) => sum + (d.revenue ?? d.sales ?? d.total ?? 0), 0);
  const totalOrders  = data.reduce((sum, d) => sum + (d.orders ?? 0), 0);
  const peakMonth    = data.reduce(
    (best, d) =>
      (d.revenue ?? d.sales ?? d.total ?? 0) > (best.revenue ?? best.sales ?? best.total ?? 0)
        ? d
        : best,
    data[0] ?? {}
  );
  const peakLabel =
    peakMonth.month !== undefined
      ? MONTH_NAMES[(Number(peakMonth.month) - 1 + 12) % 12]
      : peakMonth.label ?? peakMonth.name ?? "—";

  const summaryCards = [
    { title: "Total Revenue (YTD)", value: fmt(totalRevenue),   icon: DollarSign,  color: "bg-blue-100 text-blue-600"   },
    { title: "Total Orders (YTD)",  value: totalOrders > 0 ? totalOrders.toLocaleString("en-IN") : "—", icon: ShoppingCart, color: "bg-purple-100 text-purple-600" },
    { title: "Peak Month",          value: peakLabel,           icon: TrendingUp,  color: "bg-green-100 text-green-600" },
    { title: "Months Tracked",      value: data.length || "—",  icon: BarChart2,   color: "bg-yellow-100 text-yellow-600" },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Monthly Sales</h1>
          <p className="text-sm text-slate-500">Revenue and order trends over time</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <RefreshCw size={20} className="mr-2 animate-spin" /> Loading...
        </div>
      )}

      {/* Summary cards — only when data available */}
      {!loading && data.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{card.title}</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-800">{card.value}</h2>
                  </div>
                  <div className={`rounded-full p-3 ${card.color}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Monthly breakdown table */}
      {!loading && (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b p-4">
            <h2 className="font-semibold text-slate-800">Monthly Breakdown</h2>
          </div>

          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <BarChart2 size={40} className="text-slate-300" />
              <p className="text-sm">No sales data available yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b">
                  <tr>
                    <th className="p-4 text-left">Month</th>
                    <th className="p-4 text-right">Revenue</th>
                    {data.some((d) => d.orders !== undefined) && (
                      <th className="p-4 text-right">Orders</th>
                    )}
                    {data.some((d) => d.avgOrderValue !== undefined) && (
                      <th className="p-4 text-right">Avg. Order Value</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.map((d, i) => {
                    const label =
                      d.month !== undefined
                        ? MONTH_NAMES[(Number(d.month) - 1 + 12) % 12] + (d.year ? ` ${d.year}` : "")
                        : d.label ?? d.name ?? `Month ${i + 1}`;
                    const revenue = d.revenue ?? d.sales ?? d.total ?? 0;
                    const isPeak  = peakMonth && (
                      d.month !== undefined ? d.month === peakMonth.month : d.label === peakMonth.label
                    );

                    return (
                      <tr
                        key={i}
                        className={`border-t transition hover:bg-slate-50/60 ${isPeak ? "bg-blue-50/40" : ""}`}
                      >
                        <td className="p-4 font-medium text-slate-800">
                          {label}
                          {isPeak && (
                            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                              Peak
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right font-semibold text-slate-800">{fmt(revenue)}</td>
                        {data.some((d) => d.orders !== undefined) && (
                          <td className="p-4 text-right text-slate-600">
                            {d.orders?.toLocaleString("en-IN") ?? "—"}
                          </td>
                        )}
                        {data.some((d) => d.avgOrderValue !== undefined) && (
                          <td className="p-4 text-right text-slate-600">
                            {d.avgOrderValue ? fmt(d.avgOrderValue) : "—"}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthlySales;
