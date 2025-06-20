import { Link } from "react-router";

// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";
import { useQuery } from "@tanstack/react-query";

// import Icons
import {
  FaDumbbell,
  FaClock,
  FaDollarSign,
  FaCalendarAlt,
  FaArrowLeft,
  FaInfoCircle,
} from "react-icons/fa";

// import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// import Shared
import Loading from "../../../../Shared/Loading/Loading";
import FetchingError from "../../../../Shared/Component/FetchingError";
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Single Class Request Card
const UserClassRequestCard = ({ item }) => {
  const axiosPublic = useAxiosPublic();

  const {
    data: ClassData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ClassData", item?.classesName],
    queryFn: async () =>
      axiosPublic
        .get(`/Class_Details?module=${item?.classesName}`)
        .then((res) => res.data),
  });

  // Loading state
  if (isLoading) return <Loading />;

  // Error state
  if (error) return <FetchingError />;

  return (
    <div className="flex gap-4 items-center bg-white rounded-2xl shadow-md hover:shadow-2xl border border-dashed border-gray-200 p-5 transition-transform hover:scale-105 duration-200">
      {/* Class Icon */}
      <div className="w-20 h-20 rounded-xl overflow-hidden shadow-inner border">
        <img
          src={ClassData?.icon}
          alt={item.classesName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 space-y-1">
        {/* Class Name */}
        <div className="flex items-center gap-2 text-blue-600 text-lg font-semibold">
          <FaDumbbell />
          <span>{item.classesName}</span>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <FaClock className="text-blue-500" />
          <span className="capitalize">{item.duration}</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <FaDollarSign className="text-green-500" />
          <span>${parseFloat(item.totalPrice).toFixed(2)}</span>
        </div>

        {/* Submitted Date */}
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <FaCalendarAlt className="text-purple-500" />
          <span>{item.submittedDate}</span>
        </div>
      </div>

      {/* View Button with Tooltip */}
      <Link to={`/Classes/${item?.classesName}`}>
        <button
          id={`view-class-btn-${item._id}`}
          className="p-2 border-2 border-blue-600 bg-blue-300 hover:bg-blue-600 rounded-full shadow text-white transition cursor-pointer"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <Tooltip
          anchorSelect={`#view-class-btn-${item._id}`}
          content="View class details"
          place="top"
        />
      </Link>
    </div>
  );
};

// Prop Validation
UserClassRequestCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    classesName: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    submittedDate: PropTypes.string.isRequired,
  }).isRequired,
};

// Main Container for Requests
const UserClassManagementRequest = ({ ClassBookingRequestData }) => {
  return (
    <div className="p-4 space-y-6">
      {/* Tittle */}
      <h2 className="text-3xl font-bold text-center text-white">
        Your Class Booking Requests
      </h2>

      {/* Cards and fallback */}
      {ClassBookingRequestData.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-blue-50 border border-blue-300 rounded-xl p-6 shadow-sm text-center text-blue-800">
          {/* Icons */}
          <FaInfoCircle className="text-4xl mb-3 text-blue-500" />

          {/* Title */}
          <h3 className="text-xl font-semibold mb-1">
            No Class Booking Requests Found
          </h3>

          {/* Subtitle */}
          <p className="text-sm mb-3">
            It looks like you haven’t requested any classes yet.
          </p>

          {/* Button */}
          <Link to={"/Classes"}>
            <CommonButton
              text="Browse Classes & Request Now"
              bgColor="blue"
              px="px-4"
              py="py-2"
              borderRadius="rounded-full"
              textColor="text-white"
              className=" font-medium"
            />
          </Link>
        </div>
      ) : (
        // Request Cards
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ClassBookingRequestData.map((item) => (
            <UserClassRequestCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

// Prop Validation
UserClassManagementRequest.propTypes = {
  ClassBookingRequestData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      classesName: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      submittedDate: PropTypes.string.isRequired,
    })
  ).isRequired,
  module: PropTypes.string.isRequired,
};

export default UserClassManagementRequest;
