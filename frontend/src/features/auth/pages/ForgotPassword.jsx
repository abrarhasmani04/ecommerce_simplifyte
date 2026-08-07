import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail } from "lucide-react";

import Logo from "../../../components/common/Logo";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

import api from "@/services/axios";
import { ROUTES } from "../../../constants/routes";

const ForgotPassword = () => {
  const navigate = useNavigate("/reset-password");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Please enter your email."); return; }
    try {
      setLoading(true);
      const response = await api.post("/user/forgot-password", { email });
      toast.success(response.data.message || "OTP sent successfully.");
      setTimeout(() => navigate(ROUTES.RESET_PASSWORD, { state: { email } }), 1200);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
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
        background: "#eff6ff", border: "1px solid #dbeafe",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "18px",
      }}>
        <Mail size={22} color="#2563eb" />
      </div>

      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ margin: "0 0 5px", fontSize: "1.55rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
          Forgot password?
        </h2>
        <p style={{ margin: 0, color: "#64748b", fontSize: "0.88rem" }}>
          Enter your email and we'll send you a reset OTP.
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
          Remember your password?{" "}
          <Link to={ROUTES.LOGIN} style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
