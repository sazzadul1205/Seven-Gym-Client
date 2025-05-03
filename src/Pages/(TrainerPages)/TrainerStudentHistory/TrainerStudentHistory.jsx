// import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

import { useQuery } from "@tanstack/react-query";

// Import Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Import Utility
import { formatDate } from "../../../Utility/formatDate";
import { fetchTierBadge } from "../../../Utility/fetchTierBadge";

// import Icons
import { MdRateReview } from "react-icons/md";
import { FaTriangleExclamation } from "react-icons/fa6";

// Main component that displays trainer's student history
const TrainerStudentHistory = ({ TrainerStudentHistoryData }) => {
  // Extract student booking history (array of objects)
  const students = TrainerStudentHistoryData?.StudentsHistory || [];

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

TrainerStudentHistory.propTypes = {
  TrainerStudentHistoryData: PropTypes.oneOfType([
    // Case for a single object
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
    // Case for an array of objects
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
      className={`p-4 flex flex-col gap-4 transition-colors duration-200 hover:bg-gray-100 border border-gray-300 rounded-lg text-black shadow-sm cursor-default transform hover:-translate-y-1
        ${!booking.startAt ? "bg-green-100 hover:bg-green-50" : ""}`}
    >
      {/* Top Row: Avatar, Info */}
      <div className="flex md:flex-col flex-col sm:items-center sm:gap-4">
        {/* Student Avatar */}
        <img
          src={data.profileImage}
          alt={data.fullName || "Student"}
          className="w-16 h-16 rounded-full object-cover border sm:w-20 sm:h-20"
        />

        {/* Student Info */}
        <div className="flex-1 mt-2 sm:mt-0">
          <p className="font-semibold text-base sm:text-lg">{data.fullName}</p>
          <p className="text-xs text-gray-600 italic">{email}</p>
        </div>
      </div>

      {/* Tier Badge based on user tier */}
      <span
        className={`${fetchTierBadge(
          data?.tier
        )} flex items-center justify-center text-center  mx-auto`}
      >
        {data?.tier} Tier
      </span>

      {/* Bottom Row: Last Booking Info & Review Button */}
      <div className="flex flex-row sm:items-center justify-between gap-1 sm:gap-0">
        {/* Last Booking Info */}
        <div className="space-y-1">
          <p className="font-bold text-sm sm:text-base">Last Booking:</p>
          <p className="text-sm font-normal">
            {formatDate(booking?.ActiveTime) || "N/A"}
          </p>
        </div>

        {/* Review/Info Button with Tooltip */}
        <div>
          <button
            id={`view-details-btn-${booking._id}`}
            className="border-2 border-green-500 bg-green-200 hover:bg-green-300 rounded-full p-2 hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <MdRateReview className="text-green-500" />
          </button>

          {/* Tooltip for Review button */}
          <Tooltip
            anchorSelect={`#view-details-btn-${booking._id}`}
            content="View Review"
          />
        </div>
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
