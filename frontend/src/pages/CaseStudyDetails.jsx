import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  MessageSquare,
  ArrowLeft,
  Send,
  User,
  Calendar,
  Tag,
} from "lucide-react";

export const CaseStudyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const userId = user?.id || user?._id;

  const [caseStudy, setCaseStudy] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch Case Study
      const data = await caseStudiesApi.getCaseStudyById(id);
      setCaseStudy(data);

      // Fetch Comments
      const commRes = await caseStudiesApi.getComments(id);
      setComments(commRes.comments || []);
    } catch (err) {
      console.error("Case study details fetch error:", err);
      setError("Failed to load case study details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userId) return;

    try {
      setSubmittingComment(true);
      const res = await caseStudiesApi.addComment({
        caseStudyId: id,
        userId,
        content: newComment.trim(),
      });

      if (res && res.comment) {
        // Optimistically attach user object if populated was missing
        const commentWithUser = {
          ...res.comment,
          userId: res.comment.userId || { name: user.name },
        };
        setComments([...comments, commentWithUser]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Add comment error:", err);
      alert(err.response?.data?.message || "Failed to post comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingState message="Loading case study & comments..." />
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState message={error || "Case study not found."} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-8">
      {/* Back button */}
      <Link
        to="/case-studies"
        className="inline-flex items-center text-xs font-mono font-bold uppercase text-[#09090B] hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Case Studies
      </Link>

      {/* Case Study Content */}
      <Card variant="default" shadow="large" rounded="brutal-lg" className="p-6 md:p-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#09090B] pb-4">
          <Badge variant="acid" size="sm">
            {caseStudy.status || "Published"}
          </Badge>
          <div className="flex items-center space-x-4 font-mono text-xs text-[#71717A]">
            <span className="flex items-center">
              <User className="w-3.5 h-3.5 mr-1" />
              {caseStudy.userId?.name || "Author"}
            </span>
            {caseStudy.createdAt && (
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {new Date(caseStudy.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div>
          <h1 className="font-heading text-2xl sm:text-3xl uppercase text-[#09090B] tracking-tight mb-4">
            {caseStudy.title}
          </h1>
          <p className="font-body text-sm text-[#27272A] leading-relaxed whitespace-pre-line">
            {caseStudy.description}
          </p>
        </div>

        {caseStudy.tags && caseStudy.tags.length > 0 && (
          <div className="pt-4 border-t border-[#09090B]/10 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-[#71717A] flex items-center mr-1">
              <Tag className="w-3.5 h-3.5 mr-1" />
              Tags:
            </span>
            {caseStudy.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs font-mono bg-[#F8F4E8] border border-[#09090B] px-2.5 py-1 rounded font-bold"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Real Comments Section (Requirement #17) */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 border-b-2 border-[#09090B] pb-3">
          <MessageSquare className="w-5 h-5 text-[#09090B]" />
          <h2 className="font-heading text-xl uppercase text-[#09090B]">
            DISCUSSION & COMMENTS ({comments.length})
          </h2>
        </div>

        {/* Add Comment Box */}
        <Card variant="canvas" shadow="normal" rounded="brutal" className="p-6">
          <form onSubmit={handleAddComment} className="space-y-3">
            <label className="block font-mono text-xs uppercase font-bold text-[#09090B]">
              Add Your Field Insight / Solution
            </label>
            <textarea
              required
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share testing advice, community mitigation recommendations, or ask questions..."
              className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border-2 border-[#09090B] rounded-[8px] font-body text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D2E823]"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="acid"
                size="sm"
                icon={Send}
                disabled={submittingComment || !newComment.trim()}
              >
                {submittingComment ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Comment Thread */}
        {comments.length === 0 ? (
          <EmptyState
            title="No comments yet."
            description="Be the first Water Quality Champion to contribute to this discussion."
          />
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const cId = comment._id || comment.id;
              const authorName =
                typeof comment.userId === "object"
                  ? comment.userId?.name || "Champion"
                  : "Champion";

              return (
                <Card
                  key={cId}
                  variant="default"
                  shadow="sm"
                  rounded="brutal-sm"
                  className="p-4 md:p-5 space-y-2"
                >
                  <div className="flex items-center justify-between font-mono text-xs text-[#71717A] border-b border-[#09090B]/10 pb-1.5">
                    <span className="font-bold text-[#09090B]">{authorName}</span>
                    {comment.createdAt && (
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  <p className="font-body text-xs sm:text-sm text-[#27272A] leading-relaxed">
                    {comment.content}
                  </p>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseStudyDetails;

