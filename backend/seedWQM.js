const mongoose = require("mongoose");
require("dotenv").config();

const Course = require("./models/Course");
const Session = require("./models/Session");
const Resource = require("./models/Resource");
const Assessment = require("./models/Assessment");
const CaseStudy = require("./models/CaseStudy");
const SupportGroup = require("./models/SupportGroup");
const User = require("./models/User");

const mongoUri = (process.env.MONGO_URI || "").trim().replace(/;+$/, "");

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB!");

    // Check if course already exists
    let course = await Course.findOne({ title: "Water Quality Management (WQM) Certificate Course" });
    if (!course) {
      course = await Course.create({
        title: "Water Quality Management (WQM) Certificate Course",
        description: "Official 9-session curriculum by INREM Foundation empowering Water Quality Champions (WQCs) with knowledge, testing skills, safe water interventions, and community leadership.",
        totalSessions: 9,
        status: "active",
      });
      console.log("Created Course:", course._id);
    } else {
      console.log("Course already exists:", course._id);
    }

    const sessionTitles = [
      {
        num: 1,
        title: "Introduction to Water Quality & Public Health",
        desc: "Understanding contamination pathways, biological vs chemical contaminants, and the burden of waterborne diseases.",
      },
      {
        num: 2,
        title: "Water Contaminants: Fluoride, Arsenic, Salinity & Nitrates",
        desc: "Deep dive into geogenic contamination in India, safe limits, health symptoms (fluorosis, keratosis), and spatial mapping.",
      },
      {
        num: 3,
        title: "Water Testing Methodologies & Field Test Kits (FTKs)",
        desc: "Hands-on field procedures for chemical testing, bacteriological H2S vials, digital photometers, and quality assurance.",
      },
      {
        num: 4,
        title: "Interpreting Water Quality Data & Standards (BIS 10500)",
        desc: "Understanding permissible and acceptable limits, converting test outputs into actionable hazard ratings.",
      },
      {
        num: 5,
        title: "Safe Water Solutions & Household Water Treatment (HWTS)",
        desc: "Filtration, biosand filters, chlorination, RO remediation, and decentralized community purification units.",
      },
      {
        num: 6,
        title: "Community Mobilization, Communication & Behavior Change",
        desc: "Participatory appraisal, community water safety plans (WSPs), school water clubs, and overcoming taboo and inertia.",
      },
      {
        num: 7,
        title: "Government Schemes & Jal Jeevan Mission (JJM) Convergence",
        desc: "Navigating village water & sanitation committees (VWSC), PRIs, testing labs under JJM, and securing government funds.",
      },
      {
        num: 8,
        title: "Digital Surveillance & Field Reporting",
        desc: "Logging test records, using mobile surveillance apps, GPS geotagging water sources, and trigger alerts for contamination.",
      },
      {
        num: 9,
        title: "Action Plan Formulation, Champions Network & Post-Course Pathways",
        desc: "Developing a local village action plan, graduation into Saathi peer networks, Guided Mentoring, or Trainer pathways.",
      },
    ];

    for (const s of sessionTitles) {
      let session = await Session.findOne({ courseId: course._id, sessionNumber: s.num });
      if (!session) {
        session = await Session.create({
          courseId: course._id,
          sessionNumber: s.num,
          title: s.title,
          description: s.desc,
          status: s.num === 1 ? "active" : "upcoming",
        });
        console.log(`Created Session ${s.num}: ${session.title}`);
      }

      // Create a resource for each session if not present
      const resExists = await Resource.findOne({ sessionId: session._id });
      if (!resExists) {
        await Resource.create({
          sessionId: session._id,
          title: `${s.title} - Guidebook & Field Protocols`,
          description: `Comprehensive reading notes, standard protocols, and field checklists for Session ${s.num}.`,
          resourceUrl: "https://www.inrem.in/resources/wqm-handbook.pdf",
          resourceType: "PDF Guide",
        });
      }
    }

    // Pre-assessment
    let preAssessment = await Assessment.findOne({ courseId: course._id, type: "pre" });
    if (!preAssessment) {
      await Assessment.create({
        courseId: course._id,
        type: "pre",
        title: "WQM Baseline Pre-Course Assessment",
        questions: [
          {
            question: "What is the permissible limit of fluoride in drinking water in India as per BIS 10500:2012?",
            options: ["0.5 mg/L", "1.0 mg/L (extended to 1.5 mg/L)", "3.0 mg/L", "5.0 mg/L"],
            correctAnswer: "1.0 mg/L (extended to 1.5 mg/L)",
          },
          {
            question: "Which field test is most widely used for rapid detection of coliform bacteria in rural areas?",
            options: ["H2S Strip / Vial Test", "Litmus test", "Turbidity tube", "Salinity refractometer"],
            correctAnswer: "H2S Strip / Vial Test",
          },
          {
            question: "Excessive nitrate in infant drinking water causes which health condition?",
            options: ["Dental Fluorosis", "Methemoglobinemia (Blue Baby Syndrome)", "Arsenicosis", "Goitre"],
            correctAnswer: "Methemoglobinemia (Blue Baby Syndrome)",
          },
          {
            question: "What is the primary objective of a Village Water and Sanitation Committee (VWSC)?",
            options: [
              "Tax collection for commercial entities",
              "Ensuring village-level drinking water safety, testing, and operations",
              "Supplying packaged bottled water",
              "Drilling private borewells",
            ],
            correctAnswer: "Ensuring village-level drinking water safety, testing, and operations",
          },
        ],
      });
      console.log("Created Pre-Course Assessment");
    }

    // Post-assessment
    let postAssessment = await Assessment.findOne({ courseId: course._id, type: "post" });
    if (!postAssessment) {
      await Assessment.create({
        courseId: course._id,
        type: "post",
        title: "WQM Comprehensive Post-Course Assessment",
        questions: [
          {
            question: "What is the permissible limit of fluoride in drinking water in India as per BIS 10500:2012?",
            options: ["0.5 mg/L", "1.0 mg/L (extended to 1.5 mg/L)", "3.0 mg/L", "5.0 mg/L"],
            correctAnswer: "1.0 mg/L (extended to 1.5 mg/L)",
          },
          {
            question: "Which technology is effective for removing geogenic fluoride from domestic drinking water?",
            options: ["Activated Alumina / Nalgonda Technique", "Simple cloth filtration", "Boiling", "Sedimentation"],
            correctAnswer: "Activated Alumina / Nalgonda Technique",
          },
          {
            question: "In the WQC Journey, what is the role of an End-of-Session Attestation?",
            options: [
              "Verifying attendance and comprehension before proceeding",
              "Paying a course fee",
              "Ordering commercial testing gear",
              "Applying for government employment",
            ],
            correctAnswer: "Verifying attendance and comprehension before proceeding",
          },
          {
            question: "Which pathway is designed for WQCs who wish to train future cohorts and lead regional programs?",
            options: ["Saathi Pathway", "Guided Mentoring", "Trainer Pathway", "General Public"],
            correctAnswer: "Trainer Pathway",
          },
        ],
      });
      console.log("Created Post-Course Assessment");
    }

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();

