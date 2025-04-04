import { FaRegUser } from "react-icons/fa";

const TrainerBookingSelectedData = ({ SelectedSessionData }) => {
  const { trainerName, day, time, session } = SelectedSessionData;

  // Convert 24-hour time to 12-hour AM/PM format
  const formatTimeTo12Hour = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const h = parseInt(hour, 10);
    const amPm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour}:${minute} ${amPm}`;
  };

  // Participant Limit Fix
  const participantLimit = session?.participantLimit
    ? String(session?.participantLimit).toLowerCase()
    : "no limit";

  // Class Price
  const classPrice = session?.classPrice
    ? String(session?.classPrice).toLowerCase()
    : "free";
  return (
    <div className="bg-gradient-to-tl from-gray-500/80 to-gray-500/50 p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-black/20 rounded-4xl shadow-lg p-6">
        {/* Title */}
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Selected Session Details
        </h2>

        {/* Trainer and Session Info */}
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6 border-t border-white py-4">
          {/* Trainer and General Session Info */}
          <div className="space-y-3">
            {/* Trainer Name */}
            <div className="text-gray-300 w-2/3 flex justify-between">
              <span className="font-semibold text-white">Trainer:</span>{" "}
              {trainerName}
            </div>

            {/* Day */}
            <div className="text-gray-300 w-2/3 flex justify-between">
              <span className="font-semibold text-white">Day:</span> {day}
            </div>

            {/* Time */}
            <div className="text-gray-300 w-2/3 flex justify-between">
              <span className="font-semibold text-white">Requested Time:</span>{" "}
              {time}
            </div>
          </div>

          {/* Session Specific Details */}
          <div className="space-y-3">
            {/* Class Type */}
            <div className="text-gray-300 w-2/3 flex justify-between">
              <span className="font-semibold text-white">Class Type:</span>{" "}
              {session?.classType}
            </div>

            {/* Participant Limit */}
            <div className="text-gray-300 w-2/3 flex justify-between">
              <span className="font-semibold text-white">
                Participant Limit:
              </span>
              {participantLimit === "no limit" ? (
                "No Limit"
              ) : (
                <div className="flex text-center items-center gap-5">
                  <span className="w-2">{session?.participantLimit}</span>
                  <FaRegUser />
                </div>
              )}
            </div>

            {/* Class Price */}
            <div className="text-gray-300 w-2/3 flex justify-between">
              <span className="font-semibold text-white">Price Per Class:</span>
              {classPrice === "free" ? "Free" : `$ ${session?.classPrice}`}
            </div>
          </div>
        </div>

        {/* Session Timing */}
        <div className="border-t border-white pt-4">
          {/* Title */}
          <h3 className="text-xl text-center font-semibold text-white mb-2">
            Session Timing
          </h3>

          {/* Timing Start & End  */}
          <div className="flex flex-col md:flex-row md:justify-around">
            {/* Start Time */}
            <p className="text-gray-300">
              <span className="font-semibold text-white">Start:</span>{" "}
              {formatTimeTo12Hour(session?.start)}
            </p>

            {/* DividEr */}
            <span className="px-1 lg:px-5">-</span>

            {/* End Time */}
            <p className="text-gray-300">
              <span className="font-semibold text-white">End:</span>{" "}
              {formatTimeTo12Hour(session?.end)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerBookingSelectedData;
