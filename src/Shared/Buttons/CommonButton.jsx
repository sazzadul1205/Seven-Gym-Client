import PropTypes from "prop-types";

const CommonButton = ({
  clickEvent,
  textColor = "text-white",
  bgColor = "blue", // Default single color input
  bgFromColor, // Optional (if user wants to override)
  bgToColor, // Optional (if user wants to override)
  text = "Click Me",
  px = "px-5", // Default horizontal padding
  py = "py-3", // Default vertical padding
  icon, // Optional icon prop
  iconSize = "text-lg", // Default icon size
  isLoading = false, // New: Support for loading state
  loadingText = "Processing...", // New: Custom loading text
}) => {
  // Automatically generate gradient colors if only `bgColor` is provided
  const fromColor = bgFromColor || `${bgColor}-300`;
  const toColor = bgToColor || `${bgColor}-600`;

  return (
    <button
      className={`flex items-center justify-center font-semibold ${px} ${py} rounded-lg cursor-pointer transition-all duration-300 
        ${textColor} 
        bg-gradient-to-bl from-${fromColor} to-${toColor} 
        hover:bg-gradient-to-tr disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={clickEvent}
      disabled={isLoading} // Disable button while loading
    >
      {isLoading ? (
        <span className="flex items-center">
          <span className="animate-spin mr-2">🔄</span> {loadingText}
        </span>
      ) : (
        <>
          {icon && <span className={`mr-2 ${iconSize}`}>{icon}</span>}
          {text}
        </>
      )}
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
  isLoading: PropTypes.bool, // New: Show loading state
  loadingText: PropTypes.string, // New: Custom loading text
};

export default CommonButton;
