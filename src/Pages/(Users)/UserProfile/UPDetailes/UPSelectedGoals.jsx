/* eslint-disable react/prop-types */
import { FaBullseye, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const UPSelectedGoals = ({ usersData }) => {
  return (
    <div className="py-5">
      <div className="flex items-center space-x-2 border-b ">
        <FaBullseye className="text-red-500" />
        <h2 className="text-xl font-semibold text-black ">Selected Goals</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-gray-600 mt-5 gap-2">
        {usersData?.selectedGoals && usersData.selectedGoals.length > 0 ? (
          usersData.selectedGoals.map((goal, index) => (
            <p
              key={index}
              className="flex items-center space-x-1 bg-slate-200 py-1 px-2 rounded-lg hover:bg-slate-300 transition-colors duration-300 mb-2"
            >
              <FaCheckCircle className="text-green-500" />
              <span>{goal}</span>
            </p>
          ))
        ) : (
          <li className="flex items-center space-x-2">
            <FaTimesCircle className="text-red-500" />
            <span>No goals selected.</span>
          </li>
        )}
      </div>
    </div>
  );
};

export default UPSelectedGoals;
