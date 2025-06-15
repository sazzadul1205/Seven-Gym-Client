/* eslint-disable react/prop-types */

import { FaCheckCircle, FaCog, FaPlayCircle, FaSyncAlt } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

const AllExtraPageManagement = ({ OurMissionsData }) => {
  console.log(OurMissionsData);

  return (
    <div className="text-black">
      <>
        {/* Header */}
        <div className="bg-gray-400 py-2 flex items-center">
          {/* Left: Add Button */}
          <div className="flex-shrink-0 w-10" />

          {/* Center: Title */}
          <h3 className="flex-grow text-white font-semibold text-lg text-center">
            Our Missions (Admin)
          </h3>

          {/* Right: Empty div to balance flex */}
          <div className="flex-shrink-0 w-10">
            <button
              id="edit-background-image-btn"
              className="cursor-pointer"
              aria-label="Edit background-image"
            >
              <FaCog className="text-red-600 w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>
            <Tooltip
              anchorSelect="#edit-background-image-btn"
              content="Edit Background Image Section"
            />
          </div>
        </div>

        <div
          className="bg-fixed bg-center bg-cover space-y-16 bg-black/80 pb-5"
          style={{ backgroundImage: `url(${OurMissionsData?.background})` }}
        >
          {/* HERO */}
          <div className="relative h-[500px]">
            {/* Hero Background Image */}
            <img
              src={OurMissionsData?.hero?.img}
              alt={OurMissionsData?.hero?.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gray-500/60 flex flex-col items-center justify-center">
              <h1 className="text-5xl font-extrabold text-white mb-4">
                {OurMissionsData?.hero?.title}
              </h1>
              <p className="text-xl text-white font-bold max-w-2xl text-center">
                {OurMissionsData?.hero?.subTitle}
              </p>
            </div>

            {/* Edit Icon with Tooltip */}
            <div className="absolute top-4 right-4 z-10 group ">
              <button
                id="edit-hero-btn"
                className="p-2 bg-white rounded-full shadow-lg hover:bg-red-100 transition cursor-pointer"
                aria-label="Edit Hero"
              >
                <FaCog className="text-red-600 w-6 h-6 group-hover:rotate-90 transition-transform" />
              </button>
              <Tooltip
                anchorSelect="#edit-hero-btn"
                content="Edit Hero Section"
              />
            </div>
          </div>

          {/* Mission & Vision Container */}
          <div className="mx-auto px-12 relative">
            {/* Edit Icon */}
            <div className="absolute top-0 right-4 z-10 group">
              <button
                id="edit-mission-vision-btn"
                className="p-2 bg-white rounded-full shadow-lg hover:bg-red-100 transition cursor-pointer"
                aria-label="Edit Mission & Vision Section"
              >
                <FaCog className="text-red-600 w-6 h-6 group-hover:rotate-90 transition-transform" />
              </button>
              <Tooltip
                anchorSelect="#edit-mission-vision-btn"
                content="Edit Mission & Vision Section"
              />
            </div>

            {/* Add top padding so gear icon doesn't overlap cards */}
            <div className="grid gap-12 lg:grid-cols-2 pt-12">
              {/* Mission Card */}
              <div className="relative overflow-hidden rounded-xl bg-white shadow-lg transition-transform hover:scale-[1.025] duration-500">
                {/* Accent Stripe */}
                <div className="absolute top-0 left-0 h-1 w-full bg-red-600" />
                <div className="p-8 flex flex-col items-center text-center">
                  <img
                    src={OurMissionsData?.mission.img}
                    alt={OurMissionsData?.mission?.title}
                    className="mb-4 h-24 w-24 object-contain"
                  />
                  <h2 className="mb-3 text-3xl font-bold text-gray-900">
                    {OurMissionsData?.mission?.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {OurMissionsData?.mission?.description}
                  </p>
                </div>
              </div>

              {/* Vision Card */}
              <div className="relative overflow-hidden rounded-xl bg-white shadow-lg transition-transform hover:scale-[1.025] duration-500">
                {/* Accent Stripe */}
                <div className="absolute top-0 left-0 h-1 w-full bg-red-600" />
                <div className="p-8 flex flex-col items-center text-center">
                  <img
                    src={OurMissionsData?.vision?.img}
                    alt={OurMissionsData?.vision?.title}
                    className="mb-4 h-24 w-24 object-contain"
                  />
                  <h2 className="mb-3 text-3xl font-bold text-gray-900">
                    {OurMissionsData?.vision?.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {OurMissionsData?.vision?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CORE VALUES */}
          <div className="relative px-2 lg:px-12">
            <header className="text-center mb-5 md:mb-12">
              <h3 className="text-4xl font-bold text-white">Core Values</h3>
              <div className="w-24 h-1 bg-red-600 mx-auto mt-2 rounded" />
            </header>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {OurMissionsData?.coreValues?.map((value, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
                >
                  <img
                    src={value.img}
                    alt={value.title}
                    className="w-16 h-16 mb-4"
                  />
                  <h4 className="text-2xl font-semibold text-gray-800 mb-2">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 text-center">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Edit Icon with Tooltip */}
            <div className="absolute top-4 right-4 z-10 group ">
              <button
                id="edit-core-values-btn"
                className="p-2 bg-white rounded-full shadow-lg hover:bg-red-100 transition cursor-pointer"
                aria-label="Edit core-values"
              >
                <FaCog className="text-red-600 w-6 h-6 group-hover:rotate-90 transition-transform" />
              </button>
              <Tooltip
                anchorSelect="#edit-core-values-btn"
                content="Edit Core Values Section"
              />
            </div>
          </div>

          {/* MISSION GOALS */}
          <div className="relative px-2 lg:px-12">
            <header className="text-center mb-5 md:mb-12">
              <h3 className="text-4xl font-bold text-white">Mission Goals</h3>
              <div className="w-24 h-1 bg-red-600 mx-auto mt-2 rounded" />
            </header>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {OurMissionsData?.missionGoals?.map((goal, i) => {
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

            {/* Edit Icon with Tooltip */}
            <div className="absolute top-4 right-4 z-10 group ">
              <button
                id="edit-mission-goals-btn"
                className="p-2 bg-white rounded-full shadow-lg hover:bg-red-100 transition cursor-pointer"
                aria-label="Edit mission-goals"
              >
                <FaCog className="text-red-600 w-6 h-6 group-hover:rotate-90 transition-transform" />
              </button>
              <Tooltip
                anchorSelect="#edit-mission-goals-btn"
                content="Edit Mission Goals Section"
              />
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default AllExtraPageManagement;
