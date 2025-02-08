import React, { useState, useEffect } from "react";

const UserSchedulePlanner = () => {
  // State for live clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get today's full date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get current time as HH:MM:SS AM/PM
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Get current month and week number
  const currentMonth = today.toLocaleDateString("en-US", { month: "long" });
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((today - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7
  );

  // Weekday labels
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-[#F72C5B] py-10"></div>

      {/* Title */}
      <div className="text-center">
        <p className="text-3xl font-semibold py-2 underline underline-offset-4">
          DAILY SCHEDULE PLANNER
        </p>
        <p className="text-lg text-gray-600">{formattedDate}</p>
        <p className="text-2xl font-bold text-blue-500 mt-2">{formattedTime}</p>
      </div>

      {/* Week & Date Selector */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center p-4 border-b border-gray-300">
        {/* Month and Week Number */}
        <div className="flex flex-col items-center md:items-start">
          <p className="text-lg font-medium text-gray-800">{currentMonth}</p>
          <p className="text-md text-gray-600">Week {weekNumber}</p>
        </div>

        {/* Week Selector */}
        <div className="flex gap-2 mt-4 md:mt-0">
          {weekdays.map((day, index) => {
            const isPastDay = index < today.getDay(); // Check if day has passed
            const isToday = index === today.getDay(); // Check if today

            return (
              <p
                key={index}
                className={`rounded-full border border-black w-10 h-10 flex items-center justify-center text-lg font-medium 
                  ${isPastDay ? "bg-red-400 text-white" : ""} 
                  ${isToday ? "bg-blue-400 text-white font-bold" : ""} 
                  hover:bg-gray-400 cursor-pointer`}
              >
                {day}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserSchedulePlanner;
