import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import api from "@/services/axios";

const STATUS_BADGE = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const SellerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // expanded row for details
  const [expandedId, setExpandedId] = useState(null);

  // per-row action state: { [id]: { loading, rejectOpen, rejectionReason, actionError } }
  const [rowState, setRowState] = useState({});

  const setRow = (id, patch) =>
    setRowState((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/seller-applications");
      setApplications(data.applications ?? data ?? []);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleApprove = async (id) => {
    setRow(id, { loading: true, actionError: "" });
    try {
      await api.put(`/admin/seller-applications/${id}`, { status: "Approved" });
      setApplications((prev) =>
        prev.map((a) => (a._id === id || a.id === id ? { ...a, status: "approved" } : a))
      );
    } catch (err) {
      setRow(id, { actionError: err?.response?.data?.message ?? "Action failed." });
    } finally {
      setRow(id, { loading: false });
    }
  };

  const handleReject = async (id) => {
    const reason = rowState[id]?.rejectionReason ?? "";
    if (!reason.trim()) {
      setRow(id, { actionError: "Please enter a rejection reason." });
      return;
    }
    setRow(id, { loading: true, actionError: "" });
    try {
      await api.put(`/admin/seller-applications/${id}`, {
        status: "Rejected",
        rejectionReason: reason,
      });
      setApplications((prev) =>
        prev.map((a) =>
          a._id === id || a.id === id
            ? { ...a, status: "rejected", rejectionReason: reason }
            : a
        )
      );
      setRow(id, { rejectOpen: false, rejectionReason: "" });
    } catch (err) {
      setRow(id, { actionError: err?.response?.data?.message ?? "Action failed." });
    } finally {
      setRow(id, { loading: false });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Seller Applications</h1>
          <p className="text-slate-500">Approve or reject seller requests</p>
        </div>
        <button
          onClick={fetchApplications}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="overflow-hidden rounded-xl border bg-white">
        {loading && applications.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <RefreshCw size={20} className="mr-2 animate-spin" /> Loading...
          </div>
        ) : applications.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">No applications yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-4 text-left">Business Name</th>
                <th className="p-4 text-left">Applicant</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
                <th className="p-4 text-left">Details</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((item) => {
                const id = item._id ?? item.id;
                const status = item.status?.toLowerCase() ?? "pending";
                const rs = rowState[id] ?? {};
                const isPending = status === "pending";

                return (
                  <>
                    <tr key={id} className="border-t hover:bg-slate-50/50 transition">
                      {/* Business Name */}
                      <td className="p-4 font-medium text-slate-800">{item.businessName}</td>

                      {/* Applicant */}
                      <td className="p-4 text-slate-600">
                        {item.user?.name ?? item.userName ?? "—"}
                        {item.user?.email && (
                          <span className="block text-xs text-slate-400">{item.user.email}</span>
                        )}
                      </td>

                      {/* Phone */}
                      <td className="p-4 text-slate-600">{item.phone ?? "—"}</td>

                      {/* Status badge */}
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            STATUS_BADGE[status] ?? "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {status === "pending" && <Clock size={11} className="mr-1 inline" />}
                          {status === "approved" && <CheckCircle size={11} className="mr-1 inline" />}
                          {status === "rejected" && <XCircle size={11} className="mr-1 inline" />}
                          {status}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="p-4">
                        {isPending ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(id)}
                              disabled={rs.loading}
                              className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                            >
                              {rs.loading && !rs.rejectOpen ? "..." : "Approve"}
                            </button>
                            <button
                              onClick={() =>
                                setRow(id, { rejectOpen: !rs.rejectOpen, actionError: "" })
                              }
                              disabled={rs.loading}
                              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">—</span>
                        )}
                      </td>

                      {/* Expand / collapse */}
                      <td className="p-4">
                        <button
                          onClick={() => setExpandedId((prev) => (prev === id ? null : id))}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                          {expandedId === id ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Reject mini-form */}
                    {isPending && rs.rejectOpen && (
                      <tr key={`${id}-reject`} className="border-t bg-red-50/40">
                        <td colSpan={6} className="px-6 py-4">
                          <p className="mb-2 text-xs font-semibold text-red-700">
                            Enter rejection reason
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={rs.rejectionReason ?? ""}
                              onChange={(e) => setRow(id, { rejectionReason: e.target.value })}
                              placeholder="e.g. Incomplete GST details"
                              className="flex-1 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200"
                            />
                            <button
                              onClick={() => handleReject(id)}
                              disabled={rs.loading}
                              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                            >
                              {rs.loading ? "..." : "Confirm Reject"}
                            </button>
                            <button
                              onClick={() => setRow(id, { rejectOpen: false, actionError: "" })}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </div>
                          {rs.actionError && (
                            <p className="mt-1.5 text-xs text-red-600">{rs.actionError}</p>
                          )}
                        </td>
                      </tr>
                    )}

                    {/* Expanded details row */}
                    {expandedId === id && (
                      <tr key={`${id}-detail`} className="border-t bg-slate-50/60">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {item.gstNumber && (
                              <div>
                                <p className="text-xs font-medium text-slate-500">GST Number</p>
                                <p className="text-sm text-slate-700">{item.gstNumber}</p>
                              </div>
                            )}
                            {item.aboutBusiness && (
                              <div className="sm:col-span-2">
                                <p className="text-xs font-medium text-slate-500">About Business</p>
                                <p className="text-sm text-slate-700">{item.aboutBusiness}</p>
                              </div>
                            )}
                            {item.rejectionReason && (
                              <div className="sm:col-span-2">
                                <p className="text-xs font-medium text-red-500">Rejection Reason</p>
                                <p className="text-sm text-red-700">{item.rejectionReason}</p>
                              </div>
                            )}
                            {!item.gstNumber && !item.aboutBusiness && !item.rejectionReason && (
                              <p className="text-xs text-slate-400">No additional details.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SellerApplications;
