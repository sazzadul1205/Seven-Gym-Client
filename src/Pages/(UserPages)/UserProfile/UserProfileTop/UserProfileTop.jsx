import { Link } from "react-router";

// Packages import
import PropTypes from "prop-types";

// Icons Import
import { IoSettings } from "react-icons/io5";

// Import Badge
import { fetchTierBadge } from "../../../../Utility/fetchTierBadge";

const UserProfileTop = ({ usersData, user, confEmail }) => {
  // Check if the current user is viewing their own profile
  const isProfileOwner = confEmail === user?.email;

  return (
    <div className="relative pb-24 text-black ">
      {/* Background Image Section */}
      <img
        src={
          usersData?.backgroundImage ||
          "https://i.ibb.co/Kx8MX6rQ/Wood-Background.jpg"
        }
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://i.ibb.co/Kx8MX6rQ/Wood-Background.jpg";
        }}
        alt="User Background"
        className="w-full h-[400px] object-cover"
      />

      {/* Settings Icon (Visible Only to Profile Owner) */}
      {isProfileOwner && (
        <div className="absolute top-2 right-2 bg-gray-400/50 p-3 rounded-full">
          <Link to="/User/UserSettings?tab=User_Info_Settings">
            <IoSettings className="text-red-500 text-4xl transition-transform duration-500 hover:rotate-180 hover:text-red-300" />
          </Link>
        </div>
      )}

      <div className="relative">
        {/* Gradient Overlay to Enhance Readability */}
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
                  // Clickable badge for profile owner
                  <Link to={`/User/TierUpgrade/${user?.email}`}>
                    <button
                      className={`${fetchTierBadge(
                        usersData.tier
                      )} cursor-pointer`}
                    >
                      {usersData.tier} Tier
                    </button>
                  </Link>
                ) : (
                  // Non-clickable badge for other users
                  <button
                    className={`${fetchTierBadge(
                      usersData.tier
                    )} cursor-default`}
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
UserProfileTop.propTypes = {
  usersData: PropTypes.shape({
    backgroundImage: PropTypes.string,
    profileImage: PropTypes.string,
    fullName: PropTypes.string,
    tier: PropTypes.oneOf(["Bronze", "Silver", "Gold", "Diamond", "Platinum"]),
    email: PropTypes.string,
  }),
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }),
  confEmail: PropTypes.string.isRequired,
};

export default UserProfileTop;
