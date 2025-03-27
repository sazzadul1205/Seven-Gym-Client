import PropTypes from "prop-types";

const CommonButton = ({
  clickEvent,
  textColor = "text-white",
  bgColor = "blue", // Single color input
  bgFromColor, // Optional (if user wants to override)
  bgToColor, // Optional (if user wants to override)
  text = "Click Me",
}) => {
  // Automatically generate `from` and `to` colors if only `bgColor` is provided
  const fromColor = bgFromColor || `${bgColor}-300`;
  const toColor = bgToColor || `${bgColor}-600`;

  return (
    <button
      className={`font-semibold px-5 py-3 rounded-lg cursor-pointer transition-all duration-300 
        ${textColor} 
        bg-gradient-to-bl from-${fromColor} to-${toColor} 
        hover:bg-gradient-to-tr`}
      onClick={clickEvent}
    >
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
};

export default CommonButton;
