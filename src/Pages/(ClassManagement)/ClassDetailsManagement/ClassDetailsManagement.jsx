import React, { useState } from "react";

const ClassDetailsManagement = ({ ClassDetailsData }) => {
  const [selectedClassId, setSelectedClassId] = useState(
    ClassDetailsData[0]?._id || ""
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Scrollable Tabs */}
      <div className="overflow-x-auto whitespace-nowrap flex gap-3 pb-4 scrollbar-hide">
        {ClassDetailsData.map((cls) => {
          const isActive = selectedClassId === cls._id;

          return (
            <button
              key={cls._id}
              onClick={() => setSelectedClassId(cls._id)}
              className={`inline-flex flex-col items-center justify-center px-4 py-3 min-w-[8rem] rounded-xl border-2 transition-all duration-200 flex-shrink-0 ${
                isActive
                  ? "bg-blue-100 border-blue-500 text-blue-700 font-bold shadow"
                  : "bg-white border-gray-300 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <img
                src={cls.icon}
                alt={cls.module}
                className="w-10 h-10 object-contain mb-1"
              />
              <span className="text-xs sm:text-sm text-center">
                {cls.module}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Class Placeholder */}
      <div className="mt-6">
        <p className="text-lg font-semibold text-gray-800">
          Selected Class:{" "}
          <span className="text-blue-600">
            {ClassDetailsData.find((c) => c._id === selectedClassId)?.module}
          </span>
        </p>
        {/* Internal content can be added here later */}
      </div>
    </div>
  );
};

export default ClassDetailsManagement;
