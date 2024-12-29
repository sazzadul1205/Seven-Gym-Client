/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import { Link } from "react-router";
import {
  format,
  isAfter,
  isBefore,
  differenceInMinutes,
  parseISO,
  differenceInSeconds,
} from "date-fns";
import Title from "../../../../Shared/Componenet/Title";

const ClassSchedule = ({ ourClasses, classDetails }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentDay = format(currentTime, "EEEE");
  const todaySchedule = ourClasses.find((day) => day.day === currentDay);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getClassDetails = (moduleName) =>
    classDetails.find((detail) => detail.module === moduleName);

  const renderClassCard = (classItem, index) => {
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
    const progressPercent = isCurrent
      ? (differenceInSeconds(currentTime, startTime) /
          differenceInSeconds(endTime, startTime)) *
        100
      : 0;

    return (
      <div key={index} className="relative group">
        <div
          className={`relative p-4 border-2 border-gray-400 transition duration-300 rounded-lg lg:hover:scale-105 h-[230px] ${
            isCurrent
              ? "bg-green-200 text-gray-800"
              : isCompleted
              ? "bg-gray-200 text-gray-600"
              : "bg-white text-gray-800"
          }`}
        >
          {classDetail?.icon && (
            <img
              src={classDetail.icon}
              alt={classItem.module}
              className="w-16 h-16 mx-auto mb-2"
            />
          )}
          <p className="text-md md:text-2xl font-semibold text-blue-600">
            {classItem.module}
          </p>
          <p className="text-sm font-medium mb-4">
            {format(startTime, "hh:mm a")} - {format(endTime, "hh:mm a")}
          </p>
          {isCurrent && (
            <>
              <p className="text-sm font-semibold text-green-600">
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
            <p className="text-sm font-semibold text-gray-500">Class ended</p>
          )}
          {!isCurrent && !isCompleted && (
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

        <div className="hidden lg:flex absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300  items-center justify-center rounded-lg">
          <Link to={`/Classes/${classItem.module}`}>
            <button className="absolute top-4 right-4 bg-white hover:bg-[#F72C5B] text-black hover:text-white font-bold p-5 rounded-lg shadow-lg">
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
    <div className="py-16 mx-auto max-w-7xl">
      <div className="container mx-auto text-center">
        <div className="mb-6 px-6">
          <Title titleContent={"Our Classes"} />
          <p className="text-xl font-medium text-white">
            ({currentDay}) Current Time: {format(currentTime, "hh:mm:ss a")}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-2">
          {todaySchedule?.classes.map(renderClassCard)}
        </div>
      </div>
    </div>
  );
};

export default ClassSchedule;
