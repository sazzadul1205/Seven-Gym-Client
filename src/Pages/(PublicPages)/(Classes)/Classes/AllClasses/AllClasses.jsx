import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  addDays,
  differenceInMinutes,
  differenceInSeconds,
  format,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";
import { SlCalender } from "react-icons/sl";
import { FaRegClock } from "react-icons/fa";

import Title from "../../../../../Shared/Component/Title";

const AllClasses = ({ OurClasses, ClassDetails }) => {
  // State for tracking the current time
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentDay = format(currentTime, "EEEE");

  useEffect(() => {
    // Updates the current time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Days of the week array (for reordering schedule)
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const todayIndex = daysOfWeek.indexOf(currentDay);

  // Sort classes so that today’s classes appear first
  const reorderedSchedule = OurClasses.slice().sort((a, b) => {
    const dayAIndex = daysOfWeek.indexOf(a.day);
    const dayBIndex = daysOfWeek.indexOf(b.day);
    return (
      ((dayAIndex - todayIndex + 7) % 7) - ((dayBIndex - todayIndex + 7) % 7)
    );
  });

  // Function to get class details (icon, description, etc.)
  const getClassDetails = (moduleName) =>
    ClassDetails?.find((detail) => detail.module === moduleName);

  return (
    <div className="max-w-7xl mx-auto pt-20 text-center pb-5">
      {/* Page Title */}
      <Title titleContent="All Of Our Classes" />

      {/* Current Time Display */}
      <div className="flex justify-between items-center font-medium border-2 border-white bg-gray-700/80 text-xl px-5 py-3">
        <div className="flex items-center gap-5">
          <SlCalender />
          <p>{currentDay}</p>
        </div>
        <div className="flex items-center gap-5">
          <FaRegClock />
          <p>{format(currentTime, "hh:mm:ss a")}</p>
        </div>
      </div>

      {/* Class Schedule Grid */}
      <div>
        {reorderedSchedule.map((dayData, dayIndex) => (
          <div
            key={dayData.day}
            className="bg-gradient-to-br from-gray-400/80 to-gray-300/60 border-2 border-white  pb-5 mb-3"
          >
            {/* Day Title */}
            <h2 className="text-3xl font-bold mb-4 text-white bg-gray-500/80 border-b border-white py-2">
              {dayData.day}
            </h2>

            {/* Class Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-2 p-2">
              {dayData.classes.map((classItem) => {
                const classDetail = getClassDetails(classItem.module);

                // Calculate class start and end times
                const classDate =
                  currentDay === dayData.day
                    ? currentTime
                    : addDays(currentTime, dayIndex);
                const startTime = parseISO(
                  `${format(classDate, "yyyy-MM-dd")}T${classItem.startTime}`
                );
                const endTime = parseISO(
                  `${format(classDate, "yyyy-MM-dd")}T${classItem.endTime}`
                );

                // Determine class status
                const isCurrent =
                  isAfter(currentTime, startTime) &&
                  isBefore(currentTime, endTime);
                const isCompleted = isAfter(currentTime, endTime);
                const timeToStart = differenceInMinutes(startTime, currentTime);
                const isSoon = timeToStart > 0 && timeToStart <= 60;

                // Class progress percentage
                const progressPercent = isCurrent
                  ? (differenceInSeconds(currentTime, startTime) /
                      differenceInSeconds(endTime, startTime)) *
                    100
                  : 0;

                return (
                  <div key={classItem.module} className="relative group">
                    <div
                      className={`relative p-4 border-2 border-gray-400 transition duration-300 rounded-lg lg:hover:scale-105 h-[220px]
                        ${
                          isCurrent
                            ? "bg-green-200 text-gray-800"
                            : isCompleted
                            ? "bg-gray-200 text-gray-600"
                            : "bg-white text-gray-800"
                        }`}
                    >
                      {/* Class Icon */}
                      {classDetail?.icon && (
                        <img
                          src={classDetail.icon}
                          alt={classItem.module}
                          className="w-16 h-16 mx-auto mb-2"
                        />
                      )}

                      {/* Class Title */}
                      <p className="text-md md:text-2xl font-semibold text-blue-600">
                        {classItem.module}
                      </p>

                      {/* Class Timing */}
                      <p className="text-sm font-medium mb-4 bg-blue-300">
                        {format(startTime, "hh:mm a")} -{" "}
                        {format(endTime, "hh:mm a")}
                      </p>

                      {/* Class Status */}
                      {isCurrent ? (
                        <>
                          <p className="text-sm font-semibold text-green-600">
                            Class Ongoing
                          </p>
                          {/* Progress Bar */}
                          <div className="absolute bottom-0 left-0 w-full h-2 bg-green-300">
                            <div
                              className="h-full bg-green-600 transition-all duration-1000"
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                        </>
                      ) : isCompleted ? (
                        <p className="text-sm font-semibold text-gray-500">
                          Class Ended
                        </p>
                      ) : (
                        <p
                          className={`text-sm font-semibold ${
                            isSoon ? "text-orange-500" : "text-blue-500"
                          }`}
                        >
                          {isSoon
                            ? `Starts in ${timeToStart} minutes`
                            : `Starts at ${format(startTime, "hh:mm a")}`}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// **Prop Validation**
AllClasses.propTypes = {
  OurClasses: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      classes: PropTypes.arrayOf(
        PropTypes.shape({
          module: PropTypes.string.isRequired,
          startTime: PropTypes.string.isRequired,
          endTime: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  ClassDetails: PropTypes.arrayOf(
    PropTypes.shape({
      module: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ),
};

export default AllClasses;
