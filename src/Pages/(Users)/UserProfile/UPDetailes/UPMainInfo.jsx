import React from "react";

const UPMainInfo = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
      {/* Phone */}
      <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-200">
        <FaPhoneAlt className="text-blue-500 text-2xl" />
        <p className="text-gray-600">
          <strong className="text-white">Phone:</strong>
          <span className="text-gray-50 ml-4">{usersData?.phone || "N/A"}</span>
        </p>
      </div>

      {/* Date of Birth */}
      <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-200">
        <FaBirthdayCake className="text-pink-500 text-2xl" />
        <p className="text-gray-600">
          <strong className="text-white">Date of Birth:</strong>
          <span className="text-gray-50 ml-4">{usersData?.dob || "N/A"}</span>
        </p>
      </div>

      {/* Gender */}
      <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-200">
        <FaVenusMars className="text-green-500 text-2xl" />
        <p className="text-gray-600">
          <strong className="text-white">Gender:</strong>
          <span className="text-gray-50 ml-4">
            {usersData?.gender || "N/A"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default UPMainInfo;
