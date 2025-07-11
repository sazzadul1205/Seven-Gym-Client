import { useState } from "react";

// Import Packages
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

// import Utility
import { formatTimeTo12Hour } from "../../../../Utility/formatTimeTo12Hour";

const TrainerScheduleDisplay = ({
  handleClear,
  tempSchedule,
  handleUpdate,
  ClassTypesData,
  TrainersClassType,
}) => {
  const [selectedClass, setSelectedClass] = useState(null);

  const isValidClassType = (type) =>
    ClassTypesData.some((item) => item.classType === type);

  // Handle Edit
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
            className="bg-gradient-to-bl from-gray-100 to-gray-300 border border-gray-400 p-4 rounded-lg shadow"
          >
            {/* Day Header */}
            <h3 className="text-xl font-semibold text-black">{day}</h3>

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
                    <th className="px-4 py-2 border-b bg-gray-200">Price</th>
                    <th className="px-4 py-2 border-b bg-gray-200">Action</th>
                  </tr>
                </thead>

                {/* Table Content */}
                <tbody>
                  {Object.entries(classesObj).map(([time, classDetails]) => {
                    // Participant Limit Fix
                    const participantLimit = classDetails.participantLimit
                      ? String(classDetails.participantLimit).toLowerCase()
                      : "no limit";

                    // Class Price
                    const classPrice = classDetails.classPrice
                      ? String(classDetails.classPrice).toLowerCase()
                      : "free";

                    return (
                      <tr
                        key={`${day}-${time}`}
                        className={`border-b ${
                          classDetails.edited ? "bg-yellow-100" : "bg-gray-50"
                        }`}
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
                        <td className="px-4 py-2">{classDetails.classType}</td>

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
                            : `$${classDetails.classPrice}`}
                        </td>

                        {/* Buttons */}
                        <td className="flex px-4 py-2 gap-2">
                          {classDetails.classType === "" ? (
                            <button
                              className="bg-yellow-500 hover:bg-yellow-700 text-white rounded-full p-2 cursor-pointer"
                              onClick={() => handleEdit(day, time)}
                            >
                              <FaEdit />
                            </button>
                          ) : isValidClassType(classDetails.classType) ? (
                            <>
                              <button
                                className="bg-red-500 hover:bg-red-700 text-white rounded-full p-2 cursor-pointer"
                                onClick={() => handleClear(day, time)}
                              >
                                <FaRegTrashAlt />
                              </button>
                              <button
                                className="bg-yellow-500 hover:bg-yellow-700 text-white rounded-full p-2 cursor-pointer"
                                onClick={() => handleEdit(day, time)}
                              >
                                <FaEdit />
                              </button>
                            </>
                          ) : (
                            <button
                              className="bg-green-500 hover:bg-green-700 text-white rounded-full p-2 cursor-pointer"
                              onClick={() => handleEdit(day, time)}
                            >
                              <FaRegEnvelope />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="block sm:hidden mt-4">
              {Object.entries(classesObj).map(([time, classDetails]) => {
                const participantLimit = classDetails.participantLimit
                  ? String(classDetails.participantLimit).toLowerCase()
                  : "no limit";

                const classPrice = classDetails.classPrice
                  ? String(classDetails.classPrice).toLowerCase()
                  : "free";

                return (
                  <div
                    key={`${day}-${time}`}
                    className={`text-black text-center p-4 border border-gray-500 mb-1 ${
                      classDetails.edited ? "bg-yellow-100" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-col space-y-2">
                      {/* Time */}
                      <div className="font-semibold">
                        <span>{formatTimeTo12Hour(classDetails?.start)}</span>
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
                      <div className="flex justify-center gap-2 mt-2">
                        {classDetails.classType === "" ? (
                          <button
                            className="bg-yellow-500 text-white rounded-full p-2"
                            onClick={() => handleEdit(day, time)}
                          >
                            <FaEdit />
                          </button>
                        ) : isValidClassType(classDetails.classType) ? (
                          <>
                            <button
                              className="bg-red-500 text-white rounded-full p-2"
                              onClick={() => handleClear(day, time)}
                            >
                              <FaRegTrashAlt />
                            </button>
                            <button
                              className="bg-yellow-500 text-white rounded-full p-2"
                              onClick={() => handleEdit(day, time)}
                            >
                              <FaEdit />
                            </button>
                          </>
                        ) : (
                          <button
                            className="bg-green-500 text-white rounded-full p-2"
                            onClick={() => handleEdit(day, time)}
                          >
                            <FaRegEnvelope />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Edit modal */}
      <dialog id="Trainer_Schedule_Edit_Modal" className="modal">
        <TrainerScheduleEditModal
          tempSchedule={tempSchedule}
          handleUpdate={handleUpdate}
          selectedClass={selectedClass}
          TrainersClassType={TrainersClassType}
          ClassInformation={ClassTypesData}
        />
      </dialog>
    </div>
  );
};

TrainerScheduleDisplay.propTypes = {
  handleClear: PropTypes.func.isRequired,
  tempSchedule: PropTypes.objectOf(
    PropTypes.objectOf(
      PropTypes.shape({
        start: PropTypes.string,
        end: PropTypes.string,
        classType: PropTypes.string,
        participantLimit: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),
        classPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        edited: PropTypes.bool,
      })
    )
  ).isRequired,

  TrainersClassType: PropTypes.arrayOf(PropTypes.string),

  handleUpdate: PropTypes.func.isRequired,

  ClassTypesData: PropTypes.arrayOf(
    PropTypes.shape({
      classType: PropTypes.string.isRequired,
    })
  ),
};

export default TrainerScheduleDisplay;
