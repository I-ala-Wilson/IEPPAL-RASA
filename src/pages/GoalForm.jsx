// src/pages/GoalForm.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProgressBar from "../components/ProgressBar";
import { IEPContext } from "../context/IEPContext";

export default function GoalForm() {
  const navigate = useNavigate();
  const { iepData, addGoal, finalizeReport } = useContext(IEPContext);
  const { goals, studentInfo } = iepData;

  // ordinal helper
  const ordinal = (n) => {
    if (n === 1) return "first";
    if (n === 2) return "second";
    if (n === 3) return "third";
    return `${n}th`;
  };

  const headerText = studentInfo.studentName
    ? `${studentInfo.studentName}'s ${ordinal(goals.length + 1)} Goal`
    : `Create ${ordinal(goals.length + 1)} Goal`;

  // form state
  const [goalOverview, setGoalOverview] = useState("");
  const [alignedStandard, setAlignedStandard] = useState([]);
  const [recommendedStrategies, setRecommendedStrategies] = useState([]);
  const [goalMeasurement, setGoalMeasurement] = useState("");

  // reset on mount
  useEffect(() => {
    setGoalOverview("");
    setAlignedStandard([]);
    setRecommendedStrategies([]);
    setGoalMeasurement("");
  }, []);

  const standards = [
    "Class A Standard 1",
    "Class A Standard 2",
    "Class A Standard 3",
    "Class B Standard 1",
    "Class B Standard 2",
    "Class B Standard 3"
  ];
  const strategies = [
    "Multi-sensory Instruction",
    "Small Group Instruction",
    "Visual Learning Aids",
    "One-on-One Tutoring",
    "Peer Assisted Learning",
    "Interactive Whiteboard",
    "Digital Tools",
    "Behavioral Intervention",
    "Routine and Structure",
    "Regular Feedback"
  ];

  // progress = 80% + (completedFields/4)*20%
  let completed = 0;
  if (goalOverview.trim()) completed++;
  if (alignedStandard.length) completed++;
  if (recommendedStrategies.length) completed++;
  if (goalMeasurement) completed++;
  const overallProgress = Math.round(80 + (completed / 4) * 20);

  // checkbox handler
  const handleStrategyChange = (e) => {
    const val = e.target.value;
    setRecommendedStrategies(prev =>
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    );
  };

  // Done = addGoal + finalize + to report
  const handleDone = (e) => {
    e.preventDefault();
    const newGoal = {
      goalOverview: goalOverview || "N/A",
      alignedStandard: alignedStandard.length ? alignedStandard : [],
      recommendedStrategies: recommendedStrategies.length ? recommendedStrategies : [],
      goalMeasurement: goalMeasurement || "N/A"
    };
    addGoal(newGoal);
    finalizeReport();
    navigate("/iep-report");
  };

  // Skip = add a default goal + finalize
  const handleSkip = () => {
    const defaultGoal = {
      goalOverview: "N/A",
      alignedStandard: [],
      recommendedStrategies: [],
      goalMeasurement: "N/A"
    };
    addGoal(defaultGoal);
    finalizeReport();
    navigate("/iep-report");
  };

  return (
    <div className="flex h-screen font-sans bg-offwhite">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Navbar />

        <div className="mt-4 mb-4 max-w-3xl mx-auto">
          <ProgressBar progress={overallProgress} />
          <p className="text-sm text-gray-600 mt-1 text-center">
            Overall Progress: {overallProgress}%
          </p>
        </div>

        <div className="pt-8 p-8">
          <form
            onSubmit={handleDone}
            className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-10"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              {headerText}
            </h2>

            {/* Goal Overview */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">
                Goal Overview
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Provide a clear, measurable, time-bound SMART goal.
              </p>
              <textarea
                value={goalOverview}
                onChange={e => setGoalOverview(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded-2xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                rows="3"
                placeholder="e.g. Improve reading comprehension by 20%..."
                required
              />
            </div>

            {/* Aligned Standards */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">
                Aligned Standards
              </label>
              <p className="text-xs text-gray-500 mt-1">
                (Hold Ctrl/Cmd to select multiple)
              </p>
              <select
                multiple
                value={alignedStandard}
                onChange={e =>
                  setAlignedStandard(
                    Array.from(e.target.selectedOptions, o => o.value)
                  )
                }
                className="mt-2 block w-full border border-gray-300 rounded-2xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                required
              >
                {standards.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {alignedStandard.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {alignedStandard.map((std, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-pink-500 text-white rounded-full text-sm"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Strategies */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">
                Recommended Strategies
              </label>
              <p className="text-xs text-gray-500 mt-1">(Select one or more)</p>
              <div className="flex flex-wrap gap-3 mt-2">
                {strategies.map(strat => (
                  <label
                    key={strat}
                    className="flex items-center space-x-2 border border-gray-300 rounded-full px-4 py-2 cursor-pointer hover:bg-pink-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={strat}
                      checked={recommendedStrategies.includes(strat)}
                      onChange={handleStrategyChange}
                    />
                    <span className="text-gray-700">{strat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Goal Measurement */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-700">
                Goal Measurement
              </label>
              <p className="text-xs text-gray-500 mt-1">
                (How will you gauge progress?)
              </p>
              <select
                value={goalMeasurement}
                onChange={e => setGoalMeasurement(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded-2xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                required
              >
                <option value="">Select Measurement Type</option>
                <option value="Percentage">Percentage (%)</option>
                <option value="Frequency">Frequency</option>
              </select>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-gray-300 rounded-full text-gray-800 hover:scale-105 transition-all duration-300"
              >
                Back
              </button>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-6 py-2 bg-gray-500 text-white rounded-full hover:scale-105 transition-all duration-300"
                >
                  Skip Goal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full hover:scale-105 transition-all duration-300"
                >
                  Done
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
