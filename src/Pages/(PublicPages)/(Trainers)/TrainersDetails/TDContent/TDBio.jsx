import PropTypes from "prop-types";

const TDBio = ({ TrainerDetails }) => {
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
    <div className="bg-gradient-to-bl from-gray-200 to-gray-400 p-5 rounded-lg shadow-lg max-w-4xl mx-auto space-y-4">
      {/* Trainer Name & Bio Section */}
      <h2 className="text-3xl font-semibold mb-3">
        About {TrainerDetails.name || "Unknown Trainer"}
      </h2>
      <p className="text-lg text-gray-700 italic">
        {TrainerDetails.bio || "No bio available."}
      </p>

      {/* Grid layout for Trainer Details */}
      <div className="grid grid-cols-2 md:grid-col-1 gap-6">
        {details.map(({ label, value }) => (
          <div
            key={label}
            className="bg-gradient-to-bl hover:bg-gradient-to-tr from-white/20 to-gray-200 p-4 rounded-lg shadow-sm hover:shadow-2xl border-2 border-black"
          >
            <h3 className="font-semibold text-xl">{label} :</h3>
            <p className="text-lg italic">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Prop validation to ensure correct data types
TDBio.propTypes = {
  TrainerDetails: PropTypes.shape({
    name: PropTypes.string,
    bio: PropTypes.string,
    experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gender: PropTypes.string,
    availableDays: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default TDBio;
