// src/pages/Classrooms.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, Book, Brain, Clock, Plus, Edit3, Trash2, Users, Palette, Languages, Wrench, Music, Globe, BookType,} from "lucide-react";
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

    // ↓ new ↓
    const [textInputFocused, setTextInputFocused] = useState(false);

      // Add‐Student Modal State
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName,  setNewStudentName]  = useState("");
  const [newStudentGrade, setNewStudentGrade] = useState("");


  // NEW: Add Class Modal State
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [selectedColor, setSelectedColor] = useState("from-pink-500 to-rose-400");

  // NEW: Edit Class Modal State
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [editingClassName, setEditingClassName] = useState("");
  const [editingClassColor, setEditingClassColor] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  

    // Icon picker state
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [customIconText, setCustomIconText] = useState("");
  
    const saveNewStudent = () => {
      if (!newStudentName.trim() || !newStudentGrade.trim()) return;
  
      const newStudent = {
        studentName: newStudentName.trim(),
        grade: newStudentGrade.trim(),
        // give it a unique ID
        id: Date.now()
      };
  
      setCustomClasses(prev => {
        const roomKey = selectedClassroom;
        // if this room already has a customClasses entry, append
        // otherwise turn it into one (with existing students)
        const existing = prev[roomKey] || {
          name:      customClasses[roomKey]?.name || `Classroom ${roomKey}`,
          color:     customClasses[roomKey]?.color || getCardColor(roomKey,0),
          students:  grouped[roomKey] || [],     // fall back to whatever was there
          iconName:  customClasses[roomKey]?.iconName,
          iconText:  customClasses[roomKey]?.iconText
        };
  
        return {
          ...prev,
          [roomKey]: {
            ...existing,
            students: [...existing.students, newStudent]
          }
        };
      });
  
      // reset & close
      setNewStudentName("");
      setNewStudentGrade("");
      setShowAddStudentModal(false);
    };
  

    // Available icon choices
    const iconOptions = [
      { name: "Calculator", Icon: Calculator },
{ name: "Book",       Icon: BookType },
{ name: "Brain",      Icon: Brain },
{ name: "Globe",      Icon: Globe },       // was Clock
{ name: "Palette",    Icon: Palette },
{ name: "Wrench",     Icon: Wrench },      // was Users
{ name: "Languages",  Icon: Languages },   // was Trash
{ name: "Music",      Icon: Music }        // was Edit3
    ];  

  // NEW: Custom Classes State
  const [customClasses, setCustomClasses] = useState({});

  const [searchTerm, setSearchTerm] = useState("");

  // NEW: Available color gradients for class cards
  const colorOptions = [
    { name: "Pink Rose", value: "from-pink-500 to-rose-400", preview: "bg-gradient-to-r from-pink-500 to-rose-400" },
    { name: "Purple Violet", value: "from-violet-500 to-purple-400", preview: "bg-gradient-to-r from-violet-500 to-purple-400" },
    { name: "Blue Indigo", value: "from-blue-500 to-indigo-400", preview: "bg-gradient-to-r from-blue-500 to-indigo-400" },
    { name: "Emerald Teal", value: "from-emerald-500 to-teal-400", preview: "bg-gradient-to-r from-emerald-500 to-teal-400" },
    { name: "Amber Yellow", value: "from-amber-500 to-yellow-400", preview: "bg-gradient-to-r from-amber-500 to-yellow-400" },
    { name: "Red Rose", value: "from-red-500 to-rose-400", preview: "bg-gradient-to-r from-red-500 to-rose-400" },
    { name: "Cyan Blue", value: "from-cyan-500 to-blue-400", preview: "bg-gradient-to-r from-cyan-500 to-blue-400" },
    { name: "Lime Green", value: "from-lime-500 to-green-400", preview: "bg-gradient-to-r from-lime-500 to-green-400" },
    { name: "Orange Red", value: "from-orange-500 to-red-400", preview: "bg-gradient-to-r from-orange-500 to-red-400" },
  ];

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

// NEW: Updated to include custom classes without duplicates
const grouped = {};
const defaultRooms = ["A", "B", "C", "D", "E", "F", "G", "H"];

// helper to merge in only those custom-added students whose IDs aren't already present
function mergedStudents(room) {
  const base = getAllStudentsForRoom(room);
  const customList = customClasses[room]?.students || [];
  const extra = customList.filter(s => !base.some(b => b.id === s.id));
  return [...base, ...extra];
}

