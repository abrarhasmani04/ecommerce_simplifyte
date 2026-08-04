import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import Logo from "../../../components/common/Logo";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

import api from "@/services/axios";

import { setUser } from "@/features/auth/authSlice";

const VerifyLoginOTP = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const dispatch = useDispatch();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  // Verify OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter OTP");

      return;
    }

    if (!email) {
      toast.error("Email not found");

      navigate("/login-otp");

      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/user/verify-login-otp",

        {
          email,

          otp,
        },
      );

      console.log("Verify OTP Response:", response.data);

      if (response.data.user) {
        dispatch(setUser(response.data.user));
      }

      toast.success(response.data.message || "Login Successful");

      setTimeout(() => {
        const role = response.data.user?.role?.toUpperCase();

        if (role === "ADMIN") {
          navigate("/admin/dashboard", {
            replace: true,
          });
        } else if (role === "SELLER") {
          navigate("/seller/dashboard", {
            replace: true,
          });
        } else {
          navigate("/home", {
            replace: true,
          });
        }
      }, 1000);
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
      await api.post(
        "/user/login-with-otp",

        {
          email,
        },
      );

      toast.success("OTP resent successfully");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <>
      <Logo />

      <h2 className="text-3xl font-bold text-center text-gray-800">
        Verify Login OTP
      </h2>

      <p className="text-center text-gray-500 mt-2 mb-8">
        OTP sent to
        <strong className="ml-1">{email}</strong>
      </p>

      <form
        onSubmit={handleSubmit}

        className="space-y-5"
      >
        <Input
          label="OTP"

          type="text"

          placeholder="Enter OTP"

          value={otp}

          onChange={(e) => setOtp(e.target.value)}

          maxLength={6}
        />

        <Button
          type="submit"

          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Didn't receive OTP?
          <button
            type="button"

            onClick={handleResendOTP}

            className="ml-1 text-blue-600 font-semibold hover:underline"
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
