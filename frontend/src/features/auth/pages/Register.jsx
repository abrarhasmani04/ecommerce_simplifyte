import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Logo from "../../../components/common/Logo";
import Input from "../../../components/common/Input";
import PasswordInput from "../../../components/common/PasswordInput";
import Button from "../../../components/common/Button";

import api from "@/services/axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      toast.warning("Please fill all fields."); return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match."); return;
    }
    try {
      setLoading(true);
      const response = await api.post("/user/register", {
        name: formData.name, email: formData.email, password: formData.password,
      });
      console.log("Register Response:", response.data);
      toast.success("Registration successful! OTP sent to your email.");
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (error) {
      console.error("Register Error:", error);
      const data = error.response?.data;
      toast.error(data?.errors?.[0]?.msg || data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="al-mobile-logo"><Logo /></div>

      <div style={{ marginBottom: "24px" }}>
        <h2 style={{
          margin: "0 0 5px", fontSize: "1.55rem", fontWeight: 800,
          color: "#0f172a", letterSpacing: "-0.02em",
        }}>
          Create your account
        </h2>
        <p style={{ margin: 0, color: "#64748b", fontSize: "0.88rem" }}>
          Join TrendWave — it's free
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Input label="Full Name" name="name" type="text" placeholder="Your full name" value={formData.name} onChange={handleChange} />
        <Input label="Email address" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
        <PasswordInput label="Password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} />
        <PasswordInput label="Confirm Password" name="confirmPassword" placeholder="Repeat your password" value={formData.confirmPassword} onChange={handleChange} />

        <Button type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create Account"}
        </Button>

        <p style={{ margin: "4px 0 0", textAlign: "center", fontSize: "0.84rem", color: "#64748b" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
