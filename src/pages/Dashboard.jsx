// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Clock, MapPin, Users, FileText, X } from "lucide-react";

const planOptions = [
  "Individual Accommodation Plan (IAP)",
  "504 Plan",
  "English Language Learner (ELL) Plan",
  "General IEP",
  "Other",
];

// --- begin WeekAgenda ---
const WeekAgenda = () => {
  const today = new Date();
  const dayIndex = today.getDay(); // 0 = Sun
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayIndex);

  // build array of 7 dates for this week
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  // state for events and modals
  const [events, setEvents] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    description: "",
    location: "",
    guests: ""
  });

  // helpers
  const format = (d) => d.toISOString().slice(0, 10);
  const openAddModal = (date) => {
    setModalDate(date);
    setShowModal(true);
  };
  const openDetailModal = (ev, e) => {
    e.stopPropagation();
    setSelectedEvent(ev);
    setShowDetail(true);
  };
  const handleAddEvent = () => {
    if (!newEvent.title) return;
    const key = format(modalDate);
    const ev = {
      ...newEvent,
      id: Date.now(),
      time: newEvent.time || "All Day"
    };
    setEvents((prev) => ({
      ...prev,
      [key]: prev[key] ? [...prev[key], ev] : [ev]
    }));
    setNewEvent({ title: "", time: "", description: "", location: "", guests: "" });
    setShowModal(false);
    setModalDate(null);
  };

  return (
    <div className="space-y-4 flex-1 flex flex-col min-h-0">
        {/* 7‑day row */}
        <div className="grid grid-cols-7 gap-4 flex-1 min-h-0">
          {weekDates.map((d, i) => {
            const key = format(d);
            const isToday = key === format(today);
            const dayName = d.toLocaleDateString(undefined, { weekday: "short" });
            const dayNum = d.getDate();
    
            // Left-to-right gradient position calculation (0-6 columns)
            const progress = i / 6; // 7 days, so index 6 is max
            
            // Position-based colors for left-to-right gradient
            const getBorderColor = () => {
              if (progress < 0.17) return 'border-purple-500';
              if (progress < 0.33) return 'border-purple-400';
              if (progress < 0.5) return 'border-pink-400';
              if (progress < 0.67) return 'border-orange-400';
              if (progress < 0.83) return 'border-yellow-400';
              return 'border-yellow-500';
            };
    
            const getEventColor = () => {
              if (progress < 0.17) return 'from-purple-600 to-purple-500';
              if (progress < 0.33) return 'from-purple-500 to-pink-500';
              if (progress < 0.5) return 'from-pink-500 to-pink-400';
              if (progress < 0.67) return 'from-pink-400 to-orange-400';
              if (progress < 0.83) return 'from-orange-400 to-yellow-400';
              return 'from-yellow-400 to-yellow-500';
            };
    
            const getHoverColor = () => {
              if (progress < 0.17) return 'hover:shadow-purple-500/50 hover:border-purple-400';
              if (progress < 0.33) return 'hover:shadow-purple-400/50 hover:border-purple-300';
              if (progress < 0.5) return 'hover:shadow-pink-400/50 hover:border-pink-300';
              if (progress < 0.67) return 'hover:shadow-orange-400/50 hover:border-orange-300';
              if (progress < 0.83) return 'hover:shadow-yellow-400/50 hover:border-yellow-300';
              return 'hover:shadow-yellow-500/50 hover:border-yellow-400';
            };
    
            return (
              <div
                key={i}
                className={`
                p-4 rounded-2xl border-2 bg-white flex flex-col cursor-pointer h-full
                  transition-all duration-300 hover:scale-105 hover:shadow-xl
                  ${getBorderColor()} ${getHoverColor()}
                  ${isToday ? "ring-2 ring-pink-500 ring-offset-2" : ""}
                `}
                onClick={() => openAddModal(d)}
              >
                {/* header */}
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-lg text-gray-800">{dayName}</span>
                  <span className={`text-xl font-bold ${isToday ? 'text-pink-600' : 'text-gray-600'}`}>
                    {dayNum}
                  </span>
                </div>
    
                {/* events preview */}
                <div className="space-y-2 flex-1 overflow-auto">
                  {(events[key] || []).slice(0, 3).map(ev => (
                    <div
                      key={ev.id}
                      onClick={e => openDetailModal(ev, e)}
                      className={`
                        text-sm px-3 py-2 rounded-xl bg-gradient-to-r ${getEventColor()} 
                        text-white truncate cursor-pointer shadow-lg border border-white/20
                        hover:scale-105 transition-all duration-300
                      `}
                      title={ev.title}
                    >
                      {ev.time !== "All Day" && (
                        <span className="opacity-90 font-medium mr-1">{ev.time}</span>
                      )}
                      <span className="font-semibold">{ev.title}</span>
                    </div>
                  ))}
                  {(events[key] || []).length > 3 && (
                    <div className="text-sm text-gray-600 px-3 py-1 bg-gray-100 rounded-lg">
                      +{events[key].length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
    
        {/* — Add Event Modal — */}
        {showModal && modalDate && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 animate-in slide-in-from-bottom-4 zoom-in-95 duration-400"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Add Event</h3>
                    <p className="text-gray-600 mt-1">Create a new calendar event</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 group"
                  >
                    <X className="w-6 h-6 text-gray-600 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
    
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Event Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-lg"
                      placeholder="Enter event title"
                      value={newEvent.title}
                      onChange={e =>
                        setNewEvent(p => ({ ...p, title: e.target.value }))
                      }
                    />
                  </div>
    
                  {/* Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Time
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-lg"
                      value={newEvent.time}
                      onChange={e =>
                        setNewEvent(p => ({ ...p, time: e.target.value }))
                      }
                    />
                  </div>
    
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-lg"
                      placeholder="Add location"
                      value={newEvent.location}
                      onChange={e =>
                        setNewEvent(p => ({ ...p, location: e.target.value }))
                      }
                    />
                  </div>
    
                  {/* Guests */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Users className="w-4 h-4 inline mr-1" />
                      Guests (Optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-lg"
                      placeholder="Add guests"
                      value={newEvent.guests}
                      onChange={e =>
                        setNewEvent(p => ({ ...p, guests: e.target.value }))
                      }
                    />
                  </div>
    
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <FileText className="w-4 h-4 inline mr-1" />
                      Description (Optional)
                    </label>
                    <textarea
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-all duration-300 text-lg"
                      rows={3}
                      placeholder="Add description"
                      value={newEvent.description}
                      onChange={e =>
                        setNewEvent(p => ({ ...p, description: e.target.value }))
                      }
                    />
                  </div>
                </div>
    
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-8 py-4 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 font-semibold text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEvent}
                    disabled={!newEvent.title}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg font-semibold text-lg"
                  >
                    Save Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    
        {/* — Event Details Modal — */}
        {showDetail && selectedEvent && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
            onClick={() => setShowDetail(false)}
          >
            <div
              className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 animate-in slide-in-from-bottom-4 zoom-in-95 duration-400"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Event Details</h3>
                  </div>
                  <button
                    onClick={() => setShowDetail(false)}
                    className="p-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 group"
                  >
                    <X className="w-6 h-6 text-gray-600 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
    
                <div className="space-y-6">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">{selectedEvent.title}</h4>
                    {selectedEvent.time && selectedEvent.time !== "All Day" && (
                      <div className="flex items-center text-gray-600 mb-4">
                        <Clock className="w-5 h-5 mr-2" />
                        <span className="text-lg">{selectedEvent.time}</span>
                      </div>
                    )}
                  </div>
    
                  {selectedEvent.location && (
                    <div className="flex items-start text-gray-600">
                      <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-lg">{selectedEvent.location}</span>
                    </div>
                  )}
    
                  {selectedEvent.guests && (
                    <div className="flex items-start text-gray-600">
                      <Users className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-lg">{selectedEvent.guests}</span>
                    </div>
                  )}
    
                  {selectedEvent.description && (
                    <div className="flex items-start text-gray-600">
                      <FileText className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-lg">{selectedEvent.description}</span>
                    </div>
                  )}
                </div>
    
                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setShowDetail(false)}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg font-semibold text-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};
// --- end WeekAgenda ---


export default function Dashboard() {
  const [selectedPlan, setSelectedPlan] = useState("");

  return (
    <div className="flex h-screen font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 overflow-auto grid md:grid-cols-3 gap-8">
          {/* New Student Support Card */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:col-span-1">
            <h2 className="text-2xl font-bold mb-3 text-gray-800">New Student Support</h2>
            <p className="text-gray-600 mb-3">What type of plan is this?</p>
            <ul className="space-y-2">
              {planOptions.map((option) => (
                <li
                  key={option}
                  onClick={() => setSelectedPlan(option)}
                  className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedPlan === option
                      ? "bg-gradient-to-r from-pink-500 to-orange-500"
                      : "hover:bg-gradient-to-r hover:from-pink-500/50 hover:to-orange-500/50"
                  }`}
                >
                  {/* Custom radio circle */}
                  <div className="w-4 h-4 mr-3 rounded-full border border-gray-500 flex items-center justify-center">
                    {selectedPlan === option && (
                      <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                    )}
                  </div>
                  <span
                    className={`${selectedPlan === option ? "text-white" : "text-black"} whitespace-nowrap`}
                  >
                    {option}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  if (selectedPlan === "General IEP") {
                    window.location.href = "/new-student/info";
                  }
                }}
                className={`w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center transition-all duration-300 ${
                  selectedPlan === "General IEP"
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                }`}
                title="Create IEP"
              >
                <span className="text-xl font-bold text-white">+</span>
              </button>
            </div>
          </div>
          {/* Today's Agenda Card */}
{/* This Week's Agenda Card */}
<div className="bg-white rounded-2xl shadow-lg p-4 md:col-span-2 flex flex-col">
  <h2 className="text-2xl font-bold text-gray-800">This Week's Agenda</h2>
  <div className="mt-4 flex-1 min-h-0">
    <WeekAgenda />
  </div>
</div>
        </main>
      </div>
    </div>
  );
}
