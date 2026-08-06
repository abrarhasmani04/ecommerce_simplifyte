import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  ShoppingBag,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { fetchSellerAnalytics } from "@/redux/sellerSlice";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const fmt = (val) =>
  val !== undefined && val !== null
    ? `₹${Number(val).toLocaleString("en-IN")}`
    : "—";

// ─── SVG Bar Chart ──────────────────────────────────────────────────────────
const BarChart = ({ data }) => {
  // Fill all 12 months, default revenue 0
  const months = Array.from({ length: 12 }, (_, i) => {
    const found = data.find((d) => d.month === i + 1);
    return { month: i + 1, revenue: found?.revenue ?? 0 };
  });

  const maxRevenue = Math.max(...months.map((m) => m.revenue), 1);

  const WIDTH = 600;
  const HEIGHT = 200;
  const BAR_GAP = 6;
  const barWidth = (WIDTH - BAR_GAP * 13) / 12;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT + 32}`}
      className="w-full"
      aria-label="Monthly sales chart"
    >
      {/* Y-axis guide lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = HEIGHT - HEIGHT * ratio;
        return (
          <line
            key={ratio}
            x1={0}
            x2={WIDTH}
            y1={y}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        );
      })}

      {/* Bars */}
      {months.map((m, i) => {
        const barH = Math.max((m.revenue / maxRevenue) * HEIGHT, m.revenue > 0 ? 4 : 0);
        const x = BAR_GAP + i * (barWidth + BAR_GAP);
        const y = HEIGHT - barH;

        return (
          <g key={m.month}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              rx={3}
              fill={m.revenue > 0 ? "#3b82d4" : "#e5e7eb"}
            />
            {/* Month label */}
            <text
              x={x + barWidth / 2}
              y={HEIGHT + 18}
              textAnchor="middle"
              fontSize={9}
              fill="#57606a"
            >
              {MONTHS[m.month - 1]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const SellerStatistics = () => {
  const dispatch = useDispatch();
  const { analytics, analyticsLoading, analyticsError } = useSelector(
    (state) => state.seller
  );

  useEffect(() => {
    dispatch(fetchSellerAnalytics());
  }, [dispatch]);

  const statCards = [
    {
      label: "Total Products",
      value: analytics?.totalProducts ?? "—",
      icon: Package,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Total Orders",
      value: analytics?.totalOrders ?? "—",
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Customers",
      value: analytics?.totalCustomers ?? "—",
      icon: Users,
      color: "bg-sky-100 text-sky-600",
    },
    {
      label: "Pending Orders",
      value: analytics?.pendingOrders ?? "—",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Delivered Orders",
      value: analytics?.deliveredOrders ?? "—",
      icon: CheckCircle,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Total Revenue",
      value: analytics?.totalRevenue != null ? fmt(analytics.totalRevenue) : "—",
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Statistics</h1>
          <p className="text-sm text-slate-500">Overview of your store performance</p>
        </div>
        <button
          onClick={() => dispatch(fetchSellerAnalytics())}
          disabled={analyticsLoading}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={analyticsLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {analyticsError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {analyticsError}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-800">
                    {analyticsLoading ? (
                      <span className="inline-block h-7 w-20 animate-pulse rounded bg-slate-200" />
                    ) : (
                      card.value
                    )}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${card.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Sales Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-700">
          Monthly Revenue (Paid Orders)
        </h2>
        {analyticsLoading ? (
          <div className="flex h-40 items-center justify-center text-slate-400">
            <RefreshCw size={20} className="mr-2 animate-spin" />
            Loading chart...
          </div>
        ) : analytics?.monthlySales?.length ? (
          <BarChart data={analytics.monthlySales} />
        ) : (
          <div className="flex h-40 items-center justify-center text-sm text-slate-400">
            No sales data available yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerStatistics;
