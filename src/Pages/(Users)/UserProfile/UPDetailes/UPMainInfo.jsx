/* eslint-disable react/prop-types */
import { FaBirthdayCake, FaPhoneAlt, FaVenusMars } from "react-icons/fa";

const UPMainInfo = ({ usersData }) => {
  return (
    <div className="py-2 space-y-2">
      <p className="text-lg italic text-gray-600">
        {usersData?.description || "N/A"}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 pt-5 border-t pt-5">
        {/* Phone */}
        <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-200">
          <FaPhoneAlt className="text-blue-500 text-2xl" />
          <p className="text-gray-600">
            <strong>Phone:</strong>
            <span className="ml-4">{usersData?.phone || "N/A"}</span>
          </p>
        </div>

        {/* Date of Birth */}
        <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-200">
          <FaBirthdayCake className="text-pink-500 text-2xl" />
          <p className="text-gray-600">
            <strong>Date of Birth:</strong>
            <span className="ml-4">{usersData?.dob || "N/A"}</span>
          </p>
        </div>

        {/* Gender */}
        <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-200">
          <FaVenusMars className="text-green-500 text-2xl" />
          <p className="text-gray-600">
            <strong>Gender:</strong>
            <span className="ml-4">{usersData?.gender || "N/A"}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UPMainInfo;
