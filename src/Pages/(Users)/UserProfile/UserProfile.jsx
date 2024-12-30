import React from "react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";
import {
  FaPhoneAlt,
  FaBirthdayCake,
  FaVenusMars,
  FaBullseye,
  FaCheckCircle,
  FaTimesCircle,
  FaInstagram,
  FaStar,
  FaDumbbell,
  FaWeight,
  FaChalkboardTeacher,
  FaRegPlusSquare,
} from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";

const UserProfile = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Mock Data (simulating response from API)
  const usersData = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    dob: "1990-05-15",
    gender: "Male",
    tier: "Gold",
    profileImage: "https://via.placeholder.com/150",
    selectedGoals: ["Lose 5kg", "Run a marathon", "Increase strength"],
    creationTime: "2023-01-01",
    socialLinks: {
      instagram: "https://instagram.com/johndoe",
      facebook: "https://facebook.com/johndoe",
    },
    workoutProgress: 70,
    workoutStreak: 20,
    recentWorkouts: [
      { name: "Morning Run", duration: "45 minutes", calories: "400 kcal" },
      { name: "Yoga", duration: "30 minutes", calories: "200 kcal" },
    ],
    reviews: [{ rating: 4.5, comment: "Great platform, keeps me motivated!" }],
    badges: [
      { name: "10 Workouts Completed", icon: FaDumbbell },
      { name: "5kg Weight Loss", icon: FaWeight },
    ],
    notifications: [
      { message: "New workout challenge available!", link: "/challenges" },
      { message: "Your trainer has updated your plan.", link: "/trainer-plan" },
    ],
    currentTeacher: {
      name: "Jane Smith",
      title: "Personal Trainer",
      profileImage: "https://via.placeholder.com/150",
      bio: "Expert in strength training and weight loss, passionate about motivating individuals to reach their fitness goals.",
    },
    currentClasses: [
      {
        className: "Yoga Class",
        time: "10:00 AM - 11:00 AM",
        instructor: "Jane Smith",
      },
      {
        className: "Cardio Blast",
        time: "2:00 PM - 3:00 PM",
        instructor: "John Doe",
      },
    ],
  };

  const getTierBadge = (tier) => {
    const styles = {
      Bronze: "bg-orange-600 text-white ring-2 ring-orange-300 shadow-lg",
      Silver: "bg-gray-400 text-white ring-2 ring-gray-200 shadow-lg",
      Gold: "bg-yellow-500 text-white ring-2 ring-yellow-300 shadow-lg",
      Diamond: "bg-blue-600 text-white ring-2 ring-blue-300 shadow-lg",
      Platinum: "bg-gray-800 text-white ring-2 ring-gray-500 shadow-lg",
    };
    return styles[tier] || "bg-gray-200 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 to-indigo-500">
      {/* Header */}
      <div className="bg-[#F72C5B] py-12"></div>

      {/* Top section */}
      <div className="relative pb-24">
        <img
          src={`https://via.placeholder.com/1200x400`}
          alt="Background Image"
          className="w-full h-[400px] object-cover rounded-lg shadow-lg"
        />
        <div className="relative">
          {/* User section */}
          <div className="absolute bottom-[-50px] left-16 flex items-center space-x-4">
            <img
              src={usersData?.profileImage || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-md"
            />
            <div className="ml-4">
              <h2 className="text-4xl font-semibold text-white">
                {usersData?.fullName || "Default Name"}
              </h2>
              {/* Tier Badge */}
              <div className="pb-1">
                {usersData?.tier && (
                  <span
                    className={`inline-block px-4 py-2 mt-2 rounded-full text-sm font-semibold ${getTierBadge(
                      usersData.tier
                    )}`}
                  >
                    {usersData.tier} Tier
                  </span>
                )}
              </div>
              <p className="text-white">
                {usersData?.email || "example@example.com"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex justify-between gap-6 px-6 pb-10">
        {/* Info Section */}
        <div className="space-y-8 w-1/2">
          <h2 className="text-2xl font-semibold text-white border-b pb-4">
            User Information
          </h2>
          <div>
            {/* Main Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
              {/* Phone */}
              <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-200">
                <FaPhoneAlt className="text-blue-500 text-2xl" />
                <p className="text-gray-600">
                  <strong className="text-white">Phone:</strong>
                  <span className="text-gray-50 ml-4">
                    {usersData?.phone || "N/A"}
                  </span>
                </p>
              </div>

              {/* Date of Birth */}
              <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-200">
                <FaBirthdayCake className="text-pink-500 text-2xl" />
                <p className="text-gray-600">
                  <strong className="text-white">Date of Birth:</strong>
                  <span className="text-gray-50 ml-4">
                    {usersData?.dob || "N/A"}
                  </span>
                </p>
              </div>

              {/* Gender */}
              <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-200">
                <FaVenusMars className="text-green-500 text-2xl" />
                <p className="text-gray-600">
                  <strong className="text-white">Gender:</strong>
                  <span className="text-gray-50 ml-4">
                    {usersData?.gender || "N/A"}
                  </span>
                </p>
              </div>

              {/* Facebook */}
              <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-200">
                <FaSquareFacebook className="text-[#1877F2] text-2xl" />
                <p className="text-gray-600">
                  <strong className="text-white">Facebook:</strong>
                  <span className="text-gray-50 ml-4">
                    {usersData?.Facebook || "N/A"}
                  </span>
                </p>
              </div>

              {/* Gender */}
              <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-200">
                <FaVenusMars className="text-green-500 text-2xl" />
                <p className="text-gray-600">
                  <strong className="text-white">Gender:</strong>
                  <span className="text-gray-50 ml-4">
                    {usersData?.gender || "N/A"}
                  </span>
                </p>
              </div>

              {/* Gender */}
              <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-200">
                <FaVenusMars className="text-green-500 text-2xl" />
                <p className="text-gray-600">
                  <strong className="text-white">Gender:</strong>
                  <span className="text-gray-50 ml-4">
                    {usersData?.gender || "N/A"}
                  </span>
                </p>
              </div>
            </div>

            {/* Selected Goals */}
            <div className="py-5">
              <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                <FaBullseye className="text-red-500" />
                <span>Selected Goals</span>
              </h3>
              <div className="grid grid-cols-3 pl-3 text-gray-600 mt-5 gap-5">
                {usersData?.selectedGoals &&
                usersData.selectedGoals.length > 0 ? (
                  usersData.selectedGoals.map((goal, index) => (
                    <p
                      key={index}
                      className="flex items-center space-x-1 bg-slate-200 py-1 px-2 rounded-lg hover:bg-slate-300 transition-colors duration-300"
                    >
                      <FaCheckCircle className="text-green-500" />
                      <span>{goal}</span>
                    </p>
                  ))
                ) : (
                  <li className="flex items-center space-x-2">
                    <FaTimesCircle className="text-red-500" />
                    <span>No goals selected.</span>
                  </li>
                )}
              </div>
            </div>

            {/* Current Teacher */}
            <div className="space-y-4 mt-8">
              <h3 className="text-xl font-semibold text-white">
                Current Teacher
              </h3>
              <div className="flex items-center space-x-4 bg-slate-200 p-4 rounded-lg shadow-lg">
                <img
                  src={usersData.currentTeacher.profileImage}
                  alt="Teacher"
                  className="w-20 h-20 rounded-full border-4 border-white shadow-md"
                />
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    {usersData.currentTeacher.name}
                  </h4>
                  <p className="text-gray-600">
                    {usersData.currentTeacher.title}
                  </p>
                  <p className="text-gray-500 mt-2">
                    {usersData.currentTeacher.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Attending Classes */}
            <div className="space-y-4 mt-8">
              <h3 className="text-xl font-semibold text-white">
                Current Attending Classes
              </h3>
              <div className="space-y-2">
                {usersData?.currentClasses?.map((classItem, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-gray-600 bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200 transition-all duration-200"
                  >
                    <p>{classItem.className}</p>
                    <p>{classItem.time}</p>
                    <p>{classItem.instructor}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements and Notifications */}
        <div className="w-1/2 space-y-8">
          {/* Achievements */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white pb-2">
              <h3 className="text-xl font-semibold text-white">Achievements</h3>
              <FaRegPlusSquare className="text-3xl font-bold hover:scale-105 text-white" />
            </div>
            <div className="flex flex-wrap gap-4">
              {usersData?.badges?.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-slate-200 p-4 rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
                >
                  {React.createElement(badge.icon, {
                    className: "text-green-600",
                  })}
                  <span className="">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Workouts */}
          <div className="space-y-4 mt-8">
            <div className="flex justify-between items-center border-b border-white pb-2">
              <h3 className="text-xl font-semibold text-white">
                Recent Workouts
              </h3>
              <FaRegPlusSquare className="text-3xl font-bold hover:scale-105 text-white" />
            </div>
            <div className="space-y-2">
              {usersData?.recentWorkouts?.map((workout, index) => (
                <div
                  key={index}
                  className="flex justify-between text-gray-600 bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200 transition-all duration-200"
                >
                  <p>{workout.name}</p>
                  <p>{workout.duration}</p>
                  <p>{workout.calories}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-4 mt-8">
            <div className="flex justify-between items-center border-b border-white pb-2">
              <h3 className="text-xl font-semibold text-white">
                Notifications
              </h3>
              <FaRegPlusSquare className="text-3xl font-bold hover:scale-105 text-white" />
            </div>
            <div className="space-y-2">
              {usersData?.notifications?.map((notification, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-md hover:bg-gray-200 transition-all duration-200"
                >
                  <p className="">{notification.message}</p>
                  <a href={notification.link} className="text-blue-500">
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
