import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";

// Import Package
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { Elements } from "@stripe/react-stripe-js";

// Import Utility
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Import Component
import Loading from "../../../Shared/Loading/Loading";
import FetchingError from "../../../Shared/Component/FetchingError";

// Import Background Image
import GalleryBackground from "../../../assets/Home-Background/Home-Background.jpeg";
import TearUpgradePaymentBox from "./TearUpgradePaymentBox/TearUpgradePaymentBox";

const TearUpgradePayment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tier, email } = useParams();
  const axiosPublic = useAxiosPublic();

  // State Management
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.email !== email) {
      setShowModal(true);
    }
  }, [user?.email, email]);

  // Fetch tier data
  const {
    data: CurrentTierData,
    isLoading: CurrentTierDataLoading,
    error: CurrentTierDataError,
  } = useQuery({
    queryKey: ["CurrentTierData", tier],
    queryFn: () => axiosPublic.get(`/TierData/${tier}`).then((res) => res.data),
    enabled: !showModal, // Disable query if modal is shown
  });

  // Loading
  if (CurrentTierDataLoading) return <Loading />;

  // Error handling
  if (CurrentTierDataError) {
    return <FetchingError />;
  }

  // Function to get button style based on tier type
  const getTierBadge = (tier) => {
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
      tierStyles[tier] || "bg-gradient-to-r from-green-300 to-green-500"
    }`;
  };

  // Function to get background color based on tier type
  const getTierBackgroundColor = (tier) => {
    const styles = {
      Bronze: "bg-orange-500/90",
      Silver: "bg-gray-500/90",
      Gold: "bg-yellow-500/90",
      Diamond: "bg-blue-500/90",
      Platinum: "bg-gray-500/90",
    };
    return styles[tier] || "bg-white"; // Default background color
  };

  // Stripe promise
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PROMISE);

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

      {!showModal && (
        <div className="min-h-screen bg-gradient-to-t from-black/40 to-black/70 py-5">
          {/* Page Header */}
          <p className="text-3xl font-bold text-center text-white">
            Payment for {CurrentTierData?.name || "Loading..."} Tier
          </p>

          {/* Separator Line */}
          <div className="mx-auto bg-white p-[1px] w-1/3 my-3"></div>

          {/* Main Layout: Container for tier details and payment box */}
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-4">
            {/* Tier Details Box */}
            <div
              className={` items-center p-6 shadow-lg rounded-lg border border-gray-200 ${getTierBackgroundColor(
                tier
              )} min-h-[500px] w-[380px] shadow-xl`}
            >
              {/* Tier Name Badge */}
              <h2
                className={`text-xl font-semibold text-center rounded-3xl mb-4 py-2 w-full ${getTierBadge(
                  CurrentTierData.name
                )}`}
              >
                {CurrentTierData.name}
              </h2>

              {/* Perks List */}
              <ul className="grow mb-4">
                {CurrentTierData.perks.map((perk, idx) => (
                  <li
                    key={idx}
                    className="text-lg font-semibold text-left mb-2"
                  >
                    <span className="text-green-500 mr-2">✔</span>
                    {perk}
                  </li>
                ))}
              </ul>

              {/* Pricing and Discount Information */}
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800 mb-2">
                  ${CurrentTierData?.price || 0} / month
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {CurrentTierData?.discount || ""}
                </p>
              </div>
            </div>

            {/* Payment Form Box */}
            <div className="w-full lg:w-2/3">
              {/* Stripe Elements Wrapper */}
              <Elements stripe={stripePromise}>
                {/* Payment Component */}
                <TearUpgradePaymentBox CurrentTierData={CurrentTierData} />
              </Elements>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TearUpgradePayment;
