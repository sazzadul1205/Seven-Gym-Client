/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaRegStar, FaStar, FaRegTrashAlt, FaTrophy } from "react-icons/fa";
import { CiViewTable } from "react-icons/ci";
import { IoGridOutline } from "react-icons/io5";
import { HiOutlineRefresh } from "react-icons/hi";

import AddAwardModal from "./AddAwardModal/AddAwardModal";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

const USAwards = ({ UsersData, refetch }) => {
  const axiosPublic = useAxiosPublic();
  const [isSpinning, setIsSpinning] = useState(false); // Spinner state for refreshing
  const [viewMode, setViewMode] = useState("table"); // View mode (table or grid)
  const [awards, setAwards] = useState(
    UsersData?.awards?.map((award) => ({
      ...award,
      favorite: award.favorite || false,
    })) || []
  ); // Awards data state

  // Toggle favorite status for an award
  const toggleFavorite = async (index, awardCode) => {
    const selectedAward = awards[index];

    // Check if the favorite limit is reached (max 6 favorites)
    if (
      !selectedAward.favorite &&
      awards.filter((a) => a.favorite).length >= 6
    ) {
      Swal.fire(
        "Limit Reached",
        "You can only mark up to 6 awards as favorites.",
        "warning"
      );
      return;
    }

    try {
      const response = await axiosPublic.put("/Users/toggle-award-favorite", {
        email: UsersData.email,
        awardCode,
      });

      if (response.status === 200) {
        setAwards((prevAwards) =>
          prevAwards.map((award, i) =>
            i === index ? { ...award, favorite: !award.favorite } : award
          )
        );
        refetch();
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to update favorite status.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      Swal.fire(
        "Error",
        "Failed to update favorite status. Please try again.",
        "error"
      );
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
          data: { email: UsersData.email, awardCode },
        });

        if (response.status === 200) {
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

  // Handle refresh button click (for spinner animation)
  const handleClick = () => {
    setIsSpinning(true);
    refetch(); // Call the refetch function to update data

    // Stop spinning after the animation duration (e.g., 0.5s)
    setTimeout(() => setIsSpinning(false), 500);
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header */}
      <header className="bg-gray-400 px-5 py-2">
        <p className="flex items-center gap-2 text-xl font-semibold italic text-white">
          <FaTrophy /> User Awards Settings
        </p>
      </header>

      {/* Main Content */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-5">
          {/* Button to show Add Award modal */}
          <button
            className="flex gap-3 items-center bg-green-500 hover:bg-green-400 text-white font-semibold px-16 py-3 rounded-lg"
            onClick={() =>
              document.getElementById("Add_Award_Modal").showModal()
            }
          >
            + Add Award
          </button>

          {/* View mode and refresh controls */}
          <div className="flex items-center bg-blue-100 gap-5 px-3 py-2">
            {/* View mode toggle */}
            <label className="swap swap-rotate">
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

            {/* Refresh button */}
            <button onClick={handleClick}>
              <HiOutlineRefresh
                className={`h-8 w-8 transition-transform duration-500 ${
                  isSpinning ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Awards Display */}
        <div>
          {/* Table or Grid view based on selected view mode */}
          {viewMode === "table" ? (
            <div className="overflow-x-auto bg-white shadow-lg hover:shadow-2xl">
              <table className="w-full text-left border-collapse border border-gray-200">
                <thead className="bg-gray-400">
                  <tr>
                    <th className="p-3 border border-slate-200">Icon</th>
                    <th className="p-3 border border-slate-200">Award Name</th>
                    <th className="p-3 border border-slate-200">Ranking</th>
                    <th className="p-3 border border-slate-200">Description</th>
                    <th className="p-3 border border-slate-200">Date</th>
                    <th className="p-3 border border-slate-200">Awarded By</th>
                    <th className="p-3 border border-slate-200">Favorite</th>
                    <th className="p-3 border border-slate-200">Action</th>
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
                        {award.awardRanking}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {awards.map((award, index) => (
                <div
                  key={award.awardCode || index}
                  className="bg-white shadow-lg hover:shadow-2xl rounded-xl p-4 flex flex-col"
                >
                  <img
                    src={award.awardIcon || ""}
                    alt={award.awardName || "Award"}
                    className="w-20 h-20 object-contain mx-auto"
                  />
                  <h2 className="text-lg font-bold mt-3 mx-auto">
                    {award.awardName}{" "}
                    <span className="font-semibold">
                      ({award.awardRanking})
                    </span>
                  </h2>
                  <p className="text-gray-600 mt-2 text-center mx-auto">
                    {award.description}
                  </p>
                  <p className="flex gap-2 mx-auto">
                    <span className="p-2 mt-2 border border-gray-200 bg-gray-100 hover:scale-105">
                      {award.dateAwarded}
                    </span>
                    <span className="p-2 mt-2 border border-gray-200 bg-gray-100 hover:scale-105">
                      {award.awardedBy}
                    </span>
                  </p>
                  <div className="flex justify-between items-center pt-4 px-5">
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
                      className="bg-gradient-to-br hover:bg-gradient-to-tl from-[#F72C5B] to-[#f72c5bb4] p-2 "
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
      </div>

      {/* Modal */}
      <dialog id="Add_Award_Modal" className="modal">
        <AddAwardModal RefetchData={refetch} />
      </dialog>
    </div>
  );
};

export default USAwards;
