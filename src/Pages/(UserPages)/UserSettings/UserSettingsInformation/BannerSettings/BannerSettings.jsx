import { useState } from "react";
import PropTypes from "prop-types";
import { ImCross } from "react-icons/im";
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

const BannerSettings = ({ UsersData }) => {
  const [backgroundImage, setBackgroundImage] = useState(
    UsersData?.backgroundImage || "https://via.placeholder.com/1200x400"
  );

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handles file selection (via click or drag-and-drop)
  const handleImageSelect = (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setBackgroundImage(imageUrl); // Show preview
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
        className="relative group w-full h-[400px] rounded-lg shadow-lg overflow-hidden cursor-pointer hover:border-dashed hover:border-black hover:border-2 my-2"
        onClick={() =>
          document.getElementById("Background_Image_Modal")?.showModal()
        }
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
              onClick={() =>
                document.getElementById("Background_Image_Modal")?.close()
              }
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
                {/* Select form file Btn */}
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
          <div className="flex justify-between px-5 py-3">
            {/* Select form file Btn */}
            <CommonButton
              clickEvent={() => document.getElementById("fileInput").click()}
              text="Select Image"
              bgColor="blue"
            />
            {/* Close Modal Btn */}
            <CommonButton
              clickEvent={() =>
                document.getElementById("Background_Image_Modal")?.close()
              }
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
BannerSettings.propTypes = {
  UsersData: PropTypes.shape({
    backgroundImage: PropTypes.string,
  }),
};

export default BannerSettings;
