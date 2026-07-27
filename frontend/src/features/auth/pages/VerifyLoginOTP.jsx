import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Logo from "../../../components/common/Logo";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import api from "../../../api/axios";
import { toast } from "react-toastify";

const VerifyLoginOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/user/verify-login-otp", {
        email,
        otp,
      });

      // Save JWT Token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Save User (Optional)
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      toast.success(response.data.message || "Login Successful");

      // Redirect after success toast
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      await api.post("/api/user/login-with-otp", {
        email,
      });

      toast.success("OTP resent successfully.");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <>
      <Logo />

      <h2 className="text-3xl font-bold text-center">Verify Login OTP</h2>

      <p className="text-center text-gray-500 mt-2 mb-8">
        OTP sent to <strong>{email}</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="OTP"
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>

        <p className="text-center text-sm">
          Didn't receive the OTP?{" "}
          <button
            type="button"
            onClick={handleResendOTP}
            className="text-blue-600 font-semibold hover:underline"
          >
            Resend OTP
          </button>
        </p>

        <p className="text-center text-sm">
          Wrong Email?
          <Link
            to="/login-otp"
            className="ml-1 text-blue-600 font-semibold hover:underline"
          >
            Go Back
          </Link>
        </p>
      </form>
    </>
  );
};

export default VerifyLoginOTP;
