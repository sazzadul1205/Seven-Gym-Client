/* eslint-disable react/prop-types */
import { Link } from "react-router";
import { FaSquareFacebook } from "react-icons/fa6";

import Instagram from "../../../../assets/Social/Instagram.png";
import twitter from "../../../../assets/Social/twitter.png";
import telegram from "../../../../assets/Social/telegram.png";
import gmail from "../../../../assets/Social/gmail.png";
import { FaLink } from "react-icons/fa";

const UPSocialLinks = ({ usersData }) => {
  return (
    <div className="pt-4">
      <div className="flex items-center space-x-2 border-b ">
        <FaLink className="text-blue-500" />
        <h2 className="text-xl font-semibold text-black ">
          User Links
        </h2>
      </div>
      <div className="flex flex-wrap space-x-5 pt-5">
        {/* Facebook */}
        {usersData.socialLinks.facebook && (
          <Link
            to={usersData.socialLinks.facebook}
            className="flex items-center space-x-4 hover:scale-125 transition-transform duration-200 bg-gray-200 p-3 rounded-full"
          >
            <FaSquareFacebook className="text-[#1877F2] text-2xl" />
          </Link>
        )}

        {/* Instagram */}
        {usersData.socialLinks.instagram && (
          <Link
            to={usersData.socialLinks.instagram}
            className="flex items-center space-x-4 hover:scale-125 transition-transform duration-200 bg-gray-200 p-3 rounded-full"
          >
            <img src={Instagram} alt="Instagram" className="w-6 h-6" />
          </Link>
        )}

        {/* Twitter */}
        {usersData.socialLinks.twitter && (
          <Link
            to={usersData.socialLinks.twitter}
            className="flex items-center space-x-4 hover:scale-125 transition-transform duration-200 bg-gray-200 p-3 rounded-full"
          >
            <img src={twitter} alt="Twitter" className="w-6 h-6" />
          </Link>
        )}

        {/* Telegram */}
        {usersData.socialLinks.telegram && (
          <Link
            to={usersData.socialLinks.telegram}
            className="flex items-center space-x-4 hover:scale-125 transition-transform duration-200 bg-gray-200 p-3 rounded-full"
          >
            <img src={telegram} alt="Telegram" className="w-6 h-6" />
          </Link>
        )}

        {/* Gmail */}
        {usersData.socialLinks.gmail && (
          <Link
            to={usersData.socialLinks.gmail}
            className="flex items-center space-x-4 hover:scale-125 transition-transform duration-200 bg-gray-200 p-3 rounded-full"
          >
            <img src={gmail} alt="Gmail" className="w-6 h-6" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default UPSocialLinks;
