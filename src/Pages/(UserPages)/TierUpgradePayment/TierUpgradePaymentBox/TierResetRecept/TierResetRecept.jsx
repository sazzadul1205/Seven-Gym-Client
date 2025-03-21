import { useQuery } from "@tanstack/react-query";
import { ImCross } from "react-icons/im";
import Loading from "../../../../../Shared/Loading/Loading";
import FetchingError from "../../../../../Shared/Component/FetchingError";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const TierResetRecept = ({ userData, refundID }) => {
  const axiosPublic = useAxiosPublic();

  // Fetch refund data only if refundID exists
  const {
    data: TierUpgradeRefundData = [],
    isLoading: TierUpgradeRefundLoading,
    error: TierUpgradeRefundError,
  } = useQuery({
    queryKey: ["TierUpgradeRefundData", refundID],
    queryFn: () =>
      refundID
        ? axiosPublic
            .get(`/Tier_Upgrade_Refund/search?refundID=${refundID}`)
            .then((res) => res.data)
        : Promise.reject(new Error("No Refund ID found")),
    enabled: !!refundID, // Ensures query only runs if refundID is available
  });

  const LinkedPaymentID = TierUpgradeRefundData[0]?.linkedPaymentReceptID;

  // Fetch payment data only if linkedReceptID exists
  const {
    data: TierUpgradePaymentData = [],
    isLoading: TierUpgradePaymentLoading,
    error: TierUpgradePaymentError,
  } = useQuery({
    queryKey: ["TierUpgradePaymentData", LinkedPaymentID],
    queryFn: () =>
      LinkedPaymentID
        ? axiosPublic
            .get(`/Tier_Upgrade_Payment/search?paymentID=${LinkedPaymentID}`)
            .then((res) => res.data)
        : Promise.reject(new Error("No payment ID found")),
    enabled: !!LinkedPaymentID, // Ensures query only runs if LinkedPaymentID is available
  });

  // Loading & Error Handling
  if (TierUpgradeRefundLoading || TierUpgradePaymentLoading) return <Loading />;
  if (TierUpgradeRefundError || TierUpgradePaymentError)
    return <FetchingError />;

  console.log("Refund Data",TierUpgradeRefundData);
  console.log("Payment Data: ", TierUpgradePaymentData);

  return (
    <div className="modal-box bg-gray-100 p-0 rounded-xl">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b border-black text-black pb-2 p-5">
        <h3 className="font-bold text-lg">Reset Tier Recept</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => document.getElementById("Tear_Reset_Recept").close()}
        />
      </div>

      <div className="space-y-2 mt-4">
        <div className="flex justify-between">
          <p className="text-sm font-semibold">Current Tier:</p>
          <p className="text-black font-semibold">{payment?.tier || "N/A"}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm font-semibold">Duration:</p>
          <p className="text-black font-semibold">
            {payment?.duration || "N/A"}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm font-semibold">Exp Date:</p>
          <p className="text-black font-semibold">
            {payment?.endDate || "N/A"}
          </p>
        </div>
      </div>

      <div className="space-y-2 mt-5">
        <div className="flex justify-between font-bold px-2">
          <p className="text-md">Product</p>
          <p className="text-md">Price</p>
        </div>
        <div className="flex justify-between font-semibold border-b border-[#9ca3af] pb-2 px-2">
          <p className="text-md">{payment.tier} Tier Upgrade</p>
          <p className="text-md">
            ${parseFloat(payment.totalPrice).toFixed(2)}
          </p>
        </div>
        <div className="flex justify-between font-semibold px-2">
          <p className="text-md">Total Paid</p>
          <p className="text-md">
            ${parseFloat(payment.totalPrice).toFixed(2)}
          </p>
        </div>

        {hasPenalty && (
          <>
            <div className="flex justify-between font-semibold text-red-500 px-2">
              <p className="text-md">Days Passed ({daysPassed} days)</p>
              <p className="text-md">- ${Number(amountUsed).toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-semibold text-red-500 px-2">
              <p className="text-md">Late Refund Fee (10%)</p>
              <p className="text-md">
                - ${(Number(remainingAmount) * 0.1).toFixed(2)}
              </p>
            </div>
          </>
        )}

        <div className="flex justify-between font-semibold text-[#22c55e] px-2">
          <p className="text-md">Refund Amount</p>
          <p className="text-md font-bold">${computedRefundValue}</p>
        </div>
      </div>
    </div>
  );
};

export default TierResetRecept;
