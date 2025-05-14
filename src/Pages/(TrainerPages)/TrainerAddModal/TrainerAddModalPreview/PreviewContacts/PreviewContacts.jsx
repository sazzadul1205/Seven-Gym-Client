import PropTypes from "prop-types";

// Icons
import {
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
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
} from "react-icons/fa";

import { Tooltip } from "react-tooltip";

const PreviewContacts = ({ trainerBasicInfo }) => {
  // Define social media links with their icons and colors
  const socialLinks = [
    {
      name: "LinkedIn",
      url: trainerBasicInfo?.contact?.linkedin,
      icon: <FaLinkedin />,
      color: "text-blue-700",
    },
    {
      name: "Instagram",
      url: trainerBasicInfo?.contact?.instagram,
      icon: <FaInstagram />,
      color: "text-pink-500",
    },
    {
      name: "Facebook",
      url: trainerBasicInfo?.contact?.facebook,
      icon: <FaFacebook />,
      color: "text-blue-600",
    },
    {
      name: "Twitter",
      url: trainerBasicInfo?.contact?.twitter,
      icon: <FaTwitter />,
      color: "text-sky-500",
    },
    {
      name: "YouTube",
      url: trainerBasicInfo?.contact?.youtube,
      icon: <FaYoutube />,
      color: "text-red-600",
    },
    {
      name: "Twitch",
      url: trainerBasicInfo?.contact?.twitch,
      icon: <FaTwitch />,
      color: "text-purple-600",
    },
    {
      name: "Pinterest",
      url: trainerBasicInfo?.contact?.pinterest,
      icon: <FaPinterest />,
      color: "text-red-500",
    },
    {
      name: "Snapchat",
      url: trainerBasicInfo?.contact?.snapchat,
      icon: <FaSnapchatGhost />,
      color: "text-yellow-500",
    },
    {
      name: "WhatsApp",
      url: trainerBasicInfo?.contact?.whatsapp,
      icon: <FaWhatsapp />,
      color: "text-green-500",
    },
    {
      name: "Reddit",
      url: trainerBasicInfo?.contact?.reddit,
      icon: <FaReddit />,
      color: "text-orange-500",
    },
    {
      name: "Discord",
      url: trainerBasicInfo?.contact?.discord,
      icon: <FaDiscord />,
      color: "text-indigo-500",
    },
    {
      name: "TikTok",
      url: trainerBasicInfo?.contact?.tiktok,
      icon: <FaTiktok />,
      color: "text-black",
    },
  ].filter((link) => link.url); // Filter out empty links

  return (
    <div className="p-2">
      {/* Section Header */}
      <h2 className="text-xl font-semibold text-gray-800 py-2">
        Contact Information
      </h2>

      <div>
        {/* Contact Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Phone */}
          {trainerBasicInfo?.contact?.phone && (
            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md">
              <FaPhoneAlt className="text-green-600 text-xl" />
              <p className="text-gray-700 font-semibold">
                {trainerBasicInfo.contact.phone}
              </p>
            </div>
          )}

          {/* Email */}
          {trainerBasicInfo?.contact?.email && (
            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md">
              <FaEnvelope className="text-red-500 text-xl" />
              <a
                href={`mailto:${trainerBasicInfo.contact.email}`}
                className="text-blue-500 font-semibold hover:underline"
              >
                {trainerBasicInfo.contact.email}
              </a>
            </div>
          )}

          {/* Website */}
          {trainerBasicInfo?.contact?.website && (
            <div className="col-span-1 lg:col-span-2 flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md">
              <FaGlobe className="text-blue-500 text-xl" />
              <a
                href={trainerBasicInfo.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 font-semibold hover:underline truncate"
              >
                {trainerBasicInfo.contact.website}
              </a>
            </div>
          )}
        </div>

        {/* Social Media Icons */}
        <div className="py-2">
          {socialLinks.length > 0 && (
            <div className="flex flex-wrap justify-center pt-4 gap-4">
              {socialLinks.map(({ name, url, icon, color }) => {
                const tooltipId = `trainer_social_link_tooltip_${name}`;

                return (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-tooltip-id={tooltipId}
                    data-tooltip-content={url}
                    className={`flex items-center justify-center bg-white hover:bg-gray-300 rounded-full shadow-md hover:shadow-lg p-4 transition-all duration-300 ${color}`}
                    aria-label={`${name} link`}
                  >
                    <span className="text-3xl">{icon}</span>
                    <Tooltip
                      id={tooltipId}
                      place="top"
                      effect="solid"
                      className="z-50"
                    />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

PreviewContacts.propTypes = {
  trainerBasicInfo: PropTypes.shape({
    contact: PropTypes.shape({
      phone: PropTypes.string,
      email: PropTypes.string,
      website: PropTypes.string,
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
    }),
  }),
};

export default PreviewContacts;
