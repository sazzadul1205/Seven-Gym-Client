// import Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Import Hooks
import Loading from "../../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../../Shared/Component/FetchingError";

// import Icons
import { ImCross } from "react-icons/im";
import UserTrainerBookingInfoModalBasic from "./UserTrainerBookingInfoModalBasic/UserTrainerBookingInfoModalBasic";

// Convert 24-hour time to 12-hour AM/PM format
const formatTimeTo12Hour = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const h = parseInt(hour, 10);
  const amPm = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 === 0 ? 12 : h % 12;
  return `${formattedHour}:${minute} ${amPm}`;
};

const UserTrainerBookingInfoModal = ({ selectedBooking, closeModal }) => {
  const axiosPublic = useAxiosPublic();

  // Fetch Trainer Data
  const {
    data: TrainerData,
    isLoading: TrainerDataIsLoading,
    error: TrainerDataError,
  } = useQuery({
    queryKey: ["TrainerData", selectedBooking?.trainer],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers?name=${selectedBooking?.trainer}`)
        .then((res) => res.data),
    enabled: !!selectedBooking?.trainer,
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
    <div className="modal-box max-w-5xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black">
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

      {/* Basic Information : Trainer Info , Booking Details */}
      <UserTrainerBookingInfoModalBasic
        selectedBooking={selectedBooking}
        SelectedTrainerData={SelectedTrainerData}
      />

      {/* Sessions Table */}
      <div className="p-3">
        {/* Title */}
        <h3 className="text-lg font-semibold py-2">Session Bookings</h3>

        {/* Schedule By Id  */}
        {ScheduleByIDData?.length > 0 ? (
          <>
            {/* Desktop View */}
            <div className="hidden md:flex">
              {/* Schedule By ID  */}
              <table className="table-auto w-full border-collapse text-left border border-gray-300 text-black mb-6">
                {/* Table Header */}
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b bg-gray-300">Day</th>
                    <th className="px-4 py-2 border-b bg-gray-300">
                      Class Code
                    </th>
                    <th className="px-4 py-2 border-b bg-gray-300">
                      Class Type
                    </th>
                    <th className="px-4 py-2 border-b bg-gray-300 text-center">
                      Time
                    </th>
                    <th className="px-4 py-2 border-b bg-gray-300">Price</th>
                  </tr>
                </thead>

                {/* Table Content */}
                <tbody>
                  {ScheduleByIDData?.map((s, idx) => (
                    <tr
                      key={`${s.id}-${idx}`}
                      className="bg-gray-50 hover:bg-gray-200 border border-gray-300 cursor-pointer"
                    >
                      {/* Day */}
                      <td className="px-4 py-2">{s.day}</td>

                      {/* Class Code */}
                      <td className="px-4 py-2">{s.id}</td>

                      {/* Class Type */}
                      <td className="px-4 py-2">{s.classType}</td>

                      {/* Time */}
                      <td className="px-4 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <p className="w-16 md:w-20">
                            {formatTimeTo12Hour(s.start)}
                          </p>
                          <span>-</span>
                          <p className="w-16 md:w-20">
                            {formatTimeTo12Hour(s.end)}
                          </p>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-2">
                        {s.classPrice === "free" || s.classPrice === "Free"
                          ? "Free"
                          : `$ ${s.classPrice}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="flex md:hidden flex-col mb-6">
              {ScheduleByIDData.map((s, idx) => (
                <div
                  key={`${s.id}-${idx}`}
                  className={`text-black text-center ${
                    idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } md:rounded-xl p-5 shadow-md border-2 border-gray-300`}
                >
                  {/* Day */}
                  <h4>{s.day}</h4>

                  {/* Class Type */}
                  <p className="text-xl font-semibold">{s.classType}</p>

                  {/* Time */}
                  <div className="flex justify-center gap-2">
                    <p>{formatTimeTo12Hour(s.start)}</p>
                    <span>-</span>
                    <p>{formatTimeTo12Hour(s.end)}</p>
                  </div>

                  {/* Price */}
                  <p className="font-bold text-lg">
                    {" "}
                    {s.classPrice === "free" || s.classPrice === "Free"
                      ? "Free"
                      : `$ ${s.classPrice}`}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          // If No Session Available
          <p className="text-center text-xl">No sessions available</p>
        )}
      </div>

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
    trainer: PropTypes.string,
    sessions: PropTypes.arrayOf(PropTypes.string),
    durationWeeks: PropTypes.number,
    totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    bookedAt: PropTypes.string,
  }),
  closeModal: PropTypes.func.isRequired,
};

export default UserTrainerBookingInfoModal;
