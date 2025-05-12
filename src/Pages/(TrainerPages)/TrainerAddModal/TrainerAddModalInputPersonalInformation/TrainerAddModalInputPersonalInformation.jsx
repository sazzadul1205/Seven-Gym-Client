import { useEffect, useState } from "react";

// import Packages
import PhoneInput from "react-phone-input-2";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

// Import Button & Field
import CommonButton from "../../../../Shared/Buttons/CommonButton";
import InputField from "../../../../Shared/InputField/InputField";

// Import Icons
import { FaArrowRight } from "react-icons/fa";
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

// List of supported social platforms with their Names, Icons, and Colors
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

const TrainerAddModalInputPersonalInformation = ({ onNextStep }) => {
  // State Management
  const [addedPlatforms, setAddedPlatforms] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [socialLinks, setSocialLinks] = useState({});

  // useForm hook from react-hook-form for handling form state and validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      bio: "",
      email: "",
      website: "",
    },
  });

  // useEffect hook to load existing trainer data from localStorage and prepopulated form fields
  useEffect(() => {
    const existingData =
      JSON.parse(localStorage.getItem("trainerBasicInfo")) || {};
    const contact = existingData.contact || {};
    const socials = {};

    // Set social media links based on existing data in localStorage
    socialPlatforms.forEach((platform) => {
      if (contact[platform.key]) {
        socials[platform.key] = contact[platform.key];
      }
    });

    setPhoneNumber(contact.phone || "");
    setValue("bio", existingData.bio || "");
    setValue("email", contact.email || "");
    setValue("website", contact.website || "");
    setSocialLinks(socials);
    setAddedPlatforms(Object.keys(socials)); // Set platforms that already have data
  }, [setValue]);

  // Function to handle change in social media links input
  const handleSocialLinkChange = (key, value) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  };

  // Function to add a new social platform to the active list
  const handleAddPlatform = (key) => {
    if (!addedPlatforms.includes(key)) {
      setAddedPlatforms((prev) => [...prev, key]);
      setSocialLinks((prev) => ({ ...prev, [key]: "" }));
    }
  };

  // Function to remove a social platform from the active list
  const handleRemovePlatform = (key) => {
    setAddedPlatforms((prev) => prev.filter((item) => item !== key));
    setSocialLinks((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  // Handle form submission and store updated data in localStorage
  const onSubmit = (data) => {
    const existingData =
      JSON.parse(localStorage.getItem("trainerBasicInfo")) || {};

    const updatedData = {
      ...existingData,
      bio: data.bio,
      contact: {
        phone: phoneNumber,
        email: data.email,
        website: data.website,
        ...socialLinks,
      },
    };

    // Save updated data to localStorage
    localStorage.setItem("trainerBasicInfo", JSON.stringify(updatedData));

    onNextStep();
  };

  // Get the list of active social platforms based on the addedPlatforms state
  const activePlatforms = socialPlatforms.filter((p) =>
    addedPlatforms.includes(p.key)
  );
  const inactivePlatforms = socialPlatforms.filter(
    (p) => !addedPlatforms.includes(p.key)
  );

  return (
    <div className="py-5">
      {/* Title */}
      <h3 className="text-2xl font-semibold text-center text-gray-800">
        Personal & Contact Information
      </h3>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 px-10 space-y-3">
        {/* Bio Section */}
        <div>
          <label className="block text-gray-700 font-semibold text-xl pb-2">
            Introduction / Bio
          </label>
          <textarea
            rows={4}
            placeholder="Write a short introduction about yourself"
            className="textarea w-full text-black bg-white rounded-lg shadow-lg"
            {...register("bio", {
              required: "Bio is required",
              maxLength: {
                value: 500,
                message: "Bio cannot exceed 500 characters",
              },
            })}
          />
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
          )}
        </div>

        {/* Contact Info Section */}
        <div className="grid grid-cols-3 gap-2">
          {/* Your Phone Number */}
          <div>
            <label className="block font-bold ml-1 mb-2">
              Your Phone Number
            </label>
            <PhoneInput
              country={"bd"} // Default country code set to Bangladesh
              value={phoneNumber}
              onChange={setPhoneNumber}
              inputClass="!w-full !bg-white !text-black !rounded-lg !shadow-lg"
              inputStyle={{ width: "100%", height: "40px" }}
            />
          </div>
          {/* Contact Email */}
          <InputField
            label="Contact Email"
            id="email"
            type="email"
            placeholder="Enter email address"
            register={register}
            errors={errors}
          />

          {/* Portfolio Website URL */}
          <InputField
            label="Portfolio Website URL"
            id="website"
            type="text"
            placeholder="Enter website URL"
            register={register}
            errors={errors}
          />
        </div>

        {/* Social Links Section */}
        <div className="bg-gray-400/50 p-3 text-black">
          {/* Title */}
          <h3 className="text-xl font-semibold text-black py-1">
            Social Links:
          </h3>

          {/* Divider */}
          <hr className="bg-white p-[2px] w-1/2 mb-4" />

          {/* Map Active Platform that are Already existing */}
          <div className="pb-3">
            {activePlatforms.length > 0 && (
              <div className="space-y-3 grid grid-cols-2 space-x-2">
                {activePlatforms.map((platform) => (
                  <div key={platform.key} className="flex items-center gap-1">
                    {/* Icons */}
                    <div className="p-1 bg-white rounded-full">
                      <span className={`text-4xl ${platform.color}`}>
                        {platform.icon}
                      </span>
                    </div>
                    {/* Input */}
                    <input
                      type="text"
                      placeholder={platform.name}
                      value={socialLinks[platform.key] || ""}
                      onChange={(e) =>
                        handleSocialLinkChange(platform.key, e.target.value)
                      }
                      className="input input-bordered w-full rounded-lg bg-white border-gray-600"
                    />
                    {/* Close Icon */}
                    <MdClose
                      onClick={() => handleRemovePlatform(platform.key)}
                      className="cursor-pointer text-4xl hover:scale-105 text-red-500 bg-white rounded-full p-1"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add More Platforms Section */}
          <div className="pb-2">
            {/* Title */}
            <h3 className="text-xl font-semibold text-black py-1">
              Add More Social Links:
            </h3>

            {/* Divider */}
            <hr className="bg-white p-[2px] w-1/3 mb-4" />

            {/* Map In-Active Platform that are do not exist */}
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
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center items-center w-full">
          <CommonButton
            type="submit"
            text="Next Step"
            icon={<FaArrowRight />}
            iconSize="text-lg"
            bgColor="blue"
            px="px-10"
            py="py-3"
            borderRadius="rounded-lg"
            width="auto"
            isLoading={false}
            textColor="text-white"
            iconPosition="after"
          />
        </div>
      </form>
    </div>
  );
};

// Prop validation
TrainerAddModalInputPersonalInformation.propTypes = {
  onNextStep: PropTypes.func.isRequired,
};

export default TrainerAddModalInputPersonalInformation;
