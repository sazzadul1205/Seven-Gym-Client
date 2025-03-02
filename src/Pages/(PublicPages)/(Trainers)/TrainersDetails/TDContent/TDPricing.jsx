import PropTypes from "prop-types";
import { Link } from "react-router";

const TDPricing = ({ TrainerDetails, TrainerSchedule }) => {
  if (
    !TrainerDetails ||
    !TrainerSchedule ||
    !TrainerSchedule.scheduleWithPrices
  ) {
    return (
      <p className="text-red-500 text-center">
        Pricing or schedule details unavailable.
      </p>
    );
  }

  const schedule = TrainerSchedule?.scheduleWithPrices;

  const getClassButton = (classType, timeStart, day, participants) => {
    const isBooked =
      participants?.length === 1 &&
      ![
        "Group Classes",
        "Online Class",
        "Private Session",
        "Outdoor Class",
        "Partner Workout",
      ].includes(classType);

    if (isBooked) {
      return (
        <button className="border border-gray-400 text-black font-semibold px-3 py-2 rounded-2xl cursor-not-allowed w-full">
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
          to={`/Trainers/Bookings/${TrainerDetails.name}?classType=${classType}&day=${day}&timeStart=${timeStart}`}
          className="w-full"
        >
          <button className="bg-[#F72C5B] text-white px-3 py-2 rounded-2xl hover:bg-[#f72c5b83] w-full">
            Book Session
          </button>
        </Link>
      );
    }

    if (classLinks.free.includes(classType)) {
      return (
        <button className="border border-gray-400 text-black font-semibold px-3 py-2 rounded-2xl cursor-not-allowed w-full">
          Free Class
        </button>
      );
    }

    if (classType === "Break") {
      return (
        <button className="border border-gray-400 text-black font-semibold px-3 py-2 rounded-2xl cursor-not-allowed w-full">
          On a Break
        </button>
      );
    }

    return (
      <Link
        to={`/Classes/${classType.split(" ").slice(0, -1).join(" ")}`}
        className="w-full"
      >
        <button className="bg-green-500 text-white px-3 py-2 rounded-2xl hover:bg-green-600 w-full">
          Visit Class
        </button>
      </Link>
    );
  };

  return (
    <div className="bg-white bg-gradient-to-bl from-gray-200 to-gray-300 px-2 lg:px-6 py-6 mt-8 lg:rounded-2xl shadow-lg">
      {/* Pricing Section */}
      <h2 className="text-2xl font-semibold mb-3">
        {TrainerDetails.name || "Unknown Trainer"} Pricing
      </h2>

      {/* Pricing Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:space-x-5 sm:gap-10">
        {/* Per Session Price */}
        <div className="flex bg-slate-300 font-semibold border border-gray-500 rounded-xl p-3 px-10 gap-5 hover:scale-105 transform transition duration-300 ease-in-out">
          <p>Per Session :</p>
          <p>$ {TrainerDetails.perSession.toFixed(2)}</p>
        </div>

        {/* Monthly Package Price with 20% Discount */}
        <div className="flex bg-slate-300 font-semibold border border-gray-500 rounded-xl p-3 px-10 gap-5 hover:scale-105 transform transition duration-300 ease-in-out">
          <h3 className="font-semibold">Monthly Package ( 28 Days )</h3>
          <p>$ {(TrainerDetails.perSession * 28 * 0.8).toFixed(2)}</p>
        </div>
      </div>

      {/* Weekly Schedule Section */}
      <div className="mt-6 border-t-2 border-black">
        <h2 className="text-2xl font-semibold mb-4 mt-4">Weekly Schedule</h2>
        <div className="accordion flex flex-col">
          {Object.entries(schedule).map(([day, classes]) => (
            <div key={day} className="mb-6 collapse collapse-arrow bg-base-200">
              <input type="radio" name="schedule-accordion" />
              <p className="collapse-title text-xl font-medium">{day}</p>
              <div className="collapse-content">
                {/* Mobile View */}
                <div className="block sm:hidden">
                  {classes.map((classDetails, index) => (
                    <div
                      key={`${day}-${index}`}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } mb-4 p-4 border-b`}
                    >
                      <div className="flex flex-col space-y-2">
                        <div className="font-semibold">
                          {classDetails.timeStart} - {classDetails.timeEnd}
                        </div>
                        <div>{classDetails.classType}</div>
                        <div>
                          {getClassButton(
                            classDetails.classType,
                            classDetails.timeStart,
                            day,
                            classDetails.participants
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View */}
                <div className="hidden sm:block">
                  <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border-b bg-gray-100">Time</th>
                        <th className="px-4 py-2 border-b bg-gray-100">
                          Class Type
                        </th>
                        <th className="px-4 py-2 border-b bg-gray-100">
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
                          <td className="px-4 py-2 text-center">
                            {classDetails.timeStart} - {classDetails.timeEnd}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {classDetails.classType}
                          </td>
                          <td className="px-4 py-2">
                            {getClassButton(
                              classDetails.classType,
                              classDetails.timeStart,
                              day,
                              classDetails.participants
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Prop Validation
TDPricing.propTypes = {
  TrainerDetails: PropTypes.shape({
    name: PropTypes.string.isRequired,
    perSession: PropTypes.number.isRequired,
    monthlyPackage: PropTypes.number.isRequired,
  }).isRequired,
  TrainerSchedule: PropTypes.shape({
    scheduleWithPrices: PropTypes.objectOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          timeStart: PropTypes.string.isRequired,
          timeEnd: PropTypes.string.isRequired,
          classType: PropTypes.string.isRequired,
          participants: PropTypes.array,
        })
      )
    ).isRequired,
  }).isRequired,
};

export default TDPricing;
