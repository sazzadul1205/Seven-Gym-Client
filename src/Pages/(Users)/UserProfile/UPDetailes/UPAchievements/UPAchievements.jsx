/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaAward, FaChevronRight } from "react-icons/fa";
import AllAwardsModal from "./AllAwardsModal/AllAwardsModal";
import SelectedAwardModal from "./SelectedAwardModal/SelectedAwardModal";

const UPAchievements = ({ usersData, refetch }) => {
  const [selectedAward, setSelectedAward] = useState(null);
  const [isAllAwardsModalOpen, setIsAllAwardsModalOpen] = useState(false);
  const [isSelectedAwardModalOpen, setIsSelectedAwardModalOpen] =
    useState(false);

  // Function to open the selected award modal
  const openSelectedAwardModal = (award) => {
    setSelectedAward(award);
    setIsSelectedAwardModalOpen(true);
  };

  // Function to close the selected award modal
  const closeSelectedAwardModal = () => {
    setIsSelectedAwardModalOpen(false);
    setSelectedAward(null);
  };

  // Function to get the color for each award level
  const getLevelColor = (level) => {
    switch (level) {
      case "Gold Rank":
        return "text-[#FFD700]"; // Gold Color
      case "Silver Rank":
        return "text-[#C0C0C0]"; // Silver Color
      case "Bronze Rank":
        return "text-[#CD7F32]"; // Bronze Color
      default:
        return "text-[#A9A9A9]"; // Default gray color
    }
  };

  // Filter favorite awards
  const favoriteAwards = usersData?.awards?.filter((award) => award.favorite);

  return (
    <div className=" bg-[#F8F9FA] py-2 px-8 pb-10 rounded-xl shadow-lg">
      <div className="flex items-center justify-between border-b py-2">
        <div className="flex items-center space-x-2">
          <FaAward className="text-[#FFD700] text-xl" />
          <h2 className="text-xl font-semibold">Favorite Awards</h2>
        </div>
        <button
          className="flex items-center space-x-2 hover:text-gray-400"
          onClick={() => setIsAllAwardsModalOpen(true)}
        >
          <h2 className="text-xl font-semibold">View More</h2>
          <FaChevronRight className="text-xl" />
        </button>
      </div>

      {/* Favorite Awards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {favoriteAwards?.length > 0 ? (
          favoriteAwards.map((award, index) => (
            <div
              key={index}
              onClick={() => openSelectedAwardModal(award)}
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
          <p className="text-[#6C757D]">No favorite awards to display.</p>
        )}
      </div>

      {/* All Awards Modal */}
      {isAllAwardsModalOpen && (
        <AllAwardsModal
          usersData={usersData}
          refetch={refetch}
          onClose={() => setIsAllAwardsModalOpen(false)}
        />
      )}

      {/* Selected Award Modal */}
      {isSelectedAwardModalOpen && selectedAward && (
        <SelectedAwardModal
          award={selectedAward}
          onClose={closeSelectedAwardModal}
        />
      )}
    </div>
  );
};

export default UPAchievements;
