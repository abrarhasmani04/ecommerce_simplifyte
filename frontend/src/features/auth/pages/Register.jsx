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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  // Register Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.warning("Please fill all fields.");

      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");

      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/user/register",

        {
          name: formData.name,

          email: formData.email,

          password: formData.password,
        },
      );

      console.log("Register Response:", response.data);

      toast.success("Registration successful! OTP sent to your email.");

      navigate("/verify-email", { state: { email: formData.email } });
    } catch (error) {
      console.error("Register Error:", error);

      const data = error.response?.data;
      const message =
        data?.errors?.[0]?.msg ||
        data?.message ||
        "Registration failed. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Logo />

      <h2 className="text-3xl font-bold text-center text-gray-800">
        Create Account
      </h2>

      <p className="text-center text-gray-500 mt-2 mb-8">
        Join Simplifyte today
      </p>

      <form
        onSubmit={handleSubmit}

        className="space-y-5"
      >
        <Input
          label="Full Name"

          name="name"

          type="text"

          placeholder="Enter your full name"

          value={formData.name}

          onChange={handleChange}
        />

        <Input
          label="Email"

          name="email"

          type="email"

          placeholder="Enter your email"

          value={formData.email}

          onChange={handleChange}
        />

        <PasswordInput
          label="Password"

          name="password"

          placeholder="Enter your password"

          value={formData.password}

          onChange={handleChange}
        />

        <PasswordInput
          label="Confirm Password"

          name="confirmPassword"

          placeholder="Confirm your password"

          value={formData.confirmPassword}

          onChange={handleChange}
        />

        <Button
          type="submit"

          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?
          <Link
            to="/login"

            className="ml-1 font-semibold text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </>
  );
};

export default Register;
