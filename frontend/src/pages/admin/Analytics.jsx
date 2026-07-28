import { MOCK_DASHBOARD_STATS, MOCK_REVENUE_DATA, MOCK_CATEGORY_DATA } from "@/constants/adminMockData";

const AdminAnalytics = () => {
  const s = MOCK_DASHBOARD_STATS;
  const maxRevenue = Math.max(...MOCK_REVENUE_DATA.map((d) => d.revenue));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Analytics</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Revenue", value: `$${s.totalRevenue.toLocaleString()}`, growth: s.revenueGrowth },
          { label: "Total Orders", value: s.totalOrders.toLocaleString(), growth: s.ordersGrowth },
          { label: "Total Users", value: s.totalUsers.toLocaleString(), growth: s.usersGrowth },
        ].map(({ label, value, growth }) => (
          <div key={label} className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
            <p className={`text-xs font-medium mt-1 ${growth >= 0 ? "text-green-600" : "text-red-500"}`}>
              {growth >= 0 ? "+" : ""}{growth}% this month
            </p>
          </div>
        ))}
      </div>

      {/* Revenue Bar Chart */}
      <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition">
        <h3 className="text-lg font-bold text-gray-800 mb-5">Monthly Revenue</h3>
        <div className="flex items-end gap-2 h-40">
          {MOCK_REVENUE_DATA.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                title={`$${d.revenue.toLocaleString()}`}
              />
              <span className="text-xs text-gray-400">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition">
        <h3 className="text-lg font-bold text-gray-800 mb-5">Category Distribution</h3>
        <div className="space-y-4">
          {MOCK_CATEGORY_DATA.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-36 shrink-0">{cat.name}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full"
                  style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-500 w-8 text-right">{cat.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
