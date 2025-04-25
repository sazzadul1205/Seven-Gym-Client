import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";

// Import Icons
import { IoMdArrowRoundBack } from "react-icons/io";

// Import Package
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { Elements } from "@stripe/react-stripe-js";

// Import Hooks
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FetchingError from "../../../Shared/Component/FetchingError";

// Import Background Image
import GalleryBackground from "../../../assets/Home-Background/Home-Background.jpeg";

// Tier Related Component
import TierUpgradePaymentBox from "./TierUpgradePaymentBox/TierUpgradePaymentBox";
import TierUpgradePaymentBronze from "./TierUpgradePaymentBox/TierUpgradePaymentBronze/TierUpgradePaymentBronze";

const TearUpgradePayment = () => {
  // Hooks & Dependencies
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tier, email } = useParams();
  const axiosPublic = useAxiosPublic();

  // State Management for unauthorized modal
  const [showModal, setShowModal] = useState(false);

  // Check for unauthorized access (wait until user is loaded)
  useEffect(() => {
    if (user && user.email !== email) {
      setShowModal(true);
    }
  }, [user, email]);

  // Fetch tier data
  const {
    data: CurrentTierData,
    isLoading: CurrentTierDataLoading,
    error: CurrentTierDataError,
  } = useQuery({
    queryKey: ["CurrentTierData", tier],
    queryFn: () => axiosPublic.get(`/TierData/${tier}`).then((res) => res.data),
    enabled: !showModal, // Only fetch if user is authorized
  });

  // Fetch tier data
  const {
    data: UserData,
    isLoading: UserDataLoading,
    error: UserDataError,
  } = useQuery({
    queryKey: ["UserData", tier],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${email}`).then((res) => res.data),
  });

  // Loading and Error handling
  if (CurrentTierDataLoading || UserDataLoading) return <Loading />;
  if (CurrentTierDataError || UserDataError) return <FetchingError />;

  // Function to get button style based on tier type
  const getTierBadge = (tierName) => {
    const tierStyles = {
      Bronze:
        "bg-gradient-to-bl hover:bg-gradient-to-tr from-orange-300 to-orange-500",
      Silver:
        "bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-300 to-gray-500",
      Gold: "bg-gradient-to-bl hover:bg-gradient-to-tr from-yellow-300 to-yellow-500",
      Diamond:
        "bg-gradient-to-bl hover:bg-gradient-to-tr from-blue-300 to-blue-500",
      Platinum:
        "bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-500 to-gray-700",
    };

    return `px-4 py-2 mt-2 rounded-full text-sm font-semibold shadow-lg transition-transform ${
      tierStyles[tierName] || "bg-gradient-to-r from-green-300 to-green-500"
    }`;
  };

  // Function to get background color based on tier type
  const getTierBackgroundColor = (tierName) => {
    const styles = {
      Bronze: "bg-orange-500/90",
      Silver: "bg-gray-500/90",
      Gold: "bg-yellow-500/90",
      Diamond: "bg-blue-500/90",
      Platinum: "bg-gray-500/90",
    };
    return styles[tierName] || "bg-white"; // Default background color
  };

  // Stripe promise
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PROMISE);

  // Determine if we need to show the Bronze modal.
  // Only show if the user is authorized and the selected tier is Bronze.
  const showBronzeModal = !showModal && CurrentTierData?.name === "Bronze";

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${GalleryBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Unauthorized Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              Unauthorized Access
            </h2>
            <p className="text-xl text-black mb-6">
              This is not your account. Please go back to the previous page.
            </p>
            <Link to={`/User/${user?.email}`}>
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg px-6 py-3 cursor-pointer"
              >
                Go Back
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Bronze Modal (if current tier is Bronze) */}
      {showBronzeModal && <TierUpgradePaymentBronze />}

      {/* Bronze Modal (if user's current tier is NOT Bronze) */}
      {UserData?.tier !== "Bronze" && <TierUpgradePaymentBronze />}

      {/* Main Content (Only displayed if user is authorized and not on Bronze tier) */}
      {!showModal && !showBronzeModal && (
        <div className="min-h-screen bg-gradient-to-t from-black/40 to-black/70 py-10 md:py-6 px-1 md:px-4 relative">
          {/* Back Button */}
          <div
            className="absolute top-4 left-4 z-50 flex items-center space-x-2 bg-gradient-to-br from-gray-500 to-gray-700 px-3 py-2 rounded-md cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate(-1)}
          >
            <IoMdArrowRoundBack className="text-white text-xl" />
            <p className="text-white font-medium">Back</p>
          </div>

          {/* Page Header */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-2">
            Payment for {CurrentTierData?.name || "Loading..."} Tier
          </h1>

          {/* Separator Line */}
          <div className="mx-auto bg-white h-[2px] w-2/3 max-w-sm my-3 rounded-full"></div>

          {/* Main Container */}
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-start justify-center gap-6 pt-5">
            {/* Tier Info Box */}
            <div
              className={`w-full max-w-md mx-auto min-h-[500px] lg:mx-0 p-6 rounded-lg border border-gray-200 shadow-lg flex flex-col ${getTierBackgroundColor(
                tier
              )}`}
            >
              {/* Tier Badge */}
              <h2
                className={`text-lg sm:text-xl font-semibold text-center rounded-full py-2 mb-4 ${getTierBadge(
                  CurrentTierData?.name
                )}`}
              >
                {CurrentTierData?.name}
              </h2>

              {/* Perks List */}
              <ul className="space-y-2 mb-6 flex-grow">
                {CurrentTierData?.perks?.map((perk, idx) => (
                  <li key={idx} className="text-base text-gray-800 font-medium">
                    <span className="text-green-500 mr-2">✔</span>
                    {perk}
                  </li>
                ))}
              </ul>

              {/* Price & Discount pinned at the bottom */}
              <div className="mt-auto pt-4 border-t border-gray-300 text-center">
                <p className="text-lg font-bold text-gray-800">
                  ${CurrentTierData?.price || 0} / month
                </p>
                {CurrentTierData?.discount && (
                  <p className="text-sm text-gray-200 mt-1">
                    {CurrentTierData.discount}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Box */}
            <div className="w-full lg:flex-1">
              <Elements stripe={stripePromise}>
                <TierUpgradePaymentBox CurrentTierData={CurrentTierData} />
              </Elements>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TearUpgradePayment;
