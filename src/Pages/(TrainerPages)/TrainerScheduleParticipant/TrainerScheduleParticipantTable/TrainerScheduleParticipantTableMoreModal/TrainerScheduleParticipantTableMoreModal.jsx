import PropTypes from "prop-types";
import { ImCross } from "react-icons/im";
import { GoDotFill } from "react-icons/go";
import { formatDate } from "../../../../../Utility/formatDate";
import TrainerBookingRequestUserBasicInfo from "../../../TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

const TrainerScheduleParticipantTableMoreModal = ({
  selectedCellParticipants = [],
}) => {
  const handleClose = () => {
    document
      .getElementById("Trainer_Schedule_Participant_Table_More_Modal")
      ?.close();
  };

  return (
    <div className="modal-box p-0 bg-gradient-to-b from-white to-gray-200 text-black w-full max-w-2xl sm:rounded-md shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-4 py-3 sm:px-5 sm:py-4">
        <h3 className="font-bold text-base sm:text-lg">All Participants</h3>
        <ImCross
          className="text-lg sm:text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={handleClose}
        />
      </div>

      {/* Body */}
      <div className="max-h-[400px] overflow-y-auto p-3 sm:p-4 space-y-4">
        {selectedCellParticipants.length > 0 ? (
          selectedCellParticipants.map((participant, index) => (
            <div
              key={participant.bookingReqID || index}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-md shadow-sm border ${
                participant.paid ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <GoDotFill
                  className={`text-sm ${
                    participant.paid ? "text-green-600" : "text-red-600"
                  }`}
                />
                <span className="text-sm font-medium break-all">
                  <TrainerBookingRequestUserBasicInfo
                    email={participant.bookerEmail}
                  />
                </span>
              </div>

              <div className="text-xs sm:text-sm flex flex-col sm:flex-row sm:gap-6 text-gray-700">
                <span>
                  <strong>Accepted:</strong>{" "}
                  {formatDate(participant?.acceptedAt)}
                </span>
                <span
                  className={`font-semibold ${
                    participant.paid ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {participant.paid ? "Paid" : "Unpaid"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center italic text-gray-500">
            No participants found.
          </p>
        )}
      </div>
    </div>
  );
};

// 🧾 Type Checking
TrainerScheduleParticipantTableMoreModal.propTypes = {
  selectedCellParticipants: PropTypes.arrayOf(
    PropTypes.shape({
      bookerEmail: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      bookingReqID: PropTypes.string,
      acceptedAt: PropTypes.string,
      paid: PropTypes.bool.isRequired,
    })
  ),
};

export default TrainerScheduleParticipantTableMoreModal;
