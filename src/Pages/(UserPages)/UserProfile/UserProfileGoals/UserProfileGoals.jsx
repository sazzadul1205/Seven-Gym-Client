import PropTypes from "prop-types";

import { FaBullseye, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const UserProfileGoals = ({ usersData }) => {
  // Check if the user has selected goals
  const selectedGoals = usersData?.selectedGoals || [];

  // Function to get background color and text color based on goal index (alternating)
  const getBackgroundColor = (index) => {
    // Extended list of colors for alternating backgrounds
    const colors = [
      {
        bg: "bg-linear-to-l hover:bg-linear-to-r from-blue-500 to-blue-400",
        text: "text-white",
      },
      {
        bg: "bg-linear-to-l hover:bg-linear-to-r from-green-500 to-green-400",
        text: "text-white",
      },
      {
        bg: "bg-linear-to-l hover:bg-linear-to-r from-yellow-500 to-yellow-400",
        text: "text-black",
      },
      {
        bg: "bg-linear-to-l hover:bg-linear-to-r from-pink-500 to-pink-400",
        text: "text-white",
      },
      {
        bg: "bg-linear-to-l hover:bg-linear-to-r from-purple-500 to-purple-400",
        text: "text-white",
      },
      {
        bg: "bg-linear-to-l hover:bg-linear-to-r from-red-500 to-red-400",
        text: "text-white",
      },
      {
        bg: "bg-linear-to-l hover:bg-linear-to-r from-teal-500 to-teal-400",
        text: "text-white",
      },
      {
        bg: "bg-linear-to-l hover:bg-linear-to-r from-orange-500 to-orange-400",
        text: "text-white",
      },
      {
        bg: "bg-linear-to-l hover:bg-linear-to-r from-indigo-500 to-indigo-400",
        text: "text-white",
      },
      {
        bg: "bg-linear-to-l hover:bg-linear-to-r from-gray-500 to-gray-400",
        text: "text-white",
      },
      {
        bg: "bg-linear-to-l hover:bg-linear-to-r from-cyan-500 to-cyan-400",
        text: "text-white",
      },
      {
        bg: "bg-linear-to-l hover:bg-linear-to-r from-lime-500 to-lime-400",
        text: "text-black",
      },
      {
        bg: "bg-linear-to-l hover:bg-linear-to-r from-rose-500 to-rose-400",
        text: "text-white",
      },
      {
        bg: "bg-linear-to-l hover:bg-linear-to-r from-amber-500 to-amber-400",
        text: "text-black",
      },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-300 p-5 shadow-xl rounded-xl">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b pb-2">
        <FaBullseye className="text-red-500 text-lg" />
        <h2 className="text-xl font-semibold text-black">Selected Goals</h2>
      </div>
      <div className="bg-black p-[1px]"></div>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-3 text-gray-600 mt-5 gap-3">
        {selectedGoals.length > 0 ? (
          selectedGoals.map((goal, index) => {
            // Get colors for each goal
            const { bg, text } = getBackgroundColor(index);
            return (
              <p
                key={index}
                className={`flex items-center space-x-2 ${bg} ${text} py-2 px-3 rounded-lg hover:bg-opacity-90 transition-colors duration-300 cursor-pointer`}
              >
                <FaCheckCircle className="text-lg " />
                <span>{goal}</span>
              </p>
            );
          })
        ) : (
          // If no goals are selected, show this message
          <div className="flex items-center space-x-2 bg-gray-100 py-2 px-3 rounded-lg">
            <FaTimesCircle className="text-red-500 text-lg" />
            <span>No goals selected.</span>
          </div>
        )}
      </div>
    </div>
  );
};

// PropTypes validation to ensure usersData and selectedGoals are correctly structured
UserProfileGoals.propTypes = {
  usersData: PropTypes.shape({
    selectedGoals: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default UserProfileGoals;
