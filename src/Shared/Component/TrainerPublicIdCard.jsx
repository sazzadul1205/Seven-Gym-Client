import { Link } from "react-router";
import PropTypes from "prop-types";
import { fetchTierBadge } from "../../Utility/fetchTierBadge";

const TrainerPublicIdCard = ({ trainer }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden relative flex flex-col border border-gray-300">
      {/* Tier Badge */}
      {trainer?.tier && (
        <span
          className={`absolute top-3 left-3 z-10 ${fetchTierBadge(
            trainer.tier
          )} px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md`}
        >
          {trainer.tier} Tier
        </span>
      )}

      {/* Trainer Image */}
      <div className="relative">
        <img
          src={trainer?.imageUrl}
          alt={trainer?.name}
          className="w-full h-[260px] object-cover object-top"
        />
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 justify-between bg-gradient-to-b from-gray-100 to-gray-200 p-4 space-y-4">
        {/* Trainer Info */}
        <div>
          <h4 className="text-2xl font-bold text-gray-800">{trainer?.name}</h4>
          <p className="text-gray-600 italic text-sm">
            {trainer?.specialization}
          </p>
        </div>

        {/* Stats Section */}
        <div className="text-sm text-gray-700 space-y-1 border-t pt-1 border-gray-400">
          <div className="flex justify-between">
            <span className="font-medium">Experience:</span>
            <span className="font-semibold">{trainer?.experience} yrs</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Age:</span>
            <span className="font-semibold text-green-700">{trainer?.age} yrs old</span>
          </div>
        </div>

        {/* Availability */}
        <div className="text-center border-t border-gray-400 pt-2">
          <p className="text-gray-800 font-bold text-sm mb-1">Available Days</p>
          <p className="font-semibold text-xs text-gray-600">
            [{trainer?.availableDays.join(", ")}]
          </p>
        </div>

        {/* CTA Button */}
        <div>
          <Link to={`/Trainers/${trainer?.name}`}>
            <button className="w-full py-2 bg-gradient-to-r from-[#c23e5f] to-[#ff0040] text-white font-semibold rounded-lg border border-red-500 hover:brightness-110 transition-all duration-200">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

TrainerPublicIdCard.propTypes = {
  trainer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    specialization: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    experience: PropTypes.number.isRequired,
    age: PropTypes.number.isRequired,
    perSession: PropTypes.number.isRequired,
    availableDays: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default TrainerPublicIdCard;
