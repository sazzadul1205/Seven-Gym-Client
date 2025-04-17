import { FaInfo } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";

import { formatDate } from "../../../Utility/formatDate";
import { useEffect, useRef, useState } from "react";
import TrainerBookingInfoModal from "../TrainerBookingRequest/TrainerBookingRequestButton/trainerBookingInfoModal/trainerBookingInfoModal";
import TrainerBookingRequestUserBasicInfo from "../TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";
import { calculateEndAt } from "../TrainerScheduleParticipant/TrainerScheduleParticipantAccepted/calculateEndAt";
import { formatDateWithTextMonth } from "../TrainerScheduleParticipant/TrainerScheduleParticipantAccepted/formatDateWithTextMonth ";

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
const TrainerScheduleHistory = ({ TrainerBookingHistoryData }) => {
  console.log(TrainerBookingHistoryData);

  const [now, setNow] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const closeModal = () => {
    modalRef.current?.close();
    setSelectedBooking(null);
  };

  // Convert "dd-mm-yyyyTHH:MM" into a JS Date object safely
  const parseCustomDate = (dateStr) => {
    const [datePart, timePart] = dateStr.split("T");
    const [day, month, year] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute);
  };

  // Sort data by most recent bookedAt
  const sortedHistory = [...TrainerBookingHistoryData].sort(
    (a, b) => parseCustomDate(b.bookedAt) - parseCustomDate(a.bookedAt)
  );

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen">
      {/* Page Title */}
      <div className="text-center py-3">
        <h3 className="text-xl font-semibold">Booking History</h3>
      </div>

      {/* Divider */}
      <div className="mx-auto bg-white w-1/3 p-[1px]" />

{/* Completed Class */}
      <div className="py-4 px-4 md:px-10">
        <h3 className="bg-gray-800 text-xl font-semibold py-2 text-center border-b-2 border-gray-100 ">
          Completed Classes{" "}
        </h3>
        {sortedHistory?.length > 0 ? (
          <div className="hidden md:block overflow-x-auto rounded shadow-sm border border-gray-300">
            <table className="min-w-full bg-white">
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

              <tbody className="text-sm text-gray-700">
                {[...TrainerBookingHistoryData]
                  .filter((booking) => booking?.status === "Ended")
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
                      parseCustomDate(b.bookedAt) - parseCustomDate(a.bookedAt)
                    );
                  })
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

                        {/* Booked At */}
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
                        <td className="px-4 py-3 font-bold">
                          {booking.status}
                        </td>

                        {/* Reason */}
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
                            content="View Detailed Booking Info"
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center bg-gray-100 py-5 text-black italic">
            <div className="flex gap-4 mx-auto items-center">
              <FaTriangleExclamation className="text-xl text-red-500" />
              No Booking History Found.
            </div>
          </div>
        )}
      </div>

      <div className="py-4 px-4 md:px-10">
        {sortedHistory?.length > 0 ? (
          <div className="hidden md:block overflow-x-auto rounded shadow-sm border border-gray-300">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-800 text-white text-sm uppercase">
                <tr>
                  {[
                    "Bookie",
                    "Booked At",
                    "Total Price",
                    "Duration",
                    "Status",
                    "reason",
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

              <tbody className="text-sm text-gray-700">
                {sortedHistory.map((booking) => {
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
                          content="View Detailed Booking Info"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center bg-gray-100 py-5 text-black italic">
            <div className="flex gap-4 mx-auto items-center">
              <FaTriangleExclamation className="text-xl text-red-500" />
              No Booking History Found.
            </div>
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
