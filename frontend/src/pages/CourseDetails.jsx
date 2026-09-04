import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { coursesApi } from "../api/courses";
import { sessionsApi } from "../api/sessions";
import { enrollmentsApi } from "../api/enrollments";
import { progressApi } from "../api/progress";
import { assessmentsApi } from "../api/assessments";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Award,
  PlayCircle,
  FileText,
  UserPlus,
  Compass,
} from "lucide-react";

export const CourseDetails = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const userId = user?.id || user?._id;
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get Course details
      const courseData = await coursesApi.getCourseById(courseId);
      setCourse(courseData);

      // 2. Get Sessions for this course
      const sessionRes = await sessionsApi.getCourseSessions(courseId);
      setSessions(sessionRes.sessions || []);

      // 3. Get Course assessments
      const assessRes = await assessmentsApi.getCourseAssessments(courseId).catch(() => ({ assessments: [] }));
      setAssessments(assessRes.assessments || []);

      // 4. If logged in, check user enrollment & progress
      if (userId) {
        const enrollRes = await enrollmentsApi.getUserEnrollments(userId).catch(() => ({ enrollments: [] }));
        const currentEnrollment = (enrollRes.enrollments || []).find(
          (e) => (e.courseId?._id || e.courseId) === courseId
        );
        setEnrollment(currentEnrollment);

        const progRes = await progressApi.getUserProgress(userId).catch(() => null);
        if (progRes && progRes.progress) {
          const map = {};
          progRes.progress.forEach((p) => {
            const sid = p.sessionId?._id || p.sessionId;
            map[sid] = p.status;
          });
          setProgressMap(map);
        }
      }
    } catch (err) {
      console.error("Course details fetch error:", err);
      setError("Failed to load course details from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId, userId]);

  const handleEnroll = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      setEnrolling(true);
      const res = await enrollmentsApi.createEnrollment({
        userId,
        courseId,
      });
      if (res && res.enrollment) {
        setEnrollment(res.enrollment);
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      alert(err.response?.data?.message || "Failed to enroll in course.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <LoadingState message="Loading course curriculum & sessions..." />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <ErrorState message={error || "Course not found."} onRetry={fetchCourseData} />
      </div>
    );
  }

  const preAssessment = assessments.find((a) => a.type === "pre");
  const postAssessment = assessments.find((a) => a.type === "post");

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
      {/* Course Hero Header */}
      <div className="border-2 border-[#09090B] bg-[#FFFFFF] rounded-[20px] p-6 md:p-10 shadow-[6px_6px_0_#09090B]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center space-x-2">
              <Badge variant="acid" size="sm">
                OFFICIAL WQM PROGRAM
              </Badge>
              <Badge variant="dark" size="sm">
                {course.totalSessions || 9} SESSIONS
              </Badge>
              {enrollment && (
                <Badge variant="completed" size="sm">
                  ENROLLED
                </Badge>
              )}
            </div>

            <h1 className="font-heading text-2xl sm:text-4xl uppercase text-[#09090B] tracking-tight">
              {course.title}
            </h1>

            <p className="font-body text-sm text-[#52525B] leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="flex-shrink-0">
            {enrollment ? (
              <div className="text-center bg-[#F8F4E8] border-2 border-[#09090B] p-4 rounded-[12px] shadow-[2px_2px_0_#09090B]">
                <span className="font-mono text-xs font-bold text-[#09090B] block mb-1">
                  STATUS: ACTIVE
                </span>
                <span className="text-xs text-[#52525B] font-body block">
                  Enrolled as Champion
                </span>
              </div>
            ) : (
              <Button
                variant="acid"
                size="lg"
                icon={UserPlus}
                disabled={enrolling}
                onClick={handleEnroll}
              >
                {enrolling ? "Enrolling..." : "Enroll in Course"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Pre & Post Course Assessment Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pre Assessment */}
        <Card variant="canvas" shadow="normal" rounded="brutal" className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="cyan" size="sm">
              PHASE 1 • PRE-COURSE
            </Badge>
            <Award className="w-5 h-5 text-[#09090B]" />
          </div>
          <h3 className="font-heading text-lg uppercase text-[#09090B] mb-2">
            Baseline Pre-Assessment
          </h3>
          <p className="font-body text-xs text-[#52525B] mb-4">
            Evaluate initial knowledge before beginning the sessions. Required for baseline certification.
          </p>
          {preAssessment ? (
            <Link to={`/assessments/${preAssessment._id || preAssessment.id}`}>
              <Button variant="secondary" size="sm" icon={ArrowRight}>
                Take Pre-Assessment
              </Button>
            </Link>
          ) : (
            <span className="font-mono text-xs text-[#71717A]">
              Pre-assessment pending configuration.
            </span>
          )}
        </Card>

        {/* Post Assessment */}
        <Card variant="canvas" shadow="normal" rounded="brutal" className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="amber" size="sm">
              PHASE 3 • POST-COURSE
            </Badge>
            <Award className="w-5 h-5 text-[#09090B]" />
          </div>
          <h3 className="font-heading text-lg uppercase text-[#09090B] mb-2">
            Comprehensive Post-Assessment
          </h3>
          <p className="font-body text-xs text-[#52525B] mb-4">
            Taken after completing all 9 sessions to unlock your ML pathway recommendation.
          </p>
          {postAssessment ? (
            <Link to={`/assessments/${postAssessment._id || postAssessment.id}`}>
              <Button variant="acid" size="sm" icon={ArrowRight}>
                Take Post-Assessment
              </Button>
            </Link>
          ) : (
            <span className="font-mono text-xs text-[#71717A]">
              Post-assessment pending configuration.
            </span>
          )}
        </Card>
      </div>

      {/* 9 Sessions Structure */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#09090B] pb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-[#09090B]" />
            <h2 className="font-heading text-xl uppercase text-[#09090B]">
              COURSE SESSIONS ({sessions.length})
            </h2>
          </div>
          <span className="font-mono text-xs text-[#71717A]">
            Real Backend Sessions
          </span>
        </div>

        {sessions.length === 0 ? (
          <EmptyState
            title="No sessions available yet."
            description="Sessions for this course have not been published in the database yet."
          />
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const sessionId = session._id || session.id;
              const status = progressMap[sessionId] || "not_started";
              const isCompleted = status === "completed";
              const isInProgress = status === "in_progress";

              return (
                <Card
                  key={sessionId}
                  variant="default"
                  shadow="normal"
                  rounded="brutal"
                  hoverEffect
                  className="p-5 md:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-10 h-10 rounded-[8px] border-2 border-[#09090B] flex items-center justify-center font-heading text-sm font-bold flex-shrink-0 shadow-[2px_2px_0_#09090B] ${
                          isCompleted
                            ? "bg-[#D2E823] text-[#09090B]"
                            : isInProgress
                            ? "bg-[#00D2FF] text-[#09090B]"
                            : "bg-[#F8F4E8] text-[#09090B]"
                        }`}
                      >
                        {session.sessionNumber}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-heading text-base text-[#09090B] uppercase">
                            {session.title}
                          </h3>
                        </div>
                        <p className="font-body text-xs text-[#52525B] mt-1 max-w-2xl">
                          {session.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0 self-end sm:self-center">
                      <Badge
                        variant={
                          isCompleted
                            ? "completed"
                            : isInProgress
                            ? "in_progress"
                            : "not_started"
                        }
                        size="sm"
                      >
                        {isCompleted
                          ? "Completed"
                          : isInProgress
                          ? "In Progress"
                          : "Not Started"}
                      </Badge>

                      <Link to={`/sessions/${sessionId}`}>
                        <Button
                          variant={isCompleted ? "secondary" : "primary"}
                          size="sm"
                          icon={PlayCircle}
                        >
                          {isCompleted ? "Review" : "Open Session"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;

