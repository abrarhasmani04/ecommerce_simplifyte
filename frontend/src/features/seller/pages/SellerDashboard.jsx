import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBag, Package, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { fetchSellerDashboard } from "@/redux/sellerSlice";

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { dashboard, dashboardLoading, dashboardError } = useSelector(
    (state) => state.seller
  );

  useEffect(() => {
    dispatch(fetchSellerDashboard());
  }, [dispatch]);

  const stats = [
    {
      label: "Total Orders",
      value: dashboard?.totalOrders ?? "—",
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Products Listed",
      value: dashboard?.totalProducts ?? "—",
      icon: Package,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Revenue",
      value:
        dashboard?.totalRevenue != null
          ? `₹${dashboard.totalRevenue.toLocaleString("en-IN")}`
          : "—",
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Pending Orders",
      value: dashboard?.pendingOrders ?? "—",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Delivered Orders",
      value: dashboard?.deliveredOrders ?? "—",
      icon: CheckCircle,
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

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

      {/* Error */}
      {dashboardError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {dashboardError}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
                    {dashboardLoading ? (
                      <span className="inline-block h-7 w-16 animate-pulse rounded bg-slate-200" />
                    ) : (
                      stat.value
                    )}
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
    </div>
  );
};

export default SellerDashboard;
