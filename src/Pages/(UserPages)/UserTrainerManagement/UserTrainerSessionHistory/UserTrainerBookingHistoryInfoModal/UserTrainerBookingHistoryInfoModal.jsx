// import Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Import Hooks
import Loading from "../../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../../Shared/Component/FetchingError";

// import Icons
import { ImCross } from "react-icons/im";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoMdMale, IoMdFemale } from "react-icons/io";

function formatDate(dateStr) {
  const date = new Date(dateStr);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" }); // Full month name (e.g., "April")
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure two digits for minutes

  // Convert to 12-hour format and determine AM/PM
  const amps = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  // Format: DD-MM(written)-YYYY HH:MM AM/PM
  return `${String(day).padStart(
    2,
    "0"
  )}-${month}-${year} ${hours}:${minutes} ${amps}`;
}

const fixDateFormat = (dateStr) => {
  // If the date format is 'DD-MM-YYYY T HH:mm', convert it to 'YYYY-MM-DDTHH:mm:ss'
  const parts = dateStr.split("T");
  if (parts.length === 2) {
    const [day, month, year] = parts[0].split("-");
    return `${year}-${month}-${day}T${parts[1]}:00`; // Add the seconds to make it a valid ISO string
  }
  return dateStr; // Return original if format is not recognized
};

// Get Tier Badge
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

// Get Gender Icon
const getGenderIcon = (gender) => {
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
    genderData[gender] || {
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

const UserTrainerBookingHistoryInfoModal = ({ selectedBooking }) => {
  const axiosPublic = useAxiosPublic();

  // Fetch Trainer Data
  const {
    data: TrainerData,
    isLoading: TrainerDataIsLoading,
    error: TrainerDataError,
  } = useQuery({
    queryKey: ["TrainerData", selectedBooking?.trainer],
    queryFn: () =>
      axiosPublic
        .get(`/Trainers?name=${selectedBooking?.trainer}`)
        .then((res) => res.data),
    enabled: !!selectedBooking?.trainer,
  });

  // Unpack trainer data
  const SelectedTrainerData = TrainerData?.[0] || {};

  // Get the gender icon
  const { icon } = getGenderIcon(SelectedTrainerData?.gender);

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

  // Load management
  if (TrainerDataIsLoading || ScheduleByIDDataIsLoading) return <Loading />;

  // Error Management
  if (TrainerDataError || ScheduleByIDDataError) return <FetchingError />;

  return (
    <div className="modal-box max-w-5xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Booked Sessions Details</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document
              .getElementById("User_Trainer_Booking_History_Info_Modal")
              ?.close()
          }
        />
      </div>

      {/* Scrollable Body */}
      <div className="overflow-auto px-4 py-6 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Trainer Info */}
          <div className="w-full lg:w-1/2 flex flex-col sm:flex-row items-center sm:items-start justify-center gap-4 sm:gap-6">
            {/* If valid data exists, render full trainer info */}
            {SelectedTrainerData?.name ? (
              <>
                {/* Image */}
                <img
                  src={SelectedTrainerData?.imageUrl || "/default-profile.png"}
                  alt={SelectedTrainerData?.name || "Trainer"}
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full shadow-md object-cover"
                  loading="lazy"
                />

                {/* Trainer Content */}
                <div className="text-center sm:text-left space-y-1">
                  {/* Name */}
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <p className="text-xl sm:text-2xl font-bold">
                      {SelectedTrainerData?.name || "Unknown Trainer"}
                    </p>
                    {icon}
                  </div>

                  {/* Specialization */}
                  <p className="text-xs sm:text-sm md:text-base italic text-gray-600">
                    {SelectedTrainerData?.specialization ||
                      "Specialization Not Available"}
                  </p>

                  {/* Tier Badge */}
                  {SelectedTrainerData?.tier && (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getTierBadge(
                        SelectedTrainerData?.tier
                      )}`}
                    >
                      {SelectedTrainerData?.tier} Tier
                    </span>
                  )}
                </div>
              </>
            ) : (
              // If data is invalid or discontinued, just show name
              <>
                {/* Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full shadow-md object-cover bg-gray-500 " />

                <div className="text-center sm:text-left space-y-1">
                  {/* Name */}
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <p className="text-xl sm:text-2xl font-bold">
                      {selectedBooking?.trainer}
                    </p>
                    <MdOutlinePeopleAlt className="text-gray-500 text-3xl font-bold" />
                  </div>

                  {/* Specialization */}
                  <p className="text-xs sm:text-sm md:text-base italic text-gray-600">
                    No Specialization
                  </p>

                  {/* Tier Badge */}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-gray-200 text-gray-700 ring-2 ring-gray-300`}
                  >
                    No Badge
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Booking Details */}
          <div className="w-full lg:w-1/2 mt-6 lg:mt-0 p-4 sm:p-6 border-t sm:border-t-0 sm:border-l-2 border-gray-300">
            <div className="space-y-4 text-sm sm:text-base">
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
                  <tr>
                    <th className="px-4 py-2 border-b bg-gray-300">Day</th>
                    <th className="px-4 py-2 border-b bg-gray-300">
                      Class Code
                    </th>
                    <th className="px-4 py-2 border-b bg-gray-300">
                      Class Type
                    </th>
                    <th className="px-4 py-2 border-b bg-gray-300 text-center">
                      Time
                    </th>
                    <th className="px-4 py-2 border-b bg-gray-300">Price</th>
                  </tr>
                </thead>

                {/* Table Content */}
                <tbody>
                  {ScheduleByIDData?.map((s, idx) => (
                    <tr
                      key={`${s.id}-${idx}`}
                      className="bg-gray-50 hover:bg-gray-200 border border-gray-300 cursor-pointer"
                    >
                      {/* Day */}
                      <td className="px-4 py-2">{s.day}</td>

                      {/* Class Code */}
                      <td className="px-4 py-2">{s.id}</td>

                      {/* Class Type */}
                      <td className="px-4 py-2">{s.classType}</td>

                      {/* Time */}
                      <td className="px-4 py-2 text-center">
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
                      <td className="px-4 py-2">
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
                  className={`text-black text-center ${
                    idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } md:rounded-xl p-5 shadow-md border-2 border-gray-300`}
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
                    {" "}
                    {s.classPrice === "free" || s.classPrice === "Free"
                      ? "Free"
                      : `$ ${s.classPrice}`}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : selectedBooking?.sessions?.length > 0 ? (
          <div className="p-4 space-y-2 text-sm sm:text-base">
            <h4 className="font-semibold text-center mb-2">
              Session IDs (Fallback)
            </h4>
            <ul className="list-disc list-inside text-center">
              {selectedBooking.sessions.map((id, idx) => (
                <li key={`${id}-${idx}`} className="text-gray-700">
                  {id}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center text-xl">No sessions available</p>
        )}
      </div>
    </div>
  );
};

UserTrainerBookingHistoryInfoModal.propTypes = {
  selectedBooking: PropTypes.shape({
    trainer: PropTypes.string.isRequired,
    sessions: PropTypes.arrayOf(PropTypes.string).isRequired,
    durationWeeks: PropTypes.number.isRequired,
    totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    status: PropTypes.string,
    bookedAt: PropTypes.string,
  }).isRequired,
};

export default UserTrainerBookingHistoryInfoModal;
