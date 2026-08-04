import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import Logo from "../../../components/common/Logo";
import Input from "../../../components/common/Input";
import PasswordInput from "../../../components/common/PasswordInput";
import Button from "../../../components/common/Button";
import Divider from "../../../components/common/Divider";

import api from "@/services/axios";
import { ROUTES } from "../../../constants/routes";
import { setUser } from "@/features/auth/authSlice";

const Login = () => {
  const navigate = useNavigate("/home");

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await api.post(
        "/user/login",

        {
          email: data.email,

          password: data.password,
        },
      );

      // Store user in Redux
      if (response.data.user) {
        dispatch(setUser(response.data.user));
      }

      toast.success("Login Successful");

      reset();

      const role = response.data.user?.role?.toUpperCase();

      setTimeout(() => {
        if (role === "ADMIN") {
          navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
        } else if (role === "SELLER") {
          navigate(ROUTES.SELLER_DASHBOARD, { replace: true });
        } else {
          navigate(ROUTES.HOME, { replace: true });
        }
      }, 1000);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Logo />

      <h2 className="text-3xl font-bold text-center text-gray-800">
        Welcome Back
      </h2>

      <p className="mt-2 mb-8 text-center text-gray-500">
        Login to continue shopping
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}

        className="space-y-5"
      >
        <div>
          <Input
            label="Email"

            type="email"

            placeholder="Enter your email"

            {...register(
              "email",

              {
                required: "Email is required",
              },
            )}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <PasswordInput
            label="Password"

            placeholder="Enter your password"

            {...register(
              "password",

              {
                required: "Password is required",
              },
            )}
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"

              className="accent-blue-600"
            />
            Remember me
          </label>

          <Link
            to={ROUTES.FORGOT_PASSWORD}

            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"

          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <Divider />

        <Link to={ROUTES.LOGIN_OTP}>
          <Button
            type="button"

            variant="secondary"
          >
            Login with OTP
          </Button>
        </Link>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?
          <Link
            to={ROUTES.REGISTER}

            className="ml-1 font-semibold text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </>
  );
};

export default Login;
