/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { HiDotsVertical } from "react-icons/hi";
import AllUserManagementDetails from "../AllUserManagementDetails/AllUserManagementDetails";
import {
  FaBan,
  FaClipboardList,
  FaExclamationTriangle,
  FaUnlock,
  FaUserSlash,
} from "react-icons/fa";
import Swal from "sweetalert2";
import AllUserManagementBan from "../AllUserManagementBan/AllUserManagementBan";

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
        document.getElementById("User_Details").showModal();
        break;

      case "kick":
        // Confirmation dialog before kicking the user
        Swal.fire({
          title: "Are you sure?",
          text: `You are about to kick ${user.fullName}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, kick user",
        }).then((result) => {
          if (result.isConfirmed) {
            // Perform kick logic here (e.g., API call)
            Swal.fire(
              "Kicked!",
              `${user.fullName} has been kicked.`,
              "success"
            );
          }
        });
        break;

      case "ban":
        // Confirmation dialog before banning the user
        Swal.fire({
          title: "Are you sure?",
          text: `You are about to ban ${user.fullName}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, ban user",
        }).then((result) => {
          if (result.isConfirmed) {
            // Perform ban logic here (e.g., API call)
            if (result.isConfirmed) {
              setSelectedUser(user);
              document.getElementById("Users_Ban").showModal();
            }
          }
        });
        break;

      default:
        break;
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        className="border border-gray-400 rounded-full p-2 hover:bg-gray-300 transition cursor-pointer"
        onClick={() =>
          setOpenDropdownId(openDropdownId === user._id ? null : user._id)
        }
      >
        <HiDotsVertical className="text-gray-700" />
      </button>

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

      {/* Modal Popup */}
      <dialog id="User_Details" className="modal">
        <AllUserManagementDetails user={selectedUser} />
      </dialog>

      {/* Modal Popup */}
      <dialog id="Users_Ban" className="modal">
        <AllUserManagementBan user={selectedUser} Refetch={Refetch} />
      </dialog>
    </div>
  );
};

export default AllUserManagementDropdown;
