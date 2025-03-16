import React, { useContext } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProgressBar from "../components/ProgressBar";
import { IEPContext } from "../context/IEPContext";
import { useNavigate } from "react-router-dom";

export default function IEPReport() {
  const navigate = useNavigate();
  const { iepReports } = useContext(IEPContext);
  const report = iepReports[iepReports.length - 1];

  const handleExportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // Title
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("INDIVIDUAL EDUCATION PLAN (IEP)", pageWidth / 2, 30, { align: "center" });

    // STUDENT INFORMATION header
    doc.setFontSize(12);
    doc.setFillColor(128, 128, 128);
    doc.rect(margin, 40, pageWidth - margin * 2, 10, "F");
    doc.setTextColor(255);
    doc.text("STUDENT INFORMATION", pageWidth / 2, 47, { align: "center" });

    // Build student information table as 4 rows x 4 columns:
    // Row 1: Student Name (prompt, answer), Grade Level (prompt, answer)
    // Row 2: Preferred Name, Class
    // Row 3: DOB (DDMMYYYY), Student ID
    // Row 4: Date of Entry (DDMMYYYY), Languages
    const studentTableData = [
      {
        col1: { content: "Student Name", styles: { fontStyle: "bold" } },
        col2: report?.studentInfo?.studentName || "N/A",
        col3: { content: "Grade Level", styles: { fontStyle: "bold" } },
        col4: report?.studentInfo?.grade || "N/A"
      },
      {
        col1: { content: "Preferred Name", styles: { fontStyle: "bold" } },
        col2: report?.studentInfo?.preferredName || "N/A",
        col3: { content: "Class", styles: { fontStyle: "bold" } },
        col4: report?.studentInfo?.classroom || "N/A"
      },
      {
        col1: { content: "DOB (DDMMYYYY)", styles: { fontStyle: "bold" } },
        col2: report?.studentInfo?.dob || "N/A",
        col3: { content: "Student ID", styles: { fontStyle: "bold" } },
        col4: report?.studentInfo?.studentId || "N/A"
      },
      {
        col1: { content: "Date of Entry (DDMMYYYY)", styles: { fontStyle: "bold" } },
        col2: report?.studentInfo?.entryDate || "N/A",
        col3: { content: "Languages", styles: { fontStyle: "bold" } },
        col4: report?.studentInfo?.language || "N/A"
      }
    ];

    autoTable(doc, {
      startY: 55,
      head: [],
      body: studentTableData,
      columns: [
        { header: "", dataKey: "col1", cellWidth: (pageWidth - margin * 2) / 4 },
        { header: "", dataKey: "col2", cellWidth: (pageWidth - margin * 2) / 4 },
        { header: "", dataKey: "col3", cellWidth: (pageWidth - margin * 2) / 4 },
        { header: "", dataKey: "col4", cellWidth: (pageWidth - margin * 2) / 4 },
      ],
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 4 },
      margin: { left: margin, right: margin },
      rowPageBreak: 'avoid'
    });

    // STUDENT NEEDS header
    doc.setFillColor(128, 128, 128);
    doc.rect(margin, doc.lastAutoTable.finalY + 10, pageWidth - margin * 2, 10, "F");
    doc.setTextColor(255);
    doc.text("STUDENT NEEDS", pageWidth / 2, doc.lastAutoTable.finalY + 17, { align: "center" });

    // Needs table: first row has two columns, subsequent rows span both columns.
    const needsData = [
      [
        {
          content: `Functional Need in Area(s) of:\n${report?.needs?.functionalNeeds || "N/A"}`,
        },
        {
          content: `Diagnosis Awareness (Y/N):\n${report?.needs?.diagnosisAwareness || "N/A"}`,
        },
      ],
      [
        {
          content: `Non-Academic Needs:\n${report?.needs?.nonAcademicNeeds || "N/A"}`,
          colSpan: 2,
        },
      ],
      [
        {
          content: `Background Information:\n${report?.needs?.backgroundInfo || "N/A"}`,
          colSpan: 2,
        },
      ],
      [
        {
          content: `Psychoeducational Report Summary:\n${report?.needs?.psychoReport || "N/A"}`,
          colSpan: 2,
        },
      ],
    ];

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      body: needsData,
      columns: [
        { header: "", dataKey: "col1", width: (pageWidth - margin * 2) / 2 },
        { header: "", dataKey: "col2", width: (pageWidth - margin * 2) / 2 },
      ],
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 4 },
      margin: { left: margin, right: margin },
      rowPageBreak: 'avoid'
    });

    // STUDENT STRENGTHS & AREAS FOR GROWTH header (continue on same page)
    doc.setFillColor(128, 128, 128);
    doc.rect(margin, doc.lastAutoTable.finalY + 10, pageWidth - margin * 2, 10, "F");
    doc.setTextColor(255);
    doc.text("STUDENT STRENGTHS & AREAS FOR GROWTH", pageWidth / 2, doc.lastAutoTable.finalY + 17, { align: "center" });

    // Strengths: one row with two columns
    const strengthsData = [
      [
        { content: `Student Strengths:\n${report?.strengths?.strengths || "N/A"}` },
        { content: `Student Areas for Growth:\n${report?.strengths?.areasForGrowth || "N/A"}` },
      ],
    ];

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      body: strengthsData,
      columns: [
        { header: "", dataKey: "col1", width: (pageWidth - margin * 2) / 2 },
        { header: "", dataKey: "col2", width: (pageWidth - margin * 2) / 2 },
      ],
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 4, minCellHeight: 40 },
      margin: { left: margin, right: margin },
      rowPageBreak: 'avoid'
    });

    // STUDENT GOALS header
    doc.setFillColor(128, 128, 128);
    doc.rect(margin, doc.lastAutoTable.finalY + 10, pageWidth - margin * 2, 10, "F");
    doc.setTextColor(255);
    doc.text("STUDENT GOALS", pageWidth / 2, doc.lastAutoTable.finalY + 17, { align: "center" });

    // Goals table with three rows (each spanning full width)
    const goalsData = [
      [
        {
          content: `Goal Overview:\n${report?.goal?.goalOverview || "N/A"}`,
          colSpan: 2,
        },
      ],
      [
        {
          content: `Aligned Standards:\n${(report?.goal?.alignedStandard || []).join(", ") || "N/A"}`,
          colSpan: 2,
        },
      ],
      [
        {
          content: `Recommended Strategies:\n${(report?.goal?.recommendedStrategies || []).join(", ") || "N/A"}`,
          colSpan: 2,
        },
      ],
    ];

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      body: goalsData,
      columns: [
        { header: "", dataKey: "col1", width: pageWidth - margin * 2 },
        { header: "", dataKey: "col2", width: 0 },
      ],
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 4, minCellHeight: 40 },
      margin: { left: margin, right: margin },
      rowPageBreak: 'avoid'
    });

    doc.save(`${report?.studentInfo?.studentName || "IEP_Report"}.pdf`);
  };

  if (!report) {
    return (
      <div className="flex h-screen font-sans bg-offwhite">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800">No IEP Report Available</h2>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full hover:scale-105 transition-all duration-300"
            >
              Return to Home Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { studentInfo, needs, strengths, goal } = report;

  return (
    <div className="flex h-screen font-sans bg-offwhite">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Navbar />
        <div className="mt-4 mb-4 max-w-7xl mx-auto">
          <ProgressBar progress={100} />
          <p className="text-sm text-gray-600 mt-1 text-center">Progress: 100%</p>
        </div>
        <div id="reportContent" className="pt-8 p-8 w-full max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
            IEP Report for {studentInfo.studentName || "N/A"}
          </h1>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center bg-gray-700 text-white p-2 rounded">
              STUDENT INFORMATION
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <InfoRow label="Student Name" value={studentInfo.studentName} />
                <InfoRow label="Preferred Name" value={studentInfo.preferredName} />
                <InfoRow label="DOB (DDMMYYYY)" value={studentInfo.dob} />
                <InfoRow label="Date of Entry (DDMMYYYY)" value={studentInfo.entryDate} />
              </div>
              <div className="space-y-4">
                <InfoRow label="Grade Level" value={studentInfo.grade} />
                <InfoRow label="Class" value={studentInfo.classroom} />
                <InfoRow label="Student ID" value={studentInfo.studentId} />
                <InfoRow label="Languages" value={studentInfo.language} />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center bg-gray-700 text-white p-2 rounded">
              STUDENT NEEDS
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <FormattedSection title="Functional Need in Area(s) of:" content={needs.functionalNeeds} />
              <FormattedSection title="Diagnosis Awareness (Y/N):" content={needs.diagnosisAwareness} />
              <FormattedSection title="Non-Academic Needs:" content={needs.nonAcademicNeeds} />
              <FormattedSection title="Background Information:" content={needs.backgroundInfo} />
              <FormattedSection title="Psychoeducational Report Summary:" content={needs.psychoReport} />
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center bg-gray-700 text-white p-2 rounded">
              STUDENT STRENGTHS & AREAS FOR GROWTH
            </h2>
            <div className="space-y-4">
              <FormattedSection title="Student Strengths:" content={strengths.strengths} />
              <FormattedSection title="Student Areas for Growth:" content={strengths.areasForGrowth} />
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center bg-gray-700 text-white p-2 rounded">
              STUDENT GOALS
            </h2>
            <div className="space-y-4">
              <FormattedSection title="Goal Overview:" content={goal.goalOverview} />
              <FormattedSection title="Aligned Standards:" content={goal.alignedStandard?.join(", ") || "N/A"} />
              <FormattedSection title="Recommended Strategies:" content={goal.recommendedStrategies?.join(", ") || "N/A"} />
            </div>
          </div>
        </div>
        
        <div className="p-8 flex justify-between">
          <button
            onClick={handleExportPDF}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full hover:scale-105 transition-all duration-300"
          >
            Export IEP to PDF
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gray-600 text-white rounded-full hover:scale-105 transition-all duration-300"
          >
            Return to Home Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({ label, value }) => (
  <div className="border-b border-gray-300 pb-2">
    <p className="font-semibold text-gray-700">{label}</p>
    <p className="text-gray-900">{value || "N/A"}</p>
  </div>
);

const FormattedSection = ({ title, content }) => (
  <div className="mb-4">
    <h3 className="font-semibold text-gray-700 mb-1">{title}</h3>
    <p className="text-gray-900 whitespace-pre-wrap">{content || "N/A"}</p>
  </div>
);
