// src/pages/Classrooms.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { IEPContext } from "../context/IEPContext";

export default function Classrooms() {
  const navigate = useNavigate();
  const { iepReports } = useContext(IEPContext);
  const reports = iepReports || [];

  // Group reports by classroom
  const grouped = reports.reduce((acc, report) => {
    const room = report.studentInfo?.classroom;
    if (room) {
      acc[room] = acc[room] || [];
      acc[room].push(report);
    }
    return acc;
  }, {});

  // Define fixed classrooms A through H
  const rooms = ["A", "B", "C", "D", "E", "F", "G", "H"];

  // Get color for classroom card based on index
  const getCardColor = (index) => {
    const colors = [
      "from-pink-500 to-rose-400",
      "from-violet-500 to-purple-400",
      "from-blue-500 to-indigo-400",
      "from-emerald-500 to-teal-400",
      "from-amber-500 to-yellow-400",
      "from-red-500 to-rose-400",
      "from-cyan-500 to-blue-400",
      "from-lime-500 to-green-400",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Classrooms</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rooms.map((room, idx) => (
              <div
                key={room}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300"
              >
                <div className={`bg-gradient-to-r ${getCardColor(idx)} rounded-t-2xl p-6`}>
                  <h2 className="text-2xl font-semibold text-white">Classroom {room}</h2>
                  <p className="text-white text-opacity-80 mt-1 text-sm">
                    {grouped[room]?.length || 0} {grouped[room]?.length === 1 ? 'student' : 'students'}
                  </p>
                </div>
                
                <div className="p-4">
                  {grouped[room] && grouped[room].length > 0 ? (
                    <div className="space-y-3">
                      {grouped[room].map((report, index) => (
                        <div
                          key={index}
                          onClick={() => navigate("/goal-editor")}
                          className="flex items-center p-3 rounded-xl cursor-pointer hover:bg-gray-50 border border-gray-100 transition-all"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 mr-3">
                            {report.studentInfo.studentName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-base font-medium text-gray-800">
                              {report.studentInfo.studentName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Grade {report.studentInfo.grade}
                            </p>
                          </div>
                        </div>
                      ))}
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
                      onClick={() => navigate(`/classroom/${room}`)}
                      className="w-full py-2 px-4 rounded-xl bg-pink-50 text-pink-600 text-sm font-medium hover:bg-pink-100 transition"
                    >
                      View Classroom
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}