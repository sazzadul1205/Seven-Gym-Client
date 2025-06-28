import PropTypes from "prop-types";
import { ImSpinner9 } from "react-icons/im";

const CommonButton = ({
  clickEvent,
  type = "submit",
  textColor = "text-white",
  bgColor = "blue",
  bgFromColor,
  bgToColor,
  text = "",
  px = "px-5",
  py = "py-3",
  icon,
  iconSize = "text-lg",
  isLoading = false,
  loadingText = "Processing...",
  borderRadius = "rounded-lg",
  width = "auto",
  cursorStyle = "cursor-pointer",
  disabled = false,
  className = "",
  iconPosition = "before",
}) => {
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
    TestimonialColor: {
      from: "from-[#A1662F]",
      to: "to-[#CC6300C8]",
    },
    DarkRed: {
      from: "from-red-600",
      to: "to-red-700",
    },
    gray: {
      from: "from-gray-300",
      to: "to-gray-600",
    },
  };

  // Detect whether custom values are used
  const usingCustomGradient = !!(bgFromColor || bgToColor);

  // Get tailwind-safe classes or fallback to custom inline style
  const fromColor = !usingCustomGradient
    ? colorMap[bgColor]?.from || `from-${bgColor}-300`
    : "";

  const toColor = !usingCustomGradient
    ? colorMap[bgColor]?.to || `to-${bgColor}-600`
    : "";

  const isButtonDisabled = isLoading || disabled;

  // Build style for custom gradient if custom colors are used
  const customStyle = usingCustomGradient
    ? {
        "--tw-gradient-from": bgFromColor,
        "--tw-gradient-to": bgToColor,
        "--tw-gradient-stops": `var(--tw-gradient-from), var(--tw-gradient-to)`,
      }
    : {};

  return (
    <button
      type={type}
      style={customStyle}
      className={`flex w-${width} items-center justify-center font-semibold ${px} ${py} ${borderRadius} ${cursorStyle} transition-all duration-300 
        ${textColor} 
        bg-gradient-to-bl ${fromColor} ${toColor}
        hover:bg-gradient-to-tr active:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={clickEvent}
      disabled={isButtonDisabled}
    >
      {isLoading ? (
        <span className="flex items-center">
          <span className="animate-spin mr-2">
            <ImSpinner9 />
          </span>{" "}
          {loadingText}
        </span>
      ) : (
        <>
          {icon && iconPosition === "before" && (
            <span className={`${text ? "mr-2" : ""} ${iconSize}`}>{icon}</span>
          )}
          {text && <span>{text}</span>}
          {icon && iconPosition === "after" && (
            <span className={`${text ? "ml-2" : ""} ${iconSize}`}>{icon}</span>
          )}
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
  cursorStyle: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  iconPosition: PropTypes.oneOf(["before", "after"]), // New prop for icon position
};

export default CommonButton;
