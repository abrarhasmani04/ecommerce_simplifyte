import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { MailCheck } from "lucide-react";

import Logo from "../../../components/common/Logo";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

import api from "@/services/axios";
import { ROUTES } from "../../../constants/routes";
import { setUser } from "@/redux/authSlice";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error("Email not found. Please register again."); navigate("/register"); return; }
    if (!otp.trim()) { toast.warning("Please enter OTP."); return; }
    try {
      setLoading(true);
      const response = await api.post("/user/verify-email", { email, otp });
      const user = response.data.user;
      if (user) dispatch(setUser(user));
      toast.success(response.data.message || "Email verified successfully!");
      setTimeout(() => {
        const role = user?.role?.toUpperCase();
        if (role === "ADMIN") navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
        else if (role === "SELLER") navigate(ROUTES.SELLER_DASHBOARD, { replace: true });
        else navigate(ROUTES.HOME, { replace: true });
      }, 1200);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) { toast.error("Email not found."); return; }
    try {
      setResendLoading(true);
      await api.post("/user/resend-verification-otp", { email });
      toast.success("OTP sent successfully.");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div>
      <div className="al-mobile-logo"><Logo /></div>

      {/* Icon */}
      <div style={{
        width: "48px", height: "48px", borderRadius: "12px",
        background: "#eff6ff", border: "1px solid #dbeafe",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "18px",
      }}>
        <MailCheck size={22} color="#2563eb" />
      </div>

      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ margin: "0 0 5px", fontSize: "1.55rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
          Verify your email
        </h2>
        <p style={{ margin: 0, color: "#64748b", fontSize: "0.88rem", lineHeight: 1.6 }}>
          We sent a code to{" "}
          <span style={{ color: "#374151", fontWeight: 500 }}>{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Input
          label="Verification Code"
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Verifying…" : "Verify Email"}
        </Button>

        <button
          type="button"
          onClick={handleResendOTP}
          disabled={resendLoading}
          style={{
            background: "none", border: "none",
            cursor: resendLoading ? "not-allowed" : "pointer",
            color: "#2563eb", fontWeight: 600, fontSize: "0.84rem",
            opacity: resendLoading ? 0.5 : 1, textAlign: "center", padding: 0,
          }}
        >
          {resendLoading ? "Sending…" : "Resend OTP"}
        </button>

        <p style={{ margin: "4px 0 0", textAlign: "center", fontSize: "0.84rem", color: "#64748b" }}>
          Wrong email?{" "}
          <Link to="/register" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Register again</Link>
        </p>
      </form>
    </div>
  );
};

export default VerifyEmail;
