import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Smartphone } from "lucide-react";

import Logo from "../../../components/common/Logo";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

import api from "@/services/axios";

const LoginOTP = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Please enter your email."); return; }
    try {
      setLoading(true);
      const response = await api.post("/user/login-with-otp", { email });
      toast.success(response.data.message || "OTP sent successfully.");
      setTimeout(() => navigate("/verify-login-otp", { state: { email } }), 1200);
    } catch (error) {
      const msg = error?.response?.data?.message;
      if (!msg && (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK" || error.code === "ETIMEDOUT")) {
        toast.error("Server is starting up. Please wait a moment and try again.");
      } else {
        toast.error(msg || "Failed to send OTP. Please try again.");
      }
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
        background: "#f0f9ff", border: "1px solid #bae6fd",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "18px",
      }}>
        <Smartphone size={22} color="#0284c7" />
      </div>

      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ margin: "0 0 5px", fontSize: "1.55rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
          Sign in with OTP
        </h2>
        <p style={{ margin: 0, color: "#64748b", fontSize: "0.88rem" }}>
          We'll send a one-time code to your email.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Sending OTP…" : "Send OTP"}
        </Button>
        <p style={{ margin: "4px 0 0", textAlign: "center", fontSize: "0.84rem", color: "#64748b" }}>
          Back to{" "}
          <Link to="/login" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginOTP;
