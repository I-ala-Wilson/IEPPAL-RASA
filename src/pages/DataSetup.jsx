import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProgressBar from "../components/ProgressBar";
import { IEPContext } from "../context/IEPContext";

export default function DataSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDocModal, setShowDocModal] = useState(false);
  const [docUploaded, setDocUploaded] = useState(false);
  const [goalSet, setGoalSet] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (location.state?.goalSet) {
      setGoalSet(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const { finalizeReport } = useContext(IEPContext);

  const overallProgress = 60;

  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setIsUploading(true);
      // Simulate upload delay for better UX
      setTimeout(() => {
        setDocUploaded(true);
        setIsUploading(false);
        setShowDocModal(false);
      }, 1500);
    } else {
      alert("Please select a PDF file.");
    }
  };

  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        {/* Progress Section */}
        <div className="mt-6 mb-6 max-w-4xl mx-auto px-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <ProgressBar progress={overallProgress} />
            <p className="text-sm text-slate-600 mt-3 text-center font-medium">
              Overall Progress: {overallProgress}%
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-8 pb-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Student Data Dashboard
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Configure your student's profile by adding goals and supporting documentation to create a comprehensive IEP report.
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Add Goal Card */}
              <div
                onClick={() => navigate("/new-student/add-goal")}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8 cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 ${
                    goalSet 
                      ? 'bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500 shadow-lg shadow-emerald-300/50 group-hover:scale-110 group-hover:shadow-emerald-400/60' 
                      : 'bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 shadow-lg shadow-purple-300/50 group-hover:scale-110 group-hover:shadow-purple-400/60'
                  }`}>
                    {goalSet ? (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                  </div>
                  {goalSet ? (
                    <>
                      <h3 className="text-2xl font-bold text-emerald-600 mb-3">Goal Set Successfully!</h3>
                      <p className="text-slate-600 leading-relaxed">Your learning objective has been configured and saved to your student profile.</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">Add Learning Goal</h3>
                      <p className="text-slate-600 leading-relaxed">Define specific learning objectives and measurable outcomes for your student.</p>
                    </>
                  )}
                </div>
              </div>

              {/* Upload Document Card */}
              <div
                onClick={() => setShowDocModal(true)}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8 cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-all duration-300 ${
                    docUploaded 
                      ? 'bg-gradient-to-br from-blue-400 via-cyan-400 to-purple-500 shadow-lg shadow-blue-300/50 group-hover:scale-110 group-hover:shadow-blue-400/60' 
                      : 'bg-gradient-to-br from-orange-400 via-pink-500 to-red-500 shadow-lg shadow-pink-300/50 group-hover:scale-110 group-hover:shadow-pink-400/60'
                  }`}>
                    {docUploaded ? (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    )}
                  </div>
                  {docUploaded ? (
                    <>
                      <h3 className="text-2xl font-bold text-blue-600 mb-3">Document Uploaded!</h3>
                      <p className="text-slate-600 leading-relaxed">Your supporting documentation has been successfully processed and attached.</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">Add Supporting Document</h3>
                      <p className="text-slate-600 leading-relaxed">Upload assessment reports, evaluations, or other relevant PDF documentation.</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => navigate("/new-student/strengths")}
                className="group px-8 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl text-slate-700 font-semibold hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  finalizeReport();
                  navigate("/iep-report");
                }}
                className="group px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                Save & Finish
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

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