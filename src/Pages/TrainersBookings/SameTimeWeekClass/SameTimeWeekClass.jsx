import React from "react";

const SameTimeWeekClass = ({ SameTimeData }) => {
  const { name, schedule } = SameTimeData;

  return (
    <div className="max-w-7xl mx-auto bg-white py-8 px-2">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Schedule for {name} On This Week
      </h2>
      {/* Iterate over the days of the week */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Display classes for the day */}
        {Object.keys(schedule).map((day) => (
          <div
            key={day}
            className="bg-white border rounded-lg shadow-lg py-4 hover:scale-105"
          >
            {schedule[day].map((classItem, index) => (
              <div key={index} className="scale-105">
                <h3 className="text-xl font-semibold text-center">{day}</h3>
                <p className="font-semibold text-center italic">
                  {classItem.classType}
                </p>
                <p className="text-center">
                  <strong>Time:</strong> {classItem.timeStart} -{" "}
                  {classItem.timeEnd}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SameTimeWeekClass;
