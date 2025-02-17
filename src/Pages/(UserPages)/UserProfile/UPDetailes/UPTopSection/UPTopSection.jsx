/* eslint-disable react/prop-types */
import { IoSettings } from "react-icons/io5"; // Import settings icon
import { Link } from "react-router";

// Function to determine the styles for the tier badge
const getTierBadge = (tier) => {
  const styles = {
    Bronze: "bg-orange-600 text-white ring-2 ring-orange-300 shadow-lg",
    Silver: "bg-gray-400 text-white ring-2 ring-gray-200 shadow-lg",
    Gold: "bg-yellow-500 text-white ring-2 ring-yellow-300 shadow-lg",
    Diamond: "bg-blue-600 text-white ring-2 ring-blue-300 shadow-lg",
    Platinum: "bg-gray-800 text-white ring-2 ring-gray-500 shadow-lg",
  };
  return styles[tier] || "bg-gray-200 text-gray-700";
};

const UPTopSection = ({ usersData, user, confEmail }) => {
  return (
    <div className="relative pb-24">
      {/* Background Image */}
      <img
        src={
          usersData?.backgroundImage || `https://via.placeholder.com/1200x400`
        }
        alt="Background Image"
        className="w-full h-[300px] sm:h-[400px] object-cover rounded-lg shadow-lg"
      />

      <div className="relative">
        {/* Settings Icon */}
        <div>
          {confEmail === user?.email && (
            <div className="absolute top-2 right-10 sm:top-2 sm:right-10 md:top-2 md:right-10 z-20 sm:left-0 sm:ml-4 sm:mb-4">
              <Link to="/User/UserSettings">
                <IoSettings className="text-red-500 text-4xl transition-all duration-500 hover:rotate-180 hover:text-red-300" />
              </Link>
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="absolute bottom-[-60px] left-4 sm:left-16 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 sm:space-y-0 space-y-4">
          {/* Profile Image */}
          <img
            src={usersData?.profileImage || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-white shadow-md"
          />

          {/* User Info */}
          <div className="ml-4 text-center sm:text-left">
            <h2 className="text-2xl sm:text-4xl font-semibold text-white">
              {usersData?.fullName || "Default Name"}
            </h2>

            {/* Tier Badge */}
            <div className="pb-1">
              {usersData?.tier &&
                (confEmail === user?.email ? (
                  // Interactive badge for the profile owner
                  <Link
                    to={`/User/${user.email}/TierUpgrade`}
                    className={`inline-block px-4 py-2 mt-2 rounded-full text-sm font-semibold hover:scale-110 ${getTierBadge(
                      usersData.tier
                    )}`}
                  >
                    {usersData.tier} Tier
                  </Link>
                ) : (
                  // Non-interactive badge for other users
                  <span
                    className={`inline-block px-4 py-2 mt-2 rounded-full text-sm font-semibold cursor-default ${getTierBadge(
                      usersData.tier
                    )}`}
                  >
                    {usersData.tier} Tier
                  </span>
                ))}
            </div>

            {/* Email Address */}
            <p className="text-black text-lg">
              {usersData?.email || "example@example.com"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPTopSection;
