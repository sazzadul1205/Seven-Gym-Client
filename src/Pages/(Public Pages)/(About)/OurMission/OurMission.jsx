import MissionWall from "../../../../assets/MissionWall.jpg";
import Background from "../../../../assets/Background.jpeg";
import { FaCheckCircle, FaPlayCircle, FaSyncAlt } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import CallToAction from "../../Home/CallToAction/CallToAction";


const OurMission = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: OurMissions,
    isLoading: OurMissionsLoading,
    error: OurMissionsError,
  } = useQuery({
    queryKey: ["OurMissions"],
    queryFn: () => axiosPublic.get(`/Our_Missions`).then((res) => res.data),
  });

  if (OurMissionsLoading) return <Loading />;
  if (OurMissionsError) {
    console.error("Error fetching data:", OurMissionsError);
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-3xl text-red-500 font-bold mb-8">
          Failed to load forum threads.
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

  const mission = OurMissions[0]; // Access the first element of the fetched array

  return (
    <div>
      {/* Header */}
      <div className="bg-[#F72C5B] py-11"></div>

      <img
        src={MissionWall}
        alt="Mission Wall"
        className="w-full h-[500px] object-cover"
      />

      <div
        style={{
          backgroundImage: `url(${Background})`,
          backgroundSize: "cover",
        }}
        className="bg-fixed bg-cover bg-center min-h-screen"
      >
        {/* Our Mission */}
        <div className="pt-4 flex gap-3 md:gap-10 md:px-10 flex-col lg:flex-row">
          {/* Introduction */}
          <section className="card bg-white p-8 rounded-lg shadow-xl w-full lg:w-1/2 hover:scale-105 opacity-80 mb-6 lg:mb-0">
            <img
              src={mission?.introduction.img}
              alt={mission?.introduction.title}
              className="w-[100px] mx-auto"
            />
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
              {mission?.introduction.title}
            </h2>
            <p className="md:text-xl text-gray-700 text-center">
              {mission?.introduction.description}
            </p>
          </section>

          {/* Vision */}
          <section className="card bg-white p-8 rounded-lg shadow-xl w-full lg:w-1/2 hover:scale-105 opacity-80">
            <img
              src={mission?.vision.img}
              alt={mission?.vision.title}
              className="w-[100px] mx-auto"
            />
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
              {mission?.vision.title}
            </h2>
            <p className="md:text-xl text-gray-700 text-center">
              {mission?.vision.description}
            </p>
          </section>
        </div>

        {/* Core Values */}
        <section className="pt-10 rounded-lg shadow-xl mb-12 md:px-3 lg:px-10">
          <div className="py-5">
            <h2 className="text-4xl font-bold text-center text-white pb-2">
              Our Core Values
            </h2>
            <div className="bg-white p-[2px] md:w-1/6 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10">
            {mission?.coreValues.map((value, index) => (
              <div
                key={index}
                className="flex gap-6 bg-gray-100 p-5 rounded-lg shadow-sm hover:shadow-lg transition-shadow hover:scale-105"
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

        {/* Mission Goals */}
        <section className="p-1 md:p-8 rounded-lg shadow-xl mb-12">
          <div className="py-5">
            <h2 className="text-4xl font-bold text-center text-white pb-2">
              Mission Goals
            </h2>
            <div className="bg-white p-[2px] md:w-1/6 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            {mission?.missionGoals.map((goal, index) => (
              <div
                key={index}
                className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h4 className="font-semibold text-xl text-gray-800 mb-2">
                  {goal.goal}
                </h4>

                <div className="flex items-center space-x-2 mb-2">
                  {/* Icon for progress */}
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

        <CallToAction />
      </div>
    </div>
  );
};

export default OurMission;
