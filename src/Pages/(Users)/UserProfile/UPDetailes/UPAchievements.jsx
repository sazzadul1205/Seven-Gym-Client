/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaAward } from "react-icons/fa";

// Modal component for showing award details
const AwardModal = ({ award, closeModal }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6 rounded-lg max-w-md mx-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-white">
            {award.className} Award
          </h3>
          <button
            onClick={closeModal}
            className="text-2xl font-bold text-white"
          >
            &times;
          </button>
        </div>
        <img
          src={award.icon}
          alt={award.className}
          className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-white"
        />
        <p className="text-white text-lg">Level: {award.level}</p>
        <p className="mt-2 text-white">{award.description}</p>
        <p className="mt-2 text-white">
          <strong>Date Awarded:</strong> {award.dateAwarded}
        </p>
        <p className="mt-2 text-white">
          <strong>Awarded By:</strong> {award.instructor}
        </p>
        <div className="flex justify-center mt-4">
          <button
            onClick={closeModal}
            className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-400 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const UPAchievements = ({ usersData }) => {
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
        return "text-yellow-500"; // Gold Color
      case "Silver":
        return "text-gray-400"; // Silver Color
      case "Bronze":
        return "text-amber-600"; // Bronze Color
      default:
        return "text-gray-500"; // Default color
    }
  };

  return (
    <div className="space-y-4 bg-slate-100 py-2 px-10 pb-10 rounded-xl shadow-lg">
      <div className="flex items-center space-x-2 border-b">
        <FaAward className="text-[#EFBF04]" />
        <h2 className="text-xl font-semibold text-black">Current Awards</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {usersData?.awards?.map((award, index) => (
          <div
            key={index}
            onClick={() => openModal(award)}
            className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer w-full md:w-[180px] h-[80px]" // Ensure consistent size
          >
            <img
              src={award.icon}
              alt={award.className}
              className="w-12 h-12 rounded-full" // Consistent icon size
            />
            <div className="text-sm">
              <div className="font-semibold">{award.className}</div>
              <div className={`text-gray-600 ${getLevelColor(award.level)}`}>
                {award.level} Rank
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show Modal if an award is selected */}
      {selectedAward && (
        <AwardModal award={selectedAward} closeModal={closeModal} />
      )}
    </div>
  );
};

export default UPAchievements;
