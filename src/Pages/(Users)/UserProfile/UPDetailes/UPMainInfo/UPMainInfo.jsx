/* eslint-disable react/prop-types */
import { FaBirthdayCake, FaPhoneAlt, FaVenusMars } from "react-icons/fa";

const UPMainInfo = ({ usersData }) => {
  return (
    <div className="space-y-4 bg-white p-5 shadow-xl rounded-xl transition-transform duration-300 md:hover:scale-105 hover:delay-150">
      {/* Bio Section */}
      <p className="text-xl font-bold text-gray-800">My Bio</p>
      <p className="text-lg italic text-gray-600">
        {usersData?.description || "N/A"}
      </p>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-5 border-t">
        {/* Phone */}
        <div className="flex items-center space-x-4 transition-transform duration-300 hover:scale-105 hover:delay-150">
          <FaPhoneAlt className="text-blue-500 text-2xl" />
          <p className="text-gray-600">
            <strong>Phone:</strong>
            <span className="ml-2 sm:ml-4">{usersData?.phone || "N/A"}</span>
          </p>
        </div>

        {/* Date of Birth */}
        <div className="flex items-center space-x-4 transition-transform duration-300 hover:scale-105 hover:delay-150">
          <FaBirthdayCake className="text-pink-500 text-2xl" />
          <p className="text-gray-600">
            <strong>Date of Birth:</strong>
            <span className="ml-2 sm:ml-4">{usersData?.dob || "N/A"}</span>
          </p>
        </div>

        {/* Gender */}
        <div className="flex items-center space-x-4 transition-transform duration-300 hover:scale-105 hover:delay-150">
          <FaVenusMars className="text-green-500 text-2xl" />
          <p className="text-gray-600">
            <strong>Gender:</strong>
            <span className="ml-2 sm:ml-4">{usersData?.gender || "N/A"}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UPMainInfo;
