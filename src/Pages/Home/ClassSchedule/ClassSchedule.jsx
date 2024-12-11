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
  {
    day: "Tuesday",
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
  {
    day: "Wednesday",
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
  {
    day: "Thursday",
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
  {
    day: "Friday",
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
  {
    day: "Saturday",
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
  {
    day: "Sunday",
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

const classDetails = [
  {
    module: "Aerobics",
    image: "https://i.ibb.co.com/pX4N0gG/Aerobics.png",
    description:
      "A fun, high-energy workout designed to improve cardiovascular health.",
    currentTeacher: "Alice Johnson",
    helperTeacher: "Bob Smith",
    fallbackTeacher: "Carla Lee",
    additionalInfo:
      "Suitable for all skill levels. Bring comfortable workout shoes.",
  },
  {
    module: "Boxing",
    image: "https://i.ibb.co.com/4P4xwbX/Boxing.png",
    description:
      "Learn boxing techniques and improve your endurance in this intense class.",
    currentTeacher: "Mike Tyson",
    helperTeacher: "Anna Cruz",
    fallbackTeacher: "James Woods",
    additionalInfo: "Gloves and wraps provided. Beginners welcome.",
  },
  {
    module: "Cardio",
    image: "https://i.ibb.co.com/WPsj8Wc/Cardio.png",
    description:
      "Boost your heart rate and burn calories with this dynamic cardio session.",
    currentTeacher: "Sophie Lee",
    helperTeacher: "Daniel White",
    fallbackTeacher: "Laura Green",
    additionalInfo: "Ideal for improving stamina and heart health.",
  },
  {
    module: "CrossFit",
    image: "https://i.ibb.co.com/QbGV5pH/CrossFit.png",
    description:
      "High-intensity functional movements to challenge your body and mind.",
    currentTeacher: "Jack Rogers",
    helperTeacher: "Linda Brown",
    fallbackTeacher: "Steve Moore",
    additionalInfo: "Requires prior registration. Bring a towel.",
  },
  {
    module: "Dance",
    image: "https://i.ibb.co.com/PT2YB6J/Dance.png",
    description: "A lively dance class that blends rhythm and fitness.",
    currentTeacher: "Emily Davis",
    helperTeacher: "Chris Taylor",
    fallbackTeacher: "Emma Wilson",
    additionalInfo: "No dance experience needed. Wear comfortable clothing.",
  },
  {
    module: "HIIT",
    image: "https://i.ibb.co.com/tMyRVcp/Hiit.png",
    description:
      "High-Intensity Interval Training to maximize calorie burn in minimal time.",
    currentTeacher: "Josh Baker",
    helperTeacher: "Nina Scott",
    fallbackTeacher: "Paul Adams",
    additionalInfo:
      "Prepare for short bursts of intense exercise followed by rest.",
  },
  {
    module: "Pilates",
    image: "https://i.ibb.co.com/Tgfn9xN/Pilates.png",
    description:
      "Focus on core strength, flexibility, and overall body control.",
    currentTeacher: "Rachel Morgan",
    helperTeacher: "Evan Carter",
    fallbackTeacher: "Hannah Torres",
    additionalInfo: "Bring your own mat. Beginners are welcome.",
  },
  {
    module: "Spin",
    image: "https://i.ibb.co.com/jbr1Zzp/Spin.png",
    description:
      "An intense cycling workout designed to build strength and stamina.",
    currentTeacher: "Derek Hall",
    helperTeacher: "Megan Cooper",
    fallbackTeacher: "Nathaniel Parker",
    additionalInfo: "Cycling shoes recommended. Water bottle is a must.",
  },
  {
    module: "Strength Training",
    image: "https://i.ibb.co.com/nmB5qnk/Strength-Training.png",
    description:
      "Build muscle and improve overall strength with guided resistance exercises.",
    currentTeacher: "Brian Allen",
    helperTeacher: "Olivia Reed",
    fallbackTeacher: "Victor King",
    additionalInfo: "Focuses on weight lifting and bodyweight exercises.",
  },
  {
    module: "Stretching",
    image: "https://i.ibb.co.com/7Jp7jJF/Stretching.png",
    description:
      "Enhance your flexibility and relax your muscles with guided stretching.",
    currentTeacher: "Angela Ross",
    helperTeacher: "Gavin Martinez",
    fallbackTeacher: "Sophia Clark",
    additionalInfo:
      "Great for recovery and flexibility improvement. Bring a yoga strap if you have one.",
  },
  {
    module: "Yoga",
    image: "https://i.ibb.co.com/VC88VDK/Yoga.png",
    description:
      "A calming class focused on mindfulness, flexibility, and strength.",
    currentTeacher: "Isabella Lee",
    helperTeacher: "Thomas Hill",
    fallbackTeacher: "Lily Harris",
    additionalInfo: "Bring your own yoga mat and towel.",
  },
  {
    module: "Zumba",
    image: "https://i.ibb.co.com/8YQp48L/Zumba.png",
    description:
      "Dance your way to fitness with this fun and energetic workout.",
    currentTeacher: "Sophia Martinez",
    helperTeacher: "Liam Evans",
    fallbackTeacher: "Chloe Phillips",
    additionalInfo:
      "No prior dance experience needed. Water bottle recommended.",
  },
];

const ClassSchedule = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentDay = format(currentTime, "EEEE");

  const todaySchedule = schedule.find((day) => day.day === currentDay);

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
                    {classDetail?.image && (
                      <img
                        src={classDetail.image}
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
