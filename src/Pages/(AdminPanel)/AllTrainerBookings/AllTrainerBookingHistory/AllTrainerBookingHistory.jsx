/* eslint-disable react/prop-types */
import dayjs from "dayjs";
import TrainerBookingRequestUserBasicInfo from "../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";
import BookedTrainerBasicInfo from "../../../../Shared/Component/BookedTrainerBasicInfo";
import { useState } from "react";
import { FaInfo } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

const AllTrainerBookingHistory = ({ AllTrainerBookingHistoryData }) => {
  // Cache to store loaded user data by email for reuse
  const [userInfoCache, setUserInfoCache] = useState({});

  console.log(AllTrainerBookingHistoryData);

  return (
    <>
      {/* Page Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          All Trainer Bookings History
        </h3>
      </div>

      {/* Table */}
      {AllTrainerBookingHistoryData.length > 0 ? (
        <div className="overflow-x-auto">
          {/* Data Table */}
          <table className="min-w-full table-auto border border-gray-300 text-sm">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Booker</th>
                <th className="px-4 py-2">Trainer</th>
                <th className="px-4 py-2">Sessions</th>
                <th className="px-4 py-2">Duration</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Booked At</th>
                <th className="px-4 py-2">Reason / End</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {AllTrainerBookingHistoryData?.map((booking, idx) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  {/* Serial Number */}
                  <td className="px-4 py-2">{idx + 1}</td>

                  {/* Booker User Information */}
                  <td className="border px-4 py-2">
                    <TrainerBookingRequestUserBasicInfo
                      email={booking.bookerEmail}
                      renderUserInfo={(user) => {
                        // Cache user info
                        if (!userInfoCache[booking.bookerEmail]) {
                          setUserInfoCache((prev) => ({
                            ...prev,
                            [booking.bookerEmail]: user,
                          }));
                        }
                        return (
                          <div className="flex items-center gap-2">
                            {/* Avatar */}
                            <div className="border-r-2 pr-2 border-black">
                              <img
                                src={user.profileImage}
                                alt={user.fullName}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            </div>

                            {/* Name + Email */}
                            <div>
                              <span className="font-medium block leading-tight">
                                {user.fullName}
                              </span>
                              <span className="text-xs ">{user.email}</span>
                            </div>
                          </div>
                        );
                      }}
                    />
                  </td>

                  {/* Booker Trainer Information */}
                  <td className="border px-4 py-2">
                    <BookedTrainerBasicInfo
                      trainerID={booking.trainerId}
                      py={1}
                    />
                  </td>

                  {/* Sessions Count */}
                  <td className="border px-4 py-2">
                    {booking.sessions.length} session
                    {booking.sessions.length > 1 ? "s" : ""}
                  </td>

                  {/* Duration */}
                  <td className="border px-4 py-2">
                    {booking.durationWeeks}{" "}
                    {booking.durationWeeks === 1 ? "week" : "weeks"}
                  </td>

                  {/* Price */}
                  <td className="border px-4 py-2">
                    {booking.totalPrice === "Free" ||
                    parseFloat(booking.totalPrice) === 0
                      ? "Free"
                      : `$ ${booking.totalPrice}`}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-2">
                    {booking.status === "Ended" ? "Completed" : booking.status}
                  </td>

                  {/* Booked At */}
                  <td className="border px-4 py-2">
                    {(() => {
                      const raw = booking.bookedAt;
                      const fixed = raw.length === 16 ? raw + ":00" : raw;
                      const [datePart, timePart] = fixed.split("T");
                      const [day, month, year] = datePart.split("-");
                      const iso = `${year}-${month}-${day}T${timePart}`;
                      const date = new Date(iso);
                      return date.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      });
                    })()}
                  </td>

                  {/* Reasons */}
                  <td className="border px-4 py-2">
                    {booking.reason ? (
                      booking.reason
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">Ended :</p>
                        <p>
                          {dayjs(booking.startAt)
                            .add(booking.durationWeeks, "week")
                            .format("MMM D, YYYY")}
                        </p>
                      </div>
                    )}
                  </td>

                  {/* Action */}
                  <td className="border px-4 py-2">
                    <button
                      id={`view-details-btn-${booking._id}`}
                      className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() => {
                        // setSelectedBooking(booking);
                        // modalRef.current?.showModal();
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
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-200 p-4">
          <p className="text-center font-semibold text-black">
            No Booking History Available.
          </p>
        </div>
      )}
    </>
  );
};

export default AllTrainerBookingHistory;
