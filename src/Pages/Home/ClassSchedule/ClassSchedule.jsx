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
[
  {
    _id: "6759ca6e81dfcd504ed09b0e",
    module: "Aerobics",
    mainImage: "https://i.ibb.co/pX4N0gG/Aerobics.png",
    icon: "https://i.ibb.co/aerobics-icon.png",
    description:
      "A fun, high-energy workout designed to improve cardiovascular health.",
    bigDescription:
      "Aerobics is a rhythmic physical exercise that combines cardio, strength, and flexibility. It's ideal for those looking to improve endurance, boost energy, and enjoy group activities. Each class is tailored to different skill levels and includes warm-up, aerobic exercises, and cool-down.",
    classTeacher: "Alice Johnson",
    helperTeachers: ["Bob Smith", "Carla Lee"],
    fallbackTeacher: "Ethan Gray",
    additionalInfo: "Wear comfortable workout shoes and bring a water bottle.",
    difficultyLevel: "Beginner",
    prerequisites: "None",
    registrationFee: 20,
    dailyClassFee: 5,
    rating: 4.8,
    comments: [
      {
        commenterName: "Sarah Thompson",
        comment: "Amazing energy and a great way to start the day!",
        rating: 5,
      },
      {
        commenterName: "Michael Brown",
        comment: "Fun and engaging, but could use more advanced options.",
        rating: 4,
      },
    ],
  },
  {
    _id: "6759ca6e81dfcd504ed09b0f",
    module: "Boxing",
    mainImage: "https://i.ibb.co/4P4xwbX/Boxing.png",
    icon: "https://i.ibb.co/boxing-icon.png",
    description:
      "Learn boxing techniques and improve your endurance in this intense class.",
    bigDescription:
      "Boxing is an empowering and intense workout that not only enhances physical strength but also boosts mental clarity. This class includes warm-ups, technique drills, sparring (optional), and cool-downs. Ideal for those who want a high-energy, skill-focused exercise.",
    classTeacher: "Mike Tyson",
    helperTeachers: ["Anna Cruz", "James Woods"],
    fallbackTeacher: "Chris Knight",
    additionalInfo: "Gloves and wraps provided. Beginners welcome.",
    difficultyLevel: "Intermediate",
    prerequisites: "Basic fitness level recommended.",
    registrationFee: 30,
    dailyClassFee: 10,
    rating: 4.9,
    comments: [
      {
        commenterName: "John Carter",
        comment: "Challenging but extremely rewarding!",
        rating: 5,
      },
      {
        commenterName: "Emily Davis",
        comment: "Loved the intensity and the focus on techniques.",
        rating: 5,
      },
    ],
  },
  {
    _id: "6759ca6e81dfcd504ed09b10",
    module: "Cardio",
    mainImage: "https://i.ibb.co/WPsj8Wc/Cardio.png",
    icon: "https://i.ibb.co/cardio-icon.png",
    description:
      "Boost your heart rate and burn calories with this dynamic cardio session.",
    bigDescription:
      "Cardio workouts are essential for maintaining heart health and building stamina. This class is a mix of running, jumping, and other high-energy movements designed to keep you active and motivated. Suitable for all fitness levels.",
    classTeacher: "Sophie Lee",
    helperTeachers: ["Daniel White", "Laura Green"],
    fallbackTeacher: "James Hill",
    additionalInfo:
      "Bring a towel and water bottle. Comfortable shoes recommended.",
    difficultyLevel: "Beginner",
    prerequisites: "None",
    registrationFee: 25,
    dailyClassFee: 7,
    rating: 4.7,
    comments: [
      {
        commenterName: "Emma Wilson",
        comment: "Fantastic energy and great music!",
        rating: 5,
      },
      {
        commenterName: "Liam Carter",
        comment: "Good workout but the pace was a bit too fast for me.",
        rating: 4,
      },
    ],
  },
  {
    _id: "6759ca6e81dfcd504ed09b11",
    module: "CrossFit",
    mainImage: "https://i.ibb.co/QbGV5pH/CrossFit.png",
    icon: "https://i.ibb.co/crossfit-icon.png",
    description:
      "High-intensity functional movements to challenge your body and mind.",
    bigDescription:
      "CrossFit combines weightlifting, cardio, and gymnastics for a comprehensive fitness experience. It's a high-intensity program that helps improve overall strength, agility, and endurance. Classes are customized to suit advanced participants.",
    classTeacher: "Jack Rogers",
    helperTeachers: ["Linda Brown", "Steve Moore"],
    fallbackTeacher: "Maria Lopez",
    additionalInfo:
      "Bring a towel and water bottle. Previous CrossFit experience preferred.",
    difficultyLevel: "Advanced",
    prerequisites: "Prior CrossFit or weightlifting experience.",
    registrationFee: 50,
    dailyClassFee: 15,
    rating: 4.6,
    comments: [
      {
        commenterName: "Nathan Gray",
        comment: "A challenging and rewarding experience!",
        rating: 5,
      },
      {
        commenterName: "Olivia Bennett",
        comment: "The intensity is great but may not be for everyone.",
        rating: 4,
      },
    ],
  },
  {
    _id: "6759ca6e81dfcd504ed09b12",
    module: "Dance",
    mainImage: "https://i.ibb.co/5hc5h5h/Dance.png",
    icon: "https://i.ibb.co/dance-icon.png",
    description:
      "Enjoy a vibrant class that blends rhythm, coordination, and fun.",
    bigDescription:
      "Dance is a creative way to stay fit while learning rhythm and movements. Classes include various styles such as hip-hop, salsa, and contemporary, catering to all skill levels. It's a lively and engaging workout that improves coordination and confidence.",
    classTeacher: "Olivia Taylor",
    helperTeachers: ["Ryan Hall", "Sophia Carter"],
    fallbackTeacher: "Thomas King",
    additionalInfo: "No prior experience needed. Wear comfortable clothing.",
    difficultyLevel: "Beginner",
    prerequisites: "None",
    registrationFee: 15,
    dailyClassFee: 5,
    rating: 4.8,
    comments: [
      {
        commenterName: "Isabella Adams",
        comment: "Absolutely loved the energy in the class!",
        rating: 5,
      },
      {
        commenterName: "Liam Foster",
        comment:
          "Great fun, but the steps were challenging to follow at first.",
        rating: 4,
      },
    ],
  },
  {
    _id: "6759ca6e81dfcd504ed09b13",
    module: "HIIT",
    mainImage: "https://i.ibb.co/yXk1JQc/HIIT.png",
    icon: "https://i.ibb.co/hiit-icon.png",
    description:
      "A high-intensity interval training session to push your limits.",
    bigDescription:
      "HIIT is designed to burn maximum calories in a short time. The class alternates between intense bursts of activity and fixed periods of less-intense movement. It's perfect for those looking to boost metabolism and improve cardiovascular fitness.",
    classTeacher: "Ethan Ross",
    helperTeachers: ["Sophia Evans", "Mason Clark"],
    fallbackTeacher: "Amelia Parker",
    additionalInfo: "Bring water and a towel. Be prepared for a tough workout.",
    difficultyLevel: "Intermediate",
    prerequisites: "Basic fitness level required.",
    registrationFee: 25,
    dailyClassFee: 8,
    rating: 4.9,
    comments: [
      {
        commenterName: "Jackson Bennett",
        comment: "Incredible workout that left me feeling great!",
        rating: 5,
      },
      {
        commenterName: "Ella Howard",
        comment: "Loved the intensity and variety in the session.",
        rating: 5,
      },
    ],
  },
  {
    _id: "6759cb7681dfcd504ed09b14",
    module: "Pilates",
    mainImage: "https://i.ibb.co/Pilates.png",
    icon: "https://i.ibb.co/pilates-icon.png",
    description:
      "A low-impact exercise method focused on improving flexibility, strength, and body awareness.",
    bigDescription:
      "Pilates involves controlled movements that focus on core strength, posture, and balance. It's suitable for all fitness levels and is great for injury prevention and rehabilitation. Classes typically include exercises on a mat or equipment like reformers.",
    classTeacher: "Emma Roberts",
    helperTeachers: ["James Wilson", "Olivia Harris"],
    fallbackTeacher: "Lucas Lee",
    additionalInfo:
      "Wear comfortable clothes and socks, and bring a mat if required.",
    difficultyLevel: "Intermediate",
    prerequisites: "None",
    registrationFee: 25,
    dailyClassFee: 6,
    rating: 4.7,
    comments: [
      {
        commenterName: "Laura Green",
        comment: "Wonderful for improving posture and flexibility!",
        rating: 5,
      },
      {
        commenterName: "Chris Adams",
        comment: "Good class, but a bit challenging for beginners.",
        rating: 4,
      },
    ],
  },
  {
    _id: "6759cb8681dfcd504ed09b15",
    module: "Spin",
    mainImage: "https://i.ibb.co/Spin.png",
    icon: "https://i.ibb.co/spin-icon.png",
    description:
      "A high-energy cycling class designed to improve cardiovascular fitness and endurance.",
    bigDescription:
      "Spin classes are intense cycling workouts set to motivating music. These classes focus on building strength, endurance, and stamina. They are great for weight loss, improving heart health, and increasing overall fitness levels.",
    classTeacher: "John Davis",
    helperTeachers: ["Sophia Martinez", "Liam Thomas"],
    fallbackTeacher: "Mia Walker",
    additionalInfo:
      "Bring a water bottle, towel, and cycling shoes if possible.",
    difficultyLevel: "Advanced",
    prerequisites: "Basic fitness level",
    registrationFee: 30,
    dailyClassFee: 8,
    rating: 4.9,
    comments: [
      {
        commenterName: "David Moore",
        comment:
          "An intense workout that pushes your limits, but so rewarding!",
        rating: 5,
      },
      {
        commenterName: "Jessica Lee",
        comment: "Great class but could use some more variety in the routines.",
        rating: 4,
      },
    ],
  },
  {
    _id: "6759cb9281dfcd504ed09b16",
    module: "Strength Training",
    mainImage: "https://i.ibb.co/Strength-Training.png",
    icon: "https://i.ibb.co/strength-icon.png",
    description:
      "Build muscle strength and endurance with weight-based exercises.",
    bigDescription:
      "Strength training focuses on building muscle mass and increasing strength. Using weights, resistance bands, or bodyweight exercises, these classes are designed to target different muscle groups. Strength training helps with weight management, bone density, and overall fitness.",
    classTeacher: "Michael Harris",
    helperTeachers: ["Hannah Clark", "Daniel Lewis"],
    fallbackTeacher: "Grace Scott",
    additionalInfo: "Bring a water bottle and wear appropriate gym attire.",
    difficultyLevel: "Intermediate",
    prerequisites: "Basic fitness level",
    registrationFee: 35,
    dailyClassFee: 7,
    rating: 4.8,
    comments: [
      {
        commenterName: "Ryan Williams",
        comment: "A fantastic workout that really builds strength!",
        rating: 5,
      },
      {
        commenterName: "Ava Carter",
        comment: "Challenging but in a good way!",
        rating: 4,
      },
    ],
  },
  {
    _id: "6759cba181dfcd504ed09b17",
    module: "Stretching",
    mainImage: "https://i.ibb.co/Stretching.png",
    icon: "https://i.ibb.co/stretching-icon.png",
    description:
      "Improve flexibility and prevent injury through targeted stretching exercises.",
    bigDescription:
      "Stretching is essential for maintaining flexibility, reducing muscle tension, and improving range of motion. These classes focus on static and dynamic stretches that target all major muscle groups. It's ideal for recovery and injury prevention.",
    classTeacher: "Isabella Parker",
    helperTeachers: ["Alexander Bell", "Lily Green"],
    fallbackTeacher: "Ethan Wilson",
    additionalInfo: "Wear comfortable clothing, and bring a mat.",
    difficultyLevel: "Beginner",
    prerequisites: "None",
    registrationFee: 15,
    dailyClassFee: 4,
    rating: 4.6,
    comments: [
      {
        commenterName: "Olivia Taylor",
        comment: "Perfect for improving flexibility and relieving tension.",
        rating: 5,
      },
      {
        commenterName: "Samuel White",
        comment: "Very relaxing and a great way to unwind.",
        rating: 4,
      },
    ],
  },
  {
    _id: "6759cbab81dfcd504ed09b18",
    module: "Yoga",
    mainImage: "https://i.ibb.co/Yoga.png",
    icon: "https://i.ibb.co/yoga-icon.png",
    description:
      "A holistic approach to fitness combining strength, flexibility, and mental focus.",
    bigDescription:
      "Yoga integrates physical poses, breathing exercises, and meditation to promote balance and wellness. It’s suitable for all levels, helping with stress relief, flexibility, and strengthening the body and mind.",
    classTeacher: "Sophia Miller",
    helperTeachers: ["Benjamin Harris", "Mia Lewis"],
    fallbackTeacher: "Lucas Mitchell",
    additionalInfo: "Bring a mat and wear comfortable clothing.",
    difficultyLevel: "All Levels",
    prerequisites: "None",
    registrationFee: 20,
    dailyClassFee: 5,
    rating: 4.9,
    comments: [
      {
        commenterName: "Chloe Robinson",
        comment: "Incredible for both mind and body, highly recommend!",
        rating: 5,
      },
      {
        commenterName: "James Evans",
        comment: "A great way to relax and stretch after a long day.",
        rating: 4,
      },
    ],
  },
  {
    _id: "6759cbb481dfcd504ed09b19",
    module: "Zumba",
    mainImage: "https://i.ibb.co/Zumba.png",
    icon: "https://i.ibb.co/zumba-icon.png",
    description:
      "A dance-based workout that’s fun, high-energy, and burns calories.",
    bigDescription:
      "Zumba combines Latin-inspired dance moves with fitness routines. It's a fun and effective way to burn calories, improve cardiovascular health, and tone muscles. This class is suitable for all fitness levels, offering a great cardio workout.",
    classTeacher: "Natalie Evans",
    helperTeachers: ["Dylan Martin", "Rachel Clark"],
    fallbackTeacher: "Liam Davis",
    additionalInfo: "Wear comfortable shoes and bring water.",
    difficultyLevel: "Intermediate",
    prerequisites: "None",
    registrationFee: 22,
    dailyClassFee: 6,
    rating: 4.8,
    comments: [
      {
        commenterName: "Paula Robinson",
        comment: "So much fun and a great workout!",
        rating: 5,
      },
      {
        commenterName: "Carlos Perez",
        comment:
          "Energetic and enjoyable, but some routines could be simplified.",
        rating: 4,
      },
    ],
  },
];
