import { useState, useEffect } from "react";

// Import Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Import Icons
import { ImCross } from "react-icons/im";

// Import Utilities
import Loading from "../../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../../Shared/Component/FetchingError";

// Import Components
import TierResetReason from "./TierResetReason/TierResetReason";
import TierResetDetails from "./TierResetDetails/TierResetDetails";

const TearResetToBronzeModal = ({ userData, setRefundID }) => {
  const axiosPublic = useAxiosPublic();

  // State management
  const [daysPassed, setDaysPassed] = useState(0);
  const [amountUsed, setAmountUsed] = useState(0);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundReason, setRefundReason] = useState("");
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  // Fetch Linked Receipt ID
  const linkedReceptID = userData?.tierDuration?.linkedReceptID;

  // Fetch payment data only if linkedReceptID exists
  const {
    data: TierUpgradePaymentData,
    isLoading: TierUpgradePaymentLoading,
    error: TierUpgradePaymentError,
  } = useQuery({
    queryKey: ["TierUpgradePaymentData", linkedReceptID],
    queryFn: () =>
      linkedReceptID
        ? axiosPublic
            .get(`/Tier_Upgrade_Payment/search?paymentID=${linkedReceptID}`)
            .then((res) => res.data)
        : Promise.reject(new Error("No payment ID found")),
    enabled: !!linkedReceptID,
  });

  // Run refund calculation whenever the payment data changes
  useEffect(() => {
    if (TierUpgradePaymentData) calculateRefund();
  }, [TierUpgradePaymentData]);

  // Helper function to parse date strings in "DD-MM-YYYY" format
  const parseDate = (dateString) => {
    if (!dateString) return new Date();
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Calculate refund breakdown
  const calculateRefund = () => {
    if (
      !TierUpgradePaymentData ||
      !TierUpgradePaymentData.totalPrice ||
      !TierUpgradePaymentData.startDate ||
      !TierUpgradePaymentData.duration
    )
      return;

    const totalPrice = Number(TierUpgradePaymentData.totalPrice);
    const startDate = parseDate(TierUpgradePaymentData.startDate);
    const currentDate = new Date();

    // Calculate days passed
    const calcDaysPassed = Math.floor(
      (currentDate - startDate) / (1000 * 60 * 60 * 24)
    );
    setDaysPassed(calcDaysPassed >= 0 ? calcDaysPassed : 0);

    // Approximate total days based on duration in months
    const durationMonths = parseInt(
      TierUpgradePaymentData.duration.split(" ")[0],
      10
    );
    const totalDays = durationMonths * 30;

    const perDayCost = totalPrice / totalDays;

    // Calculate used and remaining amounts as numbers
    const calcAmountUsed = calcDaysPassed > 0 ? calcDaysPassed * perDayCost : 0;
    setAmountUsed(Number(calcAmountUsed.toFixed(2)));

    const calcRemainingAmount = totalPrice - calcAmountUsed;
    setRemainingAmount(Number(calcRemainingAmount.toFixed(2)));

    // Refund calculation: Full refund if within 3 days, otherwise 90% of the remaining amount
    let finalRefund =
      calcDaysPassed <= 3 ? totalPrice : calcRemainingAmount * 0.9;
    setRefundAmount(Number(finalRefund.toFixed(2)));
  };

  const onReasonSelect = (reasonData) => {
    const reason = reasonData.reason;
    setRefundReason(reason);
    setShowPaymentDetails(true);
  };

  // Loading & Error Handling
  if (TierUpgradePaymentLoading) return <Loading />;
  if (TierUpgradePaymentError) return <FetchingError />;

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

      {/* Conditionally render: Reason selection or payment details */}
      {!showPaymentDetails ? (
        <TierResetReason setRefundReason={onReasonSelect} />
      ) : (
        <TierResetDetails
          paymentData={TierUpgradePaymentData}
          remainingAmount={remainingAmount}
          refundReason={refundReason}
          refundAmount={refundAmount}
          setRefundID={setRefundID}
          daysPassed={daysPassed}
          amountUsed={amountUsed}
          linkedReceptID={linkedReceptID}
        />
      )}
    </div>
  );
};

TearResetToBronzeModal.propTypes = {
  setRefundID: PropTypes.func,
  userData: PropTypes.shape({
    tierDuration: PropTypes.shape({
      linkedReceptID: PropTypes.string,
    }),
  }),
};

export default TearResetToBronzeModal;
