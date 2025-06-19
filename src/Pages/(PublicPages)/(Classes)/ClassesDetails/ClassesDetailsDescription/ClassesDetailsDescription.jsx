import PropTypes from "prop-types";

const ClassesDetailsDescription = ({ ThisModule }) => {
  // Extract description using fallback and provide a default message if none exists
  const description =
    ThisModule?.detailedDescription ||
    ThisModule?.bigDescription ||
    "No detailed description available.";

  return (
    <div className="bg-gradient-to-bl from-gray-200/80 to-gray-500/50 p-6 md:p-10 mx-4 md:mx-32 rounded-xl shadow-inner">
      {/* Section Title */}
      <h3 className="text-2xl text-white font-semibold  pb-2 border-b-2 border-gray-100">
        Detailed Description
      </h3>
      {/* Description Content */}
      <p className="pt-4 text-white leading-relaxed text-lg italic ">{description}</p>
    </div>
  );
};

ClassesDetailsDescription.propTypes = {
  ThisModule: PropTypes.shape({
    detailedDescription: PropTypes.string,
    bigDescription: PropTypes.string,
  }).isRequired,
};

export default ClassesDetailsDescription;
