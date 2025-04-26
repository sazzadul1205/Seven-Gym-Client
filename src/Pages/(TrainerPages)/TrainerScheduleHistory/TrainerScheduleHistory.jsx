import { useEffect, useRef, useState } from "react";

// import Icons
import { FaTriangleExclamation } from "react-icons/fa6";

// Import Utility
import { formatDate } from "../../../Utility/formatDate";
import { calculateEndAt } from "../TrainerScheduleParticipant/TrainerScheduleParticipantAccepted/calculateEndAt";
import { formatDateWithTextMonth } from "../TrainerScheduleParticipant/TrainerScheduleParticipantAccepted/formatDateWithTextMonth ";

// Import Modal
import TrainerBookingInfoModal from "../TrainerBookingRequest/TrainerBookingRequestButton/trainerBookingInfoModal/trainerBookingInfoModal";

// import Component
import TrainerBookingRequestUserBasicInfo from "../TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

// Import Button
import ViewDetailsButton from "./ViewDetailsButton";

// Status background color
const getStatusBackgroundColor = (status) => {
  switch (status) {
    case "Accepted":
      return "bg-green-100 hover:bg-green-200";
    case "Rejected":
      return "bg-red-100 hover:bg-red-200";
    case "Expired":
      return "bg-gray-200 hover:bg-gray-300";
    default:
      return "bg-white";
  }
};

