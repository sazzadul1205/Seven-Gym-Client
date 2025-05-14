import { useState, useCallback, useEffect } from "react";

// Import Package
import PropTypes from "prop-types";
import Cropper from "react-easy-crop";

// Import Icons
import { FiCamera } from "react-icons/fi";

// import Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// ImageCropper component
const ImageCropper = ({ onImageCropped, defaultImageUrl }) => {
  // State for image cropping and manipulation

  // Controls zoom level of the cropper
  const [zoom, setZoom] = useState(1);

  // Rotation angle for image
  const [rotation, setRotation] = useState(0);

  // Holds selected image data URL
  const [imageSrc, setImageSrc] = useState(null);

  // Stores pixel crop area data
  const [cropArea, setCropArea] = useState(null);

  // Crop position
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  // Toggle cropper modal
  const [showCropper, setShowCropper] = useState(false);

  // Final cropped image blob URL
  const [croppedImage, setCroppedImage] = useState(null);

  // If a default image exists and no cropped image has been selected, show default
  useEffect(() => {
    if (defaultImageUrl && !croppedImage) {
      setCroppedImage(defaultImageUrl);
    }
  }, [defaultImageUrl, croppedImage]);

  // Handle image file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        // Set image to be cropped
        setImageSrc(fileReader.result);
        // Show cropper modal
        setShowCropper(true);
      };
      // Read image as base64 string
      fileReader.readAsDataURL(file);
    }
  };

  // Callback function when cropping is done (internally by Cropper)
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCropArea(croppedAreaPixels); // Save cropped pixel area
  }, []);

  // Generate cropped image blob and set preview
  const getCroppedImage = async () => {
    if (!imageSrc || !cropArea) return;

    const canvas = document.createElement("canvas"); // Create an off-screen canvas
    const img = document.createElement("img");
    img.src = imageSrc;

    return new Promise((resolve) => {
      img.onload = () => {
        const ctx = canvas.getContext("2d");

        // Scale image dimensions
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;

        // Set canvas to cropped size
        canvas.width = cropArea.width;
        canvas.height = cropArea.height;

        ctx.save(); // Save context state before transformation
        ctx.translate(canvas.width / 2, canvas.height / 2); // Center canvas
        ctx.rotate((rotation * Math.PI) / 180); // Apply rotation
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
        ctx.restore(); // Restore context to original state

        // Convert canvas to blob and return URL
        canvas.toBlob(
          (blob) => {
            const croppedImageUrl = URL.createObjectURL(blob); // Generate URL
            setCroppedImage(croppedImageUrl); // Set as cropped preview
            onImageCropped(blob); // Pass blob to parent
            setShowCropper(false); // Close cropper
            resolve(blob);
          },
          "image/jpeg",
          1 // Full quality
        );
      };
    });
  };

  // Clean up image and blob URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      if (croppedImage && croppedImage !== defaultImageUrl)
        URL.revokeObjectURL(croppedImage);
    };
  }, [imageSrc, croppedImage, defaultImageUrl]);

  // Prevent file input click event from propagating
  const handleFileInputClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      {/* Image Preview Box */}
      <div
        className="w-[250px] h-[250px] rounded-full mx-auto border-2 border-dashed border-gray-500 flex items-center justify-center relative overflow-hidden hover:scale-105 transform transition-transform duration-300 ease-in-out sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px]"
        style={{ backgroundColor: "#f9f9f9" }}
      >
        {/* Show cropped/default image or upload prompt */}
        {(croppedImage || defaultImageUrl) && !showCropper ? (
          <img
            src={croppedImage || defaultImageUrl}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <FiCamera size={40} />
            <p>Click to Upload</p>
          </div>
        )}

        {/* Invisible file input over the image preview area */}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleImageChange}
          onClick={handleFileInputClick} // Prevent event propagation
        />
      </div>

      {/* Cropper Modal Section */}
      {showCropper && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-gray-100 p-5 rounded-lg shadow-lg relative w-full max-w-4xl sm:w-[90%] md:w-[80%] lg:w-[60%]">
            {/* Cropper Viewport */}
            <div className="relative h-96">
              <Cropper
                image={imageSrc} // Image to crop
                crop={crop} // Crop position
                zoom={zoom} // Zoom level
                rotation={rotation} // Rotation
                aspect={1 / 1} // 1:1 aspect ratio for profile
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Controls: Zoom & Action Buttons */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-x-4">
              {/* Zoom Slider */}
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

              {/* Cancel and Save Buttons */}
              <div className="flex space-x-2 gap-4">
                <CommonButton
                  text="Cancel"
                  clickEvent={() => setShowCropper(false)}
                  bgColor="gray"
                  textColor="text-white"
                  px="px-4"
                  py="py-2"
                  width="[100px]"
                  borderRadius="rounded-lg"
                />

                <CommonButton
                  text="Save"
                  clickEvent={(e) => {
                    e.preventDefault();
                    getCroppedImage();
                  }}
                  bgColor="OriginalRed"
                  textColor="text-white"
                  px="px-4"
                  py="py-2"
                  width="[100px]"
                  borderRadius="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Define prop types for validation
ImageCropper.propTypes = {
  onImageCropped: PropTypes.func.isRequired, // Function to handle cropped image
  defaultImageUrl: PropTypes.string, // Optional default image to show
};

export default ImageCropper;
