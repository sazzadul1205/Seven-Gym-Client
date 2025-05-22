import { useState, useEffect, useRef } from "react";

// Import Icons
import { HiDotsVertical } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";

// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Import Components
import AllUserManagementDetails from "./AllUserManagementDetails/AllUserManagementDetails";

// Import Gender Icons
import { getGenderIcon } from "../../../Utility/getGenderIcon";

const AllUserManagement = ({ AllUsersData }) => {
  // State for storing the search input
  const [searchTerm, setSearchTerm] = useState("");

  // State to keep track of the currently selected user (for showing details)
  const [selectedUser, setSelectedUser] = useState(null);

  // State to store the currently selected membership tier for filtering
  const [selectedTier, setSelectedTier] = useState("All");

  // State to store the currently selected gender for filtering
  const [selectedGender, setSelectedGender] = useState("All");

  // State to keep track of which user's dropdown is currently open
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Reference to detect outside clicks for dropdown
  const dropdownRef = useRef(null);

  // useEffect to close dropdown when clicking outside of it
  useEffect(() => {
    // Handler function to detect clicks outside the dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null); // Close any open dropdown
      }
    };

    // Add event listener for mouse click
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter the users to only show Members
  const filteredUsers = AllUsersData.filter((user) => user.role === "Member")
    // Further filter users based on the search term (case-insensitive match on full name)
    .filter((user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // Filter by selected tier if it's not "All"
    .filter((user) =>
      selectedTier === "All" ? true : user.tier === selectedTier
    )
    // Filter by selected gender if it's not "All"
    .filter((user) => {
      if (selectedGender === "All") return true;

      // Normalize gender strings to avoid case sensitivity issues
      const normalizedUserGender = user.gender?.toLowerCase() || "";
      const normalizedSelectedGender = selectedGender.toLowerCase();

      // Match if gender starts with the selected gender
      return normalizedUserGender.startsWith(normalizedSelectedGender);
    });

  // Create a list of unique membership tiers for filtering dropdown
  const uniqueTiers = [
    "All", // Default option to show all tiers
    ...new Set(
      AllUsersData.filter((u) => u.role === "Member") // Only consider members
        .map((u) => u.tier) // Extract the tier
    ),
  ];

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
            Swal.fire(
              "Banned!",
              `${user.fullName} has been banned.`,
              "success"
            );
          }
        });
        break;

      default:
        break;
    }
  };

  // Gender options for filtering dropdown
  const genderOptions = ["All", "Male", "Female"];

  return (
    <div>
      {/* Search Filters Section */}
      <div className="bg-gray-200 px-4 py-6 flex flex-col items-center space-y-1">
        <label className="text-gray-700 font-medium text-lg">All Users</label>

        {/* Filters Row: Tier Dropdown, Search Input, Gender Dropdown */}
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-6xl">
          {/* Tier Filter */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Tier</label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="min-w-[180px] bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              {uniqueTiers.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Gender</label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="min-w-[180px] bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              {genderOptions.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>

          {/* Name Search */}
          <div className="flex flex-col flex-1 min-w-[250px]">
            <label className="text-sm text-gray-600 mb-1">Search By Name</label>
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Enter name..."
                className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table Section */}
      <div className="text-black">
        <table className="table w-full border border-gray-300">
          {/* Table Header */}
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th>#</th>
              <th>Profile</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Tier</th>
              <th>Action</th>
            </tr>
          </thead>

          {/* Table Body with Filtered Users */}
          <tbody>
            {filteredUsers?.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50">
                {/* Serial Number */}
                <td>{index + 1}</td>

                {/* User Profile Image */}
                <td>
                  <img
                    src={user.profileImage}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>

                {/* User Full Name with Highlight if Search Term Matches */}
                <td>
                  {searchTerm
                    ? (() => {
                        const regex = new RegExp(`(${searchTerm})`, "i");
                        const parts = user.fullName.split(regex);
                        return parts.map((part, idx) =>
                          regex.test(part) ? (
                            <span key={idx} className="bg-yellow-300">
                              {part}
                            </span>
                          ) : (
                            <span key={idx}>{part}</span>
                          )
                        );
                      })()
                    : user.fullName}
                </td>

                {/* Email */}
                <td>{user.email}</td>

                {/* Phone Number */}
                <td>
                  {user.phone?.startsWith("+") ? user.phone : `+${user.phone}`}
                </td>

                {/* Gender with Icon */}
                <td className="flex items-center gap-1">
                  {(() => {
                    const { icon, label } = getGenderIcon(user.gender);
                    return (
                      <>
                        {icon}
                        <span className="text-sm">{label}</span>
                      </>
                    );
                  })()}
                </td>

                {/* User Tier */}
                <td>{user.tier}</td>

                {/* Action Dropdown */}
                <td className="relative">
                  {/* 3-dot Dropdown Trigger */}
                  <button
                    className="border border-gray-400 rounded-full p-2 hover:bg-gray-300 transition cursor-pointer"
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === user._id ? null : user._id
                      )
                    }
                  >
                    <HiDotsVertical className="text-gray-700" />
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdownId === user._id && (
                    <div
                      ref={dropdownRef}
                      onMouseLeave={() => setOpenDropdownId(null)}
                      className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                    >
                      <ul className="py-1 text-sm text-gray-700">
                        {/* Show Details Action */}
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleUserAction("details", user)}
                        >
                          Details
                        </li>

                        {/* Kick User Action */}
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleUserAction("kick", user)}
                        >
                          Kick User
                        </li>

                        {/* Ban User Action */}
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleUserAction("ban", user)}
                        >
                          Ban User
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Fallback Message If No Users */}
        {filteredUsers?.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No users found.</p>
        )}
      </div>

      {/* Modal Popup */}
      <dialog id="User_Details" className="modal">
        <AllUserManagementDetails user={selectedUser} />
      </dialog>
    </div>
  );
};

// Prop Validation
AllUserManagement.propTypes = {
  AllUsersData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
      gender: PropTypes.string,
      tier: PropTypes.string,
      role: PropTypes.string.isRequired,
      profileImage: PropTypes.string,
    })
  ),
};

export default AllUserManagement;
