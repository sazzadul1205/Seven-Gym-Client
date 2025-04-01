// import Icons
import {
  FaEdit,
  FaRegEnvelope,
  FaRegTrashAlt,
  FaRegUser,
} from "react-icons/fa";

const TrainerScheduleDisplay = ({
  handleClear,
  tempSchedule,
  isValidClassType,
  formatTimeTo12Hour,
}) => {
  return (
    <div className="mt-6 space-y-6">
      {Object.entries(tempSchedule).map(([day, classesObj]) => {
        const classes = Object.values(classesObj);
        return (
          <div
            key={day}
            className="bg-linear-to-bl from-gray-100 to-gray-300 p-4 rounded-lg shadow"
          >
            {/* Day Header */}
            <h3 className="text-xl font-semibold text-black">{day}</h3>

            {/* Mobile View */}
            <div className="block sm:hidden">
              {classes.map((classDetails, index) => (
                <div
                  key={`${day}-${index}`}
                  className={`text-black text-center ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } mt-3 p-4 rounded border`}
                >
                  <p className="font-semibold">
                    {classDetails.start} - {classDetails.end}
                  </p>
                  <p>Class Type: {classDetails.classType}</p>
                  <p>
                    Participant Limit:{" "}
                    {classDetails.participantLimit === "No limit" ||
                    classDetails.participantLimit === "No Limit"
                      ? "No Limit"
                      : classDetails.participantLimit}
                  </p>
                  <p>
                    Price:{" "}
                    {typeof classDetails.classPrice === "string" &&
                    classDetails.classPrice.toLowerCase() === "free"
                      ? "Free"
                      : `$${classDetails.classPrice}`}
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block">
              <table className="table-auto w-full border-collapse text-left border border-gray-300 text-black mt-4">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b bg-gray-200">Time</th>
                    <th className="px-4 py-2 border-b bg-gray-200">
                      Class Type
                    </th>
                    <th className="px-4 py-2 border-b bg-gray-200">
                      Participant Limit
                    </th>
                    <th className="px-4 py-2 border-b bg-gray-200">Price</th>
                    <th className="px-4 py-2 border-b bg-gray-200">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {/* Map through classes for the day */}
                  {Object.entries(classesObj).map(([time, classDetails]) => (
                    <tr key={`${day}-${time}`} className="border-b bg-gray-50">
                      {/* Time Column */}
                      <td className="flex px-4 py-3">
                        <span className="w-20">
                          {formatTimeTo12Hour(classDetails.start)}
                        </span>
                        <span className="px-5">-</span>
                        <span className="w-20">
                          {formatTimeTo12Hour(classDetails.end)}
                        </span>
                      </td>

                      {/* Class Type Colum */}
                      <td className="px-4 py-2">{classDetails.classType}</td>

                      {/* Participant Limit Column */}
                      <td className="px-4 py-2">
                        {classDetails.participantLimit === "No limit" ||
                        classDetails.participantLimit === "No Limit" ? (
                          "No Limit"
                        ) : (
                          <div className="flex items-center gap-5">
                            <span>{classDetails.participantLimit}</span>
                            <FaRegUser />
                          </div>
                        )}
                      </td>

                      {/* Price Column */}
                      <td className="px-4 py-2">
                        {typeof classDetails.classPrice === "string" &&
                        classDetails.classPrice.toLowerCase() === "free"
                          ? "Free"
                          : `$${classDetails.classPrice}`}
                      </td>

                      {/* Action Column */}
                      <td className="flex px-4 py-2 gap-2">
                        {isValidClassType(classDetails.classType) ? (
                          <>
                            {/* Clear Button (Only if classType is valid) */}
                            <button
                              className="bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-600 text-white rounded-full p-2 cursor-pointer"
                              onClick={() => handleClear(day, time)}
                            >
                              <FaRegTrashAlt />
                            </button>

                            {/* Edit Button (Only if classType is valid) */}
                            <button className="bg-linear-to-bl hover:bg-linear-to-tr from-yellow-300 to-yellow-600 text-white rounded-full p-2 cursor-pointer">
                              <FaEdit />
                            </button>
                          </>
                        ) : tempSchedule[day]?.[time]?.classType === "" ? (
                          <>
                            {/* Edit Button (Only if recently cleared) */}
                            <button className="bg-linear-to-bl hover:bg-linear-to-tr from-yellow-300 to-yellow-600 text-white rounded-full p-2 cursor-pointer">
                              <FaEdit />
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Message Button (If classType is missing or invalid) */}
                            <button className="bg-linear-to-bl hover:bg-linear-to-tr from-green-300 to-green-600 text-white rounded-full p-2 cursor-pointer">
                              <FaRegEnvelope />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrainerScheduleDisplay;
