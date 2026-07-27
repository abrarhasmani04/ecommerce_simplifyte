import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";

import Logo from "../../../components/common/Logo";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import PasswordInput from "../../../components/common/PasswordInput";
import Divider from "../../../components/common/Divider";

import api from "../../../api/axios";

const Login = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await api.post("/user/login", {
        email: data.email,
        password: data.password,
      });

      const result = response.data;

      console.log(result);

      // Save Token
      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      // Save User
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      toast.success("Login Successful!");

      reset();

      setTimeout(() => {
        const role = result.user?.role;

        switch (role) {
          case "ADMIN":
            navigate("/admin/dashboard");
            break;

          case "SELLER":
            navigate("/seller/dashboard");
            break;

          default:
            navigate("/");
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

      <h2 className="text-3xl font-bold text-center">Welcome Back</h2>

      <p className="text-center text-gray-500 mt-2 mb-8">
        Login to continue shopping
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          {...register("email", {
            required: true,
          })}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          {...register("password", {
            required: true,
          })}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-blue-600" />
            Remember me
          </label>

          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <Divider />

        <Link to="/login-otp">
          <Button variant="secondary">Login with OTP</Button>
        </Link>

        <p className="text-center text-sm">
          Don't have an account?
          <Link
            to="/register"
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
