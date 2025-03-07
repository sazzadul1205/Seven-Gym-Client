import PropTypes from "prop-types";

const ClassesDetailsDescription = ({ ThisModule }) => {
  // Extract description using fallback and provide a default message if none exists
  const description =
    ThisModule?.detailedDescription ||
    ThisModule?.bigDescription ||
    "No detailed description available.";

  return (
    <div className="mx-auto max-w-7xl bg-gradient-to-bl from-gray-200 to-gray-400 rounded-lg shadow-2xl py-5 px-5">
      {/* Section Title */}
      <h3 className="text-2xl font-semibold text-gray-800 pb-2 border-b-2 border-gray-100">
        Detailed Description
      </h3>
      {/* Description Content */}
      <p className="mt-4 leading-relaxed text-lg italic text-gray-700">
        {description}
      </p>
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
