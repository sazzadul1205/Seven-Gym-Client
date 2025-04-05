import { useState } from "react";

// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Background
import UserTrainerManagementBackground from "../../../assets/User-Trainer-Management-Background/UserTrainerManagementBackground.jpg";

// Import Tab Content
import UserTrainerActiveSession from "./UserTrainerActiveSession/UserTrainerActiveSession";
import UserTrainerBookingSession from "./UserTrainerBookingSession/UserTrainerBookingSession";
import UserTrainerSessionHistory from "./UserTrainerSessionHistory/UserTrainerSessionHistory";

const icons = [
  {
    src: "https://i.ibb.co/gF6qkSKF/Active-Trainer.png",
    alt: "Active Sessions",
    id: "tooltip-active",
    label: "Active Session's", // Tooltip text
  },
  {
    src: "https://i.ibb.co/LdVXnyDK/Trainer-Booking.png",
    alt: "Booking Request",
    id: "tooltip-booking",
    label: "Booking Session's", // Tooltip text
  },
  {
    src: "https://i.ibb.co/SXM5XxWG/Trainer-History.png",
    alt: "History",
    id: "tooltip-history",
    label: "Session's History", // Tooltip text
  },
];

const UserTrainerManagement = () => {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("tooltip-active");

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${UserTrainerManagementBackground})` }}
    >
      <div className="bg-gradient-to-b from-gray-500/50 to-gray-800/50 min-h-screen">
        <div className="mx-auto max-w-7xl flex">
          {/* Sidebar with icons */}
          <div className="flex flex-col items-center space-y-2 pt-2 bg-white/40">
            {icons.map(({ src, alt, id, label }) => (
              <TooltipIcon
                key={id}
                src={src}
                alt={alt}
                id={id}
                label={label}
                onClick={() => setActiveTab(id)} // Set active tab on click
                isActive={activeTab === id} // Highlight active tab
              />
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 text-black bg-[#f6eee3] border-[10px] border-[#A1662F] min-h-screen p-8">
            {activeTab === "tooltip-active" && <UserTrainerActiveSession />}
            {activeTab === "tooltip-booking" && <UserTrainerBookingSession />}
            {activeTab === "tooltip-history" && <UserTrainerSessionHistory />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTrainerManagement;

const TooltipIcon = ({ src, alt, id, label, onClick, isActive }) => (
  <>
    <div
      key={id}
      data-tooltip-id={id}
      onClick={onClick}
      className={`${
        isActive ? "bg-[#c4a07f]" : "bg-[#A1662F]"
      } hover:bg-[#c4a07f] text-black w-16 h-16 flex items-center justify-center shadow-md hover:scale-105 transition-transform border-r border-amber-100 cursor-pointer`}
    >
      <img src={src} alt={alt} className="w-6 h-6" />
    </div>
    <Tooltip
      id={id}
      place="right"
      effect="solid"
      style={{ backgroundColor: "#c4a07f" }}
    >
      <p className="bg-[#c4a07f] text-black py-1 px-0 font-semibold">{label}</p>
    </Tooltip>
  </>
);

TooltipIcon.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};
