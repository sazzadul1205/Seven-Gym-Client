import { useState } from "react";

// Import Package
import PropTypes from "prop-types";

// Import Icons
import {
  FaEdit,
  FaRegEnvelope,
  FaRegTrashAlt,
  FaRegUser,
} from "react-icons/fa";

// Import Modal
import TrainerScheduleEditModal from "./TrainerScheduleEditModal/TrainerScheduleEditModal";

// Convert 24-hour time to 12-hour AM/PM format
const formatTimeTo12Hour = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const h = parseInt(hour, 10);
  const amPm = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 === 0 ? 12 : h % 12;
  return `${formattedHour}:${minute} ${amPm}`;
};

const TrainerScheduleDisplay = ({
  handleClear,
  tempSchedule,
  isValidClassType,
  TrainersClassType,
  handleUpdate,
}) => {
  // State to manage selected class for editing
  const [selectedClass, setSelectedClass] = useState(null);

  // Function to handle the edit action
  const handleEdit = (day, time) => {
    setSelectedClass({ day, time, ...tempSchedule[day][time] });
    document.getElementById("Trainer_Schedule_Edit_Modal").showModal();
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Iterate over each day of the schedule */}
      {Object.entries(tempSchedule).map(([day, classesObj]) => {
        return (
          <div
            key={day}
            className="bg-linear-to-bl from-gray-100 to-gray-300 p-4 rounded-lg shadow"
          >
            {/* Display the day of the week */}
            <h3 className="text-xl font-semibold text-black">{day}</h3>

            {/* Display List */}
            <div className="hidden sm:block">
              {/* Display Title */}
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

                {/* Display ContentS */}
                <tbody>
                  {Object.entries(classesObj).map(([time, classDetails]) => (
                    <tr
                      key={`${day}-${time}`}
                      className={`border-b ${
                        classDetails.edited ? "bg-yellow-100" : "bg-gray-50"
                      }`}
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
                      <td className="px-4 py-2">{classDetails.classType}</td>

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

                      {/* Action Buttons */}
                      <td className="flex px-4 py-2 gap-2">
                        {/* If classType is cleared (empty), show edit button */}
                        {classDetails.classType === "" ? (
                          <button
                            className="bg-linear-to-bl hover:bg-linear-to-tr from-yellow-300 to-yellow-600 text-white rounded-full p-2 cursor-pointer"
                            onClick={() => handleEdit(day, time)}
                          >
                            <FaEdit />
                          </button>
                        ) : isValidClassType(classDetails.classType) ? (
                          // If valid class type, show clear and edit buttons
                          <>
                            <button
                              className="bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-600 text-white rounded-full p-2 cursor-pointer"
                              onClick={() => handleClear(day, time)}
                            >
                              <FaRegTrashAlt />
                            </button>
                            <button
                              className="bg-linear-to-bl hover:bg-linear-to-tr from-yellow-300 to-yellow-600 text-white rounded-full p-2 cursor-pointer"
                              onClick={() => handleEdit(day, time)}
                            >
                              <FaEdit />
                            </button>
                          </>
                        ) : (
                          // If non-empty but invalid, show envelope icon
                          <button
                            className="bg-linear-to-bl hover:bg-linear-to-tr from-green-300 to-green-600 text-white rounded-full p-2 cursor-pointer"
                            onClick={() => handleEdit(day, time)}
                          >
                            <FaRegEnvelope />
                          </button>
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

      {/* Edit modal for class details */}
      <dialog id="Trainer_Schedule_Edit_Modal" className="modal">
        <TrainerScheduleEditModal
          tempSchedule={tempSchedule}
          handleUpdate={handleUpdate}
          selectedClass={selectedClass}
          TrainersClassType={TrainersClassType}
        />
      </dialog>
    </div>
  );
};

// Prop types for TrainerScheduleDisplay component
TrainerScheduleDisplay.propTypes = {
  handleClear: PropTypes.func.isRequired,
  tempSchedule: PropTypes.object.isRequired,
  isValidClassType: PropTypes.func.isRequired,
  TrainersClassType: PropTypes.array,
  handleUpdate: PropTypes.func.isRequired,
};

export default TrainerScheduleDisplay;
