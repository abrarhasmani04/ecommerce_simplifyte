import { MOCK_TOP_SELLERS } from "@/constants/adminMockData";

const statusBadge = {
  active: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700",
};

const AdminSellers = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Sellers</h1>

    <div className="rounded-xl border bg-white shadow-sm overflow-x-auto hover:shadow-md transition">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Business</th>
            <th className="px-4 py-3">Owner</th>
            <th className="px-4 py-3">Products</th>
            <th className="px-4 py-3">Orders</th>
            <th className="px-4 py-3">Revenue</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {MOCK_TOP_SELLERS.map((seller) => (
            <tr key={seller.id} className="hover:bg-blue-50 transition-colors">
              <td className="px-4 py-3 text-gray-500 font-mono text-xs">{seller.id}</td>
              <td className="px-4 py-3 font-semibold text-gray-800">{seller.name}</td>
              <td className="px-4 py-3 text-gray-600">{seller.owner}</td>
              <td className="px-4 py-3 text-gray-600">{seller.products}</td>
              <td className="px-4 py-3 text-gray-600">{seller.orders.toLocaleString()}</td>
              <td className="px-4 py-3 font-semibold text-blue-600">${seller.revenue.toLocaleString()}</td>
              <td className="px-4 py-3 text-yellow-500 font-medium">★ {seller.rating}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge[seller.status] || "bg-gray-100 text-gray-600"}`}>
                  {seller.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminSellers;
