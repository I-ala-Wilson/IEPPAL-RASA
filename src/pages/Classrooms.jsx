// src/pages/Classrooms.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, Book, Brain, Clock } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { IEPContext } from "../context/IEPContext";

// Map of student IDs to their goals
const goalsData = {
  1: [
    {
      id: 1,
      title: "Support with Integrals & Test-Taking Anxiety",
      class: "AP Calculus BC",
      strategies: ["Deep breathing", "Practice problems", "Time management"],
      startDate: "September 15, 2024",
      color: "from-pink-500 to-rose-400",
      bgColor: "bg-pink-50",
      icon: Calculator,
      standards: [
        "MA.CAL.2.1: Understand definite integrals",
        "MA.CAL.2.2: Apply integrals to real-world problems"
      ]
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
      standards: [
        "ELIT.3.1: Identify main ideas",
        "ELIT.3.2: Analyze text structure"
      ]
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
      standards: [
        "PSY.SOC.1: Demonstrate effective communication",
        "PSY.SOC.2: Practice empathy in group settings"
      ]
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
      standards: [
        "STUDY.OM.1: Use planners effectively",
        "STUDY.OM.2: Break tasks into steps"
      ]
    }
  ]
};

export default function Classrooms() {
  const navigate = useNavigate();
  const { iepReports } = useContext(IEPContext);
  const reports = iepReports || [];

  // Classroom modal state
  const [showClassroomPopup, setShowClassroomPopup] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  // Student modal state
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showGoalDetail, setShowGoalDetail] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Sample student data for classes A and B
  const sampleStudents = {
    A: [
      { studentName: "Student 1", grade: "3", id: 1 },
      { studentName: "Student 2", grade: "3", id: 2 },
      { studentName: "Student 5", grade: "3", id: 5 }
    ],
    B: [
      { studentName: "Student 3", grade: "4", id: 3 },
      { studentName: "Student 4", grade: "4", id: 4 }
    ]
  };

  const getAllStudentsForRoom = (room) => {
    const realStudents = reports
      .filter(report => report.studentInfo?.classroom === room)
      .map(report => ({
        studentName: report.studentInfo.studentName,
        grade: report.studentInfo.grade,
        id: report.id || Math.random()
      }));
    return [...realStudents, ...(sampleStudents[room] || [])];
  };

  const grouped = {};
  const rooms = ["A", "B", "C", "D", "E", "F", "G", "H"];
  rooms.forEach(room => {
    const students = getAllStudentsForRoom(room);
    if (students.length) grouped[room] = students;
  });

  const getCardColor = (index) => {
    const colors = [
      "from-pink-500 to-rose-400",
      "from-violet-500 to-purple-400",
      "from-blue-500 to-indigo-400",
      "from-emerald-500 to-teal-400",
      "from-amber-500 to-yellow-400",
      "from-red-500 to-rose-400",
      "from-cyan-500 to-blue-400",
      "from-lime-500 to-green-400"
    ];
    return colors[index % colors.length];
  };

  // Open classroom modal
  const openClassroomPopup = (room) => {
    setSelectedClassroom(room);
    setShowClassroomPopup(true);
    setSearchTerm("");
  };
  const closeClassroomPopup = () => {
    setShowClassroomPopup(false);
    setSelectedClassroom(null);
    setSearchTerm("");
  };

  // Open student modal
  const openStudentPopup = (student) => {
    setSelectedStudent(student);
    setShowStudentPopup(true);
  };
  const closeStudentPopup = () => {
    setShowStudentPopup(false);
    setSelectedStudent(null);
  };

  // Goal detail modal functions
const openGoalDetail = (goal) => {
  setSelectedGoal(goal);
  setShowGoalDetail(true);
};

