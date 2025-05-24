/* eslint-disable react/prop-types */
import { useState } from "react";
import { ImCross } from "react-icons/im";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const tierSettings = {
  Bronze: {
    label: "Bronze",
    cut: 40,
    perks: [
      "Gym cut: 40% per booking",
      "Basic support",
      "Profile visibility in local area",
      "Limited scheduling options",
      "Access to standard booking analytics",
      "No promotional features",
    ],
    colorClasses:
      "bg-gradient-to-br from-orange-600 to-orange-500 text-white ring-2 ring-orange-800",
    CardClass:
      "border border-3 border-orange-600 bg-linear-to-bl hover:bg-linear-to-tr from-orange-400/20 to-to-orange-500/20",
  },
  Silver: {
    label: "Silver",
    cut: 35,
    perks: [
      "Gym cut: 35% per booking",
      "Priority support",
      "Profile visible city-wide",
      "Standard scheduling flexibility",
      "Enhanced booking analytics",
      "Access to seasonal promotions",
    ],
    colorClasses:
      "bg-gradient-to-br from-gray-400 to-gray-500 text-black ring-2 ring-gray-800",
    CardClass:
      "border border-3 border-gray-600 bg-linear-to-bl hover:bg-linear-to-tr from-gray-400/20 to-to-gray-500/20",
  },
  Gold: {
    label: "Gold",
    cut: 30,
    perks: [
      "Gym cut: 30% per booking",
      "Faster payout",
      "Homepage highlight",
      "High visibility in app listings",
      "Priority listing in search results",
      "Access to exclusive client leads",
      "Personalized marketing insights",
    ],
    colorClasses:
      "bg-gradient-to-br from-yellow-500 to-yellow-400 text-black ring-2 ring-yellow-800",
    CardClass:
      "border border-3 border-yellow-600 bg-linear-to-bl hover:bg-linear-to-tr from-yellow-400/20 to-to-yellow-500/20",
  },
  Diamond: {
    label: "Diamond",
    cut: 25,
    perks: [
      "Gym cut: 25% per booking",
      "Dedicated manager",
      "Feature in promotions",
      "Exclusive social media spotlights",
      "Early access to platform updates",
      "First priority for premium clients",
      "Access to advanced marketing tools",
    ],
    colorClasses:
      "bg-gradient-to-br from-blue-600 to-blue-500 text-white ring-2 ring-blue-800",
    CardClass:
      "border border-3 border-blue-600 bg-linear-to-bl hover:bg-linear-to-tr from-blue-400/20 to-to-blue-500/20",
  },
  Platinum: {
    label: "Platinum",
    cut: 20,
    perks: [
      "Gym cut: 20% per booking",
      "Full premium perks",
      "Top-tier search visibility",
      "Maximum promotional exposure",
      "24/7 support with priority queue",
      "Custom branding opportunities",
      "Invites to exclusive trainer events",
      "Revenue share incentives",
    ],
    colorClasses:
      "bg-gradient-to-br from-gray-800 to-gray-700 text-white ring-2 ring-gray-800",
    CardClass:
      "border border-3 border-gray-600 bg-linear-to-bl hover:bg-linear-to-tr from-gray-800/20 to-to-gray-700/20",
  },
};

const AllTrainerTierManagement = ({ trainer }) => {
  const tiers = Object.entries(tierSettings);
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState("fade-in");
  const [selectedTierKey, setSelectedTierKey] = useState(null);
  const [slideDirection, setSlideDirection] = useState("right");

  const closeModal = () =>
    document.getElementById("Trainers_Tier_Management")?.close();

  const handleSlide = (direction) => {
    setSlideDirection(direction === "next" ? "right" : "left");
    setFade("fade-out");
    setTimeout(() => {
      setCurrent((prev) => {
        const len = tiers.length;
        return direction === "next" ? (prev + 1) % len : (prev - 1 + len) % len;
      });
      setFade("fade-in");
    }, 300);
  };

  const handleSelectTier = () => {
    if (!selectedTierKey) {
      alert("No tier selected.");
      return;
    }
    const [key, tierData] = tiers.find(([key]) => key === selectedTierKey);
    alert(`Selected Tier: ${key} - ${tierData.label}`);
  };

  const [tierKey, tier] = tiers[current];
  const isSelected = tierKey === selectedTierKey;

  // Compose animation class dynamically based on fade and slideDirection
  const animationClass = `${fade}-${slideDirection}`;

  return (
    <div className="modal-box p-0 bg-gradient-to-b from-white to-gray-300 text-black max-h-[90vh] overflow-y-auto rounded-lg shadow-xl relative">
      {/* CSS Animation Styles */}
      <style>{`
        .fade-in-left {
          animation: fadeInLeft 0.3s ease forwards;
        }
        .fade-out-left {
          animation: fadeOutLeft 0.3s ease forwards;
        }
        .fade-in-right {
          animation: fadeInRight 0.3s ease forwards;
        }
        .fade-out-right {
          animation: fadeOutRight 0.3s ease forwards;
        }

        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeOutLeft {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(40px); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeOutRight {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(-40px); }
        }
      `}</style>

      {/* Modal Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-300 bg-white">
        <h2 className="font-semibold text-xl">
          Trainer {trainer?.name}&apos;s Tier Management
        </h2>
        <ImCross
          className="hover:text-red-600 cursor-pointer"
          onClick={closeModal}
        />
      </div>

      {/* Current Tier */}
      <div className="text-center">
        <p className=" font-semibold">Current Tier</p>
        <div
          className={`inline-block mt-1 px-10 py-2 rounded-full text-sm font-bold transition duration-500 ease-in-out ${
            tierSettings[trainer?.tier]?.colorClasses ||
            "bg-gray-300 text-gray-700 ring-2 ring-gray-400"
          }`}
        >
          {trainer?.tier || "None"} Tier
        </div>
      </div>

      {/* Slider with Animation */}
      <div className="flex items-center justify-center p-6 space-x-2">
        <button
          onClick={() => handleSlide("prev")}
          className="hover:bg-gray-300 rounded-full p-2 cursor-pointer"
        >
          <FaChevronLeft className="text-2xl text-gray-600 hover:text-black" />
        </button>

        <div
          className={`min-w-[400px] rounded-3xl border-l-4 border-r-4 ${
            isSelected ? " border-green-500" : "border-gray-300"
          }`}
        >
          <div
            onClick={() => setSelectedTierKey(tierKey)}
            className={`w-full p-4 rounded-3xl cursor-pointer transition duration-300 min-h-[300px] ${animationClass} ${tier.CardClass}`}
          >
            <h3 className="text-xl font-bold mb-2">{tier.label} Tier</h3>
            <p className="mb-2 font-medium">Gym Cut: {tier.cut}%</p>
            <ul className="list-disc ml-5 text-sm space-y-1">
              {tier.perks.map((perk, i) => (
                <li key={i}>{perk}</li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={() => handleSlide("next")}
          className="hover:bg-gray-300 rounded-full p-2"
        >
          <FaChevronRight className="text-2xl text-gray-600 hover:text-black" />
        </button>
      </div>

      {/* Confirm Button */}
      <div className="flex justify-center pb-4">
        <button
          onClick={handleSelectTier}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};

export default AllTrainerTierManagement;
