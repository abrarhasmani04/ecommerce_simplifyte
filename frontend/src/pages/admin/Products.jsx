import { MOCK_TOP_PRODUCTS } from "@/constants/adminMockData";

const AdminProducts = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Products</h1>

    <div className="rounded-xl border bg-white shadow-sm overflow-x-auto hover:shadow-md transition">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Seller</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Sold</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Rating</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {MOCK_TOP_PRODUCTS.map((product) => (
            <tr key={product.id} className="hover:bg-blue-50 transition-colors">
              <td className="px-4 py-3 text-gray-500 font-mono text-xs">{product.id}</td>
              <td className="px-4 py-3 font-semibold text-gray-800">{product.name}</td>
              <td className="px-4 py-3 text-gray-600">{product.category}</td>
              <td className="px-4 py-3 text-gray-600">{product.seller}</td>
              <td className="px-4 py-3 font-semibold text-blue-600">${product.price}</td>
              <td className="px-4 py-3 text-gray-600">{product.sold}</td>
              <td className={`px-4 py-3 font-medium ${product.stock < 20 ? "text-red-500" : "text-gray-600"}`}>
                {product.stock}
              </td>
              <td className="px-4 py-3 text-yellow-500 font-medium">★ {product.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminProducts;
