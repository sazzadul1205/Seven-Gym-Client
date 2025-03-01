import PropTypes from "prop-types";

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

const TrainersDetailsHeader = ({ TrainerDetails }) => {
  // Ensure TrainerDetails exists before rendering
  if (!TrainerDetails) return null;

  return (
    <div className="bg-gray-500/20 mx-auto text-center py-10">
      {/* Trainer Profile Image */}
      <img
        src={TrainerDetails?.imageUrl || "/default-profile.png"}
        alt={TrainerDetails?.name || "Trainer"}
        className="w-32 h-32 rounded-full mx-auto mb-1"
        loading="lazy"
      />

      {/* Trainer Name */}
      <p className="text-4xl text-white font-bold">
        {TrainerDetails?.name || "Unknown Trainer"}
      </p>

      {/* Trainer Specialization */}
      <p className="text-xl text-white italic">
        {TrainerDetails?.specialization || "Specialization Not Available"}
      </p>

      {/* Tier Badge */}
      <div className="mt-1">
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
  }),
};

// **Default Props** (Fallback Values)
TrainersDetailsHeader.defaultProps = {
  TrainerDetails: {
    imageUrl: "/default-profile.png",
    name: "Unknown Trainer",
    specialization: "Specialization Not Available",
    tier: null, // No tier by default
  },
};

export default TrainersDetailsHeader;
