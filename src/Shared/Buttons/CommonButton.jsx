import PropTypes from "prop-types";
import { ImSpinner9 } from "react-icons/im";

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
  disabled = false, // Disabled state
}) => {
  // Preset color gradients for common background colors
  const colorMap = {
    OriginalRed: {
      from: "from-[#c23e5f]",
      to: "to-[#ff0040]",
    },
    indigo: {
      from: "from-indigo-300",
      to: "to-indigo-600",
    },
    purple: {
      from: "from-purple-300",
      to: "to-purple-600",
    },
    // add other colors as needed
  };

  // Determine fromColor and toColor using override or colorMap fallback
  const fromColor = bgFromColor
    ? `from-[${bgFromColor}]`
    : colorMap[bgColor]?.from || `from-${bgColor}-300`;

  const toColor = bgToColor
    ? `to-[${bgToColor}]`
    : colorMap[bgColor]?.to || `to-${bgColor}-600`;

  const isButtonDisabled = isLoading || disabled; // Disable button if loading or disabled

  return (
    <button
      type={type}
      className={`flex w-${width} items-center justify-center font-semibold ${px} ${py} ${borderRadius} ${cursorStyle} transition-all duration-300 
        ${textColor} 
        bg-gradient-to-bl ${fromColor} ${toColor}
        hover:bg-gradient-to-tr active:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed`} // Add active:opacity-70 for mobile feedback
      onClick={clickEvent}
      disabled={isButtonDisabled} // Disable button while loading
    >
      {isLoading ? (
        // Show loading state with spinner
        <span className="flex items-center">
          <span className="animate-spin mr-2"><ImSpinner9 /></span> {loadingText}
        </span>
      ) : (
        <>
          {/* Optional icon */}
          {icon && (
            <span className={`${text ? "mr-2" : ""} ${iconSize}`}>{icon}</span>
          )}
          {/* Optional button text */}
          {text && <span>{text}</span>}
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
  disabled: PropTypes.bool, // New: Disabled state
};

export default CommonButton;
