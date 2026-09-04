import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sessionsApi } from "../api/sessions";
import { resourcesApi } from "../api/resources";
import { attestationsApi } from "../api/attestations";
import { progressApi } from "../api/progress";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import confetti from "canvas-confetti";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  PlayCircle,
  FileText,
  Download,
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
  Check,
} from "lucide-react";

export const SessionDetails = () => {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const userId = user?.id || user?._id;
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [resources, setResources] = useState([]);
  const [sessionStatus, setSessionStatus] = useState("not_started"); // not_started | in_progress | completed
  const [attestationState, setAttestationState] = useState({
    startAttested: false,
    contentAccessed: false,
    endAttested: false,
  });

  const [loading, setLoading] = useState(true);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resourceError, setResourceError] = useState(null);

  const fetchSessionData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get Session details
      const sessionData = await sessionsApi.getSessionById(sessionId);
      setSession(sessionData);

      // 2. Fetch Progress for this user to determine status
      if (userId) {
        const progRes = await progressApi.getUserProgress(userId).catch(() => null);
        if (progRes && progRes.progress) {
          const matched = progRes.progress.find(
            (p) => (p.sessionId?._id || p.sessionId) === sessionId
          );
          if (matched) {
            setSessionStatus(matched.status);
            if (matched.status === "in_progress") {
              setAttestationState((prev) => ({ ...prev, startAttested: true }));
            } else if (matched.status === "completed") {
              setAttestationState({
                startAttested: true,
                contentAccessed: true,
                endAttested: true,
              });
            }
          }
        }
      }
    } catch (err) {
      console.error("Session fetch error:", err);
      setError("Failed to load session details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      setResourcesLoading(true);
      setResourceError(null);
      const resData = await resourcesApi.getSessionResources(sessionId);
      setResources(resData.resources || []);
    } catch (err) {
      console.error("Resources fetch error:", err);
      setResourceError("Failed to fetch session resources.");
    } finally {
      setResourcesLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionData();
    fetchResources();
  }, [sessionId, userId]);

  // Start Session Workflow
  const handleStartSession = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      setActionLoading(true);
      const courseId = session.courseId?._id || session.courseId;

      // 1. Start attestation
      await attestationsApi.startAttestation({
        userId,
        sessionId,
      });

      // 2. Start session progress
      await sessionsApi.startSession({
        userId,
        courseId,
        sessionId,
      });

      setSessionStatus("in_progress");
      setAttestationState((prev) => ({ ...prev, startAttested: true }));
    } catch (err) {
      console.error("Start session error:", err);
      alert(err.response?.data?.message || "Failed to start session.");
    } finally {
      setActionLoading(false);
    }
  };

  // Record Content Access Workflow
  const handleAccessContent = async () => {
    if (!userId) return;
    try {
      await attestationsApi.recordContentAccess({
        userId,
        sessionId,
      });
      setAttestationState((prev) => ({ ...prev, contentAccessed: true }));
    } catch (err) {
      console.warn("Content access record error:", err);
    }
  };

  // Complete Session Workflow
  const handleCompleteSession = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      setActionLoading(true);

      // 1. End attestation
      await attestationsApi.endAttestation({
        userId,
        sessionId,
      });

      // 2. Complete session progress
      await sessionsApi.completeSession({
        userId,
        sessionId,
      });

      setSessionStatus("completed");
      setAttestationState((prev) => ({ ...prev, endAttested: true }));

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D2E823", "#09090B", "#00D2FF"],
      });
    } catch (err) {
      console.error("Complete session error:", err);
      alert(err.response?.data?.message || "Failed to complete session.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <LoadingState message="Loading session workspace..." />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <ErrorState message={error || "Session not found."} onRetry={fetchSessionData} />
      </div>
    );
  }

  const courseId = session.courseId?._id || session.courseId;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
      {/* Back button */}
      <Link
        to={`/courses/${courseId}`}
        className="inline-flex items-center text-xs font-mono font-bold uppercase text-[#09090B] hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Course Curriculum
      </Link>

      {/* Session Hero Banner */}
      <div className="border-2 border-[#09090B] bg-[#FFFFFF] rounded-[20px] p-6 md:p-10 shadow-[6px_6px_0_#09090B]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center space-x-2">
              <Badge variant="dark" size="sm">
                SESSION {session.sessionNumber} OF 9
              </Badge>
              <Badge
                variant={
                  sessionStatus === "completed"
                    ? "completed"
                    : sessionStatus === "in_progress"
                    ? "in_progress"
                    : "not_started"
                }
                size="sm"
              >
                {sessionStatus === "completed"
                  ? "Completed"
                  : sessionStatus === "in_progress"
                  ? "In Progress"
                  : "Not Started"}
              </Badge>
            </div>

            <h1 className="font-heading text-2xl sm:text-4xl uppercase text-[#09090B] tracking-tight">
              {session.title}
            </h1>

            <p className="font-body text-sm text-[#52525B] leading-relaxed">
              {session.description}
            </p>
          </div>

          {/* Workflow Action Controls */}
          <div className="flex flex-col gap-3 min-w-[220px]">
            {sessionStatus === "not_started" && (
              <Button
                variant="acid"
                size="lg"
                icon={PlayCircle}
                disabled={actionLoading}
                onClick={handleStartSession}
              >
                {actionLoading ? "Attesting Start..." : "Start Session"}
              </Button>
            )}

            {sessionStatus === "in_progress" && (
              <Button
                variant="primary"
                size="lg"
                icon={CheckCircle2}
                disabled={actionLoading}
                onClick={handleCompleteSession}
              >
                {actionLoading ? "Attesting End..." : "Complete Session"}
              </Button>
            )}

            {sessionStatus === "completed" && (
              <div className="bg-[#D2E823] border-2 border-[#09090B] p-4 rounded-[12px] shadow-[2px_2px_0_#09090B] text-center">
                <Check className="w-6 h-6 text-[#09090B] mx-auto mb-1" />
                <span className="font-heading text-xs uppercase text-[#09090B] block">
                  Session Completed
                </span>
                <span className="text-[11px] font-mono text-[#09090B] block">
                  Verified Attestation Stored
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Digital Attestation Status Tracker */}
      <Card variant="canvas" shadow="normal" rounded="brutal" className="p-6">
        <div className="flex items-center space-x-2 border-b-2 border-[#09090B] pb-3 mb-4">
          <ShieldCheck className="w-5 h-5 text-[#09090B]" />
          <h2 className="font-heading text-base uppercase text-[#09090B]">
            DIGITAL ATTESTATION WORKFLOW
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* Step 1 */}
          <div
            className={`border-2 border-[#09090B] p-4 rounded-[8px] flex items-center justify-between ${
              attestationState.startAttested
                ? "bg-[#D2E823]"
                : "bg-[#FFFFFF]"
            }`}
          >
            <div>
              <div className="font-bold uppercase">1. Start Attestation</div>
              <div className="text-[10px] text-[#52525B]">
                {attestationState.startAttested ? "Verified at session open" : "Pending start"}
              </div>
            </div>
            {attestationState.startAttested && <Check className="w-5 h-5" />}
          </div>

          {/* Step 2 */}
          <div
            className={`border-2 border-[#09090B] p-4 rounded-[8px] flex items-center justify-between ${
              attestationState.contentAccessed
                ? "bg-[#00D2FF]"
                : "bg-[#FFFFFF]"
            }`}
          >
            <div>
              <div className="font-bold uppercase">2. Content Access</div>
              <div className="text-[10px] text-[#52525B]">
                {attestationState.contentAccessed ? "Resource access logged" : "Recorded on access"}
              </div>
            </div>
            {attestationState.contentAccessed && <Check className="w-5 h-5" />}
          </div>

          {/* Step 3 */}
          <div
            className={`border-2 border-[#09090B] p-4 rounded-[8px] flex items-center justify-between ${
              attestationState.endAttested
                ? "bg-[#D2E823]"
                : "bg-[#FFFFFF]"
            }`}
          >
            <div>
              <div className="font-bold uppercase">3. End Attestation</div>
              <div className="text-[10px] text-[#52525B]">
                {attestationState.endAttested ? "Completion certified" : "Pending completion"}
              </div>
            </div>
            {attestationState.endAttested && <Check className="w-5 h-5" />}
          </div>
        </div>
      </Card>

      {/* Session Resources Section (Requirement #12) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#09090B] pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#09090B]" />
            <h2 className="font-heading text-xl uppercase text-[#09090B]">
              SESSION RESOURCES
            </h2>
          </div>
          <span className="font-mono text-xs text-[#71717A]">
            Field protocols & reading materials
          </span>
        </div>

        {resourcesLoading ? (
          <LoadingState message="Loading session resources..." />
        ) : resourceError ? (
          <ErrorState message={resourceError} onRetry={fetchResources} />
        ) : resources.length === 0 ? (
          <EmptyState
            title="No resources available yet."
            description="Reading notes and guides will be uploaded for this session."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((res) => (
              <Card
                key={res._id || res.id}
                variant="default"
                shadow="normal"
                rounded="brutal"
                hoverEffect
                className="p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="acid" size="sm">
                      {res.resourceType || "Resource"}
                    </Badge>
                  </div>
                  <h3 className="font-heading text-base uppercase text-[#09090B] mb-2">
                    {res.title}
                  </h3>
                  <p className="font-body text-xs text-[#52525B] leading-relaxed mb-4">
                    {res.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#09090B]/10">
                  <a
                    href={res.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleAccessContent}
                  >
                    <Button variant="secondary" size="sm" icon={ExternalLink} fullWidth>
                      Access Resource
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionDetails;

