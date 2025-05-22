import { useState, useRef, useEffect } from "react";

// Icons
import { FaSearch } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";

// Gender Icons
import { getGenderIcon } from "../../../Utility/getGenderIcon";
import AllTrainerManagementDetails from "./AllTrainerManagementDetails/AllTrainerManagementDetails";
import Swal from "sweetalert2";

const AllTrainersManagement = ({ AllTrainersData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedTier, setSelectedTier] = useState("All");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  // Handles actions (view details, kick, ban) on a user
  const handleUserAction = (action, trainer) => {
    // Always close the dropdown after any action
    setOpenDropdownId(null);

    switch (action) {
      case "details":
        // Set the selected user and show their detail modal
        setSelectedTrainer(trainer);
        document.getElementById("Trainers_Details").showModal();
        break;

      case "kick":
        // Confirmation dialog before kicking the trainer
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
            // Perform kick logic here (e.g., API call)
            Swal.fire(
              "Kicked!",
              `${trainer.fullName} has been kicked.`,
              "success"
            );
          }
        });
        break;

      case "ban":
        // Confirmation dialog before banning the trainer
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
            // Perform ban logic here (e.g., API call)
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
            {filteredUsers.map((trainer, index) => (
              <tr
                key={trainer._id}
                className={`hover:bg-gray-100 ${
                  !trainer.tier ? "bg-red-100 hover:bg-red-200" : ""
                }`}
              >
                {/* Trainer Index */}
                <td>{index + 1}</td>
                {/* Trainer Avatar */}
                <td>
                  <img
                    src={trainer.imageUrl}
                    alt={trainer.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>

                {/* Trainer Name */}
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
                            <span key={i}>{part}</span>
                          )
                        );
                      })()
                    : trainer.name}
                </td>
                {/* Trainer Email */}
                <td>{trainer.email}</td>

                {/* Trainer Phone */}
                <td>
                  {trainer.contact?.phone
                    ? trainer.contact.phone.startsWith("+")
                      ? trainer.contact.phone
                      : `+${trainer.contact.phone}`
                    : "N/A"}
                </td>

                {/* Trainer Specialization */}
                <td>
                  {trainer.specialization ? (
                    trainer.specialization
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Not set yet
                    </span>
                  )}
                </td>

                {/* Trainer Gender */}
                <td className="flex items-center gap-1">
                  {(() => {
                    const { icon, label } = getGenderIcon(trainer.gender);
                    return (
                      <>
                        {icon}
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

                {/* Trainer Button */}
                <td className="relative">
                  <button
                    className="border border-gray-400 rounded-full p-2 hover:bg-gray-300 transition cursor-pointer"
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === trainer._id ? null : trainer._id
                      )
                    }
                  >
                    <HiDotsVertical className="text-gray-700" />
                  </button>
                  {openDropdownId === trainer._id && (
                    <div
                      ref={dropdownRef}
                      onMouseLeave={() => setOpenDropdownId(null)}
                      className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20"
                    >
                      <ul className="py-1 text-sm text-gray-700">
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleUserAction("details", trainer)}
                        >
                          Details
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleUserAction("kick", trainer)}
                        >
                          Kick Trainer
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleUserAction("ban", trainer)}
                        >
                          Ban Trainer
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No trainers found.</p>
        )}
      </div>

      {/* Modal Popup */}
      <dialog id="Trainers_Details" className="modal">
        <AllTrainerManagementDetails trainer={selectedTrainer} />
      </dialog>
    </div>
  );
};

export default AllTrainersManagement;
