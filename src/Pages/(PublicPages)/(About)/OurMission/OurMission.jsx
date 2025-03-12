import MissionWall from "../../../../assets/MissionWall.jpg";
import Background from "../../../../assets/Background.jpeg";
import { FaCheckCircle, FaPlayCircle, FaSyncAlt } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import CallToAction from "../../Home/CallToAction/CallToAction";
import FetchingError from "../../../../Shared/Component/FetchingError";
import { useMemo } from "react";

const OurMission = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch mission data from the server using React Query
  const {
    data: OurMissions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["OurMissions"],
    queryFn: () => axiosPublic.get(`/Our_Missions`).then((res) => res.data),
  });

  // Show loading state
  if (isLoading) return <Loading />;

  // Show error state if data fetching fails
  if (error) return <FetchingError />;

  // Extract the first mission object to display
  const mission = useMemo(() => OurMissions?.[0] || {}, [OurMissions]);

  return (
    <div>
      {/* Header Section */}
      <img
        src={MissionWall}
        alt="Mission Wall"
        className="w-full h-[500px] object-cover"
      />

      {/* Main Content with Background Image */}
      <div
        style={{
          backgroundImage: `url(${Background})`,
          backgroundSize: "cover",
        }}
        className="bg-fixed bg-cover bg-center min-h-screen"
      >
        {/* Our Mission & Vision Section */}
        <div className="pt-4 flex gap-3 md:gap-10 md:px-10 flex-col lg:flex-row">
          {/* Mission Introduction Card */}
          <section className="card bg-white p-8 rounded-lg shadow-xl w-full lg:w-1/2 hover:scale-105 opacity-80 mb-6 lg:mb-0 transition-transform duration-300">
            <img
              src={mission?.introduction?.img}
              alt={mission?.introduction?.title}
              className="w-[100px] mx-auto"
            />
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
              {mission?.introduction?.title}
            </h2>
            <p className="md:text-xl text-gray-700 text-center">
              {mission?.introduction?.description}
            </p>
          </section>

          {/* Vision Card */}
          <section className="card bg-white p-8 rounded-lg shadow-xl w-full lg:w-1/2 hover:scale-105 opacity-80 transition-transform duration-300">
            <img
              src={mission?.vision?.img}
              alt={mission?.vision?.title}
              className="w-[100px] mx-auto"
            />
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
              {mission?.vision?.title}
            </h2>
            <p className="md:text-xl text-gray-700 text-center">
              {mission?.vision?.description}
            </p>
          </section>
        </div>

        {/* Core Values Section */}
        <section className="pt-10 rounded-lg shadow-xl mb-12 md:px-3 lg:px-10">
          <div className="py-5">
            <h2 className="text-4xl font-bold text-center text-white pb-2">
              Our Core Values
            </h2>
            <div className="bg-white p-[2px] md:w-1/6 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10">
            {mission?.coreValues?.map((value, index) => (
              <div
                key={index}
                className="flex gap-6 bg-gray-100 p-5 rounded-lg shadow-xs hover:shadow-lg transition-transform hover:scale-105"
              >
                <img src={value.img} alt={value.title} className="w-[100px]" />
                <div>
                  <h3 className="font-semibold text-2xl text-gray-800">
                    {value.title}
                  </h3>
                  <p className="text-sm lg:text-lg text-gray-600 mt-2">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission Goals Section */}
        <section className="p-1 md:p-8 rounded-lg shadow-xl mb-12">
          <div className="py-5">
            <h2 className="text-4xl font-bold text-center text-white pb-2">
              Mission Goals
            </h2>
            <div className="bg-white p-[2px] md:w-1/6 mx-auto"></div>
          </div>

          {/* Goals List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            {mission?.missionGoals?.map((goal, index) => (
              <div
                key={index}
                className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h4 className="font-semibold text-xl text-gray-800 mb-2">
                  {goal.goal}
                </h4>

                {/* Progress Status */}
                <div className="flex items-center space-x-2 mb-2">
                  {goal.progress === "In Progress" && (
                    <FaSyncAlt className="h-6 w-6 text-blue-500 animate-spin" />
                  )}
                  {goal.progress === "On Track" && (
                    <FaCheckCircle className="h-6 w-6 text-green-500" />
                  )}
                  {goal.progress === "Initiated" && (
                    <FaPlayCircle className="h-6 w-6 text-yellow-500" />
                  )}
                  <p className="text-gray-600">Progress: {goal.progress}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <CallToAction />
      </div>
    </div>
  );
};

export default OurMission;
