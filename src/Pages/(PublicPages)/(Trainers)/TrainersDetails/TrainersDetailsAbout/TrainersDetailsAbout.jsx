import PropTypes from "prop-types";

const TrainersDetailsAbout = ({ TrainerDetails }) => {
  // Handle case where TrainerDetails is missing
  if (!TrainerDetails)
    return (
      <p className="text-red-500 text-center">Trainer details not available.</p>
    );

  // Array to store trainer details dynamically
  const details = [
    {
      label: "Experience",
      value: TrainerDetails.experience
        ? `${TrainerDetails.experience} years`
        : "N/A",
    },
    {
      label: "Age",
      value: TrainerDetails.age ? `${TrainerDetails.age} years` : "N/A",
    },
    { label: "Gender", value: TrainerDetails.gender || "Not specified" },
    {
      label: "Available Days",
      value: TrainerDetails.availableDays?.length
        ? TrainerDetails.availableDays.join(", ")
        : "Not available",
    },
  ];

  return (
    <div className="bg-linear-to-bl from-gray-200 to-gray-400 p-5 rounded-lg shadow-lg max-w-4xl mx-auto space-y-4">
      {/* Trainer Name & Bio Section */}
      <div className="space-y-4">
        <h2 className="text-3xl text-black font-semibold mb-3">
          About {TrainerDetails.name || "Unknown Trainer"}
        </h2>
        <p className="text-lg text-gray-700 italic">
          {TrainerDetails.bio || "No bio available."}
        </p>
      </div>

      {/* Grid layout for Trainer Details */}
      <div className="grid grid-cols-2 md:grid-col-1 gap-6">
        {details.map(({ label, value }) => (
          <div
            key={label}
            className="bg-linear-to-bl hover:bg-linear-to-tr from-white/20 to-gray-200 p-4 rounded-lg shadow-xs hover:shadow-2xl border-2 border-black"
          >
            <h3 className="font-semibold text-xl text-black">{label} :</h3>
            <p className="text-lg italic text-gray-700">{value}</p>
          </div>
        ))}
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
    gender: PropTypes.string,
    availableDays: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default TrainersDetailsAbout;
