/* eslint-disable react/prop-types */
import { Link } from "react-router";
import USTrainer from "../../../../../assets/USTrainer.png";
import ClassTrainersCard from "../../../../(PublicPages)/(Classes)/ClassesDetails/ClassTrainersCard/ClassTrainersCard";

const UPTeachers = ({ TrainerDetailsData }) => {
  return (
    <div className="space-y-4 bg-white p-5 shadow-xl rounded-xl transition-transform duration-300 md:hover:scale-105 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b pb-2">
        <img src={USTrainer} alt="Trainer Icon" className="w-6 h-6" />
        <h2 className="text-xl font-semibold text-black">
          My Current Trainers
        </h2>
      </div>

      {/* Trainer List */}
      {TrainerDetailsData?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TrainerDetailsData.map((trainer, index) => (
            <ClassTrainersCard
              key={trainer.trainersID || index}
              trainer={trainer}
              role="Trainer"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 pt-4">
          <p className="text-gray-600 text-lg">No trainers assigned yet.</p>
          <Link
            to="/Trainers"
            className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          >
            Book Teacher
          </Link>
        </div>
      )}
    </div>
  );
};

export default UPTeachers;
