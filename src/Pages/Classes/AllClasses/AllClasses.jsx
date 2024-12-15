/* eslint-disable react/prop-types */
import Title from "../../../Shared/Componenet/Title";
import { useEffect, useState } from "react";
import {
  addDays,
  differenceInMinutes,
  format,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";

const AllClasses = ({ OurClasses, ClassDetails }) => {
  // State for current time
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentDay = format(currentTime, "EEEE");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reorder schedule starting with today
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

  const reorderedSchedule = OurClasses.sort((a, b) => {
    const dayAIndex = daysOfWeek.indexOf(a.day);
    const dayBIndex = daysOfWeek.indexOf(b.day);
    return (
      ((dayAIndex - todayIndex + daysOfWeek.length) % daysOfWeek.length) -
      ((dayBIndex - todayIndex + daysOfWeek.length) % daysOfWeek.length)
    );
  });

  // Helper to get class details
  const getClassDetails = (moduleName) => {
    return ClassDetails?.find((detail) => detail.module === moduleName);
  };

  return (
    <div className="container text-center mx-auto max-w-[1200px] pt-20">
      {/* Time and Date */}
      <div className="mb-6 px-6">
        <Title titleContent={"All Of Our Classes"} />
        <p className="text-xl font-medium text-white">
          ({currentDay}) Current Time: {format(currentTime, "hh:mm:ss a")}
        </p>
      </div>

      {/* Classes Grid */}
      {reorderedSchedule.map((dayData, dayIndex) => (
        <div key={dayIndex} className="mb-8 border-t-4 border-white">
          <h2 className="text-3xl font-bold  mb-4 text-white ">
            ({dayData.day})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {dayData.classes.map((classItem, classIndex) => {
              const classDetail = getClassDetails(classItem.module);
              const startTime = parseISO(
                `${format(
                  currentDay === dayData.day
                    ? currentTime
                    : addDays(currentTime, dayIndex),
                  "yyyy-MM-dd"
                )}T${classItem.startTime}`
              );
              const endTime = parseISO(
                `${format(
                  currentDay === dayData.day
                    ? currentTime
                    : addDays(currentTime, dayIndex),
                  "yyyy-MM-dd"
                )}T${classItem.endTime}`
              );

              const isCurrent =
                currentDay === dayData.day &&
                isAfter(currentTime, startTime) &&
                isBefore(currentTime, endTime);
              const isCompleted =
                currentDay === dayData.day && isAfter(currentTime, endTime);
              const timeToStart =
                currentDay === dayData.day
                  ? differenceInMinutes(startTime, currentTime)
                  : null;
              const isSoon = timeToStart <= 60 && timeToStart > 0;

              return (
                <div key={classIndex} className="relative group">
                  <div
                    className={`relative border border-gray-400 p-4 h-[260px] md:h-auto transition duration-300 rounded-lg hover:scale-105 ${
                      isCurrent
                        ? "bg-green-200 text-gray-800"
                        : isCompleted
                        ? "bg-gray-200 text-gray-600"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    <div className="items-center mb-2">
                      {classDetail?.icon && (
                        <img
                          src={classDetail.icon}
                          alt={classItem.module}
                          className="w-16 h-16 mx-auto mb-2"
                        />
                      )}
                      <p className="text-2xl font-semibold text-blue-600">
                        {classItem.module}
                      </p>
                    </div>
                    <p className="text-sm md:text-lg font-medium mb-4">
                      {format(startTime, "hh:mm a")} -{" "}
                      {format(endTime, "hh:mm a")}
                    </p>
                    {currentDay === dayData.day && isCurrent && (
                      <p className="text-sm md:text-lg font-semibold text-green-600">
                        Class Ongoing
                      </p>
                    )}
                    {currentDay === dayData.day && isCompleted && (
                      <p className="text-sm md:text-lg font-semibold text-gray-500">
                        Class ended
                      </p>
                    )}
                    {currentDay === dayData.day &&
                      !isCurrent &&
                      !isCompleted &&
                      isSoon && (
                        <p className="text-sm md:text-lg font-semibold text-orange-500">
                          Starts in {timeToStart} minutes
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
  );
};

export default AllClasses;
