import { useParams } from "react-router";

// Import Package
import { useQuery } from "@tanstack/react-query";

// Utility Import
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FetchingError from "../../../Shared/Component/FetchingError";

// Component Import
import UserProfileTop from "./UserProfileTop/UserProfileTop";
import UserProfileGoals from "./UserProfileGoals/UserProfileGoals";
import UserProfileSocial from "./UserProfileSocial/UserProfileSocial";
import UserProfileAboutMe from "./UserProfileAboutMe/UserProfileAboutMe";
import UserProfileTrainers from "./UserProfileTrainers/UserProfileTrainers";
import UserProfileAchievements from "./UserProfileAchievements/UserProfileAchievements";
import UserProfileRecentWorkout from "./UserProfileRecentWorkout/UserProfileRecentWorkout";
import UserProfileTodaysWorkout from "./UserProfileTodaysWorkout/UserProfileTodaysWorkout";
import UserProfileAttendingClasses from "./UserProfileAttendingClasses/UserProfileAttendingClasses";

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
    data: BookedTrainerData,
    isLoading: BookedTrainerLoading,
    error: BookedTrainerError,
  } = useQuery({
    queryKey: ["BookedTrainer", trainerNames],
    queryFn: async () => {
      if (trainerNames.length === 0) return [];
      const res = await axiosPublic.get(
        `/Trainers/SearchTrainersByNames?names=${trainerNames.join(",")}`
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

  // Load States
  if (UsersLoading || BookedTrainerLoading || ClassesIsLoading)
    return <Loading />;

  // Error States
  if (UsersError || BookedTrainerError || ClassesError) {
    console.error(
      "Error fetching data:",
      UsersError || BookedTrainerError || ClassesError
    );
    return <FetchingError />;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-300">
      {/* Top section */}
      <UserProfileTop usersData={UsersData} user={user} confEmail={email} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-5 pb-5">
        {/* Info Section */}
        <div className="w-full lg:w-1/2 ">
          {/* Title */}
          <h2 className="text-2xl text-black font-semibold">
            {UsersData?.fullName || "Default Name"} Information
          </h2>
          {/* Border */}
          <div className="bg-black p-[1px] my-2"></div>
          {/* Content */}
          <div className="space-y-6 pt-2">
            {/* About Me */}
            <UserProfileAboutMe usersData={UsersData} />

            {/* Socials Links */}
            <UserProfileSocial usersData={UsersData} />

            {/* Selected Goals */}
            <UserProfileGoals usersData={UsersData} />

            {/* Current Teacher */}
            <UserProfileTrainers BookedTrainerData={BookedTrainerData} />

            {/* Current Attending Classes */}
            <UserProfileAttendingClasses ClassesData={ClassesData} />
          </div>
        </div>

        {/* Achievements and Notifications */}
        <div className="w-full lg:w-1/2 space-y-8 pt-10">
          {/* Achievements */}
          <UserProfileAchievements usersData={UsersData} refetch={refetch} />

          {/* Recent Workouts */}
          <UserProfileTodaysWorkout usersData={UsersData} refetch={refetch} />

          {/* Recent Workouts */}
          <UserProfileRecentWorkout usersData={UsersData} refetch={refetch} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
