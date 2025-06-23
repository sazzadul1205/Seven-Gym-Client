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
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Shared
import Loading from "../../../../Shared/Loading/Loading";
import FetchingError from "../../../../Shared/Component/FetchingError";

// Import Basic info
import TrainerBookingRequestUserBasicInfo from "../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

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

const ClassAcceptedDetailsModal = ({ selectedBookingAcceptedData, id }) => {
  const axiosPublic = useAxiosPublic();

  // Get class name or fallback to "N/A"
  const className =
    selectedBookingAcceptedData?.applicant?.classesName || "N/A";

  // Get class name or fallback to "N/A"
  const status = selectedBookingAcceptedData?.status || "N/A";

  // Get applicant data, fallback to empty object
  const applicant =
    selectedBookingAcceptedData?.applicant?.applicantData ||
    selectedBookingAcceptedData?.applicant ||
    {};

  // Get applicant email or fallback to "N/A"
  const email =
    applicant?.email ||
    selectedBookingAcceptedData?.applicant?.applicantEmail ||
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
    <div className="modal-box w-full max-w-3xl max-h-[90vh] overflow-y-auto p-0 bg-gradient-to-b from-white to-gray-100 text-gray-900 rounded-lg shadow-lg">
      {/* Modal header */}
      <header className="flex justify-between items-center border-b border-gray-300 px-4 sm:px-6 py-3 sm:py-4 bg-white rounded-t-lg">
        <h3 className="text-md md:text-xl font-semibold tracking-wide">
          Class Booking Accepted Details
        </h3>
        <ImCross
          className="text-xl text-gray-600 hover:text-red-600 cursor-pointer transition-colors"
          onClick={() => {
            document
              .getElementById(id || "Class_Accepted_Details_Modal")
              ?.close();
          }}
        />
      </header>

      {/* Modal body */}
      <section className="px-4 sm:px-8 py-6 space-y-6 sm:space-y-8">
        {/* Class info and user info */}
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
                Duration:{" "}
                {selectedBookingAcceptedData?.applicant?.duration || "N/A"}
              </p>
            </div>
          </div>

          {/* User info */}
          <div className="md:mt-0 mt-2">
            <TrainerBookingRequestUserBasicInfo email={email} />
          </div>
        </div>

        {/* Grid Info Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <InfoRow
            icon={<FaMoneyBillAlt className="text-green-600" />}
            label="Total Price"
            value={`$${
              selectedBookingAcceptedData?.applicant?.totalPrice ?? "N/A"
            }`}
          />

          <InfoRow
            icon={<FaCalendarAlt className="text-blue-600" />}
            label="Submitted At"
            value={formatDateTimeTooltip(
              selectedBookingAcceptedData?.applicant?.submittedDate
            )}
            tooltip={new Date(
              selectedBookingAcceptedData?.applicant?.submittedDate
            ).toString()}
          />

          <InfoRow
            icon={<FaClock className="text-indigo-600" />}
            label="Accepted At"
            value={formatDateTimeTooltip(
              selectedBookingAcceptedData?.acceptedAt
            )}
            tooltip={new Date(
              selectedBookingAcceptedData?.acceptedAt
            ).toString()}
          />

          <div className="flex items-center gap-2 text-gray-700">
            {selectedBookingAcceptedData?.paid ? (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold select-none">
                Paid
              </span>
            ) : (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold select-none">
                Waiting for Payment
              </span>
            )}
          </div>

          {selectedBookingAcceptedData?.paidAt && (
            <InfoRow
              icon={<FaClock className="text-green-600" />}
              label="Paid At"
              value={formatDateTimeTooltip(selectedBookingAcceptedData?.paidAt)}
              tooltip={new Date(selectedBookingAcceptedData?.paidAt).toString()}
            />
          )}

          {selectedBookingAcceptedData?.startDate && (
            <InfoRow
              icon={<FaCalendarAlt className="text-blue-600" />}
              label="Start Date"
              value={formatDateToDisplay(selectedBookingAcceptedData.startDate)}
            />
          )}

          {selectedBookingAcceptedData?.endDate && (
            <InfoRow
              icon={<FaHourglassEnd className="text-red-600" />}
              label="End Date"
              value={
                <>
                  <span className="whitespace-nowrap">
                    {formatDateToDisplay(selectedBookingAcceptedData.endDate)}
                  </span>
                  {(() => {
                    const daysLeft = calculateDaysLeft(
                      selectedBookingAcceptedData.endDate
                    );
                    return daysLeft !== null
                      ? ` (${daysLeft} day${daysLeft !== 1 ? "s" : ""} left)`
                      : "";
                  })()}
                </>
              }
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

// Prop Validation
ClassAcceptedDetailsModal.propTypes = {
  selectedBookingAcceptedData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  id: PropTypes.string,
};

// PropTypes validation for InfoRow
export const InfoRow = ({ icon, label, value, tooltip }) => (
  <div className="flex items-center gap-3 text-gray-700">
    <div className="text-2xl">{icon}</div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500 select-none">
        {label}
      </span>
      <span
        className="font-semibold text-gray-900 select-text"
        title={tooltip || value}
      >
        {value || "N/A"}
      </span>
    </div>
  </div>
);

// Prop Validation
InfoRow.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
  tooltip: PropTypes.string,
};

export default ClassAcceptedDetailsModal;
