/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { IoSettingsSharp } from "react-icons/io5";
import { Link } from "react-router";
import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";

const AwardViewMoreModal = ({ usersData, refetch }) => {
  // State and hooks
  const axiosPublic = useAxiosPublic();
  const [awards, setAwards] = useState(usersData.awards); 
  const [warning, setWarning] = useState("");

  // Function to toggle favorite status for an award
  const toggleFavorite = async (index, awardCode) => {
    const selectedAward = awards[index];

    // Check if the user is trying to mark more than 6 awards as favorites
    if (
      !selectedAward.favorite &&
      awards.filter((a) => a.favorite).length >= 6
    ) {
      setWarning("You can only mark up to 6 awards as favorites.");
      return;
    }

    try {
      // API call to toggle favorite status
      const response = await axiosPublic.put("/Users/toggle-award-favorite", {
        email: usersData.email,
        awardCode,
      });

      if (response.status === 200) {
        // Update the awards list and refetch data
        setAwards((prevAwards) =>
          prevAwards.map((award, i) =>
            i === index ? { ...award, favorite: !award.favorite } : award
          )
        );
        refetch();
        setWarning(""); // Clear warning message on success
      } else {
        // Handle API errors
        setWarning(
          response.data.message || "Failed to update favorite status."
        );
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Error updating favorite status:", error);
      setWarning("Failed to update favorite status. Please try again.");
    }
  };

  return (
    <div className="modal-box min-w-[1200px] z-10">
      {/* Warning/Error Banner */}
      {warning && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>{warning}</p>
        </div>
      )}

      {/* Modal Header */}
      <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2 px-2">
        <Link to={`/User/UserSettings?tab=Settings_Awards`}>
          <IoSettingsSharp className="mr-5 text-2xl hover:text-red-500" />
        </Link>
        <h3 className="font-bold text-lg flex items-center">All Awards</h3>
        <button
          onClick={() =>
            document.getElementById("Award_View_More_Modal").close()
          }
        >
          <ImCross className="hover:text-red-500 text-xl" />
        </button>
      </div>

      {/* Awards Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full text-left border-collapse border border-gray-200">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 border border-gray-200">Icon</th>
              <th className="p-3 border border-gray-200">Award Name</th>
              <th className="p-3 border border-gray-200">Description</th>
              <th className="p-3 border border-gray-200">Date Awarded</th>
              <th className="p-3 border border-gray-200">Awarded By</th>
              <th className="p-3 border border-gray-200 text-center">
                Favorite
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Render awards list */}
            {awards.map((award, index) => (
              <tr
                key={award.awardCode || index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="p-3 border border-gray-200 text-center">
                  <img
                    src={award.awardIcon || ""}
                    alt={award.awardName || "Award"}
                    className="w-10 h-10 mx-auto"
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
                  {/* Button to toggle favorite status */}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AwardViewMoreModal;
