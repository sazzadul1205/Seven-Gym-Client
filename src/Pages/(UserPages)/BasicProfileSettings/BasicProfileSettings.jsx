import { useEffect, useState } from "react";

// Import Packages
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import PhoneInput from "react-phone-input-2";

// import Hook
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// import shred Button
import CommonButton from "../../../Shared/Buttons/CommonButton";

// import Selector
import AvatarSelector from "../UserSettings/UserSettingsInformation/BasicInfoSelector/AvatarSelector/AvatarSelector";

// Image Hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const BasicProfileSettings = ({ UsersData, Refetch }) => {
  const axiosPublic = useAxiosPublic();
  const [isLoading, setIsLoading] = useState(false);

  // Defaults
  const initialDob = UsersData?.dob;
  const initialPhone = UsersData?.phone;
  const initialFullName = UsersData?.fullName;
  const initialProfile = UsersData?.profileImage;

  // State
  const [dob, setDob] = useState(initialDob);
  const [phone, setPhone] = useState(initialPhone);
  const [isChanged, setIsChanged] = useState(false);
  const [fullName, setFullName] = useState(initialFullName);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImage, setProfileImage] = useState(initialProfile);

  // Check if any changes occurred
  useEffect(() => {
    const changed =
      profileImage !== initialProfile ||
      fullName !== initialFullName ||
      phone !== initialPhone ||
      dob !== initialDob;

    setIsChanged(changed);
  }, [
    profileImage,
    fullName,
    phone,
    dob,
    initialProfile,
    initialFullName,
    initialPhone,
    initialDob,
  ]);

  // Function to upload an image file to the image hosting API
  const uploadImage = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(Image_Hosting_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Return the uploaded image URL if successful
      return res?.data?.data?.display_url || null;
    } catch (error) {
      console.error("Image upload error:", error);
      return null;
    }
  };

  // Function to handle saving the updated profile information
  const handleSave = async () => {
    if (!isChanged) return;

    setIsLoading(true);
    try {
      // Prepare the payload with updated user info
      const payload = {
        email: UsersData?.email,
        fullName,
        phone,
        dob,
      };

      // If a new profile image file is selected, upload it
      if (profileImageFile) {
        const uploaded = await uploadImage(profileImageFile);
        if (uploaded) {
          payload.profileImage = uploaded;
          setProfileImage(uploaded);
        } else throw new Error("Profile image upload failed.");
      } else if (profileImage !== initialProfile) {
        // If profile image changed but not a new file, update with the new image URL
        payload.profileImage = profileImage;
      }

      // Send the updated data to the server
      await axiosPublic.patch("/Users", payload);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Your profile has been updated.",
      });

      setProfileImageFile(null);
      setIsChanged(false);
      Refetch();
    } catch (error) {
      // Handle errors and show error message
      console.error("Update failed:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden text-black">
      {/* Header */}
      <div className="bg-gray-200 px-6 py-3 border-b border-gray-300">
        <h3 className="text-xl font-semibold text-gray-800">
          Basic Profile Info
        </h3>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="w-full md:w-1/2 bg-gray-100 p-4 rounded-xl border border-gray-300">
            <AvatarSelector
              profileImage={profileImage}
              setProfileImage={setProfileImage}
              setProfileImageFile={setProfileImageFile}
            />
          </div>

          {/* Form */}
          <div className="w-full md:w-1/2 space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <PhoneInput
                country={"bd"}
                value={phone}
                onChange={setPhone}
                inputClass="!w-full !bg-white !text-black !rounded-md !shadow-sm !border-gray-300"
                inputStyle={{ height: "40px" }}
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-300 flex justify-end">
        <CommonButton
          clickEvent={handleSave}
          bgColor="green"
          px="px-10"
          isLoading={isLoading}
          disabled={!isChanged || isLoading}
          text="Save Changes"
          variant="outline"
          loadingText="Saving..."
        />
      </div>
    </div>
  );
};

// Prop Validation
BasicProfileSettings.propTypes = {
  UsersData: PropTypes.shape({
    email: PropTypes.string,
    fullName: PropTypes.string,
    phone: PropTypes.string,
    dob: PropTypes.string,
    profileImage: PropTypes.string,
    backgroundImage: PropTypes.string,
  }),
  Refetch: PropTypes.func.isRequired,
};

export default BasicProfileSettings;
