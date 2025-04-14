import { FaInfo, FaRegClock } from "react-icons/fa";
import { formatDate } from "../../../../Utility/formatDate";
import TrainerBookingRequestUserBasicInfo from "../../TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";
import { FaTriangleExclamation } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import { useRef, useState } from "react";
import TrainerBookingInfoModal from "../../TrainerBookingRequest/TrainerBookingRequestButton/trainerBookingInfoModal/trainerBookingInfoModal";
import TrainerBookingAcceptedSetTime from "./TrainerBookingAcceptedSetTime/TrainerBookingAcceptedSetTime";

// eslint-disable-next-line react/prop-types
const TrainerScheduleParticipantAccepted = ({ TrainerBookingAcceptedData }) => {
  // console.log(TrainerBookingAcceptedData);

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
        Reserved Class Participant
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
                      {booking.startAt ? formatDate(booking.startAt) : "--/--"}
                    </td>

                    <td className="px-4 py-3">{booking.endAt || "--/--"}</td>

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

                        <Tooltip
                          anchorSelect={`#clock-details-btn-${booking._id}`}
                          content="Set Start Date"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          selectedAcceptedBooking={selectedAcceptedBooking}
        />
      </dialog>
    </div>
  );
};

export default TrainerScheduleParticipantAccepted;
