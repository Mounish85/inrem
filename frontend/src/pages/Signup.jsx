import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import { Droplets, UserPlus, AlertCircle } from "lucide-react";

export const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    organization: "",
    designation: "",
    location: "",
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

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage("Please fill in all required fields (Name, Email, Password).");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await signup(formData);
      if (res.success) {
        navigate("/dashboard");
      } else {
        setErrorMessage(res.message || "Signup failed. Please verify the information.");
      }
    } catch (err) {
      setErrorMessage("An unexpected network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
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
            <Badge variant="acid" size="sm" className="mb-2">
              ENROLLMENT
            </Badge>
            <h1 className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-[#09090B]">
              JOIN AS A CHAMPION
            </h1>
            <p className="font-body text-xs text-[#52525B] mt-1">
              Create your Water Quality Champion profile and begin the 9-session course
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block font-mono text-xs uppercase font-bold text-[#09090B] mb-1.5"
                >
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0_#09090B] font-body text-sm text-[#09090B] placeholder-[#A1A1AA] focus:outline-none focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#D2E823]"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-mono text-xs uppercase font-bold text-[#09090B] mb-1.5"
                >
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="priya@example.org"
                  className="w-full px-3.5 py-2.5 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0_#09090B] font-body text-sm text-[#09090B] placeholder-[#A1A1AA] focus:outline-none focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#D2E823]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block font-mono text-xs uppercase font-bold text-[#09090B] mb-1.5"
                >
                  Password (min 6 chars) *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0_#09090B] font-body text-sm text-[#09090B] placeholder-[#A1A1AA] focus:outline-none focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#D2E823]"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block font-mono text-xs uppercase font-bold text-[#09090B] mb-1.5"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0_#09090B] font-body text-sm text-[#09090B] placeholder-[#A1A1AA] focus:outline-none focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#D2E823]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="organization"
                  className="block font-mono text-xs uppercase font-bold text-[#09090B] mb-1.5"
                >
                  Organization
                </label>
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="e.g. Gram Panchayat"
                  className="w-full px-3.5 py-2.5 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0_#09090B] font-body text-sm text-[#09090B] placeholder-[#A1A1AA] focus:outline-none focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#D2E823]"
                />
              </div>

              <div>
                <label
                  htmlFor="designation"
                  className="block font-mono text-xs uppercase font-bold text-[#09090B] mb-1.5"
                >
                  Designation
                </label>
                <input
                  id="designation"
                  name="designation"
                  type="text"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. ASHA / Jal Mitra"
                  className="w-full px-3.5 py-2.5 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0_#09090B] font-body text-sm text-[#09090B] placeholder-[#A1A1AA] focus:outline-none focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#D2E823]"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block font-mono text-xs uppercase font-bold text-[#09090B] mb-1.5"
                >
                  Location / District
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Jhabua, MP"
                  className="w-full px-3.5 py-2.5 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0_#09090B] font-body text-sm text-[#09090B] placeholder-[#A1A1AA] focus:outline-none focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#D2E823]"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="acid"
                size="lg"
                fullWidth
                disabled={submitting}
                icon={UserPlus}
              >
                {submitting ? "Registering Champion..." : "Register & Start Journey"}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-2 border-[#09090B]/10 text-center">
            <p className="font-body text-xs text-[#52525B]">
              Already registered as a Champion?{" "}
              <Link
                to="/login"
                className="font-bold text-[#09090B] underline hover:text-[#09090B]/70"
              >
                Log In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;

