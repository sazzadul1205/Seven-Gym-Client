/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaAward, FaChevronRight } from "react-icons/fa";
import AllAwardsModal from "./AllAwardsModal/AllAwardsModal";

// Modal component for showing award details
const AwardModal = ({ award, closeModal }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gradient-to-r from-[#9D50BB] via-[#6E48AA] to-[#ED1D24] p-6 rounded-lg max-w-md mx-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-white">
            {award.awardName} Award
          </h3>
          <button
            onClick={closeModal}
            className="text-2xl font-bold text-white"
          >
            &times;
          </button>
        </div>
        <img
          src={award.awardIcon}
          alt={award.awardName}
          className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-white"
        />
        <p className="text-white text-lg">Level: {award.awardRanking}</p>
        <p className="mt-2 text-white">{award.description}</p>
        <p className="mt-2 text-white">
          <strong>Date Awarded:</strong> {award.dateAwarded}
        </p>
        <p className="mt-2 text-white">
          <strong>Awarded By:</strong> {award.awardedBy}
        </p>
        <div className="flex justify-center mt-4">
          <button
            onClick={closeModal}
            className="px-6 py-2 bg-[#FFC300] text-white font-semibold rounded-lg hover:bg-[#FFD700] transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const UPAchievements = ({ usersData, refetch }) => {
  const [selectedAward, setSelectedAward] = useState(null);

  // Function to open the modal with the selected award
  const openModal = (award) => {
    setSelectedAward(award);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedAward(null);
  };

  // Function to get the color for each award level
  const getLevelColor = (level) => {
    switch (level) {
      case "Gold":
        return "text-[#FFD700]"; // Gold Color
      case "Silver":
        return "text-[#C0C0C0]"; // Silver Color
      case "Bronze":
        return "text-[#CD7F32]"; // Bronze Color
      default:
        return "text-[#A9A9A9]"; // Default gray color
    }
  };

  // Filter awards to show only those marked as favorite
  const favoriteAwards = usersData?.awards?.filter((award) => award.favorite);

  return (
    <div className="space-y-4 bg-[#F8F9FA] py-2 px-8 pb-10 rounded-xl shadow-lg">
      <div className="flex items-center justify-between border-b py-2">
        <div className="flex items-center space-x-2">
          <FaAward className="text-[#FFD700] text-xl" />
          <h2 className="text-xl font-semibold">Favorite Awards</h2>
        </div>
        <button
          className="flex items-center space-x-2 hover:text-gray-400"
          onClick={() =>
            document.getElementById("All_Awards_Modal").showModal()
          }
        >
          <h2 className="text-xl font-semibold">View More</h2>
          <FaChevronRight className="text-xl" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {favoriteAwards?.length > 0 ? (
          favoriteAwards.map((award, index) => (
            <div
              key={index}
              onClick={() => openModal(award)}
              className="flex items-center space-x-2 bg-[#FFFFFF] p-4 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer w-full md:w-[180px] h-[80px]" // Ensure consistent size
            >
              <img
                src={award.awardIcon}
                alt={award.awardName}
                className="w-12 h-12 rounded-full" // Consistent icon size
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
          <p className="text-[#6C757D]">No favorite awards to display.</p>
        )}
      </div>

      {/* Show Modal if an award is selected */}
      {selectedAward && (
        <AwardModal award={selectedAward} closeModal={closeModal} />
      )}

      <dialog id="All_Awards_Modal" className="modal">
        <AllAwardsModal usersData={usersData} refetch={refetch} />
      </dialog>
    </div>
  );
};

export default UPAchievements;
