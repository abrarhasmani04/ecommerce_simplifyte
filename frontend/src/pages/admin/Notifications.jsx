import { MOCK_NOTIFICATIONS } from "@/constants/adminMockData";

const typeColors = {
  seller: "bg-orange-100 text-orange-600",
  order: "bg-blue-100 text-blue-600",
  product: "bg-red-100 text-red-600",
  user: "bg-purple-100 text-purple-600",
  report: "bg-green-100 text-green-600",
  system: "bg-gray-100 text-gray-600",
};

const AdminNotifications = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Notifications</h1>
      <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors">
        Mark all as read
      </button>
    </div>

    <div className="space-y-3">
      {MOCK_NOTIFICATIONS.map((n) => (
        <div
          key={n.id}
          className={`rounded-xl border bg-white p-4 flex items-start gap-4 shadow-sm hover:shadow-md transition ${n.read ? "border-gray-200" : "border-blue-200 bg-blue-50/30"}`}
        >
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full capitalize shrink-0 ${typeColors[n.type] || "bg-gray-100 text-gray-600"}`}
          >
            {n.type}
          </span>
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-semibold ${n.read ? "text-gray-700" : "text-gray-900"}`}
            >
              {n.title}
            </p>
            <p className="text-sm text-gray-500">{n.message}</p>
          </div>
          <span className="text-xs text-gray-400 shrink-0">{n.time}</span>
          {!n.read && (
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 shrink-0" />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default AdminNotifications;
