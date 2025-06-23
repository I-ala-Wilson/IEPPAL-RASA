// src/pages/GoalDetail.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calculator, Book, Brain, Clock, FileText, Heart, CheckCircle, X } from "lucide-react";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";

// Test Reflection Modal Component
function TestReflectionModal({
  onClose,
  goalTitle,
  lastAssessmentDate,
  color,
  onComplete
}) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (response.trim()) {
      setIsCompleted(true);
      console.log("Test reflection saved:", response);
      // Call the completion callback after a short delay
      setTimeout(() => {
        onComplete();
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${color} p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center text-white">
            <FileText className="w-6 h-6 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">1 Minute Activity</h3>
              <p className="text-white text-opacity-80 text-sm">
                Answer one question about your last assessment and you're done!
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isCompleted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Great job!</h4>
              <p className="text-gray-600 mb-6">Your reflection has been saved.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">
                  How did you feel about your most recent test on{" "}
                  <span className="font-semibold text-gray-900">
                    {lastAssessmentDate}
                  </span>
                  ?
                </label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Share what went well, what was challenging, and how you felt..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="6"
                  required
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-gradient-to-r ${color} text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-shadow duration-300`}
                >
                  Submit Reflection
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Biweekly Check-in Modal Component
const questions = [
  "I feel confident about my progress in this subject",
  "I have been using the strategies we discussed regularly",
  "I feel less anxious about this subject than before",
  "I understand the material better now",
  "I feel prepared for upcoming assessments",
  "I have been practicing the skills we identified",
  "I feel supported in achieving this goal",
  "I can see improvement in my performance",
  "I feel motivated to continue working on this goal",
  "Overall, I am satisfied with my progress"
];

const responseOptions = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" }
];

function BiweeklyCheckInModal({
  onClose,
  goalTitle,
  color,
  onComplete
}) {
  const [responses, setResponses] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleResponseChange = (questionIndex, value) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(responses).length === questions.length) {
      setIsCompleted(true);
      console.log("Biweekly check-in saved:", responses);
      // Call the completion callback after a short delay
      setTimeout(() => {
        onComplete();
        onClose();
      }, 1500);
    }
  };

  const isFormComplete = Object.keys(responses).length === questions.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${color} p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center text-white">
            <Heart className="w-6 h-6 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">
                How Have The Last Two Weeks Been?
              </h3>
              <p className="text-white text-opacity-80 text-sm">
                1 Minute Activity: Answer 10 Questions from Strongly Disagree to Strongly Agree!
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isCompleted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Thank you!</h4>
              <p className="text-gray-600 mb-6">Your check-in has been recorded.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4">
                    <p className="text-gray-700 font-medium mb-3">
                      {index + 1}. {question}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {responseOptions.map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-center cursor-pointer px-3 py-2 rounded-lg border transition-colors ${
                            responses[index] === option.value
                              ? "bg-blue-50 border-blue-300 text-blue-700"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option.value}
                            onChange={() => handleResponseChange(index, option.value)}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormComplete}
                  className={`font-semibold py-3 px-6 rounded-lg transition-all duration-300 ${
                    isFormComplete
                      ? `bg-gradient-to-r ${color} text-white hover:shadow-lg`
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isFormComplete
                    ? "Submit Check-in"
                    : `Answer ${questions.length - Object.keys(responses).length} more questions`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Activity Card Components
function TestReflectionActivity({
  goalTitle,
  lastAssessmentDate,
  color,
  isCompleted,
  onStart
}) {
  return (
    <div className={`relative overflow-hidden transition-all duration-500 ${
      isCompleted ? 'opacity-60 transform scale-95' : 'opacity-100 transform scale-100'
    }`}>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        {isCompleted && (
          <div className="absolute inset-0 bg-green-50 bg-opacity-90 flex items-center justify-center z-10 rounded-xl">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-green-700 font-semibold text-lg">All Done!</p>
              <p className="text-green-600 text-sm">Reflection completed</p>
            </div>
          </div>
        )}
        
        <div className="flex items-start mb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center mr-4 shadow-sm`}>
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Test Reflection
            </h3>
            <p className="text-gray-600 text-sm">
              Quick reflection on your last assessment
            </p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 text-sm">
          Last assessment: <span className="font-medium">{lastAssessmentDate}</span>
        </p>
        
        {!isCompleted && (
          <button
            onClick={onStart}
            className={`w-full bg-gradient-to-r ${color} text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-shadow duration-300`}
          >
            Start 1-Minute Reflection
          </button>
        )}
      </div>
    </div>
  );
}

function BiweeklyCheckInActivity({
  goalTitle,
  color,
  isCompleted,
  onStart
}) {
  return (
    <div className={`relative overflow-hidden transition-all duration-500 ${
      isCompleted ? 'opacity-60 transform scale-95' : 'opacity-100 transform scale-100'
    }`}>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        {isCompleted && (
          <div className="absolute inset-0 bg-green-50 bg-opacity-90 flex items-center justify-center z-10 rounded-xl">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-green-700 font-semibold text-lg">All Done!</p>
              <p className="text-green-600 text-sm">Check-in completed</p>
            </div>
          </div>
        )}
        
        <div className="flex items-start mb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center mr-4 shadow-sm`}>
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Biweekly Check-in
            </h3>
            <p className="text-gray-600 text-sm">
              Rate your progress and feelings
            </p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 text-sm">
          Answer 10 quick questions about your recent progress
        </p>
        
        {!isCompleted && (
          <button
            onClick={onStart}
            className={`w-full bg-gradient-to-r ${color} text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-shadow duration-300`}
          >
            Start Check-in
          </button>
        )}
      </div>
    </div>
  );
}

// Detailed goal data with descriptions
const goalsData = {
  1: {
    id: 1,
    title: "Support with Integrals & Test-Taking Anxiety",
    class: "AP Calculus BC",
    description:
      "Develop strategies to tackle challenging integrals and reduce test anxiety by practicing under timed conditions with guided breathing techniques.",
    strategies: ["Deep breathing", "Practice problems", "Time management"],
    startDate: "September 15, 2024",
    color: "from-pink-500 to-rose-400",
    bgColor: "bg-pink-50",
    icon: Calculator,
    lastAssessmentDate: "May 25, 2025",
  },
  2: {
    id: 2,
    title: "Reading Comprehension Improvement",
    class: "English Literature",
    description:
      "Enhance your understanding of complex texts through active annotation, chapter summarization, and group discussion exercises.",
    strategies: ["Note taking", "Active reading", "Summary writing"],
    startDate: "October 2, 2024",
    color: "from-violet-500 to-purple-400",
    bgColor: "bg-violet-50",
    icon: Book,
    lastAssessmentDate: "June 1, 2025",
  },
  3: {
    id: 3,
    title: "Social Skills Development",
    class: "Psychology",
    description:
      "Build confidence in peer interactions by engaging in role-plays, reflecting on communication styles, and participating in group activities.",
    strategies: ["Role playing", "Group discussions", "Reflection exercises"],
    startDate: "August 28, 2024",
    color: "from-emerald-500 to-teal-400",
    bgColor: "bg-emerald-50",
    icon: Brain,
    lastAssessmentDate: "May 30, 2025",
  },
  4: {
    id: 4,
    title: "Organization & Time Management",
    class: "Study Skills",
    description:
      "Master planning by using a detailed planner, prioritizing tasks effectively, and breaking down projects into manageable steps.",
    strategies: ["Planner usage", "Priority setting", "Task breakdown"],
    startDate: "November 10, 2024",
    color: "from-blue-500 to-indigo-400",
    bgColor: "bg-blue-50",
    icon: Clock,
    lastAssessmentDate: "June 5, 2025",
  },
};

export default function GoalDetail() {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const goal = goalsData[parseInt(goalId, 10)];
  
  // State for modals and completion
  const [showTestReflection, setShowTestReflection] = useState(false);
  const [showBiweeklyCheckIn, setShowBiweeklyCheckIn] = useState(false);
  const [testReflectionCompleted, setTestReflectionCompleted] = useState(false);
  const [biweeklyCheckInCompleted, setBiweeklyCheckInCompleted] = useState(false);

  if (!goal) {
    return <div>Goal not found</div>;
  }

  const IconComponent = goal.icon;

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      <StudentSidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 overflow-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Goals
          </button>

          {/* Goal Header */}
          <div
            className={`bg-gradient-to-r ${goal.color} rounded-2xl p-8 mb-8 text-white shadow-lg`}
          >
            <div className="flex items-start mb-6">
              <div className="w-16 h-16 bg-white bg-opacity-25 rounded-xl flex items-center justify-center mr-6 shadow-sm">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{goal.title}</h1>
                <p className="text-white text-opacity-95 text-lg font-medium mb-4">
                  {goal.class}
                </p>
                <p className="text-white text-opacity-90 text-sm">
                  Started on:{" "}
                  <span className="font-semibold">{goal.startDate}</span>
                </p>
              </div>
            </div>

            {/* Description - Simple and Clear */}
            <div className="mb-4">
              <p className="text-white text-lg leading-relaxed font-medium">
                {goal.description}
              </p>
            </div>

            {/* Strategies */}
            <div>
              <p className="text-white text-opacity-90 text-sm mb-3">Your Strategies:</p>
              <div className="flex flex-wrap gap-2">
                {goal.strategies.map((strategy, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium"
                  >
                    {strategy}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Activities */}
          <div className="grid md:grid-cols-2 gap-6">
            <TestReflectionActivity
              goalTitle={goal.title}
              lastAssessmentDate={goal.lastAssessmentDate}
              color={goal.color}
              isCompleted={testReflectionCompleted}
              onStart={() => setShowTestReflection(true)}
            />
            
            <BiweeklyCheckInActivity
              goalTitle={goal.title}
              color={goal.color}
              isCompleted={biweeklyCheckInCompleted}
              onStart={() => setShowBiweeklyCheckIn(true)}
            />
          </div>

          {/* Modals */}
          {showTestReflection && (
            <TestReflectionModal
              onClose={() => setShowTestReflection(false)}
              goalTitle={goal.title}
              lastAssessmentDate={goal.lastAssessmentDate}
              color={goal.color}
              onComplete={() => setTestReflectionCompleted(true)}
            />
          )}

          {showBiweeklyCheckIn && (
            <BiweeklyCheckInModal
              onClose={() => setShowBiweeklyCheckIn(false)}
              goalTitle={goal.title}
              color={goal.color}
              onComplete={() => setBiweeklyCheckInCompleted(true)}
            />
          )}
        </main>
      </div>
    </div>
  );
}