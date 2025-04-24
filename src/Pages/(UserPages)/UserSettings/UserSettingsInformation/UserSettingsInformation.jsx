import { useState, useEffect, useMemo } from "react";

// Import Package
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Import icons
import { GrUserSettings } from "react-icons/gr";

// import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Component
import BannerSelector from "./BannerSelector/BannerSelector";
import BasicInfoSelector from "./BasicInfoSelector/BasicInfoSelector";
import SocialLinkSelector from "./SocialLinkSelector/SocialLinkSelector";
import DetailsInfoSelector from "./DetailsInfoSelector/DetailsInfoSelector";
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Image Hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const UserSettingsInformation = ({ UsersData, refetch }) => {
  const axiosPublic = useAxiosPublic();
  const [isLoading, setIsLoading] = useState(false);

  // Define initial values as constants (defaults from UsersData or fallback)
  const initialBackground =
    UsersData?.backgroundImage ||
    "https://i.ibb.co.com/93pjzx2B/My-Background.jpg";
  const initialProfile =
    UsersData?.profileImage || "https://i.ibb.co.com/4g4F5b0q/blob.jpg";
  const initialFullName = UsersData?.fullName || "";
  const initialPhone = UsersData?.phone || "";
  const initialDob = UsersData?.dob || "";
  const initialDescription = UsersData?.description || "";

  // Use useMemo to prevent re-renders due to object/array references
  const initialSocialLinks = useMemo(
    () => UsersData?.socialLinks || {},
    [UsersData?.socialLinks]
  );
  const initialSelectedGoals = useMemo(
    () => UsersData?.selectedGoals || [],
    [UsersData?.selectedGoals]
  );

  // State hooks
  const [dob, setDob] = useState(initialDob);
  const [phone, setPhone] = useState(initialPhone);
  const [fullName, setFullName] = useState(initialFullName);
  const [profileImage, setProfileImage] = useState(initialProfile);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [description, setDescription] = useState(initialDescription);
  const [socialLinks, setSocialLinks] = useState(initialSocialLinks);
  const [selectedGoals, setSelectedGoals] = useState(initialSelectedGoals);
  const [backgroundImage, setBackgroundImage] = useState(initialBackground);
  const [backgroundImageFile, setBackgroundImageFile] = useState(null);

  const [isChanged, setIsChanged] = useState(false);

  // Check for changes
  useEffect(() => {
    const changed =
      backgroundImage !== initialBackground ||
      profileImage !== initialProfile ||
      fullName !== initialFullName ||
      phone !== initialPhone ||
      dob !== initialDob ||
      description !== initialDescription ||
      JSON.stringify(selectedGoals) !== JSON.stringify(initialSelectedGoals) ||
      JSON.stringify(socialLinks) !== JSON.stringify(initialSocialLinks);

    setIsChanged(changed);
  }, [
    backgroundImage,
    profileImage,
    fullName,
    phone,
    dob,
    description,
    selectedGoals,
    socialLinks,
    initialBackground,
    initialProfile,
    initialFullName,
    initialPhone,
    initialDob,
    initialDescription,
    initialSelectedGoals,
    initialSocialLinks,
  ]);

  // Function to upload image to imgBB
  const uploadImage = async (file) => {
    if (!file) {
      console.error("No file provided for upload.");
      return null;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(Image_Hosting_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = res?.data?.data?.display_url;
      if (!imageUrl) {
        throw new Error("Image hosting failed. No URL returned.");
      }

      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Handle save action
  const handleSave = async () => {
    if (!isChanged) return;

    setIsLoading(true);

    try {
      const payload = {
        email: UsersData?.email,
        fullName,
        phone,
        dob,
        description,
        selectedGoals,
        socialLinks,
      };

      // Upload profile image if changed and file exists
      if (profileImageFile) {
        const profileImageUrl = await uploadImage(profileImageFile);
        if (profileImageUrl) {
          setProfileImage(profileImageUrl); // Update state with actual URL
          payload.profileImage = profileImageUrl;
        } else {
          console.error("Profile image upload failed.");
        }
      } else if (profileImage !== initialProfile) {
        payload.profileImage = profileImage;
      }

      // Upload background image if changed and file exists
      if (backgroundImageFile) {
        const backgroundImageUrl = await uploadImage(backgroundImageFile);
        if (backgroundImageUrl) {
          setBackgroundImage(backgroundImageUrl); // Update state with actual URL
          payload.backgroundImage = backgroundImageUrl;
        } else {
          console.error("Background image upload failed.");
        }
      } else if (backgroundImage !== initialBackground) {
        payload.backgroundImage = backgroundImage;
      }

      // Send the update request
      await axiosPublic.patch("/Users", payload);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Your profile has been updated successfully.",
      });

      setProfileImageFile(null);
      setBackgroundImageFile(null);
      refetch();
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setIsChanged(false);
    }
  };

  return (
    <div className="bg-linear-to-b from-gray-100 to-gray-200 w-full">
      {/* Header */}
      <div className="bg-gray-400 px-5 py-2">
        <p className="flex gap-2 items-center text-xl font-semibold italic text-white">
          <GrUserSettings />
          User Information Settings
        </p>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <BannerSelector
          backgroundImage={backgroundImage}
          setBackgroundImage={setBackgroundImage}
          setBackgroundImageFile={setBackgroundImageFile}
        />

        <BasicInfoSelector
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          setProfileImageFile={setProfileImageFile}
          fullName={fullName}
          setFullName={setFullName}
          phone={phone}
          setPhone={setPhone}
          dob={dob}
          setDob={setDob}
        />

        <DetailsInfoSelector
          description={description}
          setDescription={setDescription}
          selectedGoals={selectedGoals}
          setSelectedGoals={setSelectedGoals}
        />

        <SocialLinkSelector
          UsersData={UsersData}
          socialLinks={socialLinks}
          setSocialLinks={setSocialLinks}
        />

        <div className="bg-gray-400/50 p-3 text-black mb-2">
          <div className="flex justify-end">
            <CommonButton
              clickEvent={handleSave}
              bgColor="green"
              px="px-20"
              isLoading={isLoading}
              disabled={!isChanged || isLoading}
              text="Save"
              variant="outline" // Use the outline variant
              loadingText="Saving..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

UserSettingsInformation.propTypes = {
  UsersData: PropTypes.shape({
    email: PropTypes.string,
    backgroundImage: PropTypes.string,
    profileImage: PropTypes.string,
    fullName: PropTypes.string,
    phone: PropTypes.string,
    dob: PropTypes.string,
    description: PropTypes.string,
    selectedGoals: PropTypes.arrayOf(PropTypes.string),
    socialLinks: PropTypes.objectOf(PropTypes.string),
  }),
  refetch: PropTypes.func.isRequired,
};

export default UserSettingsInformation;
