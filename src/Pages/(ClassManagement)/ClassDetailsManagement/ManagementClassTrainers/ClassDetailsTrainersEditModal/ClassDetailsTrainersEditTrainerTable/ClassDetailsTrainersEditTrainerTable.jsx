import { useState } from "react";

// import Packages
import PropTypes from "prop-types";

// Import Icons
import { FaTrash, FaPlus } from "react-icons/fa6";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

// import Hooks
import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";

// import Valid Component
import ValidationMessage from "./ValidationMessage/ValidationMessage";

const ClassDetailsTrainersEditTrainerTable = ({
  setDeleteTrainerError,
  ClassScheduleData,
  TrainerBasicData,
  selectedClass,
  Refetch,
}) => {
  const axiosPublic = useAxiosPublic();

  // Page Control
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // New states for validation feedback and pending add
  const [pendingTrainer, setPendingTrainer] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");
  const [currentTrainerSchedule, setCurrentTrainerSchedule] = useState(null);

  // Sort trainers so that selected trainers appear first in the list
  const sortedTrainerData = [...TrainerBasicData].sort((a, b) => {
    const aSelected = selectedClass?.trainers?.some((t) => t._id === a._id);
    const bSelected = selectedClass?.trainers?.some((t) => t._id === b._id);
    return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
  });

  // Calculate total pages for pagination
  const totalPages = Math.ceil(sortedTrainerData.length / itemsPerPage);

  // Get the trainers for the current page
  const paginatedData = sortedTrainerData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handles adding or removing a trainer from the class
  const handleTrainerAction = async (trainer, isSelected) => {
    try {
      // Restrict adding more than 4 trainers
      if (!isSelected && selectedClass?.trainers?.length >= 4) {
        // If trying to add but already 4 trainers are selected, show error and exit
        setDeleteTrainerError(
          "You can assign a maximum of 4 trainers to this class."
        );
        return;
      }

      // Fetch current schedule of the selected trainer
      const { data: scheduleData } = await axiosPublic.get(
        `/Trainers_Schedule/TrainerId/${trainer._id}`
      );

      // Clean out any previous class assignments of this type from trainer schedule
      const modifiedScheduleData = removeMatchingClassType(
        scheduleData,
        selectedClass?.module
      );

      if (isSelected) {
        // Remove trainer from class

        try {
          // Remove trainer from the class module in backend
          await axiosPublic.put("/Class_Details/trainer", {
            module: selectedClass?.module,
            trainer: { _id: trainer?._id, name: trainer?.name },
            action: "remove",
          });

          // Update trainer’s schedule in backend (cleaned version)
          await axiosPublic.put("/Trainers_Schedule/Update", {
            trainerName: scheduleData.trainerName,
            trainerSchedule: modifiedScheduleData.trainerSchedule,
          });

          // Refresh UI and clean up local states
          Refetch();
          setPendingTrainer(null);
          setValidationMessage("");
          setDeleteTrainerError(null);
          setCurrentTrainerSchedule(null);
        } catch (err) {
          // Catch any failure during remove operation
          console.error("Error removing trainer:", err);
          setDeleteTrainerError("Failed to remove trainer. Please try again.");
        }
      } else {
        // Adding trainer — validate first

        // Store current schedule temporarily
        setCurrentTrainerSchedule(scheduleData);

        // Check if trainer is available for all class times
        const validation = validateTrainerAvailability(
          scheduleData,
          ClassScheduleData
        );

        if (!validation.valid) {
          // Trainer is not fully available — show message
          setValidationMessage(validation.message);
          setPendingTrainer(trainer);
          setDeleteTrainerError(null);
          return;
        }

        // Trainer is valid — clear any previous error states
        setPendingTrainer(null);
        setValidationMessage("");
        setDeleteTrainerError(null);
      }
    } catch (error) {
      // Catch any errors from main try block (network, parsing, etc.)
      setPendingTrainer(null);
      setValidationMessage("");
      setCurrentTrainerSchedule(null);
      console.error("Error during trainer action:", error);
      setDeleteTrainerError(
        "Something went wrong while processing trainer action."
      );
    }
  };

  return (
    <>
      {/* Validation Message & Confirm Buttons */}
      {validationMessage && (
        <ValidationMessage
          setDeleteTrainerError={setDeleteTrainerError}
          setValidationMessage={setValidationMessage}
          scheduleData={currentTrainerSchedule}
          validationMessage={validationMessage}
          setPendingTrainer={setPendingTrainer}
          pendingTrainer={pendingTrainer}
          selectedClass={selectedClass}
          Refetch={Refetch}
        />
      )}

      {/* Trainer Tables */}
      <div className="overflow-x-auto mt-6 px-5 pb-6">
        <table className="min-w-full text-sm text-left border border-gray-400 rounded-md overflow-hidden">
          {/* Table Header */}
          <thead className="bg-gray-300 text-gray-900">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Specialization</th>
              <th className="px-4 py-2">Experience</th>
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2">Available Days</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {paginatedData?.map((trainer, index) => {
              const isSelected = selectedClass?.trainers.some(
                (t) => t._id === trainer._id
              );

              return (
                <tr
                  key={trainer._id}
                  className={`border-t ${
                    isSelected ? "bg-green-100" : "bg-white"
                  }`}
                >
                  {/* Index Number */}
                  <td className="px-4 py-2">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>

                  {/* Avatar */}
                  <td className="px-4 py-2">
                    <img
                      src={trainer.imageUrl}
                      alt={trainer.name}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  </td>

                  {/* Name */}
                  <td className="px-4 py-2 font-semibold">{trainer.name}</td>

                  {/* Specialization */}
                  <td className="px-4 py-2">{trainer.specialization}</td>

                  {/* Esperance */}
                  <td className="px-4 py-2">{trainer.experience} yrs</td>

                  {/* Age */}
                  <td className="px-4 py-2">{trainer.age}</td>

                  {/* Days Active */}
                  <td className="px-4 py-2 text-xs text-gray-700">
                    {trainer.availableDays.join(", ")}
                  </td>

                  {/* Action Button */}
                  <td className="px-4 py-2 text-center">
                    <button
                      className={`text-white px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-2 justify-center cursor-pointer ${
                        isSelected
                          ? "bg-red-600 hover:bg-red-300"
                          : "bg-blue-600 hover:bg-blue-300"
                      }`}
                      onClick={() => handleTrainerAction(trainer, isSelected)}
                    >
                      {isSelected ? (
                        <>
                          <FaTrash className="inline-block" />
                          Remove
                        </>
                      ) : (
                        <>
                          <FaPlus className="inline-block" />
                          Add
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center items-center gap-4">
        <div className="join">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
              currentPage === 1
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-blue-100 text-blue-600"
            }`}
          >
            <FaAnglesLeft />
          </button>
          <span className="join-item h-10 px-5 text-sm flex items-center justify-center border border-gray-300 bg-white text-gray-800 font-semibold">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
              currentPage === totalPages
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-blue-100 text-blue-600"
            }`}
          >
            <FaAnglesRight />
          </button>
        </div>
      </div>
    </>
  );
};

// Prop Validation
ClassDetailsTrainersEditTrainerTable.propTypes = {
  setDeleteTrainerError: PropTypes.func.isRequired,
  ClassScheduleData: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
    })
  ).isRequired,
  TrainerBasicData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      specialization: PropTypes.string,
      experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      availableDays: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  selectedClass: PropTypes.shape({
    module: PropTypes.string,
    trainers: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string,
      })
    ),
  }),
  Refetch: PropTypes.func.isRequired,
};

