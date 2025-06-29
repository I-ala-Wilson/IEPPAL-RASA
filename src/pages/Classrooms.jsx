// src/pages/Classrooms.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, Book, Brain, Clock, Plus, Edit3, Trash2, Users, Star, Palette, Languages, Wrench, Music, Globe, BookType,Target, X, BookOpen, Calendar, ClipboardList, Settings, Check, FileText, Edit2, PenTool, BarChart2, UserCheck, Headphones, MessageSquare, Lightbulb, } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { IEPContext } from "../context/IEPContext";
import DatePicker from 'react-datepicker'
import { parse, format } from 'date-fns'
import 'react-datepicker/dist/react-datepicker.css'




export default function Classrooms() {
  const navigate = useNavigate();
  const { iepReports } = useContext(IEPContext);
  const reports = iepReports || [];

  // Map of student IDs to their goals (now in state so we can update it)
const [goalsData, setGoalsData] = useState({
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
});


  // Classroom modal state
  const [showClassroomPopup, setShowClassroomPopup] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  // Student modal state
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showGoalDetail, setShowGoalDetail] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
   // which field is currently being edited inline
  const [editingGoalField, setEditingGoalField] = useState(null);

  // when you click “Save Goal” in the footer
  const handleSaveGoal = () => {
    setGoalsData(prev => {
      const sid = selectedGoal.studentId || selectedStudent.id;
      const existing = prev[sid] || [];
      const isEdit = existing.some(g => g.id === selectedGoal.id);
  
      const updated = isEdit
        // update the matching goal
        ? existing.map(g => g.id === selectedGoal.id ? selectedGoal : g)
        // or append a brand‑new one
        : [...existing, selectedGoal];
  
      return { ...prev, [sid]: updated };
    });
  
    setShowGoalDetail(false);
  };

    // ↓ new ↓
    const [textInputFocused, setTextInputFocused] = useState(false);

      // Add‐Student Modal State
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName,  setNewStudentName]  = useState("");
  const [newStudentGrade, setNewStudentGrade] = useState("");



const [showNoIEPPrompt, setShowNoIEPPrompt] = useState(false);



// IEP shit
const handleIEPClick = (studentId) => {

  // Check if student has an IEP (you'll need to implement this logic based on your data structure)
  const studentHasIEP = checkIfStudentHasIEP(studentId);
  
  if (studentHasIEP) {
    // Navigate to existing IEP
    openStudentIEP(studentId);
  } else {
    // Show the prompt to create new IEP
    setShowNoIEPPrompt(true);
  }
};

const handleCreateIEP = () => {
  setShowNoIEPPrompt(false);
  // Navigate to the new student info page
  navigate('/new-student/info', { 
    state: { 
      studentId: selectedStudent.id,
      studentName: selectedStudent.studentName 
    }
  });
};

// You'll need to implement this function based on your data structure
const checkIfStudentHasIEP = (studentId) => {
  // Example logic - replace with your actual IEP checking logic
  return selectedStudent.hasIEP || false;
};

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
  

    const handleColorChange = (colorValue) => {
      setSelectedGoal(prev => ({
        ...prev,
        colorGradient: colorValue
      }));
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
    setSelectedGoal({
      ...goal,
      // if goal.colorGradient isn’t set, fall back to goal.color
      colorGradient: goal.colorGradient ?? goal.color
    });
    setShowGoalDetail(true);
  };
  
// just below your other hooks:
const [showDocModal, setShowDocModal] = useState(false)
const [docUploaded, setDocUploaded]    = useState(false)
const [isUploading, setIsUploading]    = useState(false)

// copy into component:
const handleDocUpload = e => {
  const file = e.target.files[0]
  if (file?.type === "application/pdf") {
    setIsUploading(true)
    setTimeout(() => {
      setDocUploaded(true)
      setIsUploading(false)
      setShowDocModal(false)
    }, 1500)
  } else {
    alert("Please select a PDF file.")
  }
}



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
    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-xl ..."
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
  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg"
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
                {/* after */}
