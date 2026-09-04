import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { caseStudiesApi } from "../api/caseStudies";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import {
  FileText,
  Users,
  MessageSquare,
  Plus,
  ArrowRight,
  Sparkles,
  Tag,
  FolderOpen,
} from "lucide-react";

export const CaseStudies = () => {
  const { user } = useAuth();
  const userId = user?.id || user?._id;

  const [caseStudies, setCaseStudies] = useState([]);
  const [supportGroups, setSupportGroups] = useState([]);
  const [activeTab, setActiveTab] = useState("cases"); // cases | groups
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal for new case study
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCase, setNewCase] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [creatingCase, setCreatingCase] = useState(false);

  // Modal for new support group
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
  });
  const [creatingGroup, setCreatingGroup] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch Case Studies
      const caseRes = await caseStudiesApi.getCaseStudies();
      setCaseStudies(caseRes.caseStudies || []);

      // Fetch Support Groups
      const groupRes = await caseStudiesApi.getSupportGroups();
      setSupportGroups(groupRes.supportGroups || []);
    } catch (err) {
      console.error("Case studies fetch error:", err);
      setError("Failed to load case studies from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCase = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setCreatingCase(true);
      const tagList = newCase.tags
        ? newCase.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : ["Water Quality", "Field Action"];

      const res = await caseStudiesApi.createCaseStudy({
        userId,
        title: newCase.title,
        description: newCase.description,
        tags: tagList,
        status: "published",
      });

      if (res && res.caseStudy) {
        setCaseStudies([res.caseStudy, ...caseStudies]);
        setShowCreateModal(false);
        setNewCase({ title: "", description: "", tags: "" });
      }
    } catch (err) {
      console.error("Create case study error:", err);
      alert(err.response?.data?.message || "Failed to publish case study.");
    } finally {
      setCreatingCase(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setCreatingGroup(true);
      const res = await caseStudiesApi.createSupportGroup({
        name: newGroup.name,
        description: newGroup.description,
      });

      if (res && res.supportGroup) {
        setSupportGroups([res.supportGroup, ...supportGroups]);
        setShowGroupModal(false);
        setNewGroup({ name: "", description: "" });
      }
    } catch (err) {
      console.error("Create support group error:", err);
      alert(err.response?.data?.message || "Failed to create support group.");
    } finally {
      setCreatingGroup(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    if (!userId) return;
    try {
      const res = await caseStudiesApi.joinSupportGroup(groupId, userId);
      if (res && res.supportGroup) {
        setSupportGroups(
          supportGroups.map((g) => (g._id === groupId ? res.supportGroup : g))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join support group.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <LoadingState message="Loading case studies & support groups..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-2 border-[#09090B] bg-[#FFFFFF] rounded-[16px] p-6 md:p-8 shadow-[4px_4px_0_#09090B]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="cyan" size="sm" className="mb-2">
              GUIDED MENTORING HUB
            </Badge>
            <h1 className="font-heading text-3xl sm:text-4xl uppercase text-[#09090B] tracking-tight">
              FIELD CASE STUDIES & GROUPS
            </h1>
            <p className="font-body text-sm text-[#52525B] mt-2 max-w-2xl">
              Documenting ground realities, solving complex water contamination issues, and
              collaborating in peer support groups.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="acid"
              size="sm"
              icon={Plus}
              onClick={() => setShowCreateModal(true)}
            >
              Submit Case Study
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={Users}
              onClick={() => setShowGroupModal(true)}
            >
              New Support Group
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b-2 border-[#09090B] pb-2 font-heading text-xs uppercase">
        <button
          onClick={() => setActiveTab("cases")}
          className={`px-4 py-2 border-2 rounded-[8px] transition-all ${
            activeTab === "cases"
              ? "bg-[#09090B] text-[#D2E823] border-[#09090B] shadow-[2px_2px_0_#09090B]"
              : "border-transparent text-[#09090B] hover:bg-[#FFFFFF]"
          }`}
        >
          Case Studies ({caseStudies.length})
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={`px-4 py-2 border-2 rounded-[8px] transition-all ${
            activeTab === "groups"
              ? "bg-[#09090B] text-[#D2E823] border-[#09090B] shadow-[2px_2px_0_#09090B]"
              : "border-transparent text-[#09090B] hover:bg-[#FFFFFF]"
          }`}
        >
          Support Groups ({supportGroups.length})
        </button>
      </div>

      {/* Tab 1: Case Studies */}
      {activeTab === "cases" && (
        <div>
          {caseStudies.length === 0 ? (
            <EmptyState
              title="No case studies available yet."
              description="Be the first champion to share a field water quality case study from your district."
              actionLabel="Submit First Case Study"
              onAction={() => setShowCreateModal(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudies.map((cs) => {
                const csId = cs._id || cs.id;
                return (
                  <Card
                    key={csId}
                    variant="default"
                    shadow="normal"
                    rounded="brutal"
                    hoverEffect
                    className="p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="acid" size="sm">
                          {cs.status || "Published"}
                        </Badge>
                        <span className="font-mono text-[10px] text-[#71717A]">
                          {cs.createdAt ? new Date(cs.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>

                      <h3 className="font-heading text-lg uppercase text-[#09090B] mb-2 leading-snug">
                        {cs.title}
                      </h3>

                      <p className="font-body text-xs text-[#52525B] leading-relaxed mb-4 line-clamp-3">
                        {cs.description}
                      </p>

                      {cs.tags && cs.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {cs.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono bg-[#F8F4E8] border border-[#09090B] px-2 py-0.5 rounded font-bold"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#09090B]/10 flex items-center justify-between">
                      <span className="font-mono text-xs text-[#71717A]">
                        By: {cs.userId?.name || "WQC Champion"}
                      </span>
                      <Link to={`/case-studies/${csId}`}>
                        <Button variant="secondary" size="sm" icon={MessageSquare}>
                          View Discussion
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Support Groups (Requirement #18) */}
      {activeTab === "groups" && (
        <div>
          {supportGroups.length === 0 ? (
            <EmptyState
              title="No support groups available yet."
              description="Create a community support group to collaborate on local safe water actions."
              actionLabel="Create Support Group"
              onAction={() => setShowGroupModal(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {supportGroups.map((grp) => {
                const grpId = grp._id || grp.id;
                const members = grp.members || [];
                const isMember = members.some((m) => (m._id || m) === userId);

                return (
                  <Card
                    key={grpId}
                    variant="default"
                    shadow="normal"
                    rounded="brutal"
                    className="p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 bg-[#00D2FF] border-2 border-[#09090B] rounded-[8px] flex items-center justify-center mb-3 shadow-[2px_2px_0_#09090B]">
                        <Users className="w-5 h-5 text-[#09090B]" />
                      </div>
                      <h3 className="font-heading text-base uppercase text-[#09090B] mb-1">
                        {grp.name}
                      </h3>
                      <p className="font-body text-xs text-[#52525B] leading-relaxed mb-4">
                        {grp.description || "Community water action support group."}
                      </p>
                      <div className="font-mono text-xs text-[#09090B] font-bold mb-4">
                        Members: {members.length}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#09090B]/10">
                      {isMember ? (
                        <Badge variant="completed" size="md" className="w-full justify-center">
                          Joined Member
                        </Badge>
                      ) : (
                        <Button
                          variant="acid"
                          size="sm"
                          fullWidth
                          onClick={() => handleJoinGroup(grpId)}
                        >
                          Join Group
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal: Create Case Study */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#09090B]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card
            variant="default"
            shadow="xl"
            rounded="brutal-lg"
            className="w-full max-w-lg p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b-2 border-[#09090B] pb-3">
              <h3 className="font-heading text-lg uppercase text-[#09090B]">
                NEW FIELD CASE STUDY
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="font-bold text-lg hover:text-[#FF4B4B]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase font-bold mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newCase.title}
                  onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                  placeholder="e.g. High Fluoride Remediation in Nalhati Village"
                  className="w-full px-3 py-2 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] text-sm focus:outline-none focus:bg-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase font-bold mb-1">
                  Description & Ground Findings *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newCase.description}
                  onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                  placeholder="Detail the water quality test results, community impact, and mitigation steps taken..."
                  className="w-full px-3 py-2 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] text-sm focus:outline-none focus:bg-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase font-bold mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newCase.tags}
                  onChange={(e) => setNewCase({ ...newCase, tags: e.target.value })}
                  placeholder="Fluoride, Biosand Filter, Jhabua, JJM"
                  className="w-full px-3 py-2 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] text-sm focus:outline-none focus:bg-[#FFFFFF]"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="acid"
                  size="sm"
                  type="submit"
                  disabled={creatingCase}
                >
                  {creatingCase ? "Publishing..." : "Publish Case Study"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Modal: Create Support Group */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 bg-[#09090B]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card
            variant="default"
            shadow="xl"
            rounded="brutal-lg"
            className="w-full max-w-md p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b-2 border-[#09090B] pb-3">
              <h3 className="font-heading text-lg uppercase text-[#09090B]">
                CREATE SUPPORT GROUP
              </h3>
              <button
                onClick={() => setShowGroupModal(false)}
                className="font-bold text-lg hover:text-[#FF4B4B]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase font-bold mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  required
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  placeholder="e.g. Eastern Region Arsenic Mitigation"
                  className="w-full px-3 py-2 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] text-sm focus:outline-none focus:bg-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase font-bold mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="Describe the group's focus and geographic area..."
                  className="w-full px-3 py-2 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] text-sm focus:outline-none focus:bg-[#FFFFFF]"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="acid"
                  size="sm"
                  type="submit"
                  disabled={creatingGroup}
                >
                  {creatingGroup ? "Creating..." : "Create Group"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CaseStudies;

