/* eslint-disable react/prop-types */
// Function to return tier badge style
const getTierBadge = (tier) => {
  const styles = {
    Bronze: "bg-orange-600 text-white ring-2 ring-orange-300 shadow-lg",
    Silver: "bg-gray-400 text-white ring-2 ring-gray-200 shadow-lg",
    Gold: "bg-yellow-500 text-white ring-2 ring-yellow-300 shadow-lg",
    Diamond: "bg-blue-600 text-white ring-2 ring-blue-300 shadow-lg",
    Platinum: "bg-gray-800 text-white ring-2 ring-gray-500 shadow-lg",
  };
  return styles[tier] || "bg-gray-200 text-gray-700";
};

const TDImages = ({ TrainerDetails }) => {
  return (
    <div className="bg-[#f72c5bb2] mx-auto text-center py-5">
      <img
        src={TrainerDetails.imageUrl}
        alt={TrainerDetails.name}
        className="w-32 h-32 rounded-full mx-auto mb-1"
      />
      <p className="text-4xl text-white font-bold">{TrainerDetails.name}</p>
      <p className="text-xl text-white">{TrainerDetails.specialization}</p>
      {/* Tier Badge */}
      <span
        className={`inline-block px-6 py-1 mt-2 rounded-full text-sm font-semibold ${getTierBadge(
          TrainerDetails.tier
        )}`}
      >
        {TrainerDetails.tier} Tier
      </span>
    </div>
  );
};

export default TDImages;
