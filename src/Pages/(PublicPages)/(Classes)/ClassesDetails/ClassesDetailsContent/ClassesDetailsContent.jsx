import PropTypes from "prop-types";
import {
  FaRegFileAlt,
  FaInfoCircle,
  FaChartLine,
  FaClipboardList,
} from "react-icons/fa";

const ClassesDetailsContent = ({ ThisModule }) => {
  return (
    <div className="max-w-7xl mx-auto bg-gradient-to-bl from-gray-200 to-gray-400 rounded-lg shadow-2xl relative z-10 p-6 md:p-12 -mt-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Content - Module Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Description Section */}
          <div className="flex flex-col">
            <h3 className="flex items-center text-xl md:text-2xl font-semibold text-gray-800">
              <FaRegFileAlt className="mr-2 text-indigo-600" />
              Description
            </h3>
            <p className="text-black mt-2 ml-5">
              {ThisModule?.description || "No description available."}
            </p>
          </div>

          {/* Additional Information Section */}
          <div className="flex flex-col">
            <h3 className="flex items-center text-xl md:text-2xl font-semibold text-gray-800">
              <FaInfoCircle className="mr-2 text-indigo-600" />
              Additional Info
            </h3>
            <p className="text-black mt-2 ml-5">
              {ThisModule?.additionalInfo ||
                "No additional information provided."}
            </p>
          </div>

          {/* Difficulty Level Section */}
          <div className="flex flex-col">
            <h3 className="flex items-center text-xl md:text-2xl font-semibold text-gray-800">
              <FaChartLine className="mr-2 text-indigo-600" />
              Difficulty Level
            </h3>
            <p className="text-black mt-2 ml-5">
              {ThisModule?.difficultyLevel || "Not specified."}
            </p>
          </div>

          {/* Prerequisites Section */}
          <div className="flex flex-col">
            <h3 className="flex items-center text-xl md:text-2xl font-semibold text-gray-800">
              <FaClipboardList className="mr-2 text-indigo-600" />
              Prerequisites
            </h3>
            <p className="text-black mt-2 ml-5">
              {ThisModule?.prerequisites || "No prerequisites required."}
            </p>
          </div>
        </div>

        {/* Right Content - Module Overview */}
        <div className="flex flex-col items-center border-2 border-dotted border-black rounded-lg p-6 bg-linear-to-br hover:bg-linear-to-tl from-gray-300 to-gray-100 shadow-xl hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out">
          {/* Module Icon */}
          <img
            src={ThisModule?.icon}
            alt={ThisModule?.module}
            className="w-20 h-20 md:w-24 md:h-24 object-cover mb-4"
          />

          {/* Module Name */}
          <p className="text-lg font-medium text-gray-800 text-center">
            {ThisModule?.module}
          </p>

          {/* Brief Overview */}
          <p className="text-black mt-2 text-center">
            Explore and enjoy this exciting and engaging activity tailored for
            all!
          </p>
        </div>
      </div>
    </div>
  );
};

/* PropTypes Validation */
ClassesDetailsContent.propTypes = {
  ThisModule: PropTypes.shape({
    module: PropTypes.string.isRequired,
    description: PropTypes.string,
    additionalInfo: PropTypes.string,
    difficultyLevel: PropTypes.string,
    prerequisites: PropTypes.string,
    icon: PropTypes.string.isRequired,
  }).isRequired,
};

export default ClassesDetailsContent;
