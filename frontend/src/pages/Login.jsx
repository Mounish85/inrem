import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import { Droplets, LogIn, AlertCircle } from "lucide-react";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.email || !formData.password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(formData.email, formData.password);
      if (res.success) {
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.message || "Login failed. Please check credentials.");
      }
    } catch (err) {
      setErrorMessage("An unexpected network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card
          variant="default"
          shadow="xl"
          rounded="brutal-lg"
          className="p-8 md:p-10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#D2E823] border-2 border-[#09090B] rounded-[10px] shadow-[3px_3px_0_#09090B] flex items-center justify-center mx-auto mb-3">
              <Droplets className="w-6 h-6 text-[#09090B]" />
            </div>
            <Badge variant="dark" size="sm" className="mb-2">
              MEMBER ACCESS
            </Badge>
            <h1 className="font-heading text-2xl uppercase tracking-tight text-[#09090B]">
              WQC LOGIN
            </h1>
            <p className="font-body text-xs text-[#52525B] mt-1">
              Sign in to continue your Water Quality Champion journey
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-[#FFF5F5] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0_#09090B] flex items-start space-x-2 text-xs font-mono text-[#FF4B4B] font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block font-mono text-xs uppercase font-bold text-[#09090B] mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="champion@inrem.in"
                className="w-full px-4 py-2.5 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0_#09090B] font-body text-sm text-[#09090B] placeholder-[#A1A1AA] focus:outline-none focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#D2E823]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-mono text-xs uppercase font-bold text-[#09090B] mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0_#09090B] font-body text-sm text-[#09090B] placeholder-[#A1A1AA] focus:outline-none focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#D2E823]"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                disabled={submitting}
                icon={LogIn}
              >
                {submitting ? "Signing in..." : "Log In"}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-2 border-[#09090B]/10 text-center">
            <p className="font-body text-xs text-[#52525B]">
              Don't have an account yet?{" "}
              <Link
                to="/signup"
                className="font-bold text-[#09090B] underline hover:text-[#09090B]/70"
              >
                Join as WQC Champion
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;

