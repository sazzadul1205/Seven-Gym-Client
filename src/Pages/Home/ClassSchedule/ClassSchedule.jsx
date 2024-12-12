/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  format,
  isAfter,
  isBefore,
  differenceInMinutes,
  parseISO,
  differenceInSeconds,
} from "date-fns";
import { FaUserPlus } from "react-icons/fa";
import Title from "../../../Shared/Componenet/Title";

const ClassSchedule = ({ ourClasses, classDetails }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentDay = format(currentTime, "EEEE");

  const todaySchedule = ourClasses.find((day) => day.day === currentDay);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getClassDetails = (moduleName) => {
    return classDetails.find((detail) => detail.module === moduleName);
  };

  return (
    <div className="py-16 mx-auto max-w-[1200px]">
      <div className="container mx-auto  text-center">
        {/* Time and Date */}
        <div className="mb-6 px-6">
          <Title titleContent={"Our Classes"} />
          <p className="text-xl font-medium text-white">
            ({currentDay}) Current Time: {format(currentTime, "hh:mm:ss a")}
          </p>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {todaySchedule?.classes.map((classItem, index) => {
            const classDetail = getClassDetails(classItem.module);
            const startTime = parseISO(
              `${format(currentTime, "yyyy-MM-dd")}T${classItem.startTime}`
            );
            const endTime = parseISO(
              `${format(currentTime, "yyyy-MM-dd")}T${classItem.endTime}`
            );
            const isCurrent =
              isAfter(currentTime, startTime) && isBefore(currentTime, endTime);
            const isCompleted = isAfter(currentTime, endTime);
            const timeToStart = differenceInMinutes(startTime, currentTime);
            const isSoon = timeToStart <= 60 && timeToStart > 0;

            const totalDuration = differenceInSeconds(endTime, startTime);
            const elapsedDuration = isCurrent
              ? differenceInSeconds(currentTime, startTime)
              : 0;
            const progressPercent = (elapsedDuration / totalDuration) * 100;

            return (
              <div key={index} className="relative group">
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
                  {isCurrent && (
                    <>
                      <p className="text-sm md:text-lg font-semibold text-green-600">
                        Class Ongoing
                      </p>
                      <div className="absolute bottom-0 left-0 w-full h-2 bg-green-300">
                        <div
                          className="h-full bg-green-600 transition-all duration-1000"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </>
                  )}
                  {isCompleted && (
                    <p className="text-sm md:text-lg font-semibold text-gray-500">
                      Class ended
                    </p>
                  )}
                  {!isCurrent && !isCompleted && isSoon && (
                    <p className="text-sm md:text-lg font-semibold text-orange-500">
                      Starts in {timeToStart} minutes
                    </p>
                  )}
                  {!isCurrent && !isCompleted && !isSoon && (
                    <p className="text-sm md:text-lg font-semibold text-blue-500">
                      Starts at {format(startTime, "hh:mm a")}
                    </p>
                  )}
                </div>

                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center rounded-lg">
                  <button className="absolute top-4 right-4 bg-white hover:bg-[#F72C5B] text-black hover:text-white font-bold p-3 rounded-full shadow-lg">
                    <FaUserPlus />
                  </button>
                  <p className="text-white text-xl font-semibold">
                    Join {classItem.module} Class
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClassSchedule;
