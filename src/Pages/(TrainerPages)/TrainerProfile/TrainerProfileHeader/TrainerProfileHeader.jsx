import { Link } from "react-router";

// Import Packages
import PropTypes from "prop-types";

// Import Icons
import { IoMdFemale, IoMdMale } from "react-icons/io";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoSettings } from "react-icons/io5";

// Function to get tier badge styles dynamically
const getTierBadge = (tier) => {
  const tierStyles = {
    Bronze: "bg-orange-600 text-white ring-2 ring-orange-300 shadow-lg",
    Silver: "bg-gray-400 text-white ring-2 ring-gray-200 shadow-lg",
    Gold: "bg-yellow-500 text-white ring-2 ring-yellow-300 shadow-lg",
    Diamond: "bg-blue-600 text-white ring-2 ring-blue-300 shadow-lg",
    Platinum: "bg-gray-800 text-white ring-2 ring-gray-500 shadow-lg",
  };

  return tierStyles[tier] || "bg-gray-200 text-gray-700 ring-2 ring-gray-300";
};

// Function to determine gender icon & label
const getGenderIcon = (gender) => {
  const genderData = {
    Male: {
      icon: <IoMdMale className="text-blue-500 text-4xl font-bold" />,
      label: "Male",
    },
    Female: {
      icon: <IoMdFemale className="text-pink-500 text-4xl font-bold" />,
      label: "Female",
    },
    Other: {
      icon: <MdOutlinePeopleAlt className="text-gray-500 text-4xl font-bold" />,
      label: "Other",
    },
  };

  return (
    genderData[gender] || {
      icon: <MdOutlinePeopleAlt className="text-gray-500 text-2xl" />,
      label: "Not specified",
    }
  );
};

const TrainerProfileHeader = ({ TrainerDetails }) => {
  // Get gender details (icon + label)
  const { icon } = getGenderIcon(TrainerDetails?.gender);

  // Check if TrainerDetails is available
  if (!TrainerDetails) return null;

  return (
    <div className="relative mx-auto text-center py-10">
      {/* Settings Icon (Top Left) */}
      <div className="absolute top-2 right-2 bg-gray-400/50 p-3 rounded-full">
        <Link to="/Trainer/TrainerSettings?tab=User_Info_Settings">
          <IoSettings className="text-red-500 text-4xl transition-transform duration-500 hover:rotate-180 hover:text-red-400" />
        </Link>
      </div>

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
};

export default TrainerProfileHeader;
