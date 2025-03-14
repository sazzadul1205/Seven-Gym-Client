import PropTypes from "prop-types";
import { FaBirthdayCake, FaPhoneAlt, FaVenusMars } from "react-icons/fa";

const UPMainInfo = ({ usersData }) => {
  return (
    <div className="space-y-4 bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-300 p-5 shadow-xl rounded-xl transition-transform duration-700 md:hover:scale-105 hover:shadow-2xl">
      {/* Bio Section */}
      <h2 className="text-xl font-bold text-gray-800">About Me</h2>
      <p className="text-lg italic text-gray-600">
        {usersData?.description || "N/A"}
      </p>

      {/* Info Grid */}
      <div className="grid grid-cols-auto sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-5 border-t">
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
    className="flex items-center space-x-4 transition-transform duration-300 hover:scale-105"
    aria-label={label}
  >
    {icon}
    <span className="text-gray-700 text-lg font-semibold">{children}</span>
  </div>
);

// PropTypes Validation
UPMainInfo.propTypes = {
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

export default UPMainInfo;
