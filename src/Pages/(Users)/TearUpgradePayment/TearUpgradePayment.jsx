import { useParams } from "react-router";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import TUPaymentBox from "./TUPaymentBox/TUPaymentBox";

const TearUpgradePayment = () => {
  const axiosPublic = useAxiosPublic();
  const { tier } = useParams();

  // Fetch tier data
  const {
    data: CurrentTierData,
    isLoading: CurrentTierDataLoading,
    error: CurrentTierDataError,
  } = useQuery({
    queryKey: ["CurrentTierData", tier],
    queryFn: () => axiosPublic.get(`/TierData/${tier}`).then((res) => res.data),
  });

  // Loading
  if (CurrentTierDataLoading) return <Loading />;

  // Error handling
  if (CurrentTierDataError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
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
  const stripePromise = loadStripe(
    "pk_test_51QdwmBFTkipGUF29jcarVd9d0nafr6NzppIV8elG4t2sh2B0HskbmqQc1Exp7C7nVkNjXaD5gwHxK1UydHTWsxy300JnB4vVVK"
  );

  return (
    <div className="bg-gradient-to-br from-red-300 to-white min-h-screen">
      {/*  */}
      <p className="text-xl font-bold text-center pt-[100px] text-blue-500 border-b-2 border-white pb-2 mx-14">
        Payment for {CurrentTierData?.name || "Loading..."} Tier
      </p>
      <div className="flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto gap-10">
        {/*  */}
        <div className="w-full lg:w-1/3">
          <div
            className={`flex flex-col p-4 shadow-lg rounded-lg border border-gray-200 ${
              CurrentTierData?.bgColor || "bg-white"
            }`}
          >
            <h2
              className={`text-xl font-semibold text-center rounded-3xl mb-4 py-2 ${getTierBadge(
                CurrentTierData?.name || "Default"
              )}`}
            >
              {CurrentTierData?.name || "Loading..."}
            </h2>
            <ul>
              {CurrentTierData?.perks?.map((perk, idx) => (
                <li key={idx} className="text-lg font-semibold">
                  <span className="text-green-500 mr-2">✔</span> {perk}
                </li>
              ))}
            </ul>
            <p className="text-lg font-bold">
              ${CurrentTierData?.price || 0} / month
            </p>
          </div>
        </div>

        {/*  */}
        <div className="w-full lg:w-2/3">
          <Elements stripe={stripePromise}>
            <TUPaymentBox CurrentTierData={CurrentTierData} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default TearUpgradePayment;
