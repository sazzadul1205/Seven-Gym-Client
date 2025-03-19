import { useNavigate } from "react-router";

// Import Packages
import { useQuery } from "@tanstack/react-query";

// Import Utility
import useAuth from "../../../../../Hooks/useAuth";
import Loading from "../../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../../Shared/Component/FetchingError";
import TearResetToBronzeModal from "../TierResetToBronzeModal/TierResetToBronzeModal";

const TierUpgradePaymentBronze = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

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
    enabled: !!user, // Fetch only if user exists
  });

  // Handle loading and errors
  if (isLoading) return <Loading />;
  if (error) return <FetchingError />;

  // Get tier details
  const userTier = userData?.tier || "Unknown";
  const duration = userData?.tierDuration?.duration || "N/A";
  const endDate = userData?.tierDuration?.end
    ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
        new Date(userData.tierDuration.end)
      )
    : "N/A";

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
          Expires on: <span className="font-semibold">{endDate}</span>
        </p>

        {/* Message */}
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          You already have a suitable package selected, so this upgrade
          isn&apos;t required. If you&apos;d like to reset your tier to{" "}
          <strong>Bronze</strong>, click the button below. For further
          assistance, please speak with our management staff.
        </p>

        {/* Buttons */}
        <div className="flex justify-between gap-4">
          <button
            // onClick={handleResetToBronze}
            onClick={() =>
              document.getElementById("Tear_Reset_To_Bronze_Modal").showModal()
            }
            className="bg-linear-to-bl hover:bg-linear-to-tr from-green-300 to-green-700 text-white font-medium py-2 w-[200px] rounded-lg transition-all duration-200 shadow-md hover:shadow-2xl cursor-pointer border border-gray-500"
          >
            Reset
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-linear-to-bl hover:bg-linear-to-tr from-gray-300 to-gray-700 text-white font-medium py-2 w-[200px] rounded-lg transition-all duration-200 shadow-md hover:shadow-2xl cursor-pointer border border-gray-500"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Reset to Bronze Modal */}
      <dialog id="Tear_Reset_To_Bronze_Modal" className="modal">
        <TearResetToBronzeModal userData={userData} />
      </dialog>
    </div>
  );
};

export default TierUpgradePaymentBronze;
