import { Link } from "react-router";

// Import Packages
import PropTypes from "prop-types";

// Import Icons
import USTrainer from "../../../../assets/UserProfile/USTrainer.png";

// Component Import
import UserProfileTrainerBasicInfo from "./UserProfileTrainerBasicInfo/UserProfileTrainerBasicInfo";

// Import Buttons
import CommonButton from "../../../../Shared/Buttons/CommonButton";

const UserProfileTrainers = ({ TrainersBookingAcceptedData }) => {
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
              className="bg-white rounded-2xl shadow-md p-5 mb-6 hover:shadow-lg transition-shadow duration-300"
            >
              <Link to={`/Trainers/${trainer?.trainer}`}>
                <div className="flex flex-col sm:flex-row items-center sm:items-start">
                  {/* Trainer avatar / name */}
                  <UserProfileTrainerBasicInfo
                    Id={trainer?.trainerId}
                    className="w-16 h-16 rounded-full"
                  />

                  {/* Details */}
                  <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col md:flex-row gap-1 md:gap-9 text-center md:text-left  text-black">
                    {/* trainer & Start */}
                    <div>
                      {/* trainer */}
                      <h3 className="text-xl font-semibold text-gray-900">
                        {trainer?.trainer || "Unknown Trainer"}
                      </h3>

                      {/* Start Date */}
                      <p>
                        <span className="font-medium">Start Date:</span>{" "}
                        <span>{trainer?.startAt}</span>
                      </p>
                    </div>

                    {/* Duration & Sessions */}
                    <div>
                      {/* Duration */}
                      <p>
                        <span className="font-medium">Duration:</span>{" "}
                        <span>
                          {trainer?.durationWeeks}{" "}
                          {trainer?.durationWeeks === 1 ? "Week" : "Weeks"}
                        </span>
                      </p>

                      {/* Sessions */}
                      <p>
                        <span className="font-medium">Sessions:</span>{" "}
                        <span>{trainer?.sessions.length}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        // If no trainers are assigned, display a message and provide a link to book a teacher
        <div className="flex flex-col items-center space-y-4 pt-4">
          <p className="text-gray-600 text-lg">No trainers assigned yet.</p>
          <Link to="/Trainers">
            <CommonButton
              text="Book Teacher"
              bgColor="blue"
              px="px-10"
              isLoading={false}
              width="auto"
            />
          </Link>
        </div>
      )}
    </div>
  );
};

UserProfileTrainers.propTypes = {
  TrainersBookingAcceptedData: PropTypes.arrayOf(
    PropTypes.shape({
      trainerId: PropTypes.string.isRequired,
      trainer: PropTypes.string.isRequired,
      startAt: PropTypes.string,
      durationWeeks: PropTypes.number.isRequired,
      sessions: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ),
};

export default UserProfileTrainers;
