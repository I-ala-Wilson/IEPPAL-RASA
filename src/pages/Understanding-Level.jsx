import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

export default function UnderstandingLevel() {
  const navigate = useNavigate();
  const [selectedUnderstanding, setSelectedUnderstanding] = useState(null);

  const understandingLevels = [
    {
      value: "green",
      label: "Good",
      description: "I understood everything clearly",
      icon: CheckCircle,
      bgColor: "bg-green-100",
      borderColor: "border-green-500",
      textColor: "text-green-700",
      iconColor: "text-green-500"
    },
    {
      value: "yellow",
      label: "I sort of get it, but have some questions",
      description: "I understood most of it but need clarification",
      icon: AlertCircle,
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-500",
      textColor: "text-yellow-700",
      iconColor: "text-yellow-500"
    },
    {
      value: "red",
      label: "I am lost!",
      description: "I didn't understand the lesson",
      icon: XCircle,
      bgColor: "bg-red-100",
      borderColor: "border-red-500",
      textColor: "text-red-700",
      iconColor: "text-red-500"
    }
  ];

  const handleNext = () => {
    if (selectedUnderstanding !== null) {
      navigate("/response-prompt");
    }
  };

  return (
    <div className="flex h-screen font-sans bg-offwhite">
      <div className="flex-1 flex flex-col">
        <div className="pt-8 p-8 overflow-auto">
          <form className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
              How much did you understand today's lesson?
            </h2>
            
            <div className="mb-8">
              <p className="text-lg text-gray-600 text-center mb-8">
                Choose the option that best describes your understanding
              </p>
              
              <div className="space-y-4">
                {understandingLevels.map((level) => {
                  const IconComponent = level.icon;
                  return (
                    <div
                      key={level.value}
                      onClick={() => setSelectedUnderstanding(level.value)}
                      className={`
                        flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300
                        ${selectedUnderstanding === level.value 
                          ? `${level.borderColor} ${level.bgColor} shadow-lg scale-105` 
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className={`mr-4 ${level.iconColor}`}>
                        <IconComponent size={48} />
                      </div>
                      <div className="flex-1">
                        <div className={`text-xl font-bold mb-2 ${selectedUnderstanding === level.value ? level.textColor : 'text-gray-800'}`}>
                          {level.label}
                        </div>
                        <div className={`text-sm ${selectedUnderstanding === level.value ? level.textColor : 'text-gray-600'}`}>
                          {level.description}
                        </div>
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
                disabled={selectedUnderstanding === null}
                className={`
                  px-6 py-2 rounded-full transition-all duration-300
                  ${selectedUnderstanding !== null
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
