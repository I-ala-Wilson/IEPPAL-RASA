import React, { useState } from "react";
import { Heart, CheckCircle, X } from "lucide-react";

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

export default function BiweeklyCheckInModal({
  onClose,
  goalTitle,       // still available if you want to show it
  color            // gradient string passed from parent
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
              <button
                onClick={onClose}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Close
              </button>
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
