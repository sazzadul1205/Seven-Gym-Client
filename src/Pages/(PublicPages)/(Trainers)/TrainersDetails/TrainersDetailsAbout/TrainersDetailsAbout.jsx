import PropTypes from "prop-types";

const TrainersDetailsAbout = ({ TrainerDetails }) => {
  // Handle case where TrainerDetails is missing
  if (!TrainerDetails)
    return (
      <p className="text-red-500 text-center font-semibold">
        Trainer details not available.
      </p>
    );

  return (
    <div className="bg-gradient-to-bl from-gray-200 to-gray-400 p-6 rounded-lg shadow-lg max-w-4xl mx-auto w-full space-y-6">
      {/* Trainer Name & Bio Section */}
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-gray-800">
          About {TrainerDetails.name || "Unknown Trainer"}
        </h2>
        <p className="text-lg text-gray-700 italic mt-3">
          {TrainerDetails.bio || "No bio available."}
        </p>
      </div>

      {/* Trainer Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Experience */}
        <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md border-2 border-gray-300 hover:shadow-lg transition">
          <h3 className="font-semibold text-xl text-gray-800">Experience</h3>
          <p className="text-lg italic text-gray-700 mt-1">
            {TrainerDetails.experience
              ? `${TrainerDetails.experience} years`
              : "N/A"}
          </p>
        </div>

        {/* Age */}
        <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md border-2 border-gray-300 hover:shadow-lg transition">
          <h3 className="font-semibold text-xl text-gray-800">Age</h3>
          <p className="text-lg italic text-gray-700 mt-1">
            {TrainerDetails.age ? `${TrainerDetails.age} years` : "N/A"}
          </p>
        </div>

        {/* Available Days - Full Width */}
        <div className="sm:col-span-2 flex flex-col items-center bg-white p-4 rounded-lg shadow-md border-2 border-gray-300 hover:shadow-lg transition">
          <h3 className="font-semibold text-xl text-gray-800">
            Available Days
          </h3>
          <p className="text-lg italic text-gray-700 mt-1">
            {TrainerDetails.availableDays?.length
              ? TrainerDetails.availableDays.join(", ")
              : "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
};

// Prop validation to ensure correct data types
TrainersDetailsAbout.propTypes = {
  TrainerDetails: PropTypes.shape({
    name: PropTypes.string,
    bio: PropTypes.string,
    experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    availableDays: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default TrainersDetailsAbout;
