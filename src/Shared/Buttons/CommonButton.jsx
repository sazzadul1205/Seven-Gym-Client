import PropTypes from "prop-types";

const CommonButton = ({
  clickEvent,
  textColor = "text-white",
  bgColor = "blue", // Single color input
  bgFromColor, // Optional (if user wants to override)
  bgToColor, // Optional (if user wants to override)
  text, // Optional text (if omitted and only an icon is provided, the text will be removed)
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
      className={`flex items-center justify-center font-semibold ${py} rounded-lg cursor-pointer transition-all duration-300 
        ${textColor} 
        bg-gradient-to-bl from-${fromColor} to-${toColor} 
        hover:bg-gradient-to-tr 
        ${text ? px : "p-2"}`} // Adjust padding if only an icon is present
      onClick={clickEvent}
    >
      {icon && <span className={iconSize}>{icon}</span>}
      {text && <span className="ml-2">{text}</span>}
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
  text: PropTypes.string, // Optional text
  px: PropTypes.string, // Horizontal padding
  py: PropTypes.string, // Vertical padding
  icon: PropTypes.node, // Icon component or element
  iconSize: PropTypes.string, // Custom size for the icon
};

export default CommonButton;
