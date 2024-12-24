import { useState } from "react";

const AllWeekClasses = ({ allWeekClasses, classType }) => {
  const [filterType, setFilterType] = useState("all");

  const filteredClasses =
    filterType === "same"
      ? allWeekClasses[0]?.schedule &&
        Object.entries(allWeekClasses[0]?.schedule).reduce(
          (acc, [day, sessions]) => {
            acc[day] = sessions.filter(
              (session) => session.classType === classType
            );
            return acc;
          },
          {}
        )
      : allWeekClasses[0]?.schedule;

  return (
    <div className="p-8 bg-gray-50">
      <div className="max-w-[1200px] mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">
          Classes at the Same Time Across the Week
        </h2>
        <div className="flex justify-end space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              filterType === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setFilterType("all")}
          >
            All Classes
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filterType === "same"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setFilterType("same")}
          >
            Same Type: {classType}
          </button>
        </div>
        {filteredClasses &&
          Object.entries(filteredClasses).map(([day, sessions]) => (
            <div key={day} className="mb-6">
              <h3 className="text-xl font-bold">{day}</h3>
              {sessions.map((session, index) => (
                <div key={index} className="p-4 border rounded-md mb-2">
                  <p>
                    <strong>Class Type:</strong> {session.classType}
                  </p>
                  <p>
                    <strong>Time Start:</strong> {session.timeStart}
                  </p>
                  <p>
                    <strong>Time End:</strong> {session.timeEnd}
                  </p>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllWeekClasses;
