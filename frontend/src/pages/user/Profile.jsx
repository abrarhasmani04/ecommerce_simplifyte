import { useSelector } from "react-redux";
import { User, Mail, Shield } from "lucide-react";

const Profile = () => {
  const reduxUser = useSelector((state) => state.auth?.user);
  const user = reduxUser || JSON.parse(localStorage.getItem("user") || "null");

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

      {/* Avatar card */}
      <div className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-5 mb-4 hover:shadow-md transition">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold select-none shrink-0">
          {initial}
        </div>
        <div>
          <p className="text-lg font-bold text-gray-800">{user?.name || "—"}</p>
          <p className="text-sm text-gray-500">{user?.email || "—"}</p>
          <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold capitalize">
            {user?.role?.toLowerCase() || "user"}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="rounded-xl border bg-white shadow-sm divide-y divide-gray-100 hover:shadow-md transition">
        {[
          { label: "Full Name", value: user?.name || "—", icon: User },
          { label: "Email Address", value: user?.email || "—", icon: Mail },
          { label: "Role", value: user?.role?.toLowerCase() || "user", icon: Shield },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Icon size={16} className="text-blue-500 shrink-0" />
              <span className="text-sm text-gray-500">{label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-800 capitalize">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
