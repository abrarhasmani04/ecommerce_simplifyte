const Sellers = () => {
  const sellers = [
    {
      id: 1,
      name: "Tech World",
      email: "techworld@gmail.com",
      status: "Active",
    },
    {
      id: 2,
      name: "Fashion Hub",
      email: "fashionhub@gmail.com",
      status: "Inactive",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Heading */}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Sellers</h1>

        <p className="text-slate-500">Manage seller accounts</p>
      </div>

      {/* Table */}

      <div
        className="
        bg-white
        rounded-xl
        border
        overflow-hidden
        shadow-sm
      "
      >
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Business Name</th>

              <th className="p-4 text-left">Email</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id} className="border-t">
                <td className="p-4">{seller.name}</td>

                <td className="p-4">{seller.email}</td>

                <td className="p-4">
                  {seller.status === "Active" ? (
                    <span
                      className="
                      bg-green-100
                      text-green-700
                      px-3
                      py-1
                      rounded-full
                      "
                    >
                      Active
                    </span>
                  ) : (
                    <span
                      className="
                      bg-red-100
                      text-red-700
                      px-3
                      py-1
                      rounded-full
                      "
                    >
                      Inactive
                    </span>
                  )}
                </td>

                <td className="p-4 flex gap-3">
                  <button
                    className="
                    bg-blue-600
                    text-white
                    px-3
                    py-1
                    rounded-lg
                    "
                  >
                    Edit
                  </button>

                  <button
                    className="
                    bg-slate-700
                    text-white
                    px-3
                    py-1
                    rounded-lg
                    "
                  >
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sellers;
