// Import Packages
import PropTypes from "prop-types";

// Import Icons
import { FaRegUser } from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";
import { BiArrowToTop } from "react-icons/bi";

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

// Allowed class types
const AllowedClassTypes = [
  "Group Class",
  "Private Session",
  "Open Gym Class",
  "Semi-Private Training",
  "Online Class",
  "Drop-In Class",
  "Group Classes",
  "Private Training",
  "Partner Workout",
  "Workshops",
  "Outdoor Class",
  "Private Sessions",
];

const AllSessions = ({ AllSessionData, listedSessions, setListedSessions }) => {
  // Check if AllSessionData is an object and has the required properties
  const scheduleData = AllSessionData?.trainerSchedule || {};

  // Check if scheduleData is an object and has the required properties
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
    <div
      className="bg-gradient-to-t from-gray-500/80 to-gray-500/50 py-5"
      id="all-schedule-section"
    >
      <div className="max-w-7xl mx-auto py-5 px-4 bg-white/80 rounded-xl">
        {/* Header */}
        <div className="flex justify-between items-center py-1">
          <h2 className="text-lg font-semibold text-black">
            All Sessions for This Week
          </h2>
          <button
            className="bg-blue-500 hover:bg-blue-600 rounded-full p-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <BiArrowToTop className="text-white" />
          </button>
        </div>

        {/* Divider */}
        <div className="p-[1px] bg-black mb-4"></div>

        {/* Weekly Schedule */}
        <div className="accordion space-y-2">
          {Object.entries(scheduleData).map(([day, classesObj]) => (
            <div
              key={day}
              className="collapse collapse-arrow bg-gradient-to-bl from-gray-100 to-gray-300 rounded-lg shadow"
            >
              <input type="radio" name="schedule-accordion" />

              {/* Day Title */}
              <h3 className="collapse-title text-xl font-semibold text-black">
                {day}
              </h3>

              {/* Collapse Content */}
              <div className="collapse-content">
                {/* Desktop View */}
                <div className="hidden md:flex">
                  {/* Table for Desktop View */}
                  <table className="table-auto w-full border-collapse text-left border border-gray-300 text-black">
                    {/* Table Headers */}
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border-b bg-gray-300">Day</th>
                        <th className="px-4 py-2 border-b bg-gray-300">
                          Class Type
                        </th>
                        <th className="px-4 py-2 border-b bg-gray-300 text-center">
                          Participant Limit
                        </th>
                        <th className="px-4 py-2 border-b bg-gray-300 text-center">
                          Time
                        </th>
                        <th className="px-4 py-2 border-b bg-gray-300 text-center">
                          Price
                        </th>
                        <th className="px-4 py-2 border-b bg-gray-300 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>

                    {/* Table Rows */}
                    <tbody>
                      {Object.entries(classesObj).map(
                        ([time, classDetails]) => {
                          // Check if classDetails is an object and has the required properties
                          const isListed = isSessionListed(classDetails?.id);

                          // Check if Allowed Class Types include classType
                          const isAllowedType = AllowedClassTypes.includes(
                            classDetails?.classType
                          );

                          // Check if classPrice is a number or string
                          const classPrice = classDetails.classPrice
                            ? String(classDetails.classPrice).toLowerCase()
                            : "free";

                          // Check if classPrice is a number or string
                          const participantLimit = classDetails.participantLimit
                            ? String(
                                classDetails.participantLimit
                              ).toLowerCase()
                            : "no limit";

                          return (
                            <tr
                              key={`${day}-${time}`}
                              className={`${
                                isAllowedType
                                  ? isListed
                                    ? "bg-gray-400"
                                    : "bg-gray-50 hover:bg-gray-200"
                                  : "bg-red-200"
                              } `}
                            >
                              {/* Day */}
                              <td className="px-4 py-2 text-left align-middle">
                                {day}
                              </td>

                              {/* Class Type */}
                              <td className="px-4 py-2 text-left align-middle">
                                {classDetails.classType || "N/A"}
                              </td>

                              {/* Participant Limit */}
                              <td className="px-4 py-2 text-center align-middle">
                                {isAllowedType ? (
                                  participantLimit === "no limit" ? (
                                    "No Limit"
                                  ) : (
                                    <div className="flex justify-center items-center gap-2">
                                      <span className="w-5">
                                        {classDetails.participantLimit}
                                      </span>
                                      <FaRegUser />
                                    </div>
                                  )
                                ) : (
                                  "-"
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
                                {isAllowedType
                                  ? classPrice === "free"
                                    ? "Free"
                                    : `$ ${classDetails.classPrice}`
                                  : "-"}
                              </td>

                              {/* Action Button */}
                              <td className="px-4 py-2 text-center align-middle">
                                {/* Buttons for adding session */}
                                {isAllowedType ? (
                                  // If the session is allowed, show the appropriate button
                                  isListed ? (
                                    <CommonButton
                                      icon={<MdLibraryAdd />}
                                      iconSize="text-lg"
                                      bgColor="gray"
                                      px="px-4"
                                      py="py-2"
                                      disabled={true}
                                    />
                                  ) : (
                                    <CommonButton
                                      icon={<MdLibraryAdd />}
                                      iconSize="text-lg"
                                      bgColor="green"
                                      px="px-4"
                                      py="py-2"
                                      clickEvent={() =>
                                        handleAddSession(classDetails)
                                      }
                                    />
                                  )
                                ) : (
                                  // If the session is not allowed, show a disabled button or nothing
                                  <CommonButton
                                    icon={<MdLibraryAdd />}
                                    iconSize="text-lg"
                                    bgColor="gray"
                                    px="px-4"
                                    py="py-2"
                                    disabled={true}
                                  />
                                )}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="flex md:hidden text-black flex-col space-y-4 mb-6">
                  {Object.values(classesObj).map((classDetails, index) => {
                    // Check if classDetails is an object and has the required properties
                    const isListed = isSessionListed(classDetails?.id);

                    // Check if Allowed Class Types include classType
                    const isAllowedType = AllowedClassTypes.includes(
                      classDetails?.classType
                    );

                    // Check if classPrice is a number or string
                    const classPrice = classDetails.classPrice
                      ? String(classDetails.classPrice).toLowerCase()
                      : "free";

                    return (
                      <div
                        key={`mobile-${classDetails.id}-${index}`}
                        className={`${
                          isAllowedType
                            ? isListed
                              ? "bg-gray-400"
                              : "bg-gray-50 hover:bg-gray-200"
                            : "bg-red-200"
                        } p-3 `}
                      >
                        <div className="flex flex-col space-y-2">
                          {/* Day & Time */}
                          <div className="flex justify-between font-semibold">
                            <p>{classDetails.day}</p>[{" "}
                            <span>
                              {formatTimeTo12Hour(classDetails.start)}
                            </span>
                            <span className="px-1">-</span>
                            <span>
                              {formatTimeTo12Hour(classDetails.end)}
                            </span>{" "}
                            ]
                          </div>

                          {/* Divider */}
                          <div className="p-[1px] bg-gray-300"></div>

                          {/* Class Type */}
                          <div className="flex justify-between items-center pt-2">
                            <p className="font-bold">Class Type:</p>
                            {classDetails.classType || "N/A"}
                          </div>

                          {/* Participant Limit */}
                          <div className="flex justify-between items-center">
                            <p className="font-bold">Participant Limit:</p>
                            {classDetails.participantLimit
                              ? classDetails.participantLimit
                              : "No Limit"}
                          </div>

                          {/* Price */}
                          <div className="flex justify-between items-center">
                            <p className="font-bold">Price:</p>
                            {classPrice === "free"
                              ? "Free"
                              : `$${classDetails.classPrice}`}
                          </div>

                          {/* Action Button */}
                          <div className="flex justify-center mt-3">
                            {/* Buttons for adding session */}
                            {isAllowedType ? (
                              // If the session is allowed, show the appropriate button
                              isListed ? (
                                <CommonButton
                                  icon={<MdLibraryAdd />}
                                  iconSize="text-lg"
                                  bgColor="gray"
                                  width="full"
                                  py="py-2"
                                  disabled={true}
                                />
                              ) : (
                                <CommonButton
                                  icon={<MdLibraryAdd />}
                                  iconSize="text-lg"
                                  bgColor="green"
                                  width="full"
                                  py="py-2"
                                  clickEvent={() =>
                                    handleAddSession(classDetails)
                                  }
                                />
                              )
                            ) : (
                              // If the session is not allowed, show a disabled button or nothing
                              <CommonButton
                                icon={<MdLibraryAdd />}
                                iconSize="text-lg"
                                bgColor="gray"
                                width="full"
                                py="py-2"
                                disabled={true}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

AllSessions.propTypes = {
  AllSessionData: PropTypes.shape({
    trainerSchedule: PropTypes.objectOf(
      PropTypes.objectOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          day: PropTypes.string,
          start: PropTypes.string,
          end: PropTypes.string,
          classType: PropTypes.string,
          participantLimit: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
          ]),
          classPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        })
      )
    ),
  }),
  listedSessions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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

export default AllSessions;
