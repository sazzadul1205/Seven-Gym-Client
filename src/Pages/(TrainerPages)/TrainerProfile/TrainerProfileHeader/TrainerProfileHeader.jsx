// Import Packages
import PropTypes from "prop-types";

// Import Icons
import { Tooltip } from "react-tooltip";
import { IoSettings } from "react-icons/io5";

// Import Modal
import TrainerProfileHeaderUpdateModal from "./TrainerProfileHeaderUpdateModal.jsx/TrainerProfileHeaderUpdateModal";

// Import Utility
import { getGenderIcon } from "../../../../Utility/getGenderIcon";

// Function to get tier badge styles dynamically
export const getTierBadge = (tier) => {
  const tierStyles = {
    Bronze: "bg-orange-600 text-white ring-2 ring-orange-300 shadow-lg",
    Silver: "bg-gray-400 text-white ring-2 ring-gray-200 shadow-lg",
    Gold: "bg-yellow-500 text-white ring-2 ring-yellow-300 shadow-lg",
    Diamond: "bg-blue-600 text-white ring-2 ring-blue-300 shadow-lg",
    Platinum: "bg-gray-800 text-white ring-2 ring-gray-500 shadow-lg",
  };

  return tierStyles[tier] || "bg-gray-200 text-gray-700 ring-2 ring-gray-300";
};

const TrainerProfileHeader = ({ TrainerDetails, refetch }) => {
  // Get gender details (icon + label)
  const { icon } = getGenderIcon(TrainerDetails?.gender);

  // Check if TrainerDetails is available
  if (!TrainerDetails) return null;

  return (
    <div>
      <div className="relative mx-auto text-center py-10">
        {/* Settings Icon (Top Left) */}
        <div
          className="absolute top-2 right-2 bg-gray-400/50 p-3 rounded-full cursor-pointer "
          data-tooltip-id="Trainer_Profile_Settings_Header_Tooltip"
          onClick={() =>
            document
              .getElementById("Trainer_Profile_Header_Update_Modal")
              .showModal()
          }
        >
          <IoSettings className="text-red-500 text-4xl transition-transform duration-500 hover:rotate-180 hover:text-red-400" />
        </div>
        <Tooltip
          id="Trainer_Profile_Settings_Header_Tooltip"
          place="top"
          content="Trainer Name Settings"
        />

        {/* Trainer Profile Image */}
        <img
          src={TrainerDetails?.imageUrl || "/default-profile.png"}
          alt={TrainerDetails?.name || "Trainer"}
          className="w-32 h-32 rounded-full mx-auto mb-2"
          loading="lazy"
        />

        {/* Trainer Name & Gender */}
        <div className="flex justify-center items-center gap-3">
          <p className="text-4xl font-bold text-white">
            {TrainerDetails?.name || "Unknown Trainer"}
          </p>
          <span>{icon}</span>
        </div>

        {/* Trainer Specialization */}
        <p className="text-xl text-black font-semibold italic">
          {TrainerDetails?.specialization || "Specialization Not Available"}
        </p>

        {/* Tier Badge */}
        {TrainerDetails?.tier && (
          <span
            className={`inline-block px-6 py-1 mt-2 rounded-full text-sm font-semibold ${getTierBadge(
              TrainerDetails?.tier
            )}`}
          >
            {TrainerDetails?.tier} Tier
          </span>
        )}
      </div>

      {/* Update Image, Name, Specialization  Modal */}
      <dialog id="Trainer_Profile_Header_Update_Modal" className="modal">
        <TrainerProfileHeaderUpdateModal
          TrainerDetails={TrainerDetails}
          refetch={refetch}
        />
      </dialog>
    </div>
  );
};

// PropTypes Validation
TrainerProfileHeader.propTypes = {
  TrainerDetails: PropTypes.shape({
    name: PropTypes.string,
    gender: PropTypes.string,
    specialization: PropTypes.string,
    tier: PropTypes.string,
    imageUrl: PropTypes.string,
  }),
  refetch: PropTypes.func.isRequired,
};

export default TrainerProfileHeader;
