import { useCallback, useEffect, useState } from "react";

// Import Package
import PropTypes from "prop-types";
import Cropper from "react-easy-crop";

// Import Button
import CommonButton from "../../../../../../Shared/Buttons/CommonButton";

// Import Icons
import { FiCamera } from "react-icons/fi";
import { ImCross } from "react-icons/im";

const AvatarSelector = ({
  profileImage,
  setProfileImage,
  setProfileImageFile,
}) => {
  // State for zoom and rotation controls
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // State to store crop area dimensions and image source
  const [cropArea, setCropArea] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  // State to toggle cropper modal visibility
  const [showCropper, setShowCropper] = useState(false);

  // Reset all state to initial values when modal is closed
  const resetState = () => {
    setImageSrc(null);
    setCropArea(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  // Handle the image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setImageSrc(fileReader.result);
        // Close the upload modal and open the crop modal
        document.getElementById("User_Image_Modal").close();
        setShowCropper(true);
        // Slight delay to ensure state updates before showing crop modal
        setTimeout(() => {
          document.getElementById("User_Image_Cropper_Modal").showModal();
        }, 0);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Callback on process complete
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCropArea(croppedAreaPixels);
  }, []);

  // Cropping Function
  const getCroppedImage = async () => {
    if (!imageSrc || !cropArea) {
      alert("Please select an image first!");
      return;
    }

    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const ctx = canvas.getContext("2d");
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;

      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(
        img,
        cropArea.x * scaleX,
        cropArea.y * scaleY,
        cropArea.width * scaleX,
        cropArea.height * scaleY,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      );
      ctx.restore();

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            alert("Failed to process image. Please try again.");
            return;
          }

          // Create a file from the blob
          const file = new File([blob], "cropped-avatar.jpg", {
            type: "image/jpeg",
          });

          // Store file for upload
          setProfileImageFile(file);
          setProfileImage(URL.createObjectURL(blob)); // Update preview image

          // Close modal
          setShowCropper(false);
          document.getElementById("User_Image_Cropper_Modal").close();
        },
        "image/jpeg",
        1
      );
    };
  };

  // Cleanup the image source object URL when component unmounts or imageSrc changes
  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  return (
    <div>
      {/* Avatar Display Section */}
      <div className="pt-5">
        {/* Display avatars in a flex container with responsive behavior */}
        <div className="flex flex-col sm:flex-row sm:gap-5 items-center sm:items-end sm:justify-start  gap-4">
          {/* First Avatar (Largest) */}
          <div className="w-32 h-32 rounded-lg shadow-lg overflow-hidden cursor-pointer">
            <img
              src={profileImage}
              alt="User Profile"
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
            />
          </div>

          {/* Second Avatar */}
          <div className="w-20 h-20 rounded-lg shadow-lg overflow-hidden cursor-pointer">
            <img
              src={profileImage}
              alt="User Profile"
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
            />
          </div>

          {/* Third Avatar (Circular) */}
          <div className="w-20 h-20 rounded-full shadow-lg overflow-hidden cursor-pointer">
            <img
              src={profileImage}
              alt="User Profile"
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
            />
          </div>

          {/* Button to open the image upload modal */}
          <div className="flex md:hidden lg:flex">
            <CommonButton
              clickEvent={() =>
                document.getElementById("User_Image_Modal").showModal()
              }
              text="Select Avatar Image"
              bgColor="blue"
              className="mt-4 sm:mt-0"
            />
          </div>
        </div>

        <div className="hidden md:flex lg:hidden pt-4">
          <CommonButton
            clickEvent={() =>
              document.getElementById("User_Image_Modal").showModal()
            }
            text="Select Avatar Image"
            bgColor="blue"
            className="mt-4 sm:mt-0"
          />
        </div>
      </div>

      {/* Modal for Image Upload */}
      <dialog id="User_Image_Modal" className="modal">
        <div className="modal-box p-0 bg-gradient-to-b from-white to-gray-300 text-black min-w-full sm:min-w-3xl min-h-[400px]">
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
            <h3 className="font-bold text-lg">User Image</h3>
            <ImCross
              className="text-xl hover:text-[#F72C5B] cursor-pointer"
              onClick={() => {
                document.getElementById("User_Image_Modal")?.close();
                resetState(); // Reset everything when modal is closed
              }}
            />
          </div>

          {/* Image Preview & Upload */}
          <div className="w-[200px] sm:w-[250px] h-[200px] sm:h-[250px] rounded-full mx-auto border-2 border-dashed border-gray-500 flex items-center justify-center relative overflow-hidden hover:scale-105 transition-all duration-300">
            {/* Show image preview if available */}
            {imageSrc && !showCropper ? (
              <img
                src={imageSrc}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <FiCamera size={40} />
                <p>Click to Upload</p>
              </div>
            )}
            {/* File input overlaid on preview */}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </dialog>

      {/* Cropper Modal */}
      <dialog id="User_Image_Cropper_Modal" className="modal">
        <div className="modal-box bg-gradient-to-b from-white to-gray-300 text-black min-w-full sm:min-w-3xl p-3">
          {/* Cropper container */}
          <div className="relative h-96 w-full mx-auto">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1 / 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Cropper Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0 sm:space-x-4 gap-4 w-full">
            {/* Zoom control slider */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
              <label className="text-gray-700">Zoom:</label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="ml-2 w-full sm:w-auto"
              />
            </div>

            {/* Cancel and Save buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Cancel: closes crop modal and reopens upload modal */}
              <CommonButton
                text="Cancel"
                bgColor="gray"
                clickEvent={() => {
                  setShowCropper(false);
                  document.getElementById("User_Image_Cropper_Modal").close();
                  document.getElementById("User_Image_Modal").showModal();
                  resetState(); // Reset everything when cancelled
                }}
              />
              {/* Save: crops the image and closes all modals */}
              <CommonButton
                text="Save Profile Image"
                bgColor="green"
                clickEvent={getCroppedImage}
              />
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

AvatarSelector.propTypes = {
  profileImage: PropTypes.string,
  setProfileImage: PropTypes.func.isRequired,
  setProfileImageFile: PropTypes.func.isRequired,
};

export default AvatarSelector;
