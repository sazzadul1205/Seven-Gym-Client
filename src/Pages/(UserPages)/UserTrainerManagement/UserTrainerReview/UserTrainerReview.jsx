/* eslint-disable react/prop-types */
const UserTrainerReview = ({ TrainerStudentHistoryData }) => {
  console.log("Trainer Student History Data :", TrainerStudentHistoryData);

  return (
    <div>
      {/* Header */}
      <div className="text-center py-1">
        {/* Title */}
        <h3 className="text-center text-xl font-semibold">Trainer Review</h3>
      </div>

      {/* Divider */}
      <div className="mx-auto bg-black w-1/3 p-[1px]" />

      
    </div>
  );
};

export default UserTrainerReview;
