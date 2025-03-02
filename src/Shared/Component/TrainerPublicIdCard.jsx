import { Link } from "react-router";

import PropTypes from "prop-types";

// Tier badge styles (Optimized object lookup)
const tierStyles = {
  Bronze: "bg-orange-600 text-white ring-2 ring-orange-300 shadow-lg",
  Silver: "bg-gray-400 text-white ring-2 ring-gray-200 shadow-lg",
  Gold: "bg-yellow-500 text-white ring-2 ring-yellow-300 shadow-lg",
  Diamond: "bg-blue-600 text-white ring-2 ring-blue-300 shadow-lg",
  Platinum: "bg-gray-800 text-white ring-2 ring-gray-500 shadow-lg",
};

const TrainerPublicIdCard = ({ trainer }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl overflow-hidden relative flex flex-col">
      {/* Tier Badge */}
      <span
        className={`absolute opacity-90 top-4 left-4 inline-block px-4 py-1 rounded-full text-sm font-semibold ${
          tierStyles[trainer.tier] || "bg-gray-200 text-gray-700"
        }`}
      >
        {trainer.tier} Tier
      </span>

      {/* Trainer Image */}
      <div>
        <img
          src={trainer.imageUrl}
          alt={trainer.name}
          className="w-full h-[300px] object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="bg-linear-to-bl from-gray-200 to-gray-300 border-t-4 border-black">
        {/* Content */}
        <div className="px-3 text-left flex-1 pt-2  ">
          {/* Trainer Name & Specialization */}
          <h3 className="text-xl font-bold text-gray-800">{trainer.name}</h3>
          <p className="text-gray-600 italic">{trainer.specialization}</p>

          {/* Availability Info */}
          <div className="mt-2 text-sm text-gray-600 space-y-1 border-t border-gray-700">
            <p className="flex justify-between text-md">
              <strong className="text-gray-800">Experience:</strong>{" "}
              <span className="font-semibold">{trainer.experience} years</span>
            </p>
            <p className="flex justify-between text-md">
              <strong className="text-gray-800">
                Fee Per Personal Session:
              </strong>{" "}
              <span className="font-semibold">{trainer.perSession} $</span>
            </p>
            <p className="text-gray-800 text-center font-black border-t border-gray-700 pt-1">
              Available Days
            </p>
            <p className="font-bold text-center">
              [{trainer.availableDays.join(", ")}]
            </p>
          </div>
        </div>

        {/* View Details Button */}
        <div className="mt-auto p-4">
          <Link to={`/Trainers/${trainer.name}`}>
            <button className="w-full border-2 border-red-500 bg-linear-to-tl hover:bg-linear-to-br from-[#c23e5f] to-[#ff0040] py-2 font-semibold rounded-xl hover:text-white">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Prop validation with PropTypes
TrainerPublicIdCard.propTypes = {
  trainer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    specialization: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    experience: PropTypes.number.isRequired,
    perSession: PropTypes.number.isRequired,
    availableDays: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default TrainerPublicIdCard;
