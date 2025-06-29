import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProgressBar from "../components/ProgressBar";
import { IEPContext } from "../context/IEPContext";

export default function StrengthsForm() {
  const navigate = useNavigate();
  const { iepData, updateStrengths } = useContext(IEPContext);

  const [strengths, setStrengths] = useState(iepData.strengths.strengths || "");
  const [areasForGrowth, setAreasForGrowth] = useState(iepData.strengths.areasForGrowth || "");

  useEffect(() => { setStrengths(iepData.strengths.strengths || ""); }, [iepData.strengths.strengths]);
  useEffect(() => { setAreasForGrowth(iepData.strengths.areasForGrowth || ""); }, [iepData.strengths.areasForGrowth]);
  
  const fraction = ((strengths.trim() ? 1 : 0) + (areasForGrowth.trim() ? 1 : 0)) / 2;
  const overallProgress = Math.round(40 + fraction * 20);

  const handleNext = (e) => {
    e.preventDefault();
    updateStrengths({
      strengths: strengths || "N/A",
      areasForGrowth: areasForGrowth || "N/A"
    });
    navigate("/new-student/data-setup");
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
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Student Strengths & Areas For Growth
            </h2>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">
                Student Strengths
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Describe the student's academic and personal strengths.
              </p>
              <textarea
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded-2xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                rows="4"
                placeholder="Enter strengths..."
              ></textarea>
            </div>
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-700">
                Student Areas for Growth
              </label>
              <p className="text-xs text-gray-500 mt-1">
                List areas where the student may need additional support.
              </p>
              <textarea
                value={areasForGrowth}
                onChange={(e) => setAreasForGrowth(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded-2xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                rows="4"
                placeholder="Enter areas for growth..."
              ></textarea>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate("/new-student/needs")}
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
