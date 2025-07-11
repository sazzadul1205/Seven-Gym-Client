// Import Icons
import { ImCross } from "react-icons/im";

// Import Hooks
import Loading from "../../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../../Shared/Component/FetchingError";

// Import Package
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Import Utility
import { formatTimeTo12Hour } from "../../../../../Utility/formatTimeTo12Hour";
import { getGenderIcon } from "../../../../../Utility/getGenderIcon";
import { formatDate } from "../../../../../Utility/formatDate";

// Return style string for tier badge
const getTierBadge = (tier) => {
  const tierStyles = {
    Bronze: "bg-orange-600 text-white ring-2 ring-orange-300 shadow-lg",
    Silver: "bg-gray-400 text-white ring-2 ring-gray-200 shadow-lg",
    Gold: "bg-yellow-500 text-white ring-2 ring-yellow-300 shadow-lg",
    Diamond: "bg-blue-600 text-white ring-2 ring-blue-300 shadow-lg",
    Platinum: "bg-gray-800 text-white ring-2 ring-gray-500 shadow-lg",
  };

  return tierStyles[tier] || "bg-gray-200 text-gray-700 ring-2 ring-gray-300";
};

const TrainerBookingInfoModal = ({
  closeModal,
  selectedBooking,
  bookingValidity,
  bookingInvalidReason,
}) => {
  const axiosPublic = useAxiosPublic();

  // Fetch Booker Data
  const {
    data: BookerData,
    isLoading: BookerIsLoading,
    error: BookerError,
  } = useQuery({
    queryKey: ["BookerData", selectedBooking?.bookerEmail],
    queryFn: () =>
      axiosPublic
        .get(`/Users?email=${selectedBooking?.bookerEmail}`)
        .then((res) => res.data),
    enabled: !!selectedBooking?.bookerEmail,
  });

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

  // Loading state
  if (BookerIsLoading || ScheduleByIDDataIsLoading) return <Loading />;

  // Error handling
  if (BookerError || ScheduleByIDDataError) return <FetchingError />;

  let invalidSessionIds = [];
  if (!bookingValidity && bookingInvalidReason) {
    const match = bookingInvalidReason.match(/session id:\s*(.+)$/i);
    if (match) {
      invalidSessionIds = match[1]
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
    }
  }

  // Get the gender icon for the user
  const { icon } = getGenderIcon(BookerData?.gender);

  return (
    <div className="modal-box max-w-5xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Booked Sessions Details</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => closeModal()}
        />
      </div>

      {!bookingValidity && bookingInvalidReason && (
        <div className="px-5 pt-4">
          <p className="text-sm text-red-600 font-semibold">
            ❗ {bookingInvalidReason}
          </p>
        </div>
      )}

      {(!bookingValidity || selectedBooking?.status === "Ended") && (
        <div className="px-5 pt-4">
          <p className="text-sm text-red-600 font-semibold">
            {selectedBooking?.status === "Ended"
              ? "❗ Status Ended"
              : `❗ ${bookingInvalidReason}`}
          </p>
        </div>
      )}

      {/* Basic Information : Booker Info , Booking Details */}
      <div className="overflow-auto px-4 py-6 sm:px-6 md:px-8">
        <div className="flex bg-gray-200 flex-col lg:flex-row items-start lg:items-center justify-between gap-6 py-2">
          {/* Booker Info */}
          <div className="w-full lg:w-1/2 flex flex-col sm:flex-row items-center sm:items-start px-5 gap-4 sm:gap-6">
            {/* Image */}
            <img
              src={BookerData?.profileImage || "/default-profile.png"}
              alt={BookerData?.fullName || "Trainer"}
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full shadow-md object-cover"
              loading="lazy"
            />

            {/* Booker Content */}
            <div className="items-center text-left my-auto space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <p className="text-xl sm:text-2xl font-bold">
                  {BookerData?.fullName || "Unknown Trainer"}
                </p>
                {icon}
              </div>

              {/* Email */}
              <p className="text-center md:text-left italic text-gray-600">
                {BookerData?.email || "Email Unavailable"}
              </p>

              {/* Tier Badge */}
              {BookerData?.tier && (
                <div className="w-full flex justify-center sm:justify-start">
                  <p
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getTierBadge(
                      BookerData?.tier
                    )}`}
                  >
                    {BookerData?.tier} Tier
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="w-full md:w-1/2 border-l-2 border-gray-400 px-5 py-2 text-sm sm:text-base space-y-2">
            {/* Duration */}
            <div className="flex justify-between">
              <strong>Duration (Weeks):</strong>
              <span>
                {selectedBooking?.durationWeeks === 1
                  ? "1 Week"
                  : `${selectedBooking?.durationWeeks} Weeks`}
              </span>
            </div>

            {/* Total Price */}
            <div className="flex justify-between">
              <strong>Total Price:</strong>
              <span>
                {selectedBooking?.totalPrice === "free"
                  ? "Free"
                  : `$${selectedBooking?.totalPrice}`}
              </span>
            </div>

            {/* Status */}
            <div className={`flex justify-between`}>
              <strong>Status:</strong>
              <span>{selectedBooking?.status || "N/A"}</span>
            </div>

            {/* Booked At */}
            <div className="flex justify-between">
              <strong>Booked At:</strong>
              <span>
                {selectedBooking?.bookedAt
                  ? formatDate(selectedBooking?.bookedAt)
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

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
                  <tr className="bg-gray-300">
                    {["Day", "Class Code", "Class Type", "Time", "Price"].map(
                      (head, i) => (
                        <th key={i} className="px-4 py-2 border-b text-center">
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                {/* Table Content */}
                <tbody>
                  {ScheduleByIDData?.map((s, idx) => (
                    <tr
                      key={`${s.id}-${idx}`}
                      className={`border border-gray-300 cursor-pointer ${
                        invalidSessionIds.includes(s.id)
                          ? "bg-red-100 hover:bg-red-200 text-red-600 font-semibold"
                          : "bg-gray-50 hover:bg-gray-200"
                      }`}
                    >
                      {/* Day */}
                      <td className="px-4 py-3">{s.day}</td>

                      {/* Class Code */}
                      <td className="px-4 py-3">{s.id}</td>

                      {/* Class Type */}
                      <td className="px-4 py-3">{s.classType}</td>

                      {/* Time */}
                      <td className="px-4 py-3 text-center">
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
                      <td className="px-4 py-3">
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
            <div className="flex md:hidden flex-col gap-4 mb-6">
              {ScheduleByIDData.map((s, idx) => (
                <div
                  key={`${s.id}-${idx}`}
                  className={`rounded-xl shadow-md transition-all duration-200 border ${
                    invalidSessionIds.includes(s.id)
                      ? "bg-red-50 border-red-300 text-red-700"
                      : "bg-white border-gray-200 text-gray-800"
                  } p-4`}
                >
                  {/* Top Row: Day & ID */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">
                      {s.day} : {formatTimeTo12Hour(s.time)}
                    </span>
                  </div>

                  {/* Class Type */}
                  <p className="text-lg font-bold mb-1">{s.classType}</p>

                  {/* Time */}
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="font-medium">Time:</span>
                    <span>
                      {formatTimeTo12Hour(s.start)} -{" "}
                      {formatTimeTo12Hour(s.end)}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Price:</span>
                    <span className="font-bold">
                      {s.classPrice === "free" || s.classPrice === "Free"
                        ? "Free"
                        : `$${s.classPrice}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // If No Session Available
          <p className="text-center text-xl font-bold">No sessions available</p>
        )}
      </div>
    </div>
  );
};

TrainerBookingInfoModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  selectedBooking: PropTypes.shape({
    bookerEmail: PropTypes.string,
    sessions: PropTypes.arrayOf(PropTypes.string),
    durationWeeks: PropTypes.number,
    totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    bookedAt: PropTypes.string,
  }),
  bookingValidity: PropTypes.bool,
  bookingInvalidReason: PropTypes.string,
};

export default TrainerBookingInfoModal;
