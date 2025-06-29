// src/pages/GoalForm.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProgressBar from "../components/ProgressBar";
import { IEPContext } from "../context/IEPContext";
import { useLocation } from "react-router-dom";


// date picker + icons
import DatePicker from "react-datepicker";
import { parse, format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { Calculator, Book, Brain, Clock, Plus, Edit3, Trash2, Users, Star, Palette, Languages, Wrench, Music, Globe, BookType,Target, X, BookOpen, Calendar, ClipboardList, Settings, Check, FileText, Edit2, PenTool, BarChart2, UserCheck, Headphones, MessageSquare, Lightbulb, } from "lucide-react";
export default function GoalForm() {
  const navigate = useNavigate();
  const location = useLocation();
const [goalSet, setGoalSet] = useState(false);

useEffect(() => {
  if (location.state?.goalSet) {
    setGoalSet(true);
    // optionally clear it so refresh won’t re-show:
    // navigate(location.pathname, { replace: true, state: {} });
  }
}, [location.state]);

  const { iepData, addGoal, finalizeReport } = useContext(IEPContext);
  const { goals, studentInfo } = iepData;

  // State for showing the modal and editing fields
  const [showGoalDetail, setShowGoalDetail] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState({
    id: Date.now(),
    title: "",
    class: studentInfo.studentName + "'s Class",
    startDate: null,
    description: "",
    standards: [],
    strategies: [],
    colorGradient: "from-pink-500 to-orange-500",
    icon: Target,
  });
  const [editingGoalField, setEditingGoalField] = useState(null);

  // When you Save, push to context + report + navigate
   const handleSaveGoal = () => {
       // 1) Add the new goal
       addGoal(selectedGoal);
       // 2) (Optional) mark the IEP step complete
       finalizeReport();
       // 3) Kick them back to Data Setup
       navigate("/new-student/data-setup", { state: { goalSet: true } });
     };

  return (
    <div className="flex h-screen font-sans bg-offwhite">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Navbar />

        {/* ─── Fullscreen Goal Details Modal ─── */}
        {showGoalDetail && selectedGoal && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 overflow-auto p-4 md:p-8"
            onClick={() => navigate("/new-student/data-setup")}
          >
            <div 
              className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              onClick={e => e.stopPropagation()}
            >
              {/* Header with gradient matching sidebar */}
              <div 
                className={`bg-gradient-to-r ${selectedGoal.colorGradient || 'from-pink-500 to-orange-500'} p-6`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      {(() => {
                        const Icon = selectedGoal.icon || Target;
                        return <Icon className="w-5 h-5 text-white" />;
                      })()}
                    </div>
                    <div className="flex-1 flex items-center justify-between space-x-2">
                      {editingGoalField === 'title' 
                        ? (
                          <input
                            type="text"
                            value={selectedGoal.title}
                            onChange={e => setSelectedGoal({ ...selectedGoal, title: e.target.value })}
                            onBlur={() => setEditingGoalField(null)}
                            className="flex-1 text-2xl font-bold text-white bg-white/20 rounded p-1"
                          />
                        )
                        : (
                          <h2
                            onClick={() => setEditingGoalField('title')}
                            className="text-2xl font-bold text-white cursor-pointer"
                          >
                            {selectedGoal.title || 'Untitled Goal'}
                          </h2>
                        )
                      }
                      <button
                        onClick={() => setEditingGoalField('title')}
                        className="p-1 hover:bg-white/20 rounded"
                      >
                        <Edit2 className="w-5 h-5 text-white/80" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/new-student/data-setup")}
                    className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Body with everything */}
              <div className="p-8 space-y-6">
                {/* Quick Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Start Date */}
                  <div className={`bg-gradient-to-br ${selectedGoal.colorGradient} rounded-xl p-4`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">Start Date</h3>
                        {editingGoalField === 'startDate' ? (
                          <DatePicker
                            selected={
                              selectedGoal.startDate
                                ? parse(selectedGoal.startDate, 'MMMM d, yyyy', new Date())
                                : null
                            }
                            onChange={date =>
                              setSelectedGoal({
                                ...selectedGoal,
                                startDate: date ? format(date, 'MMMM d, yyyy') : null
                              })
                            }
                            dateFormat="dd/MM/yyyy"
                            placeholderText="DD/MM/YYYY"
                            className="w-full p-1 rounded text-black bg-white/20 focus:bg-white transition"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                          />
                        ) : (
                          <p className="text-white/90">
                            {selectedGoal.startDate
                              ? format(
                                  parse(selectedGoal.startDate, 'MMMM d, yyyy', new Date()),
                                  'dd/MM/yyyy'
                                )
                              : 'DD/MM/YYYY'}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setEditingGoalField('startDate')}
                        className="p-1 hover:bg-white/20 rounded"
                      >
                        <Edit2 className="w-5 h-5 text-white/80" />
                      </button>
                    </div>
                  </div>

                  {/* Class Name */}
                  <div className={`bg-gradient-to-br ${selectedGoal.colorGradient} rounded-xl p-4`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">Class Name</h3>
                        {editingGoalField === 'class' ? (
                          <input
                            type="text"
                            value={selectedGoal.class || ''}
                            onChange={e => setSelectedGoal({ ...selectedGoal, class: e.target.value })}
                            onBlur={() => setEditingGoalField(null)}
                            className="w-full p-1 rounded text-black"
                            placeholder="Enter class name"
                          />
                        ) : (
                          <p className="text-white/90">{selectedGoal.class || 'Enter'}</p>
                        )}
                      </div>
                      <button
                        onClick={() => setEditingGoalField('class')}
                        className="p-1 hover:bg-white/20 rounded"
                      >
                        <Edit2 className="w-5 h-5 text-white/80" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Goal Description Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Goal Description</h3>
                    <button
                      onClick={() => setEditingGoalField('description')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  {editingGoalField === 'description' ? (
                    <div className="flex flex-col space-y-3">
                      <textarea
                        value={selectedGoal.description}
                        onChange={e =>
                          setSelectedGoal({ ...selectedGoal, description: e.target.value })
                        }
                        className="w-full h-32 p-2 border rounded text-black"
                      />
                      <button
                        onClick={() => setEditingGoalField(null)}
                        className="self-end px-4 py-1 bg-green-100 text-green-800 rounded text-sm"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {selectedGoal.description || 'No description set.'}
                    </p>
                  )}
                </div>

                {/* Academic Standards Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Academic Standards</h3>
                    <button
                      onClick={() => setEditingGoalField('standards')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  {editingGoalField === 'standards' ? (
                    <div className="flex flex-col space-y-3">
                      {selectedGoal.standards.map((s, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={s}
                            onChange={e => {
                              const arr = [...selectedGoal.standards];
                              arr[idx] = e.target.value;
                              setSelectedGoal({ ...selectedGoal, standards: arr });
                            }}
                            className="flex-1 p-2 border rounded"
                          />
                          <button
                            onClick={() =>
                              setSelectedGoal({
                                ...selectedGoal,
                                standards: selectedGoal.standards.filter((_, i) => i !== idx),
                              })
                            }
                            className="text-red-500 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          setSelectedGoal({
                            ...selectedGoal,
                            standards: [...selectedGoal.standards, ""],
                          })
                        }
                        className="self-start px-4 py-1 bg-blue-50 rounded text-sm"
                      >
                        + Add Standard
                      </button>
                      <button
                        onClick={() => setEditingGoalField(null)}
                        className="self-start px-4 py-1 bg-green-100 text-green-800 rounded text-sm"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedGoal.standards.map((std, i) => (
                        <div
                          key={i}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div
                            className={`w-5 h-5 bg-gradient-to-r ${
                              selectedGoal.colorGradient
                            } rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}
                          >
                            <span className="text-white text-xs font-bold">{i + 1}</span>
                          </div>
                          <p className="text-gray-700">{std}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Support Strategies Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Support Strategies</h3>
                    <button
                      onClick={() => setEditingGoalField('strategies')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  {editingGoalField === 'strategies' ? (
                    <div className="flex flex-col space-y-3">
                      {selectedGoal.strategies.map((s, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={s}
                            onChange={e => {
                              const arr = [...selectedGoal.strategies];
                              arr[idx] = e.target.value;
                              setSelectedGoal({ ...selectedGoal, strategies: arr });
                            }}
                            className="flex-1 p-2 border rounded"
                          />
                          <button
                            onClick={() =>
                              setSelectedGoal({
                                ...selectedGoal,
                                strategies: selectedGoal.strategies.filter((_, i) => i !== idx),
                              })
                            }
                            className="text-red-500 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          setSelectedGoal({
                            ...selectedGoal,
                            strategies: [...selectedGoal.strategies, ""],
                          })
                        }
                        className="self-start px-4 py-1 bg-blue-50 rounded text-sm"
                      >
                        + Add Strategy
                      </button>
                      <button
                        onClick={() => setEditingGoalField(null)}
                        className="self-start px-4 py-1 bg-green-100 text-green-800 rounded text-sm"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedGoal.strategies.map((strat, i) => (
                        <div
                          key={i}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div
                            className={`w-5 h-5 bg-gradient-to-r ${
                              selectedGoal.colorGradient
                            } rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}
                          >
                            <span className="text-white text-xs font-bold">{i + 1}</span>
                          </div>
                          <p className="text-gray-700">{strat}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Goal Color Selector */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Goal Color</h3>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
                    {[
                     { name: "Pink Rose",     value: "from-pink-500 to-rose-400",    preview: "bg-gradient-to-r from-pink-500 to-rose-400" },
                         { name: "Purple Violet",  value: "from-violet-500 to-purple-400", preview: "bg-gradient-to-r from-violet-500 to-purple-400" },
                         { name: "Blue Indigo",    value: "from-blue-500 to-indigo-400",   preview: "bg-gradient-to-r from-blue-500 to-indigo-400" },
                         { name: "Emerald Teal",   value: "from-emerald-500 to-teal-400",  preview: "bg-gradient-to-r from-emerald-500 to-teal-400" },
                         { name: "Amber Yellow",   value: "from-amber-500 to-yellow-400",  preview: "bg-gradient-to-r from-amber-500 to-yellow-400" },
                         { name: "Red Rose",       value: "from-red-500 to-rose-400",      preview: "bg-gradient-to-r from-red-500 to-rose-400" },
                         { name: "Cyan Blue",      value: "from-cyan-500 to-blue-400",     preview: "bg-gradient-to-r from-cyan-500 to-blue-400" },
                         { name: "Lime Green",     value: "from-lime-500 to-green-400",    preview: "bg-gradient-to-r from-lime-500 to-green-400" },
                         { name: "Orange Red",     value: "from-orange-500 to-red-400",    preview: "bg-gradient-to-r from-orange-500 to-red-400" }
                      // … add your other colors …
                    ].map((color) => (
                      <button
                        key={color.name}
                        onClick={() =>
                          setSelectedGoal({ ...selectedGoal, colorGradient: color.value })
                        }
                        className={`
                          h-12 rounded-lg transition-all duration-200 border-2 relative group
                          ${selectedGoal.colorGradient === color.value ? 'border-gray-800 scale-105 shadow-lg' : 'border-gray-200 hover:border-gray-400 hover:scale-105'}
                          ${color.preview}
                        `}
                        title={color.name}
                      >
                        {selectedGoal.colorGradient === color.value && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                              <Check className="w-4 h-4 text-gray-800" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goal Icon Selector */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Goal Icon</h3>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="grid grid-cols-8 gap-2">
                    {[

                          { icon: BookOpen },
    { icon: PenTool },
    { icon: BarChart2 },
    { icon: UserCheck },
    { icon: Clock },
    { icon: Headphones },
    { icon: MessageSquare },
    { icon: Lightbulb },
    { icon: Calculator },
    { icon: BookType },
    { icon: Brain },
    { icon: Globe },
    { icon: Palette },
    { icon: Wrench },
    { icon: Languages },
    { icon: Music }
                      // … add your other icons …
                    ].map(({ icon: IconComponent }, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setSelectedGoal({ ...selectedGoal, icon: IconComponent })
                        }
                        className={`aspect-square flex items-center justify-center border-2 rounded-lg transition ${
                          selectedGoal.icon === IconComponent ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className="w-7 h-7 text-black" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer with action button */}
              <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleSaveGoal}
                  className={`px-6 py-2 bg-gradient-to-r ${selectedGoal.colorGradient} hover:opacity-90 rounded-lg font-medium text-white transition-all duration-200`}
                >
                  Save Goal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