export default ClassDetailsTrainersEditTrainerTable;

// Converts 24-hour time (e.g., "13:30") to 12-hour format with AM/PM (e.g., "1:30 PM")
const convertTo12Hour = (time24) => {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const amps = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${amps}`;
};

// Validates a trainer's availability for a given class schedule
const validateTrainerAvailability = (
  trainerScheduleData,
  classScheduleData
) => {
  // Arrays to hold unavailable, occupied, and available times
  const unavailableTimes = [];
  const occupiedTimes = [];
  const availableTimes = [];

  // Check each class slot against the trainer's schedule
  for (const classSlot of classScheduleData) {
    const { day, startTime } = classSlot;

    const daySchedule = trainerScheduleData.trainerSchedule?.[day];

    // If no schedule for the day or time, mark as unavailable
    if (!daySchedule || !daySchedule[startTime]) {
      unavailableTimes.push({ day, time: convertTo12Hour(startTime) });
      continue;
    }

    const trainerSlot = daySchedule[startTime];
    // Check if the slot has participants (occupied)
    const hasParticipants =
      trainerSlot.participant &&
      Object.keys(trainerSlot.participant).length > 0;

    if (hasParticipants) {
      occupiedTimes.push({ day, time: convertTo12Hour(startTime) });
    } else {
      availableTimes.push({ day, time: convertTo12Hour(startTime) });
    }
  }

  // If all times are available, return valid
  if (unavailableTimes.length === 0 && occupiedTimes.length === 0) {
    return {
      valid: true,
      message: "Trainer is fully available for this class schedule.",
    };
  }

  // Build the issues message
  const issues = [];

  if (unavailableTimes.length > 0) {
    issues.push(
      `Not available at: ${unavailableTimes
        .map((slot) => `${slot.day} ${slot.time}`)
        .join(", ")}`
    );
  }

  if (occupiedTimes.length > 0) {
    issues.push(
      `Already occupied at: ${occupiedTimes
        .map((slot) => `${slot.day} ${slot.time}`)
        .join(", ")}`
    );
  }

  if (availableTimes.length > 0) {
    issues.push(
      `Available at: ${availableTimes
        .map((slot) => `${slot.day} ${slot.time}`)
        .join(", ")}`
    );
  }

  // Return the validation result and message
  return { valid: false, message: issues.join(" | ") };
};

// Removes the specified class type from a trainer's schedule data
const removeMatchingClassType = (scheduleData, moduleName) => {
  // Build the class type string to remove
  const classToRemove = `${moduleName} Class`;

  // Deep clone the schedule data to avoid mutating the original
  const transformed = JSON.parse(JSON.stringify(scheduleData));

  // Loop through each day in the trainer's schedule
  for (const day in transformed.trainerSchedule) {
    const timeSlots = transformed.trainerSchedule[day];

    // Loop through each time slot for the day
    for (const time in timeSlots) {
      const slot = timeSlots[time];
      // If the slot matches the class type, clear its details
      if (slot.classType === classToRemove) {
        slot.classType = "";
        slot.participantLimit = 0;
        slot.classPrice = 0;
      }
    }
  }

  // Return the updated schedule data
  return transformed;
};
