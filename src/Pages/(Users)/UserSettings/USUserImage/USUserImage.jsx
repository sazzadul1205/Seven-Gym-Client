/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { FaImage } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

import AddImages from "../../../../assets/AddImages/AddImages.png";
import ImageCropper from "../../../(Auth)/SignUp/SUDetails/ImageCropper/ImageCropper";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Image Hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const USUserImage = ({ UsersData, refetch }) => {
  const axiosPublic = useAxiosPublic();
  refetch();

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Prepare payload for the API request
  const userEmail = UsersData?.email;

  // Function to handle image drop
  const handleImageDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    validateAndPreviewImage(file, type);
  };

  // Function to handle image select
  const handleImageSelect = (e, type) => {
    const file = e.target.files[0];
    validateAndPreviewImage(file, type);
  };

  // Function to validate and preview the image
  const validateAndPreviewImage = (file, type) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload a valid image file.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Image size should not exceed 5MB.",
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (type === "background") {
      setPreviewImage(previewUrl);
    } else {
      setProfileImage(previewUrl);
    }
    setSelectedFile(file);

    return () => URL.revokeObjectURL(previewUrl);
  };

  // Function to save the image
  const handleSaveImage = async (type) => {
    if (!userEmail) {
      Swal.fire({
        icon: "error",
        title: "Missing Email",
        text: "User email not available.",
      });
      return;
    }

    const file = type === "profile" ? profileImage : selectedFile;

    if (!file) {
      Swal.fire({
        icon: "error",
        title: "No Image Selected",
        text: "Please select an image to upload.",
      });
      return;
    }

    setIsLoading(true); // Start loading state

    const formData = new FormData();
    formData.append("image", file);

    try {
      // Upload image to the image hosting API
      const res = await axios.post(Image_Hosting_API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = res?.data?.data?.display_url;
      if (!imageUrl) {
        throw new Error("Image hosting failed. No URL returned.");
      }

      const payload = {
        email: userEmail,
        ...(type === "profile"
          ? { profileImage: imageUrl }
          : { backgroundImage: imageUrl }),
      };

      // Make the API call to update only the image type that was provided
      const response = await axiosPublic.patch(`/Users`, payload);

      Swal.fire({
        icon: "success",
        title: "Image Uploaded",
        text: "Image uploaded successfully and updated in the database!",
      });

      // Close the modal after successful update
      const modalId =
        type === "background" ? "Background_Image_Modal" : "User_Image_Modal";
      const modal = document.getElementById(modalId);
      if (modal) modal.close();

      // Reset the preview and selected file if it's a background image
      if (type === "background") {
        setPreviewImage(null);
      }
      setSelectedFile(null);
      refetch();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Image upload or database update failed. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <div className="w-full min-h-screen mx-auto bg-gray-200">
      {/* Header */}
      <div className="bg-gray-400 px-5 py-2">
        <p className="flex gap-2 items-center text-xl font-semibold italic text-white ">
          <FaImage />
          Banner and profile Image Settings
        </p>
      </div>

      {/* Banner Section */}
      <div className="relative p-1 px-12 pb-16 mt-5">
        <img
          src={
            UsersData?.backgroundImage || "https://via.placeholder.com/1200x400"
          }
          alt="Background"
          className="w-full h-[400px] object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-500 border-2 border-dashed border-gray-500 hover:border-black"
          onClick={() =>
            document.getElementById("Background_Image_Modal").showModal()
          }
        />

        {/* User Image positioned over the Banner */}
        <div className="absolute bottom-[-10px] left-[150px] transform -translate-x-1/2">
          <img
            src={UsersData?.profileImage || "https://via.placeholder.com/150"}
            alt="User Profile"
            className="w-32 h-32 object-cover rounded-full shadow-lg hover:scale-125 transition-transform duration-500 border-2 border-dashed border-gray-500 hover:border-black"
            onClick={() =>
              document.getElementById("User_Image_Modal").showModal()
            }
          />
        </div>
      </div>

      {/* Background Image Modal */}
      <dialog
        id="Background_Image_Modal"
        className="modal"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleImageDrop(e, "background")}
      >
        <div className="modal-box w-[90%] max-w-[1200px] space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Background Image Modal</h3>
            <ImCross
              className="text-xl hover:text-[#F72C5B] cursor-pointer"
              onClick={() => {
                document.getElementById("Background_Image_Modal").close();
                setPreviewImage(null);
                setSelectedFile(null);
              }}
            />
          </div>

          <div className="border-2 border-dashed border-gray-500 p-4 mx-5 rounded-lg hover:scale-105 transition-transform duration-500 text-center">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-auto mx-auto rounded-lg"
              />
            ) : (
              <>
                <img
                  src={AddImages}
                  alt="Add Images"
                  className="mx-auto px-1"
                />
                <p className="text-gray-500 mt-2">
                  Drag and drop an image here or click below to select one.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="fileInput"
                  onChange={(e) => handleImageSelect(e, "background")}
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  Select Image
                </button>
              </>
            )}
          </div>

          <div className="flex justify-end">
            <button
              className={`${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-br from-green-600 to-green-400 hover:from-green-500 hover:to-green-300"
              } text-white font-semibold px-5 py-3 rounded-lg`}
              onClick={() => handleSaveImage("background")}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Background Image"}
            </button>
          </div>
        </div>
      </dialog>

      {/* User Image Modal */}
      <dialog id="User_Image_Modal" className="modal">
        <div className="modal-box w-[90%] max-w-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">User Image Modal</h3>
            <ImCross
              className="text-xl hover:text-[#F72C5B] cursor-pointer"
              onClick={() =>
                document.getElementById("User_Image_Modal").close()
              }
            />
          </div>
          <div className="text-center">
            <p>Upload a new profile picture or press ESC to close.</p>
          </div>
          <ImageCropper onImageCropped={setProfileImage} />
          <div className="flex justify-end">
            <button
              className={`${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-br from-green-600 to-green-400 hover:from-green-500 hover:to-green-300"
              } text-white font-semibold px-5 py-3 rounded-lg`}
              onClick={() => handleSaveImage("profile")}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Profile Image"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default USUserImage;
