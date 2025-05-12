import PropTypes from "prop-types";

// Import Packages
import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";

// Import Icons
import { ImCross } from "react-icons/im";
import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaTwitch,
  FaPinterest,
  FaSnapchatGhost,
  FaWhatsapp,
  FaReddit,
  FaDiscord,
  FaTiktok,
  FaTelegram,
} from "react-icons/fa";
import { MdAdd, MdClose } from "react-icons/md";

// Import Button & Input Field
import CommonButton from "../../../../../Shared/Buttons/CommonButton";
import InputField from "../../../../../Shared/InputField/InputField";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Define available social platforms
const socialPlatforms = [
  {
    name: "LinkedIn",
    key: "linkedin",
    icon: <FaLinkedin />,
    color: "text-blue-700",
  },
  {
    name: "Instagram",
    key: "instagram",
    icon: <FaInstagram />,
    color: "text-pink-500",
  },
  {
    name: "Facebook",
    key: "facebook",
    icon: <FaFacebook />,
    color: "text-blue-600",
  },
  {
    name: "Twitter",
    key: "twitter",
    icon: <FaTwitter />,
    color: "text-sky-500",
  },
  {
    name: "YouTube",
    key: "youtube",
    icon: <FaYoutube />,
    color: "text-red-600",
  },
  {
    name: "Twitch",
    key: "twitch",
    icon: <FaTwitch />,
    color: "text-purple-600",
  },
  {
    name: "Pinterest",
    key: "pinterest",
    icon: <FaPinterest />,
    color: "text-red-500",
  },
  {
    name: "Snapchat",
    key: "snapchat",
    icon: <FaSnapchatGhost />,
    color: "text-yellow-500",
  },
  {
    name: "WhatsApp",
    key: "whatsapp",
    icon: <FaWhatsapp />,
    color: "text-green-500",
  },
  {
    name: "Reddit",
    key: "reddit",
    icon: <FaReddit />,
    color: "text-orange-500",
  },
  {
    name: "Discord",
    key: "discord",
    icon: <FaDiscord />,
    color: "text-indigo-500",
  },
  { name: "TikTok", key: "tiktok", icon: <FaTiktok />, color: "text-black" },
  {
    name: "Telegram",
    key: "telegram",
    icon: <FaTelegram />,
    color: "text-[#0088cc]",
  },
];

