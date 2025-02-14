import { useState } from "react";
import AddPlanModal from "./AddPlanModal/AddPlanModal";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../Hooks/useAuth";

/* eslint-disable react/prop-types */
const TodaysSchedule = ({ scheduleData }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const [selectedID, setSelectedID] = useState(null);

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
    if (event.title) {
      document.getElementById("Details_view_Modal").showModal();
    } else {
      setSelectedID(event.id);
      document.getElementById("Add_Plan_Modal").showModal();
    }
  };

  return (
    <div className="p-4">
      {/* Title */}
      <p className="bg-yellow-500 text-center py-2 font-semibold rounded-full">
        TODAY&apos;S SCHEDULE
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
              className="bg-green-300 text-gray-800 px-4 py-2 w-full rounded-full shadow-md hover:scale-105 cursor-pointer"
              onClick={() => handleEventClick(event)}
            >
              <p className="font-bold">{event.title || "No Event Planned"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Details View Modal */}
      <dialog id="Details_view_Modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Event Details</h3>
          <p className="py-4">This is where event details will be displayed.</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Add Plan Modal */}
      <dialog id="Add_Plan_Modal" className="modal">
        <AddPlanModal selectedID={selectedID} />
      </dialog>
    </div>
  );
};

export default TodaysSchedule;
