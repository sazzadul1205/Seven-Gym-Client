import { useParams } from "react-router";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../Shared/Loading/Loading";
import CDTrainers from "./CDContent/CDTrainers";
import CDPrice from "./CDContent/CDPrice";
import CDSchedule from "./CDContent/CDSchedule";
import CDReview from "./CDContent/CDReview";
import CDMore from "./CDContent/CDMore";
import CDContent from "./CDContent/CDContent";
import ClassesDetailsModal from "./ClassesDetailsModal/ClassesDetailsModal";
import useAuth from "../../Hooks/useAuth";

const ClassesDetails = () => {
  const axiosPublic = useAxiosPublic();
  let { module } = useParams();
  const { user } = useAuth();

  // Fetching data for Module
  const {
    data: ModuleData,
    isLoading: ModuleDataIsLoading,
    error: ModuleDataError,
  } = useQuery({
    queryKey: ["ModuleData"],
    queryFn: () =>
      axiosPublic
        .get(`/Class_Details?module=${module}`)
        .then((res) => res.data),
  });

  // Fetching data for ClassSchedule
  const {
    data: ClassScheduleData,
    isLoading: ClassScheduleDataIsLoading,
    error: ClassScheduleDataError,
  } = useQuery({
    queryKey: ["ClassScheduleData"],
    queryFn: () =>
      axiosPublic
        .get(`/Our_Classes/searchByModule?moduleName=${module}`)
        .then((res) => res.data),
  });

  // Derived teacher names from ModuleData
  const teacherNames =
    ModuleData && ModuleData.length > 0
      ? [
          ModuleData[0].classTeacher,
          ...ModuleData[0].helperTeachers,
          ModuleData[0].fallbackTeacher,
        ]
      : [];

  // Fetching data for Trainers (using teacherNames dynamically)
  const {
    data: TrainersData,
    isLoading: TrainersDataIsLoading,
    error: TrainersDataError,
  } = useQuery({
    queryKey: ["TrainersData", teacherNames],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers/searchByNames?names=${teacherNames.join(",")}`)
        .then((res) => res.data),
    enabled: teacherNames.length > 0, // Prevent fetching if teacherNames are empty
  });

  // Fetching data for UsersData
  const {
    data: UsersData,
    isLoading: UsersDataIsLoading,
    error: UsersDataError,
  } = useQuery({
    queryKey: ["UsersData"],
    queryFn: () => {
      if (!user) {
        return null; // Return null if no user
      }
      return axiosPublic
        .get(`/Users?email=${user.email}`)
        .then((res) => res.data)
        .catch((error) => {
          if (error.response?.status === 404) {
            return null; // Handle 404 as no data found
          }
          throw error; // Rethrow other errors
        });
    },
    enabled: !!user, // Only fetch if user exists
  });

  // Handle loading and error states
  if (
    ModuleDataIsLoading ||
    TrainersDataIsLoading ||
    ClassScheduleDataIsLoading ||
    UsersDataIsLoading
  ) {
    return <Loading />;
  }

  if (
    ModuleDataError ||
    TrainersDataError ||
    ClassScheduleDataError ||
    UsersDataError
  ) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  const ThisModule = ModuleData[0];

  return (
    <div className="min-h-screen bg-[#f72c5b44]">
      {/* Header Image */}
      <div className="relative">
        <img
          src={ThisModule.mainImage}
          alt={ThisModule.module}
          className="w-full h-[300px] md:h-[400px] object-cover brightness-75"
        />
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <h1 className="text-3xl md:text-5xl text-white font-bold bg-black bg-opacity-50 px-6 py-2 rounded-lg text-center">
            {ThisModule.module}
          </h1>
        </div>
      </div>

      {/* CDContent Section */}
      <CDContent ThisModule={ThisModule} />

      {/* Key Features */}
      <div className="max-w-7xl py-5 px-5 mx-auto mt-5 bg-gray-50 rounded-lg shadow-2xl">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
          Key Features :
        </h3>
        <div className="flex flex-wrap px-3 gap-3 md:gap-5 pt-5">
          {ThisModule.tags.map((feature, index) => (
            <p
              key={index}
              className="bg-[#F72C5B] text-white font-semibold px-4 md:px-6 py-2 rounded-full text-center text-sm sm:text-base hover:scale-110"
            >
              {feature}
            </p>
          ))}
        </div>
      </div>

      {/* Detailed Description */}
      <div className="max-w-7xl py-10 px-5 mx-auto mt-5 bg-gray-50 rounded-lg shadow-2xl">
        <h3 className="text-2xl font-semibold text-gray-800 py-2">
          Detailed Description
        </h3>
        <p className="leading-relaxed text-lg italic">
          {ThisModule.detailedDescription || ThisModule.bigDescription}
        </p>
      </div>

      {/* Pricing Section */}
      <CDPrice ThisModule={ThisModule} />

      {/* Class Schedule */}
      <CDSchedule ClassScheduleData={ClassScheduleData} />

      {/* Trainer Cards */}
      <CDTrainers TrainersData={TrainersData} ThisModule={ThisModule} />

      {/* More Info */}
      <CDMore ThisModule={ThisModule} />

      {/* Reviews Section */}
      <CDReview ThisModule={ThisModule} />

      {/* Module */}
      <dialog id="my_modal_2" className="modal">
        <ClassesDetailsModal
          ThisModule={ThisModule}
          user={user}
          UsersData={UsersData}
        />
      </dialog>
    </div>
  );
};

export default ClassesDetails;
