const axios = require("axios");

const BASE_URL = "http://localhost:3000";

async function runE2E() {
  console.log("=========================================");
  console.log("STARTING FULL-STACK E2E VERIFICATION TEST");
  console.log("=========================================");

  let cookie = "";
  let userId = "";
  let courseId = "";
  let sessionId = "";
  let assessmentId = "";
  let caseStudyId = "";

  const client = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  // 1. Signup WQC
  const testEmail = `champion_${Date.now()}@inrem.org`;
  console.log(`1. Testing Signup (POST /api/auth/signup) with: ${testEmail}`);
  const signupRes = await client.post("/api/auth/signup", {
    name: "Aarav Patel",
    email: testEmail,
    password: "securePassword123",
    phone: "+91 98765 00001",
    organization: "Gram Vikas Sansthan",
    designation: "Water Safety Lead",
    location: "Dhar, MP",
  });

  if (signupRes.status === 201 && signupRes.data.user) {
    userId = signupRes.data.user.id || signupRes.data.user._id;
    const setCookie = signupRes.headers["set-cookie"];
    if (setCookie) {
      cookie = setCookie[0].split(";")[0];
      client.defaults.headers.common["Cookie"] = cookie;
    }
    console.log("✓ Signup Successful! User ID:", userId);
    console.log("✓ User Fields:", {
      name: signupRes.data.user.name,
      email: signupRes.data.user.email,
      phone: signupRes.data.user.phone,
      organization: signupRes.data.user.organization,
      designation: signupRes.data.user.designation,
      location: signupRes.data.user.location,
    });
  } else {
    throw new Error("Signup failed");
  }

  // 2. Profile check
  console.log("\n2. Testing Profile (GET /api/auth/profile) with Cookie");
  const profileRes = await client.get("/api/auth/profile");
  console.log("✓ Authenticated Profile:", profileRes.data.user.name, "|", profileRes.data.user.organization);

  // 3. Courses check
  console.log("\n3. Testing Courses (GET /api/courses)");
  const coursesRes = await client.get("/api/courses");
  console.log(`✓ Fetched ${coursesRes.data.count} course(s)`);
  if (coursesRes.data.courses.length > 0) {
    courseId = coursesRes.data.courses[0]._id;
    console.log("✓ Using Course:", coursesRes.data.courses[0].title, `(${courseId})`);
  } else {
    throw new Error("No courses found in database");
  }

  // 4. Enroll in Course
  console.log("\n4. Testing Enrollment (POST /api/enrollments)");
  const enrollRes = await client.post("/api/enrollments", {
    userId,
    courseId,
  });
  console.log("✓ Enrollment Successful:", enrollRes.data.message);

  // 5. Sessions check
  console.log(`\n5. Testing Sessions (GET /api/sessions/course/${courseId})`);
  const sessionsRes = await client.get(`/api/sessions/course/${courseId}`);
  console.log(`✓ Fetched ${sessionsRes.data.count} session(s)`);
  sessionId = sessionsRes.data.sessions[0]._id;
  console.log(`✓ Session 1: "${sessionsRes.data.sessions[0].title}" (${sessionId})`);

  // 6. Attestation Start & Session Start
  console.log("\n6. Testing Attestation Start & Session Start");
  const attStartRes = await client.post("/api/attestations/start", {
    userId,
    sessionId,
  });
  console.log("✓ Attestation Start:", attStartRes.data.message);

  const sessStartRes = await client.post("/api/sessions/start", {
    userId,
    courseId,
    sessionId,
  });
  console.log("✓ Session Start:", sessStartRes.data.message);

  // 7. Resource Access & Attestation Content
  console.log("\n7. Testing Resource Fetch & Content Access Attestation");
  const resRes = await client.get(`/api/resources/session/${sessionId}`);
  console.log(`✓ Fetched ${resRes.data.count} resource(s) for session`);

  const attContentRes = await client.post("/api/attestations/content", {
    userId,
    sessionId,
  });
  console.log("✓ Content Access Recorded:", attContentRes.data.message);

  // 8. Attestation End & Session Complete
  console.log("\n8. Testing Session Complete & Attestation End");
  const sessEndRes = await client.post("/api/sessions/complete", {
    userId,
    sessionId,
  });
  console.log("✓ Session Completed:", sessEndRes.data.message);

  const attEndRes = await client.post("/api/attestations/end", {
    userId,
    sessionId,
  });
  console.log("✓ Attestation End:", attEndRes.data.message);

  // 9. Progress Check
  console.log("\n9. Testing User Progress (GET /api/progress/user/:userId)");
  const progRes = await client.get(`/api/progress/user/${userId}`);
  console.log("✓ Progress Summary:", {
    completedSessions: progRes.data.completedSessions,
    totalSessions: progRes.data.totalSessions,
    progressPercentage: `${progRes.data.progressPercentage}%`,
  });

  // 10. Assessment Fetch & Submission
  console.log(`\n10. Testing Assessments (GET /api/assessments/course/${courseId})`);
  const assessRes = await client.get(`/api/assessments/course/${courseId}`);
  console.log(`✓ Fetched ${assessRes.data.count} assessment(s)`);
  if (assessRes.data.assessments.length > 0) {
    assessmentId = assessRes.data.assessments[0]._id;
    console.log("✓ Submitting Assessment Result (POST /api/assessments/submit)");
    const subRes = await client.post("/api/assessments/submit", {
      userId,
      assessmentId,
      score: 90,
    });
    console.log("✓ Assessment Submitted! Recorded Score:", subRes.data.result.score);
  }

  // 11. Engagement Registration
  console.log("\n11. Testing Engagement (POST /api/engagements)");
  const engageRes = await client.post("/api/engagements", {
    userId,
    pathway: "guided_mentoring",
    status: "active",
  });
  console.log("✓ Registered for Pathway:", engageRes.data.engagement.pathway);

  // 12. ML Recommendation Pipeline Check
  console.log("\n12. Testing ML Journey Recommendation (GET /api/engagements/user/:userId/recommendation)");
  const recRes = await client.get(`/api/engagements/user/${userId}/recommendation`);
  console.log("✓ ML RECOMMENDATION RETURNED BY PIPELINE:");
  console.log("  Success:", recRes.data.success);
  console.log("  Features Extracted by ML:", recRes.data.data.features);
  console.log("  Predicted Pathway:", recRes.data.data.recommendation.pathway);
  console.log("  Reasoning:", recRes.data.data.recommendation.reason);

  // 13. Case Study & Comments Check
  console.log("\n13. Testing Case Study Creation (POST /api/case-studies)");
  const csRes = await client.post("/api/case-studies", {
    userId,
    title: "Groundwater Fluoride Mitigation in Dhar District",
    description: "Field implementation of activated alumina filtration units across 4 anganwadis in Dhar.",
    tags: ["Fluoride", "Alumina Filter", "Dhar", "Anganwadi"],
    status: "published",
  });
  caseStudyId = csRes.data.caseStudy._id;
  console.log("✓ Case Study Created:", csRes.data.caseStudy.title, `(${caseStudyId})`);

  console.log("✓ Adding Comment (POST /api/case-studies/comments)");
  const commentRes = await client.post("/api/case-studies/comments", {
    caseStudyId,
    userId,
    content: "The water testing showed fluoride reduction from 4.2 mg/L down to 0.8 mg/L after regeneration.",
  });
  console.log("✓ Comment Added:", commentRes.data.comment.content);

  const commentsListRes = await client.get(`/api/case-studies/${caseStudyId}/comments`);
  console.log(`✓ Fetched ${commentsListRes.data.count} comment(s)`);

  // 14. Support Groups Check
  console.log("\n14. Testing Support Groups (POST /api/case-studies/support-groups)");
  const sgRes = await client.post("/api/case-studies/support-groups", {
    name: "Madhya Pradesh Fluoride Taskforce",
    description: "District level support group for active field champions.",
    caseStudyId,
  });
  const supportGroupId = sgRes.data.supportGroup._id;
  console.log("✓ Support Group Created:", sgRes.data.supportGroup.name);

  console.log("✓ Joining Support Group (POST /api/case-studies/support-groups/:id/join)");
  const joinRes = await client.post(`/api/case-studies/support-groups/${supportGroupId}/join`, {
    userId,
  });
  console.log("✓ Joined Group! Member Count:", joinRes.data.supportGroup.members.length);

  console.log("\n=========================================");
  console.log("ALL 14 INTEGRATION MILESTONES PASSED 100%!");
  console.log("=========================================");
}

runE2E()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ E2E Verification Failed:", err.response?.data || err.message);
    process.exit(1);
  });

