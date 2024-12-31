import React from "react";

const UPTeachers = ({ usersData }) => {
  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-xl font-semibold text-white">Current Teacher</h3>
      <div className="flex items-center space-x-4 bg-slate-200 p-4 rounded-lg shadow-lg">
        <img
          src={usersData.currentTeacher.profileImage}
          alt="Teacher"
          className="w-20 h-20 rounded-full border-4 border-white shadow-md"
        />
        <div>
          <h4 className="text-xl font-semibold text-gray-800">
            {usersData.currentTeacher.name}
          </h4>
          <p className="text-gray-600">{usersData.currentTeacher.title}</p>
          <p className="text-gray-500 mt-2">{usersData.currentTeacher.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default UPTeachers;
