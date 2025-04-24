import { useState } from "react";
import { useNavigate } from "react-router";

// Import Package
import PropTypes from "prop-types";

// Import Icons
import { GrSchedules } from "react-icons/gr";

// Import Component
import ScheduleSettings from "./ScheduleSettings/ScheduleSettings";
import SchedulePrioritySettings from "./SchedulePrioritySettings/SchedulePrioritySettings";
import ScheduleToDoSettings from "./ScheduleToDoSettings/ScheduleToDoSettings";
import ScheduleNoteSettings from "./ScheduleNoteSettings/ScheduleNoteSettings";

// Import "hooks
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

const UserSettingsSchedule = ({ userSchedule, refetch }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  // State Management
  const [showTimeSelection, setShowTimeSelection] = useState(false);
  const [startTime, setStartTime] = useState("8 AM");
  const [endTime, setEndTime] = useState("8 PM");

  // User Schedule Data
  const UserScheduleData = userSchedule?.schedule;

  // User Priority Data
  const UserPriorityData = userSchedule?.priority;

  // User To Do Data
  const UserToDoData = userSchedule?.todo;

  // User Note Data
  const UserNoteData = userSchedule?.notes;

  // Show time selection step when creating a schedule
  const handleCreateSchedule = () => {
    setShowTimeSelection(true);
  };

  // Generate and post the schedule to the backend
  const generateSchedule = async () => {
    // Check if both start and end times are selected
    if (!startTime || !endTime) {
      Swal.fire({
        icon: "warning",
        title: "Missing Time Selection",
        text: "Please select both start and end times.",
      });
      return;
    }

    const today = new Date(); // Today's date
    const userEmail = user?.email; // User email

    const fullWeekdays = [
      // List of all weekdays
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Convert a 12-hour time string to 24-hour format
    const convertTimeTo24Hour = (time) => {
      const [hour, period] = time.split(" ");
      let hours = parseInt(hour, 10);
      if (period === "PM" && hours !== 12) hours += 12;
      else if (period === "AM" && hours === 12) hours = 0;
      return hours;
    };

    // Start and End Time Fetching
    const startHour = convertTimeTo24Hour(startTime);
    const endHour = convertTimeTo24Hour(endTime);

    // Generate time slots for a day based on start and end hours
    const generateTimeSlots = (start, end, dayId) => {
      let timeSlots = {};
      for (let hour = start; hour <= end; hour++) {
        const formattedTime = `${String(hour).padStart(2, "0")}:00`;
        timeSlots[formattedTime] = {
          id: `Schedule-${dayId}-${formattedTime}`,
          title: "",
          notes: "",
          location: "",
          status: "",
        };
      }
      return timeSlots;
    };

    // Build schedule object to post
    let schedule = {
      email: userEmail,
      schedule: {},
      priority: [],
      notes: [],
      todo: [],
    };

    // Generate schedule for all 7 days
    fullWeekdays.forEach((day, index) => {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() - today.getDay() + index);
      const formattedDate = currentDate
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-"); // Format date as DD-MM-YYYY
      const dayId = `${day}-${formattedDate}`; // Unique day ID

      schedule.schedule[day] = {
        id: dayId,
        dayName: day,
        date: formattedDate,
        schedule: generateTimeSlots(startHour, endHour, dayId),
      };
    });

    // Post the schedule data to the backend
    try {
      await axiosPublic.post("/User_Schedule", schedule);
      refetch(); // Refresh schedule data
      Swal.fire({
        icon: "success",
        title: "Schedule Created!",
        text: "Your schedule has been successfully saved.",
        timer: 2000,
        showConfirmButton: false,
      });
      // Close the modal using its id
    } catch (error) {
      console.error("Error posting schedule:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Save",
        text: "There was an error saving your schedule. Please try again.",
      });
    }
  };

  // Return "Empty" if userSchedule is missing
  if (!userSchedule) {
    return (
      <div className="bg-gradient-to-b from-gray-100 to-gray-200 h-screen">
        <div className="flex items-center justify-center pt-50">
          <div className="bg-linear-to-bl from-gray-200 to-gray-400 p-5 rounded-lg shadow-lg hover:shadow-2xl text-center  max-w-md w-full">
            {!showTimeSelection ? (
              <div>
                <h3 className="font-bold text-2xl text-gray-800">
                  Create Your Schedule
                </h3>
                <p className="py-4 text-gray-600 text-lg">
                  You don&apos;t have a schedule yet. Would you like to create
                  one?
                </p>
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={handleCreateSchedule}
                    className="bg-gradient-to-bl hover:bg-gradient-to-tr from-blue-300 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg py-3 w-[200px] cursor-pointer delay-200"
                  >
                    Create Schedule
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="bg-gradient-to-bl hover:bg-gradient-to-tr from-red-300 to-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg py-3 w-[200px] cursor-pointer delay-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Step 2: Display time range selection UI
              <div>
                <h3 className="font-bold text-lg mb-2 text-black">
                  Select Time Range
                </h3>
                <p className="text-gray-500 mb-4">
                  Choose a start and end time for your schedule
                </p>
                <div className="flex justify-center gap-4 items-center mb-6">
                  {/* Start Time Selector */}
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border rounded-lg px-10 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 bg-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <option key={hour} value={`${hour} AM`}>
                        {hour} AM
                      </option>
                    ))}
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <option key={hour + 12} value={`${hour} PM`}>
                        {hour} PM
                      </option>
                    ))}
                  </select>
                  {/* End Time Selector */}
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border rounded-lg px-10 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 bg-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <option key={hour} value={`${hour} AM`}>
                        {hour} AM
                      </option>
                    ))}
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <option key={hour + 12} value={`${hour} PM`}>
                        {hour} PM
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    className="bg-gradient-to-bl hover:bg-gradient-to-tr from-green-300 to-green-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl py-3 w-[200px]  cursor-pointer delay-200"
                    onClick={generateSchedule}
                  >
                    Confirm Time
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="bg-gradient-to-bl hover:bg-gradient-to-tr from-red-300 to-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg py-3 w-[200px] cursor-pointer delay-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-gray-400 px-5 py-2">
        <p className="flex gap-2 items-center text-xl font-semibold italic text-white">
          <GrSchedules /> User Schedule Settings
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-3">
        {/* Schedule Settings */}
        <ScheduleSettings
          UserScheduleData={UserScheduleData}
          refetch={refetch}
        />

        {/* Schedule Priority Settings */}
        <SchedulePrioritySettings
          UserPriorityData={UserPriorityData}
          refetch={refetch}
        />

        {/* Schedule To Do Settings */}
        <ScheduleToDoSettings UserToDoData={UserToDoData} refetch={refetch} />

        {/* Schedule Note Settings */}
        <ScheduleNoteSettings UserNoteData={UserNoteData} refetch={refetch} />
      </div>
    </div>
  );
};

// Prop type management
UserSettingsSchedule.propTypes = {
  userSchedule: PropTypes.shape({
    schedule: PropTypes.objectOf(
      PropTypes.shape({
        dayName: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired, // Format: "DD-MM-YYYY"
        schedule: PropTypes.objectOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string,
            notes: PropTypes.string,
            location: PropTypes.string,
            status: PropTypes.string,
          })
        ).isRequired,
      })
    ),
    priority: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        level: PropTypes.string, // Example: "High", "Medium", "Low"
        description: PropTypes.string,
      })
    ),
    todo: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        task: PropTypes.string.isRequired,
        completed: PropTypes.bool.isRequired,
      })
    ),
    notes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        dateCreated: PropTypes.string.isRequired, // Format: "DD-MM-YYYY"
      })
    ),
  }),
  refetch: PropTypes.func.isRequired,
};

export default UserSettingsSchedule;
