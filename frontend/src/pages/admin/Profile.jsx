import { useSelector } from "react-redux";

const AdminProfile = () => {
  const user = useSelector((state) => state.auth?.user);

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-3xl font-bold">Profile</h1>

      {/* Avatar Card */}
      <div className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold select-none shrink-0">
          {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">{user?.name || "Admin"}</p>
          <p className="text-sm text-gray-500">{user?.email || "admin@simplifyte.com"}</p>
          <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            ADMIN
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="rounded-xl border bg-white shadow-sm divide-y divide-gray-100 hover:shadow-md transition">
        {[
          { label: "Full Name", value: user?.name || "Admin User" },
          { label: "Email", value: user?.email || "admin@simplifyte.com" },
          { label: "Role", value: "Administrator" },
          { label: "Account Status", value: "Active" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-semibold text-gray-800">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProfile;
