import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import Logo from "../../../components/common/Logo";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

import api from "../../../api/axios";

import { setUser } from "../authSlice";

const VerifyEmail = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const dispatch = useDispatch();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);

  // Verify Email OTP

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found. Please register again.");

      navigate("/register");

      return;
    }

    if (!otp.trim()) {
      toast.warning("Please enter OTP.");

      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/user/verify-email",

        {
          email,

          otp,
        },
      );

      console.log(
        "Verify Email Response:",

        response.data,
      );

      if (response.data.user) {
        dispatch(setUser(response.data.user));
      }

      toast.success(response.data.message || "Email verified successfully!");

      setTimeout(() => {
        navigate(
          "/login",

          {
            replace: true,
          },
        );
      }, 1200);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Email not found.");

      return;
    }

    try {
      setResendLoading(true);

      await api.post(
        "/user/resend-verification-otp",

        {
          email,
        },
      );

      toast.success("OTP sent successfully.");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <Logo />

      <h2 className="text-3xl font-bold text-center text-gray-800">
        Verify Your Email
      </h2>

      <p className="text-center text-gray-500 mt-2">
        Enter the verification code sent to
      </p>

      <p className="text-center font-semibold text-blue-600 mb-8">{email}</p>

      <form
        onSubmit={handleSubmit}

        className="space-y-5"
      >
        <Input
          label="OTP"

          type="text"

          placeholder="Enter 6-digit OTP"

          value={otp}

          onChange={(e) => setOtp(e.target.value)}

          maxLength={6}
        />

        <Button
          type="submit"

          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </Button>

        <button
          type="button"

          onClick={handleResendOTP}

          disabled={resendLoading}

          className="w-full text-sm font-semibold text-blue-600 hover:underline disabled:opacity-50"
        >
          {resendLoading ? "Sending OTP..." : "Resend OTP"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Wrong email?
          <Link
            to="/register"

            className="ml-1 font-semibold text-blue-600 hover:underline"
          >
            Register Again
          </Link>
        </p>
      </form>
    </>
  );
};

export default VerifyEmail;
