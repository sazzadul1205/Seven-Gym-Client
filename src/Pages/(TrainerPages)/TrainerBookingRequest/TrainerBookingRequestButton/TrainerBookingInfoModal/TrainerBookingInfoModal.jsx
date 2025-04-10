/* eslint-disable react/prop-types */

// Import Icons
import { ImCross } from "react-icons/im";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoMdFemale, IoMdMale } from "react-icons/io";

// Import Hooks
import Loading from "../../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../../Shared/Component/FetchingError";

// Import Package
import { useQuery } from "@tanstack/react-query";

// Format date to "DD-Month-YYYY HH:MM AM/PM"
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const amps = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${String(day).padStart(
    2,
    "0"
  )}-${month}-${year} ${hours}:${minutes} ${amps}`;
};

// Convert 'DD-MM-YYYY T HH:mm' to ISO format
const fixDateFormat = (dateStr) => {
  const parts = dateStr.split("T");
  if (parts.length === 2) {
    const [day, month, year] = parts[0].split("-");
    return `${year}-${month}-${day}T${parts[1]}:00`;
  }
  return dateStr;
};

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

// Return gender icon and label
const getGenderIcon = (gender) => {
  if (!gender) {
    return {
      icon: <MdOutlinePeopleAlt className="text-gray-500 text-3xl" />,
      label: "Not specified",
    };
  }

  const normalizedGender =
    gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();

  const genderData = {
    Male: {
      icon: <IoMdMale className="text-blue-500 text-3xl font-bold" />,
      label: "Male",
    },
    Female: {
      icon: <IoMdFemale className="text-pink-500 text-3xl font-bold" />,
      label: "Female",
    },
    Other: {
      icon: <MdOutlinePeopleAlt className="text-gray-500 text-3xl font-bold" />,
      label: "Other",
    },
  };

  return (
    genderData[normalizedGender] || {
      icon: <MdOutlinePeopleAlt className="text-gray-500 text-3xl" />,
      label: "Not specified",
    }
  );
};

// Convert 24-hour time to 12-hour AM/PM format
const formatTimeTo12Hour = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const h = parseInt(hour, 10);
  const amPm = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 === 0 ? 12 : h % 12;
  return `${formattedHour}:${minute} ${amPm}`;
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

      {/* Basic Information : Booker Info , Booking Details */}
      <div className="overflow-auto px-4 py-6 sm:px-6 md:px-8">
        <div className="flex bg-gray-200 flex-col lg:flex-row items-start lg:items-center justify-between gap-6 py-2">
          {/* Booker Info */}
          <div className="w-full lg:w-1/2 flex flex-col sm:flex-row items-center sm:items-start justify-center gap-4 sm:gap-6">
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
              <p className="text-xs sm:text-sm md:text-base italic text-gray-600">
                {BookerData?.email || "Email Unavailable"}
              </p>

              {/* Tier Badge */}
              {BookerData?.tier && (
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getTierBadge(
                    BookerData?.tier
                  )}`}
                >
                  {BookerData?.tier} Tier
                </span>
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
            <div className="flex justify-between">
              <strong>Status:</strong>
              <span>{selectedBooking?.status || "N/A"}</span>
            </div>

            {/* Booked At */}
            <div className="flex justify-between">
              <strong>Booked At:</strong>
              <span>
                {selectedBooking?.bookedAt
                  ? formatDate(fixDateFormat(selectedBooking?.bookedAt))
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
            <div className="flex md:hidden flex-col mb-6">
              {ScheduleByIDData.map((s, idx) => (
                <div
                  key={`${s.id}-${idx}`}
                  className={`border border-gray-300 cursor-pointer ${
                    invalidSessionIds.includes(s.id)
                      ? "bg-red-100 hover:bg-red-200 text-red-600 font-semibold"
                      : "bg-gray-50 hover:bg-gray-200"
                  }`}
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
          <p className="text-center text-xl font-bold">No sessions available</p>
        )}
      </div>
    </div>
  );
};

export default TrainerBookingInfoModal;


