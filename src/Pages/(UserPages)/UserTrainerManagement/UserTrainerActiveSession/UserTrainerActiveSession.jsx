import { useRef, useState } from "react";

// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Utility
import { formatTimeTo12Hour } from "../../../../Utility/formatTimeTo12Hour";

// Import Icons
import { FaDotCircle, FaInfo } from "react-icons/fa";

// Import Modal
import UserTrainerBookingInfoModal from "../UserTrainerBookingSession/UserTrainerBookingInfoModal/UserTrainerBookingInfoModal";

// Import Components
import BookedTrainerBasicInfo from "../../../../Shared/Component/BookedTrainerBasicInfo";

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
                            No Scheduled
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
        <div className="flex flex-col md:hidden bg-white">
          {TrainersBookingAcceptedData.length > 0 ? (
            daysOfWeek.map((day) => (
              <div key={day} className="border border-gray-700 p-3">
                <div className="flex justify-center items-center gap-2 py-2 border-b border-gray-700">
                  <FaDotCircle />
                  <h4>{day}</h4>
                </div>
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

      {/* Attending Trainer */}
      <div className="py-3">
        {/* Section Header */}
        <h3 className="bg-[#A1662F] text-white text-lg border border-white font-semibold text-center py-2">
          Attending Trainer Table
        </h3>

        {/* Conditional Rendering Based on Booking Data Availability */}
        {TrainersBookingAcceptedData.length > 0 ? (
          <>
            {/* Attending Trainer : Desktop View */}
            <div className="overflow-x-auto hidden md:block">
              <table className="table-auto w-full text-sm text-center text-black shadow-md border-collapse ">
                {/* Table Header */}
                <thead>
                  <tr className="bg-[#A1662F] text-white">
                    {[
                      "Trainer",
                      "Start At",
                      "Total Price",
                      "Duration",
                      "Session End",
                      "Status",
                      "Paid",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2 text-left border border-white"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {TrainersBookingAcceptedData.map((b) => (
                    <tr
                      key={b._id}
                      className="border-b border-gray-500 bg-gray-50 hover:bg-gray-200 px-5"
                    >
                      {/* Trainer Name */}
                      <td className="px-2">
                        <BookedTrainerBasicInfo
                          trainerID={b.trainerId}
                          py={3}
                        />
                      </td>

                      {/* Start Time */}
                      <td>
                        {b.startAt || (
                          <span className="text-red-500 font-bold">
                            Not started yet
                          </span>
                        )}
                      </td>

                      {/* Price Formatting (Free or Amount) */}
                      <td>
                        {String(b.totalPrice).toLowerCase() === "free"
                          ? "Free"
                          : `$ ${b.totalPrice}`}
                      </td>

                      {/* Duration in Weeks */}
                      <td>
                        {b.durationWeeks}{" "}
                        {b.durationWeeks === 1 ? "Week" : "Weeks"}
                      </td>

                      {/* Calculated Session End Date */}
                      <td>
                        {b.startAt
                          ? new Date(
                              new Date(b.startAt).setDate(
                                new Date(b.startAt).getDate() +
                                  b.durationWeeks * 7
                              )
                            ).toLocaleDateString("en-GB")
                          : "--/--"}
                      </td>

                      {/* Booking Status */}
                      <td>{b.status}</td>

                      {/* Payment Status */}
                      <td>{b.paid ? "Paid" : "Unpaid"}</td>

                      {/* View Details Button */}
                      <td>
                        <button
                          id={`view-details-btn-${b._id}`}
                          className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 hover:scale-105 transition-transform cursor-pointer "
                          onClick={() => {
                            setSelectedBooking(b);
                            modalRef.current?.showModal();
                          }}
                        >
                          <FaInfo className="text-yellow-500" />
                        </button>

                        {/* Tooltip for the Button */}
                        <Tooltip
                          anchorSelect={`#view-details-btn-${b._id}`}
                          content="View Detailed Booking Data"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Attending Trainer : Mobile View */}
            <div className="flex md:hidden flex-col space-y-1">
              {TrainersBookingAcceptedData.map((b) => (
                <div
                  key={b._id}
                  className="border-b-2 border-gray-800 bg-gray-50 p-4"
                >
                  {/* Trainer Name */}
                  <BookedTrainerBasicInfo trainerID={b.trainerId} py={3} />

                  {/* Start Time */}
                  <div className="flex justify-between items-center pt-1">
                    <p className="font-semibold">Start At:</p>{" "}
                    <p>
                      {b.startAt || (
                        <span className="text-red-500 font-bold">
                          Not started yet
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Total Price */}
                  <p className="flex justify-between items-center pt-1">
                    <span className="font-semibold">Total Price:</span>{" "}
                    {String(b.totalPrice).toLowerCase() === "free"
                      ? "Free"
                      : `$ ${b.totalPrice}`}
                  </p>

                  {/* Duration */}
                  <p className="flex justify-between items-center pt-1">
                    <span className="font-semibold">Duration:</span>{" "}
                    {b.durationWeeks} {b.durationWeeks === 1 ? "Week" : "Weeks"}
                  </p>

                  {/* Calculated Session End */}
                  <p className="flex justify-between items-center pt-1">
                    <span className="font-semibold">Session End:</span>{" "}
                    {b.startAt
                      ? new Date(
                          new Date(b.startAt).setDate(
                            new Date(b.startAt).getDate() + b.durationWeeks * 7
                          )
                        ).toLocaleDateString("en-GB")
                      : "--/--"}
                  </p>

                  {/* View Details Button */}
                  <div className="flex justify-end items-center mt-4">
                    <button
                      id={`view-details-btn-mobile-${b._id}`}
                      className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105"
                      onClick={() => {
                        setSelectedBooking(b);
                        modalRef.current?.showModal();
                      }}
                    >
                      <FaInfo className="text-yellow-500 inline-block" />{" "}
                    </button>
                    <Tooltip
                      anchorSelect={`#view-details-btn-${b._id}`}
                      content="View Detailed Booking Data"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Fallback Message When No Booking Data Exists
          <div className="bg-white flex justify-center py-8">
            <p className="text-red-500 font-bold italic">
              No Sessions Scheduled So Far
            </p>
          </div>
        )}
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
