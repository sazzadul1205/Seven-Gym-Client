/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";

import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import ViewPlanModal from "./ViewPlanModal/ViewPlanModal";
import AddPlanModal from "./AddPlanModal/AddPlanModal";
import useAuth from "../../../../Hooks/useAuth";

const TodaysSchedule = ({ scheduleData, scheduleInfo, refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const { date, dayName } = scheduleInfo;

  // State Management
  const [selectedID, setSelectedID] = useState(null);

  const today = new Date();
  const providedDate = new Date(date.split("-").reverse().join("-"));

  // Function to format the date as dd mm yyyy
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Fixing isToday and isPast logic
  const isToday = today.toDateString() === providedDate.toDateString();
  const isPast = providedDate < today && !isToday;

  // Dynamically set the title and styling
  let title = "TODAY'S SCHEDULE";
  if (!isToday) {
    title = `${dayName.toUpperCase()}'S SCHEDULE`;
  }

  // Transform schedule data into a structured format
  const scheduledTimes = Object.keys(scheduleData).map((time) => {
    const hour = parseInt(time.split(":")[0], 10);
    const period = hour < 12 ? "AM" : "PM";
    const displayHour = hour % 12 || 12; // Convert 0 to 12 AM
    return {
      display: `${displayHour}:00 ${period}`,
      key: time,
      event: scheduleData[time],
    };
  });

  // Handle clicking on an event
  const handleEventClick = (event) => {
    if (isPast) return; // Prevent interaction with past schedules
    setSelectedID(event.id);
    if (event.title) {
      document.getElementById("Details_view_Modal").showModal();
    } else {
      document.getElementById("Add_Plan_Modal").showModal();
    }
  };

  // Get next occurrence of a given weekday
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
    let daysToAdd = (targetIndex - todayIndex + 7) % 7 || 7;

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);
    return {
      nextDayName: daysOfWeek[nextDate.getDay()],
      nextDate: formatDate(nextDate),
    };
  };

  const { nextDayName, nextDate } = getNextOccurrence(dayName);

  // Handle regenerating schedule for the next occurrence
  const handleRegenerateClick = async () => {
    const updatedScheduleID = `${nextDayName}-${nextDate
      .split(" ")
      .reverse()
      .join("-")}`;

    const updatedScheduleData = {};

    // Create new schedule entries with cleared details
    Object.keys(scheduleData).forEach((time) => {
      updatedScheduleData[time] = {
        id: `sche-${updatedScheduleID}-${time}`,
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

    console.log(regeneratedSchedule);

    try {
      await axiosPublic.put("/Schedule/RegenerateNewDaySchedule", {
        email: user.email,
        dayName: nextDayName,
        scheduleData: regeneratedSchedule,
      });
      Swal.fire({
        title: "Success!",
        text: "Schedule updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
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

  // Fetch event details when an ID is selected
  const { data: eventDetails, isLoading } = useQuery({
    queryKey: ["IndividualPlansIdsData", selectedID],
    queryFn: () =>
      axiosPublic
        .get(
          `Schedule/SchedulesById?email=${user?.email}&scheduleIDs=${selectedID}`
        )
        .then((res) => res.data),
    enabled: !!selectedID,
  });

  return (
    <div className="border border-gray-100 bg-gray-300/40 rounded-xl shadow-xl">
      <p
        className={`text-center py-3 font-semibold rounded-xl text-black bg-linear-to-b from-yellow-300 to-yellow-600`}
      >
        {title} [ {date} ]
      </p>

      {isPast && (
        <div className="text-center text-white bg-red-500 border-2 border-red-800 animate-pulse rounded-lg shadow-md mt-2 py-2 space-y-2">
          <h4>
            This schedule has passed. Regenerate for next
            <span className="text-lg font-semibold"> {nextDayName}</span>?
          </h4>
          <p>[ {nextDate} ]</p>
          <button
            onClick={handleRegenerateClick}
            className="bg-linear-to-bl hover:bg-linear-to-tr from-blue-400 to-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-xl  py-2 px-10 cursor-pointer"
          >
            Regenerate
          </button>
        </div>
      )}

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
                  : "bg-green-300 text-gray-800 md:hover:scale-105 delay-200 cursor-pointer"
              }`}
              onClick={() => handleEventClick(event)}
            >
              <p className="font-bold">{event.title || "No Event Planned"}</p>
            </div>
          </div>
        ))}
      </div>

      <dialog id="Details_view_Modal" className="modal">
        <ViewPlanModal
          eventDetails={eventDetails}
          isLoading={isLoading}
          refetch={refetch}
        />
      </dialog>
      <dialog id="Add_Plan_Modal" className="modal">
        <AddPlanModal
          scheduleData={scheduleData}
          selectedID={selectedID}
          refetch={refetch}
        />
      </dialog>
    </div>
  );
};

export default TodaysSchedule;
