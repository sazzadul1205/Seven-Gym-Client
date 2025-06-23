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

const UserClassCompletedCard = ({ item, setSelectedCompletedData }) => {
  const axiosPublic = useAxiosPublic();

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

  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  // Destructure Data
  const className = item?.applicant?.classesName;
  const duration = item?.applicant?.duration;
  const price = item?.applicant?.totalPrice;
  const submittedDate = item?.applicant?.submittedDate;
  const isPaid = item?.paid;
  const endDate = item?.endDate;

  return (
    <div className="relative bg-white rounded-2xl shadow-md border border-dashed border-gray-200 p-5 transition-all hover:shadow-xl hover:scale-[1.01] duration-200">
      {/* Badge */}
      <div
        className={`absolute 
    -top-4 
    left-1/2 sm:left-auto 
    -translate-x-1/2 sm:translate-x-0 
    right-auto sm:-right-4 
    px-6 py-2 rounded-full shadow 
    text-xs font-bold select-none z-10
    ${
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
        {item?.status === "Rejected" ? (
          "Rejected"
        ) : item?.status === "Dropped" ? (
          "Dropped"
        ) : endDate ? (
          parseCustomDate(endDate) < new Date() ? (
            "Completed"
          ) : (
            <span className="whitespace-nowrap">
              End At{" "}
              {parseCustomDate(endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )
        ) : isPaid ? (
          "PAID"
        ) : (
          "UNPAID"
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Class Icon */}
        <div className="w-24 h-24 rounded-xl overflow-hidden border shadow-inner flex-shrink-0 self-center sm:self-auto">
          <img
            src={ClassData?.icon}
            alt={className}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Class Info */}
        <div className="flex-1 w-full space-y-0 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-600 font-semibold text-lg">
            <FaDumbbell />
            <span>{className}</span>
          </div>

          <div className="mx-auto justify-center gap-5 md:gap-0 flex flex-row md:flex-col">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-700 text-sm">
              <FaClock className="text-blue-500" />
              <span className="capitalize">{duration}</span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-700 text-sm">
              <FaDollarSign className="text-green-600" />
              <span>{parseFloat(price).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-700 text-sm">
            <FaCalendarAlt className="text-purple-500" />
            <span>{formatDateTimeTooltip(submittedDate)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row sm:flex-col gap-2 sm:items-center justify-center sm:justify-between w-full sm:w-auto">
          {/* Details Button */}
          <>
            <button
              id={`details-applicant-btn-${item._id}`}
              className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105"
              onClick={() => {
                document
                  .getElementById("Class_Accepted_Details_Modal")
                  .showModal();
                setSelectedCompletedData(item);
              }}
            >
              <FaInfo className="text-yellow-500" />
            </button>
            <Tooltip
              anchorSelect={`#details-applicant-btn-${item._id}`}
              className="!z-[9999]"
              content="Details Completed Data"
            />
          </>
        </div>
      </div>
    </div>
  );
};

// Prop Validation
UserClassCompletedCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    paid: PropTypes.bool,
    endDate: PropTypes.string,
    status: PropTypes.oneOf([
      "Rejected",
      "Dropped",
      "Completed",
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
  setSelectedCompletedData: PropTypes.func,
};

export default UserClassCompletedCard;
