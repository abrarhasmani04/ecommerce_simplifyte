import { MOCK_RECENT_ORDERS } from "@/constants/adminMockData";

const statusColors = {
  delivered: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
};

const AdminOrders = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Orders</h1>

    <div className="rounded-xl border bg-white shadow-sm overflow-x-auto hover:shadow-md transition">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
            <th className="px-4 py-3">Order ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Seller</th>
            <th className="px-4 py-3">Items</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {MOCK_RECENT_ORDERS.map((order) => (
            <tr key={order.id} className="hover:bg-blue-50 transition-colors">
              <td className="px-4 py-3 font-semibold text-gray-700">{order.id}</td>
              <td className="px-4 py-3 text-gray-600">{order.customer}</td>
              <td className="px-4 py-3 text-gray-600">{order.seller}</td>
              <td className="px-4 py-3 text-gray-600">{order.items}</td>
              <td className="px-4 py-3 font-semibold text-blue-600">${order.amount}</td>
              <td className="px-4 py-3 capitalize text-gray-500">{order.payment}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500">{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminOrders;
