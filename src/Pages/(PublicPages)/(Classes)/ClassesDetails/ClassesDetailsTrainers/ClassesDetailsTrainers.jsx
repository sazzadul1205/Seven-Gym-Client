import PropTypes from "prop-types";
import TrainerPublicIdCard from "../../../../../Shared/Component/TrainerPublicIdCard";

const ClassesDetailsTrainers = ({ TrainersData, ThisModule }) => {
  // Categorize and assign roles to trainers
  const getTrainerRole = (trainer) => {
    if (trainer.name === ThisModule.classTeacher) return "Class Teacher";
    if (ThisModule.helperTeachers?.includes(trainer.name)) return "Helper";
    if (trainer.name === ThisModule.fallbackTeacher) return "Fallback Teacher";
    return "Trainer"; // Default role
  };

  return (
    <div className="max-w-7xl mx-auto bg-gradient-to-bl from-gray-200 to-gray-400 rounded-xl shadow-xl my-2 px-5 py-5">
      {/* Section title */}
      <h3 className="text-2xl font-semibold text-gray-800 pb-2 border-b-2 border-gray-100">
        Meet Our Class Trainers
      </h3>

      {/* Display message if no trainers available */}
      {TrainersData.length === 0 ? (
        <p className="text-gray-600 text-center py-5">No trainers available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
          {TrainersData.map((trainer) => (
            <TrainerPublicIdCard
              key={trainer.id}
              trainer={trainer}
              role={getTrainerRole(trainer)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Prop validation
ClassesDetailsTrainers.propTypes = {
  TrainersData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  ThisModule: PropTypes.shape({
    classTeacher: PropTypes.string,
    helperTeachers: PropTypes.arrayOf(PropTypes.string),
    fallbackTeacher: PropTypes.string,
  }).isRequired,
};

export default ClassesDetailsTrainers;
