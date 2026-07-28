import { MOCK_SELLER_APPLICATIONS } from "@/constants/adminMockData";

const statusBadge = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const SellerApplications = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">Seller Applications</h1>

    <div className="grid gap-4">
      {MOCK_SELLER_APPLICATIONS.map((app) => (
        <div key={app.id} className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-bold text-gray-800 text-base">{app.businessName}</p>
              <p className="text-sm text-gray-500 mt-0.5">{app.ownerName} · {app.email} · {app.phone}</p>
              <p className="text-sm text-gray-600 mt-2">{app.description}</p>
              <p className="text-xs text-gray-400 mt-1">Category: {app.category} · Applied: {app.appliedAt}</p>
              {app.rejectionReason && (
                <p className="text-xs text-red-500 mt-1">Reason: {app.rejectionReason}</p>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize shrink-0 ${statusBadge[app.status]}`}>
              {app.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SellerApplications;
