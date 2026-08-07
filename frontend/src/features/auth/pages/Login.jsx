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
import { setUser } from "@/redux/authSlice";

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
      const response = await api.post("/user/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data.user) dispatch(setUser(response.data.user));
      toast.success("Login Successful");
      reset();

      const role = response.data.user?.role?.toUpperCase();
      setTimeout(() => {
        if (role === "ADMIN") navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
        else if (role === "SELLER") navigate(ROUTES.SELLER_DASHBOARD, { replace: true });
        else navigate(ROUTES.HOME, { replace: true });
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "block" }} className="al-mobile-logo">
        <Logo />
      </div>

      <div style={{ marginBottom: "28px" }}>
        <h2 style={{
          margin: "0 0 5px", fontSize: "1.55rem", fontWeight: 800,
          color: "#0f172a", letterSpacing: "-0.02em",
        }}>
          Welcome back 👋
        </h2>
        <p style={{ margin: 0, color: "#64748b", fontSize: "0.88rem" }}>
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", { required: "Email is required" })}
        />

        <div>
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p style={{ margin: "4px 0 0", fontSize: "0.74rem", color: "#ef4444" }}>
              {errors.password.message}
            </p>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "7px", cursor: "pointer" }}>
            <input type="checkbox" style={{ accentColor: "#2563eb", width: "14px", height: "14px" }} />
            <span style={{ fontSize: "0.82rem", color: "#64748b" }}>Remember me</span>
          </label>
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            style={{ fontSize: "0.82rem", color: "#2563eb", textDecoration: "none", fontWeight: 500 }}
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </Button>

        <Divider />

        <Link to={ROUTES.LOGIN_OTP} style={{ textDecoration: "none" }}>
          <Button type="button" variant="secondary">
            Sign in with OTP
          </Button>
        </Link>

        <p style={{ margin: "4px 0 0", textAlign: "center", fontSize: "0.84rem", color: "#64748b" }}>
          Don't have an account?{" "}
          <Link to={ROUTES.REGISTER} style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
