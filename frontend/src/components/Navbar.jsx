import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Droplets,
  LayoutDashboard,
  BookOpen,
  Compass,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Award,
} from "lucide-react";
import Button from "./Button";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = isAuthenticated
    ? [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Courses", path: "/courses", icon: BookOpen },
        { name: "Assessments", path: "/assessments", icon: Award },
        { name: "Engagement", path: "/engagement", icon: Compass },
        { name: "Case Studies", path: "/case-studies", icon: FileText },
        { name: "Profile", path: "/profile", icon: User },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "About WQC", path: "/#about" },
        { name: "Pathways", path: "/#pathways" },
      ];

  return (
    <header className="sticky top-4 z-50 px-4 md:px-6 max-w-7xl mx-auto w-full mb-6 md:mb-8">
      <nav className="bg-[#F8F4E8]/90 backdrop-blur-[24px] border-2 border-[#09090B] rounded-[12px] shadow-[4px_4px_0_#09090B] px-4 md:px-6 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center space-x-2.5 text-[#09090B] font-heading text-base md:text-lg tracking-tight uppercase group"
        >
          <div className="w-9 h-9 bg-[#D2E823] border-2 border-[#09090B] rounded-[8px] flex items-center justify-center shadow-[2px_2px_0_#09090B] group-hover:rotate-6 transition-transform">
            <Droplets className="w-5 h-5 text-[#09090B]" />
          </div>
          <div className="flex items-center">
            <span className="font-heading text-lg">INREM</span>
            <span className="ml-2 text-xs px-2 py-0.5 bg-[#09090B] text-[#D2E823] rounded font-mono font-bold hidden sm:inline-block">
              WATER QUALITY CHAMPIONS
            </span>
            <span className="ml-1.5 text-xs px-1.5 py-0.5 bg-[#09090B] text-[#D2E823] rounded font-mono font-bold sm:hidden">
              WQC
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center space-x-1 font-bold text-xs uppercase tracking-wider">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-1.5 rounded-[8px] border-2 transition-all duration-100 flex items-center space-x-1.5 ${
                  active
                    ? "bg-[#09090B] text-[#D2E823] border-[#09090B] shadow-[2px_2px_0_#09090B]"
                    : "border-transparent text-[#09090B] hover:bg-[#D2E823]/40 hover:border-[#09090B]"
                }`}
              >
                {link.icon && <link.icon className="w-3.5 h-3.5" />}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Auth Actions */}
        <div className="hidden lg:flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs text-[#09090B] font-semibold bg-[#FFFFFF] border-2 border-[#09090B] px-2.5 py-1 rounded-[8px] shadow-[2px_2px_0_#09090B] truncate max-w-[140px]">
                {user?.name || user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                icon={LogOut}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="acid" size="sm">
                  Join WQC
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 border-2 border-[#09090B] rounded-[8px] bg-[#FFFFFF] shadow-[2px_2px_0_#09090B]"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-[#09090B]" />
          ) : (
            <Menu className="w-5 h-5 text-[#09090B]" />
          )}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[12px] shadow-[4px_4px_0_#09090B] p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-[8px] border-2 font-bold text-xs uppercase tracking-wider flex items-center space-x-2 ${
                isActive(link.path)
                  ? "bg-[#09090B] text-[#D2E823] border-[#09090B]"
                  : "bg-[#FFFFFF] text-[#09090B] border-[#09090B]"
              }`}
            >
              {link.icon && <link.icon className="w-4 h-4" />}
              <span>{link.name}</span>
            </Link>
          ))}

          <div className="pt-2 border-t-2 border-[#09090B] space-y-2">
            {isAuthenticated ? (
              <>
                <div className="text-xs font-mono font-bold text-[#09090B] px-2 py-1">
                  Signed in as: {user?.name || user?.email}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  icon={LogOut}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="sm" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="acid" size="sm" fullWidth>
                    Join WQC
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

