// import Packages
import PropTypes from "prop-types";

import { useQuery } from "@tanstack/react-query";

// Import Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Import Utility
import { formatDate } from "../../../Utility/formatDate";
import { fetchTierBadge } from "../../../Utility/fetchTierBadge";

// import Icons
import { FaTriangleExclamation } from "react-icons/fa6";

// Main component that displays trainer's student history
const TrainerStudentHistory = ({ TrainerStudentHistoryData }) => {
  // Extract student booking history (array of objects)
  const students = TrainerStudentHistoryData?.StudentsHistory;

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen">
      {/* Section heading */}
      <div className="text-center py-3">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Trainer Students History
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mt-1">
          See all your Students
        </p>
      </div>

      {/* Divider */}
      <div className="mx-auto bg-white w-1/3 p-[1px]" />

      {/* Students Box */}

      {students.length > 0 ? (
        // Display list of student cards in responsive grid
        <div className="grid gap-2 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-5 py-5">
          {students.map((booking, index) => (
            <StudentCard
              key={booking?._id || index} // Fallback to index if _id is missing
              email={booking.bookerEmail}
              booking={booking}
            />
          ))}
        </div>
      ) : (
        // Empty state when no students are found
        <div className="flex flex-col items-center bg-gray-100 py-5 text-black italic">
          <FaTriangleExclamation className="text-xl text-red-500 mb-2" />
          No Students
        </div>
      )}
    </div>
  );
};

// Prop Validation
TrainerStudentHistory.propTypes = {
  TrainerStudentHistoryData: PropTypes.oneOfType([
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      trainerId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      StudentsHistory: PropTypes.arrayOf(
        PropTypes.shape({
          bookerEmail: PropTypes.string.isRequired,
          ActiveTime: PropTypes.string.isRequired,
        })
      ).isRequired,
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        trainerId: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        StudentsHistory: PropTypes.arrayOf(
          PropTypes.shape({
            bookerEmail: PropTypes.string.isRequired,
            ActiveTime: PropTypes.string.isRequired,
          })
        ).isRequired,
      })
    ),
  ]).isRequired,
};

// Component to render individual student cards
const StudentCard = ({ email, booking }) => {
  const axiosPublic = useAxiosPublic();

  // Fetch student's basic info using their email
  const { data, isLoading, error } = useQuery({
    queryKey: ["UserBasicInfo", email],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${email}`).then((res) => res.data),
    enabled: !!email,
  });

  // Loading state
  if (isLoading) {
    return <span className="text-xs text-gray-500">Loading...</span>;
  }

  // Error state
  if (error || !data) {
    return (
      <span className="text-xs text-red-500">
        Error loading data for {email}
      </span>
    );
  }

  return (
    <div
      className={`p-4 flex flex-col gap-4 border border-gray-300 rounded-lg text-black shadow-sm cursor-default transform transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-gray-100 ${
        !booking.startAt ? "bg-green-100 hover:bg-green-50" : ""
      }`}
    >
      {/* Avatar + Info */}
      <div className="flex flex-col items-center gap-3 text-center">
        {/* Avatar */}
        <img
          src={data.profileImage}
          alt={data.fullName || "Student"}
          className="w-20 h-20 rounded-full object-cover border"
        />

        {/* Info */}
        <div>
          <p className="font-semibold text-lg">{data.fullName}</p>
          <p className="text-sm text-gray-600 italic">{email}</p>
        </div>
      </div>

      {/* Tier Badge */}
      <span
        className={`${fetchTierBadge(
          data?.tier
        )} px-3 py-1 rounded-full text-sm font-medium mx-auto`}
      >
        {data?.tier} Tier
      </span>

      {/* Last Booking Info */}
      <div className="flex flex-col items-center gap-1">
        <p className="font-bold text-sm">Last Booking:</p>
        <p className="text-sm text-gray-700">
          {formatDate(booking?.ActiveTime) || "N/A"}
        </p>
      </div>
    </div>
  );
};

StudentCard.propTypes = {
  email: PropTypes.string.isRequired,
  booking: PropTypes.shape({
    _id: PropTypes.string,
    bookerEmail: PropTypes.string.isRequired,
    startAt: PropTypes.string,
    ActiveTime: PropTypes.string,
  }).isRequired,
};

export default TrainerStudentHistory;
