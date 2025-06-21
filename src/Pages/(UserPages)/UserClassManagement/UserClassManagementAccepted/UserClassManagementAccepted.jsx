import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";

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
  FaInfoCircle,
} from "react-icons/fa";
import { IoCardSharp } from "react-icons/io5";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Shared
import Loading from "../../../../Shared/Loading/Loading";
import CommonButton from "../../../../Shared/Buttons/CommonButton";
import FetchingError from "../../../../Shared/Component/FetchingError";

// import Modal
import ClassAcceptedDetailsModal from "../../../(ClassManagement)/ClassAccepted/ClassAcceptedDetailsModal/ClassAcceptedDetailsModal";
import ClassAcceptedPaymentDetailsModal from "./ClassAcceptedPaymentDetailsModal/ClassAcceptedPaymentDetailsModal";
import PayedClassReceptModal from "./PayedClassReceptModal/PayedClassReceptModal";

const UserClassAcceptedCard = ({ item, refetchAll }) => {
  const axiosPublic = useAxiosPublic();

  // State Management
  const [selectedBookingAcceptedData, setSelectedBookingAcceptedData] =
    useState("");
  const [paymentSuccessData, setPaymentSuccessData] = useState("");

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

  const className = item?.applicant?.classesName;
  const duration = item?.applicant?.duration;
  const price = item?.applicant?.totalPrice;
  const submittedDate = item?.applicant?.submittedDate;
  const isPaid = item?.paid;

  return (
    <div className="relative bg-white rounded-2xl shadow-md border border-dashed border-gray-200 p-5">
      {/* Unpaid Badge */}
      {!isPaid && (
        <div className="absolute -top-4 -right-4 bg-red-600 p-2 px-10 rounded-full shadow text-white text-xs font-bold select-none">
          UNPAID
        </div>
      )}

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
            <span>{submittedDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-between gap-2">
          {/* Card Button */}
          <>
            <button
              id={`payment-applicant-btn-${item._id}`}
              className="border-2 border-blue-500 bg-blue-100 rounded-full p-2 cursor-pointer hover:scale-105"
              onClick={() => {
                setSelectedBookingAcceptedData(item);
                document
                  .getElementById("Class_Accepted_Payment_Details_Modal")
                  .showModal();
              }}
            >
              <IoCardSharp className="text-blue-500" />
            </button>
            <Tooltip
              anchorSelect={`#payment-applicant-btn-${item._id}`}
              content="Payment Applicant"
            />
          </>

          {/* details icon */}
          <>
            <button
              id={`details-applicant-btn-${item._id}`}
              className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105"
              onClick={() => {
                setSelectedBookingAcceptedData(item);
                document
                  .getElementById("Class_Accepted_Details_Modal")
                  .showModal();
              }}
            >
              <FaInfo className="text-yellow-500" />
            </button>
            <Tooltip
              anchorSelect={`#details-applicant-btn-${item._id}`}
              className=" z-30"
              content="Details Accepted Data"
            />
          </>
        </div>
      </div>

      {/* Modal */}
      <dialog
        id="Class_Accepted_Details_Modal"
        className="modal"
      >
        <ClassAcceptedDetailsModal
          selectedBookingAcceptedData={selectedBookingAcceptedData}
          setSelectedBookingAcceptedData={setSelectedBookingAcceptedData}
        />
      </dialog>

      {/* Modal */}
      <dialog id="Class_Accepted_Payment_Details_Modal" className="modal">
        <ClassAcceptedPaymentDetailsModal
          selectedBookingAcceptedData={selectedBookingAcceptedData}
          setPaymentSuccessData={setPaymentSuccessData}
          refetchAll={refetchAll}
        />
      </dialog>

      {/* Modal */}
      <dialog id="Payed_Class_Recept_Modal" className="modal">
        <PayedClassReceptModal
          paymentSuccessData={paymentSuccessData}
          setPaymentSuccessData={setPaymentSuccessData}
        />
      </dialog>
    </div>
  );
};

// Prop Validation
UserClassAcceptedCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    paid: PropTypes.bool.isRequired,
    applicant: PropTypes.shape({
      classesName: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      totalPrice: PropTypes.number.isRequired,
      submittedDate: PropTypes.string.isRequired,
      applicantData: PropTypes.object,
    }).isRequired,
  }).isRequired,
  refetchAll: PropTypes.func.isRequired,
};

const UserClassManagementAccepted = ({
  ClassBookingAcceptedData,
  refetchAll,
}) => {
  return (
    <div className="p-4 space-y-6">
      {/* Tittle */}
      <h2 className="text-3xl font-bold text-center text-white">
        Your Class Booking Accepted
      </h2>

      {/* Cards and fallback */}
      {ClassBookingAcceptedData.length === 0 ? (
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
          {ClassBookingAcceptedData.map((item) => (
            <UserClassAcceptedCard
              key={item._id}
              item={item}
              refetchAll={refetchAll}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// prop Validation
UserClassManagementAccepted.propTypes = {
  ClassBookingAcceptedData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      paid: PropTypes.bool.isRequired,
      applicant: PropTypes.shape({
        classesName: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
        totalPrice: PropTypes.number.isRequired,
        submittedDate: PropTypes.string.isRequired,
        applicantData: PropTypes.object,
      }).isRequired,
    })
  ).isRequired,
  refetchAll: PropTypes.func.isRequired,
};
export default UserClassManagementAccepted;
