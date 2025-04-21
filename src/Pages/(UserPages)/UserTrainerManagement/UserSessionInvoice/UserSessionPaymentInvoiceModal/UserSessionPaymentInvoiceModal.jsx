/* eslint-disable react/prop-types */
import { useRef } from "react";
import { Link, useParams } from "react-router";
import { formatDate } from "../../../../../Utility/formatDate";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import Loading from "../../../../../Shared/Loading/Loading";
import FetchingError from "../../../../../Shared/Component/FetchingError";

const UserSessionPaymentInvoiceModal = ({
  closeModal,
  selectedPaymentInvoice,
}) => {
  const axiosPublic = useAxiosPublic();

  // Ref for Recept Ref
  const receiptRef = useRef();

  // Use selectedBooking.sessions directly
  const sessionQuery =
    selectedPaymentInvoice?.sessionInfo?.sessions
      ?.map((id) => `ids=${encodeURIComponent(id)}`)
      .join("&") || "";

  // Fetch session details by ID
  const {
    data: ScheduleByIDData,
    isLoading: ScheduleByIDDataIsLoading,
    error: ScheduleByIDDataError,
  } = useQuery({
    queryKey: [
      "ScheduleByIDData",
      selectedPaymentInvoice?.sessionInfo?.sessions,
    ],
    enabled: !!selectedPaymentInvoice?.sessionInfo?.sessions?.length,
    queryFn: () =>
      axiosPublic
        .get(`/Trainers_Schedule/ByID?${sessionQuery}`)
        .then((res) => res.data),
  });

  // Load management
  if (ScheduleByIDDataIsLoading) return <Loading />;

  // Error Management
  if (ScheduleByIDDataError) return <FetchingError />;

  console.log("Selected Payment Invoice Data :", selectedPaymentInvoice);

  console.log("Selected Payment Sessions Data :", ScheduleByIDData);

  return (
    <div className="modal-box bg-[#ffffff] shadow-lg rounded-lg max-w-md mx-auto">
      {/* Receipt Section */}
      <div ref={receiptRef} id="receipt">
        {/* Receipt Header */}
        <div className="text-center pb-3">
          <h4 className="text-2xl font-bold text-[#1f2937]">Seven Gym</h4>
          <p className="text-sm text-[#6b7280]">Session Payment Receipt</p>
          {/* Change This */}
          <p className="text-sm text-[#6b7280]">www.SevenGym.com</p>
        </div>

        {/* Receipt Details */}
        <div className="p-4 bg-[#f9fafb] border text-black">
          {/* Top Part */}
          <div className="pb-1 text-center border-b">
            <p className="text-sm text-gray-500">
              Receipt:{" "}
              <span className="font-semibold">
                SG-SPR-
                {selectedPaymentInvoice?.stripePaymentID}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Customer:{" "}
              <span className="font-semibold">
                {selectedPaymentInvoice?.sessionInfo?.bookerEmail}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Transaction ID:{" "}
              <span className="font-semibold">
                TX-
                {selectedPaymentInvoice?.stripePaymentID.slice(-6)}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Date & Time :{" "}
              <span className="font-semibold">
                {formatDate(selectedPaymentInvoice?.sessionInfo?.paidAt)}
              </span>
            </p>
          </div>
          <div className="pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">
              Session Summary
            </h3>
            <div className="divide-y divide-gray-300">
              {ScheduleByIDData?.map((session, index) => (
                <div key={session._id || index} className="py-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session Type:</span>
                    <span className="font-medium text-gray-800">
                      {session.classType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trainer:</span>
                    <span className="font-medium text-gray-800">
                      {session.trainerName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-gray-800">
                      £{session.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSessionPaymentInvoiceModal;
