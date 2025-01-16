/* eslint-disable react/prop-types */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcAddImage } from "react-icons/fc";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import useAuth from "../../../../../Hooks/useAuth";

// Image Hosting API configuration
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const AddAwardModal = ({ refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  // Close the modal and reset the form
  const closeModal = () => {
    document.getElementById("Add_Award_Modal").close();
    reset();
    setPreviewImage(null);
    setImageFile(null);
  };

  // Handle image upload preview
  const handleImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
      setValue("awardIcon", reader.result);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  // Generate a unique award code based on email and a 16-bit random code
  const generateAwardCode = (email) => {
    // Generate a 16-bit random number
    const randomValue = Math.floor(Math.random() * 65536); // 16-bit random value (0 - 65535)

    return `${email}-${randomValue.toString(16).padStart(4, "0")}`;
  };

  // Handle form submission and award creation
  const handleFormSubmit = async (data) => {
    setLoading(true);
    let uploadedImageUrl = null;

    // Generate award code based on the user email and 16-bit random number
    const awardCode = generateAwardCode(user.email);

    // Image upload logic
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      try {
        const res = await axiosPublic.post(Image_Hosting_API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedImageUrl = res.data.data.display_url;
      } catch (error) {
        console.error("Failed to upload image:", error);
        Swal.fire({
          icon: "error",
          title: "Image Upload Failed",
          text: "Failed to upload the image. Please try again.",
        });
        setLoading(false);
        return;
      }
    }

    // Construct the final data to be sent
    const formDataWithImage = {
      ...data,
      awardIcon: uploadedImageUrl,
      awardCode,
      favorite: false,
    };

    try {
      // Send data to the /User/Add_Award endpoint
      const response = await axiosPublic.post("/Users/Add_Award", {
        email: user.email,
        award: formDataWithImage,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Award Added Successfully",
          text: "The award has been added successfully!",
        });
        refetch();
      } else {
        Swal.fire({
          icon: "error",
          title: "Award Addition Failed",
          text: response.data.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Error posting award data:", error);
      Swal.fire({
        icon: "error",
        title: "Award Addition Failed",
        text: "Failed to add the award. Please try again.",
      });
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Award Icon */}
      <div className="border-y border-gray-300 my-2 py-3">
        <label className="block text-lg font-medium text-center pb-2">
          Award Icon
        </label>
        <div
          className="mx-auto w-[200px] h-[200px] border border-dashed border-black p-5 rounded-full cursor-pointer flex items-center justify-center overflow-hidden relative"
          onClick={() => document.getElementById("iconUploadInput").click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            handleImageUpload(file);
          }}
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <FcAddImage className="w-[100px] h-[100px] hover:w-[120px] hover:h-[120px]" />
          )}
        </div>
        <input
          type="file"
          id="iconUploadInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />
        <input
          type="hidden"
          {...register("awardIcon", { required: "Award Icon is required" })}
        />
        {errors.awardIcon && (
          <span className="text-red-500 text-sm">
            {errors.awardIcon.message}
          </span>
        )}
      </div>

      {/* Award Name */}
      <div>
        <label className="block text-sm font-medium pb-2">Award Name</label>
        <input
          type="text"
          {...register("awardName", { required: "Award Name is required" })}
          className="input input-bordered rounded-2xl w-full"
        />
        {errors.awardName && (
          <span className="text-red-500 text-sm">
            {errors.awardName.message}
          </span>
        )}
      </div>

      {/* Award Ranking */}
      <div>
        <label className="block text-sm font-medium pb-2">Award Ranking</label>
        <input
          list="awardRankings"
          {...register("awardRanking", {
            required: "Award Ranking is required",
          })}
          className="input input-bordered rounded-2xl w-full"
          placeholder="Select or type Award Ranking"
        />
        <datalist id="awardRankings">
          <option value="Bronze" />
          <option value="Silver" />
          <option value="Gold" />
          <option value="1st" />
          <option value="2nd" />
          <option value="3rd" />
        </datalist>
        {errors.awardRanking && (
          <span className="text-red-500 text-sm">
            {errors.awardRanking.message}
          </span>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium pb-2">Description</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          className="textarea textarea-bordered rounded-2xl w-full"
        ></textarea>
        {errors.description && (
          <span className="text-red-500 text-sm">
            {errors.description.message}
          </span>
        )}
      </div>

      {/* Date Awarded */}
      <div>
        <label className="block text-sm font-medium pb-2">Date Awarded</label>
        <input
          type="date"
          {...register("dateAwarded", { required: "Date Awarded is required" })}
          className="input input-bordered rounded-2xl w-full"
        />
        {errors.dateAwarded && (
          <span className="text-red-500 text-sm">
            {errors.dateAwarded.message}
          </span>
        )}
      </div>

      {/* Awarded By */}
      <div>
        <label className="block text-sm font-medium pb-2">Awarded By</label>
        <input
          type="text"
          {...register("awardedBy", { required: "Awarded By is required" })}
          className="input input-bordered rounded-2xl w-full"
        />
        {errors.awardedBy && (
          <span className="text-red-500 text-sm">
            {errors.awardedBy.message}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <div className="modal-action">
        <button
          type="submit"
          className={`py-3 mt-3 px-10 ${
            loading ? "bg-gray-400" : "bg-emerald-400 hover:bg-emerald-500"
          } font-semibold rounded-xl`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex gap-3">
              <p>Saving...</p>
              <span className="loading loading-spinner loading-sm"></span>
            </div>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddAwardModal;
