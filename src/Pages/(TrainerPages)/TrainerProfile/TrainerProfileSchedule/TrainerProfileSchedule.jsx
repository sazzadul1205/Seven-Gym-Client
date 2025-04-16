// Import Packages
import PropTypes from "prop-types";

// import Icons
import { FaRegUser } from "react-icons/fa";

const TrainerProfileSchedule = ({ TrainerDetails, TrainerSchedule }) => {
  // Return null if TrainerDetails or TrainerSchedule are missing
  if (!TrainerDetails || !TrainerSchedule) return null;

  // Use a fallback for trainerSchedule object
  const scheduleObj = TrainerSchedule.trainerSchedule || {};

  // Convert 24-hour time to 12-hour AM/PM format
  const formatTimeTo12Hour = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const h = parseInt(hour, 10);
    const amPm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour}:${minute} ${amPm}`;
  };

  return (
    <div className="relative max-w-7xl mx-auto bg-linear-to-bl from-gray-200 to-gray-400 px-2 lg:px-6 py-6 mt-8 lg:rounded-2xl shadow-lg">
      {/* Trainer Schedule Header */}
      <h2 className="text-2xl text-black font-semibold pb-3 border-b-2 border-black">
        {TrainerDetails?.name || "Unknown Trainer"} Weekly Schedule
      </h2>

      {/* Schedule Accordion */}
      <div className="accordion flex flex-col pt-5">
        {Object.entries(scheduleObj).map(([day, classesObj]) => {
          // Convert the day's classes object into an array
          const classes = Object.values(classesObj);
          return (
            <div key={day} className="mb-6 collapse collapse-arrow bg-gray-200">
              <input type="radio" name="schedule-accordion" />
              <p className="collapse-title text-xl text-black font-medium">
                {day}
              </p>
              <div className="collapse-content">
                {/* Mobile View */}
                <div className="block sm:hidden">
                  {classes.map((classDetails, index) => (
                    <div
                      key={`${day}-${index}`}
                      className={`text-black text-center ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } mb-4 p-4 border-b`}
                    >
                      <div className="flex flex-col space-y-2">
                        {/* Time Range */}
                        <div className="font-semibold">
                          <span className="w-20">
                            {formatTimeTo12Hour(classDetails.start)}
                          </span>
                          <span className="px-5">-</span>
                          <span className="w-20">
                            {formatTimeTo12Hour(classDetails.end)}
                          </span>
                        </div>
                        {/* Class Type */}
                        <div>Class Type: {classDetails.classType}</div>
                        {/* Participant Limit */}
                        <div>
                          Participant Limit:{" "}
                          {classDetails.participantLimit === "No limit" ||
                          classDetails.participantLimit === "No Limit"
                            ? "No Limit"
                            : classDetails.participantLimit}
                        </div>
                        {/* Price */}
                        <div>
                          Price:{" "}
                          {typeof classDetails.classPrice === "string" &&
                          classDetails.classPrice.toLowerCase() === "free"
                            ? "Free"
                            : `$${classDetails.classPrice}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View */}
                <div className="hidden sm:block">
                  <table className="table-auto w-full border-collapse text-left border border-gray-300 text-black">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border-b bg-gray-100">Time</th>
                        <th className="px-4 py-2 border-b bg-gray-100">
                          Class Type
                        </th>
                        <th className="px-4 py-2 border-b bg-gray-100">
                          Participant Limit
                        </th>
                        <th className="px-4 py-2 border-b bg-gray-100">
                          Price
                        </th>
                      </tr>
                    </thead>
                    {/* Table Body with Class Details */}
                    {/* Using index as key for simplicity, but ideally use a unique identifier */}
                    <tbody>
                      {classes.map((classDetails, index) => (
                        <tr
                          key={`${day}-${index}`}
                          className={`${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } border-b`}
                        >
                          {/* Time Range */}
                          <td className="flex px-4 py-3">
                            <span className="w-20">
                              {formatTimeTo12Hour(classDetails.start)}
                            </span>
                            <span className="px-5">-</span>
                            <span className="w-20">
                              {formatTimeTo12Hour(classDetails.end)}
                            </span>
                          </td>

                          {/* Class Type */}
                          <td className="px-4 py-2">
                            {classDetails.classType}
                          </td>

                          {/* Participant Limit */}
                          <td className="px-4 py-2">
                            {classDetails.participantLimit === "No limit" ||
                            classDetails.participantLimit === "No Limit" ? (
                              "No Limit"
                            ) : (
                              <div className="flex items-center gap-5 justify-between w-[60px]">
                                <FaRegUser />
                                <p> {classDetails.participantLimit}</p>
                              </div>
                            )}
                          </td>

                          {/* Price */}
                          <td className="px-4 py-2">
                            {typeof classDetails.classPrice === "string" &&
                            classDetails.classPrice.toLowerCase() === "free"
                              ? "Free"
                              : `$ ${classDetails.classPrice}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

TrainerProfileSchedule.propTypes = {
  TrainerDetails: PropTypes.shape({
    name: PropTypes.string,
    perSession: PropTypes.number,
    monthlyPackage: PropTypes.number,
  }),
  TrainerSchedule: PropTypes.shape({
    trainerSchedule: PropTypes.objectOf(
      PropTypes.objectOf(
        PropTypes.shape({
          start: PropTypes.string.isRequired,
          end: PropTypes.string.isRequired,
          classType: PropTypes.string.isRequired,
          participant: PropTypes.array, // <- FIXED THIS LINE
          participantLimit: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
          ]).isRequired,
          classPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        })
      )
    ),
  }),
};

export default TrainerProfileSchedule;
