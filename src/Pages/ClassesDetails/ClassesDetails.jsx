import { useParams } from "react-router";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../Shared/Loading/Loading";
import CDTrainers from "./CDContent/CDTrainers";
import CDPrice from "./CDContent/CDPrice";
import CDSchedule from "./CDContent/CDSchedule";
import CDReview from "./CDContent/CDReview";
import CDMore from "./CDContent/CDMore";

const ClassesDetails = () => {
  const axiosPublic = useAxiosPublic();
  let { module } = useParams();

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

  // Handle loading and error states
  if (
    ModuleDataIsLoading ||
    TrainersDataIsLoading ||
    ClassScheduleDataIsLoading
  ) {
    return <Loading />;
  }

  if (ModuleDataError || TrainersDataError || ClassScheduleDataError) {
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

  // Helper to categorize and assign roles to trainers
  const getTrainerRole = (trainer) => {
    if (trainer.name === ThisModule.classTeacher) return "Class Teacher";
    if (ThisModule.helperTeachers.includes(trainer.name)) return "Helper";
    if (trainer.name === ThisModule.fallbackTeacher) return "Fallback Teacher";
    return "Unknown Role";
  };

  // Calculate the average rating from comments
  const calculateAverageRating = (comments) => {
    if (comments.length === 0) return 0;
    const totalRating = comments.reduce(
      (acc, comment) => acc + comment.rating,
      0
    );
    return totalRating / comments.length;
  };

  const averageRating = calculateAverageRating(ThisModule.comments);

  // Star rating rendering
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <span key={index} className="text-yellow-500">
              ★
            </span>
          ))}
        {halfStar && <span className="text-yellow-500">★</span>}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <span key={index} className="text-gray-400">
              ★
            </span>
          ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative">
        <img
          src={ThisModule.mainImage}
          alt={ThisModule.module}
          className="w-full h-[400px] object-cover brightness-75"
        />
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <h1 className="text-5xl text-white font-bold bg-black bg-opacity-50 px-8 py-2 rounded-lg">
            {ThisModule.module}
          </h1>
        </div>
      </div>

      {/* CDContent Section */}
      <div className="max-w-7xl mx-auto p-6 md:p-12 bg-white shadow-lg rounded-lg -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left CDContent */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Description
              </h3>
              <p className="text-gray-600 mt-2">{ThisModule.description}</p>
            </div>

            {/* Additional Info */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Additional Info
              </h3>
              <p className="text-gray-600 mt-2">{ThisModule.additionalInfo}</p>
            </div>

            {/* Difficulty Level */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Difficulty Level
              </h3>
              <p className="text-gray-600 mt-2">{ThisModule.difficultyLevel}</p>
            </div>

            {/* Prerequisites */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Prerequisites
              </h3>
              <p className="text-gray-600 mt-2">{ThisModule.prerequisites}</p>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col items-center border-2 border-gray-200 rounded-lg p-6 bg-gray-50 shadow-inner">
            <img
              src={ThisModule.icon}
              alt={ThisModule.module}
              className="w-24 h-24 object-cover mb-4"
            />
            <p className="text-lg font-medium text-gray-700">
              Module: <span className="text-gray-900">{ThisModule.module}</span>
            </p>
            <p className="text-gray-600 mt-2 text-center">
              Explore and enjoy this exciting and engaging activity tailored for
              all!
            </p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className=" p-6  max-w-[1200px] mx-auto">
        <h3 className="text-2xl font-semibold text-gray-800">Key Features</h3>
        <div className="flex px-3 gap-5 pt-2">
          {ThisModule.tags.map((feature, index) => (
            <p key={index} className="bg-blue-300 px-8 py-2 rounded-full">
              {feature}
            </p>
          ))}
        </div>
      </div>

      {/* More Info */}

      {/* Detailed Description */}
      <div className="max-w-[1200px] mx-auto pt-5 space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          Detailed Description
        </h3>
        <p>{ThisModule.detailedDescription || ThisModule.bigDescription}</p>
      </div>

      {/* Trainer Cards */}
      <CDTrainers TrainersData={TrainersData} getTrainerRole={getTrainerRole} />

      {/* Pricing Section */}
      <CDPrice ThisModule={ThisModule} />

      {/* Class Schedule */}
      <CDSchedule ClassScheduleData={ClassScheduleData} />

      {/* More Info */}
      <CDMore ThisModule={ThisModule} />

      {/* Reviews Section */}
      <CDReview
        ThisModule={ThisModule}
        averageRating={averageRating}
        renderStars={renderStars}
      />
    </div>
  );
};

export default ClassesDetails;
