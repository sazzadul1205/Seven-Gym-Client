import PropTypes from "prop-types";
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

const TrainerDetailsContact = ({ TrainerDetails }) => {
  // Handle missing TrainerDetails or contact info
  if (!TrainerDetails || !TrainerDetails.contact) {
    return (
      <p className="text-red-500 text-center font-semibold">
        Contact details not available.
      </p>
    );
  }

  const { contact } = TrainerDetails;

  // Define social media links with brand colors
  const socialLinks = [
    {
      name: "LinkedIn",
      url: contact.linkedin,
      icon: <FaLinkedin />,
      color: "text-blue-700",
    },
    {
      name: "Instagram",
      url: contact.instagram,
      icon: <FaInstagram />,
      color: "text-pink-500",
    },
    {
      name: "Facebook",
      url: contact.facebook,
      icon: <FaFacebook />,
      color: "text-blue-600",
    },
    {
      name: "Twitter",
      url: contact.twitter,
      icon: <FaTwitter />,
      color: "text-sky-500",
    },
    {
      name: "YouTube",
      url: contact.youtube,
      icon: <FaYoutube />,
      color: "text-red-600",
    },
    {
      name: "Twitch",
      url: contact.twitch,
      icon: <FaTwitch />,
      color: "text-purple-600",
    },
    {
      name: "Pinterest",
      url: contact.pinterest,
      icon: <FaPinterest />,
      color: "text-red-500",
    },
    {
      name: "Snapchat",
      url: contact.snapchat,
      icon: <FaSnapchatGhost />,
      color: "text-yellow-500",
    },
    {
      name: "WhatsApp",
      url: contact.whatsapp,
      icon: <FaWhatsapp />,
      color: "text-green-500",
    },
    {
      name: "Reddit",
      url: contact.reddit,
      icon: <FaReddit />,
      color: "text-orange-500",
    },
    {
      name: "Discord",
      url: contact.discord,
      icon: <FaDiscord />,
      color: "text-indigo-500",
    },
    {
      name: "TikTok",
      url: contact.tiktok,
      icon: <FaTiktok />,
      color: "text-black",
    },
  ].filter((link) => link.url); // Remove empty or undefined links

  return (
    <div className="bg-gradient-to-bl from-gray-200 to-gray-400 p-6 rounded-lg shadow-lg max-w-4xl mx-auto w-full">
      {/* Header */}
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Contact Information
      </h2>

      {/* Content */}
      <div className="space-y-6">
        {/* Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Phone Section */}
          {contact.phone && (
            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md">
              <FaPhoneAlt className="text-green-600 text-xl" />
              <p className="text-gray-700 font-semibold">{contact.phone}</p>
            </div>
          )}

          {/* Email Section */}
          {contact.email && (
            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md">
              <FaEnvelope className="text-red-500 text-xl" />
              <a
                href={`mailto:${contact.email}`}
                className="text-blue-500 font-semibold hover:underline"
              >
                {contact.email}
              </a>
            </div>
          )}

          {/* Website Section - Takes full width only if it exists */}
          {contact.website && (
            <div className="col-span-1 lg:col-span-2 flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md">
              <FaGlobe className="text-blue-500 text-xl" />
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 font-semibold hover:underline truncate"
              >
                {contact.website}
              </a>
            </div>
          )}
        </div>

        {/* Social Links Section */}
        {socialLinks.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-700 text-center">
              Social Links
            </h3>
            <div className="flex flex-wrap justify-center gap-4 mt-4 border-t border-black pt-2">
              {socialLinks.map(({ name, url, icon, color }) => (
                <button
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center bg-white hover:bg-gray-300 rounded-full shadow-md hover:shadow-lg p-4 transition-all duration-300 ${color} cursor-pointer`}
                >
                  <span className="text-3xl">{icon}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* Prop Validation */
TrainerDetailsContact.propTypes = {
  TrainerDetails: PropTypes.shape({
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

export default TrainerDetailsContact;
