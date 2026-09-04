import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { assessmentsApi } from "../api/assessments";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import confetti from "canvas-confetti";
import { Award, ArrowLeft, CheckCircle2, AlertCircle, Send } from "lucide-react";

export const AssessmentView = () => {
  const { assessmentId } = useParams();
  const { user } = useAuth();
  const userId = user?.id || user?._id;
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assessmentsApi.getAssessmentById(assessmentId);
      setAssessment(data);
    } catch (err) {
      console.error("Fetch assessment error:", err);
      setError("Failed to load assessment questions from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessment();
  }, [assessmentId]);

  const handleSelectOption = (questionIdx, option) => {
    if (submittedResult) return;
    setAnswers({
      ...answers,
      [questionIdx]: option,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      navigate("/login");
      return;
    }

    const questions = assessment.questions || [];
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    // Compute actual score based on backend questions
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);

    try {
      setSubmitting(true);
      const res = await assessmentsApi.submitAssessment({
        userId,
        assessmentId,
        score,
      });

      if (res && res.result) {
        setSubmittedResult(res.result);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#D2E823", "#09090B", "#00D2FF"],
        });
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert(err.response?.data?.message || "Failed to submit assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingState message="Loading assessment questions..." />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState message={error || "Assessment not found."} onRetry={fetchAssessment} />
      </div>
    );
  }

  const questions = assessment.questions || [];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-8">
      {/* Back button */}
      <Link
        to="/assessments"
        className="inline-flex items-center text-xs font-mono font-bold uppercase text-[#09090B] hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Assessments
      </Link>

      {/* Assessment Header */}
      <div className="border-2 border-[#09090B] bg-[#FFFFFF] rounded-[16px] p-6 md:p-8 shadow-[6px_6px_0_#09090B]">
        <div className="flex items-center space-x-2 mb-2">
          <Badge variant={assessment.type === "pre" ? "cyan" : "acid"} size="sm">
            {assessment.type === "pre" ? "PRE-COURSE ASSESSMENT" : "POST-COURSE ASSESSMENT"}
          </Badge>
          <Badge variant="dark" size="sm">
            {questions.length} QUESTIONS
          </Badge>
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl uppercase text-[#09090B] tracking-tight">
          {assessment.title}
        </h1>
        <p className="font-body text-xs text-[#52525B] mt-2">
          Read each question carefully and select the single best option. Your score will be stored
          directly in your permanent WQC progress profile.
        </p>
      </div>

      {/* Result Card if submitted */}
      {submittedResult && (
        <Card variant="acid" shadow="large" rounded="brutal" className="p-8 text-center space-y-4">
          <Award className="w-12 h-12 text-[#09090B] mx-auto" />
          <Badge variant="dark" size="lg">
            SUBMISSION VERIFIED
          </Badge>
          <h2 className="font-heading text-3xl uppercase text-[#09090B]">
            FINAL SCORE: {submittedResult.score}%
          </h2>
          <p className="font-body text-sm text-[#09090B] max-w-md mx-auto">
            Your results have been registered in the database. This directly contributes to your
            post-course pathway recommendation.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link to="/dashboard">
              <Button variant="primary" size="md">
                Return to Dashboard
              </Button>
            </Link>
            <Link to="/engagement">
              <Button variant="secondary" size="md">
                View Recommendations
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Question Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, qIdx) => (
          <Card
            key={qIdx}
            variant="default"
            shadow="normal"
            rounded="brutal"
            className="p-6 md:p-8 space-y-4"
          >
            <div className="flex items-start space-x-3">
              <span className="w-7 h-7 rounded bg-[#09090B] text-[#D2E823] font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {qIdx + 1}
              </span>
              <h3 className="font-heading text-base text-[#09090B] leading-relaxed">
                {q.question}
              </h3>
            </div>

            <div className="space-y-2.5 pt-2">
              {q.options?.map((option, oIdx) => {
                const isSelected = answers[qIdx] === option;
                return (
                  <button
                    key={oIdx}
                    type="button"
                    disabled={!!submittedResult}
                    onClick={() => handleSelectOption(qIdx, option)}
                    className={`w-full text-left p-3.5 rounded-[8px] border-2 font-body text-xs sm:text-sm transition-all duration-100 flex items-center justify-between ${
                      isSelected
                        ? "bg-[#D2E823] border-[#09090B] font-bold shadow-[2px_2px_0_#09090B]"
                        : "bg-[#F8F4E8] border-[#09090B] hover:bg-[#FFFFFF]"
                    }`}
                  >
                    <span>{option}</span>
                    <span
                      className={`w-4 h-4 rounded-full border-2 border-[#09090B] flex items-center justify-center flex-shrink-0 ml-2 ${
                        isSelected ? "bg-[#09090B]" : "bg-transparent"
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#D2E823]" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        ))}

        {!submittedResult && (
          <div className="pt-4">
            <Button
              type="submit"
              variant="acid"
              size="lg"
              fullWidth
              disabled={submitting}
              icon={Send}
            >
              {submitting ? "Submitting Assessment..." : "Submit Assessment"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AssessmentView;
