import { useState, useEffect } from "react";

// Import Packages
import PropTypes from "prop-types";

// Import Icons
import { FaSearch } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

// Fetch Gender Icons
import { getGenderIcon } from "../../../Utility/getGenderIcon";

// Import Modal
import AllTrainerManagementDropdown from "./AllTrainerManagementDropdown/AllTrainerManagementDropdown";

// eslint-disable-next-line react-refresh/only-export-components
export const formatPhone = (phone) => {
  // Ensure phone starts with '+'
  const normalized = phone.startsWith("+") ? phone : `+${phone}`;

  // Format: +880 19 1733 5945
  const country = normalized.slice(0, 4); // +880
  const operator = normalized.slice(4, 6); // 19
  const part1 = normalized.slice(6, 10); // 1733
  const part2 = normalized.slice(10); // 5945

  return `${country} ${operator} ${part1} ${part2}`;
};

const AllTrainersManagement = ({ AllTrainersData, Refetch }) => {
  // React state for filters

  // Search text
  const [searchTerm, setSearchTerm] = useState("");

  // Tier filter
  const [selectedTier, setSelectedTier] = useState("All");

  // Gender filter
  const [selectedGender, setSelectedGender] = useState("All");

  // Specialization filter
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // How many trainers to show per page
  const trainersPerPage = 10;

  // Static options for gender dropdown
  const genderOptions = ["All", "Male", "Female", "Other"];

  // Dynamically generated unique specializations from data
  const uniqueSpecializations = [
    "All",
    ...Array.from(
      new Set(
        AllTrainersData.map((t) => t.specialization).filter(Boolean) // Remove undefined/null
      )
    ),
  ];

  // Dynamically generated unique tiers from data
  const uniqueTiers = [
    "All",
    ...Array.from(
      new Set(
        AllTrainersData.map((t) => t.tier).filter(Boolean) // Remove undefined/null
      )
    ),
  ];

  // Filter trainers based on current filter criteria
  const filteredUsers = AllTrainersData.filter((trainer) => {
    const matchesSearch = trainer.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesGender =
      selectedGender === "All" ||
      trainer.gender?.toLowerCase() === selectedGender.toLowerCase();

    const matchesSpecialization =
      selectedSpecialization === "All" ||
      trainer.specialization === selectedSpecialization;

    const matchesTier =
      selectedTier === "All" ||
      trainer.tier?.toLowerCase() === selectedTier.toLowerCase();

    return (
      matchesSearch && matchesGender && matchesSpecialization && matchesTier
    );
  });

  // Pagination calculations
  const indexOfLastTrainer = currentPage * trainersPerPage;
  const indexOfFirstTrainer = indexOfLastTrainer - trainersPerPage;

  // Current trainers to display on the current page
  const currentTrainers = filteredUsers.slice(
    indexOfFirstTrainer,
    indexOfLastTrainer
  );

  // Total number of pages
  const totalPages = Math.ceil(filteredUsers.length / trainersPerPage);

  // Reset to page 1 whenever filters or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGender, selectedSpecialization, selectedTier]);

  // Scroll to top smoothly on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="text-black">
      {/* ========== FILTER SECTION ========== */}
      <div className="bg-gray-200 px-4 py-6 flex flex-col items-center space-y-1">
        <label className="text-gray-700 font-medium text-lg">
          All Trainers
        </label>

        {/* Filter Controls (Gender, Specialization, Tier, Search) */}
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-6xl">
          {/* Gender Filter Dropdown */}
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

          {/* Specialization Filter Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Specialization</label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="min-w-[180px] bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              {uniqueSpecializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Tier Filter Dropdown */}
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

          {/* Search Input for Trainer Name */}
          <div className="flex flex-col flex-1 min-w-[250px]">
            <label className="text-sm text-gray-600 mb-1">Search By Name</label>
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========== TRAINERS TABLE ========== */}
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
              <th>Specialization</th>
              <th>Gender</th>
              <th>Tier</th>
              <th>Action</th>
            </tr>
          </thead>

          {/* Table Body with Trainer Data */}
          <tbody>
            {currentTrainers.length === 0 ? (
              // Fallback Row when no trainers match filters
              <tr>
                <td colSpan="9" className="text-center text-gray-500 py-4">
                  No trainers found.
                </td>
              </tr>
            ) : (
              // Map through trainers and render table rows
              currentTrainers.map((trainer, index) => (
                <tr
                  key={trainer._id}
                  className={`hover:bg-gray-100 items-center ${
                    trainer.ban
                      ? "bg-red-100 hover:bg-red-200"
                      : !trainer.tier
                      ? "bg-red-100 hover:bg-red-200"
                      : ""
                  }`}
                >
                  {/* Serial Number */}
                  <td>{indexOfFirstTrainer + index + 1}</td>

                  {/* Trainer Profile Picture */}
                  <td>
                    <img
                      src={trainer.imageUrl}
                      alt={trainer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>

                  {/* Full Name with Search Highlight */}
                  <td>
                    {searchTerm
                      ? (() => {
                          const regex = new RegExp(`(${searchTerm})`, "i");
                          const parts = trainer.name.split(regex);
                          return parts.map((part, i) =>
                            regex.test(part) ? (
                              <span key={i} className="bg-yellow-300">
                                {part}
                              </span>
                            ) : (
                              part
                            )
                          );
                        })()
                      : trainer.name}
                  </td>

                  {/* Email (clickable mail link) */}
                  <td>
                    <a
                      href={`mailto:${trainer.email}`}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {trainer.email}
                    </a>
                  </td>

                  {/* Phone Number (formatted) */}
                  <td>{formatPhone(trainer.contact.phone)}</td>

                  {/* Specialization or Ban Time Left */}
                  <td>
                    {trainer.ban
                      ? (() => {
                          const now = new Date();
                          const end = new Date(trainer.ban.End);

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
                      : trainer.specialization || "N/A"}
                  </td>

                  {/* Gender with Icon and Label */}
                  <td className="flex items-center justify-center gap-1 py-2">
                    {(() => {
                      const { icon, label } = getGenderIcon(trainer.gender);
                      return (
                        <div className="flex flex-col items-center justify-center text-center">
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
                    {trainer.ban ? (
                      <span className="text-red-600 font-bold">Banned</span>
                    ) : trainer.tier ? (
                      trainer.tier
                    ) : (
                      <span className="text-red-600 font-semibold">New</span>
                    )}
                  </td>

                  {/* Action Dropdown */}
                  <td>
                    <AllTrainerManagementDropdown
                      trainer={trainer}
                      Refetch={Refetch}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ========== PAGINATION CONTROLS ========== */}
      <div className="mt-6 flex justify-center items-center gap-4">
        <div className="join">
          {/* Previous Page Button */}
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

          {/* Current Page Indicator */}
          <span className="join-item h-10 px-5 text-sm flex items-center justify-center border border-gray-300 bg-white text-gray-800 font-semibold">
            Page {currentPage} / {totalPages}
          </span>

          {/* Next Page Button */}
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

// Add Prop Validation
AllTrainersManagement.propTypes = {
  AllTrainersData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      gender: PropTypes.string,
      tier: PropTypes.string,
      specialization: PropTypes.string,
      contact: PropTypes.shape({
        phone: PropTypes.string.isRequired,
      }).isRequired,
    })
  ),
  Refetch: PropTypes.func.isRequired,
};

export default AllTrainersManagement;
