import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2";
import { GrUserSettings } from "react-icons/gr";
import BannerSelector from "./BannerSelector/BannerSelector";
import BasicInfoSelector from "./BasicInfoSelector/BasicInfoSelector";
import SocialLinkSelector from "./SocialLinkSelector/SocialLinkSelector";
import DetailsInfoSelector from "./DetailsInfoSelector/DetailsInfoSelector";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Image Hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const UserSettingsInformation = ({ UsersData }) => {
  const axiosPublic = useAxiosPublic();

  const initialData = {
    backgroundImage:
      UsersData?.backgroundImage ||
      "https://i.ibb.co/93pjzx2B/My-Background.jpg",
    profileImage:
      UsersData?.profileImage || "https://i.ibb.co/4g4F5b0q/blob.jpg",
    fullName: UsersData?.fullName || "",
    phone: UsersData?.phone || "",
    dob: UsersData?.dob || "",
    description: UsersData?.description || "",
    selectedGoals: UsersData?.selectedGoals || [],
    socialLinks: UsersData?.socialLinks || {},
  };

  const [userData, setUserData] = useState(initialData);
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if any field has changed compared to initialData
  useEffect(() => {
    setIsChanged(JSON.stringify(userData) !== JSON.stringify(initialData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  // Update state for each field
  const handleChange = (key, value) => {
    setUserData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // Helper: Upload image file to ImgBB and return the hosted URL
  const uploadImage = async (blobUrl) => {
    try {
      // Fetch the blob data from the blob URL
      const response = await fetch(blobUrl);
      const blobData = await response.blob();

      const formData = new FormData();
      formData.append("image", blobData);

      const res = await axios.post(Image_Hosting_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const hostedUrl = res?.data?.data?.display_url;
      if (!hostedUrl) {
        throw new Error("Image hosting failed. No URL returned.");
      }
      return hostedUrl;
    } catch (error) {
      throw new Error(error.message || "Image upload failed.");
    }
  };

  // Submit function: Upload any local images and then update user info on the server
  const handleSubmit = async () => {
    setIsSaving(true);
    let updatedData = { ...userData };

    try {
      // If backgroundImage is a local blob URL, upload it first
      if (updatedData.backgroundImage.startsWith("blob:")) {
        const hostedBackground = await uploadImage(updatedData.backgroundImage);
        updatedData.backgroundImage = hostedBackground;
      }

      // If profileImage is a local blob URL, upload it first
      if (updatedData.profileImage.startsWith("blob:")) {
        const hostedProfile = await uploadImage(updatedData.profileImage);
        updatedData.profileImage = hostedProfile;
      }

      // Prepare payload for updating user info on the server
      const payload = {
        email: UsersData?.email, // ensure email is available in UsersData
        ...updatedData,
      };

      // Make the API call to update only the image type that was provided
      await axiosPublic.patch(`/Users`, payload);

      Swal.fire({
        icon: "success",
        title: "User Updated",
        text: "User information updated successfully!",
      });

      // Update local state with updated data
      setUserData(updatedData);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Update failed. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-gray-400 px-5 py-2">
        <p className="flex gap-2 items-center text-xl font-semibold italic text-white">
          <GrUserSettings />
          User Information Settings
        </p>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Banners Section */}
        <BannerSelector
          backgroundImage={userData.backgroundImage}
          setBackgroundImage={(value) => handleChange("backgroundImage", value)}
        />

        {/* Avatar, Name, Phone, DOB */}
        <BasicInfoSelector
          profileImage={userData.profileImage}
          setProfileImage={(value) => handleChange("profileImage", value)}
          fullName={userData.fullName}
          setFullName={(value) => handleChange("fullName", value)}
          phone={userData.phone}
          setPhone={(value) => handleChange("phone", value)}
          dob={userData.dob}
          setDob={(value) => handleChange("dob", value)}
        />

        {/* Bio, Goals */}
        <DetailsInfoSelector
          description={userData.description}
          setDescription={(value) => handleChange("description", value)}
          selectedGoals={userData.selectedGoals}
          setSelectedGoals={(value) => handleChange("selectedGoals", value)}
        />

        {/* Social Links */}
        <SocialLinkSelector
          UsersData={UsersData}
          socialLinks={userData.socialLinks}
          setSocialLinks={(value) => handleChange("socialLinks", value)}
        />

        {/* Confirm Button */}
        <div className="bg-gray-400/50 p-3 text-black">
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!isChanged || isSaving}
              className={`font-semibold rounded-lg px-20 py-3 cursor-pointer transition-all 
                ${
                  isChanged && !isSaving
                    ? "bg-gradient-to-bl from-green-300 to-green-600 text-white hover:from-green-400 hover:to-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
UserSettingsInformation.propTypes = {
  UsersData: PropTypes.shape({
    backgroundImage: PropTypes.string,
    profileImage: PropTypes.string,
    fullName: PropTypes.string,
    phone: PropTypes.string,
    dob: PropTypes.string,
    description: PropTypes.string,
    selectedGoals: PropTypes.arrayOf(PropTypes.string),
    socialLinks: PropTypes.objectOf(PropTypes.string),
    email: PropTypes.string, // Email is required for updating the user on the server
  }),
};

export default UserSettingsInformation;
