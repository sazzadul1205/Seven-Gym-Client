import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

// Import Background Image
import Classes_Background from "../../../../assets/Classes-Background/Classes_Background.jpg";

import useAuth from "../../../../Hooks/useAuth";
import Loading from "../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../Shared/Component/FetchingError";

// Component Import
import ClassesDetailsMore from "./ClassesDetailsMore/ClassesDetailsMore";
import ClassesDetailsPrice from "./ClassesDetailsPrice/ClassesDetailsPrice";
import ClassesDetailsReview from "./ClassesDetailsReview/ClassesDetailsReview";
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
    queryKey: ["ModuleData", module],
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
        .get(`/Our_Classes_Schedule/SearchByModule?moduleName=${module}`)
        .then((res) => res.data),
  });

  // Extract teacher names dynamically for Trainers Data
  const teacherNames =
    ModuleData?.length > 0
      ? [
          ModuleData[0].classTeacher,
          ...ModuleData[0].helperTeachers,
          ModuleData[0].fallbackTeacher,
        ].filter(Boolean)
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
    enabled: teacherNames.length > 0,
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
        .get(`/Users?email=${user?.email}`)
        .then((res) => res.data)
        .catch((error) =>
          error.response?.status === 404 ? null : Promise.reject(error)
        ),
    enabled: !!user,
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

  const ThisModule = ModuleData[0];

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${Classes_Background})`,
      }}
    >
      <div className="bg-linear-to-b from-black/30 to-gray-700/70 min-h-screen space-y-3">
        {/* Header Section */}
        <ClassesDetailsContent ThisModule={ThisModule} />
        {/* Class Details */}
        <ClassesDetailsDescription ThisModule={ThisModule} />
        {/* Class Key Features */}
        <ClassesDetailsKeyFeatures ThisModule={ThisModule} />
        {/* Detail Pricing */}
        <ClassesDetailsPrice
          ThisModule={ThisModule}
          user={user}
          UsersData={UsersData}
        />
        {/* Class schedule */}
        <ClassesDetailsSchedule ClassScheduleData={ClassScheduleData} />
      </div>
    </div>
  );
};

export default ClassesDetails;

// {/* Header with second background layered */}
// <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden">
//   {/* Module-specific background image */}
//   <div
//     className="absolute inset-0 bg-cover bg-center brightness-75"
//     style={{ backgroundImage: `url(${ThisModule.mainImage})` }}
//   ></div>

//   {/* Dark overlay */}
//   <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 "></div>

//   {/* Title */}
//   <div className="relative z-20 flex justify-center items-center h-full px-4 text-center">
//     <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg bg-black/50 px-6 py-3 rounded-xl backdrop-blur-sm animate-fadeIn">
//       {ThisModule.module}
//     </h1>
//   </div>
// </div>

// {/* Content below header */}
// <div className="-mt-10 md:-mt-16 px-3 md:px-10 space-y-2 bg-white/90 rounded-t-3xl shadow-md backdrop-blur-md">

//   <ClassesDetailsPrice
//     ThisModule={ThisModule}
//     user={user}
//     UsersData={UsersData}
//   />
//   <ClassesDetailsSchedule ClassScheduleData={ClassScheduleData} />
//   <ClassesDetailsTrainers
//     TrainersData={TrainersData || []}
//     ThisModule={ThisModule}
//   />
//   <ClassesDetailsMore ThisModule={ThisModule} />
//   <ClassesDetailsReview ThisModule={ThisModule} />
// </div>
