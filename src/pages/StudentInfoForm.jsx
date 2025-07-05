import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProgressBar from "../components/ProgressBar";

export default function StudentSkillsForm() {
  const navigate = useNavigate();

  // single student + grade
  const [studentName, setStudentName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");

  // the ten groups exactly as in your scans
  const sections = [
    {
      title: "Cognitive–Perceptual",
      skills: ["Attention", "Observation", "Comprehension", "Imitation", "Memory"],
    },
    {
      title: "Body Awareness & Visual Tracking",
      skills: [
        "Body Awareness",
        "Body Image",
        "Posture",
        "Balance",
        "Muscle Control",
        "Muscle Co‑ordination",
        "Movement Observation",
        "Visual Tracking",
      ],
    },
    {
      title: "Gross Motor & Manipulation",
      skills: [
        "Imitation",
        "Locomotor & Non‑Locomotor",
        "Dimensions/Planes",
        "Qualities of Movement",
        "Directionality/Laterality",
        "Spatial Awareness",
        "Body Language",
      ],
    },
    {
      title: "Manipulation & Tool Use",
      skills: ["Grasp", "Release", "Manipulation & Tool Use", "Bilateral Skills"],
    },
    {
      title: "Listening & Sound Matching",
      skills: ["Listening", "Sound Differentiation", "Matching Sound"],
    },
    {
      title: "Speech Sound Skills",
      skills: [
        "Sound Identification",
        "Sound Imitation",
        "Sound/Word Sequencing",
        "Vocabulary",
        "Comprehension & Expression",
      ],
    },
    {
      title: "Sentence & Voice Qualities",
      skills: ["Sentence & Voice Qualities", "Modulation", "Volume", "Pitch", "Speed"],
    },
    {
      title: "Speech Clarity",
      skills: ["Tone", "Stress", "Clarity", "Pause", "Punctuation", "Articulation", "Diction"],
    },
    {
      title: "Social & Problem‑Solving",
      skills: [
        "Emotions",
        "Relationships",
        "Role Play",
        "Understanding of Role Required + Execution",
        "Environmental Understanding",
        "Problem Solving",
        "Geographical Distinctions",
        "Creativity",
      ],
    },
    {
      title: "Visual Discrimination & Memory",
      skills: [
        "Visual Discriminations",
        "Shapes",
        "Alphabets",
        "Words",
        "Sentences",
        "Scripts",
        "Visual Motor Skills",
        "Visual Sequential Memory",
      ],
    },
  ];

  // one remark‐box per skill
  const initialRemarks = {};
  sections.forEach((sec, si) =>
    sec.skills.forEach((_, ki) => {
      initialRemarks[`s${si}k${ki}`] = "";
    })
  );
  const [remarks, setRemarks] = useState(initialRemarks);

  // Calculate progress based on form completion
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate total fields and completed fields
    const totalSkills = Object.keys(initialRemarks).length;
    const completedSkills = Object.values(remarks).filter(remark => remark.trim() !== "").length;
    const hasStudentName = studentName.trim() !== "";
    const hasGradeLevel = gradeLevel.trim() !== "";
    
    // Total fields = 2 (name + grade) + all skills
    const totalFields = 2 + totalSkills;
    const completedFields = (hasStudentName ? 1 : 0) + (hasGradeLevel ? 1 : 0) + completedSkills;
    
    const newProgress = (completedFields / totalFields) * 100;
    setProgress(newProgress);
  }, [studentName, gradeLevel, remarks, initialRemarks]);

  const onRemarkChange = (key) => (e) => {
    setRemarks((r) => ({ ...r, [key]: e.target.value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    // TODO: push studentName + gradeLevel + remarks into your IEPContext
    navigate("/new-student/data-setup");
  };

  // Utility functions for styling
  const getSectionGradient = (i) => [
    "from-purple-500 to-purple-600",
    "from-purple-400 to-purple-500",
    "from-pink-400 to-pink-500",
    "from-orange-400 to-orange-500",
    "from-yellow-400 to-yellow-500",
    "from-yellow-500 to-yellow-600",
    "from-orange-500 to-pink-500",
    "from-pink-500 to-purple-500",
    "from-purple-500 to-purple-600",
    "from-yellow-500 to-orange-500",
  ][i % 10];

  const getSectionBorder = (i) => [
    "border-purple-200",
    "border-purple-200",
    "border-pink-200",
    "border-orange-200",
    "border-yellow-200",
    "border-yellow-200",
    "border-orange-200",
    "border-pink-200",
    "border-purple-200",
    "border-yellow-200",
  ][i % 10];

  const getSectionShadow = (i) => [
    "shadow-purple-500/10",
    "shadow-purple-400/10",
    "shadow-pink-400/10",
    "shadow-orange-400/10",
    "shadow-yellow-400/10",
    "shadow-yellow-500/10",
    "shadow-orange-500/10",
    "shadow-pink-500/10",
    "shadow-purple-500/10",
    "shadow-yellow-500/10",
  ][i % 10];

  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-slate-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        {/* Progress */}
        <div className="mt-4 mb-4 max-w-3xl mx-auto px-4">
          <ProgressBar progress={progress} showDetails={true} />
        </div>

        <div className="pt-8 p-8 overflow-auto">
          <form
            onSubmit={handleNext}
            className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 space-y-10 border border-white/20"
          >
            {/* Student Name + Grade Level on one row */}
            <div className="flex space-x-6">
              {/* Student Name */}
              <div className="flex-1 space-y-1">
                <label className="block text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Student Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                  className="w-full border-2 border-purple-200 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-purple-200/50 focus:border-purple-400 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  placeholder="e.g. Johnathan Doe"
                />
              </div>
              {/* Grade Level */}
              <div className="w-1/3 space-y-1">
                <label className="block text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Grade Level
                </label>
                <input
                  list="gradeLevels"
                  type="text"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  required
                  className="w-full border-2 border-purple-200 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-purple-200/50 focus:border-purple-400 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  placeholder="Select grade (1–12)"
                />
                <datalist id="gradeLevels">
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Skills Header */}
            <div className="text-center">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Skills Assessment
              </h2>
              <div className="mt-2 w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto" />
            </div>

            {/* Skill Sections */}
            {sections.map((section, si) => (
              <div key={si} className="space-y-4">
                <h3
                  className={`text-2xl font-bold text-white px-6 py-3 rounded-2xl bg-gradient-to-r ${getSectionGradient(
                    si
                  )} shadow-lg ${getSectionShadow(si)}`}
                >
                  {section.title}
                </h3>
                <div
                  className={`rounded-2xl border-2 ${getSectionBorder(
                    si
                  )} shadow-lg bg-white/50 backdrop-blur-sm overflow-hidden`}
                >
                  <table className="w-full">
                    <tbody>
                      {section.skills.map((skill, ki) => (
                        <tr
                          key={ki}
                          className="border-b border-gray-200/50 hover:bg-gradient-to-r hover:from-white/80 hover:to-gray-50/80 transition-all duration-200"
                        >
                          <td className="p-4 w-1/3 text-gray-700 font-medium">{skill}</td>
                          <td className="p-4">
                            <input
                              type="text"
                              value={remarks[`s${si}k${ki}`]}
                              onChange={onRemarkChange(`s${si}k${ki}`)}
                              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-3 focus:ring-purple-200/50 focus:border-purple-400 bg-white/70 backdrop-blur-sm hover:shadow-md transition-all duration-300"
                              placeholder="Enter your observation..."
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* Next Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold rounded-full hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform active:scale-95"
              >
                Next Step →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}