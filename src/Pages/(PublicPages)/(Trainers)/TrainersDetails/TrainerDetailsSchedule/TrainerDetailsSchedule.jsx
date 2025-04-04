import { Link } from "react-router";
import PropTypes from "prop-types";
import { FaRegUser } from "react-icons/fa";
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

const TrainerDetailsSchedule = ({ TrainerDetails, TrainerSchedule }) => {
  // Use the trainerSchedule property
  const schedule = TrainerSchedule.trainerSchedule;

  // Button renderer for each class slot
  const getClassButton = (
    day,
    start,
    classType,
    participant,
    participantLimit
  ) => {
    const isBooked =
      participant?.length >= participantLimit &&
      ![
        "Group Classes",
        "Online Class",
        "Private Session",
        "Outdoor Class",
        "Partner Workout",
      ].includes(classType);

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

    if (classType === "Break") {
      return (
        <div className="flex justify-center items-center">
          <CommonButton
            text="In Break"
            bgFromColor="gray-400"
            bgToColor="gray-400"
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

    if (isBooked) {
      return (
        <div className="flex justify-center items-center">
          <CommonButton
            text="Fully Booked"
            bgFromColor="gray-400"
            bgToColor="gray-400"
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

    if (classLinks.includes(classType)) {
      return (
        <div className="flex justify-center items-center">
          <Link
            to={`/Trainers/Booking/${TrainerDetails?.name}?classType=${classType}&day=${day}&timeStart=${start}`}
          >
            <CommonButton
              text="Book Session"
              bgFromColor="[#c23e5f]"
              bgToColor="[#ff0040]"
              bgColor="green"
              borderRadius="rounded-xl"
              px="px-0"
              py="py-2"
              width="[250px]"
            />
          </Link>
        </div>
      );
    }

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

  // If Data Unavailable use this
  if (!TrainerDetails || !TrainerSchedule) {
    return (
      <p className="text-red-500 text-center">
        Pricing or schedule details unavailable.
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-linear-to-bl from-gray-200 to-gray-400 px-2 lg:px-6 py-6 mt-8 lg:rounded-2xl shadow-lg">
      {/* Schedule Title */}
      <h2 className="text-xl md:text-2xl text-center md:text-left text-black font-semibold pb-3 border-b-2 border-black">
        {TrainerDetails.name || "Unknown Trainer"}&apos;s Weekly Schedule
      </h2>

      {/* Schedule Data */}
      <div className="accordion flex flex-col pt-5">
        {Object.entries(schedule).map(([day, classesObj]) => {
          return (
            <div key={day} className="mb-6 collapse collapse-arrow bg-gray-200">
              <input type="radio" name="schedule-accordion" />
              {/* Day Title */}
              <h3 className="collapse-title text-xl font-semibold text-black">
                {day}
              </h3>

              {/* Content Accordion Collapse */}
              <div className="collapse-content">
                {/* Desktop View */}
                <div className="hidden sm:block">
                  <table className="table-auto w-full border-collapse text-left border border-gray-300 text-black mt-4">
                    {/* Table Header */}
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border-b bg-gray-200">Time</th>
                        <th className="px-4 py-2 border-b bg-gray-200">
                          Class Type
                        </th>
                        <th className="px-4 py-2 border-b bg-gray-200">
                          Participant Limit
                        </th>
                        <th className="px-4 py-2 border-b bg-gray-200">
                          Price
                        </th>
                        <th className="px-4 py-2 border-b bg-gray-200 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>

                    {/* Table Content */}
                    <tbody>
                      {Object.entries(classesObj).map(
                        ([index, classDetails]) => {
                          // Participant Limit Fix
                          const participantLimit = classDetails.participantLimit
                            ? String(
                                classDetails.participantLimit
                              ).toLowerCase()
                            : "no limit";

                          // Class Price
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
                              {/* Time */}
                              <td className="flex px-4 py-3">
                                <span className="w-16 md:w-20 text-center">
                                  {formatTimeTo12Hour(classDetails.start)}
                                </span>
                                <span className="px-1 lg:px-5">-</span>
                                <span className="w-16 md:w-20 text-center">
                                  {formatTimeTo12Hour(classDetails.end)}
                                </span>
                              </td>

                              {/* Class Type */}
                              <td className="px-4 py-2">
                                {classDetails.classType}
                              </td>

                              {/* Participant */}
                              <td className="px-4 py-2">
                                {participantLimit === "no limit" ? (
                                  "No Limit"
                                ) : (
                                  <div className="flex text-center items-center gap-5">
                                    <span className="w-5">
                                      {classDetails.participantLimit}
                                    </span>
                                    <FaRegUser />
                                  </div>
                                )}
                              </td>

                              {/* Price */}
                              <td className="px-4 py-2">
                                {classPrice === "free"
                                  ? "Free"
                                  : `$ ${classDetails.classPrice}`}
                              </td>

                              {/* Buttons */}
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

                {/* Mobile View */}
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
                            <span>
                              {formatTimeTo12Hour(classDetails?.start)}
                            </span>
                            <span className="px-5">-</span>
                            <span>{formatTimeTo12Hour(classDetails?.end)}</span>
                          </div>

                          {/* Class Type */}
                          <div className="flex justify-between items-center pt-2">
                            <p className="font-bold">Class Type:</p>{" "}
                            {classDetails?.classType}
                          </div>

                          {/* Participant */}
                          <div className="flex justify-between items-center">
                            <p className="font-bold">Participant Limit:</p>{" "}
                            {participantLimit === "no limit"
                              ? "No Limit"
                              : classDetails?.participantLimit}
                          </div>

                          {/* Price */}
                          <div className="flex justify-between items-center">
                            <p className="font-bold">Price:</p>{" "}
                            {classPrice === "free"
                              ? "Free"
                              : `$${classDetails?.classPrice}`}
                          </div>

                          {/* Buttons */}
                          <div className="flex justify-center ">
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
          participant: PropTypes.object,
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
