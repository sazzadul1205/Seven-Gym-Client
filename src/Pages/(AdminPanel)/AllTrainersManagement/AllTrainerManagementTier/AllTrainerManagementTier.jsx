import { useState } from "react";

// Import PAckages
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Import Icons
import { ImCross } from "react-icons/im";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// JSON for Tier Data
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
      "text-white bg-gradient-to-br from-gray-400 to-gray-500 text-black ring-2 ring-gray-800",
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

const AllTrainerManagementTier = ({ trainer, Refetch }) => {
  const axiosPublic = useAxiosPublic();
  // Convert the tierSettings object into an array of [key, value] pairs
  const tiers = Object.entries(tierSettings);

  // State to track the currently visible tier index
  const [current, setCurrent] = useState(0);

  // State to manage fade animation ("fade-in" or "fade-out")
  const [fade, setFade] = useState("fade-in");

  // State to keep track of the currently selected tier key
  const [selectedTierKey, setSelectedTierKey] = useState(null);

  // State to determine direction of slide animation ("left" or "right")
  const [slideDirection, setSlideDirection] = useState("right");

  // Function to close the modal using DOM API
  const closeModal = () =>
    document.getElementById("Trainer_Tier_Management")?.close();

  // Function to handle tier slide navigation
  const handleSlide = (direction) => {
    // Set slide direction based on navigation
    setSlideDirection(direction === "next" ? "right" : "left");

    // Trigger fade-out animation
    setFade("fade-out");

    // After animation duration, change the current tier index
    setTimeout(() => {
      setCurrent((prev) => {
        const len = tiers.length;
        // Cycle through the tiers array circularly
        return direction === "next" ? (prev + 1) % len : (prev - 1 + len) % len;
      });
      // Trigger fade-in animation
      setFade("fade-in");
    }, 300); // 300ms timeout to match CSS animation duration
  };

  // Destructure the currently selected tier using index
  const [tierKey, tier] = tiers[current];

  // Boolean to check if current tier is the one selected
  const isSelected = tierKey === selectedTierKey;

  // Combine fade and slide direction into a single class name for animation
  const animationClass = `${fade}-${slideDirection}`;

  // Function to handle tier selection and updating trainer's tier
  const handleSelectTier = async () => {
    // Do nothing if no tier is selected or trainer ID is missing
    if (!selectedTierKey || !trainer?._id) return;

    // Get the selected tier's data using its key
    // eslint-disable-next-line no-unused-vars
    const [key, tierData] = tiers.find(([key]) => key === selectedTierKey);

    try {
      // Send a PATCH request to update the trainer's tier
      const response = await axiosPublic.patch("/Trainers/UpdateTier", {
        id: trainer._id,
        newTier: tierData.label, // Send the label of the new tier
      });

      if (response.data?.success) {
        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Tier Updated",
          text: `${tierData.label} has been assigned to the trainer.`,
          timer: 2000,
          showConfirmButton: false,
        });

        // Reset selected tier and close modal
        setSelectedTierKey(null);
        closeModal();

        // Trigger data refetch to update UI
        Refetch();
      } else {
        // Show failure alert if server didn't succeed
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "The server could not process your request.",
        });
      }
    } catch (error) {
      // Catch and display any network/server errors
      console.error("Error updating trainer tier:", error);
      closeModal();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while updating the tier.",
      });
    }
  };

  return (
    <div className="modal-box p-0 bg-gradient-to-b from-white to-gray-300 text-black max-h-[90vh] overflow-y-auto rounded-lg shadow-xl relative">
      {/* Embedded CSS for custom animation styles used during tier sliding */}
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
     
         /* Slide in from left */
         @keyframes fadeInLeft {
           from { opacity: 0; transform: translateX(-40px); }
           to { opacity: 1; transform: translateX(0); }
         }
     
         /* Slide out to right */
         @keyframes fadeOutLeft {
           from { opacity: 1; transform: translateX(0); }
           to { opacity: 0; transform: translateX(40px); }
         }
     
         /* Slide in from right */
         @keyframes fadeInRight {
           from { opacity: 0; transform: translateX(40px); }
           to { opacity: 1; transform: translateX(0); }
         }
     
         /* Slide out to left */
         @keyframes fadeOutRight {
           from { opacity: 1; transform: translateX(0); }
           to { opacity: 0; transform: translateX(-40px); }
         }
      `}</style>

      {/* Modal Header: Shows trainer's name and a close button */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-300 bg-white">
        <h2 className="font-semibold text-xl">
          Trainer {trainer?.name}&apos;s Tier Management
        </h2>
        {/* Close icon with hover effect */}
        <ImCross
          className="hover:text-red-600 cursor-pointer"
          onClick={closeModal}
        />
      </div>

      {/* Display Current Tier */}
      <div className="text-center">
        <p className=" font-semibold">Current Tier</p>
        <div
          className={`inline-block mt-1 px-10 py-2 rounded-full text-sm font-bold transition duration-500 ease-in-out ${
            // Use color classes based on the current tier or fallback to gray
            tierSettings[trainer?.tier]?.colorClasses ||
            "bg-gray-300 text-gray-700 ring-2 ring-gray-400"
          }`}
        >
          {trainer?.tier || "None"} Tier
        </div>
      </div>

      {/* Slider Navigation Section */}
      <div className="flex items-center justify-center p-6 space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => handleSlide("prev")}
          className="hover:bg-gray-300 rounded-full p-2 cursor-pointer"
        >
          <FaChevronLeft className="text-2xl text-gray-600 hover:text-black" />
        </button>

        {/* Tier Card with animation and selection logic */}
        <div
          className={`min-w-[400px] rounded-3xl border-l-4 border-r-4 ${
            isSelected ? " border-green-500" : "border-gray-300"
          }`}
        >
          <div
            onClick={() => setSelectedTierKey(tierKey)} // Selects the tier on click
            className={`w-full p-4 rounded-3xl cursor-pointer transition duration-300 min-h-[300px] ${animationClass} ${tier.CardClass}`}
          >
            <h3 className="text-xl font-bold mb-2">{tier.label} Tier</h3>
            <p className="mb-2 font-medium">Gym Cut: {tier.cut}%</p>
            <ul className="list-disc ml-5 text-sm space-y-1">
              {/* List of perks associated with this tier */}
              {tier.perks.map((perk, i) => (
                <li key={i}>{perk}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={() => handleSlide("next")}
          className="hover:bg-gray-300 rounded-full p-2"
        >
          <FaChevronRight className="text-2xl text-gray-600 hover:text-black" />
        </button>
      </div>

      {/* Show selected tier badge if any tier is selected */}
      {selectedTierKey && (
        <div className="flex justify-between items-center px-6 py-4">
          {/* Left side text display */}
          <div className="text-sm font-semibold text-gray-700">
            Selected Tier:{" "}
            <span className="text-black font-bold">
              {tiers.find(([key]) => key === selectedTierKey)?.[1].label} Tier
            </span>
          </div>

          {/* Right side colored badge */}
          <div
            className={`inline-block px-10 py-2 rounded-full text-sm font-bold transition duration-500 ease-in-out  ${
              tierSettings[selectedTierKey]?.colorClasses ||
              "bg-gray-300 text-gray-700 ring-gray-400"
            }`}
          >
            {selectedTierKey} Tier
          </div>
        </div>
      )}

      {/* Confirmation Button to finalize tier selection */}
      <div className="flex justify-center pb-4">
        <CommonButton
          clickEvent={handleSelectTier}
          text="Confirm Selection"
          bgColor="green"
          textColor="text-white"
          px="px-6"
          py="py-2"
          borderRadius="rounded"
          width="auto"
        />
      </div>
    </div>
  );
};

AllTrainerManagementTier.propTypes = {
  trainer: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    tier: PropTypes.string,
  }).isRequired,
  Refetch: PropTypes.func.isRequired,
};

export default AllTrainerManagementTier;
