import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { engagementsApi } from "../api/engagements";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import {
  Compass,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  MessageSquare,
  BookOpen,
} from "lucide-react";

export const Engagement = () => {
  const { user } = useAuth();
  const userId = user?.id || user?._id;

  const [engagements, setEngagements] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mlLoading, setMlLoading] = useState(true);
  const [mlError, setMlError] = useState(null);
  const [joiningPathway, setJoiningPathway] = useState(null);
  const [error, setError] = useState(null);

  const fetchEngagementData = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch user's registered engagements
      const res = await engagementsApi.getUserEngagements(userId);
      setEngagements(res.engagements || []);
    } catch (err) {
      console.error("Engagement fetch error:", err);
      setError("Failed to load pathway records.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMLRecommendation = async () => {
    if (!userId) return;

    try {
      setMlLoading(true);
      setMlError(null);
      const res = await engagementsApi.getJourneyRecommendation(userId);
      if (res && res.data) {
        setRecommendation(res.data);
      }
    } catch (err) {
      console.log("ML recommendation unavailable:", err.response?.data?.message || err.message);
      setMlError(
        err.response?.data?.message ||
        "ML recommendation service is currently evaluating your course progression."
      );
    } finally {
      setMlLoading(false);
    }
  };

  useEffect(() => {
    fetchEngagementData();
    fetchMLRecommendation();
  }, [userId]);

  const handleJoinPathway = async (pathwayKey) => {
    if (!userId) return;

    try {
      setJoiningPathway(pathwayKey);
      const res = await engagementsApi.createEngagement({
        userId,
        pathway: pathwayKey,
        status: "active",
      });

      if (res && res.engagement) {
        setEngagements([...engagements, res.engagement]);
      }
    } catch (err) {
      console.error("Join pathway error:", err);
      alert(err.response?.data?.message || "Failed to register for pathway.");
    } finally {
      setJoiningPathway(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <LoadingState message="Loading post-course engagement pathways..." />
      </div>
    );
  }

  const activePathways = new Set(engagements.map((e) => e.pathway));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="border-2 border-[#09090B] bg-[#FFFFFF] rounded-[16px] p-6 md:p-8 shadow-[4px_4px_0_#09090B]">
        <Badge variant="acid" size="sm" className="mb-2">
          POST-COURSE ENGAGEMENT
        </Badge>
        <h1 className="font-heading text-3xl sm:text-4xl uppercase text-[#09090B] tracking-tight">
          CHAMPION PATHWAYS
        </h1>
        <p className="font-body text-sm text-[#52525B] mt-2 max-w-2xl">
          Graduating from the 9 sessions leads into specialized continued engagement. Choose a
          pathway aligned with your community impact goals.
        </p>
      </div>

      {/* ML Recommendation Section (Requirement #16) */}
      <div className="border-2 border-[#09090B] bg-[#D2E823] rounded-[20px] p-6 md:p-10 shadow-[6px_6px_0_#09090B]">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-8 h-8 bg-[#09090B] text-[#D2E823] rounded-[6px] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <Badge variant="dark" size="md">
            BACKEND ML SERVICE
          </Badge>
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl uppercase text-[#09090B] mb-2">
          YOUR RECOMMENDED JOURNEY
        </h2>

        {mlLoading ? (
          <div className="py-6 text-center">
            <div className="w-8 h-8 border-2 border-[#09090B] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="font-mono text-xs font-bold text-[#09090B]">
              Querying FastAPI Recommendation Engine...
            </p>
          </div>
        ) : recommendation && recommendation.recommendation ? (
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-5 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] rounded-[12px] p-6 shadow-[4px_4px_0_#09090B] flex flex-col justify-center items-center text-center">
                <span className="font-mono text-xs text-[#A1A1AA] uppercase tracking-wider mb-1 font-bold">
                  RECOMMENDED PATHWAY
                </span>
                <span className="font-heading text-3xl uppercase text-[#D2E823]">
                  {recommendation.recommendation.pathway.replace("_", " ")}
                </span>
                <Badge variant="acid" size="sm" className="mt-3">
                  OPTIMAL MATCH
                </Badge>
              </div>

              <div className="md:col-span-7 bg-[#FFFFFF] border-2 border-[#09090B] rounded-[12px] p-6 shadow-[4px_4px_0_#09090B] space-y-4">
                <span className="font-mono text-xs text-[#09090B] uppercase tracking-wider font-bold block">
                  SYSTEM REASONING
                </span>
                <p className="font-body text-sm text-[#09090B] leading-relaxed">
                  {recommendation.recommendation.reason}
                </p>

                {recommendation.features && (
                  <div className="pt-3 border-t-2 border-[#09090B]/10 grid grid-cols-3 gap-2 font-mono text-xs text-[#09090B]">
                    <div className="bg-[#F8F4E8] p-2 rounded border border-[#09090B]/30 text-center">
                      <div className="font-bold text-sm">
                        {recommendation.features.sessions_completed}
                      </div>
                      <div className="text-[10px] text-[#71717A]">Sessions</div>
                    </div>
                    <div className="bg-[#F8F4E8] p-2 rounded border border-[#09090B]/30 text-center">
                      <div className="font-bold text-sm">
                        {recommendation.features.assessment_count}
                      </div>
                      <div className="text-[10px] text-[#71717A]">Assessments</div>
                    </div>
                    <div className="bg-[#F8F4E8] p-2 rounded border border-[#09090B]/30 text-center">
                      <div className="font-bold text-sm">
                        {recommendation.features.engagement_count}
                      </div>
                      <div className="text-[10px] text-[#71717A]">Engagements</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#FFFFFF]/90 border-2 border-[#09090B] rounded-[12px] p-6 mt-4">
            <p className="font-body text-xs text-[#09090B] leading-relaxed">
              {mlError ||
                "Recommendation models adapt to your activity. As you attend sessions, submit attestations, and take assessments, the model evaluates your optimal track."}
            </p>
          </div>
        )}
      </div>

      {/* The 3 Canonical Pathways (Requirement #15) */}
      <div className="space-y-6">
        <h2 className="font-heading text-2xl uppercase text-[#09090B]">
          EXPLORE THE THREE PATHWAYS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. SAATHI PATHWAY */}
          <Card
            variant="default"
            shadow="large"
            rounded="brutal-lg"
            className="p-6 md:p-8 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-[#D2E823] border-2 border-[#09090B] rounded-[10px] flex items-center justify-center shadow-[2px_2px_0_#09090B]">
                  <HeartHandshake className="w-6 h-6 text-[#09090B]" />
                </div>
                {activePathways.has("saathi") && (
                  <Badge variant="completed" size="sm">
                    Enrolled
                  </Badge>
                )}
              </div>

              <div>
                <Badge variant="acid" size="sm" className="mb-2">
                  PEER & ALUMNI
                </Badge>
                <h3 className="font-heading text-xl uppercase text-[#09090B]">
                  SAATHI PATHWAY
                </h3>
                <p className="font-body text-xs text-[#52525B] leading-relaxed mt-2">
                  The alumni and peer experience-sharing network. Connect with fellow champions to
                  troubleshoot field test kits, share local water purification stories, and exchange
                  best practices.
                </p>
              </div>

              <div className="bg-[#F8F4E8] border-2 border-[#09090B] p-3 rounded-[8px] space-y-1.5 text-xs font-mono">
                <div className="flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#09090B] mr-2" />
                  <span>Peer experience-sharing circles</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#09090B] mr-2" />
                  <span>District champion network</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t-2 border-[#09090B]/10">
              {activePathways.has("saathi") ? (
                <Button variant="secondary" size="md" fullWidth disabled>
                  Active Member
                </Button>
              ) : (
                <Button
                  variant="acid"
                  size="md"
                  fullWidth
                  disabled={joiningPathway === "saathi"}
                  onClick={() => handleJoinPathway("saathi")}
                >
                  {joiningPathway === "saathi" ? "Joining..." : "Join Saathi Pathway"}
                </Button>
              )}
            </div>
          </Card>

          {/* 2. GUIDED MENTORING */}
          <Card
            variant="default"
            shadow="large"
            rounded="brutal-lg"
            className="p-6 md:p-8 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-[#00D2FF] border-2 border-[#09090B] rounded-[10px] flex items-center justify-center shadow-[2px_2px_0_#09090B]">
                  <Compass className="w-6 h-6 text-[#09090B]" />
                </div>
                {activePathways.has("guided_mentoring") && (
                  <Badge variant="completed" size="sm">
                    Enrolled
                  </Badge>
                )}
              </div>

              <div>
                <Badge variant="cyan" size="sm" className="mb-2">
                  CASE STUDIES & MENTORS
                </Badge>
                <h3 className="font-heading text-xl uppercase text-[#09090B]">
                  GUIDED MENTORING
                </h3>
                <p className="font-body text-xs text-[#52525B] leading-relaxed mt-2">
                  Work on real-life case studies, join dedicated village support groups, discuss
                  challenges with senior water scientists, and draft remediation plans.
                </p>
              </div>

              <div className="bg-[#F8F4E8] border-2 border-[#09090B] p-3 rounded-[8px] space-y-1.5 text-xs font-mono">
                <div className="flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#09090B] mr-2" />
                  <span>Real-life field case studies</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#09090B] mr-2" />
                  <span>Interactive comments & support groups</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t-2 border-[#09090B]/10 space-y-2">
              {activePathways.has("guided_mentoring") ? (
                <Link to="/case-studies">
                  <Button variant="primary" size="md" fullWidth icon={ArrowRight}>
                    Open Case Studies
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="acid"
                  size="md"
                  fullWidth
                  disabled={joiningPathway === "guided_mentoring"}
                  onClick={() => handleJoinPathway("guided_mentoring")}
                >
                  {joiningPathway === "guided_mentoring" ? "Joining..." : "Join Guided Mentoring"}
                </Button>
              )}
            </div>
          </Card>

          {/* 3. TRAINER PATHWAY */}
          <Card
            variant="default"
            shadow="large"
            rounded="brutal-lg"
            className="p-6 md:p-8 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-[#FF8A00] border-2 border-[#09090B] rounded-[10px] flex items-center justify-center shadow-[2px_2px_0_#09090B]">
                  <ShieldCheck className="w-6 h-6 text-[#09090B]" />
                </div>
                {activePathways.has("trainer") && (
                  <Badge variant="completed" size="sm">
                    Enrolled
                  </Badge>
                )}
              </div>

              <div>
                <Badge variant="amber" size="sm" className="mb-2">
                  CERTIFIED TRAINER
                </Badge>
                <h3 className="font-heading text-xl uppercase text-[#09090B]">
                  TRAINER PATHWAY
                </h3>
                <p className="font-body text-xs text-[#52525B] leading-relaxed mt-2">
                  Return as a certified trainer to coach new cohorts of Water Quality Champions,
                  host regional workshops, and coordinate testing under the Jal Jeevan Mission.
                </p>
              </div>

              <div className="bg-[#F8F4E8] border-2 border-[#09090B] p-3 rounded-[8px] space-y-1.5 text-xs font-mono">
                <div className="flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#09090B] mr-2" />
                  <span>Trainer certification & curriculum tools</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#09090B] mr-2" />
                  <span>Lead regional workshops & cohorts</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t-2 border-[#09090B]/10">
              {activePathways.has("trainer") ? (
                <Button variant="secondary" size="md" fullWidth disabled>
                  Certified Trainer
                </Button>
              ) : (
                <Button
                  variant="acid"
                  size="md"
                  fullWidth
                  disabled={joiningPathway === "trainer"}
                  onClick={() => handleJoinPathway("trainer")}
                >
                  {joiningPathway === "trainer" ? "Joining..." : "Join Trainer Pathway"}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Engagement;

