import PropTypes from "prop-types";

const CommonButton = ({
  clickEvent,
  type = "submit", // Default type
  textColor = "text-white",
  bgColor = "blue", // Default color
  bgFromColor, // Optional override
  bgToColor, // Optional override
  text = "",
  px = "px-5", // Horizontal padding
  py = "py-3", // Vertical padding
  icon, // Optional icon
  iconSize = "text-lg", // Icon size
  isLoading = false, // Loading state
  loadingText = "Processing...", // Custom loading text
  borderRadius = "rounded-lg", // Border radius
  width = "auto", // Custom width
  cursorStyle = "cursor-pointer", // Default cursor
}) => {
  // Automatically generate gradient colors if only `bgColor` is provided
  const fromColor = bgFromColor || `${bgColor}-300`;
  const toColor = bgToColor || `${bgColor}-600`;

  return (
    <button
      type={type}
      className={`flex w-${width} items-center justify-center font-semibold ${px} ${py} ${borderRadius} ${cursorStyle} transition-all duration-300 
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
          {icon && (
            <span className={`${text ? "mr-2" : ""} ${iconSize}`}>{icon}</span>
          )}
          {text && <span>{text}</span>} {/* Conditionally render text */}
        </>
      )}
    </button>
  );
};

// PropTypes for type validation
CommonButton.propTypes = {
  clickEvent: PropTypes.func,
  type: PropTypes.string,
  textColor: PropTypes.string,
  bgColor: PropTypes.string,
  bgFromColor: PropTypes.string,
  bgToColor: PropTypes.string,
  text: PropTypes.string,
  px: PropTypes.string,
  py: PropTypes.string,
  icon: PropTypes.node,
  iconSize: PropTypes.string,
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string,
  borderRadius: PropTypes.string,
  width: PropTypes.string,
  cursorStyle: PropTypes.string, // New: Custom cursor style
};

export default CommonButton;
