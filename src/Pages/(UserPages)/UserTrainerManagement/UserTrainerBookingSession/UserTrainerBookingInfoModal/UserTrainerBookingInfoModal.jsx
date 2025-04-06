/* eslint-disable react/prop-types */

// import Packages
import { useQuery } from "@tanstack/react-query";

// Import Hooks
import Loading from "../../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../../Shared/Component/FetchingError";

// import Icons
import { ImCross } from "react-icons/im";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoMdMale, IoMdFemale } from "react-icons/io"; // Add this import

function formatDate(dateStr) {
  const date = new Date(dateStr);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" }); // Full month name (e.g., "April")
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure two digits for minutes

  // Convert to 12-hour format and determine AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  // Format: DD-MM(written)-YYYY HH:MM AM/PM
  return `${String(day).padStart(
    2,
    "0"
  )}-${month}-${year} ${hours}:${minutes} ${ampm}`;
}

const fixDateFormat = (dateStr) => {
  // If the date format is 'DD-MM-YYYYTHH:mm', convert it to 'YYYY-MM-DDTHH:mm:ss'
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

const UserTrainerBookingInfoModal = ({ selectedBooking }) => {
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

  console.log(selectedBooking);

  return (
    <div className="modal-box min-w-5xl p-0 bg-gradient-to-b from-white to-gray-100 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Booked Sessions Details</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document.getElementById("User_Trainer_Booking_Info_Modal")?.close()
          }
        />
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-between gap-5 px-6 py-4">
        {/* Trainers Data */}
        <div className="w-1/2 flex justify-center items-center gap-5">
          {/* Profile Image */}
          <img
            src={SelectedTrainerData?.imageUrl || "/default-profile.png"}
            alt={SelectedTrainerData?.name || "Trainer"}
            className="w-32 h-32 rounded-full shadow-md object-cover"
            loading="lazy"
          />

          {/* Name, Specialization, Badge */}
          <div className="space-y-2">
            {/* Name and Gender */}
            <div className="flex items-center justify-center gap-3">
              <p className="text-2xl font-bold">
                {SelectedTrainerData?.name || "Unknown Trainer"}
              </p>
              {icon}
            </div>

            {/* Specialization */}
            <p className="text-lg font-medium italic">
              {SelectedTrainerData?.specialization ||
                "Specialization Not Available"}
            </p>

            {/* Tier Badge */}
            {SelectedTrainerData?.tier && (
              <span
                className={`inline-block px-6 py-1 rounded-full text-sm font-semibold ${getTierBadge(
                  SelectedTrainerData?.tier
                )}`}
              >
                {SelectedTrainerData?.tier} Tier
              </span>
            )}
          </div>
        </div>

        {/* Details Information */}
        <div className="w-1/2 p-5 space-y-2 border-l-2 border-black">
          {/* Duration Weeks */}
          <div className="flex justify-between gap-5">
            <strong>Duration (Weeks):</strong>{" "}
            {selectedBooking?.durationWeeks === 1
              ? "1 Week"
              : `${selectedBooking?.durationWeeks} Weeks`}
          </div>

          {/* Total Price */}
          <div className="flex justify-between gap-5">
            <strong>Total Price:</strong>
            {selectedBooking?.totalPrice === "free"
              ? "Free"
              : `$ ${selectedBooking?.totalPrice}`}
          </div>

          {/* Status */}
          <div className="flex justify-between gap-5">
            <strong>Status:</strong>
            {selectedBooking?.status}
          </div>

          {/* Booked At */}
          <div className="flex justify-between gap-5">
            <strong>Booked At:</strong>
            {selectedBooking?.bookedAt
              ? formatDate(fixDateFormat(selectedBooking?.bookedAt))
              : "N/A"}
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="p-3">
        <h3 className="text-lg font-semibold py-2">Session Bookings</h3>
        {ScheduleByIDData?.length > 0 ? (
          <>
            {/* Desktop View */}
            <div className="hidden md:flex">
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
                    <th className="px-4 py-2 border-b bg-gray-300">Time</th>
                    <th className="px-4 py-2 border-b bg-gray-300">Price</th>
                  </tr>
                </thead>

                {/* Table Content */}
                <tbody>
                  {ScheduleByIDData?.map((s, idx) => (
                    <tr key={`${s.id}-${idx}`} className="bg-gray-50">
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
                      <td className="px-4 py-2">{`$ ${s.classPrice}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="flex md:hidden flex-col space-y-4 mb-6">
              {ScheduleByIDData.map((s, idx) => (
                <div
                  key={`${s.id}-${idx}`}
                  className={`text-black text-center ${
                    idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } rounded-xl p-5 shadow-md`}
                >
                  <h4 className="text-xl font-semibold">{s.classType}</h4>
                  <p>{formatDate(s.day)}</p>
                  <div className="flex justify-center gap-2">
                    <p>{formatTimeTo12Hour(s.start)}</p>
                    <span>-</span>
                    <p>{formatTimeTo12Hour(s.end)}</p>
                  </div>
                  <p className="font-bold text-lg">{`$${s.classPrice}`}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-xl">No sessions available</p>
        )}
      </div>
    </div>
  );
};

export default UserTrainerBookingInfoModal;
