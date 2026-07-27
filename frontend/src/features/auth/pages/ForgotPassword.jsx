import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../../../components/common/Logo";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import api from "../../../api/axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/user/forgot-password", {
        email,
      });

      toast.success(response.data.message || "OTP sent successfully.");

      // Redirect to Verify Forgot Password OTP page
      setTimeout(() => {
        navigate("/reset-password", {
          state: { email },
        });
      }, 1500);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Logo />

      <h2 className="text-3xl font-bold text-center">Forgot Password</h2>

      <p className="text-center text-gray-500 mt-2 mb-8">
        We'll send an OTP to your email.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </Button>

        <p className="text-center text-sm">
          Remember your password?
          <Link
            to="/login"
            className="ml-1 text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </>
  );
};

export default ForgotPassword;
