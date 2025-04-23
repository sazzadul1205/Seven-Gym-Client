import { useState, useCallback, useEffect } from "react";

// Import Package
import PropTypes from "prop-types";
import Cropper from "react-easy-crop";

// Import Icons
import { FiCamera } from "react-icons/fi";

const ImageCropper = ({ onImageCropped }) => {
  // State for image cropping
  const [zoom, setZoom] = useState(1); // Zoom level
  const [rotation, setRotation] = useState(0); // Rotation angle
  const [imageSrc, setImageSrc] = useState(null); // Stores image URL for cropper
  const [cropArea, setCropArea] = useState(null); // Cropped area in pixels
  const [crop, setCrop] = useState({ x: 0, y: 0 }); // Crop position
  const [showCropper, setShowCropper] = useState(false); // Show/hide cropper
  const [croppedImage, setCroppedImage] = useState(null); // Store cropped image data

  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setImageSrc(fileReader.result); // Convert file to data URL
        setShowCropper(true);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Handle crop completion
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCropArea(croppedAreaPixels);
  }, []);

  // Generate cropped image
  const getCroppedImage = async () => {
    if (!imageSrc || !cropArea) return;

    const canvas = document.createElement("canvas");
    const img = document.createElement("img");
    img.src = imageSrc;

    return new Promise((resolve) => {
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

        // Convert canvas to image blob and update preview
        canvas.toBlob(
          (blob) => {
            const croppedImageUrl = URL.createObjectURL(blob);
            setCroppedImage(croppedImageUrl); // Update cropped image
            onImageCropped(blob); // Notify parent with cropped image
            setShowCropper(false); // Hide cropper after saving
            resolve(blob);
          },
          "image/jpeg",
          1
        );
      };
    });
  };

  // Clean up URL when unmounting
  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      if (croppedImage) URL.revokeObjectURL(croppedImage); // Clean up cropped image URL
    };
  }, [imageSrc, croppedImage]);

  return (
    <div>
      {/* Image Preview & Upload */}
      <div
        className="w-[250px] h-[250px] rounded-full mx-auto border-2 border-dashed border-gray-500 flex items-center justify-center relative overflow-hidden hover:scale-105 sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px]"
        style={{ backgroundColor: "#f9f9f9" }}
      >
        {/* Display cropped image if available, else show upload icon */}
        {croppedImage && !showCropper ? (
          <img
            src={croppedImage}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <FiCamera size={40} />
            <p>Click to Upload</p>
          </div>
        )}
        {/* Hidden input field */}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleImageChange}
        />
      </div>

      {/* Cropper Modal */}
      <div className="relative">
        {showCropper && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
            <div className="bg-gray-100 p-5 rounded-lg shadow-lg relative w-full max-w-4xl sm:w-[90%] md:w-[80%] lg:w-[60%]">
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
              <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-x-4">
                {/* Zoom Control */}
                <div className="flex items-center">
                  <label className="text-gray-700 text-sm">Zoom:</label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="ml-2 w-24 sm:w-32 md:w-48"
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-2 gap-4">
                  <button
                    className="bg-gray-500 hover:bg-gray-300 text-white px-4 py-2 rounded-lg w-[100px] cursor-pointer"
                    onClick={() => setShowCropper(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[#b8264a] hover:bg-[#fc003f] text-white px-4 py-2 rounded-lg w-[100px] cursor-pointer"
                    onClick={getCroppedImage}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ImageCropper.propTypes = {
  onImageCropped: PropTypes.func.isRequired,
};

export default ImageCropper;
