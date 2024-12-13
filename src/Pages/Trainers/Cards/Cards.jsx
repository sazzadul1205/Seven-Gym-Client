/* eslint-disable react/prop-types */
const Cards = ({ trainer, getTierBadge }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden relative flex flex-col">
      {/* Tier Badge */}
      <span
        className={`absolute top-4 left-4 inline-block px-4 py-2 rounded-full text-sm font-semibold ${getTierBadge(
          trainer.tier
        )}`}
      >
        {trainer.tier} Tier
      </span>

      <img
        src={trainer.imageUrl}
        alt={trainer.name}
        className="w-full h-[300px] object-cover"
      />
      <div className="p-6 flex-1">
        <h3 className="text-xl font-bold">{trainer.name}</h3>
        <p className="text-gray-600">({trainer.specialization})</p>
        <div className="mt-4 text-sm">
          <p>
            <strong>Active Time: </strong>
            {trainer.availableFrom} - {trainer.availableUntil}
          </p>
          <p>
            <strong>Available Days: </strong>
            {trainer.availableDays.join(", ")}
          </p>
        </div>
      </div>
      <button className="mt-auto px-6 py-2 text-white bg-red-500 hover:bg-red-600 rounded-b-lg">
        Book Trainer
      </button>
    </div>
  );
};

export default Cards;
