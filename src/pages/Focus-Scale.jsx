import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Brain, Zap } from "lucide-react";

export default function FocusScale() {
  const navigate = useNavigate();
  const [selectedFocus, setSelectedFocus] = useState(null);

  const focusLevels = [
    { value: 1, label: "Completely Disengaged", icon: EyeOff, color: "text-red-500" },
    { value: 2, label: "Very Distracted", icon: EyeOff, color: "text-red-400" },
    { value: 3, label: "Somewhat Distracted", icon: EyeOff, color: "text-orange-500" },
    { value: 4, label: "Slightly Unfocused", icon: Eye, color: "text-orange-400" },
    { value: 5, label: "Neutral", icon: Eye, color: "text-yellow-500" },
    { value: 6, label: "Slightly Focused", icon: Eye, color: "text-yellow-400" },
    { value: 7, label: "Moderately Focused", icon: Brain, color: "text-green-400" },
    { value: 8, label: "Very Focused", icon: Brain, color: "text-green-500" },
    { value: 9, label: "Highly Engaged", icon: Zap, color: "text-green-600" },
    { value: 10, label: "Extremely Engaged", icon: Zap, color: "text-green-700" }
  ];

  const handleNext = () => {
    if (selectedFocus !== null) {
      navigate("/understanding-level");
    }
  };

  return (
    <div className="flex h-screen font-sans bg-offwhite">
      <div className="flex-1 flex flex-col">
        <div className="pt-8 p-8 overflow-auto">
          <form className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
              How focused were you in today's lesson?
            </h2>
            
            <div className="mb-8">
              <p className="text-lg text-gray-600 text-center mb-8">
                Rate your focus level from 1 (completely disengaged) to 10 (extremely engaged)
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {focusLevels.map((level) => {
                  const IconComponent = level.icon;
                  return (
                    <div
                      key={level.value}
                      onClick={() => setSelectedFocus(level.value)}
                      className={`
                        flex flex-col items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300
                        ${selectedFocus === level.value 
                          ? 'border-pink-500 bg-pink-50 shadow-lg scale-105' 
                          : 'border-gray-300 hover:border-pink-300 hover:bg-pink-25'
                        }
                      `}
                    >
                      <div className={`mb-3 ${level.color}`}>
                        <IconComponent size={32} />
                      </div>
                      <div className="text-2xl font-bold text-gray-800 mb-2">
                        {level.value}
                      </div>
                      <div className="text-sm text-gray-600 text-center">
                        {level.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-gray-300 rounded-full text-gray-800 hover:scale-105 transition-all duration-300"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={selectedFocus === null}
                className={`
                  px-6 py-2 rounded-full transition-all duration-300
                  ${selectedFocus !== null
                    ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
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
