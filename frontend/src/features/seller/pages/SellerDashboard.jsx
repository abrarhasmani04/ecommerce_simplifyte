import { useSelector } from "react-redux";
import { ShoppingBag, Package, TrendingUp, Star } from "lucide-react";

const stats = [
  { label: "Total Orders", value: "0", icon: ShoppingBag, color: "bg-blue-100 text-blue-600" },
  { label: "Products Listed", value: "0", icon: Package, color: "bg-purple-100 text-purple-600" },
  { label: "Revenue", value: "₹0", icon: TrendingUp, color: "bg-green-100 text-green-600" },
  { label: "Rating", value: "—", icon: Star, color: "bg-yellow-100 text-yellow-600" },
];

const SellerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, {user?.name || "Seller"} 👋
        </h1>
        <p className="mt-1 text-slate-500">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder notice */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        Your orders and product analytics will appear here once you start selling.
      </div>
    </div>
  );
};

export default SellerDashboard;
