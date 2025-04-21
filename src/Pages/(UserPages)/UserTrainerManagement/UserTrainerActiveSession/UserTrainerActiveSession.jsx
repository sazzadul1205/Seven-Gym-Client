import { useRef, useState } from "react";

// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Utility
import { formatTimeTo12Hour } from "../../../../Utility/formatTimeTo12Hour";

// Import Icons
import { FaDotCircle, FaInfo } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

// Import Modal
import UserTrainerBookingInfoModal from "../UserTrainerBookingSession/UserTrainerBookingInfoModal/UserTrainerBookingInfoModal";

const UserTrainerActiveSession = ({ TrainersBookingAcceptedData }) => {
  // Initializes a state variable for the selected booking.
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Create a ref for the modal
  const modalRef = useRef(null);

  // Normalize sessions by splitting each entry and computing end time
  const normalizedSessions = TrainersBookingAcceptedData?.flatMap((booking) =>
    booking.sessions.map((s) => {
      const [trainer, day, time] = s.split("-");
      return {
        trainer,
        day,
        start: time,
        end: add59Minutes(time),
      };
    })
  );

  // Days Data
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Group sessions by day of the week
  const sessionsByDay = daysOfWeek.reduce((acc, day) => {
    // For each day, filter the normalized sessions that belong to that specific day
    acc[day] = normalizedSessions?.filter((s) => s.day === day) || [];
    return acc; // Add the filtered sessions under the corresponding day in the accumulator
  }, {}); // Initialize the accumulator as an empty object

  // Close Modal Handler
  const closeModal = () => {
    modalRef.current?.close();
    // Optionally, clear the selected booking if needed:
    setSelectedBooking(null);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="text-center pt-5 pb-2">
        <h3 className="text-xl font-semibold">My Active Sessions</h3>
      </div>

      {/* Divider */}
      <div className="mx-auto bg-black w-1/3 p-[1px]" />

      {/* Weekly Session Section */}
      <div className="py-2">
        {/* Section Title */}
        <h3 className="bg-[#A1662F] text-white flex items-center gap-2 text-lg font-semibold px-5 py-2 ">
          <FaDotCircle />
          Weekly Session Table
        </h3>

        {/* Weekly Session : Desktop View */}
        <div className="overflow-x-auto hidden md:block bg-white">
          {TrainersBookingAcceptedData.length > 0 ? (
            <table className="table-auto border-collapse w-full text-sm text-center text-black shadow-md">
              {/* Table Header */}
              <thead>
                <tr className="bg-[#A1662F] text-white">
                  {daysOfWeek.map((day) => (
                    <th key={day} className="px-4 py-2 border border-gray-800">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                <tr>
                  {daysOfWeek.map((day) => (
                    <td
                      key={day}
                      className="min-w-[120px] h-[100px] align-middle justify-center items-center border border-[#A1662F] text-center"
                    >
                      {/* If sessions exist for the day */}
                      {sessionsByDay[day].length > 0 ? (
                        <div className="flex flex-col items-center justify-center">
                          {sessionsByDay[day].map((s, idx) => (
                            <div
                              key={idx}
                              className="w-full border-t border-[#A1662F] overflow-hidden"
                            >
                              <div className="px-3 py-5 bg-linear-to-bl hover:bg-linear-to-tr from-green-200 to-green-400 text-center cursor-default">
                                {/* Trainer Name */}
                                <p className="text-sm font-bold text-[#333]">
                                  {s.trainer}
                                </p>

                                {/* Trainer Class Time  */}
                                <p className="text-xs font-semibold">
                                  {formatTimeTo12Hour(s.start)} –{" "}
                                  {formatTimeTo12Hour(s.end)}
                                </p>

                                {/* Duration Weeks  */}
                                <p className="text-xs font-semibold">
                                  {s.durationWeeks}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        // No sessions message
                        <div className="flex justify-center items-center h-full py-6">
                          <p className="text-red-500 font-bold italic">
                            No Sessions Scheduled This Far This Far
                          </p>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          ) : (
            // Fallback message for desktop view when no sessions exist
            <div className="flex justify-center items-center py-8">
              <p className="text-red-500 font-bold italic">
                No Sessions Scheduled This Far
              </p>
            </div>
          )}
        </div>

        {/* Weekly Session : Mobile View */}
        <div className="flex flex-col space-y-4 md:hidden">
          {TrainersBookingAcceptedData.length > 0 ? (
            daysOfWeek.map((day) => (
              <div key={day} className="border p-3 rounded-md shadow-sm">
                <h4 className="text-md font-semibold text-center mb-2">
                  {day}
                </h4>
                {sessionsByDay[day].length > 0 ? (
                  sessionsByDay[day].map((s, idx) => (
                    <div key={idx} className="border-t border-[#A1662F] py-3">
                      <p className="text-sm font-semibold text-[#333]">
                        {s.trainer}
                      </p>
                      <p className="text-xs text-gray-700">
                        {formatTimeTo12Hour(s.start)} –{" "}
                        {formatTimeTo12Hour(s.end)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center py-6">
                    <p className="text-red-500 font-bold italic">No sessions</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            // Fallback message for mobile view when no sessions exist
            <div className="flex justify-center items-center py-8">
              <p className="text-red-500 font-bold italic">
                No Sessions Scheduled This Far
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Attending Trainer Table */}
      <div className="py-3">
        {/* Section Title */}
        <h3 className="bg-[#A1662F] text-white text-lg border border-white font-semibold text-center py-2">
          Attending Trainer Table
        </h3>

        {/* Attending Trainer : Desktop View */}
        <div className="overflow-x-auto hidden md:block">
          {TrainersBookingAcceptedData.length > 0 ? (
            <table className="table-auto border-collapse w-full text-sm text-center text-black shadow-md">
              {/* Table Header */}
              <thead>
                <tr className="bg-[#A1662F] text-white">
                  <th className="px-4 py-2 text-left border border-white">
                    Trainer
                  </th>
                  <th className="px-4 py-2 text-left border border-white">
                    Start At
                  </th>
                  <th className="px-4 py-2 text-left border border-white">
                    Total Price
                  </th>
                  <th className="px-4 py-2 text-left border border-white">
                    Duration
                  </th>
                  <th className="px-4 py-2 text-left border border-white">
                    Session End
                  </th>
                  <th className="px-4 py-2 text-center border border-white">
                    Action
                  </th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {TrainersBookingAcceptedData.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b bg-white hover:bg-gray-100 cursor-default"
                  >
                    {/* Trainer Name */}
                    <td className="px-4 py-2 text-left border border-gray-600">
                      {booking.trainer}
                    </td>

                    {/* Start At */}
                    <td className="px-4 py-2 text-left border border-gray-600">
                      {booking.startAt ? booking.startAt : "Not started yet"}
                    </td>

                    {/* Total Price */}
                    <td className="px-4 py-2 text-left border border-gray-600">
                      {String(booking.totalPrice).toLowerCase() === "free"
                        ? "Free"
                        : `$ ${booking.totalPrice}`}
                    </td>

                    {/* Duration */}
                    <td className="px-4 py-2 text-left border border-gray-600">
                      {booking.durationWeeks}{" "}
                      {booking.durationWeeks === 1 ? "Week" : "Weeks"}
                    </td>

                    {/* Session End (calculated using startAt + duration weeks) */}
                    <td className="px-4 py-2 text-left border border-gray-600">
                      {booking.startAt
                        ? new Date(
                            new Date(booking.startAt).setDate(
                              new Date(booking.startAt).getDate() +
                                booking.durationWeeks * 7
                            )
                          ).toLocaleDateString("en-GB")
                        : "--/--"}
                    </td>

                    {/* Action Button */}
                    <td className="px-4 py-2 border border-gray-600">
                      <div className="flex justify-center items-center">
                        <button
                          id={`view-details-btn-${booking._id}`}
                          className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() => {
                            setSelectedBooking(booking);
                            modalRef.current?.showModal();
                          }}
                        >
                          <FaInfo className="text-yellow-500" />
                        </button>
                        <Tooltip
                          anchorSelect={`#view-details-btn-${booking._id}`}
                          content="View Detailed Booking Data"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Fallback message for desktop view when no sessions exist
            <div className="bg-white flex justify-center items-center py-8">
              <p className="text-red-500 font-bold italic">
                No Sessions Scheduled This Far
              </p>
            </div>
          )}
        </div>

        {/* Attending Trainer : Mobile View */}
        <div className="md:hidden">
          {TrainersBookingAcceptedData.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {TrainersBookingAcceptedData.map((booking) => (
                <div
                  key={booking._id}
                  className="border border-gray-300 rounded-md p-4 shadow-sm"
                >
                  {/* Trainer Name */}
                  <h4 className="text-lg font-semibold mb-2">
                    {booking.trainer}
                  </h4>

                  {/* Start At */}
                  <p>
                    <span className="font-semibold">Start At: </span>
                    {booking.startAt ? booking.startAt : "Not started yet"}
                  </p>

                  {/* Total Price */}
                  <p>
                    <span className="font-semibold">Total Price: </span>$
                    {booking.totalPrice}
                  </p>

                  {/* Duration */}
                  <p>
                    <span className="font-semibold">Duration: </span>
                    {booking.durationWeeks}{" "}
                    {booking.durationWeeks === 1 ? "Week" : "Weeks"}
                  </p>

                  {/* End At */}
                  <p>
                    <span className="font-semibold">Session End: </span>
                    {booking.startAt
                      ? new Date(
                          new Date(booking.startAt).setDate(
                            new Date(booking.startAt).getDate() +
                              booking.durationWeeks * 7
                          )
                        ).toLocaleDateString("en-GB")
                      : "--/--"}
                  </p>

                  {/* Action Button */}
                  <div className="mt-2">
                    <button
                      id={`view-details-btn-mobile-${booking._id}`}
                      className="w-full border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() => {
                        setSelectedBooking(booking);
                        modalRef.current?.showModal();
                      }}
                    >
                      <FaInfo className="text-yellow-500 inline-block" />{" "}
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // No bookings fallback
            <div className="flex items-center bg-gray-100 py-5 text-black italic">
              <div className="flex gap-4 mx-auto items-center">
                <FaTriangleExclamation className="text-xl text-red-500" />
                No Active Sessions at the moment.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Trainer Booking Info Modal */}
      <dialog
        ref={modalRef}
        id="User_Trainer_Booking_Info_Sessions_Modal"
        className="modal"
      >
        <UserTrainerBookingInfoModal
          selectedBooking={selectedBooking}
          closeModal={closeModal}
        />
      </dialog>
    </div>
  );
};

export default UserTrainerActiveSession;

// Utility to add 59 minutes to a given time (formatted as "HH:MM")
const add59Minutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h);
  date.setMinutes(m + 59);
  // Return the new time as "HH:MM"
  return date.toTimeString().slice(0, 5);
};

// Prop Types
UserTrainerActiveSession.propTypes = {
  TrainersBookingAcceptedData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      bookedAt: PropTypes.string,
      sessions: PropTypes.arrayOf(PropTypes.string).isRequired,
      bookerEmail: PropTypes.string,
      trainer: PropTypes.string.isRequired,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      durationWeeks: PropTypes.number.isRequired,
      status: PropTypes.string,
      acceptedAt: PropTypes.string,
      paid: PropTypes.bool,
      paidAt: PropTypes.string,
      paymentID: PropTypes.string,
      startAt: PropTypes.string,
    })
  ).isRequired,
};
