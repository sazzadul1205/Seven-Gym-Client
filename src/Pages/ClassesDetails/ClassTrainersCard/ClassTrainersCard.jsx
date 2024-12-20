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

const ClassTrainersCard = ({ trainer, role }) => {
  return (
    <div
      key={trainer._id}
      className="bg-white rounded-lg shadow-lg overflow-hidden relative flex flex-col transform transition-transform hover:scale-105 hover:shadow-xl"
    >
      {/* Tier Badge */}
      <span
        className={`absolute top-4 left-4 inline-block px-4 py-1 rounded-full text-sm font-semibold ${getTierBadge(
          trainer.tier
        )}`}
      >
        {trainer.tier} Tier
      </span>

      {/* Trainer Image */}
      <img
        src={trainer.imageUrl}
        alt={trainer.name}
        className="w-full h-[300px] object-cover rounded-t-lg"
      />

      {/* Card Content */}
      <div className="text-left flex-1">
        {/* Role Badge at the top of the card */}
        <p className="bg-white py-2 text-center font-semibold text-sm shadow-md w-full">
          {role}
        </p>

        <div className="py-2 px-6">
          {/* Trainer Name */}
          <h3 className="text-xl font-semibold text-gray-800">
            {trainer.name}
          </h3>
          <p className="text-gray-600 italic">{trainer.specialization}</p>

          {/* Experience Info */}
          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong className="text-gray-800">Experience:</strong>{" "}
              {trainer.experience}
            </p>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="mt-auto p-4">
        <button className="px-4 py-2 font-medium text-black hover:text-white border-2 border-[#F72C5B] hover:bg-[#d1234f] rounded-md w-full shadow-md transition-all">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ClassTrainersCard;
