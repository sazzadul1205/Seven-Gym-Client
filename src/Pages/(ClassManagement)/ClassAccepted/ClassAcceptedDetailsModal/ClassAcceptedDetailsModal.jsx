import React from "react";
import { ImCross } from "react-icons/im";
import { FaMoneyBillAlt, FaClock, FaCalendarAlt } from "react-icons/fa";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../Shared/Loading/Loading";
import FetchingError from "../../../../Shared/Component/FetchingError";
import TrainerBookingRequestUserBasicInfo from "../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

const ClassAcceptedDetailsModal = ({ selectedBookingAcceptedData }) => {
  const axiosPublic = useAxiosPublic();

  const className = selectedBookingAcceptedData?.applicant?.classesName;

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
    enabled: !!className,
  });

  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  const applicant =
    selectedBookingAcceptedData?.applicant?.applicantData ||
    selectedBookingAcceptedData?.applicant;

  const email =
    applicant?.email || selectedBookingAcceptedData?.applicant?.applicantEmail;
  const altEmail = selectedBookingAcceptedData?.applicant?.applicantEmail;

  return (
    <div className="modal-box p-0 bg-gradient-to-b from-white to-gray-200 text-black max-w-2xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-300 px-5 py-4 bg-white rounded-t-lg">
        <h3 className="font-bold text-lg">Class Booking Accepted Details</h3>
        <ImCross
          className="text-xl text-gray-600 hover:text-red-500 cursor-pointer"
          onClick={() =>
            document.getElementById("Class_Accepted_Details_Modal")?.close()
          }
        />
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-4">
        <div className="flex justify-between items-center">
          {/* Class Info */}
          <div className="flex items-center space-x-4">
            {ClassData?.icon && (
              <img
                src={ClassData.icon}
                alt={`${className} icon`}
                className="w-14 h-14 rounded-lg border border-gray-300"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">{className}</h2>
              <p className="text-gray-600 capitalize">
                {selectedBookingAcceptedData?.applicant?.duration} duration
              </p>
            </div>
          </div>

          {/* User Info */}
          <TrainerBookingRequestUserBasicInfo email={email || altEmail} />
        </div>

        {/* Booking Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-10 ">
          <div className="flex items-center gap-2 text-gray-700">
            <FaMoneyBillAlt className="text-2xl text-green-600" />
            <span>
              Total Price: ${" "}
              {selectedBookingAcceptedData?.applicant?.totalPrice}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <FaCalendarAlt className="text-2xl text-blue-500" />
            <span>
              Submitted: {selectedBookingAcceptedData?.applicant?.submittedDate}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <FaClock className="text-2xl text-indigo-500" />
            <span>
              Accepted:{" "}
              {new Date(
                selectedBookingAcceptedData?.acceptedAt
              ).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            {selectedBookingAcceptedData?.paid ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Paid
              </span>
            ) : (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                Waiting for Payment
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassAcceptedDetailsModal;
