import { useState } from "react";

// Import Package
import PropTypes from "prop-types";

// Importing icons from react-icons
import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaTwitch,
  FaPinterest,
  FaSnapchatGhost,
  FaWhatsapp,
  FaReddit,
  FaDiscord,
  FaTiktok,
  FaTelegram,
} from "react-icons/fa";
import { MdAdd, MdClose } from "react-icons/md";

// Social media platforms with icons & colors
const socialPlatforms = [
  {
    name: "LinkedIn",
    key: "linkedin",
    icon: <FaLinkedin />,
    color: "text-blue-700",
  },
  {
    name: "Instagram",
    key: "instagram",
    icon: <FaInstagram />,
    color: "text-pink-500",
  },
  {
    name: "Facebook",
    key: "facebook",
    icon: <FaFacebook />,
    color: "text-blue-600",
  },
  {
    name: "Twitter",
    key: "twitter",
    icon: <FaTwitter />,
    color: "text-sky-500",
  },
  {
    name: "YouTube",
    key: "youtube",
    icon: <FaYoutube />,
    color: "text-red-600",
  },
  {
    name: "Twitch",
    key: "twitch",
    icon: <FaTwitch />,
    color: "text-purple-600",
  },
  {
    name: "Pinterest",
    key: "pinterest",
    icon: <FaPinterest />,
    color: "text-red-500",
  },
  {
    name: "Snapchat",
    key: "snapchat",
    icon: <FaSnapchatGhost />,
    color: "text-yellow-500",
  },
  {
    name: "WhatsApp",
    key: "whatsapp",
    icon: <FaWhatsapp />,
    color: "text-green-500",
  },
  {
    name: "Reddit",
    key: "reddit",
    icon: <FaReddit />,
    color: "text-orange-500",
  },
  {
    name: "Discord",
    key: "discord",
    icon: <FaDiscord />,
    color: "text-indigo-500",
  },
  {
    name: "TikTok",
    key: "tiktok",
    icon: <FaTiktok />,
    color: "text-black",
  },
  {
    name: "Telegram",
    key: "telegram",
    icon: <FaTelegram />,
    color: "text-[#0088cc]",
  },
];

const SocialLinkSelector = ({ UsersData }) => {
  // Initialize socialLinks state with fetched UsersData.socialLinks or an empty object
  const [socialLinks, setSocialLinks] = useState(UsersData?.socialLinks || {});

  // Keep track of which platforms have been "added" (active)
  const [addedPlatforms, setAddedPlatforms] = useState(() => {
    // Only include platforms that have a non-empty link initially
    if (UsersData && UsersData.socialLinks) {
      return Object.keys(UsersData.socialLinks).filter(
        (key) => UsersData.socialLinks[key].trim() !== ""
      );
    }
    return [];
  });

  // Handler to update social link state for each platform
  const handleSocialLinkChange = (key, value) => {
    setSocialLinks((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handler for adding a new social link (platform) from inactive list
  const handleAddPlatform = (key) => {
    // Add to the active list if not already added
    if (!addedPlatforms.includes(key)) {
      setAddedPlatforms((prev) => [...prev, key]);
      // Optionally initialize the value to empty string if not already set
      setSocialLinks((prev) => ({
        ...prev,
        [key]: prev[key] || "",
      }));
    }
  };

  // Handler for removing a platform from active list
  const handleRemovePlatform = (key) => {
    // Clear the link and remove the platform from active list
    setSocialLinks((prev) => ({ ...prev, [key]: "" }));
    setAddedPlatforms((prev) =>
      prev.filter((platformKey) => platformKey !== key)
    );
  };

  // Compute active and inactive platforms
  const activePlatforms = socialPlatforms.filter((p) =>
    addedPlatforms.includes(p.key)
  );
  const inactivePlatforms = socialPlatforms.filter(
    (p) => !addedPlatforms.includes(p.key)
  );

  return (
    <div className="bg-gray-400/50 p-3 text-black">
      {/* Title */}
      <h3 className="text-xl font-semibold text-black py-1">Social Links:</h3>

      {/* Divider */}
      <div className="bg-white p-[2px] w-1/2 mb-4"></div>

      {/* Active Social Links: Platforms that have been added */}
      {activePlatforms.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {activePlatforms.map((platform) => (
            <div key={platform.key} className="flex items-center gap-2">
              {/* Icons */}
              <div className="p-1 bg-white rounded-full">
                <span className={`text-4xl ${platform.color}`}>
                  {platform.icon}
                </span>
              </div>

              {/* input Fields */}
              <input
                type="text"
                placeholder={platform.name}
                value={socialLinks[platform.key] || ""}
                onChange={(e) =>
                  handleSocialLinkChange(platform.key, e.target.value)
                }
                className="input input-bordered w-full rounded-lg bg-white border-gray-600"
              />
              <MdClose
                onClick={() => handleRemovePlatform(platform.key)}
                className="cursor-pointer text-4xl hover:scale-105 transition-all duration-300 text-red-500 bg-white rounded-full p-1"
              />
            </div>
          ))}
        </div>
      )}

      {/* More Social Links */}
      <div className="bg-gray-300 p-2">
        {/* Title */}
        <h3 className="text-xl font-semibold text-black py-1">
          Add More Social Links:
        </h3>

        {/* Divider */}
        <div className="bg-white p-[2px] w-1/3 mb-4"></div>

        {/* Inactive Social Links: Displayed with a plus icon to add */}
        {inactivePlatforms.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {inactivePlatforms.map((platform) => (
              <div
                key={platform.key}
                className="flex flex-col items-center gap-1"
              >
                <div className="p-1 flex bg-white rounded-full items-centers">
                  {/* Icons */}
                  <span className={`text-4xl ${platform.color}`}>
                    {platform.icon}
                  </span>
                  {/* Add Fields */}
                  <p
                    className={`text-4xl p-2 bg-gray-200 rounded-full ml-2 ${platform.color} hover:scale-150 cursor-pointer`}
                    onClick={() => handleAddPlatform(platform.key)}
                  >
                    <MdAdd className="text-xl" />
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

SocialLinkSelector.propTypes = {
  UsersData: PropTypes.shape({
    socialLinks: PropTypes.objectOf(PropTypes.string),
  }),
};

export default SocialLinkSelector;
