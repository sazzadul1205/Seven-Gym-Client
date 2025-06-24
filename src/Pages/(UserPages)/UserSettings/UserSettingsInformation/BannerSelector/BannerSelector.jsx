import { useState } from "react";

// Import Packages
import PropTypes from "prop-types";

// Import Icons
import { ImCross } from "react-icons/im";

// Import Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";
import { FaCamera } from "react-icons/fa";

const BannerSelector = ({
  backgroundImage,
  setBackgroundImage,
  setBackgroundImageFile,
}) => {
  // State Management
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    backgroundImage || "https://i.ibb.co/Kx8MX6rQ/Wood-Background.jpg"
  );

  // Handles file selection (via click or drag-and-drop)
  const handleImageSelect = (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewImage(imageUrl); // Show preview
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

  // Handle Save Button Click
  const handleSaveBackground = () => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }
    setBackgroundImageFile(selectedFile); // Store file for upload
    setBackgroundImage(previewImage); // Update displayed image
    document.getElementById("Background_Image_Modal")?.close();
  };

  return (
    <div className="bg-gray-400/50 p-3">
      {/* Title */}
      <h3 className="text-xl font-semibold text-black py-1">
        Profile Background:
      </h3>

      {/* Divider */}
      <div className="bg-white p-[2px] w-1/2"></div>

      {/* Banner (Click to Change) */}
      <div
        className="relative group w-full h-[300px] md:h-[400px] rounded-lg shadow-lg overflow-hidden cursor-pointer border-2 border-dashed hover:border-gray-300 my-2"
        onClick={() =>
          document.getElementById("Background_Image_Modal")?.showModal()
        }
      >
        <img
          src={previewImage || "https://i.ibb.co/Kx8MX6rQ/Wood-Background.jpg"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://i.ibb.co/Kx8MX6rQ/Wood-Background.jpg";
          }}
          alt="Background"
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50 rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col items-center justify-center gap-2">
            <span>Change Image</span>
            <FaCamera className="text-2xl" />
          </div>
        </div>
      </div>

      {/* Background Image Modal */}
      <dialog id="Background_Image_Modal" className="modal">
        <div className="modal-box p-0 bg-gradient-to-b from-white to-gray-300 text-black md:min-w-7xl">
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
            <h3 className="font-bold text-lg">Background Image Modal</h3>
            <ImCross
              className="text-xl hover:text-[#F72C5B] cursor-pointer"
              onClick={() =>
                document.getElementById("Background_Image_Modal")?.close()
              }
            />
          </div>

          {/* Drag-and-Drop Area */}
          <div
            className={`border-2 border-dashed mx-5 rounded-lg h-[300px] md:h-[350px] flex flex-col items-center justify-center mt-4 transition-all duration-300 ${
              isDragging ? "border-blue-500 bg-blue-100" : "border-gray-500"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-[300px] mx-auto rounded-lg md:h-[350px]"
              />
            ) : (
              <>
                <p className="text-gray-500 py-2 text-center">
                  Drag and drop an image here or click below to select one.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="fileInput"
                  onChange={(e) => handleImageSelect(e.target.files[0])}
                />
                <CommonButton
                  clickEvent={() =>
                    document.getElementById("fileInput").click()
                  }
                  text="Select Image"
                  bgColor="blue"
                />
              </>
            )}
          </div>

          {/* Save Button */}
          <div className="flex flex-col md:flex-row gap-2 justify-between px-5 py-3">
            <CommonButton
              clickEvent={() => document.getElementById("fileInput").click()}
              text="Select Image"
              bgColor="blue"
            />
            <CommonButton
              clickEvent={handleSaveBackground}
              text="Save Background"
              bgColor="green"
            />
          </div>
        </div>
      </dialog>
    </div>
  );
};

// PropTypes for type validation
BannerSelector.propTypes = {
  backgroundImage: PropTypes.string.isRequired,
  setBackgroundImage: PropTypes.func.isRequired,
  setBackgroundImageFile: PropTypes.func.isRequired,
};

export default BannerSelector;
