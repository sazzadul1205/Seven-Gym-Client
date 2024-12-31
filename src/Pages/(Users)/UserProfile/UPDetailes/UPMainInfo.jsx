/* eslint-disable react/prop-types */
import { FaBirthdayCake, FaPhoneAlt, FaVenusMars } from "react-icons/fa";

const UPMainInfo = ({ usersData }) => {
  return (
    <div className="py-2 space-y-2">
      <p className="text-lg text-white">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, a
        quia! Voluptas soluta laudantium numquam illo quaerat delectus nemo
        quidem! Aut ad consequatur eveniet delectus hic molestiae quasi fugiat
        eum.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-5">
        {/* Phone */}
        <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-200">
          <FaPhoneAlt className="text-blue-500 text-2xl" />
          <p className="text-gray-600">
            <strong className="text-white">Phone:</strong>
            <span className="text-gray-50 ml-4">
              {usersData?.phone || "N/A"}
            </span>
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
    </div>
  );
};

export default UPMainInfo;
