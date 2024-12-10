import { useState, useEffect } from "react";
import {
  format,
  isAfter,
  isBefore,
  differenceInMinutes,
  parseISO,
  differenceInSeconds,
} from "date-fns";
import { FaDumbbell, FaUserPlus } from "react-icons/fa";

const ClassSchedule = () => {
  const schedule = [
    {
      day: "Monday",
      classes: [
        { module: "Yoga", startTime: "08:00", endTime: "09:00" },
        { module: "HIIT", startTime: "09:00", endTime: "10:00" },
        { module: "Spin", startTime: "10:00", endTime: "11:00" },
        { module: "Boxing", startTime: "11:00", endTime: "12:00" },
        { module: "Dance", startTime: "12:00", endTime: "13:00" },
        { module: "CrossFit", startTime: "13:00", endTime: "14:00" },
        { module: "Cardio", startTime: "14:00", endTime: "15:00" },
        { module: "Pilates", startTime: "15:00", endTime: "16:00" },
        { module: "Zumba", startTime: "16:00", endTime: "17:00" },
        { module: "Aerobics", startTime: "17:00", endTime: "18:00" },
        { module: "Strength Training", startTime: "18:00", endTime: "19:00" },
        { module: "Stretching", startTime: "19:00", endTime: "20:00" },
      ],
    },
  ];

  const [currentTime, setCurrentTime] = useState(new Date());
  const currentDay = format(currentTime, "EEEE");

  const todaySchedule = schedule.find((day) => day.day === currentDay);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for a live clock
    return () => clearInterval(timer);
  }, []);

  const moduleIcons = {
    Yoga: <FaDumbbell className="mx-auto" />,
    HIIT: <FaDumbbell className="mx-auto" />,
    Spin: <FaDumbbell className="mx-auto" />,
    Boxing: <FaDumbbell className="mx-auto" />,
    Dance: <FaDumbbell className="mx-auto" />,
    CrossFit: <FaDumbbell className="mx-auto" />,
    Cardio: <FaDumbbell className="mx-auto" />,
    Pilates: <FaDumbbell className="mx-auto" />,
    Zumba: <FaDumbbell className="mx-auto" />,
    Aerobics: <FaDumbbell className="mx-auto" />,
    "Strength Training": <FaDumbbell className="mx-auto" />,
    Stretching: <FaDumbbell className="mx-auto" />,
  };

  return (
    <div className="max-w-[1200px] mx-auto py-28">
      <div className="container mx-auto px-6 text-center text-white">
        {/* Section Title */}
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          {`Today's Schedule (${currentDay})`}
        </h2>
        <div className="bg-white p-[1px] w-1/3 mx-auto"></div>
        {/* Display Current Time */}
        <p className="text-xl font-medium mb-6">
          Current Time: {format(currentTime, "hh:mm:ss a")}
        </p>

        {/* Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 ">
          {todaySchedule?.classes.map((classItem, index) => {
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
                {/* Card Content */}
                <div
                  className={`relative border border-gray-400 p-4 transition duration-300 rounded-lg hover:scale-105 ${
                    isCurrent
                      ? "bg-green-200 text-gray-800"
                      : isCompleted
                      ? "bg-gray-200 text-gray-600"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <div className="items-center mb-2">
                    <p className="text-3xl mx-auto">
                      {moduleIcons[classItem.module]}
                    </p>
                    <p className="text-2xl font-semibold text-blue-600">
                      {classItem.module}
                    </p>
                  </div>
                  <p className="text-lg font-medium mb-4">
                    {format(startTime, "hh:mm a")} -{" "}
                    {format(endTime, "hh:mm a")}
                  </p>
                  {isCurrent && (
                    <>
                      <p className="text-lg font-semibold text-green-600">
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
                    <p className="text-lg font-semibold text-gray-500">
                      Class ended
                    </p>
                  )}
                  {!isCurrent && !isCompleted && isSoon && (
                    <p className="text-lg font-semibold text-orange-500">
                      Starts in {timeToStart} minutes
                    </p>
                  )}
                  {!isCurrent && !isCompleted && !isSoon && (
                    <p className="text-lg font-semibold text-blue-500">
                      Starts at {format(startTime, "hh:mm a")}
                    </p>
                  )}
                </div>

                {/* Hover Overlay */}
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
