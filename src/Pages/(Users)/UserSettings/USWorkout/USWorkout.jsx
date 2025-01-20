import React from "react";
import { MdOutlineWorkOutline } from "react-icons/md";

const USWorkout = ({ UsersData, refetch }) => {
  console.log(UsersData);

  return (
    <div className="w-full bg-gray-200 min-h-screen">
      {/* Header */}
      <header className="bg-gray-400 px-5 py-2">
        <p className="flex items-center gap-2 text-xl font-semibold italic text-white">
          <MdOutlineWorkOutline /> User Workout Settings
        </p>
      </header>
    </div>
  );
};

export default USWorkout;
