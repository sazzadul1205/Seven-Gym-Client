import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";

// Import Packages
import PropTypes from "prop-types";

// Import Icons
import { FaUserPlus } from "react-icons/fa";

// Import Date Control
import {
  format,
  isAfter,
  isBefore,
  differenceInMinutes,
  parseISO,
  differenceInSeconds,
} from "date-fns";

// Import Shared
import Title from "../../../../Shared/Component/Title";
import CommonButton from "../../../../Shared/Buttons/CommonButton";
import { FiAlertCircle, FiCheckCircle, FiClock, FiPlay } from "react-icons/fi";

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
      <div key={index} className="relative group">
        {/* Class Card */}
        <div
          className={`relative p-4  transition duration-300 rounded-lg
            ${
              isCurrent
                ? "bg-green-200 text-gray-800"
                : isCompleted
                ? "bg-linear-to-bl hover:bg-linear-to-tr from-white to-gray-300 text-black"
                : "bg-linear-to-bl hover:bg-linear-to-tr from-white to-gray-300 text-black"
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
          <p className="text-sm font-medium mb-4 bg-blue-300 py-1">
            {format(startTime, "hh:mm a")} - {format(endTime, "hh:mm a")}
          </p>

          {/* Class Status */}
          {isCurrent ? (
            <>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                <FiPlay className="text-base" />
                <span>Class Ongoing</span>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 w-full h-2 bg-green-200">
                <div
                  className="h-full bg-green-600 transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </>
          ) : isCompleted ? (
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-500">
              <FiCheckCircle className="text-base" />
              <span>Class Ended</span>
            </div>
          ) : (
            <div
              className={`flex items-center gap-1 text-sm font-semibold ${
                isSoon ? "text-orange-500" : "text-blue-500"
              }`}
            >
              {isSoon ? (
                <>
                  <FiAlertCircle className="text-base" />
                  <span>Starts in {timeToStart} minutes</span>
                </>
              ) : (
                <>
                  <FiClock className="text-base" />
                  <span>Starts at {format(startTime, "hh:mm a")}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Hover Overlay for Join Button */}
        <div className="hidden lg:flex absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 items-center justify-center">
          <Link to={`/Classes/${classItem.module}`}>
            <CommonButton
              text=""
              icon={<FaUserPlus />}
              bgColor="OriginalRed"
              px="px-10"
              py="py-3"
              borderRadius="rounded-lg"
              className="absolute top-4 right-4 shadow-lg"
            />
          </Link>
          <p className="text-white text-xl font-semibold">
            Join {classItem.module} Class
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="py-10 bg-gradient-to-b from-black/40 to-black/70">
      <div className="container mx-auto text-center">
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

// Prop Validation for ClassSchedule Component
ClassSchedule.propTypes = {
  ourClasses: PropTypes.arrayOf(
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
  classDetails: PropTypes.arrayOf(
    PropTypes.shape({
      module: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ).isRequired,
};

export default ClassSchedule;
