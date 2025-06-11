import { useEffect, useState } from "react";

// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// import Icons
import {
  FaEdit,
  FaPlus,
  FaRegStar,
  FaRegTrashAlt,
  FaStar,
} from "react-icons/fa";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Modals
import HomePageAdminFeaturesAddModal from "./HomePageAdminFeaturesAddModal/HomePageAdminFeaturesAddModal";
import HomePageAdminFeaturesEditModal from "./HomePageAdminFeaturesEditModal/HomePageAdminFeaturesEditModal";

const HomePageAdminFeatures = ({ Refetch, GymFeaturesData }) => {
  const axiosPublic = useAxiosPublic();

  // Local features state for instant UI updates
  const [features, setFeatures] = useState(GymFeaturesData || []);
  const [selectedFeatures, setSelectedFeatures] = useState(null);

  // Sync local state if PromotionsData changes from parent
  useEffect(() => {
    setFeatures(GymFeaturesData);
  }, [GymFeaturesData]);

  // Delete Features
  const handleDeleteFeature = async (id) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "This feature will be permanently deleted.",
      showCancelButton: true,
      confirmButtonColor: "#F72C5B",
      cancelButtonColor: "#999",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosPublic.delete(`/Gym_Features/${id}`);
      setFeatures((prev) => prev.filter((f) => f._id !== id));
      Refetch();
    } catch (error) {
      console.error("Delete failed:", error);
      Swal.fire({
        icon: "error",
        title: "Deletion failed",
        text: "Try again later.",
        confirmButtonColor: "#F72C5B",
      });
    }
  };

  // Toggle featured (show) status locally and on server
  const toggleShowStatus = async (featureId) => {
    const target = features.find((f) => f._id === featureId);
    if (!target) return;

    const shownCount = features.filter((f) => f.show).length;

    // Prevent turning on if already 8 are shown
    if (!target.show && shownCount >= 8) {
      Swal.fire({
        icon: "warning",
        title: "Feature Limit Reached",
        text: "You can only Feature up to 8 items. UnFeature one to add another.",
        confirmButtonColor: "#F72C5B",
      });
      return;
    }

    // Optimistic UI update
    const updatedFeatures = features.map((f) =>
      f._id === featureId ? { ...f, show: !f.show } : f
    );
    setFeatures(updatedFeatures);

    try {
      const response = await axiosPublic.patch(
        `/Gym_Features/ToggleShow/${featureId}`
      );

      const { newStatus } = response.data;

      // Correct the state if server returns a different status
      if (newStatus !== !target.show) {
        setFeatures((prev) =>
          prev.map((f) => (f._id === featureId ? { ...f, show: newStatus } : f))
        );
      }

      Refetch();
    } catch (error) {
      console.error("Toggle failed:", error);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: "Please try again later.",
        confirmButtonColor: "#F72C5B",
      });
      // Revert optimistic update
      setFeatures(features);
    }
  };

  return (
    <section>
      {/* Title */}
      <div className="bg-gray-400 py-2 border-t-2 flex items-center">
        {/* Left: Add Button */}
        <div className="flex-shrink-0 pl-3">
          <button
            id={`add-features-btn`}
            className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
            onClick={() => {
              document.getElementById("Add_Features_Modal").showModal();
            }}
          >
            <FaPlus className="text-green-500" />
          </button>
          <Tooltip
            anchorSelect={`#add-features-btn`}
            content="Add Features Section"
          />
        </div>

        {/* Center: Title */}
        <h3 className="flex-grow text-white font-semibold text-lg text-center">
          Features Section ( Features {GymFeaturesData.length} )
        </h3>

        {/* Right: Empty div to balance flex */}
        <div className="flex-shrink-0 w-10" />
      </div>

      {/* Content */}
      <div className="grid grid-cols-4 gap-2 p-2">
        {GymFeaturesData.map((feature) => (
          <div
            key={feature._id}
            className="relative bg-linear-to-tr hover:bg-linear-to-bl from-gray-200 to-gray-400 shadow-lg hover:shadow-2xl rounded-lg text-center flex flex-col items-center p-5 transition duration-300 cursor-default"
          >
            {/* Feature Icon */}
            <img
              src={feature.icon}
              alt={feature.title}
              className="w-20 h-20 mb-4"
              loading="lazy"
            />

            {/* Delete button top-left */}
            <>
              <button
                id={`delete-features-btn-${feature._id}`}
                className="absolute top-3 left-3 border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
                onClick={() => handleDeleteFeature(feature._id)}
              >
                <FaRegTrashAlt className="text-red-500" />
              </button>
              <Tooltip
                anchorSelect={`#delete-features-btn-${feature._id}`}
                content="Delete features"
              />
            </>

            {/* Show Status Star */}
            <>
              <button
                id={`show-status-btn-${feature._id}`}
                className="absolute top-3 left-1/2 transform -translate-x-1/2 border-2 border-gray-500/50 bg-gray-100/50 hover:bg-gray-100 rounded-full p-1 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
                onClick={() => toggleShowStatus(feature._id)}
              >
                {feature?.show ? (
                  <FaStar className="text-yellow-500/50 hover:text-yellow-500 text-3xl" />
                ) : (
                  <FaRegStar className="text-yellow-500/50 hover:text-yellow-500 text-3xl" />
                )}
              </button>
              <Tooltip
                anchorSelect={`#show-status-btn-${feature._id}`}
                content={
                  feature?.show ? "Featured Features" : "Click to feature"
                }
              />
            </>

            {/* Edit button top-right */}
            <>
              <button
                id={`edit-features-btn-${feature._id}`}
                className="absolute top-3 right-3 border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
                onClick={() => {
                  setSelectedFeatures(feature);
                  document.getElementById("Edit_Features_Modal").showModal();
                }}
              >
                <FaEdit className="text-yellow-500" />
              </button>
              <Tooltip
                anchorSelect={`#edit-features-btn-${feature._id}`}
                content="Edit features"
              />
            </>

            {/* Feature Title */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>

            {/* Feature Description */}
            <p className="text-black">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Add New Features Modal */}
      <dialog id="Add_Features_Modal" className="modal">
        <HomePageAdminFeaturesAddModal Refetch={Refetch} />
      </dialog>

      {/* Edit Features Modal */}
      <dialog id="Edit_Features_Modal" className="modal">
        <HomePageAdminFeaturesEditModal
          setSelectedFeatures={setSelectedFeatures}
          selectedFeatures={selectedFeatures}
          Refetch={Refetch}
        />
      </dialog>
    </section>
  );
};

// Prop
HomePageAdminFeatures.propTypes = {
  Refetch: PropTypes.func.isRequired,
  GymFeaturesData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      show: PropTypes.bool, // Optional if not always present
    })
  ).isRequired,
};

export default HomePageAdminFeatures;
