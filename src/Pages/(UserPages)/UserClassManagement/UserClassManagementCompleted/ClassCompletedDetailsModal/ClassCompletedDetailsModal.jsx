// Import Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// import icons
import { ImCross } from "react-icons/im";
import {
  FaMoneyBillAlt,
  FaClock,
  FaCalendarAlt,
  FaHourglassEnd,
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

// Calculate days left from today to a given date string
const calculateDaysLeft = (dateStr) => {
  if (!dateStr) return null;

  let endDate = new Date(dateStr);
  if (isNaN(endDate)) {
    // Try manual parse dd-MM-yyyy or dd/MM/yyyy
    const parts = dateStr.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (parts) {
      // eslint-disable-next-line no-unused-vars
      const [_, dd, MM, yyyy] = parts;
      endDate = new Date(`${yyyy}-${MM}-${dd}T00:00:00`);
    }
  }
  if (isNaN(endDate)) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 ? diffDays : null;
};

const ClassCompletedDetailsModal = ({ selectedBookingCompletedData }) => {
  const axiosPublic = useAxiosPublic();

  console.log("|", selectedBookingCompletedData);

  // Get class name or fallback to "N/A"
  const className =
    selectedBookingCompletedData?.applicant?.classesName || "N/A";

  // Get class name or fallback to "N/A"
  const status = selectedBookingCompletedData?.status || "N/A";

  // Get applicant data, fallback to empty object
  const applicant =
    selectedBookingCompletedData?.applicant?.applicantData ||
    selectedBookingCompletedData?.applicant ||
    {};

  // Get applicant email or fallback to "N/A"
  const email =
    applicant?.email ||
    selectedBookingCompletedData?.applicant?.applicantEmail ||
    "N/A";

  // Fetch class details with react-query
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

  // Loading and Error
  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  return (
    <div className="modal-box max-w-3xl p-0 bg-gradient-to-b from-white to-gray-100 text-gray-900 rounded-lg shadow-lg">
      {/* Modal header with title and close icon */}
      <header className="flex justify-between items-center border-b border-gray-300 px-6 py-4 bg-white rounded-t-lg">
        <h3 className="text-xl font-semibold tracking-wide">
          Class Booking Accepted Details
        </h3>
        <ImCross
          className="text-xl text-gray-600 hover:text-red-600 cursor-pointer transition-colors"
          onClick={() => {
            document.getElementById("Class_Completed_Details_Modal")?.close();
          }}
        />
      </header>

      {/* Modal body */}
      <section className="px-8 py-6 space-y-8">
        {/* Class info and user info section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-5">
            {/* Show class icon if available */}
            {ClassData?.icon && (
              <img
                src={ClassData.icon}
                alt={`${className} icon`}
                className="w-16 h-16 rounded-md border border-gray-300 shadow-sm"
              />
            )}
            <div>
              {/* Class name */}
              <h2 className="text-2xl font-semibold">{className}</h2>
              {/* Duration */}
              <p className="text-sm text-gray-600 capitalize tracking-wide">
                Duration:{" "}
                {selectedBookingCompletedData?.applicant?.duration || "N/A"}
              </p>
            </div>
          </div>

          {/* Applicant user basic info */}
          <TrainerBookingRequestUserBasicInfo email={email} />
        </div>

        {/* Booking and payment info grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total price row */}
          <InfoRow
            icon={<FaMoneyBillAlt className="text-green-600" />}
            label="Total Price"
            value={`$${
              selectedBookingCompletedData?.applicant?.totalPrice ?? "N/A"
            }`}
          />

          {/* Submitted date row */}
          <InfoRow
            icon={<FaCalendarAlt className="text-blue-600" />}
            label="Submitted At"
            value={formatDateTimeTooltip(
              selectedBookingCompletedData?.applicant?.submittedDate
            )}
            tooltip={new Date(
              selectedBookingCompletedData?.applicant?.submittedDate
            ).toString()}
          />

          {/* Accepted date row */}
          <InfoRow
            icon={<FaClock className="text-indigo-600" />}
            label="Accepted At"
            value={formatDateTimeTooltip(
              selectedBookingCompletedData?.acceptedAt
            )}
            tooltip={new Date(
              selectedBookingCompletedData?.acceptedAt
            ).toString()}
          />

          {/* Payment status badge */}
          <div className="flex items-center gap-2 text-gray-700">
            {selectedBookingCompletedData?.paid ? (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold select-none">
                Paid
              </span>
            ) : (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold select-none">
                Waiting for Payment
              </span>
            )}
          </div>

          {/* Paid at date row (if available) */}
          {selectedBookingCompletedData?.paidAt && (
            <InfoRow
              icon={<FaClock className="text-green-600" />}
              label="Paid At"
              value={formatDateTimeTooltip(
                selectedBookingCompletedData?.paidAt
              )}
              tooltip={new Date(
                selectedBookingCompletedData?.paidAt
              ).toString()}
            />
          )}

          {/* Start Date row with icon */}
          {selectedBookingCompletedData?.startDate && (
            <InfoRow
              icon={<FaCalendarAlt className="text-blue-600" />}
              label="Start Date"
              value={formatDateToDisplay(
                selectedBookingCompletedData.startDate
              )}
            />
          )}

          {/* End Date row with icon and days left */}
          {selectedBookingCompletedData?.endDate && (
            <InfoRow
              icon={<FaHourglassEnd className="text-red-600" />}
              label="End Date"
              value={`${formatDateToDisplay(
                selectedBookingCompletedData.endDate
              )}${(() => {
                const daysLeft = calculateDaysLeft(
                  selectedBookingCompletedData.endDate
                );
                return daysLeft !== null
                  ? ` (${daysLeft} day${daysLeft !== 1 ? "s" : ""} left)`
                  : "";
              })()}`}
            />
          )}

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

export default ClassCompletedDetailsModal;
