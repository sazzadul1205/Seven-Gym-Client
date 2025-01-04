import { useParams } from "react-router";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";

const TearUpgradePayment = () => {
  const axiosPublic = useAxiosPublic();

  const { email } = useParams();
  const { tier } = useParams();

  // Fetch tier data
  const {
    data: CurrentTierData,
    isLoading: CurrentTierDataLoading,
    error: CurrentTierDataError,
  } = useQuery({
    queryKey: ["CurrentTierData"],
    queryFn: () => axiosPublic.get(`/TierData/${tier}`).then((res) => res.data),
  });

  // Loading and error handling
  if (CurrentTierDataLoading) return <Loading />;

  // Error handling
  if (CurrentTierDataError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-3xl text-red-500 font-bold mb-8">
          Failed to load user data.
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

  console.log(CurrentTierData);

  return (
    <div className="bg-gradient-to-br from-red-300 to-white min-h-screen">
      {/* Header */}
      <div className="bg-[#F72C5B] py-12"></div>

      {/* Data */}
      <div className="flex flex-col items-center justify-center max-w-7xl mx-auto">
        <div className="w-1/2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto p-4 space-y-3">
            {TierData.map((tier, index) => {
              const isDisabled = isCurrentUserTier(tier.name);
              return (
                <div
                  key={index}
                  className={`flex flex-col p-4 shadow-lg rounded-lg border border-gray-200 ${
                    tier.bgColor
                  } min-h-[500px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 ${
                    isDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <h2
                    className={`text-xl font-semibold text-center rounded-3xl mb-4 py-2 ${getTierBadge(
                      tier.name
                    )} transition-all duration-300`}
                  >
                    {tier.name}
                  </h2>
                  <ul className="flex-grow mb-4">
                    {tier.perks.map((perk, idx) => (
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
                      {tier.price} / month
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      {tier.discount}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-1/2"></div>
      </div>
    </div>
  );
};

export default TearUpgradePayment;
