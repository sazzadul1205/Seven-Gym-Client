import AddPlanModal from "./AddPlanModal/AddPlanModal";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import ViewPlanModal from "./ViewPlanModal/ViewPlanModal";
import useAuth from "../../../../Hooks/useAuth";

const TodaysSchedule = ({ scheduleData, refetch }) => {
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
