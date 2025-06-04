/* eslint-disable react/prop-types */
import dayjs from "dayjs";
import { FaInfo } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import TrainerBookingRequestUserBasicInfo from "../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";
import BookedTrainerBasicInfo from "../../../../Shared/Component/BookedTrainerBasicInfo";
import { useState } from "react";

const AllTrainerBookingAccepted = ({ AllTrainerBookingAcceptedData }) => {
  // Cache to store loaded user data by email for reuse
  const [userInfoCache, setUserInfoCache] = useState({});
  return (
    <>
      {/* Page Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          All Trainer Bookings Accepted
        </h3>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto p-4">
        <table className="min-w-full bg-white border border-gray-300 text-sm text-left">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Booker</th>
              <th className="px-4 py-2">Trainer</th>
              <th className="px-4 py-2">Sessions</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Start Date</th>
              <th className="px-4 py-2">Payment</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {AllTrainerBookingAcceptedData?.map((booking, idx) => (
              <tr key={booking._id} className="border-b hover:bg-gray-50">
                <td className="border px-4 py-2">{idx + 1}</td>

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

                <td className="border px-4 py-2">
                  {booking.sessions?.length} session
                  {booking.sessions?.length > 1 ? "s" : ""}
                </td>

                <td className="border px-4 py-2">
                  {booking.durationWeeks}{" "}
                  {booking.durationWeeks === 1 ? "week" : "weeks"}
                </td>

                <td className="border px-4 py-2">
                  {booking.totalPrice === "Free" ||
                  parseFloat(booking.totalPrice) === 0
                    ? "Free"
                    : `$ ${booking.totalPrice}`}
                </td>

                <td className="border px-4 py-2">{booking.status}</td>

                <td className="border px-4 py-2">
                  {dayjs(booking.startAt).format("MMM D, YYYY")}
                </td>

                <td className="border px-4 py-2">
                  {booking.paid ? (
                    <span className="text-green-600 font-medium">Paid</span>
                  ) : (
                    <span className="text-red-600 font-medium">Unpaid</span>
                  )}
                </td>

                <td className="border px-4 py-2">
                  <button
                    id={`view-accepted-${booking._id}`}
                    className="border-2 border-blue-500 bg-blue-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                  >
                    <FaInfo className="text-blue-500" />
                  </button>
                  <Tooltip
                    anchorSelect={`#view-accepted-${booking._id}`}
                    content="View Accepted Booking Details"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AllTrainerBookingAccepted;
