import { useState, useEffect } from "react";

// Import Icons
import { FaSearch } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

// Import Packages
import PropTypes from "prop-types";

// Import Gender Icons
import { getGenderIcon } from "../../../Utility/getGenderIcon";

// Import Phone Format Helper
import { getBanDurationStatus } from "../../../Utility/getBanDurationStatus";

// Import Dropdown Component
import AllUserManagementDropdown from "./AllUserManagementDropdown/AllUserManagementDropdown";
import { formatPhone } from "../../../Utility/formatPhone";

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
  const itemsPerPage = 10;

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

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Get current page's data
  const currentData = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGender, selectedTier]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="text-black">
      {/* Page Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          All Users
        </h3>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap justify-center gap-4 w-full p-4 bg-gray-400 border border-t-white">
        {/* Search by User Name */}
        <div className="flex flex-col flex-1 max-w-[400px]">
          <label className="text-sm font-semibold text-white mb-1">
            Search By User Name
          </label>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm">
            <FaSearch className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Enter name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none text-gray-700 bg-transparent"
            />
          </div>
        </div>

        {/* Tier Dropdown */}
        <div className="flex flex-col flex-1 max-w-[200px]">
          <label className="text-sm font-semibold text-white mb-1">
            Filter By Tier
          </label>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-full bg-white text-gray-700 outline-none shadow-sm"
          >
            {uniqueTiers.map((tier) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Dropdown */}
        <div className="flex flex-col flex-1 max-w-[200px]">
          <label className="text-sm font-semibold text-white mb-1">
            Filter By Gender
          </label>
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-full bg-white text-gray-700 outline-none shadow-sm"
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
      {currentData.length > 0 ? (
        <div className="overflow-x-auto">
          {/* Data Table */}
          <table className="min-w-full table-auto border border-gray-300 text-sm mb-20">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Profile</th>
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Date of Birth</th>
                <th className="px-4 py-2">Tier Duration</th>
                <th className="px-4 py-2">Gender</th>
                <th className="px-4 py-2">Tier</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {currentData.map((user, index) => (
                <tr
                  key={user._id}
                  className={`hover:bg-gray-100/50 items-center ${
                    user.ban
                      ? "bg-red-200 hover:bg-red-200/90"
                      : !user.tier
                      ? "bg-red-200 hover:bg-red-200/90"
                      : ""
                  }`}
                >
                  {/* Serial Number */}
                  <td className="border px-4 py-2">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>

                  {/* Profile Image */}
                  <td className="border px-4 py-2">
                    <img
                      src={user.profileImage}
                      alt={user.fullName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </td>

                  {/* Full Name with Search Highlight */}
                  <td className="border px-4 py-2">
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
                  <td className="border px-4 py-2">
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
                  <td className="border px-4 py-2">
                    {formatPhone(user.phone)}
                  </td>

                  {/* Date of Birth */}
                  <td className="border px-4 py-2">
                    {(() => {
                      const date = new Date(user.dob);
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = date.toLocaleString("default", {
                        month: "long",
                      });
                      const year = date.getFullYear();
                      return `${month} ${day} ${year}`;
                    })()}
                  </td>

                  {/* Tier Duration */}
                  <td className="border px-4 py-2">
                    {user.ban
                      ? getBanDurationStatus(user.ban)
                      : user?.tierDuration?.duration || (
                          <p className="text-green-500 font-bold">Unlimited</p>
                        )}
                  </td>

                  {/* Gender with Icon */}
                  <td className="border px-4 py-2">
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
                  <td className="border px-4 py-2">
                    {user.ban ? (
                      <span className="text-red-600 font-bold">Banned</span>
                    ) : user.tier ? (
                      user.tier
                    ) : (
                      <span className="text-red-600 font-semibold">New</span>
                    )}
                  </td>

                  {/* Action Dropdown */}
                  <td className="border px-4 py-2">
                    <AllUserManagementDropdown user={user} Refetch={Refetch} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
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
      ) : (
        <div className="bg-gray-200 p-4">
          <p className="text-center font-semibold text-black">
            No User available.
          </p>
        </div>
      )}
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
