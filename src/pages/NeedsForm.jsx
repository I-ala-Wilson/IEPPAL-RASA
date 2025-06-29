import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProgressBar from "../components/ProgressBar";
import { IEPContext } from "../context/IEPContext";

export default function NeedsForm() {
  const navigate = useNavigate();
  const { iepData, updateNeeds } = useContext(IEPContext);

  const [functionalNeeds, setFunctionalNeeds] = useState(iepData.needs.functionalNeeds || "");
  const [otherFunctionalNeeds, setOtherFunctionalNeeds] = useState("");
  const [diagnosisAwareness, setDiagnosisAwareness] = useState(iepData.needs.diagnosisAwareness || "");
  const [nonAcademicNeeds, setNonAcademicNeeds] = useState(iepData.needs.nonAcademicNeeds || "");
  const [otherNonAcademicNeeds, setOtherNonAcademicNeeds] = useState("");
  const [backgroundInfo, setBackgroundInfo] = useState(iepData.needs.backgroundInfo || "");
  const [psychoReport, setPsychoReport] = useState(iepData.needs.psychoReport || "");

  useEffect(() => { setFunctionalNeeds(iepData.needs.functionalNeeds || ""); }, [iepData.needs.functionalNeeds]);
  useEffect(() => { setDiagnosisAwareness(iepData.needs.diagnosisAwareness || ""); }, [iepData.needs.diagnosisAwareness]);
  useEffect(() => { setNonAcademicNeeds(iepData.needs.nonAcademicNeeds || ""); }, [iepData.needs.nonAcademicNeeds]);
  useEffect(() => { setBackgroundInfo(iepData.needs.backgroundInfo || ""); }, [iepData.needs.backgroundInfo]);
  useEffect(() => { setPsychoReport(iepData.needs.psychoReport || ""); }, [iepData.needs.psychoReport]);

  const calculateFraction = () => {
    let total = 5;
    let completed = 0;
    if (functionalNeeds) {
      completed++;
      if (functionalNeeds === "Other") {
        total++;
        if (otherFunctionalNeeds.trim()) completed++;
      }
    }
    if (diagnosisAwareness) completed++;
    if (nonAcademicNeeds) {
      completed++;
      if (nonAcademicNeeds === "Other") {
        total++;
        if (otherNonAcademicNeeds.trim()) completed++;
      }
    }
    if (backgroundInfo.trim()) completed++;
    if (psychoReport.trim()) completed++;
    return total > 0 ? completed / total : 0;
  };

  const fraction = calculateFraction();
  const overallProgress = Math.round(20 + fraction * 20);

  const handleNext = (e) => {
    e.preventDefault();
    updateNeeds({
      functionalNeeds: functionalNeeds === "Other" ? (otherFunctionalNeeds || "N/A") : (functionalNeeds || "N/A"),
      diagnosisAwareness: diagnosisAwareness || "N/A",
      nonAcademicNeeds: nonAcademicNeeds === "Other" ? (otherNonAcademicNeeds || "N/A") : (nonAcademicNeeds || "N/A"),
      backgroundInfo: backgroundInfo || "N/A",
      psychoReport: psychoReport || "N/A"
    });
    navigate("/new-student/strengths");
  };

  return (
    <div className="flex h-screen font-sans bg-offwhite">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="mt-4 mb-4 max-w-3xl mx-auto">
          <ProgressBar progress={overallProgress} />
          <p className="text-sm text-gray-600 mt-1 text-center">
            Overall Progress: {overallProgress}%
          </p>
        </div>
        <div className="pt-8 p-8 overflow-auto">
          <form onSubmit={handleNext} className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Student Academic and Non-Academic Needs</h2>
            
            {/* Functional Need */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">
                Functional need in the area(s) of
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Select the academic area where support is needed. If "Other", specify below.
              </p>
              <select
                value={functionalNeeds}
                onChange={(e) => setFunctionalNeeds(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded-2xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
              >
                <option value="">Select an option</option>
                <option value="Reading">Reading</option>
                <option value="Writing">Writing</option>
                <option value="Math">Math</option>
                <option value="Other">Other</option>
              </select>
              {functionalNeeds === "Other" && (
                <input
                  type="text"
                  value={otherFunctionalNeeds}
                  onChange={(e) => setOtherFunctionalNeeds(e.target.value)}
                  className="mt-2 block w-full border border-gray-300 rounded-2xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                  placeholder="Please specify"
                />
              )}
            </div>
            
            {/* Diagnosis Awareness */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">
                Student is aware of their diagnosis
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Select "Yes" if the student has been informed about their diagnosis.
              </p>
              <select
                value={diagnosisAwareness}
                onChange={(e) => setDiagnosisAwareness(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded-2xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            
            {/* Non-Academic Needs */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">
                Identification of Non-Academic Needs
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Select the non-academic challenge(s) the student may face. If "Other", specify below.
              </p>
              <select
                value={nonAcademicNeeds}
                onChange={(e) => setNonAcademicNeeds(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded-2xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
              >
                <option value="">Select an option</option>
                <option value="ADHD">ADHD</option>
                <option value="Autism Spectrum Disorder">Autism Spectrum Disorder</option>
                <option value="Anxiety">Anxiety</option>
                <option value="Other">Other</option>
              </select>
              {nonAcademicNeeds === "Other" && (
                <input
                  type="text"
                  value={otherNonAcademicNeeds}
                  onChange={(e) => setOtherNonAcademicNeeds(e.target.value)}
                  className="mt-2 block w-full border border-gray-300 rounded-2xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                  placeholder="Please specify"
                />
              )}
            </div>
            
            {/* Background Information */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">
                Background Information
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Provide background details that help explain the student's context.
              </p>
              <textarea
                value={backgroundInfo}
                onChange={(e) => setBackgroundInfo(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded-2xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                rows="4"
                placeholder="Enter background information..."
              ></textarea>
            </div>
            
            {/* Psychoeducational Report Summary */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-700">
                Psychoeducational Report Summary
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Summarize the most recent psychoeducational evaluation.
              </p>
              <textarea
                value={psychoReport}
                onChange={(e) => setPsychoReport(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded-2xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                rows="4"
                placeholder="Enter report summary..."
              ></textarea>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate("/new-student/info")}
                className="px-6 py-2 bg-gray-300 rounded-full text-gray-800 hover:scale-105 transition-all duration-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-pastelPink to-pastelOrange text-white rounded-full hover:scale-105 transition-all duration-500"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
