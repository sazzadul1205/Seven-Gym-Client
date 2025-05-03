import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import { IoMdArrowRoundBack } from "react-icons/io";
import { getGenderIcon } from "../../../../../Utility/getGenderIcon";

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

const TrainersDetailsHeader = ({
  TrainerDetails: {
    imageUrl = "/default-profile.png",
    name = "Unknown Trainer",
    specialization = "Specialization Not Available",
    tier = null,
    gender = "Not specified",
  } = {},
}) => {
  const navigate = useNavigate();
  const { icon } = getGenderIcon(gender, '4xl');

  return (
    <div className="relative bg-linear-to-b from-gray-500/80 to-gray-500/50 mx-auto justify-between text-center py-10">
      {/* Back Button */}
      <button
        className="absolute top-5 left-5 flex items-center gap-2 text-lg px-5 md:px-10 py-2 bg-white hover:bg-gray-100/90 text-black rounded-lg"
        onClick={() => navigate(-1)}
      >
        <IoMdArrowRoundBack className="text-xl" />
        <span className="hidden md:inline">Back</span>
      </button>

      {/* Profile Image */}
      <img
        src={imageUrl}
        alt={name}
        className="w-32 h-32 rounded-full mx-auto mb-2"
        loading="lazy"
      />

      {/* Name & Gender */}
      <div className="flex justify-center items-center gap-3">
        <h1 className="text-4xl font-bold text-white">{name}</h1>
        <span>{icon}</span>
      </div>

      {/* Specialization */}
      <p className="text-xl text-white italic">{specialization}</p>

      {/* Tier Badge */}
      {tier && (
        <span
          className={`inline-block px-6 py-1 mt-2 rounded-full text-sm font-semibold ${getTierBadge(
            tier
          )}`}
        >
          {tier} Tier
        </span>
      )}
    </div>
  );
};

// PropTypes validation
TrainersDetailsHeader.propTypes = {
  TrainerDetails: PropTypes.shape({
    imageUrl: PropTypes.string,
    name: PropTypes.string,
    specialization: PropTypes.string,
    tier: PropTypes.oneOf(["Bronze", "Silver", "Gold", "Diamond", "Platinum"]),
    gender: PropTypes.oneOf(["Male", "Female", "Other", "Not specified"]),
  }),
};

export default TrainersDetailsHeader;
