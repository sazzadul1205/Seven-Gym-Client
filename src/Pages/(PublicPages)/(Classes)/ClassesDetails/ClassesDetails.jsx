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
          error.response?.status === 404 ? [] : Promise.reject(error)
        ),
    enabled: !!user,
  });

  // Fetch Module Data
  const {
    data: ClassData,
    isLoading: ClassDataIsLoading,
    error: ClassDataError,
  } = useQuery({
    queryKey: ["ClassData", module],
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

  // Map through all and get _id array
  const trainerIds = ClassData?.trainers?.map((trainer) => trainer?._id) || [];

  // Fetch Trainers Data
  const {
    data: TrainersData,
    isLoading: TrainersDataIsLoading,
    error: TrainersDataError,
  } = useQuery({
    queryKey: ["TrainersDataByIds", trainerIds],
    queryFn: async () =>
      axiosPublic
        .get(`/Trainers/BasicInfo?ids=${trainerIds.join(",")}`)
        .then((res) => res.data),
    enabled: trainerIds.length > 0,
  });

  // Handle Loading State
  if (
    ClassDataIsLoading ||
    UsersDataIsLoading ||
    TrainersDataIsLoading ||
    ClassScheduleDataIsLoading
  ) {
    return <Loading />;
  }

  // // Handle Errors
  if (
    ClassDataError ||
    UsersDataError ||
    TrainersDataError ||
    ClassScheduleDataError
  ) {
    return <FetchingError />;
  }

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${Classes_Background})`,
      }}
    >
      <div className="bg-linear-to-b from-black/30 to-gray-700/70 min-h-screen space-y-3">
        {/* Header Section */}
        <ClassesDetailsContent ThisModule={ClassData} />

        {/* Class Details */}
        <ClassesDetailsDescription ThisModule={ClassData} />

        {/* Class Key Features */}
        <ClassesDetailsKeyFeatures ThisModule={ClassData} />

        {/* Detail Pricing */}
        <ClassesDetailsPrice
          ThisModule={ClassData}
          user={user}
          UsersData={UsersData}
        />

        {/* Class schedule */}
        <ClassesDetailsSchedule ClassScheduleData={ClassScheduleData} />

        {/* Classes Trainer */}
        <ClassesDetailsTrainers TrainersData={TrainersData} />

        {/* Class Details */}
        <ClassesDetailsMore ThisModule={ClassData} />

        {/* Class Testimonials */}
        <ClassesDetailsReview ThisModule={ClassData} />
      </div>
    </div>
  );
};

export default ClassesDetails;
