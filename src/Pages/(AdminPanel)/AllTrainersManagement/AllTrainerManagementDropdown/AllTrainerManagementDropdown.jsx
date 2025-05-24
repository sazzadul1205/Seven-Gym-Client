import { useEffect, useState, useRef } from "react";

// Import Packages
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Import Icons
import { HiDotsVertical } from "react-icons/hi";

// Import Modals
import AllTrainerTierManagement from "../AllTrainerTierManagement/AllTrainerTierManagement";
import AllTrainerManagementDetails from "../AllTrainerManagementDetails/AllTrainerManagementDetails";

const AllTrainerManagementDropdown = ({ trainer, Refetch }) => {
  // State to manage open dropdown
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // State to store the selected trainer object for modal usage
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  // Ref to detect clicks outside the dropdown
  const dropdownRef = useRef(null);

  // Handles actions triggered from the dropdown menu
  const handleUserAction = (action, trainer) => {
    setOpenDropdownId(null); // Close dropdown after action

    switch (action) {
      case "details":
        setSelectedTrainer(trainer);
        document.getElementById("Trainer_Details").showModal(); // Open details modal
        break;

      case "tier_management":
        setSelectedTrainer(trainer);
        document.getElementById("Trainer_Tier_Management").showModal(); // Open tier management modal
        break;

      case "kick":
        Swal.fire({
          title: "Are you sure?",
          text: `You are about to kick ${trainer.fullName}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, kick trainer",
        }).then((result) => {
          if (result.isConfirmed) {
            // TODO: Add actual API call for kicking trainer here
            Swal.fire(
              "Kicked!",
              `${trainer.fullName} has been kicked.`,
              "success"
            );
          }
        });
        break;

      case "ban":
        Swal.fire({
          title: "Are you sure?",
          text: `You are about to ban ${trainer.fullName}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, ban trainer",
        }).then((result) => {
          if (result.isConfirmed) {
            // TODO: Add actual API call for banning trainer here
            Swal.fire(
              "Banned!",
              `${trainer.fullName} has been banned.`,
              "success"
            );
          }
        });
        break;

      default:
        break;
    }
  };

  // Close dropdown when clicking outside or on scroll
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null); // Close dropdown
      }
    };
    const handleScroll = () => setOpenDropdownId(null); // Close dropdown on scroll

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Dropdown toggle button */}
      <button
        onClick={() =>
          setOpenDropdownId(openDropdownId === trainer._id ? null : trainer._id)
        }
        className="p-1 border border-gray-300 rounded-full hover:bg-gray-200 focus:outline-none cursor-pointer"
      >
        <HiDotsVertical size={20} />
      </button>

      {/* Dropdown menu */}
      {openDropdownId === trainer._id && (
        <ul
          onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing when clicking inside
          className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg"
        >
          <li
            onClick={() => handleUserAction("details", trainer)}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            View Details
          </li>
          <li
            onClick={() => handleUserAction("tier_management", trainer)}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Tier Management
          </li>
          <li
            onClick={() => handleUserAction("kick", trainer)}
            className="px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
          >
            Kick Trainer
          </li>
          <li
            onClick={() => handleUserAction("ban", trainer)}
            className="px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
          >
            Ban Trainer
          </li>
        </ul>
      )}

      {/* Modals for details and tier management */}
      <dialog id="Trainer_Details" className="modal">
        <AllTrainerManagementDetails
          trainer={selectedTrainer}
          Refetch={Refetch}
        />
      </dialog>

      <dialog id="Trainer_Tier_Management" className="modal">
        <AllTrainerTierManagement trainer={selectedTrainer} Refetch={Refetch} />
      </dialog>
    </div>
  );
};

// Prop validation
AllTrainerManagementDropdown.propTypes = {
  trainer: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
  }).isRequired,
  Refetch: PropTypes.func.isRequired,
};

export default AllTrainerManagementDropdown;
