import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { enrollmentsApi } from "../api/enrollments";
import { progressApi } from "../api/progress";
import { assessmentsApi } from "../api/assessments";
import { engagementsApi } from "../api/engagements";
import { coursesApi } from "../api/courses";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import {
  BookOpen,
  Award,
  Sparkles,
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  Building,
  User,
  AlertCircle,
  FileCheck,
} from "lucide-react";

export const Dashboard = () => {
  const { user } = useAuth();
  const userId = user?.id || user?._id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [enrollments, setEnrollments] = useState([]);
  const [progressData, setProgressData] = useState(null);
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState(null);

  const fetchDashboardData = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      // 1. Fetch user enrollments
      const enrollRes = await enrollmentsApi.getUserEnrollments(userId).catch(() => ({ enrollments: [] }));
      const userEnrollments = enrollRes.enrollments || [];
      setEnrollments(userEnrollments);

      // 2. Fetch progress data
      const progRes = await progressApi.getUserProgress(userId).catch(() => null);
      setProgressData(progRes);

      // 3. Fetch assessment results
      const assessRes = await assessmentsApi.getUserAssessmentResults(userId).catch(() => ({ results: [] }));
      setAssessmentResults(assessRes.results || []);

      // 4. Fetch engagements
      const engageRes = await engagementsApi.getUserEngagements(userId).catch(() => ({ engagements: [] }));
      setEngagements(engageRes.engagements || []);

      // 5. Fetch ML Journey recommendation directly from backend
      fetchRecommendation();
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError("Failed to load dashboard records from the server.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendation = async () => {
    if (!userId) return;
    try {
      setMlLoading(true);
      setMlError(null);
      const res = await engagementsApi.getJourneyRecommendation(userId);
      if (res && res.data) {
        setRecommendation(res.data);
      }
    } catch (err) {
      // Backend returned 503 or 500 when ML service is starting or insufficient data
      console.log("ML recommendation unavailable:", err.response?.data?.message || err.message);
      setMlError(
        err.response?.data?.message ||
        "ML recommendation engine is analyzing your course progress."
      );
    } finally {
      setMlLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <LoadingState message="Loading your WQC Dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <ErrorState message={error} onRetry={fetchDashboardData} />
      </div>
    );
  }

  const activeEnrollment = enrollments[0];
  const activeCourse = activeEnrollment?.courseId;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
      {/* Top Welcome Banner */}
      <div className="border-2 border-[#09090B] bg-[#D2E823] rounded-[16px] p-6 md:p-8 shadow-[6px_6px_0_#09090B]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="dark" size="sm">
                ACTIVE CHAMPION
              </Badge>
              {user?.location && (
                <span className="font-mono text-xs flex items-center text-[#09090B] font-bold">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  {user.location}
                </span>
              )}
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl uppercase text-[#09090B] tracking-tight">
              WELCOME, {user?.name || "CHAMPION"}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 font-mono text-xs text-[#09090B]">
              {user?.organization && (
                <span className="flex items-center">
                  <Building className="w-3.5 h-3.5 mr-1 text-[#09090B]" />
                  {user.organization}
                </span>
              )}
              {user?.designation && (
                <span className="flex items-center bg-[#09090B] text-[#D2E823] px-2 py-0.5 rounded font-bold">
                  {user.designation}
                </span>
              )}
              <span>{user?.email}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/courses">
              <Button variant="primary" size="md" icon={BookOpen}>
                Browse Courses
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="secondary" size="md" icon={User}>
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Course Progress Section: 8 Cols */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Course Card */}
          <Card variant="default" shadow="normal" rounded="brutal" className="p-6">
            <div className="flex items-center justify-between border-b-2 border-[#09090B] pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-[#09090B]" />
                <h2 className="font-heading text-lg uppercase text-[#09090B]">
                  CURRENT ENROLLMENT
                </h2>
              </div>
              <Link to="/courses">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            {activeCourse ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-heading text-base md:text-lg text-[#09090B]">
                      {activeCourse.title}
                    </h3>
                    <p className="font-body text-xs text-[#52525B] mt-1 max-w-xl">
                      {activeCourse.description}
                    </p>
                  </div>
                  <Badge variant="completed" size="md">
                    Enrolled
                  </Badge>
                </div>

                {/* Real Progress Bar */}
                <div className="pt-2">
                  <div className="flex justify-between font-mono text-xs text-[#09090B] font-bold mb-1.5">
                    <span>Course Progress</span>
                    <span>
                      {progressData?.progressPercentage != null
                        ? `${progressData.progressPercentage}%`
                        : "0%"}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-[#F8F4E8] border-2 border-[#09090B] rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-[#D2E823] border border-[#09090B] rounded-full transition-all duration-500"
                      style={{
                        width: `${progressData?.progressPercentage || 0}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between font-mono text-[11px] text-[#71717A] mt-1.5">
                    <span>
                      {progressData?.completedSessions || 0} of{" "}
                      {activeCourse.totalSessions || 9} sessions completed
                    </span>
                    <Link
                      to={`/courses/${activeCourse._id || activeCourse.id}`}
                      className="text-[#09090B] font-bold underline hover:text-[#D2E823]"
                    >
                      Go to Sessions →
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No courses enrolled yet."
                description="You are not enrolled in any course. Explore the 9-session Water Quality Management course and enroll today."
                actionLabel="Explore Courses"
                onAction={() => (window.location.href = "/courses")}
              />
            )}
          </Card>

          {/* Real Session Progress Detail */}
          <Card variant="default" shadow="normal" rounded="brutal" className="p-6">
            <div className="flex items-center justify-between border-b-2 border-[#09090B] pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-[#09090B]" />
                <h2 className="font-heading text-lg uppercase text-[#09090B]">
                  SESSION ACTIVITY LOG
                </h2>
              </div>
              {progressData && (
                <span className="font-mono text-xs font-bold text-[#09090B]">
                  Total Recorded: {progressData.totalSessions || 0}
                </span>
              )}
            </div>

            {progressData && progressData.progress && progressData.progress.length > 0 ? (
              <div className="space-y-3">
                {progressData.progress.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="border-2 border-[#09090B] bg-[#F8F4E8] p-3 rounded-[8px] flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded bg-[#09090B] text-[#D2E823] font-mono text-xs font-bold flex items-center justify-center">
                        {item.sessionId?.sessionNumber || idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-xs uppercase text-[#09090B]">
                          {item.sessionId?.title || `Session ${idx + 1}`}
                        </div>
                        {item.completedAt && (
                          <div className="text-[10px] font-mono text-[#71717A]">
                            Completed: {new Date(item.completedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={item.status === "completed" ? "completed" : "in_progress"}
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No progress data available yet."
                description="Start and complete course sessions to generate your verified progress records."
              />
            )}
          </Card>
        </div>

        {/* Right Side Column: 4 Cols Bento */}
        <div className="lg:col-span-4 space-y-6">
          {/* ML Recommendation Card (Requirement #16) */}
          <Card
            variant="acid"
            shadow="large"
            rounded="brutal"
            className="p-6 border-2 border-[#09090B]"
          >
            <div className="flex items-center space-x-2 border-b-2 border-[#09090B] pb-3 mb-4">
              <Sparkles className="w-5 h-5 text-[#09090B]" />
              <h2 className="font-heading text-base uppercase text-[#09090B]">
                RECOMMENDED JOURNEY
              </h2>
            </div>

            {mlLoading ? (
              <div className="py-6 text-center">
                <div className="w-8 h-8 border-2 border-[#09090B] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="font-mono text-xs font-bold">Querying ML Service...</p>
              </div>
            ) : recommendation && recommendation.recommendation ? (
              <div className="space-y-4">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[#09090B]/80 font-bold mb-1">
                    ML PREDICTED PATHWAY
                  </div>
                  <div className="bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] rounded-[8px] p-3 text-center font-heading text-lg uppercase shadow-[2px_2px_0_#09090B]">
                    {recommendation.recommendation.pathway}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[#09090B]/80 font-bold mb-1">
                    AI REASONING
                  </div>
                  <p className="font-body text-xs text-[#09090B] leading-relaxed bg-[#FFFFFF]/70 border border-[#09090B] p-2.5 rounded-[6px]">
                    {recommendation.recommendation.reason}
                  </p>
                </div>

                {recommendation.features && (
                  <div className="pt-2 border-t border-[#09090B]/30 font-mono text-[10px] space-y-1 text-[#09090B]">
                    <div className="flex justify-between">
                      <span>Sessions Completed:</span>
                      <span className="font-bold">{recommendation.features.sessions_completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assessments Taken:</span>
                      <span className="font-bold">{recommendation.features.assessment_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engagements:</span>
                      <span className="font-bold">{recommendation.features.engagement_count}</span>
                    </div>
                  </div>
                )}

                <Link to="/engagement">
                  <Button variant="primary" size="sm" fullWidth icon={Compass}>
                    Explore Pathway
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="font-body text-xs text-[#09090B] leading-relaxed">
                  {mlError || "ML service recommendation will activate as you complete course sessions and assessments."}
                </div>
                <Link to="/engagement">
                  <Button variant="secondary" size="sm" fullWidth>
                    View Pathways Hub
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Assessment Status Card */}
          <Card variant="default" shadow="normal" rounded="brutal" className="p-6">
            <div className="flex items-center justify-between border-b-2 border-[#09090B] pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#09090B]" />
                <h2 className="font-heading text-base uppercase text-[#09090B]">
                  ASSESSMENTS
                </h2>
              </div>
              <Link to="/assessments">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
            </div>

            {assessmentResults.length > 0 ? (
              <div className="space-y-3">
                {assessmentResults.map((res) => (
                  <div
                    key={res._id}
                    className="border-2 border-[#09090B] bg-[#F8F4E8] p-3 rounded-[8px] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold uppercase text-[#09090B]">
                        {res.assessmentId?.title || "Assessment"}
                      </div>
                      <div className="text-[10px] font-mono text-[#71717A]">
                        {res.assessmentId?.type ? `${res.assessmentId.type.toUpperCase()} Course` : "Quiz"}
                      </div>
                    </div>
                    <Badge variant="acid" size="sm">
                      Score: {res.score}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-xs font-body text-[#52525B]">
                <p className="mb-3">No assessment results available yet.</p>
                <Link to="/assessments">
                  <Button variant="acid" size="sm">
                    Take Assessments
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Post-Course Engagement Status */}
          <Card variant="default" shadow="normal" rounded="brutal" className="p-6">
            <div className="flex items-center justify-between border-b-2 border-[#09090B] pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-[#09090B]" />
                <h2 className="font-heading text-base uppercase text-[#09090B]">
                  ENGAGEMENT
                </h2>
              </div>
              <Link to="/engagement">
                <Button variant="outline" size="sm">
                  Hub
                </Button>
              </Link>
            </div>

            {engagements.length > 0 ? (
              <div className="space-y-2">
                {engagements.map((eng) => (
                  <div
                    key={eng._id}
                    className="border-2 border-[#09090B] bg-[#F8F4E8] p-3 rounded-[8px] flex items-center justify-between text-xs"
                  >
                    <span className="font-bold uppercase text-[#09090B]">
                      {eng.pathway.replace("_", " ")}
                    </span>
                    <Badge variant="completed" size="sm">
                      {eng.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-xs font-body text-[#52525B]">
                <p className="mb-3">No engagement activity yet.</p>
                <Link to="/engagement">
                  <Button variant="secondary" size="sm">
                    Choose Pathway
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

