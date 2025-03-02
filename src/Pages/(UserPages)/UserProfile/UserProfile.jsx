import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";
import UPMainInfo from "./UPDetailes/UPMainInfo/UPMainInfo";
import UPSocialLinks from "./UPDetailes/UPSocialLinks/UPSocialLinks";
import UPTopSection from "./UPDetailes/UPTopSection/UPTopSection";
import UPSelectedGoals from "./UPDetailes/UPSelectedGoals/UPSelectedGoals";
import UPAchievements from "./UPDetailes/UPAchievements/UPAchievements";
import UPRecentWorkout from "./UPDetailes/UPRecentWorkout/UPRecentWorkout";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";
import UPTeachers from "./UPDetailes/UPTeachers/UPTeachers";
import UPAttendingClasses from "./UPDetailes/UPAttendingClasses/UPAttendingClasses";
import { useParams } from "react-router";
import UPTodaysWorkout from "./UPDetailes/UPTodaysWorkout/UPTodaysWorkout";

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

  // Extract trainer names from usersData.attendingTrainer
  const trainerNames =
    UsersData?.attendingTrainer?.map((trainer) => trainer.name) || [];
  // Extract class names from usersData.attendingClasses
  const classesName =
    UsersData?.attendingClasses?.map((classItem) => classItem.className) || [];

  // Fetch trainer details
  const {
    data: TrainerDetailsData,
    isLoading: TrainerDetailsLoading,
    error: TrainerDetailsError,
  } = useQuery({
    queryKey: ["TrainerDetails", trainerNames],
    queryFn: async () => {
      if (trainerNames.length === 0) return [];
      const res = await axiosPublic.get(
        `/Trainers/searchByNames?names=${trainerNames.join(",")}`
      );
      return res.data;
    },
    enabled: trainerNames.length > 0, // Prevent fetching if trainerNames are empty
  });

  // Fetch class details
  const {
    data: ClassesData,
    isLoading: ClassesIsLoading,
    error: ClassesError,
  } = useQuery({
    queryKey: ["ClassesData", classesName],
    queryFn: async () => {
      if (classesName.length === 0) return [];
      const res = await axiosPublic.get(
        `/Class_Details/multi?modules=${classesName.join(",")}`
      );
      return res.data;
    },
    enabled: classesName.length > 0,
  });

  if (UsersLoading || TrainerDetailsLoading || ClassesIsLoading)
    return <Loading />;
  if (UsersError || TrainerDetailsError || ClassesError) {
    console.error(
      "Error fetching data:",
      UsersError || TrainerDetailsError || ClassesError
    );
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-linear-to-br from-blue-300 to-white">
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#F72C5B] py-12"></div>

      {/* Top section */}
      <UPTopSection usersData={UsersData} user={user} confEmail={email} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-5 pb-5">
        {/* Info Section */}
        <div className="w-full lg:w-1/2 ">
          <h2 className="text-2xl font-semibold text-gray-800 border-b border-black pb-2 text-center lg:text-left">
            {UsersData?.fullName || "Default Name"} Information
          </h2>
          <div className="space-y-6 pt-2">
            {/* Main Info */}
            <UPMainInfo usersData={UsersData} />

            {/* Socials Links */}
            <UPSocialLinks usersData={UsersData} />

            {/* Selected Goals */}
            <UPSelectedGoals usersData={UsersData} />

            {/* Current Teacher */}
            <UPTeachers TrainerDetailsData={TrainerDetailsData} />

            {/* Current Attending Classes */}
            <UPAttendingClasses ClassesData={ClassesData} />
          </div>
        </div>

        {/* Achievements and Notifications */}
        <div className="w-full lg:w-1/2 space-y-8 pt-10">
          {/* Achievements */}
          <UPAchievements usersData={UsersData} refetch={refetch} />

          {/* Recent Workouts */}
          <UPTodaysWorkout usersData={UsersData} refetch={refetch} />

          {/* Recent Workouts */}
          <UPRecentWorkout usersData={UsersData} refetch={refetch} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
