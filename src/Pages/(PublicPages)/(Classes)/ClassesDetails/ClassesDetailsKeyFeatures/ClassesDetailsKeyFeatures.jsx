import PropTypes from "prop-types";

const ClassesDetailsKeyFeatures = ({ ThisModule }) => {
  // Predefined color palette for tags
  const tagColors = [
    "#F72C5B",
    "#FFD700",
    "#4CAF50",
    "#1E90FF",
    "#FF4500",
    "#8A2BE2",
    "#FF69B4",
  ];

  const getContrastColor = (hexColor) => {
    // Remove the hash and convert hex to RGB components
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Calculate brightness using the standard formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    // Return "black" if brightness is high; else, "white"
    return brightness > 155 ? "black" : "white";
  };

  const renderTags = () => {
    if (!ThisModule?.tags || ThisModule.tags.length === 0) return null;
    return ThisModule.tags.map((feature, index) => {
      // Cycle through the color palette based on the current index
      const bgColor = tagColors[index % tagColors.length];
      const textColor = getContrastColor(bgColor);
      return (
        <p
          key={index}
          className="font-semibold px-2 md:px-10 py-2 rounded-xl text-center text-sm sm:text-base hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer "
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {feature}
        </p>
      );
    });
  };

  return (
    <div className="bg-gradient-to-bl from-gray-200/80 to-gray-500/50 p-2 md:p-10 mx-0 md:mx-32 rounded-none md:rounded-xl shadow-inner">
      {/* Section Title */}
      <h3 className="text-2xl text-white font-semibold  pb-2 border-b-2 border-gray-100">
        Key Features:
      </h3>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 md:gap-2 pt-3">{renderTags()}</div>
    </div>
  );
};

/* PropTypes Validation */
ClassesDetailsKeyFeatures.propTypes = {
  ThisModule: PropTypes.shape({
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ClassesDetailsKeyFeatures;
