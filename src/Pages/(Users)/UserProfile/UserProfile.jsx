import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";
import UPMainInfo from "./UPDetailes/UPMainInfo";
import UPSocialLinks from "./UPDetailes/UPSocialLinks";
import UPTopSection from "./UPDetailes/UPTopSection";
import UPSelectedGoals from "./UPDetailes/UPSelectedGoals";
import UPAchievements from "./UPDetailes/UPAchievements/UPAchievements";
import UPRecentWorkout from "./UPDetailes/UPRecentWorkout";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";
import UPTeachers from "./UPDetailes/UPTeachers";
import UPAttendingClasses from "./UPDetailes/UPAttendingClasses";
import { useParams } from "react-router";

const UserProfile = () => {
  const { user } = useAuth();
  const { email } = useParams();
  const axiosPublic = useAxiosPublic();

  // Fetch data
  const {
    data: UsersData,
    isLoading: UsersLoading,
    error: UsersError,
    refetch,
  } = useQuery({
    queryKey: ["UsersData"],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${email}`).then((res) => res.data),
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#F72C5B] py-12"></div>

      {/* Top section */}
      <UPTopSection usersData={UsersData} user={user} confEmail={email} />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6 pb-10">
        {/* Info Section */}
        <div className="w-full md:w-1/2 bg-slate-50 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-black border-b">
            User Information
          </h2>
          <div className="space-y-5">
            {/* Main Info */}
            <UPMainInfo usersData={UsersData} />

            {/* Socials Links */}
            <UPSocialLinks usersData={UsersData} />

            {/* Selected Goals */}
            <UPSelectedGoals usersData={UsersData} />

            {/* Current Teacher */}
            <UPTeachers usersData={UsersData} />

            {/* Current Attending Classes */}
            <UPAttendingClasses usersData={UsersData} />
          </div>
        </div>

        {/* Achievements and Notifications */}
        <div className="w-full md:w-1/2">
          {/* Achievements */}
          <UPAchievements usersData={UsersData} refetch={refetch} />

          {/* Recent Workouts */}
          <UPRecentWorkout usersData={UsersData} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
