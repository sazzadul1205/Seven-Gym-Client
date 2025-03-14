import { useParams } from "react-router";
import { useState } from "react";

import PropTypes from "prop-types";

// Import icons
import { FaAward, FaChevronRight } from "react-icons/fa";

// import Modal
import SelectedAwardModal from "./SelectedAwardModal/SelectedAwardModal";
import AwardViewMoreModal from "./AwardViewMoreModal/AwardViewMoreModal";

const UserProfileAchievements = ({ usersData, refetch }) => {
  const { email } = useParams();
  const PageEmail = email;

  // State to manage the selected award
  const [selectedAward, setSelectedAward] = useState(null);

  //  Determines the text color based on award ranking.
  const getLevelColor = (level) => {
    switch (level) {
      case "Gold":
        return "text-[#FFD700]";
      case "Silver":
        return "text-[#C0C0C0]";
      case "Bronze":
        return "text-[#CD7F32]";
      default:
        return "text-black";
    }
  };

  //  Handles clicking on an award, opening the modal.
  const handleAwardClick = (award) => {
    setSelectedAward(award);
    document.getElementById("Selected_Award_Modal").showModal();
  };

  // Filter user's favorite awards
  const favoriteAwards =
    usersData?.awards?.filter((award) => award.favorite) || [];

  return (
    <div className="bg-linear-to-bl from-gray-200 to-gray-400 p-5 shadow-xl rounded-xl">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b py-2">
        {/* Title */}
        <div className="flex items-center space-x-2 text-black">
          <FaAward className="text-[#FFD700] text-xl" />
          <h2 className="text-xl font-semibold">Favorite Awards</h2>
        </div>

        {/* View More Button */}
        <button
          className="flex items-center space-x-2 bg-linear-to-l hover:bg-linear-to-r text-black hover:text-gray-800 cursor-pointer"
          onClick={() =>
            document.getElementById("Award_View_More_Modal").showModal()
          }
        >
          <h2 className="text-xl font-semibold">View More</h2>
          <FaChevronRight className="text-xl" />
        </button>
      </div>
      <div className="bg-black p-[1px]"></div>

      {/* Favorite Awards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {favoriteAwards.length > 0 ? (
          favoriteAwards.map((award, index) => (
            <div
              key={index}
              onClick={() => handleAwardClick(award)}
              className="flex items-center bg-gradient-to-bl hover:bg-gradient-to-tr from-white to-gray-200 rounded-4xl border border-gray-500/20 p-1 gap-2 cursor-pointer"
            >
              {/* Award Icon */}
              <img
                src={award.awardIcon}
                alt={award.awardName}
                className="w-12 h-12 rounded-full"
              />

              {/* Award Details */}
              <div className="text-sm text-black">
                <div className="font-semibold">{award.awardName}</div>
                <p
                  className={`font-semibold ${getLevelColor(
                    award.awardRanking
                  )}`}
                >
                  {award.awardRanking} Rank
                </p>
              </div>
            </div>
          ))
        ) : (
          // Display message if no favorite awards are available
          <p className="text-[#6C757D] text-center">
            No favorite awards to display.
          </p>
        )}
      </div>

      {/* Selected Award Modal */}
      <dialog id="Selected_Award_Modal" className="modal">
        <SelectedAwardModal award={selectedAward} />
      </dialog>

      {/* View More Awards Modal */}
      <dialog id="Award_View_More_Modal" className="modal">
        <AwardViewMoreModal
          usersData={usersData}
          refetch={refetch}
          PageEmail={PageEmail}
        />
      </dialog>
    </div>
  );
};

// PropTypes validation
UserProfileAchievements.propTypes = {
  usersData: PropTypes.shape({
    awards: PropTypes.arrayOf(
      PropTypes.shape({
        awardName: PropTypes.string.isRequired,
        awardIcon: PropTypes.string.isRequired,
        awardRanking: PropTypes.string.isRequired,
        favorite: PropTypes.bool.isRequired,
      })
    ),
  }),
  refetch: PropTypes.func.isRequired,
};

export default UserProfileAchievements;
