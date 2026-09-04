import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { assessmentsApi } from "../api/assessments";
import { coursesApi } from "../api/courses";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { Award, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export const Assessments = () => {
  const { user } = useAuth();
  const userId = user?.id || user?._id;

  const [results, setResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseAssessments, setCourseAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch user's assessment results from backend
      if (userId) {
        const resData = await assessmentsApi.getUserAssessmentResults(userId);
        setResults(resData.results || []);
      }

      // 2. Fetch courses and their assessments
      const courseData = await coursesApi.getCourses();
      const availableCourses = courseData.courses || [];
      setCourses(availableCourses);

      const allAssessments = [];
      for (const c of availableCourses) {
        const cId = c._id || c.id;
        const aRes = await assessmentsApi.getCourseAssessments(cId).catch(() => ({ assessments: [] }));
        if (aRes.assessments) {
          allAssessments.push(...aRes.assessments);
        }
      }
      setCourseAssessments(allAssessments);
    } catch (err) {
      console.error("Assessments error:", err);
      setError("Failed to load assessments from the server.");
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
        <LoadingState message="Loading assessment history..." />
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
      {/* Header */}
      <div className="border-2 border-[#09090B] bg-[#FFFFFF] rounded-[16px] p-6 md:p-8 shadow-[4px_4px_0_#09090B]">
        <Badge variant="acid" size="sm" className="mb-2">
          EVALUATION & CERTIFICATION
        </Badge>
        <h1 className="font-heading text-3xl sm:text-4xl uppercase text-[#09090B] tracking-tight">
          ASSESSMENTS & RESULTS
        </h1>
        <p className="font-body text-sm text-[#52525B] mt-2 max-w-2xl">
          Pre-course baseline diagnostics and post-course evaluations directly measured by the
          curriculum to inform your post-course pathway recommendation.
        </p>
      </div>

      {/* Available Assessments */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b-2 border-[#09090B] pb-3">
          <Award className="w-5 h-5 text-[#09090B]" />
          <h2 className="font-heading text-xl uppercase text-[#09090B]">
            CURRICULUM ASSESSMENTS
          </h2>
        </div>

        {courseAssessments.length === 0 ? (
          <EmptyState
            title="No assessments available yet."
            description="Assessments will be shown once configured for active courses."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courseAssessments.map((assessment) => {
              const aId = assessment._id || assessment.id;
              const hasTaken = results.some((r) => (r.assessmentId?._id || r.assessmentId) === aId);

              return (
                <Card
                  key={aId}
                  variant="default"
                  shadow="normal"
                  rounded="brutal"
                  className="p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant={assessment.type === "pre" ? "cyan" : "acid"}
                        size="sm"
                      >
                        {assessment.type === "pre" ? "PRE-ASSESSMENT" : "POST-ASSESSMENT"}
                      </Badge>
                      {hasTaken && (
                        <Badge variant="completed" size="sm">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-heading text-lg uppercase text-[#09090B] mb-2">
                      {assessment.title}
                    </h3>
                    <p className="font-mono text-xs text-[#71717A] mb-4">
                      {assessment.questions?.length || 0} Questions
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#09090B]/10">
                    <Link to={`/assessments/${aId}`}>
                      <Button
                        variant={hasTaken ? "secondary" : "acid"}
                        size="sm"
                        fullWidth
                        icon={ArrowRight}
                      >
                        {hasTaken ? "Retake Assessment" : "Start Assessment"}
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* User Assessment Results Log (Requirement #13) */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b-2 border-[#09090B] pb-3">
          <CheckCircle2 className="w-5 h-5 text-[#09090B]" />
          <h2 className="font-heading text-xl uppercase text-[#09090B]">
            YOUR SUBMISSION RECORDS
          </h2>
        </div>

        {results.length === 0 ? (
          <EmptyState
            title="No assessment results available."
            description="You have not submitted any assessments yet. Take the pre or post assessments above to record your scores."
          />
        ) : (
          <div className="space-y-3">
            {results.map((res) => (
              <Card
                key={res._id || res.id}
                variant="default"
                shadow="sm"
                rounded="brutal-sm"
                className="p-4 md:p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-sm uppercase text-[#09090B]">
                      {res.assessmentId?.title || "Course Assessment"}
                    </h3>
                    <div className="flex items-center space-x-3 text-[11px] font-mono text-[#71717A] mt-1">
                      <span>
                        Type: {res.assessmentId?.type ? res.assessmentId.type.toUpperCase() : "Quiz"}
                      </span>
                      {res.createdAt && (
                        <span>
                          Date: {new Date(res.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge variant="acid" size="lg">
                      SCORE: {res.score}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessments;

