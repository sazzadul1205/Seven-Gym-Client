import { Link } from "react-router";

// Import Package
import PropTypes from "prop-types";

// Import Icons
import { IoSettings } from "react-icons/io5";

const TrainerProfileAbout = ({ TrainerDetails }) => {
  return (
    <div className="relative bg-gradient-to-bl from-gray-200 to-gray-400 rounded-lg shadow-lg max-w-4xl mx-auto w-full space-y-6 p-6">
      {/* Settings Icon (Top Right) */}
      <div className="absolute top-2 right-2 p-2">
        <Link to="/Trainer/TrainerSettings?tab=User_Info_Settings">
          <IoSettings className="text-red-500 text-4xl transition-transform duration-500 hover:rotate-180 hover:text-red-400" />
        </Link>
      </div>

      {/* Trainer Name & Bio Section */}
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-gray-800">
          About {TrainerDetails?.name || "Unknown Trainer"}
        </h2>
        <p className="text-lg text-black italic mt-3">
          {TrainerDetails?.bio || "No bio available."}
        </p>
      </div>

      {/* Trainer Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Experience */}
        <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md border-2 border-gray-300 hover:shadow-xl cursor-pointer transition">
          <h3 className="font-semibold text-xl text-gray-800">Experience</h3>
          <p className="text-lg italic text-black mt-1">
            {TrainerDetails?.experience
              ? `${TrainerDetails?.experience} years`
              : "N/A"}
          </p>
        </div>

        {/* Age */}
        <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md border-2 border-gray-300 hover:shadow-xl cursor-pointer transition">
          <h3 className="font-semibold text-xl text-gray-800">Age</h3>
          <p className="text-lg italic text-black mt-1">
            {TrainerDetails?.age ? `${TrainerDetails?.age} years` : "N/A"}
          </p>
        </div>

        {/* Available Days - Full Width */}
        <div className="sm:col-span-2 flex flex-col items-center bg-white p-4 rounded-lg shadow-md border-2 border-gray-300 hover:shadow-xl cursor-pointer transition">
          <h3 className="font-semibold text-xl text-gray-800">
            Available Days
          </h3>
          <p className="text-lg italic text-black mt-1">
            {TrainerDetails?.availableDays?.length
              ? TrainerDetails?.availableDays.join(", ")
              : "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
};

// Prop Types Validation
TrainerProfileAbout.propTypes = {
  TrainerDetails: PropTypes.shape({
    name: PropTypes.string,
    bio: PropTypes.string,
    experience: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    age: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    availableDays: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default TrainerProfileAbout;
