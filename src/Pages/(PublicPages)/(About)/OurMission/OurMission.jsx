// import Packages
import { useQuery } from "@tanstack/react-query";

// Import icons
import { FaCheckCircle, FaPlayCircle, FaSyncAlt } from "react-icons/fa";

// import Hooks and Shared
import FetchingError from "../../../../Shared/Component/FetchingError";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Loading from "../../../../Shared/Loading/Loading";

// Import Component
import CallToAction from "../../Home/CallToAction/CallToAction";

const OurMission = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch mission data
  const {
    data: mission,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["OurMissions"],
    queryFn: () => axiosPublic.get(`/Our_Missions`).then((res) => res.data),
  });

  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  return (
    <div
      className="bg-fixed bg-center bg-cover space-y-16 bg-black/50"
      style={{ backgroundImage: `url(${mission.background})` }}
    >
      {/* HERO */}
      <div className="relative h-[500px]">
        <img
          src={mission?.hero?.img}
          alt={mission?.hero?.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-500/60 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            {mission?.hero?.title}
          </h1>
          <p className="text-xl text-white font-bold  max-w-2xl text-center">
            {mission?.hero?.subTitle}
          </p>
        </div>
      </div>

      {/* MISSION & VISION */}
      <div className="container mx-auto px-1 lg:px-12 grid gap-12 lg:grid-cols-2">
        {/* Mission Card */}
        <div className="relative overflow-hidden rounded-xl bg-white shadow-lg transition-transform hover:scale-[1.025] duration-500">
          {/* Accent Stripe */}
          <div className="absolute top-0 left-0 h-1 w-full bg-red-600" />
          <div className="p-8 flex flex-col items-center text-center">
            <img
              src={mission.mission.img}
              alt={mission.mission?.title}
              className="mb-4 h-24 w-24 object-contain"
            />
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              {mission.mission?.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {mission.mission?.description}
            </p>
          </div>
        </div>

        {/* Vision Card */}
        <div className="relative overflow-hidden rounded-xl bg-white shadow-lg transition-transform hover:scale-[1.025] duration-500">
          {/* Accent Stripe */}
          <div className="absolute top-0 left-0 h-1 w-full bg-red-600" />
          <div className="p-8 flex flex-col items-center text-center">
            <img
              src={mission.vision?.img}
              alt={mission.vision?.title}
              className="mb-4 h-24 w-24 object-contain"
            />
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              {mission.vision?.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {mission.vision?.description}
            </p>
          </div>
        </div>
      </div>

      {/* CORE VALUES */}
      <section className="mx-auto ">
        {/* Header */}
        <header className="text-center py-5 bg-gray-900/90">
          {/* Title  */}
          <h3 className="text-4xl font-bold text-white">Core Values</h3>

          {/* Box */}
          <div className="w-24 h-1 bg-red-600 mx-auto mt-2 rounded" />
        </header>

        {/* Body */}
        <div className="grid  gap-5  md:grid-cols-2 lg:grid-cols-3 pt-2 px-1 md:px-5 ">
          {mission.coreValues?.map((value, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-6 bg-linear-to-bl hover:bg-linear-to-tr from-white to-gray-400 rounded-lg shadow hover:shadow-lg transition"
            >
              {/* Images */}
              <img
                src={value.img}
                alt={value.title}
                className="w-16 h-16 mb-4"
              />

              {/* Title */}
              <h4 className="text-2xl font-semibold text-gray-800 mb-2">
                {value.title}
              </h4>

              {/* Description */}
              <p className="text-center text-black">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION GOALS */}
      <section className="mx-auto px-2 lg:px-12">
        <header className="text-center mb-5 md:mb-12">
          <h3 className="text-4xl font-bold text-white">Mission Goals</h3>
          <div className="w-24 h-1 bg-red-600 mx-auto mt-2 rounded" />
        </header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mission.missionGoals?.map((goal, i) => {
            const progressMap = {
              Initiated: 25,
              "In Progress": 60,
              "On Track": 100,
            };
            const pct = progressMap[goal.progress] || 0;
            return (
              <div
                key={i}
                className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                  {goal.goal}
                </h4>
                <div className="flex items-center mb-3">
                  {goal.progress === "Initiated" && (
                    <FaPlayCircle className="text-red-500 mr-2" />
                  )}
                  {goal.progress === "In Progress" && (
                    <FaSyncAlt className="animate-spin text-red-500 mr-2" />
                  )}
                  {goal.progress === "On Track" && (
                    <FaCheckCircle className="text-green-500 mr-2" />
                  )}
                  <span className="text-gray-700">{goal.progress}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <CallToAction />
    </div>
  );
};

export default OurMission;
