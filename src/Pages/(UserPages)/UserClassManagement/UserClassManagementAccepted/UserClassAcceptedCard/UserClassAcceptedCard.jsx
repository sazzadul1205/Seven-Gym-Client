// import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";
import { useQuery } from "@tanstack/react-query";

// import Icons
import {
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaDumbbell,
  FaInfo,
} from "react-icons/fa";
import { IoCardSharp } from "react-icons/io5";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// import Shared
import FetchingError from "../../../../../Shared/Component/FetchingError";
import Loading from "../../../../../Shared/Loading/Loading";

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

// Helper function to parse 'dd-mm-yyyy' to Date object
const parseCustomDate = (str) => {
  if (!str || typeof str !== "string") return new Date("Invalid");
  const [day, month, year] = str.split("-");
  return new Date(`${year}-${month}-${day}`);
};

const UserClassAcceptedCard = ({ item, setSelectedAcceptedData, id }) => {
  const axiosPublic = useAxiosPublic();

  // Fetch Class Data
  const {
    data: ClassData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ClassData", item?.applicant?.classesName],
    queryFn: async () =>
      axiosPublic
        .get(`/Class_Details?module=${item?.applicant?.classesName}`)
        .then((res) => res.data),
  });

  // loading and Error State
  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  // Data Destructure
  const className = item?.applicant?.classesName;
  const duration = item?.applicant?.duration;
  const price = item?.applicant?.totalPrice;
  const submittedDate = item?.applicant?.submittedDate;
  const isPaid = item?.paid;
  const endDate = item?.endDate;

  return (
    <div className="relative bg-white rounded-2xl shadow-md border border-dashed border-gray-200 p-5">
      {/* Final Badge: Shows Rejected / Dropped / Ended / End At / PAID / UNPAID */}
      <div
        className={`absolute -top-4 -right-4 px-6 py-2 rounded-full shadow text-xs font-bold select-none ${
          item?.status === "Rejected" || item?.status === "Dropped"
            ? "border-3 border-red-600 bg-red-500 text-white"
            : endDate
            ? parseCustomDate(endDate) < new Date()
              ? "border-3 border-gray-500 bg-gray-600 text-white"
              : "border-3 border-indigo-500 bg-gradient-to-bl from-indigo-300 to-indigo-600 text-white"
            : isPaid
            ? "border-3 border-green-500 bg-gradient-to-bl from-green-300 to-green-600 text-white"
            : "border-3 border-red-500 bg-gradient-to-bl from-red-300 to-red-600 text-white"
        }`}
      >
        {item?.status === "Rejected"
          ? "Rejected"
          : item?.status === "Dropped"
          ? "Dropped"
          : endDate
          ? parseCustomDate(endDate) < new Date()
            ? "Completed"
            : `End At ${parseCustomDate(endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}`
          : isPaid
          ? "PAID"
          : "UNPAID"}
      </div>

      <div className="flex gap-4 items-center">
        {/* Class Icon */}
        <div className="w-20 h-20 rounded-xl overflow-hidden border shadow-inner">
          <img
            src={ClassData?.icon}
            alt={className}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Class Info */}
        <div className="flex-1 space-y-1">
          {/* Class Name */}
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-lg">
            <FaDumbbell />
            <span>{className}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <FaClock className="text-blue-500" />
            <span className="capitalize">{duration}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <FaDollarSign className="text-green-600" />
            <span>${parseFloat(price).toFixed(2)}</span>
          </div>

          {/* Submitted date */}
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <FaCalendarAlt className="text-purple-500" />
            <span>{formatDateTimeTooltip(submittedDate)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-between gap-2">
          {/* Card Button */}
          {!item.paid &&
            item.status !== "Rejected" &&
            item.status !== "Dropped" && (
              <>
                <button
                  id={`payment-applicant-btn-${item._id}`}
                  className="border-2 border-blue-500 bg-blue-100 rounded-full p-2 cursor-pointer hover:scale-105"
                  onClick={() => {
                    setSelectedAcceptedData(item);
                    document
                      .getElementById("Class_Accepted_Payment_Details_Modal")
                      .showModal();
                  }}
                >
                  <IoCardSharp className="text-blue-500" />
                </button>
                <Tooltip
                  anchorSelect={`#payment-applicant-btn-${item._id}`}
                  className="!z-[9999]"
                  content="Payment Applicant"
                />
              </>
            )}

          {/* Details icon */}
          <>
            <button
              id={`details-applicant-btn-${item._id}`}
              className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105"
              onClick={() => {
                document
                  .getElementById(id || "Class_Accepted_Details_Modal")
                  .showModal();
                setSelectedAcceptedData(item);
              }}
            >
              <FaInfo className="text-yellow-500" />
            </button>
            <Tooltip
              anchorSelect={`#details-applicant-btn-${item._id}`}
              className="!z-[9999]"
              content="Details Accepted Data"
            />
          </>
        </div>
      </div>
    </div>
  );
};

// Prop Validation
UserClassAcceptedCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    paid: PropTypes.bool,
    endDate: PropTypes.string,
    status: PropTypes.oneOf([
      "Rejected",
      "Dropped",
      "Accepted",
      "Pending",
      "Completed",
    ]),
    applicant: PropTypes.shape({
      classesName: PropTypes.string,
      duration: PropTypes.string,
      totalPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      submittedDate: PropTypes.string,
      applicantData: PropTypes.shape({
        email: PropTypes.string,
        name: PropTypes.string,
        phone: PropTypes.string,
        Userid: PropTypes.string,
      }),
    }),
  }),
  setSelectedAcceptedData: PropTypes.func,
};

export default UserClassAcceptedCard;
