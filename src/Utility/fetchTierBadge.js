/**
 * Returns the style classes for a tier badge based on the tier.
 * @param {string} tier - The name of the tier (e.g., "Bronze", "Silver").
 * @returns {string} - Tailwind CSS class string for the badge styling.
 */
export const fetchTierBadge = (tier) => {
  // Base badge styles that apply to all tiers
  const baseStyles =
    "px-8 py-2 mt-2 rounded-full text-sm font-semibold shadow-lg transition duration-300 ease-in-out";

  // Mapping of tier names to Tailwind CSS classes
  const tierStyles = {
    Bronze:
      "bg-gradient-to-bl hover:bg-gradient-to-tr from-orange-300 to-orange-500 ring-2 ring-orange-700 text-black",
    Silver:
      "bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-300 to-gray-500 ring-2 ring-gray-700 text-white",
    Gold: "bg-gradient-to-bl hover:bg-gradient-to-tr from-yellow-300 to-yellow-500 ring-2 ring-yellow-700 text-black",
    Diamond:
      "bg-gradient-to-bl hover:bg-gradient-to-tr from-blue-300 to-blue-500 ring-2 ring-blue-700 text-white",
    Platinum:
      "bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-500 to-gray-700 ring-2 ring-gray-900 text-white",
  };

  // Default tier style for unknown or invalid tier
  const defaultTierStyle =
    "bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-500 to-gray-600 ring-2 ring-gray-800 text-white";

  // Return the combined class string for the badge based on the tier
  return `${baseStyles} ${tierStyles[tier] || defaultTierStyle}`;
};
