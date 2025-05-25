import { useState, useEffect } from "react";

// Import Icons
import { FaSearch } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

// Import Packages
import PropTypes from "prop-types";

// Import Gender Icons
import { getGenderIcon } from "../../../Utility/getGenderIcon";

// Import Phone Format Helper
import { formatPhone } from "../AllTrainersManagement/AllTrainersManagement";

// Import Dropdown Component
import AllUserManagementDropdown from "./AllUserManagementDropdown/AllUserManagementDropdown";

const AllUserManagement = ({ AllUsersData, Refetch }) => {
  // State: Search input for filtering by name
  const [searchTerm, setSearchTerm] = useState("");

  // State: Filter by selected membership tier
  const [selectedTier, setSelectedTier] = useState("All");

  // State: Filter by selected gender
  const [selectedGender, setSelectedGender] = useState("All");

  // State: Current pagination page
  const [currentPage, setCurrentPage] = useState(1);

  // How many users to show per page
  const usersPerPage = 10;

  // Gender dropdown options
  const genderOptions = ["All", "Male", "Female", "Other"];

  // Extract unique membership tiers from member users
  const uniqueTiers = [
    "All",
    ...new Set(
      AllUsersData.filter((u) => u.role === "Member").map((u) => u.tier)
    ),
  ];

  // Apply all filters: role = Member, name search, tier, gender
  const filteredUsers = AllUsersData.filter((user) => user.role === "Member")
    .filter((user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) =>
      selectedTier === "All" ? true : user.tier === selectedTier
    )
    .filter((user) => {
      if (selectedGender === "All") return true;
      const normalizedUserGender = user.gender?.toLowerCase() || "";
      return normalizedUserGender.startsWith(selectedGender.toLowerCase());
    });

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGender, selectedTier]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  console.log("AllUsersData :", AllUsersData[0]);

  return (
    <div className="text-black">
      {/* ===== Filter Section ===== */}
      <div className="bg-gray-200 px-4 py-6 flex flex-col items-center space-y-1">
        <label className="text-gray-700 font-medium text-lg">All Users</label>

        {/* Filter Controls: Tier | Gender | Name Search */}
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-6xl">
          {/* Tier Dropdown */}
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

          {/* Gender Dropdown */}
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

          {/* Name Search Field */}
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

      {/* ===== Users Table ===== */}
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
              <th>Date of Birth</th>
              <th>Tier Duration</th>
              <th>Gender</th>
              <th>Tier</th>
              <th>Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-4">
                  No users found.
                </td>
              </tr>
            ) : (
              currentUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className={`hover:bg-gray-100 items-center ${
                    user.ban
                      ? "bg-red-100 hover:bg-red-200"
                      : !user.tier
                      ? "bg-red-100 hover:bg-red-200"
                      : ""
                  }`}
                >
                  <td>{index + 1}</td>

                  {/* Profile Image */}
                  <td>
                    <img
                      src={user.profileImage}
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>

                  {/* Full Name with Search Highlight */}
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
                  <td>
                    <a
                      href={`mailto:${user.email}`}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {user.email}
                    </a>
                  </td>

                  {/* Phone */}
                  <td>{formatPhone(user.phone)}</td>

                  {/* Date of Birth */}
                  <td>
                    {(() => {
                      const date = new Date(user.dob);
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = date.toLocaleString("default", {
                        month: "long",
                      });
                      const year = date.getFullYear();
                      return `${day} - ${month} - ${year}`;
                    })()}
                  </td>

                  {/* Tier Duration */}
                  <td>
                    {user.ban
                      ? (() => {
                          const now = new Date();
                          const end = new Date(user.ban.End);

                          if (end <= now) {
                            return (
                              <span className="text-green-600 font-semibold">
                                Ban expired
                              </span>
                            );
                          }

                          // Calculate difference in milliseconds
                          const diffMs = end - now;

                          // Calculate difference in years, months, days
                          // eslint-disable-next-line no-unused-vars
                          const diffDate = new Date(diffMs);

                          // Rough calculation (not perfectly accurate for months, but good enough)
                          const years = Math.floor(
                            diffMs / (1000 * 60 * 60 * 24 * 365)
                          );
                          const months = Math.floor(
                            (diffMs % (1000 * 60 * 60 * 24 * 365)) /
                              (1000 * 60 * 60 * 24 * 30)
                          );
                          const days = Math.floor(
                            (diffMs % (1000 * 60 * 60 * 24 * 30)) /
                              (1000 * 60 * 60 * 24)
                          );

                          // Format string parts
                          let timeLeftStr = "";
                          if (years > 0)
                            timeLeftStr += `${years} year${
                              years > 1 ? "s" : ""
                            } `;
                          if (months > 0)
                            timeLeftStr += `${months} month${
                              months > 1 ? "s" : ""
                            } `;
                          if (days > 0)
                            timeLeftStr += `${days} day${days > 1 ? "s" : ""}`;

                          return (
                            <span className="text-red-600 font-semibold">
                              Un Ban in {timeLeftStr.trim() || "less than a day"}
                            </span>
                          );
                        })()
                      : user?.tierDuration?.duration || (
                          <p className="text-green-500 font-bold">Unlimited</p>
                        )}
                  </td>

                  {/* Gender with Icon */}
                  <td className="flex items-center justify-center gap-1 py-2">
                    {(() => {
                      const { icon, label } = getGenderIcon(user.gender);
                      return (
                        <div className="flex flex-col items-center text-center">
                          <span className="w-6 h-6 flex items-center justify-center">
                            {icon}
                          </span>
                          <p className="text-sm">{label}</p>
                        </div>
                      );
                    })()}
                  </td>

                  {/* Tier Badge */}
                  <td>
                    {user.ban ? (
                      <span className="text-red-600 font-bold">Banned</span>
                    ) : user.tier ? (
                      user.tier
                    ) : (
                      <span className="text-red-600 font-semibold">New</span>
                    )}
                  </td>

                  {/* Action Dropdown */}
                  <td>
                    <AllUserManagementDropdown user={user} Refetch={Refetch} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Pagination Controls ===== */}
      <div className="mt-6 flex justify-center items-center gap-4">
        <div className="join">
          {/* Previous Page */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
              currentPage === 1
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-blue-100 text-blue-600"
            }`}
          >
            <FaAnglesLeft />
          </button>

          {/* Current Page Info */}
          <span className="join-item h-10 px-5 text-sm flex items-center justify-center border border-gray-300 bg-white text-gray-800 font-semibold">
            Page {currentPage} / {totalPages}
          </span>

          {/* Next Page */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
              currentPage === totalPages
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-blue-100 text-blue-600"
            }`}
          >
            <FaAnglesRight />
          </button>
        </div>
      </div>
    </div>
  );
};

// Prop Types for validation
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
  Refetch: PropTypes.func.isRequired,
};

export default AllUserManagement;