// 1) seed every default room (even if empty)
defaultRooms.forEach(room => {
  grouped[room] = mergedStudents(room);
});

// 2) overlay any extra custom rooms beyond A–H
Object.keys(customClasses)
  .filter(r => !defaultRooms.includes(r))
  .forEach(room => {
    grouped[room] = mergedStudents(room);
  });

// 3) build render-order: A–H first, then any extras
const allRooms = [
  ...defaultRooms,
  ...Object.keys(customClasses).filter(r => !defaultRooms.includes(r))
];

  const getCardColor = (room, index) => {
    // If it's a custom class, use its assigned color
    if (customClasses[room]) {
      return customClasses[room].color;
    }
    // Otherwise use the default color rotation
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

  // NEW: Add Class Functions
  const openAddClassModal = () => {
    setShowAddClassModal(true);
    setNewClassName("");
    setSelectedColor("from-pink-500 to-rose-400");
  };

  const closeAddClassModal = () => {
    setShowAddClassModal(false);
    setNewClassName("");
    setSelectedColor("from-pink-500 to-rose-400");
  };

  const saveNewClass = () => {
    if (newClassName.trim()) {
      const classKey = newClassName.trim().toUpperCase().replace(/\s+/g, '_');
      setCustomClasses(prev => ({
        ...prev,
        [classKey]: {
          name: newClassName.trim(),
          color: selectedColor,
          students: [],
          iconName: null,
          iconText: ""
        }
      }));
      closeAddClassModal();
    }
  };


  // NEW: Edit Class Functions
  const openEditClassModal = (room) => {
    setSelectedClassroom(room);
    setEditingClassName(customClasses[room]?.name || `Classroom ${room}`);
    setEditingClassColor(customClasses[room]?.color || getCardColor(room, 0));
    // ← Initialize the icon picker
    setSelectedIcon(customClasses[room]?.iconName || null);
    setCustomIconText(customClasses[room]?.iconText || "");
    setShowEditClassModal(true);
  };


  const closeEditClassModal = () => {
    setShowEditClassModal(false);
    setSelectedClassroom(null);
    setEditingClassName("");
    setEditingClassColor("");
    setShowDeleteConfirm(false);
  };

  const saveClassChanges = () => {
    if (editingClassName.trim() && selectedClassroom) {
      if (customClasses[selectedClassroom]) {
        // Update existing custom class
        setCustomClasses(prev => ({
          ...prev,
          [selectedClassroom]: {
            ...prev[selectedClassroom],
            name: editingClassName.trim(),
            color: editingClassColor,
            iconName: selectedIcon,
            iconText: customIconText
          }
        }));
      } else {
        // Convert default class to custom class
        const classKey = selectedClassroom;
        setCustomClasses(prev => ({
          ...prev,
          [classKey]: {
            name: editingClassName.trim(),
            color: editingClassColor,
            students: getAllStudentsForRoom(classKey),
            iconName: selectedIcon,
            iconText: customIconText
          }
        }));
      }
      closeEditClassModal();
    }
  };

  const deleteClass = () => {
    if (selectedClassroom && customClasses[selectedClassroom]) {
      setCustomClasses(prev => {
        const updated = { ...prev };
        delete updated[selectedClassroom];
        return updated;
      });
      closeEditClassModal();
    }
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
          {/* NEW: Updated header with Add Class button */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Classrooms</h1>
            <button
              onClick={openAddClassModal}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Add Class</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allRooms.map((room, idx) => (
              <div key={room} className="flex flex-col h-full bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300">
                <div className={`bg-gradient-to-r ${getCardColor(room, idx)} rounded-t-2xl p-6`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-white">
                        {customClasses[room]?.name || `Classroom ${room}`}
                      </h2>
                      <p className="text-white text-opacity-80 mt-1 text-sm">
                        {grouped[room]?.length || 0} {grouped[room]?.length === 1 ? 'student' : 'students'}
                      </p>
                    </div>
                    {/* NEW: Edit button for each class */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditClassModal(room);
                      }}
                      className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                                {/* CARD BODY */}
                                <div className="flex-1 p-4">
                  {grouped[room]?.length > 0 ? (
                    <div className="space-y-3">
                      {grouped[room].slice(0, 3).map(student => (
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
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No students yet</p>
                    </div>
                  )}
                </div>

                {/* CARD FOOTER BUTTON */}
                <div className="mt-auto px-4 pb-4">
                  {grouped[room]?.length > 0 ? (
                    <button
                      onClick={() => openClassroomPopup(room)}
                      className="w-full py-2 px-4 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition"
                    >
                      See Full Class
                    </button>
                  ) : (
                    <button
                    onClick={() => openClassroomPopup(room)}
                      className="w-full py-2 px-4 rounded-xl bg-pink-100 text-pink-600 text-sm font-medium hover:bg-pink-200 transition"
                    >
                      Add Students
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEW: Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-400 p-8 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Add New Class</h2>
                </div>
                <button 
                  onClick={closeAddClassModal}
                  className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Class Name Input */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-800 mb-4">Class Name</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Enter class name..."
                  className="w-full p-4 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Color Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-800 mb-4">Choose Color Theme</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {colorOptions.map((color) => (
                    <div
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all ${
                        selectedColor === color.value 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-full h-16 rounded-xl ${color.preview} mb-3`}></div>
                      <p className="text-sm font-medium text-gray-700 text-center">{color.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {newClassName && (
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-gray-800 mb-4">Preview</label>
                  <div className="bg-white rounded-2xl shadow-md">
                    <div className={`bg-gradient-to-r ${selectedColor} rounded-t-2xl p-6`}>
                      <h3 className="text-2xl font-semibold text-white">{newClassName}</h3>
                      <p className="text-white text-opacity-80 mt-1 text-sm">0 students</p>
                    </div>
                    <div className="p-4">
                      <div className="py-8 text-center">
                        <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500">Ready for students</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button 
                  onClick={closeAddClassModal}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveNewClass}
                  disabled={!newClassName.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Create Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Full Class View Modal (Enhanced) */}
      {showClassroomPopup && selectedClassroom && (
        <div className="fixed inset-0 bg-gray-50 z-50 overflow-auto">
          {/* Header Bar */}
          <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={closeClassroomPopup}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm font-medium">Back to Classrooms</span>
                  </button>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <div className="flex items-center space-x-4">
                  <div
  className={`w-16 h-16 rounded-full bg-gradient-to-r ${getCardColor(selectedClassroom, 0)} flex items-center justify-center text-white`}
>
  {customClasses[selectedClassroom]?.iconName
    ? React.createElement(
        iconOptions.find(o => o.name === customClasses[selectedClassroom].iconName).Icon,
        { className: "w-8 h-8" }
      )
    : customClasses[selectedClassroom]?.iconText
    ? <span className="text-xl">{customClasses[selectedClassroom].iconText}</span>
    : (customClasses[selectedClassroom]?.name || `Classroom ${selectedClassroom}`)
        .charAt(0)}
</div>

                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {customClasses[selectedClassroom]?.name || `Classroom ${selectedClassroom}`}
                      </h1>
                      <p className="text-gray-600">{filteredStudents.length} students</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => {
                      closeClassroomPopup();
                      openEditClassModal(selectedClassroom);
                    }}
                    className="flex items-center space-x-2 px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Class</span>
                  </button>
                    <button
    onClick={() => setShowAddStudentModal(true)}
    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-xl ..."
  >
    Add Student
  </button>
                </div>
              </div>
            </div>
          </div>
                  

          {showAddStudentModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
      <h2 className="text-xl font-semibold mb-6">Add New Student</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Name</label>
        <input
          type="text"
          value={newStudentName}
          onChange={e => setNewStudentName(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          placeholder="Student’s full name"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Grade</label>
        <input
          type="text"
          value={newStudentGrade}
          onChange={e => setNewStudentGrade(e.target.value)}
          className="w-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 3"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setShowAddStudentModal(false)}
          className="px-6 py-2 text-gray-600 rounded-xl hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={saveNewStudent}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-xl"
        >
         Add
        </button>

      </div>
    </div>
  </div>
)}

          {/* Search Bar */}
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Students Grid */}
          <div className="max-w-7xl mx-auto px-8 pb-8">
            {filteredStudents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => openStudentPopup(student)}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                  >
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 flex items-center justify-center text-white text-xl font-bold">
                          {student.studentName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{student.studentName}</h3>
                          <p className="text-gray-500">Grade {student.grade}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Goals:</span>
                          <span className="font-medium text-gray-800">
                            {goalsData[student.id]?.length || 0}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[40vh]">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No students found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm ? 'Try adjusting your search terms.' : 'This classroom is empty.'}
                  </p>
                  <button
    onClick={() => setShowAddStudentModal(true)}
    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-400 ..."
  >
    Add First Student
  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEW: Edit Class Modal */}
      {showEditClassModal && selectedClassroom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${editingClassColor} p-8 rounded-t-3xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
  { selectedIcon
      ? React.createElement(iconOptions.find(o=>o.name===selectedIcon).Icon, { className:"w-6 h-6 text-white" })
      : customIconText
      ? <span className="text-lg">{customIconText}</span>
      : <Edit3 className="w-6 h-6 text-white" /> }
</div>

                  <h2 className="text-2xl font-bold text-white">Edit Class</h2>
                </div>
                <button 
                  onClick={closeEditClassModal}
                  className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Class Name Input */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-800 mb-4">Class Name</label>
                <input
                  type="text"
                  value={editingClassName}
                  onChange={(e) => setEditingClassName(e.target.value)}
                  placeholder="Enter class name..."
                  className="w-full p-4 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Color Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-800 mb-4">Color Theme</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {colorOptions.map((color) => (
                    <div
                      key={color.value}
                      onClick={() => setEditingClassColor(color.value)}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all ${
                        editingClassColor === color.value 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-full h-16 rounded-xl ${color.preview} mb-3`}></div>
                      <p className="text-sm font-medium text-gray-700 text-center">{color.name}</p>
                    </div>
                  ))}
                </div>
              </div>

{/* Class Icon Picker */}
<div className="mb-8">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Class Icon</h3>

  {/* 2×4 grid of larger square icon buttons */}
  <div className="grid grid-cols-8 gap-3 mb-4">
    {iconOptions.map(({ name, Icon }) => (
      <button
        key={name}
        type="button"
        onClick={() => {
          setSelectedIcon(name);
          setCustomIconText("");
          setTextInputFocused(false);
        }}
        className={`
          w-16 h-16 
          flex items-center justify-center 
          rounded-xl border-2 transition
          ${selectedIcon === name && !textInputFocused
            ? "border-blue-500"
            : "border-gray-200 hover:border-gray-300"}
        `}
      >
        <Icon className="w-8 h-8 text-gray-700" />
      </button>
    ))}
  </div>

  {/* Text input underneath */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Or enter up to 3 characters
    </label>
    <input
      type="text"
      maxLength={3}
      value={customIconText}
      onFocus={() => setTextInputFocused(true)}
      onBlur={() => setTextInputFocused(false)}
      onChange={e => {
        setCustomIconText(e.target.value);
        setSelectedIcon(null);
      }}
      placeholder="e.g. 🏫"
      className={`
        w-28 p-2 
        border-2 border-gray-300 
        rounded-lg outline-none transition
        focus:border-blue-500 focus:ring-2 focus:ring-blue-200
      `}
    />
  </div>
</div>




              {/* Students List */}
              {grouped[selectedClassroom] && grouped[selectedClassroom].length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Students in Class</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {grouped[selectedClassroom].map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
                            {student.studentName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{student.studentName}</p>
                            <p className="text-sm text-gray-500">Grade {student.grade}</p>
                          </div>
                        </div>
                        <button className="text-red-500 hover:text-red-700 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Danger Zone */}
              {customClasses[selectedClassroom] && (
                <div className="mb-8 p-6 border border-red-200 rounded-2xl bg-red-50">
                  <h3 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h3>
                  <p className="text-red-700 mb-4">
                    Deleting this class will remove it permanently. Students will not be deleted, but they will need to be reassigned to other classes.
                  </p>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Class</span>
                  </button>
                </div>
              )}

              {/* Delete Confirmation */}
              {showDeleteConfirm && (
                <div className="mb-8 p-6 border-2 border-red-300 rounded-2xl bg-red-100">
                  <h3 className="text-lg font-bold text-red-800 mb-4">⚠️ Confirm Deletion</h3>
                  <p className="text-red-700 mb-6">
                    Are you absolutely sure you want to delete "{editingClassName}"? This action cannot be undone.
                  </p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={deleteClass}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      Yes, Delete Forever
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button 
                  onClick={closeEditClassModal}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveClassChanges}
                  disabled={!editingClassName.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div> 
        </div>
      )}
            {/* STUDENT POPUP */}
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
                      <p className="text-gray-600">
                        Grade {selectedStudent.grade} • Student Dashboard
                      </p>
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
            {goalsData[selectedStudent.id] && goalsData[selectedStudent.id].length > 0 ? (
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
                    {goalsData[selectedStudent.id].map((goal) => {
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
                              <h4 className="text-lg font-semibold text-gray-800 mb-4">
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
                              <h4 className="text-lg font-semibold text-gray-800 mb-4">
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
                                className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                              >
                                View Details
                              </button>
                              <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                                Track Progress
                              </button>
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
      