/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import ViewPlanModal from "./ViewPlanModal/ViewPlanModal";
import AddPlanModal from "./AddPlanModal/AddPlanModal";
import useAuth from "../../../../Hooks/useAuth";
import Swal from "sweetalert2";

const TodaysSchedule = ({ scheduleData, scheduleInfo, refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const { date, dayName } = scheduleInfo;

  const [selectedID, setSelectedID] = useState(null);

  const today = new Date();
  const providedDate = new Date(date.split("-").reverse().join("-"));

  const isToday = today.toDateString() === providedDate.toDateString();
  const isFuture = providedDate > today;
  const isPast = providedDate < today && !isToday;

  // Determine the title dynamically
  let title = "TODAY'S SCHEDULE";
  let titleClass = "bg-yellow-500";

  if (!isToday) {
    title = `${dayName.toUpperCase()}'S SCHEDULE`;

    if (isFuture) {
      titleClass = "bg-yellow-500";
    } else if (isPast) {
      titleClass = "bg-yellow-500 opacity-60";
    }
  }

  const scheduledTimes = Object.keys(scheduleData).map((time) => {
    const hour = parseInt(time.split(":")[0], 10);
    const period = hour < 12 ? "AM" : "PM";
    const displayHour = hour % 12 || 12; // Convert 0 to 12 for AM format
    return {
      display: `${displayHour}:00 ${period}`,
      key: time,
      event: scheduleData[time],
    };
  });

  // Function to handle event click
  const handleEventClick = (event) => {
    if (isPast) return; // Prevent interaction with past events
    setSelectedID(event.id);
    if (event.title) {
      document.getElementById("Details_view_Modal").showModal();
    } else {
      document.getElementById("Add_Plan_Modal").showModal();
    }
  };

  // Function to get the next occurrence of the same weekday and its exact date
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
    let daysToAdd = (targetIndex - todayIndex + 7) % 7;
    if (daysToAdd === 0) daysToAdd = 7; // Move to the next week

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);

    // Format date as YYYY-MM-DD
    const formattedDate = nextDate.toISOString().split("T")[0];

    return {
      nextDayName: daysOfWeek[nextDate.getDay()],
      nextDate: formattedDate,
    };
  };

  // Get the next occurrence of the selected day
  const { nextDayName, nextDate } = getNextOccurrence(dayName);

  // Function to handle schedule regeneration
  const handleRegenerateClick = async () => {
    // Update schedule ID with the new date (keep other parts unchanged)
    const updatedScheduleID = `${nextDayName}-${nextDate
      .split("-")
      .reverse()
      .join("-")}`;

    // Log the updated schedule ID
    console.log(`Updated schedule ID: ${updatedScheduleID}`);

    // Update the schedule data with the new date and clear the event details
    const updatedScheduleData = {};

    // Iterate through each time slot and update it
    Object.keys(scheduleData).forEach((time) => {
      const newEventID = `sche-${updatedScheduleID}-${time}`;

      // Clear out title, notes, location, and status if they have content
      updatedScheduleData[time] = {
        id: newEventID,
        title: "",
        notes: "",
        location: "",
        status: "",
      };
    });

    const regeneratedUpdatedCode = {
      id: updatedScheduleID,
      dayName: nextDayName,
      date: nextDate,
      schedule: updatedScheduleData,
    };

    // Log the updated schedule data
    console.log("Updated schedule data:", regeneratedUpdatedCode);

    try {
      // Send the updated schedule data to the server
      // eslint-disable-next-line no-unused-vars
      const response = await axiosPublic.put(
        "/Schedule/RegenerateNewDaySchedule",
        {
          email: user.email, // Assuming user object contains the email
          dayName: nextDayName,
          scheduleData: regeneratedUpdatedCode, // The updated schedule
        }
      );

      // Success alert
      Swal.fire({
        title: "Success!",
        text: "Schedule has been updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      refetch();
    } catch (error) {
      console.error("Error updating schedule:", error);

      // Error alert
      Swal.fire({
        title: "Error!",
        text: "There was an issue updating the schedule. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Fetch Individual Plan Details
  const { data: eventDetails, isLoading } = useQuery({
    queryKey: ["IndividualPlansIdsData", selectedID],
    queryFn: () =>
      axiosPublic
        .get(
          `Schedule/SchedulesById?email=${user?.email}&scheduleIDs=${selectedID}`
        )
        .then((res) => res.data),
    enabled: !!selectedID, // Only fetch when an ID is selected
  });

  return (
    <div className="p-4">
      {/* Dynamic Title */}
      <p
        className={`text-center py-2 font-semibold rounded-full ${titleClass}`}
      >
        {title}
      </p>

      {/* Glowing prompt for past schedules */}
      {isPast && (
        <div className="mt-2 p-2 text-center text-white bg-red-500 animate-pulse rounded-lg shadow-md">
          <p>
            This schedule has passed. Do you want to regenerate for{" "}
            <span className="text-lg font-semibold">next {nextDayName}</span>?
          </p>
          <p>({nextDate})</p>
          <button
            onClick={handleRegenerateClick}
            className="mt-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Regenerate
          </button>
        </div>
      )}

      {/* Schedule List */}
      <div className="pt-4 space-y-3">
        {scheduledTimes.map(({ display, event }, index) => (
          <div key={index} className="flex items-center gap-3 w-full">
            {/* Time Label */}
            <p className="font-semibold text-gray-700 w-20 text-right">
              {display}
            </p>

            {/* Event Information */}
            <div
              className={`px-4 py-2 w-full rounded-full shadow-md transition ${
                isPast
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                  : "bg-green-300 text-gray-800 hover:scale-105 cursor-pointer"
              }`}
              onClick={() => handleEventClick(event)}
            >
              <p className="font-bold">{event.title || "No Event Planned"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Details View Modal */}
      <dialog id="Details_view_Modal" className="modal">
        <ViewPlanModal
          eventDetails={eventDetails}
          isLoading={isLoading}
          refetch={refetch}
        />
      </dialog>

      {/* Add Plan Modal */}
      <dialog id="Add_Plan_Modal" className="modal">
        <AddPlanModal
          selectedID={selectedID}
          refetch={refetch}
          scheduleData={scheduleData}
        />
      </dialog>
    </div>
  );
};

export default TodaysSchedule;
