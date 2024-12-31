import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";
import { FaDumbbell, FaWeight, FaRegPlusSquare } from "react-icons/fa";
import UPMainInfo from "./UPDetailes/UPMainInfo";
import UPSocialLinks from "./UPDetailes/UPSocialLinks";
import UPTopSection from "./UPDetailes/UPTopSection";
import UPSelectedGoals from "./UPDetailes/UPSelectedGoals";
import UPAchievements from "./UPDetailes/UPAchievements";
import UPRecentWorkout from "./UPDetailes/UPRecentWorkout";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";

const UserProfile = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Fetch data
  const {
    data: UsersDatas,
    isLoading: UsersLoading,
    error: UsersError,
  } = useQuery({
    queryKey: ["UsersData"],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${user.email}`).then((res) => res.data),
  });

  if (UsersLoading) return <Loading />;
  if (UsersError) {
    console.error("Error fetching data:", UsersError);
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-3xl text-red-500 font-bold mb-8">
          {UsersError
            ? "Failed to load forum threads."
            : "Failed to load categories."}
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  // Mock Data (simulating response from API)
  const usersData = {
    fullName: "sazzadul",
    email: "user@gmail.com",
    phone: "+8801917335945",
    dob: "2001-04-28",
    gender: "Male",
    tier: "Bronze",
    profileImage: "https://i.ibb.co.com/Vv5xMBx/blob.jpg",
    backgroundImage: "https://i.ibb.co.com/j60QJXc/Background.jpg",
    selectedGoals: [
      "Muscle Gain",
      "Cardio Improvement",
      "Sports Performance",
      "Rehabilitation",
      "Posture Correction",
      "Strength Training",
    ],
    creationTime: "December 23, 2024 at 11:49:56 PM",
    role: "Member",
    socialLinks: {
      instagram: "https://instagram.com/johndoe",
      facebook: "https://facebook.com/johndoe",
    },
    recentWorkouts: [
      {
        name: "Morning Run",
        duration: "45 minutes",
        date: "31/12/2024 7:30 AM",
        calories: "400 kcal",
      },
      {
        name: "Yoga",
        duration: "30 minutes",
        date: "31/12/2024 8:15 AM",
        calories: "200 kcal",
      },
      {
        name: "HIIT Workout",
        duration: "25 minutes",
        date: "31/12/2024 9:00 AM",
        calories: "350 kcal",
      },
      {
        name: "Cycling",
        duration: "60 minutes",
        date: "31/12/2024 10:00 AM",
        calories: "500 kcal",
      },
      {
        name: "Swimming",
        duration: "40 minutes",
        date: "31/12/2024 11:00 AM",
        calories: "300 kcal",
      },
      {
        name: "Strength Training",
        duration: "60 minutes",
        date: "31/12/2024 12:00 PM",
        calories: "550 kcal",
      },
      {
        name: "Boxing",
        duration: "50 minutes",
        date: "31/12/2024 1:30 PM",
        calories: "450 kcal",
      },
      {
        name: "Pilates",
        duration: "35 minutes",
        date: "31/12/2024 3:00 PM",
        calories: "250 kcal",
      },
      {
        name: "Zumba",
        duration: "40 minutes",
        date: "31/12/2024 4:30 PM",
        calories: "300 kcal",
      },
      {
        name: "Jogging",
        duration: "30 minutes",
        date: "31/12/2024 6:00 PM",
        calories: "200 kcal",
      },
    ],

    badges: [
      { name: "10 Workouts Completed", icon: FaDumbbell },
      { name: "5kg Weight Loss", icon: FaWeight },
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
  console.log(UsersDatas);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 to-indigo-500">
      {/* Header */}
      <div className="bg-[#F72C5B] py-12"></div>

      {/* Top section */}
      <UPTopSection usersData={usersData} />

      <div className="max-w-7xl mx-auto flex justify-between gap-6 px-6 pb-10">
        {/* Info Section */}
        <div className="w-1/2">
          <h2 className="text-2xl font-semibold text-white border-b">
            User Information
          </h2>
          <div className="space-y-2">
            {/* Main Info */}
            <UPMainInfo usersData={usersData} />

            {/* Socials Links */}
            <UPSocialLinks usersData={usersData} />

            {/* Selected Goals */}
            <UPSelectedGoals usersData={usersData} />

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
          <UPAchievements usersData={usersData} />

          {/* Recent Workouts */}
          <UPRecentWorkout usersData={usersData} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
