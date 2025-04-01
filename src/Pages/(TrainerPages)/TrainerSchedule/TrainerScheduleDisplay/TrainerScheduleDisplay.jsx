import { useState } from "react";

// Import Packages
import PropTypes from "prop-types";

// import Icons
import {
  FaEdit,
  FaRegEnvelope,
  FaRegTrashAlt,
  FaRegUser,
} from "react-icons/fa";

// import Modal
import TrainerScheduleEditModal from "./TrainerScheduleEditModal/TrainerScheduleEditModal";

const TrainerScheduleDisplay = ({
  handleClear,
  tempSchedule,
  isValidClassType,
  TrainersClassType,
  formatTimeTo12Hour,
}) => {
  const [selectedClass, setSelectedClass] = useState(null);

  const handleEdit = (day, time) => {
    setSelectedClass({ day, time, ...tempSchedule[day][time] });
    document.getElementById("Trainer_Schedule_Edit_Modal").showModal();
  };

  return (
    <div className="mt-6 space-y-6">
      {Object.entries(tempSchedule).map(([day, classesObj]) => {
        return (
          <div
            key={day}
            className="bg-linear-to-bl from-gray-100 to-gray-300 p-4 rounded-lg shadow"
          >
            <h3 className="text-xl font-semibold text-black">{day}</h3>

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
                  {Object.entries(classesObj).map(([time, classDetails]) => (
                    <tr key={`${day}-${time}`} className="border-b bg-gray-50">
                      <td className="flex px-4 py-3">
                        <span className="w-20">
                          {formatTimeTo12Hour(classDetails.start)}
                        </span>
                        <span className="px-5">-</span>
                        <span className="w-20">
                          {formatTimeTo12Hour(classDetails.end)}
                        </span>
                      </td>
                      <td className="px-4 py-2">{classDetails.classType}</td>
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
                      <td className="px-4 py-2">
                        {typeof classDetails.classPrice === "string" &&
                        classDetails.classPrice.toLowerCase() === "free"
                          ? "Free"
                          : `$${classDetails.classPrice}`}
                      </td>
                      <td className="flex px-4 py-2 gap-2">
                        {isValidClassType(classDetails.classType) ? (
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
                          <button className="bg-linear-to-bl hover:bg-linear-to-tr from-green-300 to-green-600 text-white rounded-full p-2 cursor-pointer">
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

      <dialog id="Trainer_Schedule_Edit_Modal" className="modal">
        <TrainerScheduleEditModal
          tempSchedule={tempSchedule}
          selectedClass={selectedClass}
          TrainersClassType={TrainersClassType}
        />
      </dialog>
    </div>
  );
};

// PropTypes for TrainerScheduleDisplay component
TrainerScheduleDisplay.propTypes = {
  handleClear: PropTypes.func.isRequired,
  tempSchedule: PropTypes.object.isRequired,
  isValidClassType: PropTypes.func.isRequired,
  TrainersClassType: PropTypes.array,
  formatTimeTo12Hour: PropTypes.func.isRequired,
};

export default TrainerScheduleDisplay;
