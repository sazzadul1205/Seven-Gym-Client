/* eslint-disable react/prop-types */
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../../Shared/Loading/Loading";
import FetchingError from "../../../../../Shared/Component/FetchingError";
import { IoMdFemale, IoMdMale } from "react-icons/io";
import { MdOutlinePeopleAlt } from "react-icons/md";

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

// Get Gender Icon with normalization to ensure correct lookup
const getGenderIcon = (gender) => {
  if (!gender) {
    return {
      icon: <MdOutlinePeopleAlt className="text-gray-500 text-3xl" />,
      label: "Not specified",
    };
  }
  // Normalize: make first letter uppercase and rest lowercase
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

const TrainerBookingInfoModal = ({ selectedBooking, closeModal }) => {
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

  // Loading state
  if (BookerIsLoading) return <Loading />;

  // Error handling
  if (BookerError) return <FetchingError />;

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

      {/* Scrollable Body */}
      <div className="overflow-auto px-4 py-6 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
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
            <div className="text-center sm:text-left space-y-1">
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
    </div>
  );
};

export default TrainerBookingInfoModal;
