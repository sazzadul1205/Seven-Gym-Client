/* eslint-disable react/prop-types */
import { ImCross } from "react-icons/im";

const SelectedAwardModal = ({ award, onClose }) => {
  if (!award) return null; // Don't render if no award is passed

  return (
    <dialog
      id="Selected_Award_Modal"
      className="modal fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      open
      aria-modal="true"
      role="dialog"
    >
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 focus:outline-none"
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
          <p className="text-gray-500 text-sm">{award.awardRanking} Rank</p>
        </div>

        {/* Award Details */}
        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-semibold text-gray-800">🏅 Awarded By:</span>{" "}
            {award.awardedBy}
          </p>
          <p>
            <span className="font-semibold text-gray-800">
              📅 Date Awarded:
            </span>{" "}
            {new Date(award.dateAwarded).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold text-gray-800">📜 Description:</span>{" "}
            {award.description}
          </p>
        </div>

        {/* Favorite Status */}
        <div className="mt-6">
          {award.favorite ? (
            <div className="flex items-center justify-center gap-2 text-green-500 text-lg font-semibold">
              ⭐ Marked as Favorite
            </div>
          ) : (
            <div className="text-center text-gray-400 text-sm">
              Not Marked as Favorite
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default SelectedAwardModal;
