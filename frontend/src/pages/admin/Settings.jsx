const AdminSettings = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Settings</h1>

    <div className="rounded-xl border bg-white shadow-sm divide-y divide-gray-100 hover:shadow-md transition">
      {[
        { label: "Site Name", value: "SimplifyTE", type: "text" },
        { label: "Support Email", value: "support@simplifyte.com", type: "email" },
        { label: "Max Products per Seller", value: "500", type: "number" },
        { label: "Commission Rate (%)", value: "5", type: "number" },
      ].map(({ label, value, type }) => (
        <div key={label} className="flex items-center justify-between px-5 py-4 gap-4">
          <label className="text-sm font-semibold text-gray-700 w-48 shrink-0">{label}</label>
          <input
            type={type}
            defaultValue={value}
            className="flex-1 max-w-sm text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 transition"
          />
        </div>
      ))}
    </div>

    <div className="rounded-xl border bg-white shadow-sm px-5 py-5 hover:shadow-md transition">
      <p className="text-sm font-semibold text-gray-700 mb-3">Feature Flags</p>
      <div className="space-y-3">
        {["Enable seller registration", "Allow guest checkout", "Show review section"].map((flag) => (
          <label key={flag} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-blue-600 w-4 h-4" />
            {flag}
          </label>
        ))}
      </div>
    </div>

    <button className="bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
      Save Settings
    </button>
  </div>
);

export default AdminSettings;
