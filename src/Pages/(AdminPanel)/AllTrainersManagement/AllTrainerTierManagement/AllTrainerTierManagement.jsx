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
  },
};

const AllTrainerTierManagement = ({ trainer }) => {
  const tiers = Object.entries(tierSettings);
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState("fade-in");

  const closeModal = () =>
    document.getElementById("Trainers_Tier_Management")?.close();

  const handleSlide = (direction) => {
    setFade("fade-out");
    setTimeout(() => {
      setCurrent((prev) => {
        const len = tiers.length;
        return direction === "next" ? (prev + 1) % len : (prev - 1 + len) % len;
      });
      setFade("fade-in");
    }, 300);
  };

  const [tierKey, tier] = tiers[current];

  return (
    <div className="modal-box p-0 bg-gradient-to-b from-white to-gray-300 text-black max-h-[90vh] overflow-y-auto rounded-lg shadow-xl relative">
      {/* CSS Animation Styles */}
      <style>{`
        .fade-in {
          animation: fadeIn 0.3s ease forwards;
        }
        .fade-out {
          animation: fadeOut 0.3s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(10px); }
        }
      `}</style>

      {/* Modal Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-300 bg-white sticky top-0 z-10">
        <h2 className="font-semibold text-xl">
          Trainer {trainer?.name}&apos;s Tier Management
        </h2>
        <ImCross
          className="hover:text-red-600 cursor-pointer"
          onClick={closeModal}
        />
      </div>

      {/* Current Tier */}
      <div className="text-center mt-4">
        <p className="text-lg font-semibold">Current Tier</p>
        <div
          className={`inline-block mt-2 px-6 py-2 rounded-full text-sm font-bold transition duration-500 ease-in-out ${
            tierSettings[trainer?.tier]?.colorClasses ||
            "bg-gray-300 text-gray-700 ring-2 ring-gray-400"
          }`}
        >
          {trainer?.tier || "None"} Tier
        </div>
      </div>

      {/* Slider with Animation */}
      <div className="flex items-center justify-center p-6 space-x-4">
        <button onClick={() => handleSlide("prev")}>
          <FaChevronLeft className="text-2xl text-gray-600 hover:text-black" />
        </button>

        <div
          className={`w-full max-w-md p-5 rounded-xl border-2 transition-all duration-500 ${fade} ${
            tier.colorClasses
              .split(" ")
              .find((cls) => cls.startsWith("ring-")) || "border-gray-400"
          }`}
        >
          <h3 className="text-xl font-bold mb-2">{tier.label} Tier</h3>
          <p className="mb-2 font-medium">Gym Cut: {tier.cut}%</p>
          <ul className="list-disc ml-5 text-sm space-y-1">
            {tier.perks.map((perk, i) => (
              <li key={i}>{perk}</li>
            ))}
          </ul>
        </div>

        <button onClick={() => handleSlide("next")}>
          <FaChevronRight className="text-2xl text-gray-600 hover:text-black" />
        </button>
      </div>
    </div>
  );
};

export default AllTrainerTierManagement;
