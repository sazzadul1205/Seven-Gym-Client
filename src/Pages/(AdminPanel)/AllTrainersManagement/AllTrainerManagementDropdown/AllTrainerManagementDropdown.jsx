import { useEffect, useState, useRef } from "react";

// Import Packages
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Import Icons
import {
  FaBan,
  FaClipboardList,
  FaUserShield,
  FaUserSlash,
  FaExclamationTriangle,
  FaUnlock,
} from "react-icons/fa";

import { HiDotsVertical } from "react-icons/hi";

// import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Modals
import AllTrainerManagementBanDetails from "../AllTrainerManagementBanDetails/AllTrainerManagementBanDetails";
import AllTrainerManagementDetails from "../AllTrainerManagementDetails/AllTrainerManagementDetails";
import AllTrainerManagementTier from "../AllTrainerManagementTier/AllTrainerManagementTier";
import AllTrainerManagementBan from "../AllTrainerManagementBan/AllTrainerManagementBan";

const AllTrainerManagementDropdown = ({ trainer, Refetch }) => {
  const axiosPublic = useAxiosPublic();

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
        document.getElementById(`Trainer_Details_${trainer._id}`).showModal(); // Open details modal
        break;

      case "tier_management":
        setSelectedTrainer(trainer);
        document
          .getElementById(`Trainer_Tier_Management_${trainer._id}`)
          .showModal(); // Open tier management modal
        break;

      case "kick":
        Swal.fire({
          title: "Are you sure?",
          text: `You are about to kick ${trainer.name}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, kick trainer",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              // 1. Delete Trainer by ID
              await axiosPublic.delete(`/Trainers/${trainer._id}`);

              // 2. Update User role to "Member"
              // Assuming you update by email, adjust if you want to update by id
              await axiosPublic.patch("/Users/UpdateRole", {
                email: trainer?._id,
                role: "Member",
              });

              Refetch();

              Swal.fire(
                "Kicked!",
                `${trainer.name} has been kicked and downgraded to Member.`,
                "success"
              );
            } catch (error) {
              console.error("Error kicking trainer:", error);
              Swal.fire(
                "Error!",
                `Failed to kick ${trainer.name}. Please try again.`,
                "error"
              );
            }
          }
        });

        break;

      case "ban":
        Swal.fire({
          title: "Are you sure?",
          text: `You are about to ban ${trainer?.name || "this trainer"}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, ban trainer",
        }).then((result) => {
          if (result.isConfirmed) {
            setSelectedTrainer(trainer);
            document.getElementById(`Trainer_Ban_${trainer._id}`).showModal();
          }
        });
        break;

      case "ban_details":
        setSelectedTrainer(trainer);
        document
          .getElementById(`Trainer_UnBan_Details_${trainer._id}`)
          .showModal();
        break;

      case "unBan":
        Swal.fire({
          title: "Are you sure?",
          text: `You are about to UnBan ${trainer.name}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#aaa",
          confirmButtonText: "Yes, UnBan trainer",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              // Example API call to UnBan trainer
              await axiosPublic.patch(`/Trainers/UnBan/${trainer._id}`);

              Refetch();

              Swal.fire(
                "Unbanned!",
                `${trainer.name} has been unbanned.`,
                "success"
              );
            } catch (error) {
              console.error("Error unbanning trainer:", error);
              Swal.fire(
                "Error!",
                `Failed to unBan ${trainer.name}. Please try again.`,
                "error"
              );
            }
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
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg"
        >
          <li
            onClick={() => handleUserAction("details", trainer)}
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            <FaClipboardList className="mr-2" />
            View Details
          </li>
          <li
            onClick={() => handleUserAction("tier_management", trainer)}
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            <FaUserShield className="mr-2" />
            Tier Management
          </li>
          <li
            onClick={() => handleUserAction("kick", trainer)}
            className="flex items-center px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
          >
            <FaUserSlash className="mr-2" />
            Kick Trainer
          </li>

          {/* Conditional Ban Options */}
          {trainer.ban ? (
            <>
              <li
                onClick={() => handleUserAction("ban_details", trainer)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-yellow-600"
              >
                <FaExclamationTriangle className="mr-2" />
                Ban Details
              </li>
              <li
                onClick={() => handleUserAction("unBan", trainer)}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-green-600"
              >
                <FaUnlock className="mr-2" />
                UnBan Trainer
              </li>
            </>
          ) : (
            <li
              onClick={() => handleUserAction("ban", trainer)}
              className="flex items-center px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
            >
              <FaBan className="mr-2" />
              Ban Trainer
            </li>
          )}
        </ul>
      )}

      {/* Modals for details and tier management */}
      <dialog id={`Trainer_Details_${trainer._id}`} className="modal">
        <AllTrainerManagementDetails
          trainer={selectedTrainer}
          Refetch={Refetch}
        />
      </dialog>

      <dialog id={`Trainer_Tier_Management_${trainer._id}`} className="modal">
        <AllTrainerManagementTier trainer={selectedTrainer} Refetch={Refetch} />
      </dialog>

      <dialog id={`Trainer_Ban_${trainer._id}`} className="modal">
        <AllTrainerManagementBan trainer={selectedTrainer} Refetch={Refetch} />
      </dialog>

      <dialog id={`Trainer_UnBan_Details_${trainer._id}`} className="modal">
        <AllTrainerManagementBanDetails
          trainer={selectedTrainer}
          Refetch={Refetch}
        />
      </dialog>
    </div>
  );
};

// Prop validation
AllTrainerManagementDropdown.propTypes = {
  trainer: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    ban: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        reason: PropTypes.string,
        date: PropTypes.string,
        active: PropTypes.bool, // optional if you use it
      }),
    ]),
    email: PropTypes.string,
  }),
  Refetch: PropTypes.func.isRequired,
};

export default AllTrainerManagementDropdown;
