// src/pages/GoalEditor.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { IEPContext } from '../context/IEPContext';

export default function GoalEditor() {
  const navigate = useNavigate();
  const { iepData } = useContext(IEPContext);
  const { studentInfo, goals } = iepData;

  return (
    <div className="flex h-screen font-sans bg-offwhite">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-8 overflow-auto w-full">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
            {studentInfo && studentInfo.studentName
              ? `${studentInfo.studentName}'s Current Goals`
              : "Current Goals"}
          </h1>
          
          <div className="bg-white rounded-3xl shadow-lg p-10 w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Goals</h2>
            {goals && goals.length > 0 ? (
              <div className="space-y-6">
                {goals.map((goal, index) => (
                  <div key={index} className="border border-gray-300 rounded-xl p-6">
                    <p className="text-xl font-semibold text-gray-800 mb-2">
                      Goal Overview: <span className="font-normal">{goal.goalOverview || "N/A"}</span>
                    </p>
                    <p className="text-lg text-gray-800 mb-2">
                      Aligned Standards:{" "}
                      {goal.alignedStandard && goal.alignedStandard.length > 0 ? (
                        <span className="flex flex-wrap gap-2">
                          {goal.alignedStandard.map((std, i) => (
                            <span key={i} className="inline-block px-3 py-1 bg-pink-500 text-white rounded-full text-sm">
                              {std}
                            </span>
                          ))}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </p>
                    <p className="text-lg text-gray-800 mb-2">
                      Recommended Strategies:{" "}
                      <span className="font-normal">
                        {goal.recommendedStrategies && goal.recommendedStrategies.length > 0 ? goal.recommendedStrategies.join(", ") : "N/A"}
                      </span>
                    </p>
                    <p className="text-lg text-gray-800">
                      Measurement: <span className="font-normal">{goal.goalMeasurement || "N/A"}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No goals have been set for this student yet.</p>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 mt-10 mb-10">
            <button
              onClick={() => navigate("/new-student/add-goal")}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full hover:scale-105 transition-all duration-300"
            >
              Add New Goal
            </button>
            <button
              onClick={() => navigate("/goal-progress")}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full hover:scale-105 transition-all duration-300"
            >
              View Progress
            </button>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-300 text-gray-800 rounded-full hover:scale-105 transition-all duration-300"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
