import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import CustomCursor from "./components/CustomCursor";
import NoiseOverlay from "./components/NoiseOverlay";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import SessionDetails from "./pages/SessionDetails";
import Assessments from "./pages/Assessments";
import AssessmentView from "./pages/AssessmentView";
import Engagement from "./pages/Engagement";
import CaseStudies from "./pages/CaseStudies";
import CaseStudyDetails from "./pages/CaseStudyDetails";
import Profile from "./pages/Profile";

export function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#F8F4E8] text-[#09090B] font-body relative">
          {/* Subtle SVG Noise & Desktop Custom Cursor */}
          <NoiseOverlay />
          <CustomCursor />

          {/* Sticky Neo-Brutalist Navbar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1 w-full">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <Courses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:courseId"
                element={
                  <ProtectedRoute>
                    <CourseDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sessions/:sessionId"
                element={
                  <ProtectedRoute>
                    <SessionDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessments"
                element={
                  <ProtectedRoute>
                    <Assessments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessments/:assessmentId"
                element={
                  <ProtectedRoute>
                    <AssessmentView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/engagement"
                element={
                  <ProtectedRoute>
                    <Engagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/case-studies"
                element={
                  <ProtectedRoute>
                    <CaseStudies />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/case-studies/:id"
                element={
                  <ProtectedRoute>
                    <CaseStudyDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Brutalist Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
