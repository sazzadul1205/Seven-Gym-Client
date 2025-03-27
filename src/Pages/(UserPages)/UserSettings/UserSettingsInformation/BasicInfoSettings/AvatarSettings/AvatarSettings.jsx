import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import CommonButton from "../../../../../../Shared/Buttons/CommonButton";
import Cropper from "react-easy-crop";
import { FiCamera } from "react-icons/fi";
import { ImCross } from "react-icons/im";

const AvatarSettings = ({ profileImage, setProfileImage }) => {
  // State for zoom and rotation controls
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // State to store crop area dimensions and image source
  const [cropArea, setCropArea] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  // State to toggle cropper modal visibility
  const [showCropper, setShowCropper] = useState(false);

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

  // Callback on process compleat
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCropArea(croppedAreaPixels);
  }, []);

  // Cropping Function
  const getCroppedImage = async () => {
    if (!imageSrc || !cropArea) return;

    const canvas = document.createElement("canvas");
    const img = document.createElement("img");
    img.src = imageSrc;

    return new Promise((resolve) => {
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        // Calculate the scaling factor between natural and displayed image size
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;

        canvas.width = cropArea.width;
        canvas.height = cropArea.height;

        ctx.save();
        // Center the canvas context and apply rotation
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        // Draw the cropped portion of the image
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

        // Convert canvas to a blob and update the profile image
        canvas.toBlob(
          (blob) => {
            const croppedImageUrl = URL.createObjectURL(blob);
            setProfileImage(croppedImageUrl);
            setShowCropper(false);
            // Close the crop modal once saved
            document.getElementById("User_Image_Cropper_Modal").close();
            resolve(blob);
          },
          "image/jpeg",
          1
        );
      };
    });
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
        {/* Display three avatar styles */}
        <div className="flex items-end gap-5">
          {/* First Avatar (Largest) */}
          <div
            className="w-32 h-32 rounded-lg shadow-lg overflow-hidden cursor-pointer"
            onClick={() =>
              document.getElementById("User_Image_Modal").showModal()
            }
          >
            <img
              src={profileImage}
              alt="User Profile"
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
            />
          </div>

          {/* Second Avatar */}
          <div
            className="w-20 h-20 rounded-lg shadow-lg overflow-hidden cursor-pointer"
            onClick={() =>
              document.getElementById("User_Image_Modal").showModal()
            }
          >
            <img
              src={profileImage}
              alt="User Profile"
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
            />
          </div>

          {/* Third Avatar (Circular) */}
          <div
            className="w-20 h-20 rounded-full shadow-lg overflow-hidden cursor-pointer"
            onClick={() =>
              document.getElementById("User_Image_Modal").showModal()
            }
          >
            <img
              src={profileImage}
              alt="User Profile"
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
            />
          </div>

          {/* Button to open the image upload modal */}
          <CommonButton
            clickEvent={() =>
              document.getElementById("User_Image_Modal").showModal()
            }
            text="Select Avatar Image"
            bgColor="blue"
          />
        </div>
      </div>

      {/* Modal for Image Upload */}
      <dialog id="User_Image_Modal" className="modal">
        <div className="modal-box p-0 bg-gradient-to-b from-white to-gray-300 text-black min-w-3xl min-h-[400px]">
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
            <h3 className="font-bold text-lg">User Image</h3>
            <ImCross
              className="text-xl hover:text-[#F72C5B] cursor-pointer"
              onClick={() =>
                document.getElementById("User_Image_Modal")?.close()
              }
            />
          </div>

          {/* Image Preview & Upload */}
          <div className="w-[250px] h-[250px] rounded-full mx-auto border-2 border-dashed border-gray-500 flex items-center justify-center relative overflow-hidden hover:scale-105">
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
        <div className="modal-box bg-gradient-to-b from-white to-gray-300 text-black min-w-3xl p-3">
          {/* Cropper container */}
          <div className="relative h-96">
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
          <div className="flex justify-between items-center mt-4 space-x-4">
            {/* Zoom control slider */}
            <div>
              <label className="text-gray-700">Zoom:</label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="ml-2"
              />
            </div>

            {/* Cancel and Save buttons */}
            <div className="flex space-x-2 gap-4">
              {/* Cancel: closes crop modal and reopens upload modal */}
              <CommonButton
                text="Cancel"
                bgColor="gray"
                clickEvent={() => {
                  setShowCropper(false);
                  document.getElementById("User_Image_Cropper_Modal").close();
                  document.getElementById("User_Image_Modal").showModal();
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

AvatarSettings.propTypes = {
  profileImage: PropTypes.string,
  setProfileImage: PropTypes.func.isRequired,
};

export default AvatarSettings;
