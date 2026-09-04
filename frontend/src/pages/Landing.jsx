import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Marquee from "../components/Marquee";
import {
  Droplets,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  Compass,
  HeartHandshake,
  BookOpen,
  Sparkles,
  Layers,
} from "lucide-react";

export const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section: 12-Column Neo-Brutalist Concept */}
      <section className="pt-10 md:pt-16 lg:pt-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 7 Cols */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2">
              <Badge variant="acid" size="lg">
                INREM FOUNDATION • WQC PORTAL
              </Badge>
              <Badge variant="dark" size="lg">
                9 SESSIONS
              </Badge>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight text-[#09090B] leading-[1.15] glitch-hover cursor-default">
              <span className="block mb-2 sm:mb-3">WATER QUALITY</span>
              <span className="inline-block bg-[#D2E823] px-3.5 py-1 border-2 border-[#09090B] shadow-[6px_6px_0_#09090B] rounded-[8px]">
                CHAMPIONS
              </span>
            </h1>

            <p className="font-body text-base sm:text-lg text-[#27272A] leading-relaxed max-w-2xl">
              Centralizing the grassroots water testing and public health journey.
              Replacing fragmented tools like Zoom, Google Forms, and WhatsApp with an integrated
              learning, attestation, and post-course engagement platform.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="acid" size="lg" icon={ArrowRight}>
                    Go to Your Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button variant="acid" size="lg" icon={ArrowRight}>
                      Enroll as Champion
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="secondary" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Verification Stickers */}
            <div className="pt-4 flex flex-wrap gap-3 items-center text-xs font-mono text-[#09090B]">
              <span className="flex items-center bg-[#FFFFFF] border-2 border-[#09090B] px-3 py-1.5 rounded-[8px] shadow-[2px_2px_0_#09090B]">
                <CheckCircle2 className="w-4 h-4 text-[#09090B] mr-1.5" />
                Pre & Post Assessments
              </span>
              <span className="flex items-center bg-[#FFFFFF] border-2 border-[#09090B] px-3 py-1.5 rounded-[8px] shadow-[2px_2px_0_#09090B]">
                <CheckCircle2 className="w-4 h-4 text-[#09090B] mr-1.5" />
                Digital Attestations
              </span>
              <span className="flex items-center bg-[#FFFFFF] border-2 border-[#09090B] px-3 py-1.5 rounded-[8px] shadow-[2px_2px_0_#09090B]">
                <CheckCircle2 className="w-4 h-4 text-[#09090B] mr-1.5" />
                ML Pathway Recommendation
              </span>
            </div>
          </div>

          {/* Right Column: 5 Cols Bento Visual & Floating Card */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Main Bento Card */}
            <Card
              variant="default"
              shadow="xl"
              rounded="brutal-lg"
              className="p-6 md:p-8 relative z-10"
            >
              <div className="flex items-center justify-between border-b-2 border-[#09090B] pb-4 mb-5">
                <div className="flex items-center space-x-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FF4B4B] border border-[#09090B]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FF8A00] border border-[#09090B]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#D2E823] border border-[#09090B]" />
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  WQC JOURNEY FLOW
                </span>
              </div>

              <div className="space-y-3">
                <div className="border-2 border-[#09090B] bg-[#F8F4E8] p-3 rounded-[8px] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded bg-[#09090B] text-[#D2E823] font-mono text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <span className="font-bold text-xs uppercase">Enrollment & Profile</span>
                  </div>
                  <Badge variant="completed" size="sm">Active</Badge>
                </div>

                <div className="border-2 border-[#09090B] bg-[#F8F4E8] p-3 rounded-[8px] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded bg-[#09090B] text-[#D2E823] font-mono text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <span className="font-bold text-xs uppercase">Pre-Course Assessment</span>
                  </div>
                  <Badge variant="in_progress" size="sm">Baseline</Badge>
                </div>

                <div className="border-2 border-[#09090B] bg-[#D2E823] p-3 rounded-[8px] shadow-[2px_2px_0_#09090B] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded bg-[#09090B] text-[#D2E823] font-mono text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <span className="font-bold text-xs uppercase">9 Interactive Sessions</span>
                  </div>
                  <Badge variant="dark" size="sm">Attested</Badge>
                </div>

                <div className="border-2 border-[#09090B] bg-[#F8F4E8] p-3 rounded-[8px] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded bg-[#09090B] text-[#D2E823] font-mono text-xs font-bold flex items-center justify-center">
                      4
                    </span>
                    <span className="font-bold text-xs uppercase">Post-Assessment & Result</span>
                  </div>
                  <Badge variant="upcoming" size="sm">Final</Badge>
                </div>

                <div className="border-2 border-[#09090B] bg-[#00D2FF] p-3 rounded-[8px] shadow-[2px_2px_0_#09090B] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded bg-[#09090B] text-[#FFFFFF] font-mono text-xs font-bold flex items-center justify-center">
                      5
                    </span>
                    <span className="font-bold text-xs uppercase">ML Pathway Selection</span>
                  </div>
                  <Badge variant="dark" size="sm">Guided</Badge>
                </div>
              </div>
            </Card>

            {/* Floating Accent Card (Y-axis float animation) */}
            <div className="absolute -bottom-6 -left-4 sm:-left-8 z-20 animate-float hidden sm:block">
              <Card
                variant="acid"
                shadow="large"
                rounded="brutal"
                className="p-4 max-w-[260px] transform -rotate-2"
              >
                <div className="flex items-center space-x-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-[#09090B]" />
                  <span className="font-heading text-xs uppercase">
                    ML RECOMMENDATION
                  </span>
                </div>
                <p className="font-body text-xs font-medium text-[#09090B]">
                  Tailored to each champion based on session progress and engagement.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <Marquee text="WATER QUALITY CHAMPIONS • INREM FOUNDATION • COMMUNITY WATER SAFETY • 9 SESSIONS • FIELD TEST KITS • BIS 10500 STANDARDS • FLUORIDE & ARSENIC REMEDIATION • JAL JEEVAN MISSION •" />

      {/* Purpose Section: About INREM & The Platform */}
      <section id="about" className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="border-2 border-[#09090B] bg-[#FFFFFF] rounded-[24px] p-8 md:p-12 shadow-[6px_6px_0_#09090B]">
          <div className="max-w-3xl mb-10">
            <Badge variant="acid" size="md" className="mb-3">
              THE MISSION
            </Badge>
            <h2 className="font-heading text-2xl sm:text-4xl uppercase text-[#09090B] mb-4">
              COMMUNITY-DRIVEN SAFE WATER TRANSFORMATION
            </h2>
            <p className="font-body text-base text-[#52525B] leading-relaxed">
              INREM Foundation works across vulnerable water quality districts in India,
              focusing on fluoride, arsenic, and microbial contamination. The Water Quality Champion
              (WQC) platform turns field volunteers, frontline health workers, and panchayat leaders
              into certified experts who can detect contamination, organize community mitigation,
              and connect with government infrastructure.
            </p>
          </div>

          {/* 3 Pillars Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="canvas" shadow="normal" rounded="brutal" className="p-6">
              <div className="w-12 h-12 bg-[#D2E823] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0_#09090B] flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-[#09090B]" />
              </div>
              <h3 className="font-heading text-lg uppercase text-[#09090B] mb-2">
                Structured 9-Session WQM
              </h3>
              <p className="font-body text-xs text-[#52525B] leading-relaxed">
                Covers public health basics, chemical & bacteriological testing, safe water solutions,
                and Jal Jeevan Mission convergence.
              </p>
            </Card>

            <Card variant="canvas" shadow="normal" rounded="brutal" className="p-6">
              <div className="w-12 h-12 bg-[#00D2FF] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0_#09090B] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-[#09090B]" />
              </div>
              <h3 className="font-heading text-lg uppercase text-[#09090B] mb-2">
                Digital Attestations
              </h3>
              <p className="font-body text-xs text-[#52525B] leading-relaxed">
                Verifiable session-start and session-end attestations ensure authentic attendance,
                participation, and curriculum comprehension.
              </p>
            </Card>

            <Card variant="canvas" shadow="normal" rounded="brutal" className="p-6">
              <div className="w-12 h-12 bg-[#FF8A00] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0_#09090B] flex items-center justify-center mb-4">
                <Compass className="w-6 h-6 text-[#09090B]" />
              </div>
              <h3 className="font-heading text-lg uppercase text-[#09090B] mb-2">
                Post-Course Pathways
              </h3>
              <p className="font-body text-xs text-[#52525B] leading-relaxed">
                Graduation is not the end. Champions branch into Saathi peer networks, Guided Mentoring,
                or become certified regional trainers.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* The 3 Pathways Showcase */}
      <section id="pathways" className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="dark" size="md" className="mb-3">
            POST-COURSE JOURNEY
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl uppercase text-[#09090B] mb-3">
            THREE SPECIALIZED PATHWAYS
          </h2>
          <p className="font-body text-sm text-[#52525B]">
            After completing the 9 sessions and assessments, the ML service analyzes your progress
            to recommend the optimal continued engagement pathway.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Saathi */}
          <Card
            variant="default"
            shadow="large"
            rounded="brutal-lg"
            hoverEffect
            className="p-8 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-[#D2E823] border-2 border-[#09090B] rounded-[12px] shadow-[3px_3px_0_#09090B] flex items-center justify-center mb-5">
                <HeartHandshake className="w-7 h-7 text-[#09090B]" />
              </div>
              <Badge variant="acid" size="sm" className="mb-3">
                PEER & ALUMNI
              </Badge>
              <h3 className="font-heading text-xl uppercase text-[#09090B] mb-3">
                SAATHI PATHWAY
              </h3>
              <p className="font-body text-xs text-[#52525B] leading-relaxed mb-6">
                Stay connected with fellow Water Quality Champions across districts. Share ground
                experiences, solve testing hurdles collectively, and participate in peer-learning circles.
              </p>
            </div>
            <div className="pt-4 border-t-2 border-[#09090B]/10 font-mono text-[11px] text-[#09090B] font-bold">
              • Experience sharing & community forums
            </div>
          </Card>

          {/* Guided Mentoring */}
          <Card
            variant="default"
            shadow="large"
            rounded="brutal-lg"
            hoverEffect
            className="p-8 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-[#00D2FF] border-2 border-[#09090B] rounded-[12px] shadow-[3px_3px_0_#09090B] flex items-center justify-center mb-5">
                <Compass className="w-7 h-7 text-[#09090B]" />
              </div>
              <Badge variant="cyan" size="sm" className="mb-3">
                ACTION-ORIENTED
              </Badge>
              <h3 className="font-heading text-xl uppercase text-[#09090B] mb-3">
                GUIDED MENTORING
              </h3>
              <p className="font-body text-xs text-[#52525B] leading-relaxed mb-6">
                Tackle real-world water contamination case studies with expert mentors. Engage in deep
                problem-solving, join support groups, and publish community mitigation reports.
              </p>
            </div>
            <div className="pt-4 border-t-2 border-[#09090B]/10 font-mono text-[11px] text-[#09090B] font-bold">
              • Real case studies & support groups
            </div>
          </Card>

          {/* Trainer */}
          <Card
            variant="default"
            shadow="large"
            rounded="brutal-lg"
            hoverEffect
            className="p-8 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-[#FF8A00] border-2 border-[#09090B] rounded-[12px] shadow-[3px_3px_0_#09090B] flex items-center justify-center mb-5">
                <ShieldCheck className="w-7 h-7 text-[#09090B]" />
              </div>
              <Badge variant="amber" size="sm" className="mb-3">
                LEADERSHIP
              </Badge>
              <h3 className="font-heading text-xl uppercase text-[#09090B] mb-3">
                TRAINER PATHWAY
              </h3>
              <p className="font-body text-xs text-[#52525B] leading-relaxed mb-6">
                Return as a certified INREM trainer. Train new cohorts of grassroots champions,
                facilitate workshop sessions, and lead regional water surveillance initiatives.
              </p>
            </div>
            <div className="pt-4 border-t-2 border-[#09090B]/10 font-mono text-[11px] text-[#09090B] font-bold">
              • Train new cohorts & lead workshops
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="border-2 border-[#09090B] bg-[#D2E823] rounded-[24px] p-8 md:p-14 shadow-[8px_8px_0_#09090B] text-center">
          <h2 className="font-heading text-3xl sm:text-5xl uppercase text-[#09090B] mb-4">
            START YOUR WQC JOURNEY TODAY
          </h2>
          <p className="font-body text-base text-[#09090B] max-w-xl mx-auto mb-8 font-medium">
            Join hundreds of champions making drinking water safe for rural and semi-urban communities.
            Enroll in the 9-session curriculum now.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/courses">
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  Explore Courses
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button variant="primary" size="lg" icon={ArrowRight}>
                    Sign Up as a WQC
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">
                    Member Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

