/* eslint-disable react/prop-types */
import { Link } from "react-router";

import PropTypes from "prop-types";

import USTrainer from "../../../../assets/UserProfile/USTrainer.png";

// Component Import
import UserProfileTrainerBasicInfo from "./UserProfileTrainerBasicInfo/UserProfileTrainerBasicInfo";

const UserProfileTrainers = ({ TrainersBookingAcceptedData }) => {
  console.log("Trainers Booking Accepted Data :", TrainersBookingAcceptedData);

  return (
    <div className="bg-linear-to-bl hover:bg-linear-to-tr from-white to-gray-100 p-5 shadow-xl rounded-xl">
      {/* Header Section */}
      <div className="flex items-center space-x-2 border-b pb-2">
        <img src={USTrainer} alt="Trainer Icon" className="w-6 h-6" />
        <h2 className="text-xl font-semibold text-black">My Active Sessions</h2>
      </div>
      <div className="bg-black p-[1px]"></div>

      {/* Trainer List */}
      {TrainersBookingAcceptedData?.length > 0 ? (
        <div className="block gap-4 space-y-2 mt-5">
          {/* Map through each trainer and display their details using TrainerPublicIdCard */}
          {TrainersBookingAcceptedData.map((trainer, index) => (
            <div
              key={index}
              className="flex items-center border border-gray-300 text-black py-3 px-2 "
            >
              <UserProfileTrainerBasicInfo Id={trainer?.trainerId} />

              <div className="px-2">
                <p className="font-semibold">Trainer :</p>
                <p>{trainer?.trainer}</p>
              </div>

              <div>
                <p>
                  {trainer.durationWeeks}{" "}
                  {trainer.durationWeeks === 1 ? "Week" : "Weeks"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // If no trainers are assigned, display a message and provide a link to book a teacher
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

// PropTypes validation to ensure correct data structure
UserProfileTrainers.propTypes = {
  BookedTrainerData: PropTypes.arrayOf(
    PropTypes.shape({
      trainersID: PropTypes.string,
      name: PropTypes.string.isRequired,
      specialization: PropTypes.string,
      experience: PropTypes.number,
      photo: PropTypes.string,
    })
  ).isRequired,
};

export default UserProfileTrainers;
