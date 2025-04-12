// import Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Import Hooks
import Loading from "../../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../../Shared/Component/FetchingError";

// import Icons
import { ImCross } from "react-icons/im";

// import Modal
import UserTrainerBookingInfoModalBasic from "./UserTrainerBookingInfoModalBasic/UserTrainerBookingInfoModalBasic";
import BookedSessionTable from "./BookedSessionTable/BookedSessionTable";

// import Utility
import { formatTimeTo12Hour } from "../../../../../Utility/formatTimeTo12Hour";

const UserTrainerBookingInfoModal = ({ selectedBooking, closeModal }) => {
  const axiosPublic = useAxiosPublic();

  // Fetch Trainer Data
  const {
    data: TrainerData,
    isLoading: TrainerDataIsLoading,
    error: TrainerDataError,
  } = useQuery({
    queryKey: ["TrainerData", selectedBooking?.trainerId],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers?id=${selectedBooking?.trainerId}`)
        .then((res) => res.data),
    enabled: !!selectedBooking?.trainerId,
  });

  // Unpack trainer data
  const SelectedTrainerData = TrainerData?.[0] || {};

  // Use selectedBooking.sessions directly
  const sessionQuery =
    selectedBooking?.sessions
      ?.map((id) => `ids=${encodeURIComponent(id)}`)
      .join("&") || "";

  // Fetch session details by ID
  const {
    data: ScheduleByIDData,
    isLoading: ScheduleByIDDataIsLoading,
    error: ScheduleByIDDataError,
  } = useQuery({
    queryKey: ["ScheduleByIDData", selectedBooking?.sessions],
    enabled: !!selectedBooking?.sessions?.length,
    queryFn: () =>
      axiosPublic
        .get(`/Trainers_Schedule/ByID?${sessionQuery}`)
        .then((res) => res.data),
  });

  // Load management
  if (TrainerDataIsLoading || ScheduleByIDDataIsLoading) return <Loading />;

  // Error Management
  if (TrainerDataError || ScheduleByIDDataError) return <FetchingError />;

  return (
    <div className="modal-box max-w-5xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black pt-10 md:pt-0">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Booked Sessions Details</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            // document.getElementById("User_Trainer_Booking_Info_Modal")?.close()
            closeModal()
          }
        />
      </div>

      {selectedBooking?.reason && (
        <div className="px-5 py-2 text-red-600 font-semibold italic border-b border-red-300 bg-red-100">
          Reason: {selectedBooking.reason}
        </div>
      )}

      {/* Basic Information : Trainer Info , Booking Details */}
      <UserTrainerBookingInfoModalBasic
        selectedBooking={selectedBooking}
        SelectedTrainerData={SelectedTrainerData}
      />

      {/* Sessions Table */}
      <BookedSessionTable ScheduleByIDData={ScheduleByIDData} />

      {/* Activity Table */}
      <div className="p-3">
        {/* Title */}
        <h3 className="text-lg font-semibold py-2">Weekly Activity Schedule</h3>

        {/* Activity Content : Desktop */}
        <div className="hidden md:flex  overflow-x-auto">
          {/* Activity Table */}
          <table className="table-auto border-collapse w-full text-sm text-center text-black shadow-md">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-400 text-white">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <th key={day} className="px-4 py-2 border">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Content */}
            <tbody>
              <tr>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => {
                  const sessions =
                    ScheduleByIDData?.filter((s) => s.day === day) || []; // Ensure it's always an array

                  return (
                    <td key={day} className="min-w-[120px] align-top">
                      {sessions.length > 0 ? (
                        sessions.map((s, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-linear-to-br hover:bg-linear-to-tr from-green-100 to-green-300 text-xs border border-gray-400"
                          >
                            {/* classType */}
                            <p className="font-semibold">{s.classType}</p>

                            {/* Time */}
                            <p>
                              {formatTimeTo12Hour(s.start)} -{" "}
                              {formatTimeTo12Hour(s.end)}
                            </p>

                            {/* Paid */}
                            <p className="italic text-bold font-semibold">
                              {s.classPrice === "free" ||
                              s.classPrice === "Free"
                                ? "Free"
                                : `$ ${s.classPrice}`}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-2 bg-linear-to-br hover:bg-linear-to-tr from-red-100 to-red-300 text-xs border border-gray-400 py-6 cursor-pointer ">
                          <p className="text-red-500 font-bold italic">
                            No sessions
                          </p>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Activity Content : Mobile */}
        <div className="flex md:hidden space-y-4">
          <div className="w-full">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => {
              const sessions =
                ScheduleByIDData?.filter((s) => s.day === day) || []; // Ensure it's always an array

              return (
                <div key={day} className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {day}
                  </h3>

                  {sessions.length > 0 ? (
                    sessions.map((s, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-green-100 to-green-300 p-3 mb-2 border border-gray-400"
                      >
                        <p className="font-semibold">{s.classType}</p>
                        <p>
                          {formatTimeTo12Hour(s.start)} -{" "}
                          {formatTimeTo12Hour(s.end)}
                        </p>
                        <p className="italic font-semibold">
                          {s.classPrice === "free" || s.classPrice === "Free"
                            ? "Free"
                            : `$ ${s.classPrice}`}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gradient-to-br from-red-100 to-red-300 p-3 mb-2 border border-gray-400">
                      <p className="text-red-500 font-bold italic">
                        No sessions
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Prop Type Validation
UserTrainerBookingInfoModal.propTypes = {
  selectedBooking: PropTypes.shape({
    trainerId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string, // Optional: add other fields if needed
      }),
    ]),
    sessions: PropTypes.arrayOf(PropTypes.string),
    durationWeeks: PropTypes.number,
    totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    bookedAt: PropTypes.string,
    reason: PropTypes.string,
  }),
  closeModal: PropTypes.func.isRequired,
};

export default UserTrainerBookingInfoModal;
