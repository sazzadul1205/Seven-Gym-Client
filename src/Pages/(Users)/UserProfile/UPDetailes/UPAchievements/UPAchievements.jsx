/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaAward, FaChevronRight } from "react-icons/fa";
import SelectedAwardModal from "./SelectedAwardModal/SelectedAwardModal";
import AwardViewMoreModal from "./AwardViewMoreModal/AwardViewMoreModal";

// Main component for displaying user achievements
const UPAchievements = ({ usersData, refetch }) => {
  // State to manage the selected award
  const [selectedAward, setSelectedAward] = useState(null);

  // Function to determine the color based on the award level
  const getLevelColor = (level) => {
    switch (level) {
      case "Gold Rank":
        return "text-[#FFD700]";
      case "Silver Rank":
        return "text-[#C0C0C0]";
      case "Bronze Rank":
        return "text-[#CD7F32]";
      default:
        return "text-[#A9A9A9]";
    }
  };

  // Function to handle when an award is clicked
  const handleAwardClick = (award) => {
    setSelectedAward(award); // Set the selected award
    document.getElementById("Selected_Award_Modal").showModal(); // Show the modal
  };

  // Filter favorite awards from the usersData
  const favoriteAwards = usersData?.awards?.filter((award) => award.favorite);

  return (
    <div className="bg-white py-2 px-8 pb-10 rounded-xl shadow-lg">
      {/* Header section */}
      <div className="flex items-center justify-between border-b py-2">
        {/* Title */}
        <div className="flex items-center space-x-2">
          <FaAward className="text-[#FFD700] text-xl" />
          <h2 className="text-xl font-semibold">Favorite Awards</h2>
        </div>
        {/* View More  */}
        <button
          className="flex items-center space-x-2 hover:text-gray-400"
          onClick={() =>
            document.getElementById("Award_View_More_Modal").showModal()
          }
        >
          <h2 className="text-xl font-semibold">View More</h2>
          <FaChevronRight className="text-xl" />
        </button>
      </div>

      {/* Grid to display favorite awards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {favoriteAwards?.length > 0 ? (
          // Map through favorite awards and render each one
          favoriteAwards.map((award, index) => (
            <div
              key={index}
              onClick={() => handleAwardClick(award)}
              className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer w-full md:w-[180px] h-[80px]"
            >
              <img
                src={award.awardIcon}
                alt={award.awardName}
                className="w-12 h-12 rounded-full"
              />
              <div className="text-sm">
                <div className="font-semibold">{award.awardName}</div>
                <div
                  className={`text-gray-600 ${getLevelColor(
                    award.awardRanking
                  )}`}
                >
                  {award.awardRanking} Rank
                </div>
              </div>
            </div>
          ))
        ) : (
          // Display message if no favorite awards are available
          <p className="text-[#6C757D]">No favorite awards to display.</p>
        )}
      </div>

      {/* Modal for displaying details of the selected award */}
      <dialog id="Selected_Award_Modal" className="modal">
        <SelectedAwardModal award={selectedAward} />
      </dialog>

      {/* Modal for View More */}
      <dialog id="Award_View_More_Modal" className="modal">
        <AwardViewMoreModal usersData={usersData} refetch={refetch} />
      </dialog>
    </div>
  );
};

export default UPAchievements;
