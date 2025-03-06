import { Link } from "react-router";
import PropTypes from "prop-types";
import { FaRegUser } from "react-icons/fa";

const TrainerDetailsSchedule = ({ TrainerDetails, TrainerSchedule }) => {
  if (!TrainerDetails || !TrainerSchedule || !TrainerSchedule.trainerSchedule) {
    return (
      <p className="text-red-500 text-center">
        Pricing or schedule details unavailable.
      </p>
    );
  }

  // Use the trainerSchedule property
  const schedule = TrainerSchedule.trainerSchedule;

  // Button renderer for each class slot
  const getClassButton = (classType, start, day, participant) => {
    const isBooked =
      participant?.length === 1 &&
      ![
        "Group Classes",
        "Online Class",
        "Private Session",
        "Outdoor Class",
        "Partner Workout",
      ].includes(classType);

    if (isBooked) {
      return (
        <button className="border border-gray-400 text-black font-semibold px-3 py-2 rounded-2xl cursor-not-allowed w-full mx-auto">
          Booked
        </button>
      );
    }

    const classLinks = {
      bookable: [
        "Group Classes",
        "Online Class",
        "Outdoor Class",
        "Partner Workout",
        "Private Session",
        "Private Training",
        "Semi-Private Training",
        "Workshops",
        "Group Class",
      ],
      free: ["Drop-In Class", "Open Gym Class"],
    };

    if (classLinks.bookable.includes(classType)) {
      return (
        <Link
          to={`/Trainers/Bookings/${TrainerDetails.name}?classType=${classType}&day=${day}&timeStart=${start}`}
        >
          <button className="bg-linear-to-bl hover:bg-linear-to-tr from-[#d1234f] to-[#fc003f] w-[200px] py-3 text-xl font-semibold text-white rounded-3xl shadow-lg hover:shadow-2xl">
            Book Session
          </button>
        </Link>
      );
    }

    if (classLinks.free.includes(classType)) {
      return (
        <button className="border border-gray-400 text-black font-semibold px-3 py-2 rounded-2xl cursor-not-allowed w-full md:w-2/3 mx-auto">
          Free Class
        </button>
      );
    }

    if (classType === "Break") {
      return (
        <button className="bg-linear-to-bl hover:bg-linear-to-tr from-gray-500 to-gray-400 w-[200px] py-3 text-xl font-semibold text-white rounded-3xl shadow-lg hover:shadow-2xl">
          On a Break
        </button>
      );
    }

    return (
      <Link
        to={`/Classes/${classType.split(" ").slice(0, -1).join(" ")}`}
        className="w-full"
      >
        <button className="bg-linear-to-bl hover:bg-linear-to-tr from-green-600 to-green-400 w-[200px] py-3 text-xl font-semibold text-white rounded-3xl shadow-lg hover:shadow-2xl">
          Visit Class
        </button>
      </Link>
    );
  };

  return (
    <div className="max-w-7xl mx-auto bg-linear-to-bl from-gray-200 to-gray-400 px-2 lg:px-6 py-6 mt-8 lg:rounded-2xl shadow-lg">
      {/* Weekly Schedule Section */}
      <div className="">
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
                          <div className="flex justify-center">
                            {getClassButton(
                              classDetails.classType,
                              classDetails.start,
                              day,
                              classDetails.participant
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
                            <td className="px-4 py-2">
                              {classDetails.start} - {classDetails.end}
                            </td>
                            <td className="px-4 py-2">
                              {classDetails.classType}
                            </td>
                            <td className="px-4 py-2">
                              {classDetails.participantLimit === "No limit" ||
                              classDetails.participantLimit === "No Limit" ? (
                                "No Limit"
                              ) : (
                                <div className="flex items-center gap-5">
                                  {classDetails.participantLimit}
                                  <FaRegUser />
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-2">
                              {typeof classDetails.classPrice === "string" &&
                              classDetails.classPrice.toLowerCase() === "free"
                                ? "Free"
                                : `$${classDetails.classPrice}`}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {getClassButton(
                                classDetails.classType,
                                classDetails.start,
                                day,
                                classDetails.participant
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
  }).isRequired,
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
    ).isRequired,
  }).isRequired,
};

export default TrainerDetailsSchedule;
