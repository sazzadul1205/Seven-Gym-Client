// Import Package
import PropTypes from "prop-types";

// Import Component
import AvatarSelector from "./AvatarSelector/AvatarSelector";

const BasicInfoSelector = ({
  profileImage,
  setProfileImage,
  setProfileImageFile,
  fullName,
  setFullName,
  phone,
  setPhone,
  dob,
  setDob,
}) => {
  return (
    <div className="bg-gray-400/50 p-3">
      {/* Title */}
      <h3 className="text-xl font-semibold text-black py-1">Basic Info:</h3>

      {/* Divider */}
      <div className="bg-white p-[2px] w-1/2 mb-4"></div>

      <div className="flex flex-col md:flex-row gap-4 text-black">
        {/* Avatar Section */}
        <div className="w-full md:w-1/2 bg-gray-300 rounded-xl border border-gray-100 px-2 py-3">
          <AvatarSelector
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            setProfileImageFile={setProfileImageFile}
          />
        </div>

        {/* Additional User Information Form */}
        <div className="w-full md:w-1/2 bg-gray-300 rounded-xl border border-gray-100 px-2 py-2">
          {/* Full Name Input */}
          <div className="w-full">
            <label className="block font-bold ml-1 mb-2 text-black">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input input-bordered rounded-lg bg-white border-gray-600 "
            />
          </div>

          <div className="flex flex-col md:flex-row pt-5 gap-4">
            {/* Phone Input */}
            <div className="w-full">
              <label className="block font-bold ml-1 mb-2 text-black">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input input-bordered w-full rounded-lg bg-white border-gray-600"
              />
            </div>

            {/* Date of Birth Input */}
            <div className="w-full">
              <label className="block font-bold ml-1 mb-2 text-black">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="input input-bordered w-full rounded-lg bg-white border-gray-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes for type checking the UsersData prop
BasicInfoSelector.propTypes = {
  profileImage: PropTypes.string.isRequired,
  setProfileImage: PropTypes.func.isRequired,
  fullName: PropTypes.string.isRequired,
  setFullName: PropTypes.func.isRequired,
  phone: PropTypes.string.isRequired,
  setPhone: PropTypes.func.isRequired,
  dob: PropTypes.string.isRequired,
  setDob: PropTypes.func.isRequired,
  setProfileImageFile: PropTypes.func.isRequired,
};

export default BasicInfoSelector;