const closeGoalDetail = () => {
  setShowGoalDetail(false);
  setSelectedGoal(null);
};
  const filteredStudents = selectedClassroom && grouped[selectedClassroom]
    ? grouped[selectedClassroom].filter(s =>
        s.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Classrooms</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rooms.map((room, idx) => (
              <div key={room} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300">
                <div className={`bg-gradient-to-r ${getCardColor(idx)} rounded-t-2xl p-6`}>
                  <h2 className="text-2xl font-semibold text-white">Classroom {room}</h2>
                  <p className="text-white text-opacity-80 mt-1 text-sm">
                    {grouped[room]?.length || 0} {grouped[room]?.length === 1 ? 'student' : 'students'}
                  </p>
                </div>
                <div className="p-4">
                  {grouped[room] && grouped[room].length > 0 ? (
                    <div className="space-y-3">
                      {grouped[room].slice(0, 3).map((student) => (
                        <div
  key={student.id}
  onClick={() => openStudentPopup(student)}
  className="flex items-center p-3 rounded-xl cursor-pointer hover:bg-gray-50 border border-gray-100 transition-all"
>
  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 mr-3">
    {student.studentName.charAt(0).toUpperCase()}
  </div>
  <div>
    <p className="text-base font-medium text-gray-800">{student.studentName}</p>
    <p className="text-xs text-gray-500">Grade {student.grade}</p>
  </div>
</div>
                      ))}
                      {grouped[room].length > 3 && (
                        <div className="text-center text-sm text-gray-500">
                          +{grouped[room].length - 3} more students
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500">No students yet</p>
                      <button
                        className="mt-3 text-sm px-4 py-2 rounded-full bg-pink-100 text-pink-600 font-medium"
                        onClick={() => navigate("/new-student")}
                      >
                        Add Student
                      </button>
                    </div>
                  )}
                </div>
                {grouped[room] && grouped[room].length > 0 && (
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => openClassroomPopup(room)}
                      className="w-full py-2 px-4 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition"
                    >
                      See Full Class
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Classroom Popup */}
{/* Student Goals Dashboard - Fullscreen */}
{showStudentPopup && selectedStudent && (
  <div className="fixed inset-0 bg-gray-50 z-50 overflow-auto">
    {/* Header Bar */}
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button 
              onClick={closeStudentPopup}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Back to Classrooms</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 flex items-center justify-center text-white text-xl font-bold">
                {selectedStudent.studentName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedStudent.studentName}</h1>
                <p className="text-gray-600">Grade {selectedStudent.grade} • Student Dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all">
              Add New Goal
            </button>
            <button className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              View Progress
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="max-w-7xl mx-auto px-8 py-8">
      {(goalsData[selectedStudent.id] && goalsData[selectedStudent.id].length > 0) ? (
        <>
          {/* Goals Overview */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Active Goals</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                  {goalsData[selectedStudent.id].length} Active Goals
                </span>
              </div>
            </div>
            
            {/* Goals Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {goalsData[selectedStudent.id].map((goal, index) => {
                const Icon = goal.icon;
                return (
                  <div key={goal.id} className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Goal Header */}
                    <div className={`bg-gradient-to-r ${goal.color} p-8 relative overflow-hidden`}>
                      <div className="absolute top-4 right-4 opacity-20">
                        <Icon className="w-16 h-16 text-white" />
                      </div>
                      <div className="relative">
                        <div className="flex items-center mb-3">
                          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-sm font-medium">
                            {goal.class}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{goal.title}</h3>
                        <p className="text-white text-opacity-90 text-sm">Started {goal.startDate}</p>
                      </div>
                    </div>
                    
                    {/* Goal Content */}
                    <div className="p-8">
                      {/* Academic Standards */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Academic Standards
                        </h4>
                        <div className="space-y-3">
                          {goal.standards.map((standard, i) => (
                            <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-blue-600 text-xs font-bold">{i + 1}</span>
                              </div>
                              <span className="text-gray-700 text-sm leading-relaxed">{standard}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Strategies */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                          Support Strategies
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {goal.strategies.map((strategy, idx) => (
                            <span 
                              key={idx} 
                              className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-100"
                            >
                              {strategy}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button 
  onClick={() => openGoalDetail(goal)}
  className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
>
  View Details
</button>
                        <div className="flex items-center space-x-3">
                          <button className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors">
                            Edit Goal
                          </button>
                          <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                            Track Progress
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* No Goals State */
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Goals Yet</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {selectedStudent.studentName} doesn't have any learning goals set up yet. 
              Create their first goal to start tracking their progress and providing targeted support.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all text-lg">
              Create First Goal
            </button>
            <div className="mt-8 p-6 bg-blue-50 rounded-2xl">
              <h4 className="font-semibold text-blue-800 mb-2">Getting Started Tips:</h4>
              <ul className="text-blue-700 text-sm space-y-1 text-left">
                <li>• Start with 1-2 specific, measurable goals</li>
                <li>• Align goals with their IEP objectives</li>
                <li>• Include both academic and behavioral targets</li>
                <li>• Set realistic timelines for achievement</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}
    </div>
  );
}
