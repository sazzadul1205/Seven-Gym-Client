import PropTypes from "prop-types";

// Import Tool Tip
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const ToolbarButton = ({ onClick, isActive, title, icon: Icon }) => {
  const buttonBase = "p-2 rounded hover:bg-gray-100 cursor-pointer";
  const activeButton = "bg-gray-200";

  const tooltipId = `tooltip-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={`${buttonBase} ${isActive ? activeButton : ""}`}
        data-tooltip-id={tooltipId}
        data-tooltip-content={title}
      >
        <Icon size={18} />
      </button>
      <Tooltip id={tooltipId} place="top" effect="solid" />
    </>
  );
};

ToolbarButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};

export default ToolbarButton;
