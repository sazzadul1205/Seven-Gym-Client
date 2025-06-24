// Import Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// import icons
import { ImCross } from "react-icons/im";
import {
  FaMoneyBillAlt,
  FaClock,
  FaCalendarAlt,
  FaDotCircle,
} from "react-icons/fa";

// import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Shared
import Loading from "../../../../../Shared/Loading/Loading";
import FetchingError from "../../../../../Shared/Component/FetchingError";

// Import Basic info
import TrainerBookingRequestUserBasicInfo from "../../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";
import { InfoRow } from "../../../../(ClassManagement)/ClassAccepted/ClassAcceptedDetailsModal/ClassAcceptedDetailsModal";

// Format date string to "MMM d, yyyy", supports ISO & dd-MM-yyyy or dd/MM/yyyy formats
const formatDateToDisplay = (dateStr) => {
  if (!dateStr) return "N/A";

  // ISO parse attempt
  let date = new Date(dateStr);
  if (!isNaN(date)) {
    return formatAsMonthDayYear(date);
  }

  // Manual parse: dd-MM-yyyy or dd/MM/yyyy
  const parts = dateStr.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (parts) {
    // eslint-disable-next-line no-unused-vars
    const [_, dd, MM, yyyy] = parts;
    date = new Date(`${yyyy}-${MM}-${dd}T00:00:00`);
    if (!isNaN(date)) {
      return formatAsMonthDayYear(date);
    }
  }

  // fallback
  return dateStr;
};

// Helper function to format a Date object as "MMM d, yyyy"
const formatAsMonthDayYear = (date) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

// Format date/time for tooltip (longer format with time)
const formatDateTimeTooltip = (dateStr) => {
  if (!dateStr) return "N/A";

  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Add this helper at the top
const getStatusDate = (data) =>
  data?.rejectedAt || data?.droppedAt || data?.acceptedAt || null;

const ClassRejectedDetailsModal = ({ selectedRejectedData }) => {
  const axiosPublic = useAxiosPublic();
  const className = selectedRejectedData?.applicant?.classesName || "N/A";
  const status = selectedRejectedData?.status || "N/A";

  const applicant =
    selectedRejectedData?.applicant?.applicantData ||
    selectedRejectedData?.applicant ||
    {};

  const email =
    applicant?.email ||
    selectedRejectedData?.applicant?.applicantEmail ||
    "N/A";

  const {
    data: ClassData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ClassData", className],
    queryFn: async () =>
      axiosPublic
        .get(`/Class_Details?module=${className}`)
        .then((res) => res.data),
    enabled: className !== "N/A",
  });

  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  return (
    <div className="modal-box w-full max-w-3xl max-h-[90vh] overflow-y-auto p-0 bg-gradient-to-b from-white to-gray-100 text-gray-900 rounded-lg shadow-lg">
      {/* Modal Header */}
      <header className="flex justify-between items-center border-b border-gray-300 px-4 sm:px-6 py-3 sm:py-4 bg-white rounded-t-lg">
        <h3 className="text-md md:text-xl font-semibold tracking-wide">
          Class Booking {status} Details
        </h3>
        <ImCross
          className="text-xl text-gray-600 hover:text-red-600 cursor-pointer transition-colors"
          onClick={() =>
            document.getElementById("Class_Reject_Details_Modal")?.close()
          }
        />
      </header>

      {/* Modal Body */}
      <section className="px-4 sm:px-8 py-6 space-y-6 sm:space-y-8">
        {/* Class & User Info */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex items-center gap-4 sm:gap-5">
            {ClassData?.icon && (
              <img
                src={ClassData.icon}
                alt={`${className} icon`}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-md border border-gray-300 shadow-sm"
              />
            )}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">{className}</h2>
              <p className="text-sm text-gray-600 capitalize tracking-wide">
                Duration: {selectedRejectedData?.applicant?.duration || "N/A"}
              </p>
            </div>
          </div>

          <div className="md:mt-0 mt-2">
            <TrainerBookingRequestUserBasicInfo email={email} />
          </div>
        </div>

        {/* Grid Info Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Total Price */}
          <InfoRow
            icon={<FaMoneyBillAlt className="text-green-600" />}
            label="Total Price"
            value={`$${selectedRejectedData?.applicant?.totalPrice ?? "N/A"}`}
          />

          {/* Submitted Date */}
          <InfoRow
            icon={<FaCalendarAlt className="text-blue-600" />}
            label="Submitted At"
            value={formatDateTimeTooltip(
              selectedRejectedData?.applicant?.submittedDate
            )}
          />

          {/* Rejected / Dropped At */}
          {getStatusDate(selectedRejectedData) && (
            <InfoRow
              icon={<FaClock className="text-indigo-600" />}
              label="Rejected / Dropped At"
              value={formatDateTimeTooltip(getStatusDate(selectedRejectedData))}
            />
          )}

          {/* Paid At (if paid) */}
          {selectedRejectedData?.paidAt && (
            <InfoRow
              icon={<FaClock className="text-green-600" />}
              label="Paid At"
              value={formatDateTimeTooltip(selectedRejectedData?.paidAt)}
            />
          )}

          {/* Start Date */}
          {selectedRejectedData?.startDate && (
            <InfoRow
              icon={<FaCalendarAlt className="text-blue-600" />}
              label="Start Date"
              value={formatDateToDisplay(selectedRejectedData.startDate)}
            />
          )}

          {/* Refund Amount (only if Dropped and refund given) */}
          {selectedRejectedData?.status === "Dropped" &&
            selectedRejectedData?.refundAmount && (
              <InfoRow
                icon={<FaMoneyBillAlt className="text-red-500" />}
                label="Refunded Amount"
                value={`$${selectedRejectedData.refundAmount}`}
              />
            )}

          {/* Reason */}
          {selectedRejectedData?.reason && (
            <InfoRow
              icon={<FaDotCircle className="text-red-500" />}
              label="Reason"
              value={selectedRejectedData.reason}
            />
          )}

          {/* Status */}
          <InfoRow
            icon={<FaDotCircle className="text-blue-600" />}
            label="Status"
            value={status}
          />
        </section>
      </section>
    </div>
  );
};

// Prop Validation
ClassRejectedDetailsModal.propTypes = {
  selectedRejectedData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  id: PropTypes.string,
};

export default ClassRejectedDetailsModal;
