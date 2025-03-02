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
    <div className="bg-linear-to-bl from-gray-100 to-gray-300 p-6 rounded-lg shadow-lg max-w-4xl mx-auto w-full">
      {/* Header */}
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Contact Information
      </h2>

      {/* Phone Section */}
      {contact.phone && (
        <div className="mb-6 flex gap-5 items-center">
          <h3 className="font-semibold text-xl text-gray-700 flex items-center">
            <FaPhoneAlt className="mr-3 text-green-600" />
            Phone:
          </h3>
          <p className="text-lg text-gray-600">{contact.phone}</p>
        </div>
      )}

      {/* Email Section */}
      {contact.email && (
        <div className="mb-6 flex gap-5 items-center">
          <h3 className="font-semibold text-xl text-gray-700 flex items-center">
            <FaEnvelope className="mr-3 text-red-500" />
            Email:
          </h3>
          <a
            href={`mailto:${contact.email}`}
            className="text-lg text-gray-600 underline hover:text-blue-500 transition-all"
          >
            {contact.email}
          </a>
        </div>
      )}

      {/* Website Section */}
      {contact.website && (
        <div className="mb-6 flex gap-5 items-center">
          <h3 className="font-semibold text-xl text-gray-700 flex items-center">
            <FaGlobe className="mr-3 text-green-500" />
            Website:
          </h3>
          <a
            href={contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg text-blue-500 hover:underline"
          >
            {contact.website}
          </a>
        </div>
      )}

      {/* Social Links Section */}
      {socialLinks.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-xl text-gray-700">Social Links</h3>
          <div className="flex flex-wrap gap-4 mt-4">
            {socialLinks.map(({ name, url, icon, color }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center bg-gray-100 rounded-full shadow-md hover:bg-gray-200 p-4 transition-all ${color}`}
              >
                <span className="text-3xl">{icon}</span>
              </a>
            ))}
          </div>
        </div>
      )}
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
