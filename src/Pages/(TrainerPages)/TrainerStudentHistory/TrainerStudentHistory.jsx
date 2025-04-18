import { FaTriangleExclamation } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { fetchTierBadge } from "../../../Utility/fetchTierBadge";
import { formatDate } from "../../../Utility/formatDate";
import { Tooltip } from "react-tooltip";
import { MdRateReview } from "react-icons/md";

/* eslint-disable react/prop-types */
const TrainerStudentHistory = ({ TrainerStudentHistoryData }) => {
  const students = TrainerStudentHistoryData?.StudentsHistory || [];

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen">
      {/* Page Title */}
      <div className="text-center py-3">
        <h3 className="text-xl font-semibold">My Student&apos;s</h3>
      </div>

      {/* Divider */}
      <div className="mx-auto bg-white w-1/3 p-[1px]" />

      {/* Students List */}
      <div className="py-4 px-4 md:px-10">
        {students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {students.map((booking) => (
              <StudentCard
                key={booking._id}
                email={booking.bookerEmail}
                booking={booking}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center bg-gray-100 py-5 text-black italic">
            <FaTriangleExclamation className="text-xl text-red-500 mb-2" />
            No Students
          </div>
        )}
      </div>
    </div>
  );
};

const StudentCard = ({ email, booking }) => {
  const axiosPublic = useAxiosPublic();

  const { data, isLoading, error } = useQuery({
    queryKey: ["UserBasicInfo", email],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${email}`).then((res) => res.data),
    enabled: !!email,
  });

  if (isLoading) {
    return <span className="text-xs text-gray-500">Loading...</span>;
  }

  if (error || !data) {
    return (
      <span className="text-xs text-red-500">
        Error loading data for {email}
      </span>
    );
  }

  return (
    <div
      className={`p-4 flex flex-col gap-2 transition-colors duration-200 hover:bg-gray-100 border border-gray-300 rounded-lg text-black shadow-sm cursor-default ${
        !booking.startAt ? "bg-green-100 hover:bg-green-50" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <img
          src={data.profileImage}
          alt={data.fullName || "Student"}
          className="w-16 h-16 rounded-full object-cover border"
        />

        {/* User Info */}
        <div className="flex-1">
          <p className="font-semibold">{data.fullName}</p>
          <p className="text-xs text-gray-600 italic">{email}</p>
        </div>

        {/* Tier Badge */}
        <span
          className={`${fetchTierBadge(
            data?.tier
          )} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md whitespace-nowrap`}
        >
          {data?.tier} Tier
        </span>
      </div>

      {/* Booking Info */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="font-bold text-sm">Last Booking:</p>
          <p className="text-sm font-normal">
            {formatDate(booking?.ActiveTime) || "N/A"}
          </p>
        </div>

        {/* Info Button with Tooltip */}
        <div>
          <button
            id={`view-details-btn-${booking._id}`}
            className="border-2 border-yellow-500 bg-yellow-100 hover:bg-yellow-200 rounded-full p-2 hover:scale-105 transition-transform duration-200 cursor-pointer "
          >
            <MdRateReview className="text-yellow-500" />
          </button>

          {/* Tooltip (assuming react-tooltip v5+) */}
          <Tooltip
            anchorSelect={`#view-details-btn-${booking._id}`}
            content="View Review"
          />
        </div>
      </div>
    </div>
  );
};

export default TrainerStudentHistory;
