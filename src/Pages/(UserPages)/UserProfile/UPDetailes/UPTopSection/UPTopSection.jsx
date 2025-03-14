import PropTypes from "prop-types";
import { Link } from "react-router"; 
import { IoSettings } from "react-icons/io5";

// Function to determine tier badge styles
const getTierBadge = (tier) => {
  return `px-4 py-2 mt-2 rounded-full text-sm font-semibold shadow-lg transition-transform ${
    {
      Bronze:
        "bg-linear-to-l hover:bg-linear-to-r from-orange-300 to-orange-500",
      Silver: "bg-linear-to-l hover:bg-linear-to-r from-gray-300 to-gray-500",
      Gold: "bg-linear-to-l hover:bg-linear-to-r from-yellow-300 to-yellow-500",
      Diamond: "bg-linear-to-l hover:bg-linear-to-r from-blue-300 to-blue-500",
      Platinum: "bg-linear-to-l hover:bg-linear-to-r from-gray-500 to-gray-700",
    }[tier] || "bg-linear-to-l hover:bg-linear-to-r from-green-300 to-green-500"
  }`;
};

const UPTopSection = ({ usersData, user, confEmail }) => {
  const isProfileOwner = confEmail === user?.email;

  return (
    <div className="relative pb-24">
      {/* Background Image Section */}
      <img
        src={
          usersData?.backgroundImage || "https://via.placeholder.com/1200x400"
        }
        alt="User Background"
        className="w-full h-[300px] sm:h-[400px] object-cover"
      />

      {/* Settings Icon (Visible Only to Profile Owner) */}
      {isProfileOwner && (
        <div className="absolute top-0 right-0 bg-gray-400/50 p-5">
          <Link to="/User/UserSettings" className="pointer-events-auto">
            <IoSettings className="text-red-500 text-4xl transition-transform duration-500 hover:rotate-180 hover:text-red-300" />
          </Link>
        </div>
      )}

      <div className="relative">
        {/* Full-width Background for Profile Section */}
        <div className="absolute bottom-[-60px] left-0 w-full h-[120px] bg-gradient-to-t from-white/90 to-black/50"></div>

        {/* User Profile Section */}
        <div className="absolute bottom-[-60px] left-4 sm:left-16 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 sm:space-y-0 space-y-4 px-5">
          {/* Profile Image */}
          <img
            src={usersData?.profileImage || "https://via.placeholder.com/150"}
            alt="User Profile"
            className="w-28 h-28 rounded-full border-4 border-white shadow-md"
          />

          {/* User Info */}
          <div className="ml-4 text-center sm:text-left text-white">
            <h2 className="text-2xl sm:text-4xl font-semibold">
              {usersData?.fullName || "Default Name"}
            </h2>

            {/* Tier Badge */}
            {usersData?.tier && (
              <div className="pb-1 pt-5">
                {isProfileOwner ? (
                  // Clickable badge for the profile owner (redirects to Tier Upgrade page)
                  <Link to={`/User/${user.email}/TierUpgrade`}>
                    <button
                      className={`${getTierBadge(
                        usersData.tier
                      )} cursor-pointer`}
                    >
                      {usersData.tier} Tier
                    </button>
                  </Link>
                ) : (
                  // Non-clickable badge for other users
                  <button
                    className={`${getTierBadge(usersData.tier)} cursor-default`}
                  >
                    {usersData.tier} Tier
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
UPTopSection.propTypes = {
  usersData: PropTypes.shape({
    backgroundImage: PropTypes.string,
    profileImage: PropTypes.string,
    fullName: PropTypes.string,
    tier: PropTypes.oneOf(["Bronze", "Silver", "Gold", "Diamond", "Platinum"]),
    email: PropTypes.string,
  }),
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }).isRequired,
  confEmail: PropTypes.string.isRequired,
};

export default UPTopSection;
