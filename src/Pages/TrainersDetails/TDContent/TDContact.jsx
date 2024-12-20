/* eslint-disable react/prop-types */
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
} from "react-icons/fa"; // Importing more icons

const TDContact = ({ TrainerDetails }) => {
  const { contact } = TrainerDetails;

  // Adding more social links
  const socialLinks = [
    { name: "LinkedIn", url: contact.linkedin, icon: <FaLinkedin /> },
    { name: "Instagram", url: contact.instagram, icon: <FaInstagram /> },
    { name: "Facebook", url: contact.facebook, icon: <FaFacebook /> },
    { name: "Twitter", url: contact.twitter, icon: <FaTwitter /> }, // New Twitter link
    { name: "YouTube", url: contact.youtube, icon: <FaYoutube /> }, // New YouTube link
    { name: "Twitch", url: contact.twitch, icon: <FaTwitch /> }, // New Twitch link
  ];

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Contact Information
      </h2>

      {/* Phone */}
      <div className="mb-6">
        <h3 className="font-semibold text-xl text-gray-700 flex items-center">
          <FaPhoneAlt className="mr-3 text-blue-500" />
          Phone
        </h3>
        <p className="text-lg text-gray-600">{contact.phone}</p>
      </div>

      {/* Email */}
      <div className="mb-6">
        <h3 className="font-semibold text-xl text-gray-700 flex items-center">
          <FaEnvelope className="mr-3 text-blue-500" />
          Email
        </h3>
        <p className="text-lg text-gray-600">{contact.email}</p>
      </div>

      {/* Website */}
      <div className="mb-6">
        <h3 className="font-semibold text-xl text-gray-700 flex items-center">
          <FaGlobe className="mr-3 text-blue-500" />
          Website
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

      {/* Social Links in Grid Layout */}
      {socialLinks.some((link) => link.url) && (
        <div className="mb-6">
          <h3 className="font-semibold text-xl text-gray-700">Social Links</h3>
          <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {socialLinks.map(
              (link, index) =>
                link.url && (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-4 bg-blue-100 rounded-lg shadow-md hover:bg-blue-200 transition-all"
                  >
                    <span className="text-2xl text-blue-500">{link.icon}</span>
                    <span className="ml-2 text-lg text-gray-600">
                      {link.name}
                    </span>
                  </a>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TDContact;
