import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { KeyRound } from "lucide-react";

import Logo from "../../../components/common/Logo";
import Input from "../../../components/common/Input";
import PasswordInput from "../../../components/common/PasswordInput";
import Button from "../../../components/common/Button";

import api from "@/services/axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error("Email not found. Please try again."); navigate("/forgot-password"); return; }
    if (!otp.trim()) { toast.error("Please enter OTP."); return; }
    if (!password || !confirmPassword) { toast.error("Please fill all fields."); return; }
    if (password !== confirmPassword) { toast.error("Passwords do not match."); return; }

    try {
      setLoading(true);
      const response = await api.post("/user/reset-password", { email, otp, newPassword: password, confirmPassword });
      toast.success(response.data.message || "Password reset successfully.");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="al-mobile-logo"><Logo /></div>

      {/* Icon */}
      <div style={{
        width: "48px", height: "48px", borderRadius: "12px",
        background: "#f5f3ff", border: "1px solid #e9d5ff",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "18px",
      }}>
        <KeyRound size={22} color="#7c3aed" />
      </div>

      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ margin: "0 0 5px", fontSize: "1.55rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
          Reset password
        </h2>
        <p style={{ margin: 0, color: "#64748b", fontSize: "0.88rem" }}>
          Enter the OTP sent to <span style={{ color: "#374151", fontWeight: 500 }}>{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Input label="Email" type="email" value={email} readOnly style={{ opacity: 0.6, cursor: "not-allowed" }} />
        <Input label="OTP" type="text" placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
        <PasswordInput label="New Password" placeholder="Create a new password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <PasswordInput label="Confirm Password" placeholder="Repeat new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <Button type="submit" disabled={loading}>
          {loading ? "Resetting…" : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
