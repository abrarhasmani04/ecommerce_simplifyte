import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ShieldCheck } from "lucide-react";

import Logo from "../../../components/common/Logo";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

import api from "@/services/axios";
import { setUser } from "@/redux/authSlice";

const VerifyLoginOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) { toast.error("Please enter OTP"); return; }
    if (!email) { toast.error("Email not found"); navigate("/login-otp"); return; }
    try {
      setLoading(true);
      const response = await api.post("/user/verify-login-otp", { email, otp });
      if (response.data.user) dispatch(setUser(response.data.user));
      toast.success(response.data.message || "Login Successful");
      setTimeout(() => {
        const role = response.data.user?.role?.toUpperCase();
        if (role === "ADMIN") navigate("/admin/dashboard", { replace: true });
        else if (role === "SELLER") navigate("/seller/dashboard", { replace: true });
        else navigate("/home", { replace: true });
      }, 1000);
    } catch (error) {
      const msg = error?.response?.data?.message;
      if (!msg && (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK" || error.code === "ETIMEDOUT")) {
        toast.error("Server is starting up. Please wait a moment and try again.");
      } else {
        toast.error(msg || "Invalid OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await api.post("/user/login-with-otp", { email });
      toast.success("OTP resent successfully");
    } catch (error) {
      const msg = error?.response?.data?.message;
      if (!msg && (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK" || error.code === "ETIMEDOUT")) {
        toast.error("Server is starting up. Please wait a moment and try again.");
      } else {
        toast.error(msg || "Failed to resend OTP");
      }
    }
  };

  return (
    <div>
      <div className="al-mobile-logo"><Logo /></div>

      {/* Icon */}
      <div style={{
        width: "48px", height: "48px", borderRadius: "12px",
        background: "#f0fdf4", border: "1px solid #bbf7d0",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "18px",
      }}>
        <ShieldCheck size={22} color="#16a34a" />
      </div>

      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ margin: "0 0 5px", fontSize: "1.55rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
          Verify OTP
        </h2>
        <p style={{ margin: 0, color: "#64748b", fontSize: "0.88rem" }}>
          OTP sent to <span style={{ color: "#374151", fontWeight: 500 }}>{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Input
          label="OTP"
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Verifying…" : "Verify & Sign In"}
        </Button>

        <p style={{ margin: "4px 0 0", textAlign: "center", fontSize: "0.84rem", color: "#64748b" }}>
          Didn't receive it?{" "}
          <button
            type="button"
            onClick={handleResendOTP}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontWeight: 600, fontSize: "0.84rem", padding: 0 }}
          >
            Resend OTP
          </button>
        </p>

        <p style={{ margin: "4px 0 0", textAlign: "center", fontSize: "0.84rem", color: "#64748b" }}>
          Wrong email?{" "}
          <Link to="/login-otp" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Go back</Link>
        </p>
      </form>
    </div>
  );
};

export default VerifyLoginOTP;
