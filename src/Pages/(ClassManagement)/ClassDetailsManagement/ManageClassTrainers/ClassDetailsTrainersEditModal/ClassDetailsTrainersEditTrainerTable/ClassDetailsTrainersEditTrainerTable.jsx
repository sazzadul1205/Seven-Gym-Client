import { useState } from "react";
import {
  FaAnglesLeft,
  FaAnglesRight,
  FaTriangleExclamation,
} from "react-icons/fa6";

import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";
import { FaCheckCircle, FaInfoCircle, FaTimesCircle } from "react-icons/fa";

const convertTo12Hour = (time24) => {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

const validateTrainerAvailability = (
  trainerScheduleData,
  classScheduleData
) => {
  const unavailableTimes = [];
  const occupiedTimes = [];
  const availableTimes = [];

  for (const classSlot of classScheduleData) {
    const { day, startTime } = classSlot;

    const daySchedule = trainerScheduleData.trainerSchedule?.[day];

    if (!daySchedule || !daySchedule[startTime]) {
      unavailableTimes.push({ day, time: convertTo12Hour(startTime) });
      continue;
    }

    const trainerSlot = daySchedule[startTime];
    const hasParticipants =
      trainerSlot.participant &&
      Object.keys(trainerSlot.participant).length > 0;

    if (hasParticipants) {
      occupiedTimes.push({ day, time: convertTo12Hour(startTime) });
    } else {
      availableTimes.push({ day, time: convertTo12Hour(startTime) });
    }
  }

  if (unavailableTimes.length === 0 && occupiedTimes.length === 0) {
    return {
      valid: true,
      message: "Trainer is fully available for this class schedule.",
    };
  }

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

  return { valid: false, message: issues.join(" | ") };
};

const ClassDetailsTrainersEditTrainerTable = ({
  TrainerBasicData,
  ClassScheduleData,
  selectedClass,
}) => {
  const axiosPublic = useAxiosPublic();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // New states for validation feedback and pending add
  const [validationMessage, setValidationMessage] = useState("");
  const [pendingTrainer, setPendingTrainer] = useState(null);
  const [currentTrainerSchedule, setCurrentTrainerSchedule] = useState(null);

  const handleTrainerAction = async (trainer, isSelected) => {
    if (isSelected) {
      console.log(`Remove ${trainer._id}`);
      setValidationMessage("");
      setPendingTrainer(null);
      setCurrentTrainerSchedule(null); // Clear schedule on removal
    } else {
      try {
        const { data: scheduleData } = await axiosPublic.get(
          `/Trainers_Schedule/TrainerId/${trainer._id}`
        );

        setCurrentTrainerSchedule(scheduleData); // <-- save it to state

        const validation = validateTrainerAvailability(
          scheduleData,
          ClassScheduleData
        );

        if (!validation.valid) {
          setValidationMessage(validation.message);
          setPendingTrainer(trainer);
          return;
        }

        console.log("Trainer can be added:", trainer._id);
        setValidationMessage("");
        setPendingTrainer(null);

        // TODO: Use scheduleData from state if needed
      } catch (error) {
        console.error("Error fetching trainer schedule:", error);
        setValidationMessage("Failed to fetch trainer schedule.");
        setPendingTrainer(null);
        setCurrentTrainerSchedule(null);
      }
    }
  };

  const totalPages = Math.ceil(TrainerBasicData?.length / itemsPerPage);
  const currentData = TrainerBasicData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Validation Message & Confirm Buttons */}
      {validationMessage && (
        <ValidationMessage
          scheduleData={currentTrainerSchedule}
          selectedClass={selectedClass}
          pendingTrainer={pendingTrainer}
          validationMessage={validationMessage}
          setValidationMessage={setValidationMessage}
          setPendingTrainer={setPendingTrainer}
        />
      )}

      {/* Trainer Tables */}
      <div className="overflow-x-auto mt-6 px-5 pb-6">
        <table className="min-w-full text-sm text-left border border-gray-400 rounded-md overflow-hidden">
          <thead className="bg-gray-300 text-gray-900">
            <tr>
              <th className="px-4 py-2 border-r">#</th>
              <th className="px-4 py-2 border-r">Image</th>
              <th className="px-4 py-2 border-r">Name</th>
              <th className="px-4 py-2 border-r">Specialization</th>
              <th className="px-4 py-2 border-r">Experience</th>
              <th className="px-4 py-2 border-r">Age</th>
              <th className="px-4 py-2 border-r">Available Days</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData?.map((trainer, index) => {
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
                  <td className="px-4 py-2 border-r">{index + 1}</td>
                  <td className="px-4 py-2 border-r">
                    <img
                      src={trainer.imageUrl}
                      alt={trainer.name}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  </td>
                  <td className="px-4 py-2 border-r font-semibold">
                    {trainer.name}
                  </td>
                  <td className="px-4 py-2 border-r">
                    {trainer.specialization}
                  </td>
                  <td className="px-4 py-2 border-r">
                    {trainer.experience} yrs
                  </td>
                  <td className="px-4 py-2 border-r">{trainer.age}</td>
                  <td className="px-4 py-2 border-r text-xs text-gray-700">
                    {trainer.availableDays.join(", ")}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className={`text-white px-3 py-1 rounded-md text-xs font-semibold ${
                        isSelected
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                      onClick={() => handleTrainerAction(trainer, isSelected)}
                    >
                      {isSelected ? "Remove" : "Add"}
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

export default ClassDetailsTrainersEditTrainerTable;

// Refined parser for your message format
const parseValidationMessage = (msg) => {
  if (!msg) return [];

  // Split sections by ' | '
  const sections = msg.split(" | ").map((section) => section.trim());

  return sections.map((section) => {
    // Split only on the first colon to separate label and times
    const colonIndex = section.indexOf(":");
    if (colonIndex === -1) return { label: section, times: [] };

    const labelRaw = section.slice(0, colonIndex).trim();
    const timesRaw = section.slice(colonIndex + 1).trim();

    // Normalize label names
    const label = labelRaw
      .replace(/Not available at/i, "Unavailable")
      .replace(/Available at/i, "Available")
      .replace(/Already occupied at/i, "Occupied");

    // Times split by comma, trimmed, no truncation
    const times = timesRaw.length
      ? timesRaw.split(",").map((t) => t.trim())
      : [];

    return { label, times };
  });
};

const ValidationMessage = ({
  scheduleData,
  selectedClass,
  pendingTrainer,
  validationMessage,
  setValidationMessage,
  setPendingTrainer,
}) => {
  const axiosPublic = useAxiosPublic();
  const sections = parseValidationMessage(validationMessage);

  const extractAvailableSlots = (validationMessage) => {
    if (!validationMessage.includes("Available at:")) return [];

    try {
      const [, availablePartRaw] = validationMessage.split("Available at:");
      const availablePart = availablePartRaw.trim();

      const availableList = availablePart.split(", ").map((entry) => {
        const [day, ...timeParts] = entry.trim().split(" ");
        return {
          day,
          time: timeParts.join(" "),
        };
      });

      return availableList;
    } catch (error) {
      console.error("Failed to extract available slots:", error);
      return [];
    }
  };

  // Confirm adding even if validation failed
  const handleAddAnyway = async () => {
    if (!pendingTrainer || !scheduleData?.trainerName) return;

    const availableSlots = extractAvailableSlots(validationMessage);

    const transformScheduleWithAvailableSlots = (
      scheduleData,
      availableSlots,
      className
    ) => {
      const transformed = { ...scheduleData };

      availableSlots.forEach(({ day, time }) => {
        const [hourMin, AMP] = time.split(" ");
        let [hour, minute] = hourMin.split(":").map(Number);

        if (AMP === "PM" && hour !== 12) hour += 12;
        if (AMP === "AM" && hour === 12) hour = 0;

        const time24 = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;

        if (
          transformed.trainerSchedule &&
          transformed.trainerSchedule[day] &&
          transformed.trainerSchedule[day][time24]
        ) {
          transformed.trainerSchedule[day][time24] = {
            ...transformed.trainerSchedule[day][time24],
            classType: className,
            participantLimit: 0,
            classPrice: 0,
          };
        }
      });

      return transformed.trainerSchedule;
    };

    const updatedSchedule = transformScheduleWithAvailableSlots(
      scheduleData,
      availableSlots,
      `${selectedClass?.module} Class`
    );

    const updateTrainerSchedulePayload = {
      trainerName: scheduleData.trainerName,
      trainerSchedule: updatedSchedule,
    };

    // Step 2: Add trainer to class
    const payload = {
      module: selectedClass?.module,
      trainer: { _id: pendingTrainer?._id, name: pendingTrainer?.name },
      action: "add",
    };

    try {
      console.log("Trainer schedule payload:", updateTrainerSchedulePayload);
      console.log("Class update payload:", payload);

      await axiosPublic.put("/Class_Details/trainer", payload);

      await axiosPublic.put(
        "/Trainers_Schedule/Update",
        updateTrainerSchedulePayload
      );
    } catch (error) {
      console.error(
        "Failed to complete operation:",
        error.response?.data || error.message
      );
    }

    setValidationMessage("");
    setPendingTrainer(null);
  };

  // Cancel add after validation error
  const handleCancelAdd = () => {
    setValidationMessage("");
    setPendingTrainer(null);
  };

  return (
    <div
      className="mb-6 p-5 bg-blue-50 border-l-4 border-blue-400 rounded shadow-sm text-blue-800 mx-auto"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start space-x-3">
        <span className="flex-shrink-0 h-6 w-6 text-blue-500 mt-1">
          <FaInfoCircle className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <p className="mb-2 text-lg font-semibold">Notice</p>
          <div className="mb-4 leading-relaxed flex gap-10 flex-wrap">
            {sections.map(({ label, times }, idx) => {
              const isAvailable = label.toLowerCase() === "available";
              const isUnavailable =
                label.toLowerCase() === "unavailable" ||
                label.toLowerCase() === "occupied";

              return (
                <div key={idx} className="mb-3 min-w-[200px]">
                  <p className="font-semibold mb-1">{label}:</p>
                  {times.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-sm list-none">
                      {times.map((time, i) => (
                        <li
                          key={i}
                          className="whitespace-nowrap flex items-center gap-1"
                        >
                          {isAvailable && (
                            <FaCheckCircle className="text-green-500" />
                          )}
                          {isUnavailable && (
                            <FaTimesCircle className="text-red-500" />
                          )}
                          <span>{time}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="italic text-gray-600 text-sm">None</p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAddAnyway}
              className="inline-flex items-center justify-center px-5 py-2 rounded-md bg-blue-600 text-white font-semibold shadow-md transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Add Anyway
            </button>
            <button
              onClick={handleCancelAdd}
              className="inline-flex items-center justify-center px-5 py-2 rounded-md bg-gray-300 text-gray-800 font-semibold shadow-md transition-colors hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
            >
              Don&apos;t Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
