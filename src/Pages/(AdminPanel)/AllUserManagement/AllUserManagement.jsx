import { useState, useEffect, useRef } from "react";

import { FaSearch } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import AllUserManagementDetails from "./AllUserManagementDetails/AllUserManagementDetails";

const AllUserManagement = ({ AllUsersData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTier, setSelectedTier] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredUsers = AllUsersData.filter((user) => user.role === "Member")
    .filter((user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) =>
      selectedTier === "All" ? true : user.tier === selectedTier
    )
    .filter((user) =>
      selectedGender === "All" ? true : user.gender === selectedGender
    );

  const uniqueTiers = [
    "All",
    ...new Set(
      AllUsersData.filter((u) => u.role === "Member").map((u) => u.tier)
    ),
  ];

  const handleUserAction = (action, user) => {
    setOpenDropdownId(null); // close dropdown after action

    switch (action) {
      case "details":
        setSelectedUser(user); // Save the selected user
        document.getElementById("User_Details").showModal();
        break;

      case "kick":
        console.log("Kicking user", user);
        break;
      case "ban":
        console.log("Banning user", user);
        break;
      default:
        break;
    }
  };

  const genderOptions = ["All", "Male", "Female"];

  return (
    <div>
      {/* Search and Filters */}
      <div className="bg-gray-200 px-4 py-6 flex flex-col items-center space-y-4">
        <label className="text-gray-700 font-medium text-lg">
          Search by User Name
        </label>

        {/* Filters Row */}
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-6xl">
          {/* Tier Dropdown */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="flex-1 min-w-[180px] bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            {uniqueTiers.map((tier) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div className="flex items-center gap-2 flex-1 min-w-[250px] bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Gender Dropdown */}
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="flex-1 min-w-[180px] bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            {genderOptions.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
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

          {/* Table Body */}
          <tbody>
            {filteredUsers?.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50">
                {/* User index */}
                <td>{index + 1}</td>
                {/* User Profile Image */}
                <td>
                  <img
                    src={user.profileImage}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                {/* User Full Name */}
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
                {/* User Email */}
                <td>{user.email}</td>

                {/* User Phone */}
                <td>{user.phone}</td>

                {/* User Gender */}
                <td>{user.gender}</td>

                {/* User Tier */}
                <td>{user.tier}</td>

                {/* User Btn */}
                <td className="relative">
                  {/* DropDown Icon  */}
                  <HiDotsVertical
                    className="cursor-pointer"
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === user._id ? null : user._id
                      )
                    }
                  />
                  {/* Drop Down Content */}
                  {openDropdownId === user._id && (
                    <div
                      ref={dropdownRef}
                      onMouseLeave={() => setOpenDropdownId(null)}
                      className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                    >
                      <ul className="py-1 text-sm text-gray-700">
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleUserAction("details", user)}
                        >
                          Details
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleUserAction("kick", user)}
                        >
                          Kick User
                        </li>
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

        {filteredUsers?.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No users found.</p>
        )}
      </div>

      <dialog id="User_Details" className="modal">
        <AllUserManagementDetails user={selectedUser} />
      </dialog>
    </div>
  );
};

export default AllUserManagement;
