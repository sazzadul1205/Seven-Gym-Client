/* eslint-disable react/prop-types */
import { Link } from "react-router";

const TDPricing = ({ TrainerDetails, TrainerSchedule }) => {
  const schedule = TrainerSchedule.scheduleWithPrices;

  const getClassButton = (classType, timeStart, day, participants) => {
    // If the class is a non-group class and has exactly one participant
    if (
      participants?.length === 1 &&
      ![
        "Group Classes",
        "Online Class",
        "Private Session",
        "Outdoor Class",
        "Partner Workout",
      ].includes(classType)
    ) {
      return (
        <div className="flex mx-auto w-[180px]">
          <button className="border border-gray-400 text-black font-semibold px-3 py-2 rounded-2xl cursor-not-allowed w-full">
            Booked
          </button>
        </div>
      );
    }

    // For group classes and other paid classes
    switch (classType) {
      case "Group Classes":
      case "Online Class":
      case "Outdoor Class":
      case "Partner Workout":
      case "Private Session":
      case "Private Training":
      case "Semi-Private Training":
      case "Workshops":
        return (
          <Link
            to={`/Trainers/Bookings/${TrainerDetails.name}?classType=${classType}&day=${day}&timeStart=${timeStart}`}
            className="flex mx-auto w-[180px]"
          >
            <button className="bg-[#F72C5B] text-white px-3 py-2 rounded-2xl hover:bg-[#f72c5b83] w-full">
              Book Session
            </button>
          </Link>
        );
      case "Drop-In Class":
      case "Open Gym Class":
        return (
          <div className="flex mx-auto w-[180px]">
            <button className="border border-gray-400 text-black font-semibold px-3 py-2 rounded-2xl cursor-not-allowed w-full">
              Free Class
            </button>
          </div>
        );
      case "Break":
        return (
          <div className="flex mx-auto w-[180px]">
            <button className="border border-gray-400 text-black font-semibold px-3 py-2 rounded-2xl cursor-not-allowed w-full">
              On a Break
            </button>
          </div>
        );
      default:
        return (
          <div className="flex mx-auto w-[180px]">
            <Link
              to={`/Classes/${classType.split(" ").slice(0, -1).join(" ")}`}
              className="w-full"
            >
              <button className="bg-green-500 text-white px-3 py-2 rounded-2xl hover:bg-green-600 w-full">
                Visit Class
              </button>
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="bg-white px-2 lg:px-6 py-6 mt-8 lg:rounded-2xl-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-3">Pricing</h2>
      <div className="flex flex-col sm:flex-row justify-between sm:space-x-5 sm:gap-10">
        <div className="mb-4 flex text-xl gap-5 bg-gray-300 px-10 py-2 w-full sm:w-auto">
          <h3 className="font-semibold">Per Session</h3>
          <p>${TrainerDetails.perSession}</p>
        </div>
        <div className="mb-4 flex text-xl gap-5 bg-gray-300 px-10 py-2 w-full sm:w-auto">
          <h3 className="font-semibold">Monthly Package</h3>
          <p>${TrainerDetails.monthlyPackage}</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4 mt-4">Weekly Schedule</h2>

      {Object.entries(schedule).map(([day, classes]) => (
        <div key={day} className="mb-6 collapse collapse-arrow bg-base-200">
          <input type="radio" name="schedule-accordion" />
          <p className="collapse-title text-xl font-medium">{day}</p>
          <div className="collapse-content">
            {/* Mobile view: Stacked layout */}
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

            {/* Desktop view: Table layout */}
            <div className="hidden sm:block">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b bg-gray-100">Time</th>
                    <th className="px-4 py-2 border-b bg-gray-100">
                      Class Type
                    </th>
                    <th className="px-4 py-2 border-b bg-gray-100">Action</th>
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
  );
};

export default TDPricing;
