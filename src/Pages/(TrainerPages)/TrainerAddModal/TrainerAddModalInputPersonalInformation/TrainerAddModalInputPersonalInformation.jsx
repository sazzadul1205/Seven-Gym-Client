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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [socialLinks, setSocialLinks] = useState({});
  const [addedPlatforms, setAddedPlatforms] = useState([]);

  // React Hook Form setup with default values and validation
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

  // Load existing data from localStorage on mount, and prefill form fields
  useEffect(() => {
    const existingData =
      JSON.parse(localStorage.getItem("trainerBasicInfo")) || {};
    const contact = existingData.contact || {};
    const socials = {};

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
    setAddedPlatforms(Object.keys(socials));
  }, [setValue]);

  // Validate if string is a proper URL
  const isValidUrl = (str) => {
    try {
      // Accept URLs with protocol (http/https) or without protocol but with domain
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  // Validate if email is valid (simple regex)
  const isValidEmail = (email) => {
    // Simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Social link input change handler
  const handleSocialLinkChange = (key, value) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  };

  // Add social platform to active list
  const handleAddPlatform = (key) => {
    if (!addedPlatforms.includes(key)) {
      setAddedPlatforms((prev) => [...prev, key]);
      setSocialLinks((prev) => ({ ...prev, [key]: "" }));
    }
  };

  // Remove social platform from active list
  const handleRemovePlatform = (key) => {
    setAddedPlatforms((prev) => prev.filter((item) => item !== key));
    setSocialLinks((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  // Form submission handler with validation checks for URLs & email
  const onSubmit = (data) => {
    // Basic validations before proceeding:

    // Check phone number is entered
    if (!phoneNumber || phoneNumber.trim().length < 5) {
      alert("Please enter a valid phone number.");
      return;
    }

    // Validate email format
    if (data.email && !isValidEmail(data.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Validate website URL (if provided)
    if (data.website && !isValidUrl(data.website)) {
      alert("Please enter a valid website URL.");
      return;
    }

    // Validate all social links URLs (if not empty)
    for (const [key, link] of Object.entries(socialLinks)) {
      if (link.trim() !== "" && !isValidUrl(link.trim())) {
        alert(
          `Please enter a valid URL for ${
            key.charAt(0).toUpperCase() + key.slice(1)
          }.`
        );
        return;
      }
    }

    // If all checks pass, save to localStorage and move to next step
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

    localStorage.setItem("trainerBasicInfo", JSON.stringify(updatedData));

    onNextStep();
  };

  // Active and inactive social platforms for UI display
  const activePlatforms = socialPlatforms.filter((p) =>
    addedPlatforms.includes(p.key)
  );
  const inactivePlatforms = socialPlatforms.filter(
    (p) => !addedPlatforms.includes(p.key)
  );

  return (
    <div>
      {/* Title */}
      <h3 className="text-xl md:text-2xl font-semibold text-center text-gray-800 bg-white py-2 border border-b-black">
        Personal & Contact Information
      </h3>

      {/* Form Content */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-1 md:px-5 space-y-2 pb-2"
      >
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Your Phone Number */}
          <div>
            <label className="block font-bold ml-1 mb-2">
              Your Phone Number
            </label>
            <PhoneInput
              country={"bd"} // Default country code: Bangladesh
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
            // We do extra email validation on submit
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
          <hr className="bg-white p-[2px] w-1/2 mb-4" />

          {/* Render active social platforms */}
          <div className="pb-3">
            {activePlatforms.length > 0 && (
              <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 space-x-2">
                {activePlatforms.map((platform) => (
                  <div key={platform.key} className="flex items-center gap-1">
                    {/* Social Icon */}
                    <div className="p-1 bg-white rounded-full">
                      <span className={`text-4xl ${platform.color}`}>
                        {platform.icon}
                      </span>
                    </div>

                    {/* Social link input */}
                    <input
                      type="text"
                      placeholder={platform.name}
                      value={socialLinks[platform.key] || ""}
                      onChange={(e) =>
                        handleSocialLinkChange(platform.key, e.target.value)
                      }
                      className="input input-bordered w-full rounded-lg bg-white border-gray-600"
                    />

                    {/* Remove platform button */}
                    <MdClose
                      onClick={() => handleRemovePlatform(platform.key)}
                      className="cursor-pointer text-4xl hover:scale-105 text-red-500 bg-white rounded-full p-1"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add More Platforms */}
          <div className="pb-2">
            <h3 className="text-xl font-semibold text-black py-1">
              Add More Social Links:
            </h3>
            <hr className="bg-white p-[2px] w-1/3 mb-4" />
            <div className="flex flex-wrap gap-2 md:gap-4">
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
