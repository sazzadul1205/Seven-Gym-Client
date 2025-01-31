/* eslint-disable react/prop-types */
import { FaSquareFacebook, FaLink } from "react-icons/fa6";
import { FaInstagram, FaTwitter, FaTelegram, FaEnvelope } from "react-icons/fa";

const UPSocialLinks = ({ usersData }) => {
  const { socialLinks } = usersData || {};

  // Check if there are any social links
  const hasSocialLinks =
    socialLinks && Object.values(socialLinks).some((link) => link);

  return (
    <div className="pt-4 bg-white p-5 shadow-xl rounded-xl transition-transform duration-300 hover:scale-105 hover:delay-150">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b pb-2">
        <FaLink className="text-blue-500 text-lg" />
        <h2 className="text-xl font-semibold text-black">User Links</h2>
      </div>

      {/* Social Links Grid */}
      {hasSocialLinks ? (
        <div className="flex flex-wrap gap-4 pt-5">
          {/* Facebook */}
          {socialLinks.facebook && (
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <FaSquareFacebook className="text-[#1877F2] text-2xl" />
            </a>
          )}

          {/* Instagram */}
          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <FaInstagram className="text-[#E1306C] text-2xl" />
            </a>
          )}

          {/* Twitter */}
          {socialLinks.twitter && (
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <FaTwitter className="text-[#1DA1F2] text-2xl" />
            </a>
          )}

          {/* Telegram */}
          {socialLinks.telegram && (
            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <FaTelegram className="text-[#0088cc] text-2xl" />
            </a>
          )}

          {/* Gmail */}
          {socialLinks.email && (
            <a
              href={`mailto:${socialLinks.email}`}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <FaEnvelope className="text-red-500 text-2xl" />
            </a>
          )}
        </div>
      ) : (
        <p className="text-gray-500 pt-3">No social links available.</p>
      )}
    </div>
  );
};

export default UPSocialLinks;
