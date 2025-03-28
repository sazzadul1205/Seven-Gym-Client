import { useState, useEffect } from "react";

// Import Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Import Icons
import { IoMdAdd } from "react-icons/io";
import { FaTrophy, FaStar, FaRegStar, FaRegTrashAlt } from "react-icons/fa";

// Import Buttons
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import AddAwardModal from "../USAwards/AddAwardModal/AddAwardModal";

const UserSettingsAward = ({ UsersData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // State Management
  const [UserAwards, setUserAwards] = useState(UsersData?.awards || []);

  // Sync state with updated UsersData
  useEffect(() => {
    setUserAwards(UsersData?.awards || []);
  }, [UsersData]);

  // Toggle favorite status for an award
  const toggleFavorite = async (index, awardCode) => {
    const selectedAward = UserAwards[index];

    if (
      !selectedAward.favorite &&
      UserAwards.filter((a) => a.favorite).length >= 6
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
        refetch(); // Fetch latest data
      } else {
        Swal.fire(
          "Error",
          response.data?.message || "Failed to update favorite status.",
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
  const deleteAward = async (awardCode) => {
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
          refetch(); // Fetch latest data
        } else {
          Swal.fire(
            "Error",
            response.data?.message || "Failed to delete the award.",
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

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-gray-400 px-5 py-2">
        <p className="flex gap-2 items-center text-xl font-semibold italic text-white">
          <FaTrophy /> User Award Settings
        </p>
      </div>

      {/* Add Award Button */}
      <div className="flex items-center justify-between bg-gray-400/50 p-3">
        <CommonButton
          text="Add New Award"
          bgColor="green"
          px="px-10"
          icon={<IoMdAdd />}
          iconSize="text-xl"
          clickEvent={() =>
            document.getElementById("Add_Award_Modal").showModal()
          }
        />
      </div>

      {/* My Awards Table */}
      <div className="bg-gray-400/50 text-black p-3 mt-2 overflow-x-auto">
        <h3 className="text-black font-semibold text-lg mb-3">My Awards</h3>
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse border border-gray-300">
            {/* Table Header */}
            <thead className="bg-gray-300 text-gray-700">
              <tr>
                <th className="p-3 text-left">Icon</th>
                <th className="p-3 text-left">Award Name</th>
                <th className="p-3 text-left">Ranking</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Date Awarded</th>
                <th className="p-3 text-left">Awarded By</th>
                <th className="p-3 text-left">Favorite</th>
                <th className="p-3 text-left">Delete</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {UserAwards.length > 0 ? (
                UserAwards.map((award, index) => (
                  <tr
                    key={award.awardCode}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    {/* Award Icon */}
                    <td className="p-3">
                      <img
                        src={award.awardIcon}
                        alt={award.awardName}
                        className="w-10 h-10 rounded-full border"
                      />
                    </td>

                    {/* Award Name */}
                    <td className="p-3 font-semibold">{award.awardName}</td>

                    {/* Award Ranking with Color Styling */}
                    <td className="p-3 font-semibold">
                      <span
                        className={`mx-auto px-2 py-1 rounded-md text-white ${
                          award.awardRanking.includes("Gold")
                            ? "bg-yellow-500"
                            : award.awardRanking.includes("Silver")
                            ? "bg-gray-400"
                            : award.awardRanking.includes("Bronze")
                            ? "bg-orange-500"
                            : "bg-blue-500"
                        }`}
                      >
                        {award.awardRanking}
                      </span>
                    </td>

                    {/* Award Description */}
                    <td className="p-3">{award.description}</td>

                    {/* Date Awarded */}
                    <td className="p-3">{award.dateAwarded}</td>

                    {/* Awarded By */}
                    <td className="p-3">{award.awardedBy}</td>

                    {/* Favorite Status */}
                    <td className="p-3 text-center">
                      <button
                        className="cursor-pointer"
                        onClick={() => toggleFavorite(index, award.awardCode)}
                      >
                        {award.favorite ? (
                          <FaStar className="text-yellow-400 text-2xl" />
                        ) : (
                          <FaRegStar className="text-gray-500 text-2xl" />
                        )}
                      </button>
                    </td>

                    {/* Delete Action */}
                    <td className="p-3">
                      <button
                        className="px-4 bg-gradient-to-bl hover:bg-gradient-to-tr from-red-400 to-red-600 py-3 text-white text-xl rounded-xl cursor-pointer"
                        onClick={() => deleteAward(award.awardCode)}
                      >
                        <FaRegTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-3 text-center text-gray-500">
                    No awards recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <dialog id="Add_Award_Modal" className="modal">
        <AddAwardModal refetch={refetch} />
      </dialog>
    </div>
  );
};

export default UserSettingsAward;

// Define PropTypes for component props
UserSettingsAward.propTypes = {
  UsersData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    awards: PropTypes.arrayOf(
      PropTypes.shape({
        awardCode: PropTypes.string.isRequired,
        awardName: PropTypes.string.isRequired,
        awardIcon: PropTypes.string.isRequired,
        awardRanking: PropTypes.string.isRequired,
        description: PropTypes.string,
        dateAwarded: PropTypes.string.isRequired,
        awardedBy: PropTypes.string.isRequired,
        favorite: PropTypes.bool.isRequired,
      })
    ),
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};
