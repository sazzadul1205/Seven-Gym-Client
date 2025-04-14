import { useRef, useState } from "react";

// Import Icons
import { MdDelete } from "react-icons/md";
import { FaInfo, FaRegClock } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

// Import Package
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Utility
import { calculateEndAt } from "./calculateEndAt";
import { formatDate } from "../../../../Utility/formatDate";
import { formatDateWithTextMonth } from "./formatDateWithTextMonth ";

// import Component & Modal
import TrainerBookingAcceptedSetTime from "./TrainerBookingAcceptedSetTime/TrainerBookingAcceptedSetTime";
import TrainerBookingInfoModal from "../../TrainerBookingRequest/TrainerBookingRequestButton/trainerBookingInfoModal/trainerBookingInfoModal";
import TrainerBookingRequestUserBasicInfo from "../../TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

const TrainerScheduleParticipantAccepted = ({
  refetch,
  TrainerBookingAcceptedData,
}) => {
  // Ref to control modal visibility using native <dialog> element
  const modalRef = useRef(null);

  // State to track which booking is selected for modal view
  const [selectedBooking, setSelectedBooking] = useState(null);

  // State to track which booking is selected for modal view
  const [selectedAcceptedBooking, setSelectedAcceptedBooking] = useState(null);

  // Modal close handler
  const closeModal = () => {
    modalRef.current?.close();
    setSelectedBooking(null);
  };

  return (
    <div className="px-5 pb-5">
      {/* Section Title */}
      <p className="text-xl font-semibold text-black border-b-2 border-gray-700 pb-2">
        Accepted Class Participant
      </p>

      {/* Accepted Bookings Data */}
      {TrainerBookingAcceptedData.length > 0 ? (
        <>
          {/* Accepted Bookings : Desktop View */}
          <div className="hidden md:block">
            <table className="min-w-full bg-white text-black">
              {/* Accepted Bookings Header */}
              <thead className="bg-gray-800 text-white text-sm uppercase">
                <tr>
                  {[
                    "Booker",
                    "Accepted At",
                    "Total Price",
                    "Duration",
                    "Status",
                    "Start At",
                    "End At",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 border-b border-gray-600 text-left"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Accepted Bookings Body */}
              <tbody>
                {TrainerBookingAcceptedData.map((booking) => (
                  <tr
                    key={booking._id}
                    className={`transition-colors duration-200 hover:bg-gray-100 border-b border-gray-500 ${
                      !booking.startAt ? "bg-green-100 hover:bg-green-50" : ""
                    }`}
                  >
                    {/* Booker Info */}
                    <td className="px-4 py-3 font-medium">
                      <TrainerBookingRequestUserBasicInfo
                        email={booking.bookerEmail}
                      />
                    </td>

                    {/* Accepted At */}
                    <td className="px-4 py-3">
                      {formatDate(booking.acceptedAt)}
                    </td>

                    {/* Class Price */}
                    <td className="px-4 py-3">
                      {booking?.totalPrice === "free"
                        ? "Free"
                        : `$ ${booking?.totalPrice}`}
                    </td>

                    {/* Class Duration */}
                    <td className="px-4 py-3">
                      {booking.durationWeeks}{" "}
                      {booking.durationWeeks === 1 ? "Week" : "Weeks"}
                    </td>

                    {/* If Paid or Not */}
                    <td className="px-4 py-3 font-bold capitalize">
                      {booking.paid ? "Paid" : "Not Paid"}
                    </td>

                    {/* Start At */}
                    <td className="px-4 py-3">
                      {booking.startAt
                        ? formatDateWithTextMonth(booking.startAt)
                        : "--/--"}
                    </td>

                    {/* End At */}
                    <td className="px-4 py-3">
                      {booking.endAt
                        ? formatDateWithTextMonth(booking.endAt)
                        : booking.startAt
                        ? formatDateWithTextMonth(
                            calculateEndAt(
                              booking.startAt,
                              booking.durationWeeks
                            )
                          )
                        : "--/--"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {/* View Info Button */}
                        <button
                          id={`view-details-btn-${booking._id}`}
                          className="border-2 border-yellow-500 bg-yellow-100 hover:bg-yellow-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() => {
                            setSelectedBooking(booking);
                            modalRef.current?.showModal();
                          }}
                        >
                          <FaInfo className="text-yellow-500" />
                        </button>
                        <Tooltip
                          anchorSelect={`#view-details-btn-${booking._id}`}
                          content="View Detailed Booking Info"
                        />

                        {/* Conditionally Show "Set Time" Button */}
                        {!booking.startAt && (
                          <button
                            id={`clock-details-btn-${booking._id}`}
                            className="border-2 border-green-500 bg-green-100 hover:bg-green-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={() => {
                              document
                                .getElementById(
                                  "User_Trainer_Accepted_Time_Set"
                                )
                                .showModal();
                              setSelectedAcceptedBooking(booking);
                            }}
                          >
                            <FaRegClock className="text-green-500" />
                          </button>
                        )}

                        {/* Conditionally Show "Set Time" Button */}
                        {booking.startAt && (
                          <button
                            id={`drop-details-btn-${booking._id}`}
                            className="border-2 border-red-500 bg-red-100 hover:bg-red-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={() => {
                              document
                                .getElementById(
                                  "User_Trainer_Accepted_Time_Set"
                                )
                                .showModal();
                              setSelectedAcceptedBooking(booking);
                            }}
                          >
                            <MdDelete className="text-red-500" />
                          </button>
                        )}

                        <Tooltip
                          anchorSelect={`#drop-details-btn-${booking._id}`}
                          content="Drop Session"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Accepted Bookings : Mobile View */}
          <div className="md:hidden space-y-4 text-black">
            {TrainerBookingAcceptedData.map((booking) => (
              <div
                key={booking._id}
                className="p-4 rounded-lg shadow-md border bg-white"
              >
                {/* User Info */}
                <div className="mb-2 font-medium">
                  <TrainerBookingRequestUserBasicInfo
                    email={booking.bookerEmail}
                  />
                </div>

                {/* Booking Data */}
                <div className="text-sm space-y-1">
                  {/* Accept */}
                  <div className="flex justify-between">
                    <strong>Accept At:</strong> {formatDate(booking.acceptedAt)}
                  </div>
                  {/* Price */}
                  <p className="flex justify-between">
                    <strong>Price:</strong>{" "}
                    {booking?.totalPrice === "free"
                      ? "Free"
                      : `$ ${booking?.totalPrice}`}
                  </p>
                  {/* Duration */}
                  <p className="flex justify-between">
                    <strong>Duration:</strong> {booking.durationWeeks}{" "}
                    {booking.durationWeeks === 1 ? "Week" : "Weeks"}
                  </p>
                  {/* Status */}
                  <p className="flex justify-between">
                    <strong>Status:</strong>{" "}
                    {booking.paid ? "Paid" : "Not Paid"}
                  </p>

                  {/* Start At */}
                  <p className="flex justify-between">
                    <strong>Start At:</strong>{" "}
                    {booking.startAt
                      ? formatDateWithTextMonth(booking.startAt)
                      : "--/--"}
                  </p>

                  {/* End At */}
                  <p className="flex justify-between">
                    <strong>End At:</strong>{" "}
                    {booking.endAt
                      ? formatDateWithTextMonth(booking.endAt)
                      : booking.startAt
                      ? formatDateWithTextMonth(
                          calculateEndAt(booking.startAt, booking.durationWeeks)
                        )
                      : "--/--"}
                  </p>
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex justify-end mt-3 gap-2">
                  <div className="flex items-center gap-2">
                    {/* View Info Button */}
                    <button
                      id={`view-details-btn-${booking._id}`}
                      className="border-2 border-yellow-500 bg-yellow-100 hover:bg-yellow-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() => {
                        setSelectedBooking(booking);
                        modalRef.current?.showModal();
                      }}
                    >
                      <FaInfo className="text-yellow-500" />
                    </button>
                    <Tooltip
                      anchorSelect={`#view-details-btn-${booking._id}`}
                      content="View Detailed Booking Info"
                    />

                    {/* Conditionally Show "Set Time" Button */}
                    {!booking.startAt && (
                      <button
                        id={`clock-details-btn-${booking._id}`}
                        className="border-2 border-green-500 bg-green-100 hover:bg-green-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                        onClick={() => {
                          document
                            .getElementById("User_Trainer_Accepted_Time_Set")
                            .showModal();
                          setSelectedAcceptedBooking(booking);
                        }}
                      >
                        <FaRegClock className="text-green-500" />
                      </button>
                    )}

                    {/* Conditionally Show "Set Time" Button */}
                    {booking.startAt && (
                      <button
                        id={`drop-details-btn-${booking._id}`}
                        className="border-2 border-red-500 bg-red-100 hover:bg-red-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                        onClick={() => {
                          document
                            .getElementById("User_Trainer_Accepted_Time_Set")
                            .showModal();
                          setSelectedAcceptedBooking(booking);
                        }}
                      >
                        <MdDelete className="text-red-500" />
                      </button>
                    )}

                    <Tooltip
                      anchorSelect={`#drop-details-btn-${booking._id}`}
                      content="Drop Session"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Fallback display when no accepted bookings exist
        <div className="flex flex-col items-center bg-gray-100 py-5 text-black italic">
          <FaTriangleExclamation className="text-xl text-red-500 mb-2" />
          <span>No accepted bookings available.</span>
        </div>
      )}

      {/* Booking Details Modal */}
      <dialog
        ref={modalRef}
        id="User_Trainer_Booking_Info_Modal"
        className="modal"
      >
        <TrainerBookingInfoModal
          closeModal={closeModal}
          selectedBooking={selectedBooking}
        />
      </dialog>

      {/* Booking Details Modal */}
      <dialog id="User_Trainer_Accepted_Time_Set" className="modal">
        <TrainerBookingAcceptedSetTime
          refetch={refetch}
          selectedAcceptedBooking={selectedAcceptedBooking}
        />
      </dialog>
    </div>
  );
};

// Prop Type Validation
TrainerScheduleParticipantAccepted.propTypes = {
  TrainerBookingAcceptedData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      bookerEmail: PropTypes.string.isRequired,
      acceptedAt: PropTypes.string.isRequired,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      durationWeeks: PropTypes.number.isRequired,
      paid: PropTypes.bool.isRequired,
      startAt: PropTypes.string,
      endAt: PropTypes.string,
    })
  ).isRequired,
  refetch: PropTypes.func,
};

export default TrainerScheduleParticipantAccepted;
