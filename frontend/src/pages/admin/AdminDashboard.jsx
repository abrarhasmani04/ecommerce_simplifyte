import { Users, Store, Package, ShoppingCart, Clock } from "lucide-react";
import {
  MOCK_DASHBOARD_STATS,
  MOCK_RECENT_ORDERS,
  MOCK_RECENT_ACTIVITY,
} from "@/constants/adminMockData";

const statusColors = {
  delivered: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
};

const StatCard = ({ label, value, growth, icon: Icon, color }) => (
  <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-800">
        {value.toLocaleString()}
      </p>
      {growth !== undefined && (
        <p
          className={`text-xs font-medium ${growth >= 0 ? "text-green-600" : "text-red-500"}`}
        >
          {growth >= 0 ? "+" : ""}
          {growth}% this month
        </p>
      )}
    </div>
  </div>
);

const AdminDashboard = () => {
  const s = MOCK_DASHBOARD_STATS;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={s.totalUsers}
          growth={s.usersGrowth}
          icon={Users}
          color="bg-blue-600"
        />
        <StatCard
          label="Total Sellers"
          value={s.totalSellers}
          growth={s.sellersGrowth}
          icon={Store}
          color="bg-purple-500"
        />
        <StatCard
          label="Total Products"
          value={s.totalProducts}
          icon={Package}
          color="bg-indigo-500"
        />
        <StatCard
          label="Total Orders"
          value={s.totalOrders}
          growth={s.ordersGrowth}
          icon={ShoppingCart}
          color="bg-green-500"
        />
      </div>

      {/* Revenue + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Recent Orders
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                  <th className="pb-2 pr-4">Order</th>
                  <th className="pb-2 pr-4">Customer</th>
                  <th className="pb-2 pr-4">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_RECENT_ORDERS.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-2.5 pr-4 font-medium text-gray-700">
                      {order.id}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-600">
                      {order.customer}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-700">
                      ${order.amount}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Recent Activity
          </h3>
          <ul className="space-y-3">
            {MOCK_RECENT_ACTIVITY.map((act) => (
              <li key={act.id} className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-full bg-blue-50">
                  <Clock size={12} className="text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-700 leading-snug">
                    {act.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{act.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
