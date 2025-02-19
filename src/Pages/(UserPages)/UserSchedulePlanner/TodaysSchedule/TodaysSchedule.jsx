/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import ViewPlanModal from "./ViewPlanModal/ViewPlanModal";
import AddPlanModal from "./AddPlanModal/AddPlanModal";
import useAuth from "../../../../Hooks/useAuth";

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
      title += " (Future)";
      titleClass = "bg-yellow-500"; // Future highlight
    } else if (isPast) {
      titleClass = "bg-yellow-500 opacity-60"; // Past days fade out
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

  // ✅ Fetch Individual Plan Details
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
