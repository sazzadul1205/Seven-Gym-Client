import { Link, useParams } from "react-router";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";

const UserTearUpgrade = () => {
  const { email } = useParams();
  const axiosPublic = useAxiosPublic();

  // Fetch user data
  const {
    data: UsersData,
    isLoading: UsersLoading,
    error: UsersError,
  } = useQuery({
    queryKey: ["UsersData"],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${email}`).then((res) => res.data),
  });

  // Fetch tier data
  const {
    data: TierData,
    isLoading: TierDataLoading,
    error: TierDataError,
  } = useQuery({
    queryKey: ["TierData"],
    queryFn: () => axiosPublic.get(`/TierData`).then((res) => res.data),
  });

  // Loading and error handling
  if (UsersLoading || TierDataLoading) return <Loading />;

  // Error handling
  if (UsersError || TierDataError) {
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
    return styles[tier] || "bg-gray-200 text-gray-700"; // Default style if no tier matches
  };

  // Function to check if the tier is the current user's tier
  const isCurrentUserTier = (tierName) => {
    return UsersData?.tier === tierName; // Assuming user object has a 'tier' field
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F72C5B] to-[#f72c5b7c] pt-5 pb-10">
      {/* Title */}
      <p className="text-3xl font-bold text-center mb-6 pt-[100px] text-white border-b-2 border-white pb-2 mx-4 md:mx-40">
        Choose Your Membership
      </p>

      {/* TierData */}
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
                <p className="text-sm text-gray-600 mb-4">{tier.discount}</p>
                <Link to={`/User/${email}/${tier.name}/TierUpgradePayment`}>
                  <button
                    className={`w-[200px] py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition ${getTierBadge(
                      tier.name
                    )} ${isDisabled ? "bg-gray-400 cursor-not-allowed" : ""}`}
                    disabled={isDisabled}
                  >
                    {isDisabled
                      ? "You Already Have This Tier"
                      : `Buy ${tier.name}`}
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserTearUpgrade;
