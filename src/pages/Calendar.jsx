import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Clock, MapPin, Users, FileText, Calendar as CalendarIcon } from "lucide-react";
import Sidebar from "../components/Sidebar"; 

// Simplified Navbar component
const Navbar = ({ isVisible }) => (
  <div className={`bg-white shadow-lg border-b border-gray-200 px-8 py-6 transition-all duration-1000 ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
  }`}>
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg">
      <CalendarIcon className="w-8 h-8 text-white" />
      </div>
      <div>
        <h1 className="text-4xl font-bold text-black">
          Calendar
        </h1>
      </div>
    </div>
  </div>
);

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    description: "",
    location: "",
    guests: ""
  });

  // Animation states
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [showCalendarGrid, setShowCalendarGrid] = useState(false);
  const [showDays, setShowDays] = useState(false);
  // New: track when the initial days animation has finished
  const [daysAnimationComplete, setDaysAnimationComplete] = useState(false);


  useEffect(() => {
    // Staggered animation sequence
    const timer1 = setTimeout(() => setIsLoaded(true), 100);
    const timer2 = setTimeout(() => setShowHeader(true), 300);
    const timer3 = setTimeout(() => setShowCalendarGrid(true), 600);
    const timer4 = setTimeout(() => setShowDays(true), 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

   // Once showDays is true, after ~1.5s mark the animation complete
   useEffect(() => {
    if (!showDays) return;
    const cleanup = setTimeout(() => {
      setDaysAnimationComplete(true);
    }, 1500);
    return () => clearTimeout(cleanup);
  }, [showDays]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getDateString = (day) => {
    if (!day) return null;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEventsForDate = (day) => {
    const dateString = getDateString(day);
    return events[dateString] || [];
  };

  const getPositionBasedBorderColor = (row, col) => {
    // Calculate position in grid (0 to 1 for both x and y)
    const x = col / 6; // 7 columns, so max index is 6
    const y = row / 5; // Approximate 6 rows, so max index is 5
    
    // Create gradient from purple (top-left) to yellow (bottom-right)
    const progress = (x + y) / 2;
    
    if (progress < 0.2) return 'border-purple-500';
    if (progress < 0.4) return 'border-purple-400';
    if (progress < 0.6) return 'border-pink-400';
    if (progress < 0.8) return 'border-orange-400';
    return 'border-yellow-400';
  };

  const getPositionBasedEventColor = (row, col) => {
    const x = col / 6;
    const y = row / 5;
    const progress = (x + y) / 2;
    
    if (progress < 0.2) return 'from-purple-600 to-purple-500';
    if (progress < 0.4) return 'from-purple-500 to-pink-500';
    if (progress < 0.6) return 'from-pink-500 to-pink-400';
    if (progress < 0.8) return 'from-pink-400 to-orange-400';
    return 'from-orange-400 to-yellow-400';
  };

  const getPositionBasedHover = (row, col) => {
    const x = col / 6;
    const y = row / 5;
    const progress = (x + y) / 2;
    
    if (progress < 0.2) return 'hover:shadow-purple-500/50 hover:border-purple-400';
    if (progress < 0.4) return 'hover:shadow-purple-400/50 hover:border-purple-300';
    if (progress < 0.6) return 'hover:shadow-pink-400/50 hover:border-pink-300';
    if (progress < 0.8) return 'hover:shadow-orange-400/50 hover:border-orange-300';
    return 'hover:shadow-yellow-400/50 hover:border-yellow-300';
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title) return;

    const dateString = getDateString(selectedDate);
    const eventWithId = {
      ...newEvent,
      id: Date.now(),
      time: newEvent.time || "All Day"
    };

    setEvents(prev => ({
      ...prev,
      [dateString]: [...(prev[dateString] || []), eventWithId]
    }));

    setNewEvent({
      title: "",
      time: "",
      description: "",
      location: "",
      guests: ""
    });
    setShowEventModal(false);
    setSelectedDate(null);
  };

  const handleDateClick = (day) => {
    if (!day) return;
    setSelectedDate(day);
    setShowEventModal(true);
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const days = getDaysInMonth(currentDate);
  
  // Calculate the number of weeks needed
  const totalCells = days.length;
  const weeksNeeded = Math.ceil(totalCells / 7);

  return (
    <div className="flex h-screen font-sans bg-white overflow-hidden">
            {/* —– sidebar wrapper —– */}
            <div>
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Navbar isVisible={isLoaded} />
        <main className={`flex-1 p-8 overflow-auto bg-gray-50 transition-all duration-1000 delay-200 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
        <div className={`bg-white rounded-3xl shadow-2xl flex flex-col border border-gray-200 transition-all duration-1000 delay-400 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
            {/* Calendar Header */}
            <div className={`flex items-center justify-between p-8 border-b border-gray-200 transition-all duration-800 delay-500 ${
              showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="flex items-center space-x-6">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl p-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-3 rounded-xl hover:bg-gray-200 transition-all duration-300 group"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-3 rounded-xl hover:bg-gray-200 transition-all duration-300 group"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid Container */}
            <div className={`flex-1 p-8 flex flex-col min-h-0 transition-all duration-800 delay-700 ${
              showCalendarGrid ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-4 mb-6">
              {daysOfWeek.map((day, index) => (
  <div 
    key={day} 
    className={`text-left text-black font-bold py-3 text-lg transition-all duration-600 ${
      showCalendarGrid ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`}
    style={{ transitionDelay: `${800 + index * 50}ms` }}
  >
    {day}
  </div>
))}

              </div>

              {/* Calendar Days - Fixed height grid with proper proportions */}
              <div className={`grid grid-cols-7 gap-4 flex-1`} style={{ gridTemplateRows: `repeat(${weeksNeeded}, 1fr)` }}>
              {days.map((day, index) => {
  const row = Math.floor(index / 7);
  const col = index % 7;
  return (
    <div
      key={index}
      className={`p-4 rounded-2xl border-2 transition-all duration-300 min-h-[120px] ${
        day
          ? `${getPositionBasedBorderColor(row, col)} hover:border-opacity-80 cursor-pointer hover:shadow-xl ${getPositionBasedHover(row, col)} bg-white hover:bg-gray-50 hover:scale-105`
          : 'border-transparent'
      } ${
        showDays ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
      }`}
      style={{
        // Only delay initial entrance, then 0ms for hover/unhover
        transitionDelay: (!daysAnimationComplete && showDays)
          ? `${(row + col) * 100}ms`
          : '0ms'
      }}
      onClick={() => handleDateClick(day)}
    >
                      {day && (
                        <>
                          <div className="text-xl font-bold text-gray-800 mb-3">
                            {day}
                          </div>
                          <div className="space-y-2">
                            {getEventsForDate(day).slice(0, 3).map((event, eventIndex) => {
                              return (
                                <div
                                  key={event.id}
                                  className={`bg-gradient-to-r ${getPositionBasedEventColor(row, col)} text-white text-sm px-3 py-2 rounded-xl truncate shadow-lg border border-white/20 cursor-pointer hover:scale-105 transition-all duration-500 ${
                                    showDays ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                                  }`}
                                  style={{ 
                                    transitionDelay: `${1200 + index * 30 + eventIndex * 100}ms`
                                  }}
                                  title={event.title}
                                  onClick={(e) => handleEventClick(event, e)}
                                >
                                  {event.time !== "All Day" && (
                                    <span className="opacity-90 font-medium">{event.time} </span>
                                  )}
                                  <span className="font-semibold">{event.title}</span>
                                </div>
                              );
                            })}
                            {getEventsForDate(day).length > 3 && (
                              <div className={`text-sm text-gray-600 px-3 py-1 bg-gray-100 rounded-lg transition-all duration-500 ${
                                showDays ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                              }`}
                              style={{ 
                                transitionDelay: `${1500 + index * 30}ms`
                              }}>
                                +{getEventsForDate(day).length - 3} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 animate-in slide-in-from-bottom-4 zoom-in-95 duration-400">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Event Details</h3>
                </div>
                <button
                  onClick={() => {
                    setShowEventDetails(false);
                    setSelectedEvent(null);
                  }}
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
                  onClick={() => {
                    setShowEventDetails(false);
                    setSelectedEvent(null);
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg font-semibold text-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showEventModal && (
         <div
             className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
             onClick={() => {
               setShowEventModal(false);
               setSelectedDate(null);
             }}
           >
          <div
      className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 animate-in slide-in-from-bottom-4 zoom-in-95 duration-400"
      onClick={e => e.stopPropagation()}
    >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">Add Event</h3>
                  <p className="text-gray-600 mt-1">Create a new calendar event</p>
                </div>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setSelectedDate(null);
                  }}
                  className="p-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 group"
                >
                  <X className="w-6 h-6 text-gray-600 group-hover:scale-110 transition-transform" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-lg"
                    placeholder="Enter event title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Date
                    </label>
                    <input
                      type="text"
                      value={selectedDate ? `${monthNames[currentDate.getMonth()]} ${selectedDate}, ${currentDate.getFullYear()}` : ""}
                      readOnly
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl bg-gray-50 text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Time
                    </label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-lg"
                    placeholder="Add location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Users className="w-4 h-4 inline mr-1" />
                    Guests (Optional)
                  </label>
                  <input
                    type="text"
                    value={newEvent.guests}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, guests: e.target.value }))}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-lg"
                    placeholder="Add guests"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Description (Optional)
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-all duration-300 text-lg"
                    rows={3}
                    placeholder="Add description"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setSelectedDate(null);
                  }}
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
    </div>
  );
}