/* eslint-disable react/prop-types */
import {
  FaCheckCircle,
  FaCog,
  FaPlayCircle,
  FaPlus,
  FaRegTrashAlt,
  FaSyncAlt,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import OurMissionBackgroundEditModal from "./OurMissionBackgroundEditModal/OurMissionBackgroundEditModal";
import OurMissionHeroSectionEditModal from "./OurMissionHeroSectionEditModal/OurMissionHeroSectionEditModal";
import OurMissionVisionSectionEditModal from "./OurMissionVisionSectionEditModal/OurMissionVisionSectionEditModal";
import OurMissionCoreValueAddModal from "./OurMissionCoreValueAddModal/OurMissionCoreValueAddModal";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const OurMissionPageManagement = ({ OurMissionsData, Refetch }) => {
  const axiosPublic = useAxiosPublic();

  // Handle Delete
  const handleDeleteService = async (valueId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This Core Value will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F72C5B",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosPublic.patch(`/Our_Missions/DeleteCoreValue/${valueId}`);
      await Refetch();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Core Value has been removed.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Core Value could not be deleted.",
        confirmButtonColor: "#F72C5B",
      });
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-gray-400 py-2 flex items-center">
        {/* Left: Balance No Content */}
        <div className="flex-shrink-0 w-10" />

        {/* Center: Title */}
        <h3 className="flex-grow text-white font-semibold text-lg text-center">
          Our Missions (Admin)
        </h3>

        {/* Right: Edit Background Button */}
        <div className="flex-shrink-0 w-10">
          <button
            onClick={() => {
              document
                .getElementById("Our_Mission_Background_Edit_Modal")
                .showModal();
            }}
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

      {/* Container */}
      <div
        className="bg-fixed bg-center bg-cover space-y-16 bg-black/80 pb-5"
        style={{ backgroundImage: `url(${OurMissionsData?.background})` }}
      >
        {/* Hero Section */}
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
              onClick={() => {
                document
                  .getElementById("Our_Mission_Hero_Section_Edit_Modal")
                  .showModal();
              }}
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

        {/* Mission & Vision Section */}
        <div className="mx-auto px-12 relative">
          {/* Edit Icon */}
          <div className="absolute top-0 right-4 z-10 group">
            <button
              onClick={() => {
                document
                  .getElementById("Our_Mission_Vision_Section_Edit_Modal")
                  .showModal();
              }}
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

        {/* Core Section */}
        <div className="relative">
          {/* Header */}
          <header className="text-center py-5 bg-gray-900/90">
            {/* Title  */}
            <h3 className="text-4xl font-bold text-white">Core Values</h3>

            {/* Box */}
            <div className="w-24 h-1 bg-red-600 mx-auto mt-2 rounded" />
          </header>

          {/* Body */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 pt-2 px-5">
            {OurMissionsData?.coreValues?.map((value) => (
              <div
                key={value.id}
                className="relative flex flex-col items-center p-6 bg-linear-to-bl hover:bg-linear-to-tr from-white to-gray-400 rounded-lg shadow hover:shadow-lg transition"
              >
                {/* Delete Button */}
                <>
                  <button
                    id={`delete-value-btn-${value.id}`}
                    className="absolute top-3 left-3 border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
                    onClick={() => handleDeleteService(value.id)}
                  >
                    <FaRegTrashAlt className="text-red-500" />
                  </button>
                  <Tooltip
                    anchorSelect={`#delete-value-btn-${value.id}`}
                    content="Delete Value"
                  />
                </>

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
                <p className="text-center">{value.description}</p>
              </div>
            ))}
          </div>

          {/* Add Icon with Tooltip */}
          <div className="absolute top-6 left-4 z-10 group ">
            <button
              id={`add-core-value-btn`}
              className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
              onClick={() => {
                document
                  .getElementById("Our_Mission_Core_Value_Add_Modal")
                  .showModal();
              }}
            >
              <FaPlus className="text-green-500" />
            </button>
            <Tooltip
              anchorSelect={`#add-core-value-btn`}
              content="Add Core Value"
            />
          </div>
        </div>

        {/* Goals Section */}
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

      {/* Modals */}
      <>
        {/* Edit Mission Background Modal */}
        <dialog id="Our_Mission_Background_Edit_Modal" className="modal">
          <OurMissionBackgroundEditModal
            Refetch={Refetch}
            OurMissionsData={OurMissionsData}
          />
        </dialog>

        {/* Edit Hero Section Modal */}
        <dialog id="Our_Mission_Hero_Section_Edit_Modal" className="modal">
          <OurMissionHeroSectionEditModal
            Refetch={Refetch}
            OurMissionsData={OurMissionsData}
          />
        </dialog>

        {/* Edit Mission & Vision Section Modal */}
        <dialog id="Our_Mission_Vision_Section_Edit_Modal" className="modal">
          <OurMissionVisionSectionEditModal
            Refetch={Refetch}
            OurMissionsData={OurMissionsData}
          />
        </dialog>

        {/* Edit Core Values Section Modal */}
        <dialog id="Our_Mission_Core_Value_Add_Modal" className="modal">
          <OurMissionCoreValueAddModal Refetch={Refetch} />
        </dialog>
      </>
    </>
  );
};

export default OurMissionPageManagement;
