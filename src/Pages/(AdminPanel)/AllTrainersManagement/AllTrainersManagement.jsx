/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";

// Import Packages
import Swal from "sweetalert2";

// Icons
import { FaSearch } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";

// Fetch Gender Icons
import { getGenderIcon } from "../../../Utility/getGenderIcon";

// Import Modal
import AllTrainerManagementDetails from "./AllTrainerManagementDetails/AllTrainerManagementDetails";
import AllTrainerTierManagement from "./AllTrainerTierManagement/AllTrainerTierManagement";

const AllTrainersManagement = ({ AllTrainersData, Refetch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState("All");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");

  // Modal control states instead of direct DOM calls
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTierModal, setShowTierModal] = useState(false);

  const dropdownRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const trainersPerPage = 10;

  const genderOptions = ["All", "Male", "Female", "Other"];

  const uniqueSpecializations = [
    "All",
    ...Array.from(
      new Set(AllTrainersData.map((t) => t.specialization).filter(Boolean))
    ),
  ];

  const uniqueTiers = [
    "All",
    ...Array.from(new Set(AllTrainersData.map((t) => t.tier).filter(Boolean))),
  ];

  // Close dropdown if clicked outside or on scroll
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    const handleScroll = () => setOpenDropdownId(null);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  // Pagination slice
  const indexOfLastTrainer = currentPage * trainersPerPage;
  const indexOfFirstTrainer = indexOfLastTrainer - trainersPerPage;
  const currentTrainers = filteredUsers.slice(
    indexOfFirstTrainer,
    indexOfLastTrainer
  );

  // Reset page when filters/search change (avoid empty page)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGender, selectedSpecialization, selectedTier]);

  const handleUserAction = (action, trainer) => {
    setOpenDropdownId(null);

    switch (action) {
      case "details":
        setSelectedTrainer(trainer);
        setShowDetailsModal(true);
        break;

      case "tier_management":
        setSelectedTrainer(trainer);
        setShowTierModal(true);
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
            // TODO: Add API call here
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
            // TODO: Add API call here
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

  return (
    <div className="text-black">
      {/* Filters */}
      <div className="bg-gray-200 px-4 py-6 flex flex-col items-center space-y-1">
        <label className="text-gray-700 font-medium text-lg">
          All Trainers
        </label>

        <div className="flex flex-wrap justify-center gap-4 w-full max-w-6xl">
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

          {/* Specialization Filter */}
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

          {/* Search Input */}
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
              <th>Specialization</th>
              <th>Gender</th>
              <th>Tier</th>
              <th>Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {currentTrainers.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center text-gray-500 py-4">
                  No trainers found.
                </td>
              </tr>
            ) : (
              currentTrainers.map((trainer, index) => (
                <tr
                  key={trainer._id}
                  className={`hover:bg-gray-100 items-center ${
                    !trainer.tier ? "bg-red-100 hover:bg-red-200" : ""
                  }`}
                >
                  <td>{indexOfFirstTrainer + index + 1}</td>

                  <td>
                    <img
                      src={trainer.imageUrl}
                      alt={trainer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>

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

                  <td>{trainer.email}</td>
                  <td>{trainer.phone}</td>
                  <td>{trainer.specialization || "N/A"}</td>

                  {/* Trainer Gender */}
                  <td className="align-middle flex items-center gap-1">
                    {(() => {
                      const { icon, label } = getGenderIcon(trainer.gender);
                      return (
                        <>
                          <span className="inline-flex w-6 h-6 items-center justify-center">
                            {icon}
                          </span>
                          <span className="text-sm">{label}</span>
                        </>
                      );
                    })()}
                  </td>

                  {/* Trainer Tier */}
                  <td>
                    {trainer.tier ? (
                      trainer.tier
                    ) : (
                      <span className="text-red-600 font-semibold">New</span>
                    )}
                  </td>

                  <td className="relative" ref={dropdownRef}>
                    <button
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === trainer._id ? null : trainer._id
                        )
                      }
                      className="p-1 rounded hover:bg-gray-200 focus:outline-none"
                      aria-label="Open actions dropdown"
                    >
                      <HiDotsVertical size={20} />
                    </button>

                    {openDropdownId === trainer._id && (
                      <ul className="absolute right-0 top-full mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 w-40 text-sm">
                        <li
                          onClick={() => handleUserAction("details", trainer)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          Details
                        </li>
                        <li
                          onClick={() =>
                            handleUserAction("tier_management", trainer)
                          }
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          Tier Management
                        </li>
                        <li
                          onClick={() => handleUserAction("kick", trainer)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                        >
                          Kick
                        </li>
                        <li
                          onClick={() => handleUserAction("ban", trainer)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                        >
                          Ban
                        </li>
                      </ul>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from(
            { length: Math.ceil(filteredUsers.length / trainersPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded border ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                aria-label={`Go to page ${i + 1}`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && selectedTrainer && (
        <AllTrainerManagementDetails
          setShowDetailsModal={setShowDetailsModal}
          trainerDetails={selectedTrainer}
          Refetch={Refetch}
        />
      )}

      {showTierModal && selectedTrainer && (
        <AllTrainerTierManagement
          setShowTierModal={setShowTierModal}
          trainerDetails={selectedTrainer}
          Refetch={Refetch}
        />
      )}
    </div>
  );
};

export default AllTrainersManagement;
