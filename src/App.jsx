// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import pages
import Dashboard from "./pages/Dashboard";
import StudentInfoForm from "./pages/StudentInfoForm";
import NeedsForm from "./pages/NeedsForm";
import StrengthsForm from "./pages/StrengthsForm";
import DataSetup from "./pages/DataSetup";
import GoalForm from "./pages/GoalForm";
import IEPReport from "./pages/IEPReport";
import Classrooms from "./pages/Classrooms";
import StrategyLibrary from "./pages/StrategyLibrary";
import CommunityHub from "./pages/CommunityHub";
import GoalEditor from "./pages/GoalEditor";
import ResponsePrompt from "./pages/ResponsePrompt";    // ← Add this import

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* New Student Support Flow */}
        <Route path="/new-student/info" element={<StudentInfoForm />} />
        <Route path="/new-student/needs" element={<NeedsForm />} />
        <Route path="/new-student/strengths" element={<StrengthsForm />} />
        <Route path="/new-student/data-setup" element={<DataSetup />} />
        <Route path="/new-student/add-goal" element={<GoalForm />} />

        {/* Goal Editor */}
        <Route path="/goal-editor" element={<GoalEditor />} />

        {/* IEP Report */}
        <Route path="/iep-report" element={<IEPReport />} />

        {/* Response Prompt */}
        <Route path="/response-prompt" element={<ResponsePrompt />} />

        {/* Classrooms */}
        <Route path="/classrooms" element={<Classrooms />} />

        {/* Other pages */}
        <Route path="/strategy-library" element={<StrategyLibrary />} />
        <Route path="/community-hub" element={<CommunityHub />} />

        {/* Fallback */}
        <Route
          path="*"
          element={<h2 className="text-center mt-10">404 - Page Not Found</h2>}
        />
      </Routes>
    </Router>
  );
}
