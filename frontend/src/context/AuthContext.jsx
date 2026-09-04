import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const data = await authApi.getProfile();
      if (data && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      // 401 or network error - unauthenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authApi.login({ email, password });
      if (data && data.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: "Login failed" };
    } catch (err) {
      const errMsg =
        err.response?.data?.errors?.email ||
        err.response?.data?.errors?.password ||
        err.response?.data?.message ||
        "Invalid credentials. Please check your email and password.";
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  const signup = async (userData) => {
    setError(null);
    try {
      const data = await authApi.signup(userData);
      if (data && data.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: "Signup failed" };
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      let errMsg = "Registration failed. Please check your inputs.";
      if (backendErrors) {
        const firstKey = Object.keys(backendErrors)[0];
        if (firstKey && backendErrors[firstKey]) {
          errMsg = backendErrors[firstKey];
        }
      } else if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      }
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  const refreshProfile = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

