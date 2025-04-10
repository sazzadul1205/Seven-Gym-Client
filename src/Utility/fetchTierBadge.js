/**
 * Returns the style classes for a tier badge based on the tier.
 * @param {string} tier - The name of the tier (e.g., "Bronze", "Silver").
 * @returns {string} - Tailwind CSS class string for the badge styling.
 */
export const fetchTierBadge = (tier) => {
  const tierStyles = {
    Bronze:
      "bg-gradient-to-bl hover:bg-gradient-to-tr from-orange-300 to-orange-500 ring-2 ring-orange-700",
    Silver:
      "bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-300 to-gray-500 ring-2 ring-gray-700 text-white",
    Gold: "bg-gradient-to-bl hover:bg-gradient-to-tr from-yellow-300 to-yellow-500 ring-2 ring-yellow-700 text-black",
    Diamond:
      "bg-gradient-to-bl hover:bg-gradient-to-tr from-blue-300 to-blue-500 ring-2 ring-blue-700 text-white",
    Platinum:
      "bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-500 to-gray-700 ring-2 ring-gray-900 text-white",
  };

  return `px-8 py-2 mt-2 rounded-full text-sm font-semibold shadow-lg ${
    tierStyles[tier] ||
    "bg-gradient-to-bl hover:bg-gradient-to-tr from-green-300 to-green-500 ring-2 ring-green-700"
  }`;
};
