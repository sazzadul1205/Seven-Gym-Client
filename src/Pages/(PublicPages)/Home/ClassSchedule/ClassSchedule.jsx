import { Link } from "react-router";
import { useState, useEffect, useMemo } from "react";

import PropTypes from "prop-types";
import { FaUserPlus } from "react-icons/fa";
import {
  format,
  isAfter,
  isBefore,
  differenceInMinutes,
  parseISO,
  differenceInSeconds,
} from "date-fns";

import Title from "../../../../Shared/Component/Title";

const ClassSchedule = ({ ourClasses, classDetails }) => {
  // State to track the current time
  const [currentTime, setCurrentTime] = useState(new Date());

  // Memoized value to get the current day name (e.g., "Monday")
  const currentDay = useMemo(() => format(currentTime, "EEEE"), [currentTime]);

  // Memoized schedule lookup to prevent unnecessary re-renders
  const todaySchedule = useMemo(
    () => ourClasses.find((day) => day.day === currentDay),
    [ourClasses, currentDay]
  );

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Retrieve class details based on the module name
  const getClassDetails = (moduleName) =>
    classDetails.find((detail) => detail.module === moduleName);

  // Function to render each class card
  const renderClassCard = (classItem, index) => {
    const classDetail = getClassDetails(classItem.module);

    // Parse start and end times
    const startTime = parseISO(
      `${format(currentTime, "yyyy-MM-dd")}T${classItem.startTime}`
    );
    const endTime = parseISO(
      `${format(currentTime, "yyyy-MM-dd")}T${classItem.endTime}`
    );

    // Determine class status
    const isCurrent =
      isAfter(currentTime, startTime) && isBefore(currentTime, endTime);
    const isCompleted = isAfter(currentTime, endTime);
    const timeToStart = differenceInMinutes(startTime, currentTime);
    const isSoon = timeToStart <= 60 && timeToStart > 0;

    // Calculate class progress percentage
    const progressPercent = isCurrent
      ? (differenceInSeconds(currentTime, startTime) /
          differenceInSeconds(endTime, startTime)) *
        100
      : 0;

    return (
      <div key={index} className="relative group border p-1 bg-gray-200/20">
        {/* Class Card */}
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
            {format(startTime, "hh:mm a")} - {format(endTime, "hh:mm a")}
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
            <p className="text-sm font-semibold text-gray-500">Class Ended</p>
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

        {/* Hover Overlay for Join Button */}
        <div className="hidden lg:flex absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 items-center justify-center rounded-lg">
          <Link to={`/Classes/${classItem.module}`}>
            <button className="absolute top-4 right-4 bg-white hover:bg-linear-to-bl from-[#F72C5B] to-[#ce294f] text-black hover:text-white font-bold px-10 py-3 rounded-lg shadow-lg">
              <FaUserPlus />
            </button>
          </Link>
          <p className="text-white text-xl font-semibold">
            Join {classItem.module} Class
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="py-10 bg-linear-to-b from-black/20 to-black/40">
      <div className="mx-auto max-w-7xl">
        <div className="container mx-auto text-center">
          {/* Section Title */}
          <div className="mb-6 px-6">
            <Title titleContent="Our Classes" />
            <p className="text-xl font-medium text-white">
              ({currentDay}) Current Time: {format(currentTime, "hh:mm:ss a")}
            </p>
          </div>

          {/* Class Schedule Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 bg-black">
            {todaySchedule?.classes.map(renderClassCard)}
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ **Prop Validation for ClassSchedule Component**
ClassSchedule.propTypes = {
  ourClasses: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired, // Example: "Monday"
      classes: PropTypes.arrayOf(
        PropTypes.shape({
          module: PropTypes.string.isRequired, // Example: "Yoga"
          startTime: PropTypes.string.isRequired, // Example: "08:00:00"
          endTime: PropTypes.string.isRequired, // Example: "09:00:00"
        })
      ).isRequired,
    })
  ).isRequired,
  classDetails: PropTypes.arrayOf(
    PropTypes.shape({
      module: PropTypes.string.isRequired,
      icon: PropTypes.string, // URL to the class icon (optional)
    })
  ).isRequired,
};

export default ClassSchedule;
