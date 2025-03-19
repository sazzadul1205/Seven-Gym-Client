import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";

import { useQuery } from "@tanstack/react-query";

// Import Icons
import { IoMdArrowRoundBack } from "react-icons/io";

// Import Components
import Loading from "../../../Shared/Loading/Loading";
import FetchingError from "../../../Shared/Component/FetchingError";

// Import Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Import Background Image
import GalleryBackground from "../../../assets/Home-Background/Home-Background.jpeg";

const UserTierUpgrade = () => {
  // Hooks & Dependencies
  const { user } = useAuth();
  const { email } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  // State for unauthorized modal
  const [showModal, setShowModal] = useState(false);

  // Check if user is unauthorized (handled in useEffect to avoid unnecessary re-renders)
  useEffect(() => {
    if (user && user.email !== email) {
      setShowModal(true);
    }
  }, [user, email]);

  // Fetch user data (enabled only if email matches the logged-in user)
  const {
    data: UsersData,
    isLoading: UsersLoading,
    error: UsersError,
  } = useQuery({
    queryKey: ["UsersData", email],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${email}`).then((res) => res.data),
    enabled: user?.email === email, // Prevents fetching if emails do not match
  });

  // Fetch membership tier data
  const {
    data: TierData,
    isLoading: TierDataLoading,
    error: TierDataError,
  } = useQuery({
    queryKey: ["TierData"],
    queryFn: () => axiosPublic.get(`/TierData`).then((res) => res.data),
    enabled: user?.email === email, // Prevents fetching if emails do not match
  });

  // Show loading component while data is being fetched
  if (UsersLoading || TierDataLoading) return <Loading />;

  // Show error component if there are errors in fetching data
  if (UsersError || TierDataError) return <FetchingError />;

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

  // Check if the current user's tier matches a specific tier
  const isCurrentUserTier = (tierName) => UsersData?.tier === tierName;

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

      {/* Main Content (Only displayed if user is authorized) */}
      {!showModal && (
        <div className="min-h-screen bg-gradient-to-t from-black/40 to-black/70 py-5 relative">
          {/* Back Button at Top Left inside the container */}
          <div
            className="absolute top-4 left-4 flex items-center space-x-2 bg-gray-600 px-3 py-2 rounded-md cursor-pointer z-50"
            onClick={() => navigate(-1)}
          >
            <IoMdArrowRoundBack className="text-white" />
            <p className="text-white">Back</p>
          </div>

          {/* Page Title */}
          <p className="text-3xl font-bold text-center text-white">
            Choose Your Membership
          </p>

          {/* Separator Line */}
          <div className="mx-auto bg-white p-[1px] w-1/3 my-3"></div>

          {/* Tier Cards */}
          <div className="flex flex-wrap justify-center max-w-7xl mx-auto gap-y-8 gap-x-6 px-4">
            {TierData?.map((tier, index) => {
              const isDisabled = isCurrentUserTier(tier.name);

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center p-6 shadow-lg rounded-lg border border-gray-200 ${getTierBackgroundColor(
                    tier.name
                  )} min-h-[500px] w-[380px] shadow-xl ${
                    isDisabled ? "opacity-80 cursor-not-allowed" : ""
                  }`}
                >
                  {/* Tier Title */}
                  <h2
                    className={`text-xl font-semibold text-center rounded-3xl mb-4 py-2 w-full ${getTierBadge(
                      tier.name
                    )}`}
                  >
                    {tier.name}
                  </h2>

                  {/* Perks List */}
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

                  {/* Pricing & Action Button */}
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-800 mb-2">
                      {tier.price} / month
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      {tier?.discount}
                    </p>
                    <Link
                      to={`/User/TierUpgradePayment/${email}/${tier?.name}`}
                    >
                      <button
                        className={`w-[200px] text-white font-bold rounded-lg transition border-2 border-black py-3 ${getTierBadge(
                          tier.name
                        )} ${
                          isDisabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "cursor-pointer"
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
