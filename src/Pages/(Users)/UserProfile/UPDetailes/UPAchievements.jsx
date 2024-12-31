/* eslint-disable react/prop-types */
import React from "react";
import { FaRegPlusSquare } from "react-icons/fa";

const UPAchievements = ({ usersData }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-white pb-2">
        <h3 className="text-xl font-semibold text-white">Achievements</h3>
        <FaRegPlusSquare className="text-3xl font-bold hover:scale-105 text-white" />
      </div>
      <div className="flex flex-wrap gap-4">
        {usersData?.badges?.map((badge, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 bg-slate-200 p-4 rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
          >
            {React.createElement(badge.icon, {
              className: "text-green-600",
            })}
            <span className="">{badge.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UPAchievements;
