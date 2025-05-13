import { useNavigate } from "react-router";
import { useState } from "react";

// Import Icons
import { FaPowerOff } from "react-icons/fa";

// Import Package
import PropTypes from "prop-types";
import Swal from "sweetalert2";
// Import Button
import CommonButton from "../../../Shared/Buttons/CommonButton";

// Import Utility
import { fetchTierBadge } from "../../../Utility/fetchTierBadge";
import { getGenderIcon } from "../../../Utility/getGenderIcon";

// Import Hooks
import useAuth from "../../../Hooks/useAuth";

const TrainerSettingsLayoutHeader = ({ refetchAll, TrainerProfileData }) => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Refetch Spin state
  const [spinning, setSpinning] = useState(false);

  // Get gender details (icon + label)
  const { icon } = getGenderIcon(TrainerProfileData?.gender);

  // Logout function with confirmation
  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // Exit if user cancels

    setIsLoggingOut(true);
    try {
      await logOut();
      navigate("/"); // Redirect to home
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: `Error logging out: ${error.message}`,
        confirmButtonColor: "#d33",
        timer: 3000,
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handle Refetch Spin
  const handleClick = () => {
    if (spinning) return; // Prevent spam clicks
    setSpinning(true);
    refetchAll();

    // Stop spinning after 1 second (adjust as needed)
    setTimeout(() => setSpinning(false), 1000);
  };

  return (
    <div className="mx-auto flex flex-row justify-between gap-6 py-2 bg-gray-300 text-black px-1 md:px-5">
      {/* Trainer image and basic info */}
      <div className="flex items-center space-x-4 w-3/4 md:w-auto">
        {/* Trainer Profile Picture */}
        <img
          src={TrainerProfileData?.imageUrl}
          alt="Trainer Profile"
          className="w-12 h-12 rounded-full border border-gray-300"
        />

        {/* Trainer Name and Specialization */}
        <div className="py-1 w-full">
          {/* Trainer Data */}
          <div className="flex justify-start items-center gap-3">
            {/* Trainer Name */}
            <h3 className="text-lg font-bold text-gray-700">
              {TrainerProfileData?.name}
            </h3>

            {/* Trainer Icons */}
            <span className="text-xl font-bold">{icon}</span>
          </div>

          {/* Trainer Specialization */}
          <p className="text-sm text-gray-600">
            {TrainerProfileData?.specialization}
          </p>
        </div>
      </div>

      {/* Badge Display */}
      <div className="hidden md:flex items-center">
        {TrainerProfileData?.tier && (
          <span className={fetchTierBadge(TrainerProfileData.tier)}>
            {TrainerProfileData.tier} Tier
          </span>
        )}
      </div>

      {/* Log out button */}
      <div className="hidden md:flex w-full md:w-auto my-auto justify-end gap-2">
        <button
          className="bg-gradient-to-bl from-yellow-300 to-yellow-600 hover:from-yellow-400 hover:to-yellow-700 p-2 rounded-lg cursor-pointer"
          onClick={handleClick}
        >
          <img
            src="https://i.ibb.co.com/Wp0ymPyY/refresh.png"
            alt="Refresh Icon"
            className={`w-[25px] h-[25px] ${spinning ? "animate-spin" : ""}`}
          />
        </button>

        <CommonButton
          text={isLoggingOut ? "Logging Out..." : "Log Out"}
          clickEvent={handleSignOut}
          bgColor="red"
          py="py-3"
          px="px-10"
          icon={<FaPowerOff />}
          isLoading={isLoggingOut}
          loadingText="Logging Out..."
        />
      </div>

      {/* Log out button */}
      <div className="flex md:hidden w-1/4 md:w-auto my-auto justify-end">
        <CommonButton
          clickEvent={handleSignOut}
          bgColor="red"
          py="py-3"
          px="px-2"
          icon={<FaPowerOff />}
          isLoading={isLoggingOut}
          loadingText="Logging Out..."
        />
      </div>
    </div>
  );
};

// Prop Validation
TrainerSettingsLayoutHeader.propTypes = {
  refetchAll: PropTypes.func.isRequired,
  TrainerProfileData: PropTypes.shape({
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    gender: PropTypes.string,
    specialization: PropTypes.string,
    tier: PropTypes.string,
  }),
};

export default TrainerSettingsLayoutHeader;
