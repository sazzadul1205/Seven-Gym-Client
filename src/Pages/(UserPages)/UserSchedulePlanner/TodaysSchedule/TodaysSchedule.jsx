import { useState } from "react";
import PropTypes from "prop-types";

// Import Package
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

// Import Utility
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../Hooks/useAuth";

// Import Modal
import ViewPlanModal from "./ViewPlanModal/ViewPlanModal";
import TodaysScheduleAddModal from "./TodaysScheduleAddModal/TodaysScheduleAddModal";

const TodaysSchedule = ({ scheduleData, scheduleInfo, refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Selected event ID state
  const [selectedID, setSelectedID] = useState(null);

  // Fetch event details based on selected ID
  const { data: eventDetails, isLoading } = useQuery({
    queryKey: ["IndividualPlansIdsData", selectedID],
    queryFn: () =>
      axiosPublic
        .get(
          `/User_Schedule/SchedulesById?email=${user?.email}&scheduleIDs=${selectedID}`
        )
        .then((res) => res.data),
    enabled: !!selectedID, // Only run query when selectedID exists
  });

  // If scheduleInfo is missing, display fallback message
  if (!scheduleInfo) {
    return (
      <div className="text-center text-gray-500 text-xl">
        No schedule information available.
      </div>
    );
  }

  const { date, dayName } = scheduleInfo; // Extract date and day name

  const today = new Date(); // Get current date
  const providedDate = new Date(date.split("-").reverse().join("-")); // Convert provided date

  // Format date as dd mm yyyy
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Determine if the provided date is today or in the past
  const isToday = today.toDateString() === providedDate.toDateString();
  const isPast = providedDate < today && !isToday;

  // Set dynamic title
  let title = "TODAY'S SCHEDULE";
  if (!isToday) {
    title = `${dayName.toUpperCase()}'S SCHEDULE`;
  }

  // Transform scheduleData into an array of time slots
  const scheduledTimes = Object.keys(scheduleData).map((time) => {
    const hour = parseInt(time.split(":")[0], 10);
    const period = hour < 12 ? "AM" : "PM";
    const displayHour = hour % 12 || 12; // Convert 0 to 12 for AM
    return {
      display: `${displayHour}:00 ${period}`,
      key: time,
      event: scheduleData[time],
    };
  });

  // Handle event click, prevent past interactions
  const handleEventClick = (event) => {
    if (isPast) return;
    setSelectedID(event.id);
    if (event.title) {
      document.getElementById("Details_view_Modal").showModal();
    } else {
      document.getElementById("Todays_Schedule_Add_Modal").showModal();
    }
  };

  // Get next occurrence of the given weekday
  const getNextOccurrence = (day) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const todayIndex = today.getDay();
    const targetIndex = daysOfWeek.indexOf(day);

    let daysToAdd = targetIndex - todayIndex;
    if (daysToAdd < 0) daysToAdd += 7;

    //  today is already the target day, don't skip ahead
    if (daysToAdd === 0) daysToAdd = 0;

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);
    return {
      nextDayName: daysOfWeek[nextDate.getDay()],
      nextDate: formatDate(nextDate),
    };
  };

  const { nextDayName, nextDate } = getNextOccurrence(dayName);

  // Regenerate schedule for next occurrence
  const handleRegenerateClick = async () => {
    const updatedScheduleID = `${nextDayName}-${nextDate
      .split(" ")
      .reverse()
      .join("-")}`;

    // Clear details for each time slot
    const updatedScheduleData = {};
    Object.keys(scheduleData).forEach((time) => {
      updatedScheduleData[time] = {
        id: `schedule-${updatedScheduleID}-${time}`,
        title: "",
        notes: "",
        location: "",
        status: "",
      };
    });

    const formattedDate = nextDate.split(" ").join("-");

    const regeneratedSchedule = {
      id: updatedScheduleID,
      dayName: nextDayName,
      date: formattedDate,
      schedule: updatedScheduleData,
    };

    try {
      await axiosPublic.put("/User_Schedule/RegenerateNewDaySchedule", {
        email: user.email,
        dayName: nextDayName,
        scheduleData: regeneratedSchedule,
      });
      Swal.fire({
        title: "Success!",
        text: "Schedule updated successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      refetch();
    } catch (error) {
      console.error("Error updating schedule:", error);
      Swal.fire({
        title: "Error!",
        text: "Could not update schedule. Try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="border border-gray-100 bg-gray-300/40 rounded-xl shadow-xl pb-5">
      {/* Title and date display */}
      <p className="text-center py-3 font-semibold rounded-xl text-black bg-linear-to-b from-yellow-300 to-yellow-600">
        {title} [ {date} ]
      </p>

      {/* Regeneration option for past schedules */}
      {isPast && (
        <div className="text-center text-white bg-red-500 border-2 border-red-800 animate-pulse rounded-lg shadow-md mt-2 py-2 space-y-2">
          <h4>
            This schedule has passed. Regenerate for next
            <span className="text-lg font-semibold"> {nextDayName}</span>?
          </h4>
          <p>[ {nextDate} ]</p>
          <button
            onClick={handleRegenerateClick}
            className="bg-linear-to-bl hover:bg-linear-to-tr from-blue-400 to-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-xl py-2 px-10 cursor-pointer"
          >
            Regenerate
          </button>
        </div>
      )}

      {/* Time slots mapping */}
      <div className="pt-4 space-y-3">
        {scheduledTimes.map(({ display, event }, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row md:items-center gap-3 w-full border-t md:border-none border-gray-400 p-1"
          >
            <p className="font-bold md:font-semibold text-gray-700 w-24 text-right">
              {display} :
            </p>
            <div
              className={`px-4 py-3 w-full rounded-xl shadow-md transition ${
                isPast
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                  : "bg-linear-to-bl hover:bg-linear-to-tr from-green-300 to-green-500 text-gray-800 delay-200 cursor-pointer"
              }`}
              onClick={() => handleEventClick(event)}
            >
              <p className="font-bold">{event.title || "No Event Planned"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <dialog id="Details_view_Modal" className="modal">
        <ViewPlanModal
          eventDetails={eventDetails}
          isLoading={isLoading}
          refetch={refetch}
        />
      </dialog>

      <dialog id="Todays_Schedule_Add_Modal" className="modal">
        <TodaysScheduleAddModal
          scheduleData={scheduleData}
          selectedID={selectedID}
          refetch={refetch}
        />
      </dialog>
    </div>
  );
};

// PropTypes validation
TodaysSchedule.propTypes = {
  scheduleData: PropTypes.object.isRequired,
  scheduleInfo: PropTypes.object,
  refetch: PropTypes.func.isRequired,
};

export default TodaysSchedule;
