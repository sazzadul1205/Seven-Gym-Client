import { useState } from "react";
import AddPlanModal from "./AddPlanModal/AddPlanModal";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../Shared/Loading/Loading";
import { ImCross } from "react-icons/im";
import { BiCalendarCheck, BiMap, BiNotepad } from "react-icons/bi";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";

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
        <div className="modal-box p-6 rounded-lg shadow-lg bg-white bg-gradient-to-br from-gray-300 to-gray-200">
          {/* Top Section - Title & Close Button */}
          <div className="flex justify-between items-center border-b border-gray-300 pb-3">
            <h3 className="font-bold text-xl text-gray-800">📅 View Plans</h3>
            <ImCross
              className="text-2xl text-gray-600 hover:text-[#F72C5B] cursor-pointer transition duration-200"
              onClick={() =>
                document.getElementById("Details_view_Modal").close()
              }
            />
          </div>
          {/* Modal Content */}
          <div className="py-4">
            {isLoading ? (
              <Loading />
            ) : eventDetails?.length ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BiCalendarCheck className="text-blue-500 text-2xl" />
                  {eventDetails[0]?.title}
                </h2>
                <p className="text-gray-700 flex items-center gap-2">
                  <BiNotepad className="text-green-500 text-xl" />
                  <strong>Notes:</strong> {eventDetails[0]?.notes}
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <BiMap className="text-red-500 text-xl" />
                  <strong>Location:</strong> {eventDetails[0]?.location}
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <strong>Status:</strong>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      eventDetails[0]?.status === "planned"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-400 text-black"
                    }`}
                  >
                    {eventDetails[0]?.status}
                  </span>
                </p>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-40 text-center text-gray-500">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                  alt="No Event"
                  className="w-16 h-16 opacity-50 mb-2"
                />
                <p>No event details available.</p>
              </div>
            )}
          </div>

          {/* Delete and Edit */}
          <div className="flex justify-between items-center ">
            <button>
              <FaEdit />
            </button>

            <button>
              <FaRegTrashAlt />
            </button>
          </div>
        </div>
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
