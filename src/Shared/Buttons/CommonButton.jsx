import PropTypes from "prop-types";

const CommonButton = ({
  clickEvent,
  textColor = "text-white",
  bgColor = "blue", // Single color input
  bgFromColor, // Optional (if user wants to override)
  bgToColor, // Optional (if user wants to override)
  text = "Click Me",
  px = "px-5", // Default horizontal padding
  py = "py-3", // Default vertical padding
  icon, // Optional icon prop
  iconSize = "text-lg", // Default icon size
}) => {
  // Automatically generate `from` and `to` colors if only `bgColor` is provided
  const fromColor = bgFromColor || `${bgColor}-300`;
  const toColor = bgToColor || `${bgColor}-600`;

  return (
    <button
      className={`flex items-center font-semibold ${px} ${py} rounded-lg cursor-pointer transition-all duration-300 
        ${textColor} 
        bg-gradient-to-bl from-${fromColor} to-${toColor} 
        hover:bg-gradient-to-tr`}
      onClick={clickEvent}
    >
      {icon && <span className={`mr-2 ${iconSize}`}>{icon}</span>}{" "}
      {/* Render icon with custom size */}
      {text}
    </button>
  );
};

// PropTypes for type validation
CommonButton.propTypes = {
  clickEvent: PropTypes.func,
  textColor: PropTypes.string,
  bgColor: PropTypes.string, // Single color input
  bgFromColor: PropTypes.string, // Optional override
  bgToColor: PropTypes.string, // Optional override
  text: PropTypes.string,
  px: PropTypes.string, // Horizontal padding
  py: PropTypes.string, // Vertical padding
  icon: PropTypes.node, // Icon component or element
  iconSize: PropTypes.string, // Custom size for the icon
};

export default CommonButton;
