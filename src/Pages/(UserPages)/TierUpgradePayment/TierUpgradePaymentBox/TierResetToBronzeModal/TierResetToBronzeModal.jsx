/* eslint-disable react/prop-types */
import { useState } from "react";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../../Shared/Loading/Loading";
import FetchingError from "../../../../../Shared/Component/FetchingError";
import TierResetReason from "./TierResetReason/TierResetReason";
import TierResetDetails from "./TierResetDetails/TierResetDetails";

const TearResetToBronzeModal = ({ userData }) => {
  const axiosPublic = useAxiosPublic();

  // State for toggling between reason selection and payment details
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  // States to hold calculated refund breakdown values
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

  // Helper function to parse date strings in "DD-MM-YYYY" format
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Calculate the refund breakdown based on the payment data
  const calculateRefund = () => {
    if (!TierUpgradePaymentData.length) return;
    const payment = TierUpgradePaymentData[0]; // Using the first payment entry
    const totalPrice = payment.totalPrice;
    const startDate = parseDate(payment.startDate);
    const currentDate = new Date();

    // Calculate days passed since the start date
    const calcDaysPassed = Math.floor(
      (currentDate - startDate) / (1000 * 60 * 60 * 24)
    );
    setDaysPassed(calcDaysPassed);

    // Approximate total days based on duration (in months) and calculate per day cost
    const durationMonths = parseInt(payment.duration.split(" ")[0]);
    const totalDays = durationMonths * 30;
    const perDayCost = totalPrice / totalDays;

    // Calculate the amount used and the remaining amount
    const calcAmountUsed = calcDaysPassed * perDayCost;
    setAmountUsed(calcAmountUsed);
    const calcRemainingAmount = totalPrice - calcAmountUsed;
    setRemainingAmount(calcRemainingAmount);

    // Calculate refund: full refund if within 3 days, otherwise deduct a 10% fee
    let finalRefund =
      calcDaysPassed <= 3 ? totalPrice : calcRemainingAmount * 0.9;
    setRefundAmount(finalRefund.toFixed(2));

    // Show the payment details modal
    setShowPaymentDetails(true);
  };

  // This handler is passed to TierResetReason.
  // When a reason is selected, it triggers the refund calculation.
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

      {/* Conditionally render: first the reason selection, then payment details */}
      {!showPaymentDetails ? (
        <TierResetReason onReasonSelect={onReasonSelect} />
      ) : (
        <TierResetDetails
          paymentData={TierUpgradePaymentData}
          daysPassed={daysPassed}
          amountUsed={amountUsed}
          remainingAmount={remainingAmount}
          refundAmount={refundAmount}
        />
      )}
    </div>
  );
};

export default TearResetToBronzeModal;
