// Import Package
import PropTypes from "prop-types";

// Import Component
import FitnessGoalsSelector from "../../../../(Auth)/SignUpDetails/FitnessGoalsSelector/FitnessGoalsSelector";

const DetailsInfoSelector = ({
  description,
  setDescription,
  selectedGoals,
  setSelectedGoals,
}) => {
  // Handler for updating the description state
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <div className="bg-gray-400/50 p-3">
      {/* Title */}
      <h3 className="text-xl font-semibold text-black py-1">Detailed Info:</h3>

      {/* Divider */}
      <div className="bg-white p-[2px] w-1/2 mb-4"></div>

      <div className="flex flex-col sm:flex-row gap-4 text-black">
        {/* Bio Section */}
        <div className="w-full sm:w-1/2 bg-gray-300 rounded-xl border border-gray-100 px-2">
          <h3 className="p-3 font-semibold text-lg">My Bio</h3>
          {/* Textarea to display and update user description */}
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter your bio..."
            className="w-full p-2 border border-gray-300 rounded-md bg-white h-[150px] "
          />
        </div>

        {/* Fitness Goals Section */}
        <div className="w-full sm:w-1/2 bg-gray-300 rounded-xl border border-gray-100 px-2">
          <FitnessGoalsSelector
            selectedGoals={selectedGoals}
            setSelectedGoals={setSelectedGoals}
          />
        </div>
      </div>
    </div>
  );
};

DetailsInfoSelector.propTypes = {
  description: PropTypes.string.isRequired,
  setDescription: PropTypes.func.isRequired,
  selectedGoals: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSelectedGoals: PropTypes.func.isRequired,
};

export default DetailsInfoSelector;
