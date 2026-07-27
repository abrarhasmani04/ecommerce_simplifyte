import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Logo from "../../../components/common/Logo";
import Input from "../../../components/common/Input";
import PasswordInput from "../../../components/common/PasswordInput";
import Button from "../../../components/common/Button";
import api from "../../../api/axios";

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

    console.log(otp, password, confirmPassword);

    if (!otp.trim()) {
      toast.error("Please enter OTP.");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/user/reset-password", {
        email,
        otp,
        newPassword: password,
        confirmPassword,
      });

      toast.success(response.data.message || "Password reset successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Logo />

      <h2 className="text-3xl font-bold text-center">Reset Password</h2>

      <p className="text-center text-gray-500 mt-2 mb-8">
        Enter the OTP sent to your email and create a new password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Email" type="email" value={email} readOnly />

        <Input
          label="OTP"
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <PasswordInput
          label="New Password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </>
  );
};

export default ResetPassword;
