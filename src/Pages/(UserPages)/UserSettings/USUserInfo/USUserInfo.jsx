/* eslint-disable react/prop-types */
import { IoSettings } from "react-icons/io5";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { FaFacebook, FaInstagram, FaTelegram, FaTwitter } from "react-icons/fa";
import FitnessGoalsSelector from "../../../(Auth)/SignUp/SUDetails/FitnessGoalsSelector/FitnessGoalsSelector";
import { useState } from "react";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const USUserInfo = ({ UsersData, refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const [selectedGoals, setSelectedGoals] = useState(
    UsersData?.selectedGoals || []
  );

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: UsersData?.fullName || "",
      phone: UsersData?.phone || "",
      dob: UsersData?.dob || "",
      gender: UsersData?.gender || "",
      description: UsersData?.description || "",
      socialLinks: UsersData?.socialLinks || {},
    },
  });

  // Submit handler
  const onSubmit = async (data) => {
    try {
      const updatedData = { ...data, selectedGoals, email: user?.email };
      const response = await axiosPublic.patch("/Users", updatedData);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "User Info Submitted",
          text: response.data.message,
        });
        refetch();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "An error occurred.",
      });
    }
  };

  // Reusable Input Field component
  const InputField = ({
    label,
    type = "text",
    placeholder,
    name,
    validation,
    error,
  }) => (
    <div className="bg-slate-200 p-3 shadow-xl hover:shadow-2xl space-y-2 py-5">
      <label className="block text-gray-700 font-semibold">{label}</label>
      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          className="w-full h-[150px] mt-1 p-2 border border-gray-500 rounded-lg"
          {...register(name, validation)}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="w-full mt-1 p-2 border border-gray-500 rounded-lg"
          {...register(name, validation)}
        />
      )}
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </div>
  );

  // Social links configuration
  const socialLinks = [
    { name: "facebook", icon: FaFacebook, placeholder: "Facebook URL" },
    { name: "instagram", icon: FaInstagram, placeholder: "Instagram URL" },
    { name: "twitter", icon: FaTwitter, placeholder: "Twitter URL" },
    { name: "telegram", icon: FaTelegram, placeholder: "Telegram URL" },
  ];

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-400 px-5 py-2">
        <p className="flex items-center gap-2 text-xl font-semibold italic text-white">
          <IoSettings /> User Info Settings
        </p>
      </header>

      {/* Form Section */}
      <main className="py-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 px-5 rounded-xl mx-auto"
        >
          {/* Full Name */}
          <InputField
            label="Full Name"
            name="fullName"
            placeholder="Enter your full name"
            validation={{ required: "Full Name is required" }}
            error={errors.fullName}
          />

          {/* Phone */}
          <InputField
            label="Phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            validation={{
              required: "Phone is required",
              pattern: {
                value: /^\+?[0-9]{10,15}$/,
                message: "Invalid phone number",
              },
            }}
            error={errors.phone}
          />

          {/* Date of Birth */}
          <InputField
            label="Date of Birth"
            name="dob"
            type="date"
            validation={{ required: "Date of Birth is required" }}
            error={errors.dob}
          />

          {/* Description */}
          <InputField
            label="Description"
            name="description"
            type="textarea"
            placeholder="Enter a description"
            validation={{
              required: "Description is required",
              maxLength: {
                value: 500,
                message: "Description must not exceed 500 characters",
              },
            }}
            error={errors.description}
          />

          {/* Fitness Goals Selector */}
          <div className="bg-slate-200 p-3 shadow-xl hover:shadow-2xl">
            <FitnessGoalsSelector
              selectedGoals={selectedGoals}
              setSelectedGoals={setSelectedGoals}
            />
          </div>

          {/* Social Links */}
          <div className="bg-slate-200 p-3 shadow-xl hover:shadow-2xl">
            <label className="block text-gray-700 font-semibold">
              Social Links
            </label>
            <div className="grid grid-cols-2 gap-5 mt-5">
              {socialLinks.map(({ name, icon: Icon, placeholder }) => (
                <div key={name} className="flex items-center">
                  <Icon className="mr-3 text-2xl text-gray-600" />
                  <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full p-2 border border-gray-400 rounded-lg"
                    {...register(`socialLinks.${name}`, {
                      pattern: {
                        value:
                          // eslint-disable-next-line no-useless-escape
                          /^(https?:\/\/)?(www\.)?[a-zA-Z0-9(\.\?)?]+(\.com|\.me)\/[a-zA-Z0-9(\.\?)?]+/,
                        message: `Invalid ${
                          name.charAt(0).toUpperCase() + name.slice(1)
                        } URL`,
                      },
                    })}
                  />
                  {errors.socialLinks?.[name] && (
                    <span className="text-red-500 text-sm ml-2">
                      {errors.socialLinks[name].message}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-br from-green-600 to-green-400 hover:from-green-500 hover:to-green-300 text-white font-semibold px-12 py-3 rounded-lg"
            >
              Save Settings
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default USUserInfo;
