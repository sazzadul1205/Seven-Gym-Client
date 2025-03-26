import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2";
import { ImCross } from "react-icons/im";

// Image Hosting API Key & URL
const IMAGE_HOSTING_KEY = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const IMAGE_HOSTING_API = `https://api.imgbb.com/1/upload?key=${IMAGE_HOSTING_KEY}`;

const BannerSettings = ({ UsersData }) => {
  const [backgroundImage, setBackgroundImage] = useState(
    UsersData?.backgroundImage || "https://via.placeholder.com/1200x400"
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // Dragging state

  // Handles file selection (via click or drag-and-drop)
  const handleImageSelect = (file) => {
    if (file) {
      setSelectedFile(file);
      setBackgroundImage(URL.createObjectURL(file)); // Show preview
    }
  };

  // Drag-and-drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  };

  // Uploads the selected image to an external hosting service.
  const handleSaveImage = async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: "error",
        title: "No Image Selected",
        text: "Please select an image to upload.",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await axios.post(IMAGE_HOSTING_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = res?.data?.data?.display_url;
      if (!imageUrl) throw new Error("Image hosting failed. No URL returned.");

      setBackgroundImage(imageUrl);
      setSelectedFile(null);

      Swal.fire({
        icon: "success",
        title: "Image Uploaded",
        text: "Image uploaded successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: `Image upload failed. Please try again. ${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    document.getElementById("Background_Image_Modal")?.close();
  };

  const openModal = () => {
    document.getElementById("Background_Image_Modal")?.showModal();
  };

  return (
    <div className="bg-gray-400 p-3">
      {/* Title */}
      <p className="text-xl font-semibold">Background:</p>

      {/* Banner (Click to Change) */}
      <div
        className="relative group w-full h-[400px] rounded-lg shadow-lg overflow-hidden cursor-pointer hover:border-dashed hover:border-black hover:border-2 my-2"
        onClick={openModal}
      >
        <img
          src={backgroundImage}
          alt="Background"
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50 rounded-lg"
        />
        <p className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Change Image
        </p>
      </div>

      {/* Background Image Modal */}
      <dialog id="Background_Image_Modal" className="modal">
        <div className="modal-box p-0 bg-gradient-to-b from-white to-gray-300 text-black min-w-6xl">
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
            <h3 className="font-bold text-lg">Background Image Modal</h3>
            <ImCross
              className="text-xl hover:text-[#F72C5B] cursor-pointer"
              onClick={closeModal}
            />
          </div>

          {/* Drag-and-Drop Area */}
          <div
            className={`border-2 border-dashed p-4 mx-5 rounded-lg h-[300px] flex flex-col items-center justify-center mt-4 transition-all duration-300 ${
              isDragging ? "border-blue-500 bg-blue-100" : "border-gray-500"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <img
                src={backgroundImage}
                alt="Preview"
                className="w-full h-[300px] mx-auto rounded-lg"
              />
            ) : (
              <>
                <p className="text-gray-500 py-2">
                  Drag and drop an image here or click below to select one.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="fileInput"
                  onChange={(e) => handleImageSelect(e.target.files[0])}
                />
                <p
                  className="bg-linear-to-bl hover:bg-linear-to-tr from-blue-300 to-blue-500 text-white px-10 py-2 rounded-lg cursor-pointer"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  Select Image
                </p>
              </>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end px-5 py-3">
            <button
              className={`text-white font-semibold px-5 py-3 rounded-lg ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-linear-to-bl hover:bg-linear-to-tr from-green-300 to-green-600 cursor-pointer"
              }`}
              onClick={handleSaveImage}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Save Background Image"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

// PropTypes for type validation
BannerSettings.propTypes = {
  UsersData: PropTypes.shape({
    backgroundImage: PropTypes.string,
  }),
};

export default BannerSettings;
