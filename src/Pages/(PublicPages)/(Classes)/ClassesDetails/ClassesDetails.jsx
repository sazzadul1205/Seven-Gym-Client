import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import Classes_Background from "../../../../assets/Classes-Background/Classes_Background.jpg";

import CDReview from "./ClassesDetailsReview/ClassesDetailsReview";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../Hooks/useAuth";
import Loading from "../../../../Shared/Loading/Loading";
import FetchingError from "../../../../Shared/Component/FetchingError";

import ClassesDetailsMore from "./ClassesDetailsMore/ClassesDetailsMore";
import ClassesDetailsPrice from "./ClassesDetailsPrice/ClassesDetailsPrice";
import ClassesDetailsContent from "./ClassesDetailsContent/ClassesDetailsContent";
import ClassesDetailsSchedule from "./ClassesDetailsSchedule/ClassesDetailsSchedule";
import ClassesDetailsTrainers from "./ClassesDetailsTrainers/ClassesDetailsTrainers";
import ClassesDetailsKeyFeatures from "./ClassesDetailsKeyFeatures/ClassesDetailsKeyFeatures";
import ClassesDetailsDescription from "./ClassesDetailsDescription/ClassesDetailsDescription";

const ClassesDetails = () => {
  const axiosPublic = useAxiosPublic();
  const { module } = useParams();
  const { user } = useAuth();

  // Fetch Module Data
  const {
    data: ModuleData,
    isLoading: ModuleDataIsLoading,
    error: ModuleDataError,
  } = useQuery({
    queryKey: ["ModuleData", module], // Depend on `module`
    queryFn: async () =>
      axiosPublic
        .get(`/Class_Details?module=${module}`)
        .then((res) => res.data),
  });

  // Fetch Class Schedule
  const {
    data: ClassScheduleData,
    isLoading: ClassScheduleDataIsLoading,
    error: ClassScheduleDataError,
  } = useQuery({
    queryKey: ["ClassScheduleData", module],
    queryFn: async () =>
      axiosPublic
        .get(`/Our_Classes_Schedule/searchByModule?moduleName=${module}`)
        .then((res) => res.data),
  });

  // Extract teacher names dynamically for Trainers Data
  const teacherNames =
    ModuleData?.length > 0
      ? [
          ModuleData[0].classTeacher,
          ...ModuleData[0].helperTeachers,
          ModuleData[0].fallbackTeacher,
        ].filter(Boolean) // Remove null/undefined values
      : [];

  // Fetch Trainers Data
  const {
    data: TrainersData,
    isLoading: TrainersDataIsLoading,
    error: TrainersDataError,
  } = useQuery({
    queryKey: ["TrainersData", teacherNames],
    queryFn: async () =>
      axiosPublic
        .get(`/Trainers/SearchTrainersByNames?names=${teacherNames.join(",")}`)
        .then((res) => res.data),
    enabled: teacherNames.length > 0, // Fetch only if teachers exist
  });

  // Fetch User Data (Only if user exists)
  const {
    data: UsersData,
    isLoading: UsersDataIsLoading,
    error: UsersDataError,
  } = useQuery({
    queryKey: ["UsersData", user?.email],
    queryFn: async () =>
      axiosPublic
        .get(`/Users?email=${user.email}`)
        .then((res) => res.data)
        .catch((error) =>
          error.response?.status === 404 ? null : Promise.reject(error)
        ),
    enabled: !!user, // Fetch only if user exists
  });

  // Handle Loading State
  if (
    ModuleDataIsLoading ||
    TrainersDataIsLoading ||
    ClassScheduleDataIsLoading ||
    UsersDataIsLoading
  ) {
    return <Loading />;
  }

  // Handle Errors
  if (
    ModuleDataError ||
    TrainersDataError ||
    ClassScheduleDataError ||
    UsersDataError
  ) {
    return <FetchingError />;
  }

  const ThisModule = ModuleData[0]; // Extract the main module data

  console.log(ClassScheduleData);

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center "
      style={{
        backgroundImage: `url(${Classes_Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header Section */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-10"></div>
        <img
          src={ThisModule.mainImage}
          alt={ThisModule.module}
          className="w-full h-full object-cover brightness-75"
        />
        {/* Centered Title */}
        <div className="absolute inset-0 flex justify-center items-center z-20">
          <h1 className="text-3xl md:text-5xl text-white font-extrabold shadow-md px-6 py-3 bg-black/50 rounded-lg backdrop-blur-sm">
            {ThisModule.module}
          </h1>
        </div>
      </div>

      <div className="space-y-2 bg-linear-to-b from-gray-500/40 to-gray-500/80 pb-2">
        {/* Class Details Content */}
        <ClassesDetailsContent ThisModule={ThisModule} />

        {/* Detailed Description */}
        <ClassesDetailsDescription ThisModule={ThisModule} />

        {/* Key Features */}
        <ClassesDetailsKeyFeatures ThisModule={ThisModule} />

        {/* Pricing Section */}
        <ClassesDetailsPrice
          ThisModule={ThisModule}
          user={user}
          UsersData={UsersData}
        />

        {/* Class Schedule */}
        <ClassesDetailsSchedule ClassScheduleData={ClassScheduleData} />

        {/* Trainers Section */}
        <ClassesDetailsTrainers
          TrainersData={TrainersData}
          ThisModule={ThisModule}
        />

        {/* Additional Information */}
        <ClassesDetailsMore ThisModule={ThisModule} />

        {/* Reviews Section */}
        <CDReview ThisModule={ThisModule} />
      </div>
    </div>
  );
};

export default ClassesDetails;
