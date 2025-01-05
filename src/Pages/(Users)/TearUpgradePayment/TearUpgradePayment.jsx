import { useParams } from "react-router";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Loading from "../../../Shared/Loading/Loading";
import TUPaymentBox from "./TUPaymentBox/TUPaymentBox";

const TearUpgradePayment = () => {
  const axiosPublic = useAxiosPublic();
  const { tier } = useParams();
  const [selectedDuration, setSelectedDuration] = useState(null); // Track selected card

  // Fetch tier data
  const {
    data: CurrentTierData,
    isLoading: CurrentTierDataLoading,
    error: CurrentTierDataError,
  } = useQuery({
    queryKey: ["CurrentTierData", tier],
    queryFn: () => axiosPublic.get(`/TierData/${tier}`).then((res) => res.data),
  });

  // Loading and error handling
  if (CurrentTierDataLoading) return <Loading />;

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

  return (
    <div className="bg-gradient-to-br from-red-300 to-white min-h-screen">
      {/* Title */}
      <p className="text-3xl font-bold text-center mb-6 pt-[100px] text-blue-500 border-b-2 border-white pb-2 mx-14">
        Payment for {CurrentTierData.name} Tier
      </p>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto gap-10">
        {/* Tier Information Section */}
        <div className="w-full lg:w-1/3">
          <div
            className={`flex flex-col p-4 shadow-lg rounded-lg border border-gray-200 ${CurrentTierData.bgColor} min-h-[500px] shadow-xl hover:shadow-2xl transition-all duration-300`}
          >
            <h2
              className={`text-xl font-semibold text-center rounded-3xl mb-4 py-2 ${getTierBadge(
                CurrentTierData.name
              )} transition-all duration-300`}
            >
              {CurrentTierData.name}
            </h2>
            <ul className="flex-grow mb-4">
              {CurrentTierData.perks.map((perk, idx) => (
                <li
                  key={idx}
                  className="text-lg font-semibold flex items-center mb-2"
                >
                  <span className="text-green-500 mr-2">✔</span>
                  {perk}
                </li>
              ))}
            </ul>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800 mb-2">
                ${CurrentTierData.price} / month
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {CurrentTierData.discount}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Information Section */}
        <div className="w-full lg:w-2/3">
          {/* Subscription Duration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
            {[
              {
                name: "Basic Plan",
                duration: "1 Month",
                multiplier: 1,
                icon: "📅",
                description: "Perfect for short-term needs.",
              },
              {
                name: "Value Plan",
                duration: "5 Months",
                multiplier: 5,
                icon: "⏳",
                description: "Great value for medium-term plans.",
              },
              {
                name: "Premium Plan",
                duration: "12 Months",
                multiplier: 12,
                icon: "🏆",
                description: "Best for long-term commitment.",
              },
            ].map((option, index) => (
              <div
                key={index}
                className={`px-2 py-4 border-4 rounded-xl shadow-lg bg-gradient-to-br from-white to-blue-50 transition-all duration-300 ${
                  selectedDuration === option.duration
                    ? "border-blue-500 shadow-2xl scale-105"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-xl"
                }`}
                onClick={() => setSelectedDuration(option.duration)}
              >
                {/* Plan Name */}
                <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
                  {option.name}
                </h2>
                <div className="flex items-center gap-2 border-b border-t border-gray-400 py-2">
                  {/* Icon */}
                  <div className="text-6xl mb-4 ">{option.icon}</div>

                  {/* Description */}
                  <div>
                    {/* Duration */}
                    <h3 className="text-lg font-semibold text-blue-700">
                      {option.duration}
                    </h3>
                    {/* Description */}
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                </div>
                {/* Price */}
                <p className="text-lg font-bold text-gray-800 text-center">
                  Price: ${CurrentTierData.price * option.multiplier}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 text-center mt-2">
            This plan will not automatically renew. You must manually renew it
            buy your self after the plan ends. or before it ends.
          </p>

          <TUPaymentBox />
        </div>
      </div>
    </div>
  );
};

export default TearUpgradePayment;
