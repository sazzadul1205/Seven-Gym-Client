import { useState } from "react";
import { useNavigate } from "react-router";

// Import Packages
import { useQuery } from "@tanstack/react-query";

// Import Utility
import useAuth from "../../../../../Hooks/useAuth";
import Loading from "../../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../../Shared/Component/FetchingError";

// Import Component
import TierResetRecept from "../TierResetRecept/TierResetRecept";
import TearResetToBronzeModal from "../TierResetToBronzeModal/TierResetToBronzeModal";

// Import Buttons
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

const TierUpgradePaymentBronze = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  // State Management
  const [refundID, setRefundID] = useState();

  // Fetch user data
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userData", user?.email],
    queryFn: async () => {
      if (!user) return null;
      try {
        const res = await axiosPublic.get(`/Users?email=${user.email}`);
        return res.data;
      } catch (error) {
        if (error.response?.status === 404) return null;
        throw error;
      }
    },
    enabled: !!user,
  });

  // Handle loading and errors
  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  // Get tier details
  const userTier = userData?.tier || "Unknown";
  const duration = userData?.tierDuration?.duration || "N/A";

  // Dynamic styling for different tiers
  const tierColors = {
    Bronze: "bg-green-500",
    Silver: "bg-gray-500",
    Gold: "bg-yellow-500",
    Diamond: "bg-blue-500",
  };
  const tierColor = tierColors[userTier] || "bg-gray-400";

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      {/* Bronze Warning */}
      <div className="max-w-lg w-full bg-white p-4 rounded-lg shadow-xl text-center">
        {/* Tier Display */}
        <div
          className={`text-white text-lg font-semibold py-2 px-4 rounded-md ${tierColor}`}
        >
          Current Tier: {userTier}
        </div>

        {/* Duration */}
        <p className="text-gray-700 text-lg mt-2">
          Duration: <span className="font-semibold">{duration}</span>
        </p>

        {/* Expired */}
        <p className="text-gray-700 text-lg mb-6">
          Expires on:
          <span className="font-semibold">{userData?.tierDuration?.end}</span>
        </p>

        {/* Message */}
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {userTier === "Bronze"
            ? "You currently have the Bronze tier. Please choose a different package if you'd like to upgrade. Thank you!"
            : "You already have a suitable package selected, so this upgrade isn’t required. If you’d like to reset your tier to Bronze, click the button below. For further assistance, please speak with our management staff."}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          {userTier !== "Bronze" && (
            <CommonButton
              clickEvent={() =>
                document
                  .getElementById("Tear_Reset_To_Bronze_Modal")
                  .showModal()
              }
              text="Reset"
              bgColor="OriginalRed"
              width="[200px]"
            />
          )}
          <CommonButton
            clickEvent={() => navigate(-1)}
            text="Go Back"
            bgColor="gray"
            width="[200px]"
          />
        </div>
      </div>

      {/* Reset to Bronze Modal */}
      <dialog id="Tear_Reset_To_Bronze_Modal" className="modal">
        <TearResetToBronzeModal userData={userData} setRefundID={setRefundID} />
      </dialog>

      {/* Reset Successful Recept */}
      <dialog id="Tear_Reset_Recept" className="modal">
        <TierResetRecept userData={userData} refundID={refundID} />
      </dialog>
    </div>
  );
};

export default TierUpgradePaymentBronze;
