/* eslint-disable react/prop-types */
import { FaBullseye, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const UPSelectedGoals = ({ usersData }) => {
  return (
    <div className="py-5 bg-white p-5 shadow-xl rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b pb-2">
        <FaBullseye className="text-red-500 text-lg" />
        <h2 className="text-xl font-semibold text-black">Selected Goals</h2>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-3 text-gray-600 mt-5 gap-3">
        {usersData?.selectedGoals && usersData.selectedGoals.length > 0 ? (
          usersData.selectedGoals.map((goal, index) => (
            <p
              key={index}
              className="flex items-center space-x-2 bg-slate-200 py-2 px-3 rounded-lg hover:bg-slate-300 transition-colors duration-300"
            >
              <FaCheckCircle className="text-green-500 text-lg" />
              <span>{goal}</span>
            </p>
          ))
        ) : (
          <div className="flex items-center space-x-2 bg-gray-100 py-2 px-3 rounded-lg">
            <FaTimesCircle className="text-red-500 text-lg" />
            <span>No goals selected.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UPSelectedGoals;
