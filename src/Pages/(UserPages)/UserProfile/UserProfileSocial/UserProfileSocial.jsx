import PropTypes from "prop-types";

// Import Icons
import {
  FaLink,
  FaLinkedin,
  FaFacebook,
  FaYoutube,
  FaTwitch,
  FaPinterest,
  FaWhatsapp,
  FaReddit,
  FaDiscord,
  FaTiktok,
} from "react-icons/fa6";
import {
  FaInstagram,
  FaTwitter,
  FaTelegram,
  FaEnvelope,
  FaSnapchatGhost,
} from "react-icons/fa";

const UserProfileSocial = ({ usersData }) => {
  const { socialLinks } = usersData || {};

  // Check if there are any social links
  const hasSocialLinks =
    socialLinks && Object.values(socialLinks).some((link) => link);

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
    { name: "TikTok", key: "tiktok", icon: <FaTiktok />, color: "text-black" },
    {
      name: "Telegram",
      key: "telegram",
      icon: <FaTelegram />,
      color: "text-[#0088cc]",
    },
  ];

  return (
    <div className="bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-300 p-5 shadow-xl rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-4 pb-2">
        <FaLink className="text-blue-500 text-xl" />
        <p className="text-xl font-semibold text-black">User Links</p>
      </div>

      <div className="bg-black p-[1px]"></div>

      {/* Social Links Grid */}
      {hasSocialLinks ? (
        <div className="flex flex-wrap gap-4 pt-5">
          {socialPlatforms
            .filter((platform) => socialLinks[platform.key])
            .map(({ name, key, icon, color }) => (
              <button
                key={key}
                href={socialLinks[key]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-400/50 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg w-14 h-14 cursor-pointer"
                aria-label={name}
              >
                <span className={`text-2xl ${color}`}>{icon}</span>
              </button>
            ))}

          {/* Email (Special case) */}
          {socialLinks.email && (
            <button
              href={`mailto:${socialLinks.email}`}
              className="flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-400/50 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg w-14 h-14 cursor-pointer"
              aria-label="Email"
            >
              <FaEnvelope className="text-red-500 text-2xl" />
            </button>
          )}
        </div>
      ) : (
        <p className="text-gray-500 pt-3">No social links available.</p>
      )}
    </div>
  );
};

// PropTypes Validation
UserProfileSocial.propTypes = {
  usersData: PropTypes.shape({
    socialLinks: PropTypes.shape({
      linkedin: PropTypes.string,
      instagram: PropTypes.string,
      facebook: PropTypes.string,
      twitter: PropTypes.string,
      youtube: PropTypes.string,
      twitch: PropTypes.string,
      pinterest: PropTypes.string,
      snapchat: PropTypes.string,
      whatsapp: PropTypes.string,
      reddit: PropTypes.string,
      discord: PropTypes.string,
      tiktok: PropTypes.string,
      telegram: PropTypes.string,
      email: PropTypes.string,
    }),
  }),
};

export default UserProfileSocial;
