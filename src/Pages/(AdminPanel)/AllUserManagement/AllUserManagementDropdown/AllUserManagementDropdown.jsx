import { useEffect, useRef, useState } from "react";
/* eslint-disable react/prop-types */

// Import Packages
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// import Icons
import {
  FaBan,
  FaClipboardList,
  FaExclamationTriangle,
  FaUnlock,
  FaUserSlash,
} from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Modals
import AllUserManagementBan from "../AllUserManagementBan/AllUserManagementBan";
import AllUserManagementDetails from "../AllUserManagementDetails/AllUserManagementDetails";
import AllUserManagementBanDetails from "../AllUserManagementBanDetails/AllUserManagementBanDetails";

const AllUserManagementDropdown = ({ user, Refetch }) => {
  const axiosPublic = useAxiosPublic();

  // State to manage open dropdown
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // State to store the selected trainer object for modal usage
  const [selectedUser, setSelectedUser] = useState(null);

  // Ref to detect clicks outside the dropdown
  const dropdownRef = useRef(null);

  // Handles actions (view details, kick, ban) on a user
  const handleUserAction = (action, user) => {
    // Always close the dropdown after any action
    setOpenDropdownId(null);

    switch (action) {
      case "details":
        // Set the selected user and show their detail modal
        setSelectedUser(user);
        document.getElementById(`User_Details_${user?._id}`).showModal();
        break;

      case "kick":
        Swal.fire({
          title: "Are you sure?",
          text: `You are about to kick ${user.fullName}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, kick user",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              // Call DELETE API
              await axiosPublic.delete(`/Users/${user._id}`);

              // Refetch updated user list
              Refetch();

              Swal.fire(
                "Kicked!",
                `${user.fullName} has been kicked.`,
                "success"
              );
            } catch (error) {
              console.error("Error kicking user:", error);
              Swal.fire("Error!", "Failed to kick user. Try again.", "error");
            }
          }
        });
        break;

      case "ban":
        // Confirmation dialog before banning the user
        Swal.fire({
          title: "Are you sure?",
          text: `You are about to Ban User : ${user.fullName}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, Ban user",
        }).then((result) => {
          if (result.isConfirmed) {
            // Perform ban logic here (e.g., API call)
            if (result.isConfirmed) {
              setSelectedUser(user);
              document.getElementById(`Users_Ban_${user?._id}`).showModal();
            }
          }
        });
        break;

      case "ban_details":
        setSelectedUser(user);
        document.getElementById(`Users_UnBan_Details_${user._id}`).showModal();
        break;

      case "unBan":
        Swal.fire({
          title: "Are you sure?",
          text: `You are about to UnBan ${user.fullName}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#aaa",
          confirmButtonText: "Yes, UnBan user",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              // Example API call to UnBan user
              await axiosPublic.patch(`/Users/UnBan/${user._id}`);

              Refetch();

              Swal.fire(
                "Un Banned!",
                `${user.fullName} has been Un Banned.`,
                "success"
              );
            } catch (error) {
              console.error("Error unbanning user:", error);
              Swal.fire(
                "Error!",
                `Failed to unBan ${user.name}. Please try again.`,
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
        className="border-2 border-black  rounded-full p-2 hover:bg-gray-200 transition cursor-pointer"
        onClick={() =>
          setOpenDropdownId(openDropdownId === user._id ? null : user._id)
        }
      >
        <HiDotsVertical className="text-gray-700" />
      </button>

      {/* Dropdown menu */}
      {openDropdownId === user._id && (
        <ul
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg"
        >
          <li
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleUserAction("details", user)}
          >
            <FaClipboardList className="mr-2" />
            Details
          </li>

          <li
            onClick={() => handleUserAction("kick", user)}
            className="flex items-center px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
          >
            <FaUserSlash className="mr-2" />
            Kick User
          </li>

          {/* Conditional Ban / UnBan */}
          {user.ban ? (
            <>
              <li
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-yellow-600"
                onClick={() => handleUserAction("ban_details", user)}
              >
                <FaExclamationTriangle className="mr-2" />
                Ban Details
              </li>
              <li
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-green-600"
                onClick={() => handleUserAction("unBan", user)}
              >
                <FaUnlock className="mr-2" />
                UnBan User
              </li>
            </>
          ) : (
            <li
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
              onClick={() => handleUserAction("ban", user)}
            >
              <FaBan className="mr-2" />
              Ban User
            </li>
          )}
        </ul>
      )}

      {/* Modal : User Details */}
      <dialog id={`User_Details_${user?._id}`} className="modal">
        <AllUserManagementDetails user={selectedUser} />
      </dialog>

      {/* Modal : User Ban */}
      <dialog id={`Users_Ban_${user?._id}`} className="modal">
        <AllUserManagementBan user={selectedUser} Refetch={Refetch} />
      </dialog>

      {/* Modal : User Ban Details */}
      <dialog id={`Users_UnBan_Details_${user?._id}`} className="modal">
        <AllUserManagementBanDetails user={selectedUser} Refetch={Refetch} />
      </dialog>
    </div>
  );
};

// Prop Validation
AllUserManagementDropdown.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    ban: PropTypes.shape({
      End: PropTypes.string, // or Date if it's a Date object already
    }),
  }).isRequired,
  Refetch: PropTypes.func.isRequired,
};

export default AllUserManagementDropdown;
