import { useForm } from "react-hook-form";
import { useState } from "react";
import ImageCropper from "../../../(Auth)/SignUpDetails/ImageCropper/ImageCropper";

const TrainerAddModalBasicInformation = () => {
  const [profileImage, setProfileImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data); // Process form submission
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <h3 className="text-2xl font-semibold text-center text-gray-800">
        Basic Information
      </h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10 items-center px-5">
          {/* Left Side Data */}
          <div className="flex items-center justify-center h-full w-full">
            <div>
              <h3 className="text-xl font-semibold text-center py-2" >Trainer Profile Image</h3>
              {/* Cropper Component */}
              <ImageCropper
                onImageCropped={setProfileImage}
                register={register}
                errors={errors}
              />
              {profileImage && (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="rounded-full mt-4 w-32 h-32 object-cover"
                />
              )}
            </div>
          </div>

          {/* Right Side Data */}
          <div className="space-y-4 border-black">
            {/* Trainer Name (Full Name) */}
            <div>
              <label className="block text-gray-700 font-semibold text-xl pb-2">
                Trainer Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                className="input w-full text-black bg-white rounded-lg shadow-lg hover:shadow-xl focus:shadow-xl"
                {...register("name", { required: "Trainer Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700">Gender</label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="input w-full bg-white rounded-lg shadow-lg hover:shadow-xl focus:shadow-xl"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-gray-700">Age</label>
              <input
                type="number"
                placeholder="Enter age"
                {...register("age", { required: "Age is required", min: 18 })}
                className="input w-full bg-white rounded-lg shadow-lg hover:shadow-xl focus:shadow-xl"
              />
              {errors.age && (
                <p className="text-red-500 text-sm">{errors.age.message}</p>
              )}
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-gray-700">Years of Experience</label>
              <select
                {...register("experience", {
                  required: "Experience is required",
                })}
                className="input w-full bg-white rounded-lg shadow-lg hover:shadow-xl focus:shadow-xl"
              >
                <option value="">Select Experience</option>
                {[...Array(30).keys()].map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1} {index + 1 === 1 ? "Year" : "Years"}
                  </option>
                ))}
              </select>
              {errors.experience && (
                <p className="text-red-500 text-sm">
                  {errors.experience.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TrainerAddModalBasicInformation;
