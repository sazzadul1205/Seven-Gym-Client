import PropTypes from "prop-types";

import { ImCross } from "react-icons/im";

const SelectedAwardModal = ({ award }) => {
  // Prevents rendering when no award is selected
  if (!award) return null;

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

  //  Closes the modal by finding it by its ID and calling `.close()`
  const closeModal = () => {
    document.getElementById("Selected_Award_Modal")?.close();
  };

  return (
    <div className="modal-box bg-gray-100 rounded-xl shadow-xl max-w-lg w-full p-6 relative">
      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition duration-200 focus:outline-hidden cursor-pointer"
      >
        <ImCross className="text-lg text-gray-500 hover:text-gray-700" />
      </button>

      {/* Award Icon & Name */}
      <div className="flex flex-col items-center text-center mb-6">
        <img
          src={award.awardIcon}
          alt={award.awardName}
          className="w-24 h-24 rounded-full border-4 border-gray-200 shadow-lg mb-4"
        />
        <h3 className="text-2xl font-semibold text-gray-900">
          {award.awardName}
        </h3>
        <p className={`font-semibold ${getLevelColor(award.awardRanking)}`}>
          {award.awardRanking} Rank
        </p>
      </div>

      {/* Award Details */}
      <div className="space-y-3 text-gray-700">
        <div className="flex space-x-2">
          <p className="font-semibold text-gray-800">🏅 Awarded By:</p>
          <p>{award.awardedBy}</p>
        </div>
        <div className="flex space-x-2">
          <p className="font-semibold text-gray-800">📅 Date Awarded:</p>
          <p>
            {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
              new Date(award.dateAwarded)
            )}
          </p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-gray-800 underline">
            📜 Description:
          </p>
          <p className="italic">{award.description}</p>
        </div>
      </div>

      {/* Favorite Status */}
      <div className="mt-6 text-center">
        {award.favorite ? (
          <div className="flex items-center justify-center gap-2 text-green-500 text-lg font-semibold">
            ⭐ Marked as Favorite
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Not Marked as Favorite</p>
        )}
      </div>
    </div>
  );
};

// PropTypes validation
SelectedAwardModal.propTypes = {
  award: PropTypes.shape({
    awardIcon: PropTypes.string.isRequired,
    awardName: PropTypes.string.isRequired,
    awardRanking: PropTypes.string.isRequired,
    awardedBy: PropTypes.string.isRequired,
    dateAwarded: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    favorite: PropTypes.bool.isRequired,
  }),
};

export default SelectedAwardModal;
