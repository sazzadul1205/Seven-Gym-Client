import { Link, useParams } from "react-router";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";

const tiers = [
  {
    name: "Bronze",
    perks: ["Access to gym equipment", "Community support"],
    price: "Free",
    bgColor: "bg-orange-100",
  },
  {
    name: "Silver",
    perks: [
      "All Bronze perks",
      "Priority support",
      "2 Free group Trainer per month",
      "Access to gym locker rooms",
    ],
    price: 10,
    discount: "10% discount on personal trainer sessions", // Discount on trainers
    bgColor: "bg-gray-100",
  },
  {
    name: "Gold",
    perks: [
      "All Silver perks",
      "Free nutrition plan",
      "Monthly consultation",
      "Access to specialized fitness programs",
      "3 Free group Trainer per month",
      "Priority booking for group classes",
    ],
    price: 25,
    discount: "20% discount on personal trainer sessions", // Discount on trainers
    bgColor: "bg-yellow-100",
  },
  {
    name: "Diamond",
    perks: [
      "All Gold perks",
      "Exclusive gym events",
      "4 Free group classes per month",
      "Exclusive member-only challenges",
    ],
    price: 50,
    discount: "30% discount on personal trainer sessions", // Discount on trainers
    bgColor: "bg-blue-100",
  },
  {
    name: "Platinum",
    perks: [
      "All Diamond perks",
      "VIP gym lounge access",
      "Free wellness assessments every 3 months",
      "5 Free group classes per month",
      "Access to premium fitness equipment",
      "Exclusive health retreats or events",
    ],
    price: 100,
    discount: "50% discount on personal trainer sessions", // Discount on trainers
    bgColor: "bg-gray-300",
  },
];

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

  // Loading and error handling
  if (UsersLoading) return <Loading />;

  // Error handling
  if (UsersError) {
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

  const handleBuy = (tier) => {
    alert(`You selected the ${tier} tier. Proceed to checkout!`);
  };

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

      {/* Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto p-4 space-y-3">
        {tiers.map((tier, index) => {
          const isDisabled = isCurrentUserTier(tier.name);
          return (
            <Link
              to={`/User/${email}/${tier.name}`}
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
                <button
                  className={`px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition ${getTierBadge(
                    tier.name
                  )} ${isDisabled ? "bg-gray-400 cursor-not-allowed" : ""}`}
                  onClick={() => !isDisabled && handleBuy(tier.name)}
                  disabled={isDisabled}
                >
                  {isDisabled
                    ? "You Already Have This Tier"
                    : `Buy ${tier.name}`}
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default UserTearUpgrade;
