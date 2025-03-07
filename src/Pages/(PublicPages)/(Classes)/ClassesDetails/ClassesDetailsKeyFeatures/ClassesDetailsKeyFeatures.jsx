import PropTypes from "prop-types";

const ClassesDetailsKeyFeatures = ({ ThisModule }) => {
  // Predefined color palette for tags
  const tagColors = [
    "#F72C5B", // Vibrant Red
    "#FFD700", // Gold (bright, so black text)
    "#4CAF50", // Green
    "#1E90FF", // Dodger Blue
    "#FF4500", // Orange Red
    "#8A2BE2", // Blue Violet
    "#FF69B4", // Hot Pink (bright, so black text)
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
          className="font-semibold px-4 md:px-6 py-2 rounded-xl text-center text-sm sm:text-base hover:scale-110 transition-transform duration-300 ease-in-out"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {feature}
        </p>
      );
    });
  };

  return (
    <div className="mx-auto max-w-7xl bg-gradient-to-bl from-gray-200 to-gray-400 rounded-lg shadow-2xl py-5 px-5">
      <h3 className="text-2xl font-semibold text-gray-800 pb-2 border-b-2 border-gray-100">
        Key Features:
      </h3>
      <div className="flex flex-wrap px-3 gap-2 md:gap-5 pt-5">
        {renderTags()}
      </div>
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
