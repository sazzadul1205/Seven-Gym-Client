/* eslint-disable react/prop-types */

import ClassTrainersCard from "../ClassTrainersCard/ClassTrainersCard";

const CDTrainers = ({ TrainersData, getTrainerRole }) => {
  return (
    <div className="max-w-[1200px] mx-auto pt-5 space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        Meet Our Trainers
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {TrainersData.map((trainer) => {
          const role = getTrainerRole(trainer);
          return (
            <ClassTrainersCard
              key={trainer.id}
              trainer={trainer}
              role={role} // Pass the role to the Card component
            />
          );
        })}
      </div>
    </div>
  );
};

export default CDTrainers;