/* eslint-disable react/prop-types */
const TrainerScheduleHistory = ({
  TrainerBookingHistoryData,
  TrainerBookingAcceptedData,
}) => {
  // State to hold the current time, updated every minute
  const [setNow] = useState(new Date());

  // State to keep track of the currently selected booking (for modal view)
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Ref for controlling the modal programmatically
  const modalRef = useRef(null);

  // useEffect to update the current time every 60 seconds (1 minute)
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date()); // Update time to trigger re-renders or freshness checks
    }, 60000); // 60000ms = 1 minute

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [setNow]);

  // Function to close the modal and reset selected booking state
  const closeModal = () => {
    modalRef.current?.close(); // Safely close modal if ref is defined
    setSelectedBooking(null); // Clear selected booking
  };

  // Function to safely parse a date string formatted as "dd-mm-yyyyTHH:MM" into a JS Date object
  const parseCustomDate = (dateStr) => {
    const [datePart, timePart] = dateStr.split("T");
    const [day, month, year] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute);
  };

  // Create a new sorted array of booking history based on most recent 'bookedAt' first
  const sortedHistory = [...TrainerBookingHistoryData].sort(
    (a, b) => parseCustomDate(b.bookedAt) - parseCustomDate(a.bookedAt)
  );

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400  min-h-screen">
      {/* Page Title */}
      <div className="text-center py-3">
        <h3 className="text-xl font-semibold">Booking History</h3>
      </div>

      {/* Divider */}
      <div className="mx-auto bg-white w-1/3 p-[1px]" />

      {/* Accepted Pending Classes */}
      <div className="py-4 px-4 md:px-10">
        {/* Accepted Pending Classes : Title */}
        <h3 className="bg-gray-800 text-xl font-semibold py-2 text-center border-b-2 border-gray-100 ">
          Pending Classes
        </h3>

        {/* Accepted Pending Classes : Content */}
        {TrainerBookingAcceptedData.length > 0 ? (
          <>
            {/* Accepted Pending Classes : Table  */}
            <div className="hidden md:block overflow-x-auto rounded shadow-sm border border-gray-300">
              <table className="min-w-full bg-white">
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
                <tbody className="text-sm text-gray-700">
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
                        {booking.status === "Ended" ? (
                          <span className="font-bold text-red-600">Ended</span>
                        ) : booking.endAt ? (
                          formatDateWithTextMonth(booking.endAt)
                        ) : booking.startAt ? (
                          formatDateWithTextMonth(
                            calculateEndAt(
                              booking.startAt,
                              booking.durationWeeks
                            )
                          )
                        ) : (
                          "--/--"
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3">
                        <ViewDetailsButton
                          id={`view-details-btn-${booking._id}`}
                          onClick={() => {
                            setSelectedBooking(booking);
                            modalRef.current?.showModal();
                          }}
                          tooltip="View Detailed Booking Info"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Accepted Pending Classes : Mobile View */}
            <div className="md:hidden space-y-4 text-black">
              {TrainerBookingAcceptedData.map((booking) => (
                <div
                  key={booking._id}
                  className={`border border-gray-300 rounded-md shadow-sm p-4 bg-white space-y-2 ${
                    !booking.startAt ? "bg-green-100" : ""
                  }`}
                >
                  {/* Booker Info */}
                  <div>
                    <TrainerBookingRequestUserBasicInfo
                      email={booking.bookerEmail}
                    />
                  </div>

                  {/* Accepted At */}
                  <div className="flex justify-between">
                    <span className="font-semibold">Accepted At: </span>
                    {formatDate(booking.acceptedAt)}
                  </div>

                  {/* Total Price */}
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Price: </span>
                    {booking?.totalPrice === "free"
                      ? "Free"
                      : `$ ${booking?.totalPrice}`}
                  </div>

                  {/* Duration */}
                  <div className="flex justify-between">
                    <span className="font-semibold">Duration: </span>
                    {booking.durationWeeks}{" "}
                    {booking.durationWeeks === 1 ? "Week" : "Weeks"}
                  </div>

                  {/* Payment Status */}
                  <div className="flex justify-between">
                    <span className="font-semibold">Status: </span>
                    {booking.paid ? (
                      <p className="text-green-500 font-bold">Paid</p>
                    ) : (
                      <p className="text-red-500 font-bold">Not Paid</p>
                    )}
                  </div>

                  {/* Start At */}
                  <div className="flex justify-between">
                    <span className="font-semibold">Start At: </span>
                    {booking.startAt
                      ? formatDateWithTextMonth(booking.startAt)
                      : "--/--"}
                  </div>

                  {/* End At */}
                  <div className="flex justify-between">
                    <span className="font-semibold">End At: </span>
                    {booking.status === "Ended" ? (
                      <span className="font-bold text-red-600">Ended</span>
                    ) : booking.endAt ? (
                      formatDateWithTextMonth(booking.endAt)
                    ) : booking.startAt ? (
                      formatDateWithTextMonth(
                        calculateEndAt(booking.startAt, booking.durationWeeks)
                      )
                    ) : (
                      "--/--"
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end">
                    <ViewDetailsButton
                      id={`view-details-btn-${booking._id}-mobile`}
                      onClick={() => {
                        setSelectedBooking(booking);
                        modalRef.current?.showModal();
                      }}
                      tooltip="View Detailed Booking Info"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Fallback display when no accepted bookings exist
          <div className="flex flex-col items-center bg-gray-100 py-5 text-black italic">
            <FaTriangleExclamation className="text-xl text-red-500 mb-2" />
            No Accepted Bookings Available
          </div>
        )}
      </div>

      {/* Completed Class */}
      <div className="py-4 px-4 md:px-10">
        {/* Completed Classes : Title */}
        <h3 className="bg-gray-800 text-xl font-semibold py-2 text-center border-b-2 border-gray-100 ">
          Completed Classes
        </h3>

        {/* Completed Classes: Content */}
        {sortedHistory?.length > 0 ? (
          <>
            {/* Accepted Pending Classes : Table  */}
            <div className="hidden md:block overflow-x-auto rounded shadow-sm border border-gray-300">
              <table className="min-w-full bg-white">
                {/* Accepted Bookings : Header */}
                <thead className="bg-gray-800 text-white text-sm uppercase">
                  <tr>
                    {[
                      "Bookie",
                      "Paid At",
                      "Start At",
                      "Total Price",
                      "Duration",
                      "Status",
                      "End At",
                      "Action",
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

                {/* Accepted Bookings : Body */}
                <tbody className="text-sm text-gray-700">
                  {[...TrainerBookingHistoryData]
                    // Filter So Only Ended are Shown
                    .filter((booking) => booking?.status === "Ended")

                    // Sort By Recent
                    .sort((a, b) => {
                      const parseCustomDate = (dateStr) => {
                        const [datePart, timePart] = dateStr.split("T");
                        const [day, month, year] = datePart
                          .split("-")
                          .map(Number);
                        const [hour, minute] = timePart.split(":").map(Number);
                        return new Date(year, month - 1, day, hour, minute);
                      };
                      return (
                        parseCustomDate(b.bookedAt) -
                        parseCustomDate(a.bookedAt)
                      );
                    })

                    // Add index to display serial number
                    .map((booking) => {
                      const rowBg = getStatusBackgroundColor(booking.status);

                      return (
                        <tr
                          key={booking._id}
                          className={`transition-colors duration-200 border-b border-gray-500 ${rowBg}`}
                        >
                          {/* Booker Info */}
                          <td className="px-4 py-3 font-medium">
                            <TrainerBookingRequestUserBasicInfo
                              email={booking?.bookerEmail}
                            />
                          </td>

                          {/* Booked At */}
                          <td className="px-4 py-3">
                            {formatDate(booking.paidAt)}
                          </td>

                          {/* Start At */}
                          <td className="px-4 py-3">
                            {formatDateWithTextMonth(booking.startAt)}
                          </td>

                          {/* Total Price */}
                          <td className="px-4 py-3">
                            {booking?.totalPrice === "free"
                              ? "Free"
                              : `$ ${booking?.totalPrice}`}
                          </td>

                          {/* Duration */}
                          <td className="px-4 py-3">
                            {booking.durationWeeks}{" "}
                            {booking.durationWeeks === 1 ? "Week" : "Weeks"}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3 font-bold">Completed</td>

                          {/* Ended At */}
                          <td className="px-4 py-3 text-center font-semibold">
                            {formatDateWithTextMonth(
                              calculateEndAt(
                                booking.startAt,
                                booking.durationWeeks
                              )
                            )}
                          </td>

                          {/* Action */}
                          <td className="px-4 py-3">
                            <ViewDetailsButton
                              id={`view-details-btn-${booking._id}`}
                              onClick={() => {
                                setSelectedBooking(booking);
                                modalRef.current?.showModal();
                              }}
                              tooltip="View Detailed Booking Info"
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Ended Bookings : Mobile View */}
            <div className="md:hidden space-y-4 text-black">
              {[...TrainerBookingHistoryData]
                // Show Only Ended
                .filter((booking) => booking?.status === "Ended")

                // Sort by Most Recent
                .sort((a, b) => {
                  const parseCustomDate = (dateStr) => {
                    const [datePart, timePart] = dateStr.split("T");
                    const [day, month, year] = datePart.split("-").map(Number);
                    const [hour, minute] = timePart.split(":").map(Number);
                    return new Date(year, month - 1, day, hour, minute);
                  };
                  return (
                    parseCustomDate(b.bookedAt) - parseCustomDate(a.bookedAt)
                  );
                })

                .map((booking) => {
                  const rowBg = getStatusBackgroundColor(booking.status);

                  return (
                    <div
                      key={booking._id}
                      className={`border border-gray-300 rounded-md shadow-sm p-4 bg-white space-y-2 ${rowBg}`}
                    >
                      {/* Booker Info */}
                      <div>
                        <TrainerBookingRequestUserBasicInfo
                          email={booking?.bookerEmail}
                        />
                      </div>

                      {/* Paid At */}
                      <div className="flex justify-between">
                        <span className="font-semibold">Paid At: </span>
                        {formatDate(booking.paidAt)}
                      </div>

                      {/* Start At */}
                      <div className="flex justify-between">
                        <span className="font-semibold">Start At: </span>
                        {formatDateWithTextMonth(booking.startAt)}
                      </div>

                      {/* Total Price */}
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Price: </span>
                        {booking?.totalPrice === "free"
                          ? "Free"
                          : `$ ${booking?.totalPrice}`}
                      </div>

                      {/* Duration */}
                      <div className="flex justify-between">
                        <span className="font-semibold">Duration: </span>
                        {booking.durationWeeks}{" "}
                        {booking.durationWeeks === 1 ? "Week" : "Weeks"}
                      </div>

                      {/* Status */}
                      <div className="flex justify-between">
                        <span className="font-semibold">Status: </span>
                        <span className="font-bold">Completed</span>
                      </div>

                      {/* End At */}
                      <div className="flex justify-between">
                        <span className="font-semibold">Ended At: </span>
                        {formatDateWithTextMonth(
                          calculateEndAt(booking.startAt, booking.durationWeeks)
                        )}
                      </div>

                      {/* Action */}
                      <div className="flex justify-end">
                        <ViewDetailsButton
                          id={`view-details-btn-${booking._id}-mobile`}
                          onClick={() => {
                            setSelectedBooking(booking);
                            modalRef.current?.showModal();
                          }}
                          tooltip="View Detailed Booking Info"
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        ) : (
          // Fallback display when no Completed bookings exist
          <div className="flex flex-col items-center bg-gray-100 py-5 text-black italic">
            <FaTriangleExclamation className="text-xl text-red-500" />
            No Booking Completed Found.
          </div>
        )}
      </div>

      {/* Canceled Classes */}
      <div className="py-4 px-4 md:px-10">
        {/* Canceled Classes : Title */}
        <h3 className="bg-gray-800 text-xl font-semibold py-2 text-center border-b-2 border-gray-100 ">
          Canceled Classes
        </h3>

        {/* Canceled Classes : Content */}
        {sortedHistory?.length > 0 ? (
          <>
            {/* Pre-filtered history */}
            {/** Filter out bookings with status "Ended" */}
            {(() => {
              const filteredHistory = sortedHistory.filter(
                (booking) => booking.status.toLowerCase() !== "ended"
              );

              return (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto rounded shadow-sm border border-gray-300">
                    <table className="min-w-full bg-white">
                      {/* Table Header */}
                      <thead className="bg-gray-800 text-white text-sm uppercase">
                        <tr>
                          {[
                            "Bookie",
                            "Booked At",
                            "Total Price",
                            "Duration",
                            "Status",
                            "Reason",
                            "Action",
                          ].map((header) => (
                            <th
                              key={header}
                              className="px-4 py-3 border-b border-gray-600"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      {/* Table Body */}
                      <tbody className="text-sm text-center text-gray-700">
                        {filteredHistory.map((booking) => {
                          const rowBg = getStatusBackgroundColor(
                            booking.status
                          );

                          return (
                            <tr
                              key={booking._id}
                              className={`transition-colors duration-200 border-b border-gray-500 ${rowBg}`}
                            >
                              {/* Booker Info */}
                              <td className="px-4 py-3 font-medium">
                                <TrainerBookingRequestUserBasicInfo
                                  email={booking?.bookerEmail}
                                />
                              </td>

                              {/* Booked At */}
                              <td className="px-4 py-3">
                                {formatDate(booking.bookedAt)}
                              </td>

                              {/* Total Price */}
                              <td className="px-4 py-3">
                                {booking?.totalPrice === "free"
                                  ? "Free"
                                  : `$ ${booking?.totalPrice}`}
                              </td>

                              {/* Duration */}
                              <td className="px-4 py-3">
                                {booking.durationWeeks}{" "}
                                {booking.durationWeeks === 1 ? "Week" : "Weeks"}
                              </td>

                              {/* Status */}
                              <td className="px-4 py-3 font-bold capitalize">
                                {booking.status}
                              </td>

                              {/* Reason */}
                              <td className="px-4 py-3 text-center font-semibold">
                                {booking.reason}
                              </td>

                              {/* Action */}
                              <td className="px-4 py-3">
                                <ViewDetailsButton
                                  id={`view-details-btn-${booking._id}`}
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    modalRef.current?.showModal();
                                  }}
                                  tooltip="View Detailed Booking Info"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden space-y-4 text-black">
                    {filteredHistory.map((booking) => {
                      const rowBg = getStatusBackgroundColor(booking.status);

                      return (
                        <div
                          key={booking._id}
                          className={`border border-gray-300 rounded-md shadow-sm p-4 bg-white space-y-2 ${rowBg}`}
                        >
                          {/* Booker Info */}
                          <div>
                            <TrainerBookingRequestUserBasicInfo
                              email={booking?.bookerEmail}
                            />
                          </div>

                          {/* Booked At */}
                          <div className="flex justify-between">
                            <span className="font-semibold">Booked At: </span>
                            {formatDate(booking.bookedAt)}
                          </div>

                          {/* Total Price */}
                          <div className="flex justify-between">
                            <span className="font-semibold">Total Price: </span>
                            {booking?.totalPrice === "free"
                              ? "Free"
                              : `$ ${booking?.totalPrice}`}
                          </div>

                          {/* Duration */}
                          <div className="flex justify-between">
                            <span className="font-semibold">Duration: </span>
                            {booking.durationWeeks}{" "}
                            {booking.durationWeeks === 1 ? "Week" : "Weeks"}
                          </div>

                          {/* Status */}
                          <div className="flex justify-between">
                            <span className="font-semibold">Status: </span>
                            <span className="font-bold capitalize">
                              {booking.status}
                            </span>
                          </div>

                          {/* Reason */}
                          <div className="text-center">
                            <p className="font-semibold">Reason: </p>
                            <p>{booking.reason}</p>
                          </div>

                          {/* Action */}
                          <div className="flex justify-end">
                            <ViewDetailsButton
                              id={`view-details-btn-${booking._id}-mobile`}
                              onClick={() => {
                                setSelectedBooking(booking);
                                modalRef.current?.showModal();
                              }}
                              tooltip="View Detailed Booking Info"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </>
        ) : (
          <div className="flex flex-col items-center bg-gray-100 py-5 text-black italic">
            <FaTriangleExclamation className="text-xl text-red-500" />
            No Booking Canceled History Found.
          </div>
        )}
      </div>

      {/* Modal */}
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
    </div>
  );
};

export default TrainerScheduleHistory;
