/* eslint-disable react/prop-types */
const Cards = ({ trainer, getTierBadge }) => {
  return (
    <div
      key={trainer._id}
      className="bg-white rounded-lg shadow-lg overflow-hidden relative flex flex-col transform transition-transform hover:scale-105"
    >
      {/* Tier Badge */}
      <span
        className={`absolute opacity-90 top-4 left-4 inline-block px-4 py-1 rounded-full text-sm font-semibold ${getTierBadge(
          trainer.tier
        )}`}
      >
        {trainer.tier} Tier
      </span>

      {/* Trainer Image */}
      <img
        src={trainer.imageUrl}
        alt={trainer.name}
        className="w-full h-[300px] object-cover"
      />

      {/* Card Content */}
      <div className="p-6 text-left flex-1">
        {/* Trainer Name */}
        <h3 className="text-xl font-bold text-gray-800">{trainer.name}</h3>
        <p className="text-gray-600 italic">{trainer.specialization}</p>

        {/* Availability Info */}
        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <p>
            <strong className="text-gray-800">Esperance:</strong>{" "}
            {trainer.experience}
          </p>
          <p>
            <strong className="text-gray-800">Fee Per Session:</strong>{" "}
            {trainer.fees.perSession}
          </p>
          <p>
            <strong className="text-gray-800">Available Days:</strong>{" "}
            {trainer.availableDays.join(", ")}
          </p>
        </div>
      </div>

      {/* Book Teacher Button */}
      <div className="mt-auto p-4">
        <button className="px-4 py-2 font-medium text-white bg-[#F72C5B] hover:bg-[#d1234f] rounded-md w-full shadow-md transition-all">
          Book Teacher
        </button>
      </div>
    </div>
  );
};

export default Cards;