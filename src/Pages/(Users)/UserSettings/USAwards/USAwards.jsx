/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaRegStar, FaStar, FaRegTrashAlt, FaTrophy } from "react-icons/fa";
import { CiViewTable } from "react-icons/ci";
import { IoGridOutline } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { HiOutlineRefresh } from "react-icons/hi";

import AddAwardModal from "./AddAwardModal/AddAwardModal";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

const USAwards = ({ UsersData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // State to manage the view mode (table or grid)
  const [viewMode, setViewMode] = useState("table");

  // Initialize awards state with favorites
  const [awards, setAwards] = useState(
    UsersData?.awards?.map((award) => ({
      ...award,
      favorite: award.favorite || false,
    })) || []
  );

  // Toggle favorite status for an award
  const toggleFavorite = async (index, awardCode) => {
    const selectedAward = awards[index];

    if (
      !selectedAward.favorite &&
      awards.filter((a) => a.favorite).length >= 5
    ) {
      alert("You can only mark up to 5 awards as favorites.");
      return;
    }

    try {
      const response = await axiosPublic.put("/Users/toggle-award-favorite", {
        email: UsersData.email,
        awardCode: awardCode,
      });

      if (response.status === 200) {
        setAwards((prevAwards) =>
          prevAwards.map((award, i) =>
            i === index ? { ...award, favorite: !award.favorite } : award
          )
        );
        refetch();
      } else {
        alert(response.data.message || "Failed to update favorite status.");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      alert("Failed to update favorite status. Please try again.");
    }
  };

  // Delete an award
  const deleteAward = async (index, awardCode) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosPublic.delete("/Users/delete-award", {
          data: {
            email: UsersData.email,
            awardCode: awardCode,
          },
        });

        if (response.status === 200) {
          // Update the awards list by removing the deleted award
          setAwards((prevAwards) => prevAwards.filter((_, i) => i !== index));
          refetch();
        } else {
          Swal.fire(
            "Error",
            response.data.message || "Failed to delete the award.",
            "error"
          );
        }
      } catch (error) {
        console.error("Error deleting award:", error);
        Swal.fire(
          "Error",
          "Failed to delete the award. Please try again.",
          "error"
        );
      }
    }
  };

  // Open and close modal
  const openModal = () =>
    document.getElementById("Add_Award_Modal").showModal();
  const closeModal = () => document.getElementById("Add_Award_Modal").close();

  return (
    <div className="w-full bg-gray-200 min-h-screen">
      {/* Header Section */}
      <header className="bg-gray-400 px-5 py-2">
        <p className="flex items-center gap-2 text-xl font-semibold italic text-white">
          <FaTrophy /> User Awards Settings
        </p>
      </header>

      {/* Main Content */}
      <div className="p-5">
        {/* View Mode Selector */}
        <div className="flex justify-between items-center mb-5">
          <button
            className="flex gap-3 items-center bg-gradient-to-br hover:bg-gradient-to-tr from-green-500 to-green-300 text-gray-100 hover:text-gray-500 font-semibold px-16 py-3 rounded-lg"
            onClick={openModal}
          >
            + Add Award <FaTrophy />
          </button>
          <div className="flex items-center gap-3">
            <p className="text-xl font-semibold italic">Format:</p>
            <label className="swap swap-rotate bg-blue-200 rounded-full p-2">
              <input
                type="checkbox"
                checked={viewMode === "grid"}
                onChange={() =>
                  setViewMode(viewMode === "table" ? "grid" : "table")
                }
              />
              <CiViewTable className="swap-off h-8 w-8 text-blue-700" />
              <IoGridOutline className="swap-on h-8 w-8 text-blue-600" />
            </label>
            <button onClick={refetch}>
              <HiOutlineRefresh className="h-8 w-8" />
            </button>
          </div>
        </div>

        {/* Awards Display */}
        {viewMode === "table" ? (
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="w-full text-left border-collapse border border-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-3 border border-gray-200">Icon</th>
                  <th className="p-3 border border-gray-200">Award Name</th>
                  <th className="p-3 border border-gray-200">Description</th>
                  <th className="p-3 border border-gray-200">Date Awarded</th>
                  <th className="p-3 border border-gray-200">Awarded By</th>
                  <th className="p-3 border border-gray-200">Favorite</th>
                  <th className="p-3 border border-gray-200">Action</th>
                </tr>
              </thead>
              <tbody>
                {awards.map((award, index) => (
                  <tr
                    key={award.awardCode || index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="p-3 border border-gray-200">
                      <img
                        src={award.awardIcon || ""}
                        alt={award.awardName || "Award"}
                        className="w-10 h-10"
                      />
                    </td>
                    <td className="p-3 border border-gray-200">
                      {award.awardName}
                    </td>
                    <td className="p-3 border border-gray-200">
                      {award.description}
                    </td>
                    <td className="p-3 border border-gray-200">
                      {award.dateAwarded}
                    </td>
                    <td className="p-3 border border-gray-200">
                      {award.awardedBy}
                    </td>
                    <td className="p-3 border border-gray-200 text-center">
                      <button
                        onClick={() => toggleFavorite(index, award.awardCode)}
                      >
                        {award.favorite ? (
                          <FaStar className="text-yellow-400 text-2xl" />
                        ) : (
                          <FaRegStar className="text-gray-500 text-2xl" />
                        )}
                      </button>
                    </td>
                    <td className="p-3 border border-gray-200">
                      <button
                        className="bg-gradient-to-br hover:bg-gradient-to-tl from-[#F72C5B] to-[#f72c5bb4] p-3 rounded-xl w-full"
                        onClick={() => deleteAward(index, award.awardCode)}
                      >
                        <FaRegTrashAlt className="text-white justify-center mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award, index) => (
              <div
                key={award.awardCode || index}
                className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center"
              >
                <img
                  src={award.awardIcon || ""}
                  alt={award.awardName || "Award"}
                  className="w-20 h-20 object-contain"
                />
                <h2 className="text-lg font-bold mt-3">{award.awardName}</h2>
                <p className="text-gray-600 mt-2">{award.description}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => toggleFavorite(index, award.awardCode)}
                  >
                    {award.favorite ? (
                      <FaStar className="text-yellow-400 text-2xl" />
                    ) : (
                      <FaRegStar className="text-gray-500 text-2xl" />
                    )}
                  </button>
                  <button
                    className="bg-gradient-to-br hover:bg-gradient-to-tl from-[#F72C5B] to-[#f72c5bb4] p-2 rounded-full"
                    onClick={() => deleteAward(index, award.awardCode)}
                  >
                    <FaRegTrashAlt className="text-white text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}   
      <dialog id="Add_Award_Modal" className="modal">
        <div className="modal-box">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Add Award</h3>
            <ImCross
              className="text-xl hover:text-[#F72C5B] cursor-pointer"
              onClick={closeModal}
            />
          </div>
          <AddAwardModal refetch={refetch} />
        </div>
      </dialog>
    </div>
  );
};

export default USAwards;
