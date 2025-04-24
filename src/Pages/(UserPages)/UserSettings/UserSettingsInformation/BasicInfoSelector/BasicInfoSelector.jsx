// Import Package
import PropTypes from "prop-types";

// Import Component
import AvatarSelector from "./AvatarSelector/AvatarSelector";

// Import Phone Input
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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
        <div className="w-full md:w-1/2 bg-gray-300 rounded-xl border border-gray-100 px-2 py-2 space-y-4">
          {/* Full Name Input */}
          <div>
            <label className="block font-bold ml-1 mb-2 text-black">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input input-bordered w-full rounded-lg bg-white border-gray-600"
            />
          </div>

          {/* Phone Input */}
          <div>
            <label className="block font-bold ml-1 mb-2 text-black">
              Phone
            </label>
            <PhoneInput
              country={"bd"}
              value={phone}
              onChange={setPhone}
              inputClass="!w-full !bg-white !text-black !rounded-lg !shadow-lg"
              inputStyle={{ width: "100%", height: "40px" }}
            />
          </div>

          {/* Date of Birth Input */}
          <div>
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
  );
};

BasicInfoSelector.propTypes = {
  profileImage: PropTypes.string.isRequired,
  setProfileImage: PropTypes.func.isRequired,
  setProfileImageFile: PropTypes.func.isRequired,
  fullName: PropTypes.string.isRequired,
  setFullName: PropTypes.func.isRequired,
  phone: PropTypes.string.isRequired,
  setPhone: PropTypes.func.isRequired,
  dob: PropTypes.string.isRequired,
  setDob: PropTypes.func.isRequired,
};

export default BasicInfoSelector;
