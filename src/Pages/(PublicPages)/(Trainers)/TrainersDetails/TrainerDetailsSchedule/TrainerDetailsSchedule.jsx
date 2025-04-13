import { Link, useNavigate } from "react-router";

// Import Packages
import PropTypes from "prop-types";

// Import Icons
import { FaRegUser } from "react-icons/fa";

// Import Components
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Import Utility
import { formatTimeTo12Hour } from "../../../../../Utility/formatTimeTo12Hour";

// Class Data
const classLinks = [
  "Private Training",
  "Group Classes",
  "Online Class",
  "Drop-In Class",
  "Group Class",
  "Private Session",
  "Open Gym Class",
  "Semi-Private Training",
  "Workshops",
  "Outdoor Class",
  "Private Sessions",
  "Partner Workout",
];

// Main TrainerDetailsSchedule Component
const TrainerDetailsSchedule = ({ TrainerDetails, TrainerSchedule }) => {
  const navigate = useNavigate();

  // Extract the schedule data from props
  const schedule = TrainerSchedule?.trainerSchedule;

  // Handle click to book a session
  const handleClick = (classType, day, start) => {
    navigate(
      `/Trainers/Booking/${TrainerDetails?.name}?classType=${classType}&day=${day}&timeStart=${start}`
    );
  };

  // Renders booking button based on class state
  const getClassButton = (
    day,
    start,
    classType,
    participant,
    participantLimit
  ) => {
    const FullSession = participant.length == participantLimit;

    // Break button
    if (classType === "Break") {
      return (
        <div className="flex justify-center items-center">
          <CommonButton
            text="In Break"
            bgColor="gray"
            borderRadius="rounded-xl"
            disabled={true}
            px="px-0"
            py="py-2"
            width="[250px]"
            cursorStyle="cursor-not-allowed"
          />
        </div>
      );
    }

    //  Session full for any classType
    if (FullSession) {
      return (
        <div className="flex justify-center items-center">
          <CommonButton
            text="Session Full"
            bgColor="gray"
            borderRadius="rounded-xl"
            disabled={true}
            px="px-0"
            py="py-2"
            width="[250px]"
            cursorStyle="cursor-not-allowed"
          />
        </div>
      );
    }

    // Bookable session
    if (classLinks.includes(classType)) {
      return (
        <div className="flex justify-center items-center">
          <CommonButton
            text="Book Session"
            bgColor="OriginalRed"
            borderRadius="rounded-xl"
            px="px-0"
            py="py-2"
            width="[250px]"
            clickEvent={() => handleClick(classType, day, start)}
          />
        </div>
      );
    }

    // Visit class button
    return (
      <div className="flex justify-center items-center">
        <Link to={`/Classes/${classType.split(" ").slice(0, -1).join(" ")}`}>
          <CommonButton
            text="Visit Class"
            bgColor="green"
            borderRadius="rounded-xl"
            px="px-0"
            py="py-2"
            width="[250px]"
          />
        </Link>
      </div>
    );
  };

  // Show fallback if no data available
  if (!TrainerDetails || !TrainerSchedule) {
    return (
      <p className="text-red-500 text-center">
        Pricing or schedule details unavailable.
      </p>
    );
  }

  // Main Render Section
  return (
    <div className="max-w-7xl mx-auto bg-linear-to-bl from-gray-200 to-gray-400 px-2 lg:px-6 py-6 mt-8 lg:rounded-2xl shadow-lg">
      {/* Title */}
      <h2 className="text-xl md:text-2xl text-center md:text-left text-black font-semibold pb-3 border-b-2 border-black">
        {TrainerDetails.name || "Unknown Trainer"}&apos;s Weekly Schedule
      </h2>

      {/* Accordion-based Schedule Display */}
      <div className="accordion flex flex-col pt-5">
        {Object.entries(schedule).map(([day, classesObj]) => {
          return (
            <div key={day} className="mb-6 collapse collapse-arrow bg-gray-200">
              <input type="radio" name="schedule-accordion" />

              {/* Day Title */}
              <h3 className="collapse-title text-xl font-semibold text-black">
                {day}
              </h3>

              {/* Weekly Schedule */}
              <div className="collapse-content">
                {/* Weekly Schedule : Desktop View */}
                <div className="hidden sm:block">
                  <table className="table-auto w-full border-collapse text-left border border-gray-300 text-black mt-4">
                    {/* Table Headers */}
                    <thead className="border-b bg-gray-200">
                      <tr>
                        <th className="px-4 py-2">Time</th>
                        <th className="px-4 py-2">Class Type</th>
                        <th className="px-4 py-2">Participant Limit</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2 text-center">Action</th>
                      </tr>
                    </thead>

                    {/* Table Rows */}
                    <tbody>
                      {Object.entries(classesObj).map(
                        ([index, classDetails]) => {
                          const participantLimit = classDetails.participantLimit
                            ? String(
                                classDetails.participantLimit
                              ).toLowerCase()
                            : "no limit";

                          const classPrice = classDetails.classPrice
                            ? String(classDetails.classPrice).toLowerCase()
                            : "free";

                          return (
                            <tr
                              key={`${day}-${index}`}
                              className={`${
                                index % 2 === 0 ? "bg-gray-200" : "bg-white"
                              } border-b`}
                            >
                              {/* Time Range */}
                              <td className="flex px-4 py-3 text-center">
                                {formatTimeTo12Hour(classDetails.start)} -{" "}
                                {formatTimeTo12Hour(classDetails.end)}
                              </td>

                              {/* Class Type */}
                              <td className="px-4 py-2">
                                {classDetails.classType}
                              </td>

                              {/* Participant Limit */}
                              <td className="px-4 py-2">
                                {classLinks.includes(classDetails.classType) ? (
                                  participantLimit === "no limit" ? (
                                    "No Limit"
                                  ) : (
                                    <div className="flex text-center items-center gap-5">
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

                              {/* Class Price */}
                              <td className="px-4 py-2">
                                {classLinks.includes(classDetails.classType)
                                  ? classPrice === "free"
                                    ? "Free"
                                    : `$ ${classDetails.classPrice}`
                                  : "-"}
                              </td>

                              {/* Action Button */}
                              <td className="flex justify-center items-center px-4 py-2 gap-2">
                                {getClassButton(
                                  day,
                                  classDetails?.start,
                                  classDetails?.classType,
                                  classDetails?.participant,
                                  classDetails?.participantLimit
                                )}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Weekly Schedule : Mobile View */}
                <div className="block sm:hidden">
                  {Object.entries(classesObj).map(([index, classDetails]) => {
                    const participantLimit = classDetails.participantLimit
                      ? String(classDetails.participantLimit).toLowerCase()
                      : "no limit";

                    const classPrice = classDetails.classPrice
                      ? String(classDetails.classPrice).toLowerCase()
                      : "free";

                    return (
                      <div
                        key={`${day}-${index}`}
                        className={`text-black text-center ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } mb-4 p-4 border-b`}
                      >
                        <div className="flex flex-col space-y-2">
                          {/* Time */}
                          <div className="font-semibold">
                            {formatTimeTo12Hour(classDetails.start)} -{" "}
                            {formatTimeTo12Hour(classDetails.end)}
                          </div>

                          {/* Class Type */}
                          <div className="flex justify-between items-center pt-2">
                            <p className="font-bold">Class Type:</p>
                            {classDetails?.classType}
                          </div>

                          {/* Participant Limit */}
                          <div className="flex justify-between items-center">
                            <p className="font-bold">Participant Limit:</p>
                            {classLinks.includes(classDetails.classType)
                              ? participantLimit === "no limit"
                                ? "No Limit"
                                : classDetails?.participantLimit
                              : "-"}
                          </div>

                          {/* Class Price */}
                          <div className="flex justify-between items-center">
                            <p className="font-bold">Price:</p>
                            {classLinks.includes(classDetails.classType)
                              ? classPrice === "free"
                                ? "Free"
                                : `$${classDetails?.classPrice}`
                              : "-"}
                          </div>

                          {/* Button */}
                          <div className="flex justify-center">
                            {getClassButton(
                              day,
                              classDetails?.start,
                              classDetails?.classType,
                              classDetails?.participant,
                              classDetails?.participantLimit
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

TrainerDetailsSchedule.propTypes = {
  TrainerDetails: PropTypes.shape({
    name: PropTypes.string.isRequired,
    perSession: PropTypes.number.isRequired,
    monthlyPackage: PropTypes.number.isRequired,
  }),
  TrainerSchedule: PropTypes.shape({
    trainerSchedule: PropTypes.objectOf(
      PropTypes.objectOf(
        PropTypes.shape({
          start: PropTypes.string.isRequired,
          end: PropTypes.string.isRequired,
          classType: PropTypes.string.isRequired,
          participant: PropTypes.oneOfType([
            PropTypes.object, // handles { userId1: {}, userId2: {} }
            PropTypes.arrayOf(PropTypes.object), // handles [{}, {}]
          ]),
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

export default TrainerDetailsSchedule;
