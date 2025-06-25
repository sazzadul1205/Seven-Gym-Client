// import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Icons
import { IoSettings } from "react-icons/io5";

// Import Trainer Public Id Card
import TrainerPublicIdCard from "../../../../Shared/Component/TrainerPublicIdCard";

const ManagementClassTrainers = ({ ClassTrainersData }) => {
  return (
    <section className="relative bg-gradient-to-bl from-gray-200/80 to-gray-500/50 p-2 md:p-10 mx-0 md:mx-10 rounded-none md:rounded-xl shadow-inner">
      {/* Settings Icon (Top Left) */}
      <>
        <div
          className="absolute top-2 right-2 bg-gray-600/90 p-3 rounded-full cursor-pointer "
          data-tooltip-id="Class_Trainers_Edit"
          onClick={() =>
            document.getElementById("Class_Trainers_Edit_Modal").showModal()
          }
        >
          <IoSettings className="text-red-500 text-3xl transition-transform duration-500 hover:rotate-180 hover:text-red-400" />
        </div>
        <Tooltip
          id="Class_Trainers_Edit"
          place="top"
          className="z-50"
          content="Edit Class Trainers "
        />
      </>
      
      {/* Title */}
      <header className="mb-4 border-b-2 border-gray-100 pb-3">
        <h3 className="text-2xl text-white font-semibold">
          Class Trainer&apos;s
        </h3>
      </header>
      {/* Trainer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ClassTrainersData.map((trainer) => (
          <TrainerPublicIdCard
            key={trainer.id || trainer.name}
            trainer={trainer}
          />
        ))}
      </div>
    </section>
  );
};

// Prop Validation
ManagementClassTrainers.propTypes = {
  ClassTrainersData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    })
  ),
};

export default ManagementClassTrainers;