const TrainerProfileContactUpdateModal = ({ TrainerDetails, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // Submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: TrainerDetails?.contact?.phone || "",
      email: TrainerDetails?.contact?.email || "",
      website: TrainerDetails?.contact?.website || "",
    },
  });

  // Prepare initial social links from TrainerDetails contact
  const initialSocialLinks = {
    linkedin: TrainerDetails?.contact?.linkedin || "",
    instagram: TrainerDetails?.contact?.instagram || "",
    facebook: TrainerDetails?.contact?.facebook || "",
    twitter: TrainerDetails?.contact?.twitter || "",
    youtube: TrainerDetails?.contact?.youtube || "",
    twitch: TrainerDetails?.contact?.twitch || "",
    pinterest: TrainerDetails?.contact?.pinterest || "",
    snapchat: TrainerDetails?.contact?.snapchat || "",
    whatsapp: TrainerDetails?.contact?.whatsapp || "",
    reddit: TrainerDetails?.contact?.reddit || "",
    discord: TrainerDetails?.contact?.discord || "",
    tiktok: TrainerDetails?.contact?.tiktok || "",
    telegram: TrainerDetails?.contact?.telegram || "",
  };

  // State for social links and active platforms
  const [socialLinks, setSocialLinks] = useState(initialSocialLinks);
  const [addedPlatforms, setAddedPlatforms] = useState(() => {
    return Object.keys(initialSocialLinks).filter(
      (key) => initialSocialLinks[key].trim() !== ""
    );
  });

  // Handlers for updating social links state
  const handleSocialLinkChange = (key, value) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddPlatform = (key) => {
    if (!addedPlatforms.includes(key)) {
      setAddedPlatforms((prev) => [...prev, key]);
      // Optionally initialize the value if empty
      setSocialLinks((prev) => ({ ...prev, [key]: prev[key] || "" }));
    }
  };

  const handleRemovePlatform = (key) => {
    setSocialLinks((prev) => ({ ...prev, [key]: "" }));
    setAddedPlatforms((prev) =>
      prev.filter((platformKey) => platformKey !== key)
    );
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true); // Start loading

      // Combine the form data with social links state
      const updatedData = {
        contact: {
          phone: data.phone || "",
          email: data.email || "",
          website: data.website || "",
          ...socialLinks,
        },
      };

      // Make API call to update trainer profile using axiosPublic
      const response = await axiosPublic.put(
        `/Trainers/UpdateTrainerContactInfo/${TrainerDetails?._id}`,
        updatedData
      );

      if (response.status === 200) {
        // Success alert
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Trainer profile updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch(); // Refresh data after successful update
        document
          .getElementById("Trainer_Profile_Contact_Update_Modal")
          ?.close();
      }
    } catch (error) {
      console.error("Error updating trainer profile:", error);

      Swal.fire({
        title: "Error!",
        text: "Something went wrong while updating the trainer profile.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  // Compute active and inactive social platforms
  const activePlatforms = socialPlatforms.filter((platform) =>
    addedPlatforms.includes(platform.key)
  );

  const inactivePlatforms = socialPlatforms.filter(
    (platform) => !addedPlatforms.includes(platform.key)
  );

  return (
    <div className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Update Trainer Profile Contact</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document
              .getElementById("Trainer_Profile_Contact_Update_Modal")
              ?.close()
          }
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <InputField
          label="Phone"
          id="phone"
          type="text"
          placeholder="Enter phone number"
          register={register}
          errors={errors}
        />
        <InputField
          label="Email"
          id="email"
          type="email"
          placeholder="Enter email address"
          register={register}
          errors={errors}
        />
        <InputField
          label="Website"
          id="website"
          type="text"
          placeholder="Enter website URL"
          register={register}
          errors={errors}
        />

        {/* Custom Social Links Section */}
        <div className="bg-gray-400/50 p-3 text-black">
          <h3 className="text-xl font-semibold text-black py-1">
            Social Links:
          </h3>
          <div className="bg-white p-[2px] w-1/2 mb-4"></div>
          {activePlatforms.length > 0 && (
            <div className="space-y-3 mb-6">
              {activePlatforms.map((platform) => (
                <div key={platform.key} className="flex items-center gap-2">
                  <div className="p-1 bg-white rounded-full">
                    <span className={`text-4xl ${platform.color}`}>
                      {platform.icon}
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder={platform.name}
                    value={socialLinks[platform.key] || ""}
                    onChange={(e) =>
                      handleSocialLinkChange(platform.key, e.target.value)
                    }
                    className="input input-bordered w-full rounded-lg bg-white border-gray-600"
                  />
                  <MdClose
                    onClick={() => handleRemovePlatform(platform.key)}
                    className="cursor-pointer text-4xl hover:scale-105 transition-all duration-300 text-red-500 bg-white rounded-full p-1"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="bg-gray-300 p-2">
            <h3 className="text-xl font-semibold text-black py-1">
              Add More Social Links:
            </h3>
            <div className="bg-white p-[2px] w-1/3 mb-4"></div>
            {inactivePlatforms.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {inactivePlatforms.map((platform) => (
                  <div
                    key={platform.key}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="p-1 flex bg-white rounded-full items-center">
                      <span className={`text-4xl ${platform.color}`}>
                        {platform.icon}
                      </span>
                      <p
                        className={`text-4xl p-2 bg-gray-200 rounded-full ml-2 ${platform.color} hover:scale-150 cursor-pointer`}
                        onClick={() => handleAddPlatform(platform.key)}
                      >
                        <MdAdd className="text-xl" />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <CommonButton
            onClick={handleSubmit(onSubmit)} // Use onClick here directly
            text="Save Changes"
            bgColor="green"
            isLoading={isSubmitting}
            loadingText="Saving..."
          />
        </div>
      </form>
    </div>
  );
};

TrainerProfileContactUpdateModal.propTypes = {
  TrainerDetails: PropTypes.shape({
    _id: PropTypes.string,
    bio: PropTypes.string,
    experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    contact: PropTypes.shape({
      phone: PropTypes.string,
      email: PropTypes.string,
      website: PropTypes.string,
      linkedin: PropTypes.string,
      instagram: PropTypes.string,
      facebook: PropTypes.string,
      twitter: PropTypes.string,
      youtube: PropTypes.string,
      twitch: PropTypes.string,
      pinterest: PropTypes.string,
      snapchat: PropTypes.string,
      whatsapp: PropTypes.string,
      reddit: PropTypes.string,
      discord: PropTypes.string,
      tiktok: PropTypes.string,
      telegram: PropTypes.string,
    }),
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default TrainerProfileContactUpdateModal;
