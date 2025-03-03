import PropTypes from "prop-types";
import { IoMdFemale, IoMdMale } from "react-icons/io";
import { MdOutlinePeopleAlt } from "react-icons/md";

// Function to get tier badge styles dynamically
const getTierBadge = (tier) => {
  const tierStyles = {
    Bronze: "bg-orange-600 text-white ring-2 ring-orange-300 shadow-lg",
    Silver: "bg-gray-400 text-white ring-2 ring-gray-200 shadow-lg",
    Gold: "bg-yellow-500 text-white ring-2 ring-yellow-300 shadow-lg",
    Diamond: "bg-blue-600 text-white ring-2 ring-blue-300 shadow-lg",
    Platinum: "bg-gray-800 text-white ring-2 ring-gray-500 shadow-lg",
  };

  // Default style for unknown tiers
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

  // Default to "Not specified"
  return (
    genderData[gender] || {
      icon: <MdOutlinePeopleAlt className="text-gray-500 text-2xl" />,
      label: "Not specified",
    }
  );
};

const TrainersDetailsHeader = ({ TrainerDetails }) => {
  // Ensure TrainerDetails exists before rendering
  if (!TrainerDetails) return null;

  // Get gender details (icon + label)
  const { icon } = getGenderIcon(TrainerDetails?.gender);

  return (
    <div className="bg-gray-500/50 mx-auto justify-between text-center py-10">
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
      <p className="text-xl text-white italic">
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

// **PropTypes Validation**
TrainersDetailsHeader.propTypes = {
  TrainerDetails: PropTypes.shape({
    imageUrl: PropTypes.string, // URL of trainer's image
    name: PropTypes.string, // Trainer's name
    specialization: PropTypes.string, // Trainer's specialization
    tier: PropTypes.oneOf(["Bronze", "Silver", "Gold", "Diamond", "Platinum"]), // Allowed tiers
    gender: PropTypes.oneOf(["Male", "Female", "Other", "Not specified"]), // Gender options
  }),
};

// **Default Props** (Fallback Values)
TrainersDetailsHeader.defaultProps = {
  TrainerDetails: {
    imageUrl: "/default-profile.png",
    name: "Unknown Trainer",
    specialization: "Specialization Not Available",
    tier: null, // No tier by default
    gender: "Not specified", // Default to "Not specified"
  },
};

export default TrainersDetailsHeader;
