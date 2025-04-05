// Import Packages
import PropTypes from "prop-types";

// Import Icons
import { FaRegUser } from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";

// Import Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Convert 24-hour time to 12-hour AM/PM format
const formatTimeTo12Hour = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const h = parseInt(hour, 10);
  const amPm = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 === 0 ? 12 : h % 12;
  return `${formattedHour}:${minute} ${amPm}`;
};

const SameClassTypeWeekClass = ({
  SameClassTypeData,
  listedSessions,
  setListedSessions,
}) => {
  // Handle adding a session to the listed sessions
  const handleAddSession = (session) => {
    const sessionData = {
      day: session.day,
      time: session.start,
      id: session.id,
      classType: session.classType,
      participant: {},
      participantLimit: session.participantLimit || 0,
      classPrice: session.classPrice || 0,
      start: session.start,
      end: session.end,
    };

    setListedSessions((prev) => [...prev, sessionData]);
  };

  // Check if session is already in listedSessions
  const isSessionListed = (id) => {
    return listedSessions.some((session) => session.id === id);
  };

  return (
    <div className="bg-gradient-to-t from-gray-500/80 to-gray-500/50 py-5">
      <div className="max-w-7xl mx-auto items-center py-5 px-4 bg-white/80 rounded-xl">
        {/* Title */}
        <h2 className="flex items-center text-xl font-bold text-black pb-2 gap-2">
          Same Class Type Schedule for This Week
        </h2>

        {/* Divider */}
        <div className="p-[1px] bg-black"></div>

        {/* Original Schedule Section */}
        <div className="pt-1 text-black">
          {SameClassTypeData.length > 0 ? (
            <table className="table-auto w-full border-collapse text-left border border-gray-300 text-black">
              {/* Table Header */}
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b bg-gray-300">Day</th>
                  <th className="px-4 py-2 border-b bg-gray-300">Class Type</th>
                  <th className="px-4 py-2 border-b bg-gray-300 text-center">
                    Participant Limit
                  </th>
                  <th className="px-4 py-2 border-b bg-gray-300 text-center">
                    Time
                  </th>
                  <th className="px-4 py-2 border-b bg-gray-300 text-center">
                    Price Per Session
                  </th>
                  <th className="px-4 py-2 border-b bg-gray-300">Action</th>
                </tr>
              </thead>

              {/* Table Content */}
              <tbody>
                {SameClassTypeData.map((classDetails, index) => {
                  // Check if classPrice is a number or string
                  const classPrice = classDetails.classPrice
                    ? String(classDetails.classPrice).toLowerCase()
                    : "free";

                  // Check if classPrice is a number or string
                  const participantLimit = classDetails.participantLimit
                    ? String(classDetails.participantLimit).toLowerCase()
                    : "no limit";

                  // Get the current day of the class
                  const currentDay = classDetails.day;

                  // Check if the next class is on a different day
                  const nextDay = SameClassTypeData[index + 1]?.day;

                  // Determine if the current class is the last of the day
                  const isLastOfDay = currentDay !== nextDay;

                  // Check if the session is already listed
                  const isListed = isSessionListed(classDetails.id);

                  return (
                    <tr
                      key={`listed-${classDetails.id}-${index}`}
                      className={`${
                        isListed
                          ? "bg-gray-400"
                          : "bg-gray-50 hover:bg-gray-200"
                      } ${isLastOfDay ? "border-b-2 border-gray-200" : ""}`}
                    >
                      {/* Day */}
                      <td className="px-4 py-2 text-left align-middle">
                        {classDetails.day || "N/A"}
                      </td>

                      {/* Class Type */}
                      <td className="px-4 py-2 text-left align-middle">
                        {classDetails.classType || "N/A"}
                      </td>

                      {/* Participant Limit */}
                      <td className="px-4 py-2 text-center align-middle">
                        {participantLimit === "no limit" ? (
                          "No Limit"
                        ) : (
                          <div className="flex justify-center items-center gap-2">
                            <span className="w-5">
                              {classDetails.participantLimit}
                            </span>
                            <FaRegUser />
                          </div>
                        )}
                      </td>

                      {/* Time */}
                      <td className="px-4 py-2 text-center align-middle">
                        <div className="flex items-center justify-center gap-2">
                          <p className="w-16 md:w-20">
                            {formatTimeTo12Hour(classDetails.start)}
                          </p>
                          <span>-</span>
                          <p className="w-16 md:w-20">
                            {formatTimeTo12Hour(classDetails.end)}
                          </p>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-2 text-center align-middle">
                        {classPrice === "free"
                          ? "Free"
                          : `$ ${classDetails.classPrice}`}
                      </td>

                      {/* Action Button */}
                      <td className="px-4 py-2 text-center align-middle">
                        {isListed ? (
                          <CommonButton
                            icon={<MdLibraryAdd />}
                            iconSize="text-lg"
                            bgColor="gray"
                            px="px-4"
                            py="py-2"
                            disabled={true}
                            clickEvent={() => handleAddSession(classDetails)}
                          />
                        ) : (
                          <CommonButton
                            icon={<MdLibraryAdd />}
                            iconSize="text-lg"
                            bgColor="green"
                            px="px-4"
                            py="py-2"
                            clickEvent={() => handleAddSession(classDetails)}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">
              No schedule Booked yet. Please select a session.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Prop Type Validation
SameClassTypeWeekClass.propTypes = {
  SameClassTypeData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      day: PropTypes.string,
      start: PropTypes.string,
      end: PropTypes.string,
      classType: PropTypes.string,
      classPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      participantLimit: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    })
  ).isRequired,
  listedSessions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      day: PropTypes.string,
      time: PropTypes.string,
      classType: PropTypes.string,
      participant: PropTypes.object,
      participantLimit: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      classPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      start: PropTypes.string,
      end: PropTypes.string,
    })
  ).isRequired,
  setListedSessions: PropTypes.func.isRequired,
};

export default SameClassTypeWeekClass;
