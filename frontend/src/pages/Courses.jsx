import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { coursesApi } from "../api/courses";
import { enrollmentsApi } from "../api/enrollments";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { BookOpen, ArrowRight, CheckCircle2, Layers } from "lucide-react";

export const Courses = () => {
  const { user } = useAuth();
  const userId = user?.id || user?._id;

  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch courses from backend
      const courseRes = await coursesApi.getCourses();
      setCourses(courseRes.courses || []);

      // Fetch user enrollments if logged in
      if (userId) {
        const enrollRes = await enrollmentsApi.getUserEnrollments(userId).catch(() => ({ enrollments: [] }));
        const enrolledIds = new Set((enrollRes.enrollments || []).map((e) => e.courseId?._id || e.courseId));
        setEnrolledCourseIds(enrolledIds);
      }
    } catch (err) {
      console.error("Courses fetch error:", err);
      setError("Failed to retrieve courses from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <LoadingState message="Loading available courses..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-2 border-[#09090B] bg-[#FFFFFF] rounded-[16px] p-6 md:p-8 shadow-[4px_4px_0_#09090B]">
        <Badge variant="acid" size="sm" className="mb-2">
          INREM CURRICULUM
        </Badge>
        <h1 className="font-heading text-3xl sm:text-4xl uppercase text-[#09090B] tracking-tight">
          WATER QUALITY COURSES
        </h1>
        <p className="font-body text-sm text-[#52525B] mt-2 max-w-2xl">
          Comprehensive curriculum designed to build grassroots capacity in testing, safe water
          remediation, and community mobilization.
        </p>
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <EmptyState
          title="No courses available yet."
          description="Courses will appear here once published by administrators on the platform."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => {
            const courseId = course._id || course.id;
            const isEnrolled = enrolledCourseIds.has(courseId);

            return (
              <Card
                key={courseId}
                variant="default"
                shadow="large"
                rounded="brutal-lg"
                hoverEffect
                className="p-6 md:p-8 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-[#D2E823] border-2 border-[#09090B] rounded-[8px] flex items-center justify-center shadow-[2px_2px_0_#09090B]">
                        <BookOpen className="w-5 h-5 text-[#09090B]" />
                      </div>
                      <span className="font-mono text-xs font-bold uppercase text-[#71717A]">
                        {course.totalSessions || 9} Sessions
                      </span>
                    </div>
                    {isEnrolled ? (
                      <Badge variant="completed" size="sm">
                        Enrolled
                      </Badge>
                    ) : (
                      <Badge variant={course.status === "active" ? "acid" : "upcoming"} size="sm">
                        {course.status || "Active"}
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h2 className="font-heading text-xl uppercase text-[#09090B] leading-snug">
                      {course.title}
                    </h2>
                    <p className="font-body text-xs text-[#52525B] leading-relaxed mt-2 line-clamp-3">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t-2 border-[#09090B]/10 flex items-center justify-between">
                  <span className="font-mono text-xs text-[#09090B] font-bold">
                    Official WQC Course
                  </span>
                  <Link to={`/courses/${courseId}`}>
                    <Button variant={isEnrolled ? "primary" : "acid"} size="sm" icon={ArrowRight}>
                      {isEnrolled ? "Continue Course" : "View Curriculum"}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Courses;

