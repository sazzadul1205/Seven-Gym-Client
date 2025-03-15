import { Link } from "react-router";

import PropTypes from "prop-types";

import groupClass from "../../../../assets/UserProfile/GroupClass.png";

const UserProfileAttendingClasses = ({ ClassesData }) => {
  return (
    <div className="bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-300 p-5 shadow-xl rounded-xl*">
      {/* Header Section */}
      <div className="flex items-center space-x-2 border-b pb-2">
        <img src={groupClass} alt="Group Class Icon" className="w-6 h-6" />
        <h2 className="text-xl font-semibold text-black">
          Current Attending Classes
        </h2>
      </div>
      <div className="bg-black p-[1px]"></div>

      {/* If No Classes Are Available */}
      {(!ClassesData || ClassesData.length === 0) && (
        <div className="text-center mt-8">
          <p className="text-gray-500">No classes available at the moment.</p>
          <Link
            to="/Classes"
            className="mt-4 inline-block px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          >
            Join a Class
          </Link>
        </div>
      )}

      {/* If Classes Exist, Display List */}
      {ClassesData?.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {ClassesData.map((classDetail, index) => (
            <div
              key={index}
              className="relative border-2 border-blue-500 bg-white hover:bg-gray-300 text-black px-6 py-3 rounded-lg group transition duration-300"
            >
              {/* Class Link */}
              <Link to={`/Classes/${classDetail.module}`}>
                {/* Class Icon */}
                {classDetail?.icon && (
                  <img
                    src={classDetail.icon}
                    alt={classDetail.module}
                    className="w-16 h-16 mx-auto mb-2"
                  />
                )}

                {/* Class Name */}
                <div className="text-center text-sm">{classDetail.module}</div>

                {/* Hover Overlay (Join Now) */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-bold text-lg">Join Now</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// PropTypes validation
UserProfileAttendingClasses.propTypes = {
  ClassesData: PropTypes.arrayOf(
    PropTypes.shape({
      module: PropTypes.string.isRequired, // Name of the module
      icon: PropTypes.string, // Optional class icon URL
    })
  ).isRequired, // ClassesData must be an array and is required
};

export default UserProfileAttendingClasses;
