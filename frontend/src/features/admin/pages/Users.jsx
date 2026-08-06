import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Users as UsersIcon, Trash2, AlertTriangle } from "lucide-react";
import api from "@/services/axios";

/* ─── Confirm-delete modal ─────────────────────────────────────────────── */
const DeleteConfirmModal = ({ user, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle size={20} className="text-red-600" />
        </div>
        <h2 className="text-base font-semibold text-slate-800">Delete User</h2>
      </div>
      <p className="mb-1 text-sm text-slate-600">
        Are you sure you want to delete{" "}
        <span className="font-medium text-slate-800">
          {user.name ?? user.fullName ?? "this user"}
        </span>
        ?
      </p>
      <p className="mb-6 text-xs text-slate-400">This action cannot be undone.</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {loading && <RefreshCw size={13} className="animate-spin" />}
          Delete
        </button>
      </div>
    </div>
  </div>
);

/* ─── Main page ─────────────────────────────────────────────────────────── */
const Users = () => {
  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);   // user object to delete
  const [deleting, setDeleting]       = useState(false);
  const [successMsg, setSuccessMsg]   = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/users");
      const list = data?.users ?? data?.data ?? (Array.isArray(data) ? data : []);
      setUsers(list);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setUsers([]);
      } else {
        setError(err?.response?.data?.message ?? "Failed to load users.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const userId = deleteTarget._id ?? deleteTarget.id;
      await api.delete(`/admin/user-delete/${userId}`);
      setUsers((prev) =>
        prev.filter((u) => (u._id ?? u.id) !== (deleteTarget._id ?? deleteTarget.id))
      );
      setSuccessMsg(`User "${deleteTarget.name ?? deleteTarget.fullName}" deleted successfully.`);
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to delete user.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const fmtDate = (val) => {
    if (!val) return "—";
    return new Date(val).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          user={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Users</h1>
          <p className="text-sm text-slate-500">All registered users on the platform</p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Success */}
      {successMsg && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{successMsg}</div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Table card */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <RefreshCw size={20} className="mr-2 animate-spin" /> Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <UsersIcon size={40} className="text-slate-300" />
            <p className="text-sm">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-4 text-left">#</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Joined</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => {
                  const id     = user._id ?? user.id;
                  const role   = (user.role ?? "user").toLowerCase();
                  const active = user.isActive ?? user.active ?? true;
                  const isAdmin = role === "admin";

                  return (
                    <tr key={id ?? idx} className="border-t hover:bg-slate-50/60 transition">

                      {/* Serial */}
                      <td className="p-4 text-slate-400 text-xs">{idx + 1}</td>

                      {/* Name + avatar initials */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                            {(user.name ?? user.fullName ?? "?")[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-800">
                            {user.name ?? user.fullName ?? "—"}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4 text-slate-600">{user.email ?? "—"}</td>

                      {/* Role badge */}
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : role === "seller"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {role}
                        </span>
                      </td>

                      {/* Joined date */}
                      <td className="p-4 text-slate-500 whitespace-nowrap">
                        {fmtDate(user.createdAt)}
                      </td>

                      {/* Active / Inactive */}
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Delete action */}
                      <td className="p-4">
                        {isAdmin ? (
                          <span className="text-xs text-slate-300">—</span>
                        ) : (
                          <button
                            onClick={() => setDeleteTarget(user)}
                            className="flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                            title="Delete user"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer count */}
      {!loading && users.length > 0 && (
        <p className="text-right text-xs text-slate-400">
          {users.length} user{users.length !== 1 ? "s" : ""} total
        </p>
      )}

    </div>
  );
};

export default Users;
