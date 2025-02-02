import React from "react";
import { MdOutlineRecentActors } from "react-icons/md";

// Reusable component for workout details
const WorkoutDetailItem = ({ icon, label, value, iconColor }) => (
  <li className="flex items-center gap-3">
    {React.cloneElement(icon, { className: `text-lg ${iconColor}` })}
    <span className="font-medium">{label}:</span>
    <span>{String(value ?? "N/A")}</span>
  </li>
);

const UPTodaysWorkout = () => {
  return (
    <div className="mt-8 bg-slate-50 p-6 rounded-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b">
        <MdOutlineRecentActors className="text-[#EFBF04]" />
        <h2 className="text-xl font-semibold text-black">Today&apos;s Workouts</h2>
      </div>
    </div>
  );
};

export default UPTodaysWorkout;
