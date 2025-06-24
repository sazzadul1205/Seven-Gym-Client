import PropTypes from "prop-types";
import { IoSettings } from "react-icons/io5";
import { Tooltip } from "react-tooltip";

const ManagementClassKeyFeatures = ({ selectedClass }) => {
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
    if (!selectedClass?.tags || selectedClass.tags.length === 0) return null;
    return selectedClass.tags.map((feature, index) => {
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
    <div className="relative bg-gradient-to-bl from-gray-200/80 to-gray-500/50 p-2 md:p-10 mx-0 md:mx-10 rounded-none md:rounded-xl shadow-inner">
      {/* Settings Icon (Top Left) */}
      <>
        <div
          className="absolute top-2 right-2 bg-gray-600/90 p-3 rounded-full cursor-pointer "
          data-tooltip-id="Class_Details_Key_Features_Edit"
          onClick={() =>
            document
              .getElementById("Class_Details_Key_Features_Edit_Modal")
              .showModal()
          }
        >
          <IoSettings className="text-red-500 text-3xl transition-transform duration-500 hover:rotate-180 hover:text-red-400" />
        </div>
        <Tooltip
          id="Class_Details_Key_Features_Edit"
          place="top"
          className="z-50"
          content="Edit Class Key Features "
        />
      </>

      {/* Section Title */}
      <h3 className="text-2xl text-white font-semibold  pb-2 border-b-2 border-gray-100">
        Key Features:
      </h3>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 md:gap-2 pt-3">{renderTags()}</div>
    </div>
  );
};

//  PropTypes Validation
ManagementClassKeyFeatures.propTypes = {
  selectedClass: PropTypes.shape({
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default ManagementClassKeyFeatures;
