/* eslint-disable react/prop-types */
import { useState } from "react";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../../Shared/Loading/Loading";
import FetchingError from "../../../../../Shared/Component/FetchingError";
import TierResetReason from "./TierResetReason/TierResetReason";

const TearResetToBronzeModal = ({ userData }) => {
  const axiosPublic = useAxiosPublic();

  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [daysPassed, setDaysPassed] = useState(0);
  const [amountUsed, setAmountUsed] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  // Fetch payment data
  const {
    data: TierUpgradePaymentData = [],
    isLoading: TierUpgradePaymentLoading,
    error: TierUpgradePaymentError,
  } = useQuery({
    queryKey: ["TierUpgradePaymentData"],
    queryFn: () =>
      axiosPublic
        .get(
          `/Tier_Upgrade_Payment/search?paymentID=${userData?.tierDuration?.linkedReceptID}`
        )
        .then((res) => res.data),
  });

  // Loading & Error states
  if (TierUpgradePaymentLoading) return <Loading />;
  if (TierUpgradePaymentError) return <FetchingError />;

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // Month is zero-based in JS Date
  };

  // This function calculates the refund and stores the values in state.
  const calculateRefund = () => {
    if (!TierUpgradePaymentData.length) return;

    const payment = TierUpgradePaymentData[0]; // Get first payment entry
    const totalPrice = payment.totalPrice;
    const startDate = parseDate(payment.startDate);
    const currentDate = new Date(); // Get current date

    const calcDaysPassed = Math.floor(
      (currentDate - startDate) / (1000 * 60 * 60 * 24)
    ); // Days since start
    setDaysPassed(calcDaysPassed);

    const durationMonths = parseInt(payment.duration.split(" ")[0]); // Extract months
    const totalDays = durationMonths * 30; // Approximate days in duration
    const perDayCost = totalPrice / totalDays;

    const calcAmountUsed = calcDaysPassed * perDayCost;
    setAmountUsed(calcAmountUsed);

    const calcRemainingAmount = totalPrice - calcAmountUsed;
    setRemainingAmount(calcRemainingAmount);

    let finalRefund = 0;

    if (calcDaysPassed <= 3) {
      // Full refund if within 3 days
      finalRefund = totalPrice;
    } else {
      // Calculate refund with deductions
      const refundAfterFee = calcRemainingAmount * 0.9; // Deduct 10%
      finalRefund = refundAfterFee;
    }

    setRefundAmount(finalRefund.toFixed(2)); // Set state with final refund amount
    setShowPaymentDetails(true); // Show the details
  };

  // This handler is passed to the child component.
  const onReasonSelect = (data) => {
    console.log("Selected Reason:", data);
    calculateRefund();
  };

  return (
    <div className="modal-box bg-gray-100 p-0 rounded-xl">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b border-black text-black pb-2 p-5">
        <h3 className="font-bold text-lg">Reset Tier Plan</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document.getElementById("Tear_Reset_To_Bronze_Modal").close()
          }
        />
      </div>

      {/* Divider */}
      <div className="p-[1px] bg-black w-1/2 mx-auto"></div>

      {/* Form */}
      {!showPaymentDetails ? (
        <TierResetReason onReasonSelect={onReasonSelect} />
      ) : (
        // Payment Details
        <div className="px-4 py-4">
          {/* Payment & Refund Details */}
          <div className="p-4 bg-[#f9fafb] border text-black rounded-lg shadow-md">
            {/* Receipt Header */}
            <div className="pb-2 text-center border-b border-gray-300">
              <p className="text-sm text-[#6b7280]">
                Receipt #: SG-TUPR-
                <span>{TierUpgradePaymentData[0]?.paymentID}</span>
              </p>
              <p className="text-sm font-semibold text-[#6b7280]">
                Customer: <span>{TierUpgradePaymentData[0]?.email}</span>
              </p>
              <p className="text-sm text-[#6b7280]">
                Transaction ID: TX-{" "}
                <span>{TierUpgradePaymentData[0]?.paymentID.slice(-6)}</span>
              </p>
              <p className="text-sm text-[#6b7280]">
                Date:{" "}
                <span>
                  {new Date(
                    TierUpgradePaymentData[0]?.dateTime
                  ).toLocaleDateString()}
                </span>
              </p>
            </div>

            {/* Status and Duration */}
            <div className="space-y-2 mt-4">
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Payment Status:</p>
                <p
                  className={`${
                    TierUpgradePaymentData[0]?.Payed
                      ? "text-[#22c55e]"
                      : "text-[#ef4444]"
                  } font-bold`}
                >
                  {TierUpgradePaymentData[0]?.Payed ? "Successful" : "Failed"}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Duration:</p>
                <p className="text-[#374151]">
                  {TierUpgradePaymentData[0]?.duration}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Payment Method:</p>
                <p className="text-[#374151]">
                  {TierUpgradePaymentData[0]?.paymentMethod}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Exp Date:</p>
                <p className="text-[#374151]">
                  {TierUpgradePaymentData[0]?.endDate}
                </p>
              </div>
            </div>

            {/* Product and Refund Calculation */}
            <div className="space-y-2 mt-10">
              <div className="flex justify-between font-bold px-2">
                <p className="text-md">Product</p>
                <p className="text-md">Price</p>
              </div>
              <div className="flex justify-between font-semibold border-b border-[#9ca3af] pb-2 px-2">
                <p className="text-md">
                  {TierUpgradePaymentData[0]?.tier} Tier Upgrade
                </p>
                <p className="text-md">
                  ${TierUpgradePaymentData[0]?.totalPrice.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between font-semibold px-2">
                <p className="text-md">Total Paid</p>
                <p className="text-md">
                  ${TierUpgradePaymentData[0]?.totalPrice.toFixed(2)}
                </p>
              </div>

              {/* Days Passed Deduction */}
              <div className="flex justify-between font-semibold text-red-500 px-2">
                <p className="text-md">Days Passed ({daysPassed} days)</p>
                <p className="text-md">- ${amountUsed.toFixed(2)}</p>
              </div>

              {/* Late Refund Fee (10%) */}
              <div className="flex justify-between font-semibold text-red-500 px-2">
                <p className="text-md">Late Refund Fee (10%)</p>
                <p className="text-md">
                  - ${(remainingAmount * 0.1).toFixed(2)}
                </p>
              </div>

              {/* Final Refund Amount */}
              <div className="flex justify-between font-semibold text-[#22c55e] px-2">
                <p className="text-md">Refund Amount</p>
                <p className="text-md font-bold">${refundAmount}</p>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mt-6 text-center border-t pt-4">
              <p className="text-sm text-[#6b7280]">
                Thank you for choosing Seven Gym. We appreciate your business!
              </p>
            </div>

            <div className="mt-6 text-center border-t pt-4">
              <p className="text-xs text-[#6b7280]">
                You are eligible for a full refund within the first 3 days.
                After that, refunds will be prorated based on the days used,
                along with a 10% processing fee. Changing tiers will also incur
                the same conditions.
              </p>
            </div>

            {/* Confirm Refund Button */}
            <div className="flex justify-center mt-6">
              <button
                className="bg-linear-to-bl hover:bg-linear-to-tr from-red-400 to-red-700 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all cursor-pointer"
                onClick={() => alert("Refund request submitted!")}
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TearResetToBronzeModal;