<button
  onClick={() => {
    // build a fresh blank-goal only when clicked
    const newGoal = {
      id: Date.now(),
      title: "",
      class:
        customClasses[selectedClassroom]?.name ||
        `Classroom ${selectedClassroom}`,
        startDate: null,
      description: "",
      strategies: [],
      standards: [],
      colorGradient: "from-pink-500 to-rose-400",
      icon: Target,
      studentId: selectedStudent.id,
    };
    setSelectedGoal(newGoal);
    setShowGoalDetail(true);
  }}
  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all"
>
  Add New Goal
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
  {/* Black title above IEP box */}
  <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedStudent.studentName}'s IEP</h2>
  
  
  
  
{/* STUDENT'S IEP */}
<div     
  className="w-full mb-6 p-8 bg-gradient-to-br from-pink-500 via-rose-400 to-pink-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all duration-300 ease-out border border-white/10"     
  onClick={() => handleIEPClick(selectedStudent.id)} 
>     
  <div className="flex items-center relative">    
    {/* Subtle background pattern */}    
    <div className="absolute inset-0 bg-white/5 rounded-2xl"></div>         
    
    {/* Icon on the left */}    
    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6 backdrop-blur-sm flex-shrink-0 relative z-10">      
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">        
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />      
      </svg>    
    </div>         
    
    {/* Text content */}    
    <div className="flex-1 relative z-10">      
      <h3 className="text-2xl font-bold mb-2 tracking-wide">        
        {selectedStudent.studentName}'s IEP      
      </h3>      
      <p className="text-white/85 text-lg font-medium">        
        {selectedStudent.hasIEP ? 'Click to view or edit IEP details' : 'Click to create an IEP'}      
      </p>    
    </div>  
  </div>
</div>

{/* No IEP Modal/Alert */}
{showNoIEPPrompt && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300">
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">No IEP Found</h3>
        <p className="text-gray-600 mb-6">
          {selectedStudent.studentName} doesn't have an IEP yet. Would you like to create one now?
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowNoIEPPrompt(false)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateIEP}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Create IEP
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* ADD SUPPORTING DOCUMENT BANNER */}
<div
  className="w-full mb-8 p-8 bg-gradient-to-br from-pink-400 via-purple-400 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all duration-300 ease-out border border-white/10"
  onClick={() => setShowDocModal(true)}
>
  <div className="flex items-center relative">
    {/* faint background pattern */}
    <div className="absolute inset-0 bg-white/10 rounded-2xl"></div>

    {/* icon on the left */}
    <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6">
      {docUploaded ? (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4"/>
        </svg>
      ) : (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6M15 13l-3-3m0 0l-3 3m3-3v12"/>
        </svg>
      )}
    </div>

    {/* text content */}
    <div className="relative z-10 flex-1">
      <h3 className="text-2xl font-bold mb-2 tracking-wide">
        {docUploaded ? "View Document" : "Add Supporting Document"}
      </h3>
      <p className="text-white/90 text-lg">
        {docUploaded
          ? "Your file has been successfully attached."
          : "Upload assessment reports, evaluations, or other PDFs."}
      </p>
    </div>
  </div>
</div>


  {/* Active Goals section - moved below IEP */}
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
      <div key={goal.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Goal Header */}
        <div className={`bg-gradient-to-r ${goal.colorGradient || goal.color} p-8 relative overflow-hidden`}>
          {/* Preserved: Large faded icon in top right */}
          <div className="absolute top-4 right-4 opacity-20 transform rotate-12">
            <Icon className="w-16 h-16 text-white" />
          </div>
          
          <div className="relative">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mb-2">
              <span className="text-white text-lg font-semibold opacity-90">
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
                  <div className={`w-6 h-6 bg-gradient-to-r ${goal.colorGradient || goal.color} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <span className="text-white text-xs font-bold">{i + 1}</span>
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
            {goal.strategies.map((strategy, idx) => {
  // reuse the same gradient you used in the header
  const gradient = goal.colorGradient || goal.color;
  return (
    <span
      key={idx}
      className={`px-4 py-2 rounded-xl bg-gradient-to-r ${gradient} text-white`}
    >
      {strategy}
    </span>
  );
})}

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button 
              onClick={() => openGoalDetail(goal)}
              className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 hover:shadow-md transition-all duration-200"
            >
              View Details
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
                  <button
    onClick={() => {
      // build a fresh blank‐goal only when clicked
      const newGoal = {
        id: Date.now(),
       title: "",
       className:
          customClasses[selectedClassroom]?.name ||
          `Classroom ${selectedClassroom}`,
          startDate: null,
        description: "",
        strategies: [],
        standards: [],
        colorGradient: "from-pink-500 to-rose-400",
        icon: Target,
       studentId: selectedStudent.id,
      };
      setSelectedGoal(newGoal);
      setShowGoalDetail(true);
    }}
    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all text-lg"
  >
    Create First Goal
  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

{/* ─── Fullscreen Goal Details Modal ─── */}
{showGoalDetail && selectedGoal && (
  <div 
    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 overflow-auto p-4 md:p-8"
    onClick={closeGoalDetail} // Close when clicking backdrop
  >
    <div 
      className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
    >
      {/* Header with gradient matching sidebar */}
      <div className={`bg-gradient-to-r ${selectedGoal.colorGradient || 'from-pink-500 to-orange-500'} p-6`}>
        <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
    {(() => {
      const Icon = selectedGoal.icon || Target;
      return <Icon className="w-5 h-5 text-white" />;
    })()}
  </div>
  <div className="flex-1">
    {editingGoalField === 'title' 
      ? <input
          type="text"
          value={selectedGoal.title}
          onChange={e => setSelectedGoal({ ...selectedGoal, title: e.target.value })}
          onBlur={() => setEditingGoalField(null)}
          className="w-full text-2xl font-bold text-white bg-white/20 rounded p-1"
        />
    : <h2 className="text-2xl font-bold text-white">
         {selectedGoal.title}
       </h2>
   }
  </div>
  <button
    onClick={() => setEditingGoalField('title')}
    className="p-1 hover:bg-white/20 rounded"
  >
    <Edit2 className="w-5 h-5 text-white/80" />
  </button>
</div>
          <button
            onClick={closeGoalDetail}
            className="w-8 h-8 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Body with improved layout */}
      <div className="p-8 space-y-6">
        {/* Quick Info Cards - removed pink borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  <div className={`bg-gradient-to-br ${selectedGoal.colorGradient || 'from-pink-500 to-orange-400'} rounded-xl p-4`}>
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
      ? format(parse(selectedGoal.startDate, 'MMMM d, yyyy', new Date()), 'dd/MM/yyyy')
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

  <div className={`bg-gradient-to-br ${selectedGoal.colorGradient || 'from-pink-500 to-orange-400'} rounded-xl p-4`}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-white">Class Name</h3>
        {editingGoalField === 'class' ? (
       <input
        type="text"
         value={selectedGoal.class || ''}
         onChange={e =>
           setSelectedGoal({
             ...selectedGoal,
             class: e.target.value
           })
        }
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
          setSelectedGoal({
            ...selectedGoal,
            description: e.target.value
          })
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
            onClick={() => {
              const arr = selectedGoal.standards.filter((_, i) => i !== idx);
              setSelectedGoal({ ...selectedGoal, standards: arr });
            }}
            className="text-red-500 font-bold"
          >
            ×
          </button>
        </div>
      ))}

      {/* Add new standard */}
      <button
        onClick={() =>
          setSelectedGoal(prev => ({
            ...prev,
            standards: [...prev.standards, '']
          }))
        }
        className="self-start px-4 py-1 bg-blue-50 rounded text-sm"
      >
        + Add Standard
      </button>

      {/* Done editing */}
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
              selectedGoal.colorGradient || 'from-pink-500 to-orange-500'
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
            onClick={() => {
              const arr = selectedGoal.strategies.filter((_, i) => i !== idx);
              setSelectedGoal({ ...selectedGoal, strategies: arr });
            }}
            className="text-red-500 font-bold"
          >
            ×
          </button>
        </div>
      ))}

      {/* add new strategy */}
      <button
        onClick={() =>
          setSelectedGoal(prev => ({
            ...prev,
            strategies: [...prev.strategies, '']
          }))
        }
        className="self-start px-4 py-1 bg-blue-50 rounded text-sm"
      >
        + Add Strategy
      </button>

      {/* done editing */}
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
              selectedGoal.colorGradient || 'from-orange-500 to-pink-500'
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



        {/* Goal Color Selector - moved to bottom */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-800">Goal Color</h3>
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
            {[
              { name: "Pink Rose", value: "from-pink-500 to-rose-400", preview: "bg-gradient-to-r from-pink-500 to-rose-400" },
              { name: "Purple Violet", value: "from-violet-500 to-purple-400", preview: "bg-gradient-to-r from-violet-500 to-purple-400" },
              { name: "Blue Indigo", value: "from-blue-500 to-indigo-400", preview: "bg-gradient-to-r from-blue-500 to-indigo-400" },
              { name: "Emerald Teal", value: "from-emerald-500 to-teal-400", preview: "bg-gradient-to-r from-emerald-500 to-teal-400" },
              { name: "Amber Yellow", value: "from-amber-500 to-yellow-400", preview: "bg-gradient-to-r from-amber-500 to-yellow-400" },
              { name: "Red Rose", value: "from-red-500 to-rose-400", preview: "bg-gradient-to-r from-red-500 to-rose-400" },
              { name: "Cyan Blue", value: "from-cyan-500 to-blue-400", preview: "bg-gradient-to-r from-cyan-500 to-blue-400" },
              { name: "Lime Green", value: "from-lime-500 to-green-400", preview: "bg-gradient-to-r from-lime-500 to-green-400" },
              { name: "Orange Red", value: "from-orange-500 to-red-400", preview: "bg-gradient-to-r from-orange-500 to-red-400" }
            ].map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorChange(color.value)}
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

        {/* Goal Icon Selector - moved to last position */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-800">Goal Icon</h3>
            </div>
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
            ].map(({ icon: Icon }, i) => (
              <button
   key={i}
   onClick={() =>
     setSelectedGoal(prev => ({ ...prev, icon: Icon }))
   }
   className={`
     aspect-square flex items-center justify-center
     border-2 rounded-lg transition
     ${selectedGoal.icon === Icon
       ? 'border-blue-500'
       : 'border-gray-200 hover:border-gray-300'}
   `}
 >
                <Icon className="w-7 h-7 text-black" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with action buttons */}
      <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
        <div className="flex justify-end">
        <button
   onClick={handleSaveGoal}
   className={`px-6 py-2 bg-gradient-to-r ${selectedGoal.colorGradient || 'from-pink-500 to-orange-500'} hover:opacity-90 rounded-lg font-medium text-white transition-all duration-200`} >
   Save Goal
 </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* Enhanced Modal */}
{showDocModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowDocModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 animate-in zoom-in duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 via-pink-500 to-red-500 shadow-lg shadow-pink-300/50 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Upload PDF Document
              </h3>
              <p className="text-slate-600">
                Select a PDF file to add as supporting documentation
              </p>
            </div>

            <div className="mb-6">
              <label className="block">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleDocUpload}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-50 file:to-purple-50 file:text-blue-700 hover:file:bg-gradient-to-r hover:file:from-blue-100 hover:file:to-purple-100 file:cursor-pointer file:transition-all file:duration-300"
                  disabled={isUploading}
                />
              </label>
            </div>

            {isUploading && (
              <div className="mb-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-slate-600">Uploading...</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowDocModal(false)}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors duration-200"
                disabled={isUploading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}



      </div>
       );
      }
      