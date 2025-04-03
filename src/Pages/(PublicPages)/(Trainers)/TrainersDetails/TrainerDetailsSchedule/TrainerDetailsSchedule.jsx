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
            to={`/Trainers/Bookings/${TrainerDetails?.name}?classType=${classType}&day=${day}&timeStart=${start}`}
          >
            <CommonButton
              text="Book Session"
              bgFromColor="[#c23e5f]"
              bgToColor="[#ff0040] "
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
  if (!TrainerDetails || !TrainerSchedule || !TrainerSchedule.trainerSchedule) {
    return (
      <p className="text-red-500 text-center">
        Pricing or schedule details unavailable.
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-linear-to-bl from-gray-200 to-gray-400 px-2 lg:px-6 py-6 mt-8 lg:rounded-2xl shadow-lg">
      {/* Weekly Schedule Section */}
      <div>
        <h2 className="text-2xl text-black font-semibold pb-3 border-b-2 border-black">
          {TrainerDetails.name || "Unknown Trainer"} Weekly Schedule
        </h2>
        <div className="accordion flex flex-col pt-5">
          {Object.entries(schedule).map(([day, classesObj]) => {
            // Convert the day's classes object into an array
            const classes = Object.values(classesObj);
            return (
              <div
                key={day}
                className="mb-6 collapse collapse-arrow bg-gray-200"
              >
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
                          <div className="font-semibold">
                            {classDetails.start} - {classDetails.end}
                          </div>
                          <div>Class Type: {classDetails.classType}</div>
                          <div>
                            Participant Limit:{" "}
                            {classDetails.participantLimit === "No limit" ||
                            classDetails.participantLimit === "No Limit"
                              ? "No Limit"
                              : classDetails.participantLimit}
                          </div>
                          <div>
                            Price:{" "}
                            {typeof classDetails.classPrice === "string" &&
                            classDetails.classPrice.toLowerCase() === "free"
                              ? "Free"
                              : `$${classDetails.classPrice}`}
                          </div>
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
                    ))}
                  </div>

                  {/* Desktop View */}
                  <div className="hidden sm:block">
                    <table className="table-auto w-full border-collapse text-left border border-gray-300 text-black">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 border-b bg-gray-100">
                            Time
                          </th>
                          <th className="px-4 py-2 border-b bg-gray-100">
                            Class Type
                          </th>
                          <th className="px-4 py-2 border-b bg-gray-100">
                            Participant Limit
                          </th>
                          <th className="px-4 py-2 border-b bg-gray-100">
                            Price
                          </th>
                          <th className="px-4 py-2 border-b bg-gray-100 text-center">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {classes.map((classDetails, index) => (
                          <tr
                            key={`${day}-${index}`}
                            className={`${
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
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
                              {classDetails.participantLimit === "No limit" ||
                              classDetails.participantLimit === "No Limit" ? (
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
                            <td className="px-4 py-2">
                              {typeof classDetails.classPrice === "string" &&
                              classDetails.classPrice.toLowerCase() === "free"
                                ? "Free"
                                : `$ ${classDetails.classPrice}`}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {getClassButton(
                                day,
                                classDetails?.start,
                                classDetails?.classType,
                                classDetails?.participant,
                                classDetails?.participantLimit
                              )}
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
