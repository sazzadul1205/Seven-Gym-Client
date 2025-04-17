// Importing PropTypes for type-checking
import PropTypes from "prop-types";

// Importing Info icon from react-icons
import { FaInfo } from "react-icons/fa";

// Importing Tooltip from react-tooltip
import { Tooltip } from "react-tooltip";

/**
 * Reusable ViewDetailsButton component
 * - Renders an info icon button with tooltip
 * - Handles click logic through props
 */
const ViewDetailsButton = ({ id, onClick, tooltip = "View Details" }) => {
  return (
    <>
      {/* Info Button */}
      <button
        id={id} // Unique ID for tooltip anchor
        className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
        onClick={onClick} // Handler passed from parent
      >
        <FaInfo className="text-yellow-500" /> {/* Info Icon */}
      </button>

      {/* Tooltip for the button */}
      <Tooltip anchorSelect={`#${id}`} content={tooltip} />
    </>
  );
};

// Prop type definitions for better DX and validation
ViewDetailsButton.propTypes = {
  id: PropTypes.string.isRequired, // Unique element ID for tooltip targeting
  onClick: PropTypes.func.isRequired, // Click handler function
  tooltip: PropTypes.string, // Tooltip text (optional)
};

// Exporting the reusable button component
export default ViewDetailsButton;
