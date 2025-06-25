// Import icons
import { FaCheckCircle, FaInfoCircle, FaTimesCircle } from "react-icons/fa";

// import Hook
import useAxiosPublic from "../../../../../../../Hooks/useAxiosPublic";

// Import Shared
import CommonButton from "../../../../../../../Shared/Buttons/CommonButton";

// import Packages
import PropTypes from "prop-types";

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
  setDeleteTrainerError,
  setValidationMessage,
  setPendingTrainer,
  validationMessage,
  pendingTrainer,
  selectedClass,
  scheduleData,
  Refetch,
}) => {
  const axiosPublic = useAxiosPublic();
  const sections = parseValidationMessage(validationMessage);

  // Extracts available slots from a validation message string.
  const extractAvailableSlots = (validationMessage) => {
    // If the message does not contain 'Available at:', return an empty array.
    if (!validationMessage.includes("Available at:")) return [];

    try {
      // Split the message to get the part after 'Available at:'
      const [, availablePartRaw] = validationMessage.split("Available at:");
      const availablePart = availablePartRaw.trim();

      // Split the available part by comma, then extract day and time for each entry.
      const availableList = availablePart.split(", ").map((entry) => {
        const [day, ...timeParts] = entry.trim().split(" ");
        return {
          day,
          time: timeParts.join(" "),
        };
      });

      // Return the list of available slots as objects with day and time.
      return availableList;
    } catch (error) {
      // Log and return an empty array if parsing fails.
      console.error("Failed to extract available slots:", error);
      return [];
    }
  };

  // Handles adding a trainer even if validation failed
  const handleAddAnyway = async () => {
    // Exit if no pending trainer or schedule data
    if (!pendingTrainer || !scheduleData?.trainerName) return;

    // Extract available slots from the validation message
    const availableSlots = extractAvailableSlots(validationMessage);

    // Helper function to update the schedule with available slots for the class
    const transformScheduleWithAvailableSlots = (
      scheduleData,
      availableSlots,
      className
    ) => {
      // Clone the schedule data
      const transformed = { ...scheduleData };

      // For each available slot, update the trainer's schedule
      availableSlots.forEach(({ day, time }) => {
        // Convert time to 24-hour format
        const [hourMin, AMP] = time.split(" ");
        let [hour, minute] = hourMin.split(":").map(Number);

        if (AMP === "PM" && hour !== 12) hour += 12;
        if (AMP === "AM" && hour === 12) hour = 0;

        const time24 = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;

        // If the slot exists, update its details
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

      // Return the updated schedule object
      return transformed.trainerSchedule;
    };

    // Get the updated schedule with the new class info
    const updatedSchedule = transformScheduleWithAvailableSlots(
      scheduleData,
      availableSlots,
      `${selectedClass?.module} Class`
    );

    // Prepare payload for updating the trainer's schedule
    const updateTrainerSchedulePayload = {
      trainerName: scheduleData.trainerName,
      trainerSchedule: updatedSchedule,
    };

    // Prepare payload for adding the trainer to the class
    const payload = {
      module: selectedClass?.module,
      trainer: { _id: pendingTrainer?._id, name: pendingTrainer?.name },
      action: "add",
    };

    try {
      // Update class details with the new trainer
      await axiosPublic.put("/Class_Details/trainer", payload);
      // Update the trainer's schedule
      await axiosPublic.put(
        "/Trainers_Schedule/Update",
        updateTrainerSchedulePayload
      );
      Refetch();
      setDeleteTrainerError(null); // Clear any previous error
    } catch (error) {
      // Handle errors and set error message
      console.error("Failed to complete operation:", error);
      setDeleteTrainerError(
        error.response?.data || "Failed to add trainer. Please try again."
      );
    }

    // Reset validation and pending trainer state
    setValidationMessage("");
    setPendingTrainer(null);
  };

  // Cancel add after validation error
  const handleCancelAdd = () => {
    setValidationMessage("");
    setPendingTrainer(null);
  };

  return (
    <div className="mb-6 p-5 bg-blue-50 border-l-4 border-blue-400 rounded shadow-sm text-blue-800 mx-auto">
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <span className="flex-shrink-0 h-6 w-6 text-blue-500 mt-1">
          <FaInfoCircle className="h-6 w-6" />
        </span>

        {/* Message */}
        <div className="flex-1">
          {/* Title */}
          <p className="mb-2 text-lg font-semibold">Notice</p>

          {/* List */}
          <div className="mb-4 leading-relaxed flex gap-10 flex-wrap">
            {sections.map(({ label, times }, idx) => {
              const isAvailable = label.toLowerCase() === "available";
              const isUnavailable =
                label.toLowerCase() === "unavailable" ||
                label.toLowerCase() === "occupied";

              return (
                <div key={idx} className="mb-3 min-w-[200px]">
                  {/* Label */}
                  <p className="font-semibold mb-1">{label}:</p>

                  {/* List */}
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

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            {/* Add Button */}
            <CommonButton
              clickEvent={handleAddAnyway}
              text="Add Anyway"
              bgColor="blue"
              textColor="text-white"
              px="px-5"
              py="py-2"
              borderRadius="rounded-md"
            />
            {/* Cancel Button */}
            <CommonButton
              clickEvent={handleCancelAdd}
              text="Don't Add"
              bgColor="gray"
              textColor="text-gray-800"
              px="px-5"
              py="py-2"
              borderRadius="rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Prop Validation
ValidationMessage.propTypes = {
  setDeleteTrainerError: PropTypes.func,
  setValidationMessage: PropTypes.func,
  validationMessage: PropTypes.string,
  setPendingTrainer: PropTypes.func,
  pendingTrainer: PropTypes.object,
  selectedClass: PropTypes.object,
  scheduleData: PropTypes.object,
  Refetch: PropTypes.func,
};

export default ValidationMessage;
