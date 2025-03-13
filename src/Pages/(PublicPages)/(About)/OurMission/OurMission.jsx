import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

// Background Asset
import MissionWall from "../../../../assets/MissionWall.jpg";
import HomeBackground from "../../../../assets/Home-Background/Home-Background.jpeg";

import { FaCheckCircle, FaPlayCircle, FaSyncAlt } from "react-icons/fa";


import Loading from "../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import CallToAction from "../../Home/CallToAction/CallToAction";
import FetchingError from "../../../../Shared/Component/FetchingError";

const OurMission = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch mission data from the server using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["OurMissions"],
    queryFn: () => axiosPublic.get(`/Our_Missions`).then((res) => res.data),
  });

  // Memoize the mission data (Always define hooks before any early return)
  const mission = useMemo(() => data?.[0] || {}, [data]);

  // Show loading state
  if (isLoading) return <Loading />;

  // Show error state if data fetching fails
  if (error) return <FetchingError />;

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
        className="min-h-screen bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `url(${HomeBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-linear-to-b from-black/50 to-black/30 pt-4">
          {/* Our Mission & Vision Section */}
          <div className="flex flex-col md:flex-row mx-auto max-w-7xl gap-4">
            {/* Mission Introduction Card */}
            <section className="bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-400 p-8 rounded-lg shadow-xl w-full lg:w-1/2">
              <img
                src={mission?.introduction?.img}
                alt={mission?.introduction?.title}
                className="w-[100px] mx-auto"
              />
              <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
                {mission?.introduction?.title}
              </h2>
              <p className="text-lg text-gray-950 text-center">
                {mission?.introduction?.description}
              </p>
            </section>

            {/* Vision Card */}
            <section className="bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-400 p-8 rounded-lg shadow-xl w-full lg:w-1/2">
              <img
                src={mission?.vision?.img}
                alt={mission?.vision?.title}
                className="w-[100px] mx-auto"
              />
              <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
                {mission?.vision?.title}
              </h2>
              <p className="text-lg text-gray-950 text-center">
                {mission?.vision?.description}
              </p>
            </section>
          </div>

          {/* Core Values Section */}
          <section className="mx-auto max-w-7xl pb-5">
            {/* Title Section */}
            <div className="py-5">
              <h2 className="text-4xl font-bold text-center text-white pb-2">
                Our Core Values
              </h2>
              <div className="bg-white p-[2px] md:w-1/6 mx-auto"></div>
            </div>
            {/* Content Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              {mission?.coreValues?.map((value, index) => (
                <div
                  key={index}
                  className="flex bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-400 p-5 rounded-lg shadow-xs gap-6"
                >
                  <img
                    src={value.img}
                    alt={value.title}
                    className="w-[100px]"
                  />
                  <div>
                    <h3 className="font-semibold text-2xl text-gray-800">
                      {value.title}
                    </h3>
                    <p className="text-sm lg:text-lg text-black mt-2">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mission Goals Section */}
          <section className="mx-auto max-w-7xl pb-5">
            {/* Title Section */}
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
                  className="bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-400  p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
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
    </div>
  );
};

export default OurMission;
