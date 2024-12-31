/* eslint-disable react/prop-types */

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

const UPTopSection = ({ usersData }) => {
  return (
    <div className="relative pb-24">
      <img
        src={
          usersData?.backgroundImage || `https://via.placeholder.com/1200x400`
        }
        alt="Background Image"
        className="w-full h-[400px] object-cover rounded-lg shadow-lg"
      />
      <div className="relative">
        {/* User section */}
        <div className="absolute bottom-[-50px] left-16 flex items-center space-x-4">
          <img
            src={usersData?.profileImage || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-white shadow-md"
          />
          <div className="ml-4">
            <h2 className="text-4xl font-semibold text-white">
              {usersData?.fullName || "Default Name"}
            </h2>
            {/* Tier Badge */}
            <div className="pb-1">
              {usersData?.tier && (
                <span
                  className={`inline-block px-4 py-2 mt-2 rounded-full text-sm font-semibold ${getTierBadge(
                    usersData.tier
                  )}`}
                >
                  {usersData.tier} Tier
                </span>
              )}
            </div>
            <p className="text-white">
              {usersData?.email || "example@example.com"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPTopSection;
