import PropTypes from "prop-types";
import TrainerPublicIdCard from "../../../../../Shared/Component/TrainerPublicIdCard";

const ClassesDetailsTrainers = ({ TrainersData }) => {
  if (!TrainersData || TrainersData.length === 0) {
    return (
      <div className="max-w-7xl mx-auto bg-gradient-to-bl from-gray-200 to-gray-400 rounded-xl shadow-xl my-2 px-5 py-5">
        <h3 className="text-2xl font-semibold text-gray-800 pb-2 border-b-2 border-gray-100">
          Meet Our Class Trainers
        </h3>
        <p className="text-gray-600 text-center py-5">No trainers available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-gradient-to-bl from-gray-200 to-gray-400 rounded-xl shadow-xl my-2 px-5 py-5">
      <h3 className="text-2xl font-semibold text-gray-800 pb-2 border-b-2 border-gray-100">
        Meet Our Class Trainers
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
        {TrainersData.map((trainer) => (
          <TrainerPublicIdCard
            key={trainer.id || trainer.name}
            trainer={trainer}
          />
        ))}
      </div>
    </div>
  );
};

// Prop validation
ClassesDetailsTrainers.propTypes = {
  TrainersData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ClassesDetailsTrainers;
