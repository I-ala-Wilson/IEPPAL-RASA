import React, { createContext, useState } from "react";

export const IEPContext = createContext();

export function IEPProvider({ children }) {
  // in-progress form data
  const [iepData, setIepData] = useState({
    studentInfo: {},
    needs: {},
    strengths: {},
    goals: []
  });

  // completed reports
  const [iepReports, setIepReports] = useState([]);

  // section updaters
  const updateStudentInfo = data =>
    setIepData(prev => ({ ...prev, studentInfo: data }));
  const updateNeeds = data =>
    setIepData(prev => ({ ...prev, needs: data }));
  const updateStrengths = data =>
    setIepData(prev => ({ ...prev, strengths: data }));

  // goal management
  const addGoal = data =>
    setIepData(prev => ({ ...prev, goals: [...prev.goals, data] }));
  const updateGoal = (index, data) =>
    setIepData(prev => {
      const newGoals = [...prev.goals];
      newGoals[index] = data;
      return { ...prev, goals: newGoals };
    });

  // once the user hits “Finish”
  const finalizeReport = () => {
    setIepReports(prev => [...prev, iepData]);
    // reset for next IEP
    setIepData({ studentInfo: {}, needs: {}, strengths: {}, goals: [] });
  };

  return (
    <IEPContext.Provider
      value={{
        iepData,
        iepReports,
        updateStudentInfo,
        updateNeeds,
        updateStrengths,
        addGoal,
        updateGoal,
        finalizeReport,
      }}
    >
      {children}
    </IEPContext.Provider>
  );
}
