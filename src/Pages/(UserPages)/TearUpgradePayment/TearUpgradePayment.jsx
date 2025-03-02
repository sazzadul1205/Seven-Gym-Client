import { Link, useParams } from "react-router";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import TUPaymentBox from "./TUPaymentBox/TUPaymentBox";
import useAuth from "../../../Hooks/useAuth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const TearUpgradePayment = () => {
  const axiosPublic = useAxiosPublic();
  const { tier, email } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
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
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-linear-to-br from-blue-300 to-white">
        <p className="text-3xl text-red-500 font-bold mb-8">
          Failed to load tier data.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  // Function to determine the styles for the tier badge
  const getTierBadge = (tier) => {
    const styles = {
      Bronze:
        "bg-orange-600 hover:bg-orange-800 text-white ring-2 ring-orange-300 shadow-lg",
      Silver:
        "bg-gray-400 hover:bg-gray-600 text-white ring-2 ring-gray-200 shadow-lg",
      Gold: "bg-yellow-500 hover:bg-yellow-600 text-white ring-2 ring-yellow-300 shadow-lg",
      Diamond:
        "bg-blue-600 hover:bg-blue-800 text-white ring-2 ring-blue-300 shadow-lg",
      Platinum:
        "bg-gray-800 hover:bg-gray-600 text-white ring-2 ring-gray-500 shadow-lg",
    };
    return styles[tier] || "bg-gray-200 text-gray-700";
  };

  // Stripe promise
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PROMISE);

  return (
    <div className="min-h-screen">
      {/* Unauthorized Access Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              Unauthorized Access
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              This is not your account. Please go back to the previous page.
            </p>
            <Link to={`/User/${user?.email}`}>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400"
              >
                Go Back
              </button>
            </Link>
          </div>
        </div>
      )}

      {!showModal && (
        <div className="bg-linear-to-b from-red-400 to-white min-h-screen">
          {/* Page Header */}
          <p className="text-3xl font-bold text-center pt-[100px] text-white bg-[#F72C5B] py-11 pb-4">
            Payment for {CurrentTierData?.name || "Loading..."} Tier
          </p>

          {/* Main Layout: Container for tier details and payment box */}
          <div className="bg-white py-5 pb-10">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-4">
              {/* Tier Details Box */}
              <div
                className={`flex flex-col p-4 shadow-lg rounded-lg border border-gray-200 ${
                  CurrentTierData?.bgColor || "bg-white"
                } min-h-[500px] shadow-xl hover:shadow-2xl transition-all duration-300`}
              >
                {/* Tier Name Badge */}
                <h2
                  className={`text-xl font-semibold text-center rounded-3xl mb-4 py-2 ${getTierBadge(
                    CurrentTierData?.name || "Default"
                  )} transition-all duration-300`}
                >
                  {CurrentTierData?.name || "Loading..."}
                </h2>

                {/* List of Tier Perks */}
                <ul className="grow mb-4">
                  {CurrentTierData?.perks?.map((perk, idx) => (
                    <li
                      key={idx}
                      className="text-lg font-semibold flex items-center mb-2"
                    >
                      {/* Perk Checkmark Icon */}
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
                  <TUPaymentBox CurrentTierData={CurrentTierData} />
                </Elements>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TearUpgradePayment;
