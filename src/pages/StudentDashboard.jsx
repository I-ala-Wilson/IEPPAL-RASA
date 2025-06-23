// src/pages/StudentDashboard.jsx (Updated with navigation)
import React from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, Book, Brain, Clock } from "lucide-react";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";

const goals = [
  {
    id: 1,
    title: "Support with Integrals & Test-Taking Anxiety",
    class: "AP Calculus BC",
    strategies: ["Deep breathing", "Practice problems", "Time management"],
    startDate: "September 15, 2024",
    color: "from-pink-500 to-rose-400",
    bgColor: "bg-pink-50",
    icon: Calculator,
  },
  {
    id: 2,
    title: "Reading Comprehension Improvement",
    class: "English Literature",
    strategies: ["Note taking", "Active reading", "Summary writing"],
    startDate: "October 2, 2024",
    color: "from-violet-500 to-purple-400",
    bgColor: "bg-violet-50",
    icon: Book,
  },
  {
    id: 3,
    title: "Social Skills Development",
    class: "Psychology",
    strategies: ["Role playing", "Group discussions", "Reflection exercises"],
    startDate: "August 28, 2024",
    color: "from-emerald-500 to-teal-400",
    bgColor: "bg-emerald-50",
    icon: Brain,
  },
  {
    id: 4,
    title: "Organization & Time Management",
    class: "Study Skills",
    strategies: ["Planner usage", "Priority setting", "Task breakdown"],
    startDate: "November 10, 2024",
    color: "from-blue-500 to-indigo-400",
    bgColor: "bg-blue-50",
    icon: Clock,
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();

  const handleGoalClick = (goalId) => {
    navigate(`/goal/${goalId}`);
  };

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      <StudentSidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 overflow-auto">
          {/* Greeting Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Good Morning Student!
            </h1>
            <p className="text-gray-600">
              This is your goal menu, let's click on a goal and see how you're doing!
            </p>
          </div>

          {/* Goals Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const IconComponent = goal.icon;
              return (
                <div
                  key={goal.id}
                  onClick={() => handleGoalClick(goal.id)}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                >
                  <div className={`bg-gradient-to-r ${goal.color} rounded-t-2xl p-6 h-24 flex flex-col justify-center group-hover:shadow-lg transition-shadow duration-300`}>
                    <h2 className="text-xl font-semibold text-white mb-1 leading-tight">
                      {goal.title}
                    </h2>
                    <p className="text-white text-opacity-80 text-sm">
                      {goal.class}
                    </p>
                  </div>
                  
                  <div className="p-6 relative">
                    {/* Vertical divider line */}
                    <div className="absolute left-1/2 top-4 bottom-4 w-px bg-gray-200"></div>
                    
                    <div className="flex">
                      {/* Left side - Icon and Date */}
                      <div className="flex-1 pr-6">
                        <div className="flex items-center mb-4">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${goal.bgColor} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="w-6 h-6 text-gray-600" />
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 font-medium mb-1">
                            Goal started on:
                          </p>
                          <p className="text-base font-semibold text-gray-800">
                            {goal.startDate}
                          </p>
                        </div>
                      </div>
                      
                      {/* Right side - Strategies */}
                      <div className="flex-1 pl-6">
                        <p className="text-sm text-gray-600 font-medium mb-3">
                          Strategies:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {goal.strategies.map((strategy, index) => (
                            <span
                              key={index}
                              className={`inline-block px-3 py-1 rounded-full ${goal.bgColor} text-gray-700 text-sm font-medium group-hover:shadow-sm transition-shadow duration-300`}
                            >
                              {strategy}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
