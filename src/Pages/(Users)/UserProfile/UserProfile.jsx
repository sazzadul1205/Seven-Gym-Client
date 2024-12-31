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
import UPTeachers from "./UPDetailes/UPTeachers";

const UserProfile = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Fetch data
  const {
    data: UsersData,
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
  const usersDataMore = {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#F72C5B] py-12"></div>

      {/* Top section */}
      <UPTopSection usersData={UsersData} />

      <div className="max-w-7xl mx-auto flex justify-between gap-6 pb-10">
        {/* Info Section */}
        <div className="w-1/2 bg-slate-50 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-black border-b">
            User Information
          </h2>
          <div className="space-y-2">
            {/* Main Info */}
            <UPMainInfo usersData={UsersData} />

            {/* Socials Links */}
            <UPSocialLinks usersData={UsersData} />

            {/* Selected Goals */}
            <UPSelectedGoals usersData={UsersData} />

            {/* Current Teacher */}
            <UPTeachers usersData={usersDataMore} />

            {/* Current Attending Classes */}
            {/* <div className="space-y-4 mt-8">
              <h3 className="text-xl font-semibold text-white">
                Current Attending Classes
              </h3>
              <div className="space-y-2">
                {UsersData?.currentClasses?.map((classItem, index) => (
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
            </div> */}
          </div>
        </div>

        {/* Achievements and Notifications */}
        <div className="w-1/2 space-y-8">
          {/* Achievements */}
          <UPAchievements usersData={UsersData} />

          {/* Recent Workouts */}
          <UPRecentWorkout usersData={UsersData} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
