// Import Icons-
import PropTypes from "prop-types";
import {
  FaBirthdayCake,
  FaPhoneAlt,
  FaUser,
  FaVenusMars,
} from "react-icons/fa";

const UserProfileAboutMe = ({ usersData }) => {
  return (
    <div className="space-y-4 bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-300 p-5 shadow-xl rounded-xl ">
      {/* Bio Section */}
      <div className="flex justify-center md:justify-start items-center gap-5">
        <FaUser className="text-black text-xl" />
        <h2 className="text-xl font-bold text-gray-800">About Me</h2>
      </div>

      {/* Divider */}
      <div className="p-[1px] bg-black" />

      {/* Description */}
      <p className="text-lg text-center md:text-left italic text-gray-800">
        {usersData?.description || "N/A"}
      </p>

      {/* Divider */}
      <div className="p-[1px] bg-black"></div>

      {/* Info Grid */}
      <div className="grid grid-cols-auto sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {/* Phone */}
        <InfoItem
          icon={<FaPhoneAlt className="text-blue-500 text-2xl" />}
          label="Phone"
        >
          {usersData?.phone || "Private"}
        </InfoItem>

        {/* Date of Birth */}
        <InfoItem
          icon={<FaBirthdayCake className="text-pink-500 text-2xl" />}
          label="Birthday"
        >
          {usersData?.dob || "Private"}
        </InfoItem>

        {/* Gender */}
        <InfoItem
          icon={<FaVenusMars className="text-green-500 text-2xl" />}
          label="Gender"
        >
          {usersData?.gender || "Private"}
        </InfoItem>
      </div>
    </div>
  );
};

// Reusable Info Item Component
const InfoItem = ({ icon, label, children }) => (
  <div
    className="flex justify-center md:justify-start items-center bg-white space-x-4 transition-transform duration-300 hover:scale-105 py-2 px-1"
    aria-label={label}
  >
    {icon}
    <span className="text-gray-700 text-lg font-semibold">{children}</span>
  </div>
);

// PropTypes Validation
UserProfileAboutMe.propTypes = {
  usersData: PropTypes.shape({
    description: PropTypes.string,
    phone: PropTypes.string,
    dob: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
};

InfoItem.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default UserProfileAboutMe;
