import PropTypes from "prop-types";
import TrainerPublicIdCard from "../../../../../Shared/Component/TrainerPublicIdCard";

const ClassesDetailsTrainers = ({ TrainersData }) => {
  return (
    <section className="bg-gradient-to-bl from-gray-200/80 to-gray-500/50 p-2 md:p-10 mx-0 md:mx-32 rounded-none md:rounded-xl shadow-inner">
      {/* Title */}
      <header className="mb-4 border-b-2 border-gray-100 pb-3">
        <h3 className="text-2xl text-white font-semibold">
          Class Trainer&apos;s
        </h3>
      </header>

      {/* Trainer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TrainersData.map((trainer) => (
          <TrainerPublicIdCard
            key={trainer.id || trainer.name}
            trainer={trainer}
          />
        ))}
      </div>
    </section>
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
