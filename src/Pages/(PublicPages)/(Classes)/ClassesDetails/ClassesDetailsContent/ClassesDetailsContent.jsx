// import packages
import PropTypes from "prop-types";

// import icons
import {
  FaRegFileAlt,
  FaInfoCircle,
  FaChartLine,
  FaClipboardList,
} from "react-icons/fa";

const ClassesDetailsContent = ({ ThisModule }) => {
  const {
    module,
    description,
    additionalInfo,
    difficultyLevel,
    prerequisites,
    icon,
  } = ThisModule || {};

  return (
    <div className="bg-gradient-to-bl from-gray-200/80 to-gray-400/50 p-1 md:p-10 mx-0 md:mx-32 rounded-none md:rounded-xl shadow-inner">
      <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-8">
        {/* Left Section - Details */}
        <div className="md:col-span-2 space-y-2 md:space-y-6 md:w-2/3">
          <InfoSection
            icon={FaRegFileAlt}
            title="Description"
            content={description || "No description available."}
          />
          <InfoSection
            icon={FaInfoCircle}
            title="Additional Info"
            content={additionalInfo || "No additional information provided."}
          />
          <InfoSection
            icon={FaChartLine}
            title="Difficulty Level"
            content={difficultyLevel || "Not specified."}
          />
          <InfoSection
            icon={FaClipboardList}
            title="Prerequisites"
            content={prerequisites || "No prerequisites required."}
          />
        </div>

        {/* Right Section - Module Card */}
        <div
          className="flex flex-col items-center justify-center gap-4
             border border-black/30 border-dashed rounded-2xl
             p-6 bg-linear-to-bl hover:bg-linear-to-tr from-white/50 to-gray-300/90 shadow-lg
             hover:shadow-2xl hover:-translate-y-1 transform
             transition-all duration-300 ease-in-out
             min-h-[320px] md:min-h-[380px] md:w-1/3"
        >
          {/* Icon */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-red-300 shadow-md bg-white">
            <img
              src={icon}
              alt={module || "Module Icon"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Module Name */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center">
            {module || "Untitled Module"}
          </h2>

          {/* Divider */}
          <div className="w-16 border-b-2 border-red-400" />

          {/* Overview Text */}
          <p className="text-sm md:text-base text-gray-700 text-center leading-relaxed px-2">
            Dive into an engaging and thoughtfully designed experience crafted
            for learners of all levels.
          </p>
        </div>
      </div>
    </div>
  );
};

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

// Info Section Card
const InfoSection = ({ icon: Icon, title, content }) => (
  <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/100 shadow-sm hover:shadow-md transition-shadow duration-200">
    {/* Title  */}
    <div className="flex items-center gap-3">
      {/* Icons */}
      <Icon className="text-red-600 text-xl md:text-2xl" />

      {/* Title */}
      <h3 className="text-lg md:text-xl font-semibold text-gray-800">
        {title}
      </h3>
    </div>

    {/* Content */}
    <p className="text-gray-700 ml-1 pl-8 leading-relaxed">{content}</p>
  </div>
);

// Prop Validation
InfoSection.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};
