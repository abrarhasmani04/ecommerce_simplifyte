import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { setUser } from "@/redux/authSlice";
import api from "@/services/axios";

const ProfileForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [tab, setTab] = useState("info");

  const [name, setName] = useState(user?.name ?? "");
  const [email] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoSuccess, setInfoSuccess] = useState(false);
  const [infoError, setInfoError] = useState("");

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState("");

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "U";

  const handleInfoSave = async (e) => {
    e.preventDefault();
    setInfoError("");
    setInfoSuccess(false);
    setInfoLoading(true);
    try {
      const { data } = await api.put("/user/profile", { name, phone });
      dispatch(setUser(data.user ?? { ...user, name, phone }));
      setInfoSuccess(true);
      toast.success("Profile updated successfully.");
      setTimeout(() => setInfoSuccess(false), 3000);
    } catch (err) {
      const msg = err?.response?.data?.message ?? "Failed to update profile.";
      setInfoError(msg);
      toast.error(msg);
    } finally {
      setInfoLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess(false);
    if (newPwd !== confirmPwd) {
      const msg = "New passwords do not match.";
      setPwdError(msg);
      toast.error(msg);
      return;
    }
    if (newPwd.length < 6) {
      const msg = "Password must be at least 6 characters.";
      setPwdError(msg);
      toast.error(msg);
      return;
    }
    setPwdLoading(true);
    try {
      await api.put("/user/change-password", {
        currentPassword: currentPwd,
        newPassword: newPwd,
      });
      setPwdSuccess(true);
      toast.success("Password changed successfully.");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setTimeout(() => setPwdSuccess(false), 3000);
    } catch (err) {
      const msg = err?.response?.data?.message ?? "Failed to change password.";
      setPwdError(msg);
      toast.error(msg);
    } finally {
      setPwdLoading(false);
    }
  };

  const passwordFields = [
    {
      label: "Current Password",
      value: currentPwd,
      setter: setCurrentPwd,
      show: showCurrent,
      toggle: () => setShowCurrent((p) => !p),
    },
    {
      label: "New Password",
      value: newPwd,
      setter: setNewPwd,
      show: showNew,
      toggle: () => setShowNew((p) => !p),
    },
    {
      label: "Confirm New Password",
      value: confirmPwd,
      setter: setConfirmPwd,
      show: showConfirm,
      toggle: () => setShowConfirm((p) => !p),
    },
  ];

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">My Profile</h1>

      {/* Avatar card */}
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white select-none">
          {initial}
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800">
            {user?.name ?? "User"}
          </p>
          <p className="text-sm text-gray-500">{user?.email ?? ""}</p>
          <span className="mt-1 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 capitalize">
            {user?.role ?? "user"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 rounded-xl border border-gray-100 bg-white p-1 shadow-sm">
        {["info", "password"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t === "info" ? "Personal Info" : "Change Password"}
          </button>
        ))}
      </div>

      {/* ── Personal Info ── */}
      {tab === "info" && (
        <form
          onSubmit={handleInfoSave}
          className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          {/* Name */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200">
              <User size={16} className="shrink-0 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-sm outline-none text-gray-700"
                placeholder="Your full name"
                required
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
              <Mail size={16} className="shrink-0 text-gray-400" />
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-transparent text-sm outline-none text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Email cannot be changed.
            </p>
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200">
              <Phone size={16} className="shrink-0 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent text-sm outline-none text-gray-700"
                placeholder="Your phone number"
              />
            </div>
          </div>

          {infoError && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {infoError}
            </p>
          )}
          {infoSuccess && (
            <p className="mb-3 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
              <CheckCircle size={15} /> Profile updated successfully.
            </p>
          )}

          <button
            type="submit"
            disabled={infoLoading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            <Save size={15} />
            {infoLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}

      {/* ── Change Password ── */}
      {tab === "password" && (
        <form
          onSubmit={handlePasswordSave}
          className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          {passwordFields.map(({ label, value, setter, show, toggle }) => (
            <div className="mb-4" key={label}>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
              </label>
              <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200">
                <Lock size={16} className="shrink-0 text-gray-400" />
                <input
                  type={show ? "text" : "password"}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none text-gray-700"
                  placeholder={label}
                  required
                />
                <button
                  type="button"
                  onClick={toggle}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}

          {pwdError && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {pwdError}
            </p>
          )}
          {pwdSuccess && (
            <p className="mb-3 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
              <CheckCircle size={15} /> Password changed successfully.
            </p>
          )}

          <button
            type="submit"
            disabled={pwdLoading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            <Save size={15} />
            {pwdLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfileForm;
