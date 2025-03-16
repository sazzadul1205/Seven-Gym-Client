import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";

import { useQuery } from "@tanstack/react-query";

// Import Components
import Loading from "../../../Shared/Loading/Loading";
import FetchingError from "../../../Shared/Component/FetchingError";

// Import Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Import Background
import GalleryBackground from "../../../assets/Home-Background/Home-Background.jpeg";

const UserTierUpgrade = () => {
  const { user } = useAuth();
  const { email } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  // State
  const [showModal, setShowModal] = useState(false);

  // Check email mismatch
  if (!user?.email || user.email !== email) {
    setTimeout(() => setShowModal(true), 0);
  }

  // Fetch user data
  const {
    data: UsersData,
    isLoading: UsersLoading,
    error: UsersError,
  } = useQuery({
    queryKey: ["UsersData"],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${email}`).then((res) => res.data),
    enabled: user?.email === email, // Only fetch if emails match
  });

  // Fetch tier data
  const {
    data: TierData,
    isLoading: TierDataLoading,
    error: TierDataError,
  } = useQuery({
    queryKey: ["TierData"],
    queryFn: () => axiosPublic.get(`/TierData`).then((res) => res.data),
    enabled: user?.email === email, // Only fetch if emails match
  });

  // Loading state
  if (UsersLoading || TierDataLoading) return <Loading />;

  // Error handling
  if (UsersError || TierDataError) {
    return <FetchingError />;
  }

  // Function to determine the styles for the tier badge
  const getTierBadge = (tier) => {
    const tierStyles = {
      Bronze:
        "bg-gradient-to-r hover:bg-gradient-to-l from-orange-300 to-orange-500 hover:scale-105",
      Silver:
        "bg-gradient-to-r hover:bg-gradient-to-l from-gray-300 to-gray-500 hover:scale-105",
      Gold: 
        "bg-gradient-to-r hover:bg-gradient-to-l from-yellow-300 to-yellow-500 hover:scale-105",
      Diamond:
        "bg-gradient-to-r hover:bg-gradient-to-l from-blue-300 to-blue-500 hover:scale-105",
      Platinum:
        "bg-gradient-to-r hover:bg-gradient-to-l from-gray-500 to-gray-700 hover:scale-105",
    };

    return `px-4 py-2 mt-2 rounded-full text-sm font-semibold shadow-lg transition-transform ${
      tierStyles[tier] ||
      "bg-gradient-to-r hover:bg-gradient-to-l from-green-300 to-green-500 hover:scale-105"
    }`;
  };

  // Function to determine static background color for each tier
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

  // Function to check if the tier is the current user's tier
  const isCurrentUserTier = (tierName) => {
    return UsersData?.tier === tierName;
  };

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${GalleryBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-linear-to-bl from-gray-100 to-gray-400 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              Unauthorized Access
            </h2>
            <p className="text-xl text-black mb-6">
              This is not your account. Please go back to the previous page.
            </p>
            <Link to={`/User/${user?.email}`}>
              <button
                onClick={() => navigate(-1)}
                className="bg-linear-to-bl hover:bg-linear-to-tr from-blue-300 to-blue-700 text-white font-bold rounded-lg px-15 py-3 cursor-pointer"
              >
                Go Back
              </button>
            </Link>
          </div>
        </div>
      )}

      {!showModal && (
        <div className="min-h-screen bg-gradient-to-t from-black/40 to-black/70">
          {/* Title */}
          <p className="text-3xl font-bold text-center mb-6 text-white border-b-2 border-white pb-2 mx-4 md:mx-40">
            Choose Your Membership
          </p>

          {/* TierData */}
          <div className="flex flex-wrap justify-center max-w-7xl mx-auto gap-y-8 gap-x-6 px-4">
            {TierData?.map((tier, index) => {
              const isDisabled = isCurrentUserTier(tier.name);

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center p-6 shadow-lg rounded-lg border border-gray-200 ${getTierBackgroundColor(
                    tier.name
                  )} min-h-[500px] w-[380px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
                    isDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <h2
                    className={`text-xl font-semibold text-center rounded-3xl mb-4 py-2 w-full  ${getTierBadge(
                      tier.name
                    )} transition-all duration-300`}
                  >
                    {tier.name}
                  </h2>
                  <ul className="grow mb-4">
                    {tier.perks.map((perk, idx) => (
                      <li
                        key={idx}
                        className="text-lg font-semibold text-left mb-2"
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
                    <Link to={`/User/${email}/${tier.name}/TierUpgradePayment`}>
                      <button
                        className={`w-[200px] py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition ${getTierBadge(
                          tier.name
                        )} ${
                          isDisabled ? "bg-gray-400 cursor-not-allowed" : ""
                        }`}
                        disabled={isDisabled}
                      >
                        {isDisabled ? "Activated Tier" : `Buy ${tier.name}`}
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTierUpgrade;
